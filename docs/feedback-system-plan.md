# Feedback System Implementation Plan

A serverless feedback system for the DevOps PM documentation site that creates GitHub Issues from user feedback in a private repository.

---

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────────────┐
│   Hugo Site     │     │  Azure Function  │     │  GitHub Issues          │
│                 │     │                  │     │  (Private Repo)         │
│ [Feedback Btn]  │────▶│ - Validate       │────▶│ - Create Issue          │
│ [Modal Form]    │ POST│ - Rate Limit     │ API │ - Label by page         │
│ [JS Client]     │     │   (Table Store)  │     │ - Track/Close           │
└─────────────────┘     │ - Honeypot Check │     └─────────────────────────┘
                        │ - Sanitize Input │
                        └──────────────────┘
                                │
                        ┌───────┴───────┐
                        │ Azure Table   │
                        │ Storage       │
                        │ (Rate Limits) │
                        └───────────────┘
```

---

## Prerequisites

- Azure subscription (pay-as-you-go)
- GitHub account with access to the repository
- Azure CLI installed and authenticated
- Azure Functions Core Tools (`npm install -g azure-functions-core-tools@4`)
- Node.js 18+ installed (for local testing)
- GitHub CLI (`gh`) installed

---

## Part 1: GitHub Setup

### Step 1.1: Create Private Feedback Repository

Create a private repository to store feedback issues:

```bash
gh repo create Become-A-DevOps-PM-IPL25-feedback \
  --private \
  --description "Private feedback collection for DevOps PM IPL25 course"
```

### Step 1.2: Create a Fine-Grained Personal Access Token

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens
2. Click "Generate new token"
3. Configure:
   - **Token name:** `feedback-system-ipl25`
   - **Expiration:** 90 days (or custom)
   - **Repository access:** Select "Only select repositories" → choose `Become-A-DevOps-PM-IPL25-feedback`
   - **Permissions:**
     - Repository permissions → Issues → Read and write
4. Click "Generate token"
5. **Copy the token immediately** - you won't see it again

### Step 1.3: Create "feedback" Label

```bash
gh label create feedback \
  --repo YOUR_GITHUB_USERNAME/Become-A-DevOps-PM-IPL25-feedback \
  --description "User feedback from documentation site" \
  --color "0E8A16"
```

---

## Part 2: Azure Infrastructure (Bicep)

### Step 2.1: Create Bicep Template

Create `infra/feedback-system/main.bicep`:

```bicep
@description('Location for all resources')
param location string = 'swedencentral'

@description('Unique suffix for globally unique resource names')
param uniqueSuffix string = uniqueString(resourceGroup().id)

@description('GitHub Personal Access Token')
@secure()
param githubToken string

@description('GitHub repository owner')
param githubOwner string

@description('GitHub repository name for feedback issues')
param githubRepo string = 'Become-A-DevOps-PM-IPL25-feedback'

@description('Allowed origin for CORS')
param allowedOrigin string = 'https://devops-pm-25.educ8.se'

// Storage Account (for Functions and Table Storage)
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: 'stfeedback${uniqueSuffix}'
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    minimumTlsVersion: 'TLS1_2'
    supportsHttpsTrafficOnly: true
  }
}

// Table Storage for rate limiting
resource tableService 'Microsoft.Storage/storageAccounts/tableServices@2023-01-01' = {
  parent: storageAccount
  name: 'default'
}

resource rateLimitTable 'Microsoft.Storage/storageAccounts/tableServices/tables@2023-01-01' = {
  parent: tableService
  name: 'ratelimits'
}

// App Service Plan (Consumption)
resource hostingPlan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name: 'plan-feedback-${uniqueSuffix}'
  location: location
  sku: {
    name: 'Y1'
    tier: 'Dynamic'
  }
  properties: {
    reserved: false
  }
}

