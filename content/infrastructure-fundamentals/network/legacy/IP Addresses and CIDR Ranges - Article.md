+++
title = "IP Addresses and CIDR Ranges"
weight = 2
date = 2024-11-19
draft = false
hidden = true
+++

[Watch the presentation]({{< relref "ip-addresses-and-cidr-ranges-slides.md" >}})

[Se presentationen på svenska]({{< relref "ip-addresses-and-cidr-ranges-slides-swe.md" >}})

<!-- # IP Addresses and CIDR Ranges -->

In networking, the smooth flow of data between devices relies on fundamental components such as **IP addresses**, **CIDR ranges**, **subnets**, and **Network Interface Cards (NICs)**. Understanding how these elements work together is essential for managing networks effectively, whether in a local environment or the cloud.

## What Are IP Addresses?

An **IP address** (Internet Protocol address) is a unique identifier assigned to each device on a network, enabling it to send and receive data accurately. IP addresses are classified as **public** or **private**, depending on whether they are used on the internet or within local networks.

There are two primary types of IP addresses:
- **IPv4**: The most widely used format, consisting of four groups of numbers separated by dots (e.g., **192.168.1.1**). While effective, the limited number of available addresses has led to the development of newer standards.
- **IPv6**: Introduced to address the exhaustion of IPv4, IPv6 uses a more complex format with hexadecimal notation (e.g., **2001:0db8:85a3::8a2e:0370:7334**), providing a vastly larger address space.

## Understanding CIDR Ranges

**CIDR (Classless Inter-Domain Routing)** is a method for assigning IP addresses and organizing network routing. Unlike the older class-based system, CIDR allows for flexible allocation of IP address space and more efficient use of resources. CIDR notation consists of an IP address followed by a slash and a number, which indicates how many bits are used for the network portion of the address (e.g., **192.168.1.0/24**). In this example, the first 24 bits (192.168.1) represent the network, and the remaining bits identify the hosts.

This flexibility helps administrators create subnets of various sizes that fit specific network requirements, improving network efficiency and management.

## The Role of Subnets

A **subnet**, or subnetwork, divides a larger IP network into smaller, more manageable segments. This segmentation enhances network performance by reducing broadcast traffic and improves security by isolating groups of devices. Each subnet has its own range of IP addresses, defined within a broader network.

For instance, a network using **192.168.1.0/24** can be divided into subnets such as **192.168.1.0/25** and **192.168.1.128/25**, each with 128 available addresses. Subnets ensure that devices within them can communicate directly, while communication across subnets requires a router to route traffic between segments.

## Network Interface Cards (NICs)

A **Network Interface Card (NIC)** is the hardware component that connects a device to a network, enabling data transmission and reception. Each NIC has a unique **MAC address**, which helps identify it at the data link layer. In virtualized and cloud environments, **virtual NICs (vNICs)** function similarly, allowing virtual machines (VMs) to connect to networks and communicate with other resources.

## How These Components Work Together

In a typical network, each device connects through a NIC and is assigned an IP address within the network’s subnet. CIDR notation helps define the size and scope of the network, while subnets organize the network into smaller sections. For example, in a corporate environment, departments might be segmented into different subnets, such as **192.168.10.0/24** for one department and **192.168.20.0/24** for another. Communication within the same subnet is direct, while routers manage traffic between subnets.

**Example: Bringing It All Together**

Let’s say you’re setting up a small office network with multiple departments that need to communicate, but you want to keep their traffic separate for security and efficiency.

1. **CIDR Assignment**:
   - You start with a **192.168.0.0/16** address block. This gives you 65,536 possible IP addresses.
   
2. **Subnetting**:
   - You divide this into subnets using CIDR notation:
     - **192.168.1.0/24** for the HR department (256 IP addresses).
     - **192.168.2.0/24** for the IT department (256 IP addresses).
     - **192.168.3.0/24** for the Finance department (256 IP addresses).

3. **IP Address Assignment**:
   - Each department is assigned a range of IP addresses within its subnet. For example:
     - HR gets IP addresses from **192.168.1.1 to 192.168.1.254**.
     - IT gets IP addresses from **192.168.2.1 to 192.168.2.254**.

4. **NICs for Connectivity**:
   - Each computer in the HR department has a NIC with an IP address from the **192.168.1.x** range, while computers in IT have addresses from **192.168.2.x**. The NICs allow the devices to communicate within their respective subnets.

5. **Routing Between Subnets**:
   - To enable communication between the HR, IT, and Finance departments, a router is used. The router forwards data between the subnets, ensuring that the right data gets to the right destination.

## The Role of DHCP

A **DHCP (Dynamic Host Configuration Protocol) server** automates the assignment of IP addresses, subnet masks, and other essential network configuration details. This ensures devices can connect and communicate on the network without manual configuration, simplifying IP address management and improving efficiency.

### Conclusion

IP addresses, CIDR ranges, subnets, and NICs form the foundation of how devices communicate in a network. IP addresses uniquely identify devices, while CIDR helps organize and optimize address allocation. Subnets divide networks for better performance and security, and NICs connect devices to the network.