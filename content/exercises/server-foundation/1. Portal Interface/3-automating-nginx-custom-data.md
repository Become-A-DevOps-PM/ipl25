+++
title = "3. Automating Nginx Installation with Custom Data Scripts"
weight = 3
date = 2024-11-25
lastmod = 2025-11-24
draft = false
+++

## Goal

Automate the installation and configuration of Nginx during VM provisioning using Azure custom data scripts, then customize the default web page.

> **What you'll learn:**
>
> - How to use custom data scripts to automate software installation during VM provisioning
> - The relationship between cloud-init and Azure's custom data feature
> - How to modify Nginx's default web page content

## Prerequisites

> **Before starting, ensure you have:**
>
> - An active Azure subscription
> - An SSH key pair available (or ability to generate one)
> - Basic familiarity with SSH connections

## Exercise Steps

### Overview

1. **Log in to Azure Portal**
2. **Create a Virtual Machine with Custom Data**
3. **Edit the Nginx Default Page**
4. **Clean Up Resources (Optional)**

### **Step 1:** Log in to Azure Portal

Accessing the Azure Portal is the starting point for all Azure resource management. You'll use the portal's graphical interface to create and configure your virtual machine with automation scripts.

1. **Open** a web browser and navigate to the [Azure Portal](https://portal.azure.com/)
2. **Sign in** using your Azure account credentials

### **Step 2:** Create a Virtual Machine with Custom Data

Custom data scripts allow you to automate configuration tasks that would otherwise require manual SSH access after VM creation. This approach demonstrates infrastructure-as-code principles where your server configuration is defined before deployment.

1. **Navigate** to **Virtual Machines** in the Azure Portal and click **Create** > **Virtual machine**
2. **Configure** the VM with these settings:
   - **Subscription**: Select your subscription
   - **Create a new Resource Group**: `LabCustomDataRG`
   - **Virtual Machine Name**: `LabCustomDataVM`
   - **Region**: Same as the resource group
   - **Zone options**: Select _Azure-selected zone_
   - **Image**: Select `Ubuntu Server 24.04 LTS`
   - **Size**: Choose `Standard_B1s`
   - **Authentication Type**: Select **SSH Public Key**
   - **Username**: `azureuser`
   - **SSH Public Key Source**: Use an existing SSH key or generate a new one
   - **Allow selected ports** and select **HTTP (80)** and **SSH (22)**
3. **Navigate** to the **Advanced** tab
4. **Paste** the following script in the **Custom Data** field:

   ```bash
   #!/bin/bash
   apt update
   apt install nginx -y
   ```

5. **Click** **Review + Create**, and then **Create**

> **Concept Deep Dive**
>
> The **Custom Data** field allows you to execute a script during the initial boot of the VM, automating configurations and software installations.
>
> This script:
>
> - Updates the system's package list (`apt update`)
> - Installs the Nginx web server (`apt install nginx -y`)
>
> It is important that you 1) don't use `sudo` 2) make sure it is _non-interactive_ 3) use a shebang
>
> **Common Mistakes**
>
> - Adding `sudo` to commands (custom data runs as root)
> - Forgetting the shebang (`#!/bin/bash`)
> - Using interactive prompts that hang the script
>
> **Quick check:** Open a browser and go to `http://<VM_Public_IP>`. You should see the **"Welcome to Nginx!"** default page. This might take a minute, so be patient and refresh the page.

### **Step 3:** Edit the Nginx Default Page

Now that Nginx is running, you'll connect to the server and modify its default page. This demonstrates that while automation handles initial setup, you can still make manual changes when needed.

1. **Connect** to the VM using SSH:

   ```bash
   ssh -i <private-key> azureuser@<VM_Public_IP>
   ```

   - Replace `<private-key>` with your private key file
   - Replace `<VM_Public_IP>` with the VM's public IP address
   - Don't forget to `chmod 400` the key if you are on Mac or Linux

2. **Navigate** to the Nginx _root_ directory:

   ```bash
   cd /var/www/html/
   ```

3. **Open** `index.nginx-debian.html` in a text editor:

   ```bash
   sudo nano index.nginx-debian.html
   ```

4. **Modify** the content (e.g., add "Hello World" to the `<h1>` tag)
5. **Save** and exit by pressing `Ctrl+x`, `y`, and `Enter`

> **Quick check:** Refresh the page in your browser or rerun the `curl localhost` command to see the updated content.

### **Step 4:** Clean Up Resources (Optional)

Deleting resources when you're finished prevents unnecessary charges and keeps your Azure subscription organized.

1. **Navigate** to **Resource Groups** in the Azure Portal
2. **Locate** `LabCustomDataRG`
3. **Click** **Delete resource group**

## Common Issues

> **If you encounter problems:**
>
> **Nginx not responding after VM creation:** Wait 2-3 minutes for the custom data script to complete. The script runs during first boot and needs time to update packages and install Nginx.
>
> **Permission denied on SSH:** Ensure your private key has correct permissions (`chmod 400 <private-key>`).
>
> **Cannot edit index file:** Remember to use `sudo` when editing files in `/var/www/html/`.

## Summary

You've successfully automated Nginx installation using Azure custom data scripts which:

- Eliminates manual configuration steps after VM creation
- Demonstrates infrastructure-as-code principles
- Shows how cloud-init processes startup scripts
- Provides a foundation for more complex automation

> **Key takeaway:** Custom data scripts transform VM provisioning from a multi-step manual process into a single automated deployment, making your infrastructure reproducible and consistent.

## Going Deeper (Optional)

> **Want to explore more?**
>
> - Create a custom data script that also configures a custom HTML page automatically
> - Research cloud-init directives for more advanced configuration options
> - Experiment with multiple custom data scripts for different services

## Done 🎉

You have successfully automated the installation of Nginx using a custom data script and edited the default web page to display custom content.