// Function App
resource functionApp 'Microsoft.Web/sites@2023-01-01' = {
  name: 'func-feedback-${uniqueSuffix}'
  location: location
  kind: 'functionapp'
  properties: {
    serverFarmId: hostingPlan.id
    httpsOnly: true
    siteConfig: {
      nodeVersion: '~20'
      cors: {
        allowedOrigins: [
          allowedOrigin
        ]
      }
      appSettings: [
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};EndpointSuffix=${environment().suffixes.storage};AccountKey=${storageAccount.listKeys().keys[0].value}'
        }
        {
          name: 'WEBSITE_CONTENTAZUREFILECONNECTIONSTRING'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};EndpointSuffix=${environment().suffixes.storage};AccountKey=${storageAccount.listKeys().keys[0].value}'
        }
        {
          name: 'WEBSITE_CONTENTSHARE'
          value: toLower('func-feedback-${uniqueSuffix}')
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4'
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'node'
        }
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~20'
        }
        {
          name: 'GITHUB_TOKEN'
          value: githubToken
        }
        {
          name: 'GITHUB_OWNER'
          value: githubOwner
        }
        {
          name: 'GITHUB_REPO'
          value: githubRepo
        }
        {
          name: 'RATE_LIMIT_MAX'
          value: '5'
        }
        {
          name: 'RATE_LIMIT_WINDOW_MINUTES'
          value: '60'
        }
        {
          name: 'AZURE_STORAGE_CONNECTION_STRING'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};EndpointSuffix=${environment().suffixes.storage};AccountKey=${storageAccount.listKeys().keys[0].value}'
        }
      ]
    }
  }
}

// Outputs
output functionAppName string = functionApp.name
output functionAppUrl string = 'https://${functionApp.properties.defaultHostName}'
output storageAccountName string = storageAccount.name
```

### Step 2.2: Create Parameters File

Create `infra/feedback-system/main.parameters.json`:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "githubOwner": {
      "value": "YOUR_GITHUB_USERNAME"
    },
    "githubRepo": {
      "value": "Become-A-DevOps-PM-IPL25-feedback"
    },
    "allowedOrigin": {
      "value": "https://devops-pm-25.educ8.se"
    }
  }
}
```

### Step 2.3: Deploy Infrastructure

```bash
# Create resource group
az group create \
  --name rg-feedback-ipl25 \
  --location swedencentral

# Deploy Bicep template (will prompt for githubToken)
az deployment group create \
  --resource-group rg-feedback-ipl25 \
  --template-file infra/feedback-system/main.bicep \
  --parameters @infra/feedback-system/main.parameters.json \
  --parameters githubToken='YOUR_GITHUB_TOKEN'

# Get outputs
az deployment group show \
  --resource-group rg-feedback-ipl25 \
  --name main \
  --query properties.outputs
```

---

## Part 3: Azure Function Code

### Step 3.1: Project Structure

Create the following structure locally:

```
feedback-function/
├── host.json
├── package.json
├── .gitignore
└── src/
    └── functions/
        └── submitFeedback.js
```

### Step 3.2: .gitignore

```
node_modules/
local.settings.json
.env
```

### Step 3.3: host.json

```json
{
  "version": "2.0",
  "logging": {
    "applicationInsights": {
      "samplingSettings": {
        "isEnabled": true,
        "excludedTypes": "Request"
      }
    }
  },
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle",
    "version": "[4.*, 5.0.0)"
  }
}
```

### Step 3.4: package.json

```json
{
  "name": "feedback-function",
  "version": "1.0.0",
  "main": "src/functions/*.js",
  "scripts": {
    "start": "func start"
  },
  "dependencies": {
    "@azure/functions": "^4.0.0",
    "@azure/data-tables": "^13.2.2"
  }
}
```

### Step 3.5: submitFeedback.js

