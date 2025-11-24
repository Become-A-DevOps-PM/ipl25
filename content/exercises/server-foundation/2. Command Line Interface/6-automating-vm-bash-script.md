+++
title = "6. Automating VM Creation, Nginx Installation, and Port Configuration Using a Bash Script"
weight = 6
date = 2024-11-25
lastmod = 2025-11-24
draft = false
+++

## Goal

Create a Bash script that provides a "one-click" solution for deploying an Azure VM with Nginx automatically installed and configured.

> **What you'll learn:**
>
> - How to create reusable automation scripts for Azure resource provisioning
> - How to use custom data files to configure VMs during creation
> - How to combine multiple Azure CLI commands into an automated workflow

## Prerequisites

> **Before starting, ensure you have:**
>
> - Completed the previous exercises in the server foundation track
> - Azure CLI installed and configured with your subscription
> - A code editor (VS Code recommended) for creating script files

## Exercise Steps

### Overview

1. **Prepare the custom data file** - Create the cloud-init script for Nginx installation
2. **Create the automation script** - Write the Bash script that orchestrates all Azure commands
3. **Execute the automation script** - Run your one-click deployment
4. **Clean up resources** - Remove Azure resources when finished

### **Step 1:** Prepare the Custom Data File

Custom data files allow you to run scripts automatically when a VM boots for the first time. This eliminates manual SSH access and configuration, making your deployments truly automated and repeatable.

1. **Create** a file named `custom_data_nginx.sh` (you can use VS Code)
2. **Add** the following content to the file:

   ```bash
   #!/bin/bash
   apt update
   apt install nginx -y
   ```

> **Concept Deep Dive**
>
> The custom data script runs during VM provisioning with root privileges. It:
>
> - Updates package lists to ensure latest versions
> - Installs Nginx with the `-y` flag to auto-confirm installation
>
> This approach is known as "cloud-init" and is the standard way to bootstrap cloud VMs.

### **Step 2:** Create the Automation Script

The automation script combines all the individual Azure CLI commands you've learned into a single executable file. This transforms a multi-step manual process into a repeatable, error-free deployment that anyone on your team can run.

1. **Create** a Bash script named `provision_vm.sh`
2. **Add** the following content to the script:

   ```bash
   #!/bin/bash

   # Variables
   resource_group="MyOneClickGroup"
   vm_name="MyOneClickVM"
   location="northeurope"
   custom_data_file="custom_data_nginx.sh"

   # Create a resource group
   echo "Creating resource group: $resource_group..."
   az group create --name $resource_group --location $location

   # Create a virtual machine with custom data
   echo "Creating virtual machine: $vm_name..."
   az vm create \
      --resource-group $resource_group \
      --location $location \
      --name $vm_name \
      --image Ubuntu2404 \
      --size Standard_B1s \
      --admin-username azureuser \
      --generate-ssh-keys \
      --custom-data @$custom_data_file

   # Open port 80 for HTTP traffic
   echo "Opening port 80 for HTTP traffic..."
   az vm open-port --resource-group $resource_group --name $vm_name --port 80

   # Retrieve public IP address of the VM
   vm_ip=$(az vm show --resource-group $resource_group --name $vm_name --show-details --query publicIps -o tsv)

   echo "Deployment complete! Access your server at http://$vm_ip"
   ```

3. **Make** the script executable:

   ```bash
   chmod +x provision_vm.sh
   ```

> **Concept Deep Dive**
>
> The script demonstrates several important automation patterns:
>
> - **Variables at the top** make the script easy to customize
> - **Echo statements** provide progress feedback during execution
> - **The `@` prefix** tells Azure CLI to read the custom data from a file
> - **Command substitution** (`$()`) captures the output of one command for use in another
>
> **Common Mistakes**
>
> - Forgetting to make the script executable with `chmod +x`
> - Not having the custom data file in the same directory as the script
> - Using spaces around the `=` in variable assignments (Bash doesn't allow this)

### **Step 3:** Execute the Automation Script

Running the script will execute all Azure CLI commands in sequence, creating your complete infrastructure with a single command. This is the "one-click" deployment in action.

1. **Run** the script:

   ```bash
   ./provision_vm.sh
   ```

> **Concept Deep Dive**
>
> The script will:
>
> - Create a resource group
> - Provision a VM with the custom data script to install and configure Nginx
> - Open port 80 for HTTP traffic
> - Output the public IP address of the VM
>
> **Quick check:** Open a browser and navigate to `http://<VM_Public_IP>`. You should see the default Nginx page.

### **Step 4:** Clean Up Resources (Optional)

Cleaning up resources prevents unnecessary charges and ensures a tidy Azure environment. This step demonstrates how to tear down everything created by your automation script.

1. **Delete** the resource group if you no longer need the resources:

   ```bash
   az group delete --name MyOneClickGroup --no-wait --yes
   ```

> **Concept Deep Dive**
>
> The `--no-wait` flag returns control immediately while deletion continues in the background. The `--yes` flag skips the confirmation prompt, making this suitable for automated cleanup scripts.
>
> It might take a minute or two before the resource group is completely deleted.

## Common Issues

> **If you encounter problems:**
>
> **"Permission denied" when running the script:** Ensure you ran `chmod +x provision_vm.sh` to make the script executable.
>
> **"File not found" for custom data:** Make sure `custom_data_nginx.sh` is in the same directory where you run `provision_vm.sh`.
>
> **Nginx page doesn't load:** Wait 2-3 minutes for cloud-init to complete. You can SSH into the VM and check `/var/log/cloud-init-output.log` for progress.

## Summary

You've successfully created a one-click automation solution which:

- Provisions all Azure resources with a single command
- Automatically installs and configures Nginx using cloud-init
- Demonstrates the power of combining Azure CLI commands into reusable scripts

> **Key takeaway:** Bash scripts transform manual, error-prone processes into repeatable, shareable automation. This is the foundation of Infrastructure as Code (IaC) and is essential for professional DevOps workflows.

## Going Deeper (Optional)

> **Want to explore more?**
>
> - Add error handling to your script using `set -e` to exit on any command failure
> - Parameterize the script to accept resource group name and location as command-line arguments
> - Add a custom HTML page to Nginx by extending the custom data script
> - Create a corresponding cleanup script that deletes resources when you're done

## Done 🎉

You have successfully created a "one-click" solution to deploy an Azure VM, configure Nginx, and enable HTTP traffic using Bash scripting and custom data. This automation approach will serve as the foundation for more advanced Infrastructure as Code techniques in upcoming exercises.
