(function() {
    'use strict';

    // Configuration
    const FEEDBACK_API_URL = 'https://func-feedback-roisuzmacurw6.azurewebsites.net/api/submitfeedback';

    // Create modal HTML
    function createModal() {
        const modal = document.createElement('div');
        modal.id = 'feedback-modal';
        modal.innerHTML = `
            <div class="feedback-overlay"></div>
            <div class="feedback-dialog">
                <div class="feedback-header">
                    <h3>Send Feedback</h3>
                    <button class="feedback-close" aria-label="Close">&times;</button>
                </div>
                <div class="feedback-body">
                    <div class="feedback-page-info">
                        <strong>Page:</strong> <span id="feedback-page-title"></span>
                    </div>
                    <form id="feedback-form">
                        <textarea
                            id="feedback-text"
                            placeholder="Describe the issue or suggestion..."
                            rows="5"
                            maxlength="5000"
                            required
                        ></textarea>
                        <!-- Honeypot field - hidden from users -->
                        <input
                            type="text"
                            name="website"
                            id="feedback-honeypot"
                            tabindex="-1"
                            autocomplete="off"
                            style="position: absolute; left: -9999px; opacity: 0; height: 0;"
                        >
                        <input type="hidden" id="feedback-load-time">
                        <div class="feedback-privacy">
                            <a href="/privacy-feedback/" target="_blank">Privacy information</a>
                        </div>
                        <div class="feedback-actions">
                            <button type="button" class="feedback-cancel">Cancel</button>
                            <button type="submit" class="feedback-submit">Send Feedback</button>
                        </div>
                    </form>
                    <div id="feedback-message" class="feedback-message"></div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        return modal;
    }

    // Create styles
    function createStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #feedback-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
            }
            #feedback-modal.active {
                display: block;
            }
            .feedback-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
            }
            .feedback-dialog {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #fff;
                border-radius: 8px;
                width: 90%;
                max-width: 500px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            }
            .feedback-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px 20px;
                border-bottom: 1px solid #e0e0e0;
            }
            .feedback-header h3 {
                margin: 0;
                font-size: 18px;
                color: #333;
            }
            .feedback-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #666;
                padding: 0;
                line-height: 1;
            }
            .feedback-close:hover {
                color: #333;
            }
            .feedback-body {
                padding: 20px;
            }
            .feedback-page-info {
                margin-bottom: 16px;
                padding: 10px;
                background: #f5f5f5;
                border-radius: 4px;
                font-size: 14px;
                word-break: break-all;
            }
            #feedback-text {
                width: 100%;
                padding: 12px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-family: inherit;
                font-size: 14px;
                resize: vertical;
                box-sizing: border-box;
            }
            #feedback-text:focus {
                outline: none;
                border-color: #0066cc;
            }
            .feedback-privacy {
                margin-top: 8px;
                font-size: 12px;
            }
            .feedback-privacy a {
                color: #666;
            }
            .feedback-actions {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                margin-top: 16px;
            }
            .feedback-cancel,
            .feedback-submit {
                padding: 10px 20px;
                border-radius: 4px;
                font-size: 14px;
                cursor: pointer;
            }
            .feedback-cancel {
                background: #f0f0f0;
                border: 1px solid #ddd;
                color: #333;
            }
            .feedback-cancel:hover {
                background: #e0e0e0;
            }
            .feedback-submit {
                background: #0066cc;
                border: none;
                color: #fff;
            }
            .feedback-submit:hover {
                background: #0052a3;
            }
            .feedback-submit:disabled {
                background: #ccc;
                cursor: not-allowed;
            }
            .feedback-message {
                margin-top: 16px;
                padding: 10px;
                border-radius: 4px;
                display: none;
            }
            .feedback-message.success {
                display: block;
                background: #d4edda;
                color: #155724;
            }
            .feedback-message.error {
                display: block;
                background: #f8d7da;
                color: #721c24;
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize feedback system
    function init() {
        createStyles();
        const modal = createModal();

        const overlay = modal.querySelector('.feedback-overlay');
        const closeBtn = modal.querySelector('.feedback-close');
        const cancelBtn = modal.querySelector('.feedback-cancel');
        const form = modal.querySelector('#feedback-form');
        const messageEl = modal.querySelector('#feedback-message');
        const submitBtn = modal.querySelector('.feedback-submit');
        const textArea = modal.querySelector('#feedback-text');

        // Open modal when clicking feedback trigger
        document.addEventListener('click', function(e) {
            // Check for data attribute first (preferred)
            let feedbackTrigger = e.target.closest('[data-feedback-trigger]');

            // Fallback: detect the menu shortcut link
            if (!feedbackTrigger) {
                const link = e.target.closest('a[href="#"]');
                if (link && link.innerHTML.includes('Feedback')) {
                    feedbackTrigger = link;
                }
            }

            if (feedbackTrigger) {
                e.preventDefault();
                openModal();
            }
        });

        function openModal() {
            // Set page info
            modal.querySelector('#feedback-page-title').textContent = document.title;

            // Set load time for time-based validation
            modal.querySelector('#feedback-load-time').value = Date.now();

            // Reset form
            form.reset();
            messageEl.className = 'feedback-message';
            messageEl.style.display = 'none';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Feedback';
            textArea.style.display = 'block';
            modal.querySelector('.feedback-actions').style.display = 'flex';
            modal.querySelector('.feedback-privacy').style.display = 'block';

            modal.classList.add('active');
            textArea.focus();
        }

        function closeModal() {
            modal.classList.remove('active');
        }

        // Close handlers
        overlay.addEventListener('click', closeModal);
        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });

        // Form submission
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            const payload = {
                pageUrl: window.location.href,
                pageTitle: document.title,
                feedback: textArea.value.trim(),
                honeypot: modal.querySelector('#feedback-honeypot').value,
                formLoadTime: parseInt(modal.querySelector('#feedback-load-time').value)
            };

            try {
                const response = await fetch(FEEDBACK_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();

                if (result.success) {
                    messageEl.textContent = result.message;
                    messageEl.className = 'feedback-message success';
                    textArea.style.display = 'none';
                    modal.querySelector('.feedback-actions').style.display = 'none';
                    modal.querySelector('.feedback-privacy').style.display = 'none';

                    // Auto-close after 3 seconds
                    setTimeout(closeModal, 3000);
                } else {
                    messageEl.textContent = result.message;
                    messageEl.className = 'feedback-message error';
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Feedback';
                }
            } catch (error) {
                messageEl.textContent = 'Failed to send feedback. Please try again.';
                messageEl.className = 'feedback-message error';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Feedback';
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