```javascript
const { app } = require('@azure/functions');
const { TableClient } = require('@azure/data-tables');

// Initialize Table Client for rate limiting
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const tableClient = TableClient.fromConnectionString(connectionString, 'ratelimits');

app.http('submitFeedback', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            // Parse request body
            const body = await request.json();
            const { pageUrl, pageTitle, feedback, honeypot, formLoadTime } = body;

            // Get client IP
            const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                           request.headers.get('x-client-ip') ||
                           'unknown';

            // Security Check 1: Honeypot field
            if (honeypot && honeypot.trim() !== '') {
                context.log('Honeypot triggered - bot detected');
                return {
                    status: 200, // Return 200 to not reveal detection
                    jsonBody: { success: true, message: 'Thank you for your feedback!' }
                };
            }

            // Security Check 2: Time-based validation
            const currentTime = Date.now();
            const submissionTime = (currentTime - formLoadTime) / 1000; // seconds

            if (submissionTime < 3) {
                context.log(`Submission too fast: ${submissionTime}s - bot detected`);
                return {
                    status: 200,
                    jsonBody: { success: true, message: 'Thank you for your feedback!' }
                };
            }

            if (submissionTime > 1800) { // 30 minutes
                return {
                    status: 400,
                    jsonBody: { success: false, message: 'Form expired. Please refresh and try again.' }
                };
            }

            // Security Check 3: Rate limiting with Azure Table Storage
            const rateLimitMax = parseInt(process.env.RATE_LIMIT_MAX) || 5;
            const rateLimitWindow = parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES) || 60;
            const windowMs = rateLimitWindow * 60 * 1000;

            // Create a safe partition key from IP (replace invalid characters)
            const partitionKey = 'ratelimit';
            const rowKey = clientIp.replace(/[\/\\#?]/g, '_');

            try {
                const entity = await tableClient.getEntity(partitionKey, rowKey);
                const resetTime = new Date(entity.resetTime).getTime();
                const now = Date.now();

                if (now > resetTime) {
                    // Window expired, reset counter
                    await tableClient.upsertEntity({
                        partitionKey,
                        rowKey,
                        count: 1,
                        resetTime: new Date(now + windowMs).toISOString()
                    });
                } else if (entity.count >= rateLimitMax) {
                    return {
                        status: 429,
                        jsonBody: {
                            success: false,
                            message: 'Too many submissions. Please try again later.'
                        }
                    };
                } else {
                    // Increment counter
                    await tableClient.upsertEntity({
                        partitionKey,
                        rowKey,
                        count: entity.count + 1,
                        resetTime: entity.resetTime
                    });
                }
            } catch (error) {
                if (error.statusCode === 404) {
                    // First request from this IP
                    await tableClient.upsertEntity({
                        partitionKey,
                        rowKey,
                        count: 1,
                        resetTime: new Date(Date.now() + windowMs).toISOString()
                    });
                } else {
                    context.error('Rate limit check failed:', error);
                    // Continue anyway - don't block users due to storage issues
                }
            }

            // Validate required fields
            if (!feedback || feedback.trim() === '') {
                return {
                    status: 400,
                    jsonBody: { success: false, message: 'Feedback text is required.' }
                };
            }

            if (feedback.length > 5000) {
                return {
                    status: 400,
                    jsonBody: { success: false, message: 'Feedback is too long (max 5000 characters).' }
                };
            }

            // Sanitize feedback text (basic sanitization)
            const sanitizedFeedback = feedback
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .trim();

            // Validate pageUrl is from expected domain
            const allowedDomains = ['devops-pm-25.educ8.se', 'localhost'];
            let isValidDomain = false;
            try {
                const url = new URL(pageUrl);
                isValidDomain = allowedDomains.some(domain =>
                    url.hostname === domain || url.hostname.endsWith('.' + domain)
                );
            } catch (e) {
                isValidDomain = false;
            }

            if (!isValidDomain) {
                context.log(`Invalid domain in pageUrl: ${pageUrl}`);
                return {
                    status: 400,
                    jsonBody: { success: false, message: 'Invalid page URL.' }
                };
            }

            // Create GitHub Issue
            const githubToken = process.env.GITHUB_TOKEN;
            const githubOwner = process.env.GITHUB_OWNER;
            const githubRepo = process.env.GITHUB_REPO;

            // Extract page path for label
            let pagePath = 'unknown';
            try {
                const url = new URL(pageUrl);
                pagePath = url.pathname || '/';
            } catch (e) {
                pagePath = pageUrl;
            }

            const issueTitle = `Feedback: ${pageTitle || pagePath}`;
            const issueBody = `## Page Information
- **URL:** ${pageUrl}
- **Title:** ${pageTitle || 'N/A'}

