+++
title = "3. Creating a Virtual Network with Enhanced Security using Azure CLI"
weight = 3
date = 2024-12-05
draft = false
+++

## Overview

This exercise will guide you through provisioning a complete solution on Azure using only Azure CLI. The solution comprises three servers: a web server, a reverse proxy, and a bastion host. These components are connected via a virtual network and secured with a Network Security Group (NSG) and Application Security Groups (ASGs).

By the end of this exercise, you will have a working environment with secure, isolated network communication between components.

### Objectives
1. **Create a resource group and a virtual network** to connect the servers.
2. **Set up a Network Security Group (NSG)** for subnet-level security.
3. **Configure Application Security Groups (ASGs)** for more granular control.
4. **Provision three virtual machines** for the web server, reverse proxy, and bastion host.
5. **Test the configuration** by accessing the reverse proxy through the bastion host.

## Prerequisites

- Azure CLI installed on your machine. If not, install it from [here](https://learn.microsoft.com/cli/azure/install-azure-cli).
- An active Azure subscription.

## Step 1: Create a Resource Group

A resource group is a container that holds all the related resources.

Run the following command to set up the resource group:

```bash
az group create --name DemoRG --location northeurope
```

**Explanation:**

- **`az group create`**: Creates a new resource group.
- **`--name DemoRG`**: Names the resource group `DemoRG`.
- **`--location northeurope`**: Sets the location to North Europe.



## Step 2: Create a Virtual Network

The virtual network (VNet) connects the components.

Run the following command to set up the  VNet:

```bash
az network vnet create \
  --resource-group DemoRG \
  --name DemoVNet \
  --address-prefix 10.0.0.0/16 \
  --subnet-name default \
  --subnet-prefix 10.0.0.0/24
```

**Explanation:**

- **`az network vnet create`**: Creates a virtual network.
- **`--resource-group DemoRG`**: Specifies the resource group.
- **`--name DemoVNet`**: Names the VNet `DemoVNet`.
- **`--address-prefix 10.0.0.0/16`**: Sets the address space for the VNet.
- **`--subnet-name default`**: Names the subnet `default`.
- **`--subnet-prefix 10.0.0.0/24`**: Sets the address range for the subnet.

## Step 3: Configure Network Security

### Set Up Application Security Groups (ASGs)

ASGs allow grouping of virtual machines for applying NSG rules more effectively.

```bash
az network asg create \
  --resource-group DemoRG \
  --name ReverseProxyASG

az network asg create \
  --resource-group DemoRG \
  --name BastionHostASG
```

**Explanation:**

- **`az network asg create`**: Creates an Application Security Group.
- **`--name ReverseProxyASG`**: Names the ASG `ReverseProxyASG`.

### Create the Network Security Group (NSG)

The NSG controls inbound and outbound traffic to the subnet.

```bash
az network nsg create \
  --resource-group DemoRG \
  --name DemoNSG
```

**Explanation:**

- **`az network nsg create`**: Creates a Network Security Group.
- **`--name DemoNSG`**: Names the NSG `DemoNSG`.
- **`--location northeurope`**: Ensures the NSG is in the same region as the VNet.

### Apply NSG Rules

#### a. Allow SSH Access to Bastion Host ASG

**Command:**

```bash
az network nsg rule create \
  --resource-group DemoRG \
  --nsg-name DemoNSG \
  --name AllowSSH \
  --priority 1000 \
  --access Allow \
  --protocol Tcp \
  --direction Inbound \
  --source-address-prefixes Internet \
  --source-port-ranges "*" \
  --destination-asg BastionHostASG \
  --destination-port-ranges 22
```

**Explanation:**

- **`az network nsg rule create`**: Adds a rule to the NSG.
- **`--nsg-name DemoNSG`**: Targets the NSG `DemoNSG`.
- **`--name AllowSSH`**: Names the rule `AllowSSH`.
- **`--priority 1000`**: Sets the priority (lower number means higher priority).
- **`--access Allow`**: Allows traffic.
- **`--protocol Tcp`**: Applies to TCP protocol.
- **`--direction Inbound`**: Applies to incoming traffic.
- **`--source-address-prefixes Internet`**: Source is any Internet address.
- **`--destination-asg BastionHostASG`**: Targets the `BastionHostASG`.
- **`--destination-port-ranges 22`**: Applies to port 22 (SSH).

#### b. Allow HTTP Access to Reverse Proxy ASG

**Command:**

```bash
az network nsg rule create \
  --resource-group DemoRG \
  --nsg-name DemoNSG \
  --name AllowHTTP \
  --priority 2000 \
  --access Allow \
  --protocol Tcp \
  --direction Inbound \
  --source-address-prefixes Internet \
  --source-port-ranges "*" \
  --destination-asg ReverseProxyASG \
  --destination-port-ranges 80
```

**Explanation:**

- **`--name AllowHTTP`**: Names the rule `AllowHTTP`.
- **`--priority 2000`**: Sets a lower priority than SSH rule.
- **`--destination-asg ReverseProxyASG`**: Targets the `ReverseProxyASG`.
- **`--destination-port-ranges 80`**: Applies to port 80 (HTTP).

### Associate the NSG with the Subnet

Attach the NSG to the VNet's subnet.

```bash
az network vnet subnet update \
  --resource-group DemoRG \
  --vnet-name DemoVNet \
  --name default \
  --network-security-group DemoNSG
```


## Step 4: Provision the Virtual Machines

Deploy three VMs: the web server, reverse proxy, and bastion host. Use the configuration files for the web server and reverse proxy.
### Provision the Web Server

#### Create Configuration File

1. **Create the Web Server Configuration File**:
   Save the following content as `web_server_config.yaml`:

   ```yaml
   #cloud-config
   packages:
     - nginx
   write_files:
     - path: /var/www/html/index.html
       content: |
         <!DOCTYPE html>
         <html>
         <head>
             <title>Hello World!</title>
         </head>
         <body>
             <h1>Hello World!</h1>
         </body>
         </html>
     - path: /etc/nginx/sites-available/default
       content: |
         server {
           listen 8080 default_server;
           server_name _;
           root /var/www/html;
           index index.html;
         }
   runcmd:
     - systemctl restart nginx
   ```

**Explanation:**

- Installs Nginx.
- Creates a custom `index.html`.
- Configures Nginx to listen on port 8080.
- Restarts Nginx service.

Ensure the file is accessible to the CLI during VM creation.

#### Provision the Web Server

Now, use the configuration file to deploy the web server:

```bash
az vm create \
  --resource-group DemoRG \
  --name WebServer \
  --image Ubuntu2204 \
  --size Standard_B1s \
  --admin-username azureuser \
  --vnet-name DemoVNet \
  --subnet default \
  --nsg "" \
  --public-ip-address "" \
  --generate-ssh-keys \
  --custom-data @web_server_config.yaml
```

**Explanation:**

- **`az vm create`**: Creates a virtual machine.
- **`--name WebServer`**: Names the VM `WebServer`.
- **`--image Ubuntu2204`**: Uses Ubuntu Server 22.04 LTS image.
- **`--size Standard_B1s`**: Sets the VM size.
- **`--admin-username azureuser`**: Sets the admin username.
- **`--vnet-name DemoVNet`**: Places VM in `DemoVNet`.
- **`--subnet default`**: Uses the `default` subnet.
- **`--nsg ""`**: No NSG at NIC level.
- **`--public-ip-address ""`**: No public IP assigned.
- **`--generate-ssh-keys`**: Generates SSH keys if not present.
- **`--custom-data web_server_config.yaml`**: Uses cloud-init file to configure the VM.

### Provision the Reverse Proxy

#### Create Configuration File

2. **Create the Reverse Proxy Configuration File**:
   Save the following content as `reverse_proxy_config.yaml`:

   ```yaml
   #cloud-config
   packages:
     - nginx
   write_files:
     - path: /etc/nginx/sites-available/default
       content: |
         server {
           listen 80;
           location / {
             proxy_pass http://webserver.internal.cloudapp.net:8080/;
             proxy_set_header Host $host;
             proxy_set_header X-Real-IP $remote_addr;
             proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           }
         }
   runcmd:
     - systemctl restart nginx
   ```

**Explanation:**

- Installs Nginx.
- Configures Nginx as a reverse proxy to the Web Server.
- Restarts Nginx service.

Ensure the file is accessible to the CLI during VM creation.

#### Provision the Reverse Proxy

Now, use the configuration file to deploy the Reverse Proxy :

```bash
az vm create \
  --resource-group DemoRG \
  --name ReverseProxy \
  --image Ubuntu2204 \
  --size Standard_B1s \
  --admin-username azureuser \
  --vnet-name DemoVNet \
  --subnet default \
  --nsg "" \
  --generate-ssh-keys \
  --custom-data @reverse_proxy_config.yaml
```

**Explanation:**

- **`--name ReverseProxy`**: Names the VM `ReverseProxy`.
- **`--generate-ssh-keys`**: Reuses existing SSH keys.
- **`--custom-data reverse_proxy_config.yaml`**: Uses cloud-init file.

### Provision the Bastion Host

#### Provision the Bastion Host

Now, use the configuration file to deploy the Bastion Host :

```bash
az vm create \
  --resource-group DemoRG \
  --name BastionHost \
  --image Ubuntu2204 \
  --size Standard_B1s \
  --admin-username azureuser \
  --vnet-name DemoVNet \
  --subnet default \
  --nsg "" \
  --generate-ssh-keys
```

**Explanation:**

- **`--name BastionHost`**: Names the VM `BastionHost`.
- **No `--custom-data`**: Standard VM without cloud-init.
- **Public IP Address**: Assigned by default for SSH access.

## Step 5: Attach ASGs to VM NICs

To ensure proper traffic management and rule enforcement, Application Security Groups (ASGs) must be attached to the Network Interface Cards (NICs) of the virtual machines. This step will be divided into two parts: attaching the ASG to the Reverse Proxy and then to the Bastion Host.

#### Attach ASG to the Reverse Proxy NIC

1. **Retrieve the NIC ID** for the Reverse Proxy virtual machine:

   ```bash
   REVERSE_PROXY_NIC_ID=$(az vm show --resource-group DemoRG --name ReverseProxy --query 'networkProfile.networkInterfaces[0].id' --output tsv)
   ```

2. **Extract the NIC Name** from the NIC ID:

   ```bash
   REVERSE_PROXY_NIC_NAME=$(basename $REVERSE_PROXY_NIC_ID)
   ```

3. **Get the IP Configuration Name** for the Reverse Proxy NIC:

   ```bash
   REVERSE_PROXY_NIC_IP_CONFIG=$(az network nic show --resource-group DemoRG --name $REVERSE_PROXY_NIC_NAME --query 'ipConfigurations[0].name' --output tsv)
   ```

4. **Attach the Reverse Proxy ASG** to the NIC:

   ```bash
   az network nic ip-config update \
     --resource-group DemoRG \
     --nic-name $REVERSE_PROXY_NIC_NAME \
     --name $REVERSE_PROXY_NIC_IP_CONFIG \
     --application-security-groups ReverseProxyASG
   ```

#### Attach ASG to the Bastion Host NIC

1. **Retrieve the NIC ID** for the Bastion Host virtual machine:

   ```bash
   BASTION_HOST_NIC_ID=$(az vm show --resource-group DemoRG --name BastionHost --query 'networkProfile.networkInterfaces[0].id' --output tsv)
   ```

2. **Extract the NIC Name** from the NIC ID:

   ```bash
   BASTION_HOST_NIC_NAME=$(basename $BASTION_HOST_NIC_ID)
   ```

3. **Get the IP Configuration Name** for the Bastion Host NIC:

   ```bash
   BASTION_HOST_NIC_IP_CONFIG=$(az network nic show --resource-group DemoRG --name $BASTION_HOST_NIC_NAME --query 'ipConfigurations[0].name' --output tsv)
   ```

4. **Attach the Bastion Host ASG** to the NIC:

   ```bash
   az network nic ip-config update \
     --resource-group DemoRG \
     --nic-name $BASTION_HOST_NIC_NAME \
     --name $BASTION_HOST_NIC_IP_CONFIG \
     --application-security-groups BastionHostASG
   ```

## Test and Verify

###  Verify NSG Rules

- Ensure that:

  - SSH is allowed only to the Bastion Host.
  - HTTP is allowed only to the Reverse Proxy.

###  Verify ASG Assignments

- Check that:

  - `ReverseProxyASG` is attached to the Reverse Proxy NIC.
  - `BastionHostASG` is attached to the Bastion Host NIC.

###  Test HTTP Access

- Access the Reverse Proxy's public IP on port 80.
- You should see the "Hello World!" page served by the Web Server.

###  Test Internal Communication

- From the Bastion Host, SSH into the Reverse Proxy using its private IP.
- From the Reverse Proxy, ensure it can reach the Web Server via its internal DNS name.

## Summary

In this exercise, you:

- Created a resource group and a virtual network with a subnet.
- Configured Application Security Groups and a Network Security Group with specific rules.
- Provisioned three VMs with roles of Web Server, Reverse Proxy, and Bastion Host.
- Automated server configurations using cloud-init.
- Verified that the network security settings work as intended.


---

## Cleanup Resources

Once you've validated the setup, delete the resources to avoid incurring costs:

```bash
az group delete --name DemoRG --yes --no-wait
```

---


# TL;DR

> `web_server_config.yaml`

```yaml
#cloud-config
packages:
  - nginx
write_files:
  - path: /var/www/html/index.html
    content: |
      <!DOCTYPE html>
      <html>
      <head>
          <title>Hello World!</title>
      </head>
      <body>
          <h1>Hello World!</h1>
      </body>
      </html>
  - path: /etc/nginx/sites-available/default
    content: |
      server {
        listen 8080 default_server;
        server_name _;
        root /var/www/html;
        index index.html;
      }
runcmd:
  - systemctl restart nginx
```


> `reverse_proxy_config.yaml`

```yaml
#cloud-config
packages:
  - nginx
write_files:
  - path: /etc/nginx/sites-available/default
    content: |
      server {
        listen 80;
        location / {
          proxy_pass http://webserver.internal.cloudapp.net:8080/;
          proxy_set_header Host \$host;
          proxy_set_header X-Real-IP \$remote_addr;
          proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        }
      }
runcmd:
  - systemctl restart nginx
```


> `provision_solution.sh`

```bash
#!/bin/bash

# Variables
RESOURCE_GROUP="DemoRG"
LOCATION="northeurope"

VNET_NAME="DemoVNet"
SUBNET_NAME="default"
NSG_NAME="DemoNSG"
ASG_REVERSE_PROXY="ReverseProxyASG"
ASG_BASTION_HOST="BastionHostASG"

WEB_SERVER="WebServer"
REVERSE_PROXY="ReverseProxy"
BASTION_HOST="BastionHost"

# Create Resource Group
echo "Creating Resource Group..."
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create Virtual Network and Subnet
echo "Creating Virtual Network and Subnet..."
az network vnet create \
  --resource-group $RESOURCE_GROUP \
  --name $VNET_NAME \
  --address-prefix 10.0.0.0/16 \
  --subnet-name $SUBNET_NAME \
  --subnet-prefix 10.0.0.0/24

# Create Application Security Groups
echo "Creating Application Security Groups..."
az network asg create \
  --resource-group $RESOURCE_GROUP \
  --name $ASG_REVERSE_PROXY

az network asg create \
  --resource-group $RESOURCE_GROUP \
  --name $ASG_BASTION_HOST

# Create Network Security Group
echo "Creating Network Security Group..."
az network nsg create \
  --resource-group $RESOURCE_GROUP \
  --name $NSG_NAME

# Create NSG Rules
echo "Adding SSH and HTTP rules to NSG..."
az network nsg rule create \
  --resource-group $RESOURCE_GROUP \
  --nsg-name $NSG_NAME \
  --name AllowSSH \
  --priority 1000 \
  --access Allow \
  --protocol Tcp \
  --direction Inbound \
  --source-address-prefixes Internet \
  --source-port-ranges "*" \
  --destination-asg $ASG_BASTION_HOST \
  --destination-port-ranges 22

az network nsg rule create \
  --resource-group $RESOURCE_GROUP \
  --nsg-name $NSG_NAME \
  --name AllowHTTP \
  --priority 2000 \
  --access Allow \
  --protocol Tcp \
  --direction Inbound \
  --source-address-prefixes Internet \
  --source-port-ranges "*" \
  --destination-asg $ASG_REVERSE_PROXY \
  --destination-port-ranges 80

# Associate NSG with Subnet
echo "Associating NSG with Subnet..."
az network vnet subnet update \
  --resource-group $RESOURCE_GROUP \
  --vnet-name $VNET_NAME \
  --name $SUBNET_NAME \
  --network-security-group $NSG_NAME

# Create Web Server VM
echo "Creating Web Server VM..."
az vm create \
  --resource-group $RESOURCE_GROUP \
  --name $WEB_SERVER \
  --image Ubuntu2204 \
  --size Standard_B1s \
  --admin-username azureuser \
  --vnet-name $VNET_NAME \
  --subnet $SUBNET_NAME \
  --nsg "" \
  --public-ip-address "" \
  --generate-ssh-keys \
  --custom-data @web_server_config.yaml

# Create Reverse Proxy VM
echo "Creating Reverse Proxy VM..."
az vm create \
  --resource-group $RESOURCE_GROUP \
  --name $REVERSE_PROXY \
  --image Ubuntu2204 \
  --size Standard_B1s \
  --admin-username azureuser \
  --vnet-name $VNET_NAME \
  --subnet $SUBNET_NAME \
  --nsg "" \
  --generate-ssh-keys \
  --custom-data @reverse_proxy_config.yaml

# Create Bastion Host VM
echo "Creating Bastion Host VM..."
az vm create \
  --resource-group $RESOURCE_GROUP \
  --name $BASTION_HOST \
  --image Ubuntu2204 \
  --size Standard_B1s \
  --admin-username azureuser \
  --vnet-name $VNET_NAME \
  --subnet $SUBNET_NAME \
  --nsg "" \
  --generate-ssh-keys

# Attach ASGs to NIC IP Configurations
echo "Attaching ASGs to NICs..."

# Get NIC IDs
REVERSE_PROXY_NIC_ID=$(az vm show --resource-group $RESOURCE_GROUP --name $REVERSE_PROXY --query 'networkProfile.networkInterfaces[0].id' --output tsv)
BASTION_HOST_NIC_ID=$(az vm show --resource-group $RESOURCE_GROUP --name $BASTION_HOST --query 'networkProfile.networkInterfaces[0].id' --output tsv)

# Extract NIC Names
REVERSE_PROXY_NIC_NAME=$(basename $REVERSE_PROXY_NIC_ID)
BASTION_HOST_NIC_NAME=$(basename $BASTION_HOST_NIC_ID)

# Get the NIC IP Configurations
REVERSE_PROXY_NIC_IP_CONFIG=$(az network nic show --resource-group $RESOURCE_GROUP --name $REVERSE_PROXY_NIC_NAME --query 'ipConfigurations[0].name' --output tsv)
BASTION_HOST_NIC_IP_CONFIG=$(az network nic show --resource-group $RESOURCE_GROUP --name $BASTION_HOST_NIC_NAME --query 'ipConfigurations[0].name' --output tsv)

# Attach ASG to Reverse Proxy NIC
az network nic ip-config update \
  --resource-group $RESOURCE_GROUP \
  --nic-name $REVERSE_PROXY_NIC_NAME \
  --name $REVERSE_PROXY_NIC_IP_CONFIG \
  --application-security-groups $ASG_REVERSE_PROXY

# Attach ASG to Bastion Host NIC
az network nic ip-config update \
  --resource-group $RESOURCE_GROUP \
  --nic-name $BASTION_HOST_NIC_NAME \
  --name $BASTION_HOST_NIC_IP_CONFIG \
  --application-security-groups $ASG_BASTION_HOST

echo "Provisioning Complete!"
```
