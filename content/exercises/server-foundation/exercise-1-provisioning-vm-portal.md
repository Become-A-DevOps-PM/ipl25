+++
title = "1. Provisioning a VM via Azure Portal"
weight = 1
date = 2024-11-25
draft = false
+++

## Overview

This exercise introduces the Azure Portal, guiding you through the creation of a Virtual Machine (VM). You will configure an Ubuntu Linux VM with a username/password for access and verify that the VM is running successfully by logging into the VM from Azure Cloud Shell.

### Step 1: Log in to Azure Portal
1. Open a web browser and navigate to the [Azure Portal](https://portal.azure.com/).
2. Sign in using your Azure account credentials.

### Step 2: Create a Resource Group
1. In the Azure Portal, search for **"Resource groups"** in the search bar.
2. Click **"Create"** and fill in the following:
   - **Subscription**: Choose your subscription.
   - **Resource Group Name**: `LabResourceGroup`
   - **Region**: Choose a region (e.g. `North Europe`).
3. Click **Review + Create** and then **Create**.

> 💡 **Information**
>
> A **Resource Group** is a container that holds related resources for an Azure solution. It allows for easy management and deletion of all resources together.

### Step 3: Create a Virtual Machine
1. In the Azure Portal, search for **"Virtual Machines"** and click **"Create"** > **"Azure Virtual machine"**.
2. Configure the VM:
   - **Subscription**: Select your subscription.
   - **Resource Group**: Choose `LabResourceGroup`.
   - **Virtual Machine Name**: `LabVM`
   - **Region**: Same as the resource group.
   - **Zone options**: Select _Azure-selected zone_
   - **Image**: Select `Ubuntu Server 24.04 LTS`.
   - **Size**: Choose a size like `Standard_B1s`.
   - **Authentication Type**: Select **Password**.
   - **Username**: `azureuser`
   - **Password**: Create a secure password and confirm it.
3. Configure inbound ports:
   - Check **Allow selected ports** and select **HTTP (80)** and **SSH (22)**.
4. Click **Review + Create**, and then **Create**.

	> 💡 **Information**
	>
	> - **VM Size:** Determines the CPU, memory, and storage capacity. For this exercise, `Standard_B1s` is cost-effective for learning purposes.
	> - **Inbound Ports:** Ensure HTTP (for web traffic) and SSH (for secure access) are open for connectivity.

5. After clicking **Create**, Azure will begin provisioning the VM. Once completed, navigate to the **Virtual Machines** section and locate `LabVM`.

	> ✅ **Verification Step:**
	>
	> Ensure the VM status is **"Running"** in the Virtual Machines overview.


### Step 4: Connect to the VM Using Azure Cloud Shell

1. In the Azure Portal, click the **Cloud Shell** icon (top-right corner)
2. Select **Bash** as your shell environment
3. Connect to your VM via SSH:

   ```bash
   ssh azureuser@<VM_Public_IP>
   ```

   - Replace `<VM_Public_IP>` with the public IP address of your VM, found in the **Overview** tab of the VM.
   - Answer **yes** on the question: *Are you sure you want to continue connecting (yes/no/[fingerprint])?* **yes**

   > 💡 **Information:**
   >
   > SSH (Secure Shell) is a protocol used for secure remote login to your server.
   >
   > Note that there is no feedback in the terminal when writing a password. It will look like you don´t write anything

   > ✅ **Verification Step:**
   >
   > You should see a command prompt for `azureuser@LabVM`.


### Step 5: Install Nginx (Optional)

1. Install Nginx:

   ```bash
   sudo apt update
   sudo apt install nginx -y
   ```

   > 💡 **Information**
   >
   > Nginx is a very popular Web Server.
   >
   > The `apt update` command refreshes the list of available packages. The `-y` flag confirms the operation without additional prompts (user interaction. `sudo` is used in order to run commands as administrator.

   > ✅ **Verification Step:**
   >
   > Here are three ways to verify that the installation of nginx was successfull:
   >
   > 1) Run the command `sudo systemctl status nginx`. Ensure the output shows `active (running)` for the Nginx service. This means that the program is installed and running. Get back to the prompt by pressing `Ctrl-C`.
   >
   > 2) Run the command `curl localhost`. Ensure you get som HTML code back. This means that it runs correctly regardless of firewall settings.
   >
   > 3) Open a browser and go to the `<VM_Public_IP>`. You should see the **"Welcome to Nginx!"** default page.


### Step 6: Clean Up Resources (Optional)

1. In the **Azure Portal**, navigate to the **Resource Groups** section by searching for "Resource Groups" in the search bar.

2. Locate the resource group you created, `LabResourceGroup`. You can use the search bar in the Resource Groups section if you have multiple groups.

3. Click on the `LabResourceGroup` name to open the resource group details.

4. In the resource group overview, click the **Delete resource group** button at the top of the page.

5. A confirmation prompt will appear. Check the _Apply force delete ..._ checkbox and enter the exact name of the resource group, `LabResourceGroup`, in the confirmation box, and click **Delete** and then **Delete** again.

   > 💡 **Information**
   >
   > Deleting the resource group will permanently remove all resources contained within it, including the virtual machine, network interface, and any associated disks or public IPs. This action helps avoid unnecessary costs and keeps your environment clean.

   > ✅ **Verification Step:**
   >
   > After deletion, go back to the **Resource Groups** page in the Azure Portal and confirm that `LabResourceGroup` no longer appears in the list. Refresh the page if necessary. It can take a minute or two before it has finalized the operation.

## Exercise Complete!
You have successfully provisioned a Virtual Machine in Azure using the portal and connected to it using Azure Cloud Shell. You also verified its operation by installing and testing the web server Nginx.