## Feedback
${sanitizedFeedback}

---
*Submitted via feedback form*`;

            const response = await fetch(
                `https://api.github.com/repos/${githubOwner}/${githubRepo}/issues`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${githubToken}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json',
                        'User-Agent': 'Feedback-Function'
                    },
                    body: JSON.stringify({
                        title: issueTitle,
                        body: issueBody,
                        labels: ['feedback']
                    })
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                context.error(`GitHub API error: ${response.status} - ${errorText}`);
                return {
                    status: 500,
                    jsonBody: { success: false, message: 'Failed to submit feedback. Please try again.' }
                };
            }

            const issue = await response.json();
            context.log(`Created GitHub issue #${issue.number}`);

            return {
                status: 200,
                jsonBody: {
                    success: true,
                    message: 'Thank you for your feedback!'
                }
            };

        } catch (error) {
            context.error('Error processing feedback:', error);
            return {
                status: 500,
                jsonBody: { success: false, message: 'An error occurred. Please try again.' }
            };
        }
    }
});
```

### Step 3.6: Deploy Function

```bash
cd feedback-function

# Install dependencies
npm install

# Get function app name from deployment output
FUNC_APP_NAME=$(az deployment group show \
  --resource-group rg-feedback-ipl25 \
  --name main \
  --query properties.outputs.functionAppName.value \
  --output tsv)

# Deploy to Azure
func azure functionapp publish $FUNC_APP_NAME
```

### Step 3.7: Get Function URL

```bash
# Get the base URL
az deployment group show \
  --resource-group rg-feedback-ipl25 \
  --name main \
  --query properties.outputs.functionAppUrl.value \
  --output tsv
```

The full API endpoint will be: `{functionAppUrl}/api/submitFeedback`

Save this URL for the frontend configuration.

---

## Part 4: Privacy Information Page

### Step 4.1: Create Privacy Information Content

Create `content/privacy-feedback.md`:

```markdown
+++
title = "Feedback Privacy Information"
description = "How we handle your feedback data"
+++

## Feedback Data Collection

When you submit feedback through our documentation site, we collect:

- **Page URL and title** - To understand which page your feedback relates to
- **Your feedback text** - The content you write in the form
- **Submission timestamp** - When you sent the feedback

### What we do NOT collect

- Your name or email address
- Personal identification information
- Browser or device information (beyond basic request headers)

### How we use your feedback

Your feedback is stored as a GitHub Issue in a private repository accessible only to course administrators. We use this feedback to:

- Fix errors in the documentation
- Improve clarity of instructions
- Add missing information
- Enhance the overall learning experience

### Data retention

Feedback is retained for the duration of the course and may be archived afterward for course improvement purposes.

### Your rights

As this is anonymous feedback, we cannot identify or retrieve specific submissions. If you need to provide identifiable feedback or have specific data requests, please contact the course administration directly.

### Contact

