+++
title = "3. Automating Nginx Installation with Custom Data Scripts"
weight = 3
date = 2024-11-25
draft = false
+++

## Overview

This exercise introduces the use of **custom data scripts** to automate the installation of Nginx during VM provisioning. You will also edit the default Nginx index page to display custom content.

### Step 1: Log in to Azure Portal

1. Open a web browser and navigate to the [Azure Portal](https://portal.azure.com/).
2. Sign in using your Azure account credentials.

### Step 2: Create a Virtual Machine with Custom Data
1. Navigate to **Virtual Machines** in the Azure Portal and click **Create** > **Virtual machine**.
2. Configure the VM:
   - **Subscription**: Select your subscription.
   - **Create a new Resource Group**: `LabCustomDataRG`.
   - **Virtual Machine Name**: `LabCustomDataVM`.
   - **Region**: Same as the resource group.
   - **Zone options**: Select _Azure-selected zone_
   - **Image**: Select `Ubuntu Server 24.04 LTS`.
   - **Size**: Choose `Standard_B1s`.
   - **Authentication Type**: Select **SSH Public Key**.
   - **Username**: `azureuser`.
   - **SSH Public Key Source**: Use an existing SSH key or generate a new one.
   - **Allow selected ports** and select **HTTP (80)** and **SSH (22)**.
3. Under **Advanced** > **Custom Data**, paste the content:

   ```bash
   #!/bin/bash
   apt update
   apt install nginx -y
   ```

4. Click **Review + Create**, and then **Create**.

> 💡 **Information**
>
> The **Custom Data** field allows you to execute a script during the initial boot of the VM, automating configurations and software installations.
>
> This script:
>
> - Updates the system's package list (`apt update`).
> - Installs the Nginx web server (`apt install nginx -y`).
>
> It is important that you 1) don´t use `sudo` 2) make sure it is _non-interactive_ 3) use a shebang

> ✅ **Verification Step:**
>
> Open a browser and go to the `<VM_Public_IP>`. You should see the **"Welcome to Nginx!"** default page. This might take a minute, so be patient and refresh the page.


### Step 3: Edit the Nginx Default Page

1. Connect to the VM using SSH:

   ```bash
   ssh -i <private-key> azureuser@<VM_Public_IP>
   ```
   - Replace `<private-key>` with your private key file.
   - Replace `<VM_Public_IP>` with the VM's public IP address.
   - Don´t forget to `chmod 400` the key if you are on Mac or Linux

2. Navigate to the Nginx _root_ directory:

   ```bash
   cd /var/www/html/
   ```

3. Open `index.nginx-debian.html` in a text editor:

   ```bash
   sudo nano index.nginx-debian.html
   ```
3. Modify the content (e.g., add "Hello World" to the `<h1>` tag).
4. Save and exit by pressing `Ctrl+x`, `y`, and `Enter`.

> ✅ **Verification Step:**
>
> Refresh the page in your browser or rerun the `curl localhost` command to see the updated content.

### Step 4: Clean Up Resources (Optional)
1. In the Azure Portal, go to **Resource Groups** and locate `LabSSHResourceGroup`.
2. Click **Delete resource group**.

## Exercise Complete!
You have successfully automated the installation of Nginx using a custom data script and edited the default web page to display custom content.
