+++
title = "2. Provisioning a VM with SSH Keys and Exploring Linux"
weight = 2
date = 2024-11-25
draft = false
hidden = true
+++

## Overview

This exercise introduces secure SSH authentication using **Azure Portal's Generate Key Pair feature**. You will also connect to the VM using SSH from your local (your laptop) Terminal. While logged in we will explore the Linux filesystem with basic command-line utilities.

### Step 1: Log in to Azure Portal

1. Open a web browser and navigate to the [Azure Portal](https://portal.azure.com/).
2. Sign in using your Azure account credentials.

### Step 2: Create a Virtual Machine with SSH Key Pair

1. Navigate to **Virtual Machines** and click **Create** > **Azure Virtual machine**.
2. Configure the VM:
   - **Subscription**: Select your subscription.
   - **Create a new Resource Group**: `LabSSHResourceGroup`. (You can create a new resource group here if you don´t have one already)
   - **Virtual Machine Name**: `LabSSHVM`.
   - **Region**: Same as the resource group.
   - **Zone options**: Select _Azure-selected zone_
   - **Image**: Select `Ubuntu Server 24.04 LTS`.
   - **Size**: Choose `Standard_B1s`.
   - **Authentication Type**: Select **SSH Public Key**.
   - **Username**: `azureuser`.
3. Under **SSH Public Key Source**, select **Generate new key pair**.
4. Configure inbound ports:
   - Check **Allow selected ports** and select **HTTP (80)** and **SSH (22)**.
5. Note the name for your key pair (e.g., `LabSSHKey`) and click **Download private key and create resource**.

> 💡 **Information**
>
> The **Generate new key pair** option allows you to securely create an SSH key pair. The private key will be downloaded to your computer and should be stored securely. Azure automatically applies the corresponding public key to the VM.

### Step 3: Secure the SSH Private Key (Only Mac And Linux Users)

1. Locate the downloaded private key file (e.g., `LabSSHKey.pem`) on your local machine.
2. Open the Terminal and change file permissions (only Mac/Linux Users)

   ```bash
   chmod 400 ~/Downloads/LabSSHKey.pem
   ```

   > 💡 **Information**
   >
   > The `chmod 400` command restricts permissions on the private key file, ensuring it is readable only by the file's owner. This is required for secure SSH connections. Failure to set these permissions will result in SSH errors.
   >
   > Make sure the key is in the Downloads folder. Otherwise you need to adjust the command above accordingly.


### Step 4: Connect to the VM

1. In the Azure Portal, navigate to your VM's **Overview** tab and copy the public IP address of `LabSSHVM`.
2. Open your terminal:
   - **Windows**: Use **Git Bash**.
   - **Mac/Linux**: Use your default terminal.
3. Connect to the VM using SSH:

   ```bash
   ssh -i ~/Downloads/LabSSHKey.pem azureuser@<VM_Public_IP>
   ```
   - Replace `<VM_Public_IP>` with the public IP address you copied.
   - On Windows you might need to use the absolute path for the key. You can usually do that by drag-and-drop the key `LabSSHKey.pem` from the file explorer into the Terminal

	> ✅ **Verification Step:**
	>
	> Ensure you are logged into the VM and see the `azureuser@LabSSHVM` prompt.

### Step 5: Explore the Linux Filesystem

1. List the contents of the root directory:

   ```bash
   ls /
   ```
   - Key directories:
     - `/home`: User home directories.
     - `/etc`: Configuration files.
     - `/var`: Logs and variable data.

2. Check your current working directory:

   ```bash
   pwd
   ```

> 💡 **Information**
>
> The Linux filesystem is hierarchical, starting from `/` (root).


### Step 6: Create and Execute a Bash Script to Install Nginx

1. **Create the Bash Script**:
   - While logged into the VM, create a new script file:

     ```bash
     nano install_nginx.sh
     ```
   - Add the following content to the file:

     ```bash
     #!/bin/bash
     apt update
     apt install nginx -y
     ```

   - Save and exit by pressing `CTRL+X`, `y`,  `Enter`.

2. **Make the Script Executable**:

   ```bash
   chmod +x install_nginx.sh
   ```

3. **Run the Script with Elevated Privileges**:

   ```bash
   sudo ./install_nginx.sh
   ```

4. **Verify the Installation**:

   - Check if Nginx is running:

     ```bash
     systemctl status nginx
     ```
     Ensure the status shows `active (running)`.

   - Test Nginx using `curl`:

     ```bash
     curl localhost
     ```
     The output should include the default Nginx HTML content, such as `Welcome to nginx!`.

> 💡 **Information**
>
> **Systemctl and the Init System**
>
> The `systemctl` command is used to interact with the system's **init system** (often `systemd` on modern Linux distributions). It is responsible for managing services, such as starting, stopping, enabling, or checking the status of services like Nginx.
> - `start`: Starts the service immediately.
> - `enable`: Configures the service to start automatically at boot.
> - `status`: Displays the current status of the service.


### Step 7: Clean Up Resources (Optional)
1. In the Azure Portal, go to **Resource Groups** and locate `LabSSHResourceGroup`.
2. Click **Delete resource group**.

## Exercise Complete!
You have successfully provisioned a VM using Azure's Generate Key Pair feature, connected securely using SSH, and explored the Linux filesystem and basic commands.