For questions about data handling, contact the course administration through official channels.
```

---

## Part 5: Frontend Implementation

### Step 5.1: Create JavaScript File

Create `static/js/feedback.js`:

```javascript
(function() {
    'use strict';

    // Configuration - Update this URL after deployment
    const FEEDBACK_API_URL = 'https://func-feedback-UNIQUESUFFIX.azurewebsites.net/api/submitFeedback';

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
            const feedbackTrigger = e.target.closest('[data-feedback-trigger]');
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
```

### Step 5.2: Update Existing Feedback Button

The feedback button is already defined in `hugo.toml` as a menu shortcut:

```toml
[[menu.shortcuts]]
  name = "<i class='fa fa-comment'></i> Feedback"
  url = "#"
  weight = 10
```

Hugo's menu system doesn't support custom data attributes directly, so we need to create a partial override to add the `data-feedback-trigger` attribute.

**Option A: Override the shortcut menu partial**

First, find the theme's shortcut menu template:
```bash
ls themes/docdock/layouts/partials/ | grep -i menu
```

Then create an override that adds the data attribute. Create `layouts/partials/menu-shortcut.html` (or the appropriate filename):

```html
{{ range .Site.Menus.shortcuts }}
  <li>
    {{ if hasPrefix .Name "Feedback" }}
    <a href="{{ .URL }}" data-feedback-trigger>
    {{ else }}
    <a href="{{ .URL }}">
    {{ end }}
      {{ .Name }}
    </a>
  </li>
{{ end }}
```

**Option B: Use JavaScript detection (simpler)**

If creating a partial override is complex, update the JavaScript to detect the existing button more reliably. In `static/js/feedback.js`, replace the click handler:

```javascript
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
```

This approach works with the existing menu configuration without requiring theme overrides.

### Step 5.3: Include JavaScript in Hugo

Create or update `layouts/partials/flex/scripts.html` to include the feedback script:

```html
{{ partial "original/scripts.html" . }}
<script src="{{ "js/feedback.js" | relURL }}"></script>
```

---

## Part 6: Testing

### Step 6.1: Local Function Testing

```bash
cd feedback-function

# Create local.settings.json for local testing
cat > local.settings.json << 'EOF'
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "GITHUB_TOKEN": "YOUR_TOKEN",
    "GITHUB_OWNER": "YOUR_USERNAME",
    "GITHUB_REPO": "Become-A-DevOps-PM-IPL25-feedback",
    "RATE_LIMIT_MAX": "5",
    "RATE_LIMIT_WINDOW_MINUTES": "60",
    "AZURE_STORAGE_CONNECTION_STRING": "UseDevelopmentStorage=true"
  }
}
EOF

# Start Azurite for local table storage (requires Azurite installed)
azurite --silent &

# Start local function
func start

# Test with curl (basic submission)
curl -X POST http://localhost:7071/api/submitFeedback \
  -H "Content-Type: application/json" \
  -d '{
    "pageUrl": "https://devops-pm-25.educ8.se/getting-started/",
    "pageTitle": "Getting Started",
    "feedback": "Test feedback message",
    "honeypot": "",
    "formLoadTime": '"$(($(date +%s) * 1000 - 5000))"'
  }'
```

### Step 6.2: Test Security Features

**Test honeypot:**
```bash
curl -X POST http://localhost:7071/api/submitFeedback \
  -H "Content-Type: application/json" \
  -d '{
    "pageUrl": "https://devops-pm-25.educ8.se/",
    "pageTitle": "Test",
    "feedback": "Bot message",
    "honeypot": "spam-link.com",
    "formLoadTime": '"$(($(date +%s) * 1000 - 5000))"'
  }'
```
Should return success but not create issue.

**Test time-based (too fast):**
```bash
curl -X POST http://localhost:7071/api/submitFeedback \
  -H "Content-Type: application/json" \
  -d '{
    "pageUrl": "https://devops-pm-25.educ8.se/",
    "pageTitle": "Test",
    "feedback": "Fast bot",
    "honeypot": "",
    "formLoadTime": '"$(($(date +%s) * 1000))"'
  }'
```
Should return success but not create issue.

**Test rate limiting:**
Send more than 5 requests quickly - should get 429 on 6th request.

**Test invalid domain:**
```bash
curl -X POST http://localhost:7071/api/submitFeedback \
  -H "Content-Type: application/json" \
  -d '{
    "pageUrl": "https://evil-site.com/",
    "pageTitle": "Test",
    "feedback": "Test",
    "honeypot": "",
    "formLoadTime": '"$(($(date +%s) * 1000 - 5000))"'
  }'
