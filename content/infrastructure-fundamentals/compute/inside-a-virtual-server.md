+++
title = "Inside a Virtual Server"
weight = 4
date = 2024-11-17
draft = false
hidden = true
+++

[Watch the presentation]({{< relref "inside-a-virtual-server-slides.md" >}})

[Se presentationen på svenska]({{< relref "inside-a-virtual-server-slides-swe.md" >}})

---

Virtual servers offer flexibility and scalability beyond the physical limits of hardware. While physical servers house tangible components like CPUs and RAM, virtual servers present a different structure. It's essential to understand the components inside a virtual server and how they contrast with physical servers. This article dives into what makes up a virtual server. We will also correlate these to the components seen in Azure Virtual Machines (VMs).

## The Virtual Server

A **virtual server** is an emulated computing environment created by software known as a **hypervisor**. It acts like a physical server but runs on shared physical hardware. Key components include virtualized CPUs, RAM, storage, and network interfaces.

1. **Virtual CPUs (vCPUs)**
   - Virtual servers do not have physical CPUs. Instead, they share the resources of the physical CPU in the host machine.
   - vCPUs are mapped to the physical CPU cores by the hypervisor, determining how much processing power the virtual server can access.
   - On Azure VMs, you can choose the number of vCPUs according to performance needs (e.g., General Purpose or Compute Optimized VMs).

2. **Virtual RAM**
   - Like vCPUs, virtual RAM is a portion of the physical server's memory allocated to the virtual machine.
   - The hypervisor manages memory allocation and isolation between VMs.
   - Azure VMs allow you to customize the amount of RAM based on the VM size, impacting the performance and workload capability.

3. **Virtual Storage**
   - Virtual servers use **virtual disks**, which are files that emulate physical hard drives.
   - These disks are stored on the host's physical storage but appear to the VM as independent drives.
   - On Azure, these can be in the form of **Managed Disks** like Standard HDDs, Standard SSDs, or Premium SSDs, offering different performance tiers.

4. **Virtual Network Interface (vNIC)**
   - A vNIC connects a virtual server to a network, just as a NIC does in a physical server.
   - The hypervisor or cloud platform ensures that each VM has its own network identity and manages traffic routing.
   - Azure VMs are connected to **Virtual Networks (VNets)**, enabling secure communication and network configurations.

5. **Hypervisor**
   - The software layer that enables virtualization, managing resources between physical and virtual servers.
   - Divided into **Type 1 (bare-metal)** hypervisors, which run directly on hardware, and **Type 2 (hosted)** hypervisors, which run on an existing OS.
   - On Azure, the hypervisor is part of Microsoft's cloud infrastructure, abstracting physical server resources and providing virtual environments.

## Key Differences Between Physical and Virtual Servers

Physical and virtual servers have distinct roles and characteristics that shape how they are used in IT infrastructure. One major difference lies in **resource sharing**. Physical servers dedicate their entire set of resources—CPU, RAM, and storage—to a single environment, providing consistent performance but limiting flexibility. In contrast, **virtual servers** share the resources of a physical server across multiple virtual machines (VMs), optimizing hardware usage and enabling better efficiency.

**Scalability** is another critical factor. Virtual servers offer flexibility by allowing easy scaling of resources such as vCPU, RAM, and storage. This adaptability is exemplified by platforms like Azure, where virtual machines can be resized dynamically to meet changing workloads. Physical servers, on the other hand, often require significant investment and effort to scale, such as adding or upgrading hardware components.

When it comes to **maintenance and cost**, physical servers require direct hardware management and significant upfront investment, including ongoing maintenance and physical space considerations. In contrast, virtual servers benefit from reduced costs and simplified management, as they leverage shared physical infrastructure managed by cloud service providers like Azure. This approach minimizes the need for hands-on hardware oversight, shifting the responsibility to the provider and making server management more efficient and cost-effective.

## Components in Azure VMs

Azure VMs emulate physical servers with virtual components, making it easy for IT teams to deploy and manage servers without dealing with physical hardware:

- **Customizable vCPU and RAM**: Choose from a wide range of VM series based on workload (e.g., B-series for burstable workloads, D-series for general-purpose).
- **Virtual Disks**: Use Azure Managed Disks to optimize performance based on storage needs.
- **Networking**: Integrate with VNets, Network Security Groups (NSGs), and other Azure networking tools to manage traffic and enhance security.
- **Management Tools**: Azure includes tools like **Azure Monitor** and **Azure Resource Manager (ARM)** templates for automated and scalable server deployment and monitoring.

## Conclusion

Virtual servers bring a new dimension of flexibility and resource efficiency compared to physical servers. By virtualizing components such as vCPUs, virtual RAM, and virtual storage, VMs provide a scalable, cost-effective alternative to traditional hardware.
