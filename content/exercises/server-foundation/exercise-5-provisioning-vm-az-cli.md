+++
title = "5. Provisioning a VM Using AZ CLI, Configuring Nginx, and Allowing HTTP Traffic"
weight = 5
date = 2024-11-25
draft = false
+++

## Overview

This exercise introduces creating a Virtual Machine (VM) with **Azure CLI**, using default SSH keys for secure authentication, installing Nginx, and configuring the network to allow HTTP traffic. You will work exclusively in the **VSCode Integrated Terminal** (Windows users: Make sure you use **Git Bash**).

### Step 1: Set Up the Environment

1. Open **VSCode** and launch the **Integrated Terminal**:
   - On Windows, use **Git Bash** inside VSCode.
   - On Mac or Linux, use the default terminal.

2. Verify that Azure CLI is installed by running:

   ```bash
   az --version
   ```

   - If Azure CLI is not installed, follow the [official installation guide](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli).

3. Log in to your Azure account:

   ```bash
   az login
   ```

   - Follow the on-screen instructions to complete the authentication.


### Step 2: Create a Resource Group

1. Set variables in the terminal session for the resource group and VM name:

   ```bash
   resource_group="MyCLIVMGroup"
   vm_name="MyCLIVM"
   ```

2. Create the resource group in the `northeurope` location:

   ```bash
   az group create --name $resource_group --location northeurope
   ```

	> ✅ **Verification Step:**
	> Review the output to confirm successful creation. You should see a JSON response similar to:
	>
	>    ```json
	>    {
	>      "id": "/subscriptions/<subscription-id>/resourceGroups/MyCLIDemoGroup",
	>      "location": "eastus",
	>      "name": "MyCLIVMGroup",
	>      "properties": {
	>        "provisioningState": "Succeeded"
	>      }
	>    }
	>    ```

### Step 3: Create a VM

1. Create a VM using the default SSH keys:

   ```bash
	az vm create \
	   --resource-group $resource_group \
	   --location northeurope \
	   --name $vm_name \
	   --image Ubuntu2404 \
	   --size Standard_B1s \
	   --admin-username azureuser \
	   --generate-ssh-keys
   ```

   > 💡 **Information**
   >
   > - This command:
   > 	- Creates a VM named `MyCLIVM`.
   > 	- Uses the latest Ubuntu 22.04 image.
   > 	- Generates SSH keys if not already available in `~/.ssh/id_rsa`.


	> ✅ **Verification Step:**
	> Review the output to confirm successful creation. You should see a JSON response similar to:
	>
	> ```json
	> {
	>   "fqdns": "",
	>   "id": "/subscriptions/ca0a7799-8e2e-4237-8616-8cc0e947ecd5/resourceGroups/MyCLIVMGroup/providers/Microsoft.Compute/virtualMachines/MyCLIVM",
	>   "location": "northeurope",
	>   "macAddress": "60-45-BD-DD-A5-5F",
	>   "powerState": "VM running",
	>   "privateIpAddress": "10.0.0.4",
	>   "publicIpAddress": "13.74.100.155",
	>   "resourceGroup": "MyCLIVMGroup",
	>   "zones": ""
	> }
	> ```

	> 💡 **Information Box:**
	>
	> If you don't have default SSH keys (`~/.ssh/id_rsa`), Azure CLI will generate them automatically. You can also create them manually using:
	>
	> ```bash
	> ssh-keygen -t rsa -b 2048
	> ```
	>
	> This generates:
	>
	> - `~/.ssh/id_rsa` (private key)
	> - `~/.ssh/id_rsa.pub` (public key)

### Step 4: Log in to the VM

1. Retrieve the public IP address of the VM:

   ```bash
   vm_ip=$(az vm show --resource-group $resource_group --name $vm_name --show-details --query publicIps -o tsv)
   echo $vm_ip
   ```

2. Log in to the VM using your default SSH key:

   ```bash
   ssh azureuser@$vm_ip
   ```

### Step 5: Install Nginx

1. Update the system and install Nginx:

   ```bash
   sudo apt update
   sudo apt install nginx -y
   ```

	> ✅ **Verification Step:**
	>
	> 1) Run the command `curl localhost`. Ensure you get som HTML code back. This means that it runs correctly regardless of firewall settings.
	>
	> 2) Open a browser and go to the `<VM_Public_IP>`. You should **NOT** see the Nginx default page. This is because we haven´t opened the firewall on port 80 yet.

	> 💡 **Information Box:**
	> Azure VMs block HTTP traffic on port 80 by default for security reasons. You need to explicitly allow HTTP traffic.


### Step 6: Open Port 80 for HTTP Traffic

1. Make sure you return back to your laptop in the Terminal:

   ```bash
   exit
   ```

2. Allow traffic on port 80:

   ```bash
   az vm open-port --resource-group $resource_group --name $vm_name --port 80
   ```

	> ✅ **Verification Step:**
	>
	> Verify the rule is applied:
	>
	> ```bash
	> az network nsg rule list --resource-group $resource_group --nsg-name ${vm_name}NSG --output table
	> ```
	> - Ensure a rule exists for port 80 allowing inbound traffic.
	>
	> Return to the browser and refresh the page. Confirm the default Nginx page loads in the browser, indicating port 80 is open and traffic is allowed.

### Step 7: Clean Up Resources (Optional)

1. Delete the resource group to avoid unnecessary costs:

   ```bash
   az group delete --name $resource_group --no-wait --yes
   ```

> 💡 **Information Box:**
> Always clean up unused resources to avoid incurring unexpected charges.

## Exercise Complete!
You have successfully provisioned a VM using Azure CLI, logged in with SSH, installed and tested Nginx, and configured port 80 for HTTP traffic.
