+++
title = "1. Provisioning a VM via Azure Portal"
weight = 1
date = 2024-11-25
lastmod = 2025-11-24
draft = false
+++

## Goal

Create your first Virtual Machine in Azure using the portal interface to understand how cloud resources are provisioned and managed.

> **What you'll learn:**
>
> - How to navigate the Azure Portal interface
> - When to use resource groups for organizing cloud resources
> - Best practices for VM configuration and security settings

## Prerequisites

> **Before starting, ensure you have:**
>
> - ✓ An active Azure account with an active subscription
> - ✓ Access to a web browser
> - ✓ Basic understanding of what a virtual machine is

## Exercise Steps

### Overview

1. **Log in to Azure Portal**
2. **Create a Resource Group**
3. **Create a Virtual Machine**
4. **Connect to the VM Using Azure Cloud Shell**
5. **Install Nginx (Optional)**
6. **Clean Up Resources (Optional)**

### **Step 1:** Log in to Azure Portal

The Azure Portal is your central management interface for all Azure resources. This web-based console provides a graphical way to create, configure, and monitor your cloud infrastructure without needing command-line expertise.

1. **Open** a web browser and navigate to the [Azure Portal](https://portal.azure.com/)

2. **Sign in** using your Azure account credentials

> ✓ **Quick check:** You should see the Azure Portal dashboard after successful login

### **Step 2:** Create a Resource Group

Before creating any resources, you need a container to hold them. Resource groups provide logical organization for related resources and enable you to manage permissions, costs, and lifecycle as a single unit.

1. **Search for** "Resource groups" in the Azure Portal search bar

2. **Click** "Create" and fill in the following:
   - **Subscription**: Choose your subscription
   - **Resource Group Name**: `LabResourceGroup`
   - **Region**: Choose a region (e.g., `North Europe`)

3. **Click** "Review + Create" and then "Create"

> ℹ **Concept Deep Dive**
>
> A **Resource Group** is a container that holds related resources for an Azure solution. It allows for easy management and deletion of all resources together. Think of it as a folder that groups everything related to a specific project or environment.
>
> ✓ **Quick check:** The resource group appears in the Resource Groups list

### **Step 3:** Create a Virtual Machine

Creating the VM is the core of this exercise. You'll configure compute resources, choose an operating system, set up authentication, and define network access rules. Each setting affects security, cost, and functionality of your server.

1. **Search for** "Virtual Machines" in the Azure Portal and click "Create" > "Azure Virtual machine"

2. **Configure** the VM with these settings:
   - **Subscription**: Select your subscription
   - **Resource Group**: Choose `LabResourceGroup`
   - **Virtual Machine Name**: `LabVM`
   - **Region**: Same as the resource group
   - **Zone options**: Select _Azure-selected zone_
   - **Image**: Select `Ubuntu Server 24.04 LTS`
   - **Size**: Choose a size like `Standard_B1s`
   - **Authentication Type**: Select **Password**
   - **Username**: `azureuser`
   - **Password**: Create a secure password and confirm it

3. **Configure** inbound ports:
   - Check **Allow selected ports** and select **HTTP (80)** and **SSH (22)**

4. **Click** "Review + Create", and then "Create"

   > ℹ **Concept Deep Dive**
   >
   > - **VM Size:** Determines the CPU, memory, and storage capacity. For this exercise, `Standard_B1s` is cost-effective for learning purposes.
   > - **Inbound Ports:** Ensure HTTP (for web traffic) and SSH (for secure access) are open for connectivity.
   >
   > ⚠ **Common Mistakes**
   >
   > - Forgetting to open port 22 will prevent SSH access to your VM
   > - Choosing the wrong region can increase latency and costs
   > - Using a weak password compromises security

5. **Wait** for Azure to provision the VM. Once completed, navigate to the **Virtual Machines** section and locate `LabVM`

> ✓ **Quick check:** Ensure the VM status is "Running" in the Virtual Machines overview

### **Step 4:** Connect to the VM Using Azure Cloud Shell

Now that your VM is running, you need to access it remotely. Azure Cloud Shell provides a browser-based terminal with pre-installed tools, eliminating the need for local terminal setup.

1. **Click** the **Cloud Shell** icon in the Azure Portal (top-right corner)

2. **Select** "Bash" as your shell environment

3. **Connect** to your VM via SSH:

   ```bash
   ssh azureuser@<VM_Public_IP>
   ```

   - Replace `<VM_Public_IP>` with the public IP address of your VM, found in the _Overview_ tab of the VM
   - Answer _yes_ on the question: _Are you sure you want to continue connecting (yes/no/[fingerprint])?_

> ℹ **Concept Deep Dive**
>
> SSH (Secure Shell) is a protocol used for secure remote login to your server. It encrypts all traffic between your terminal and the server, protecting your credentials and commands from interception.
>
> Note that there is no feedback in the terminal when writing a password. It will look like you don't write anything - this is a security feature.
>
> ✓ **Quick check:** You should see a command prompt for `azureuser@LabVM`

### **Step 5:** Install Nginx (Optional)

With access to your VM, you can now install software. Nginx is one of the most popular web servers, known for its performance and low resource usage. This step demonstrates the basic package management workflow on Ubuntu.

1. **Install** Nginx:

   ```bash
   sudo apt update
   sudo apt install nginx -y
   ```

> ℹ **Concept Deep Dive**
>
> Nginx is a very popular Web Server used by millions of websites worldwide.
>
> The `apt update` command refreshes the list of available packages. The `-y` flag confirms the operation without additional prompts (user interaction). `sudo` is used in order to run commands as administrator.
>
> ⚠ **Common Mistakes**
>
> - Forgetting `sudo` will result in permission denied errors
> - Skipping `apt update` may install outdated package versions

**Verify the installation** using any of these three methods:

1. **Check service status:**

   ```bash
   sudo systemctl status nginx
   ```

   Ensure the output shows `active (running)` for the Nginx service. Get back to the prompt by pressing `Ctrl-C`.

2. **Test locally with curl:**

   ```bash
   curl localhost
   ```

   Ensure you get some HTML code back. This confirms Nginx runs correctly regardless of firewall settings.

3. **Test from browser:**

   Open a browser and go to `http://<VM_Public_IP>`. You should see the "Welcome to Nginx!" default page.

> ✓ **Quick check:** At least one of the three verification methods confirms Nginx is running

### **Step 6:** Clean Up Resources (Optional)

Cleaning up resources when you're done prevents unnecessary charges and keeps your Azure environment organized. Deleting the resource group removes all contained resources in one operation.

1. **Navigate to** the Resource Groups section by searching for "Resource Groups" in the search bar

2. **Locate** the resource group `LabResourceGroup`. You can use the search bar in the Resource Groups section if you have multiple groups

3. **Click** on `LabResourceGroup` to open the resource group details

4. **Click** the "Delete resource group" button at the top of the page

5. **Confirm** deletion:
   - Check the _Apply force delete ..._ checkbox
   - Enter the exact name `LabResourceGroup` in the confirmation box
   - Click "Delete" and then "Delete" again

> ℹ **Concept Deep Dive**
>
> Deleting the resource group will permanently remove all resources contained within it, including the virtual machine, network interface, and any associated disks or public IPs. This action helps avoid unnecessary costs and keeps your environment clean.
>
> ✓ **Quick check:** After deletion, go back to the Resource Groups page and confirm that `LabResourceGroup` no longer appears in the list. Refresh the page if necessary. It can take a minute or two before it has finalized the operation.

## Common Issues

> **If you encounter problems:**
>
> **Cannot connect via SSH:** Verify port 22 is open in the VM's network security group and you're using the correct public IP address
>
> **Nginx page not loading:** Ensure port 80 is open and Nginx service is running
>
> **Password not working:** Remember there's no visual feedback when typing passwords in SSH
>
> **Still stuck?** Check the VM status in Azure Portal - it should show "Running"

## Summary

You've successfully provisioned a Virtual Machine in Azure using the portal which:

- ✓ Demonstrates the complete VM creation workflow
- ✓ Establishes secure remote access via SSH
- ✓ Provides a foundation for web server deployment

> **Key takeaway:** The Azure Portal provides a visual interface for resource management that's ideal for learning and one-off deployments. You'll use this workflow whenever you need to quickly create and configure cloud resources.

## Going Deeper (Optional)

> **Want to explore more?**
>
> - Try changing the Nginx default page content
> - Explore other VM sizes and their cost implications
> - Research the difference between SSH key and password authentication
> - Investigate Network Security Groups and their rules

## Done 🎉

You have successfully provisioned a Virtual Machine in Azure using the portal and connected to it using Azure Cloud Shell. You also verified its operation by installing and testing the web server Nginx.
