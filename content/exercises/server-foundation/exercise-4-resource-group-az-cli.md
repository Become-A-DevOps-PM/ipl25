+++
title = "4. Creating a Resource Group Using AZ CLI"
weight = 4
date = 2024-11-25
draft = false
+++

## Overview

This exercise introduces the **Azure CLI** for managing Azure resources. You will use Azure CLI commands to create a resource group and verify its creation.

### Step 1: Log in to Azure Cloud Shell

1. Open the [Azure Portal](https://portal.azure.com/) and click the **Cloud Shell** icon (top-right corner).
2. Select **Bash** as your shell environment if prompted.

> 💡 **Information**
> The Azure Cloud Shell is a Terminal in the Azure Portal that comes pre-configured with the Azure CLI. It enables you to run CLI commands without additional setup.

### Step 2: Create a Resource Group

1. Run the following command to create a resource group:

   ```bash
   az group create --name MyCLIDemoGroup --location northeurope
   ```
   - **`--name`**: Specifies the name of the resource group (e.g., `MyCLIDemoGroup`).
   - **`--location`**: Sets the region where the resources in the group will be located (e.g., `northeurope`).

> ✅ **Verification Step:**
> Review the output to confirm successful creation. You should see a JSON response similar to:
>
>    ```json
>    {
>      "id": "/subscriptions/<subscription-id>/resourceGroups/MyCLIDemoGroup",
>      "location": "eastus",
>      "name": "MyCLIDemoGroup",
>      "properties": {
>        "provisioningState": "Succeeded"
>      }
>    }
>    ```
>
> In the Azure Portal under **Resource groups** you should also see it listed
>
> You can also list all resource groups in your subscription by running the command:
>
>    ```bash
>    az group list --output table
>    ```


> 💡 **Information**
>
> A **Resource Group** acts as a container for all resources within Azure, making it easier to organize, manage, and delete resources as a single unit.

### Step 3: Clean Up Resources (Optional)

1. Delete the resource group to avoid unnecessary costs:

   ```bash
   az group delete --name MyCLIDemoGroup --no-wait --yes
   ```
   - **`--no-wait`**: Ensures the command returns immediately without waiting for the operation to complete.
   - **`--yes`**: Confirms the deletion without additional prompts.


## Exercise Complete!
You have successfully created and managed a resource group using Azure CLI, gaining hands-on experience with command-line operations in Azure.