```
Should return error about invalid page URL.

### Step 6.3: Verify GitHub Issues

1. Check the private repository's Issues tab
2. Verify issue created with correct title, body, and label
3. Verify page URL and title are captured correctly

---

## Part 7: Deployment Checklist

### Pre-deployment

- [ ] Private feedback repository created
- [ ] GitHub Personal Access Token created for feedback repo
- [ ] Token has Issues read/write permission
- [ ] Bicep template created
- [ ] Parameters file configured with correct GitHub username
- [ ] Infrastructure deployed to Azure
- [ ] Function URL retrieved

### Deployment

- [ ] Function code dependencies installed
- [ ] Function code deployed to Azure
- [ ] JavaScript file updated with correct API URL
- [ ] JavaScript added to Hugo site
- [ ] Feedback button has `data-feedback-trigger` attribute
- [ ] Privacy information page created
- [ ] Hugo site rebuilt and deployed

### Post-deployment

- [ ] Test feedback submission from live site
- [ ] Verify GitHub issue created in private repo
- [ ] Test honeypot rejection
- [ ] Test rate limiting (check Azure Table Storage)
- [ ] Verify privacy link works
- [ ] Monitor function for errors

---

## Part 8: Maintenance

### Token Renewal

GitHub tokens expire. Set a calendar reminder to:
1. Generate new token before expiration
2. Update Azure Function app settings:

```bash
# Get function app name
FUNC_APP_NAME=$(az deployment group show \
  --resource-group rg-feedback-ipl25 \
  --name main \
  --query properties.outputs.functionAppName.value \
  --output tsv)

# Update token
az functionapp config appsettings set \
  --name $FUNC_APP_NAME \
  --resource-group rg-feedback-ipl25 \
  --settings GITHUB_TOKEN="NEW_TOKEN"
```

### Monitoring

View function logs:

```bash
az webapp log tail \
  --name $FUNC_APP_NAME \
  --resource-group rg-feedback-ipl25
```

Or use Azure Portal → Function App → Monitor

### Cost Estimate

- **Azure Functions Consumption Plan:** First 1 million executions free per month
- **Storage Account:** ~$0.01/month for function state and table storage
- **Total:** Essentially free for this use case

---

## Part 9: Clean Up (When Done with Course)

```bash
# Delete all Azure resources
az group delete --name rg-feedback-ipl25 --yes --no-wait

# Optionally delete the private feedback repository
gh repo delete YOUR_USERNAME/Become-A-DevOps-PM-IPL25-feedback --yes
```

---

## Version 2 Backlog

The following improvements are documented for future consideration but are not included in the initial implementation:

### Monitoring & Operations
- [ ] Add Application Insights for monitoring and alerting
- [ ] Set up alerts for function errors
- [ ] Add dead letter queue for failed submissions
- [ ] Create dashboard for feedback volume tracking

### User Experience
- [ ] Add character counter showing remaining characters
- [ ] Add loading spinner during submission
- [ ] Support dark mode in modal styles
- [ ] Add feedback categories dropdown (error, suggestion, question)

### Accessibility
- [ ] Add `role="dialog"` and `aria-modal="true"` to modal
- [ ] Implement focus trap within modal
- [ ] Add `aria-describedby` for form
- [ ] Add screen reader announcements for success/error

### Security Enhancements
- [ ] Add IP blocking capability for abuse
- [ ] Implement more sophisticated bot detection
- [ ] Add screenshot/image upload capability (requires blob storage)

### Notifications
- [ ] Email notifications on new feedback (SendGrid integration)
- [ ] Slack notifications to course channel
- [ ] Weekly digest of feedback

### Analytics
- [ ] Track feedback volume over time
- [ ] Identify pages with most feedback
- [ ] Sentiment analysis of feedback

---

## Quick Reference: Azure CLI Commands

```bash
# Deploy infrastructure
az group create --name rg-feedback-ipl25 --location swedencentral
az deployment group create \
  --resource-group rg-feedback-ipl25 \
  --template-file infra/feedback-system/main.bicep \
  --parameters @infra/feedback-system/main.parameters.json \
  --parameters githubToken='YOUR_TOKEN'

# Get function app name
FUNC_APP_NAME=$(az deployment group show \
  --resource-group rg-feedback-ipl25 \
  --name main \
  --query properties.outputs.functionAppName.value \
  --output tsv)

# Deploy function code
func azure functionapp publish $FUNC_APP_NAME

# View logs
az webapp log tail --name $FUNC_APP_NAME --resource-group rg-feedback-ipl25

# Update settings
az functionapp config appsettings set \
  --name $FUNC_APP_NAME \
  --resource-group rg-feedback-ipl25 \
  --settings KEY="VALUE"

# Clean up (when done)
az group delete --name rg-feedback-ipl25 --yes --no-wait
```
