+++
title = "IP Addresses and CIDR Ranges"
weight = 2
date = 2024-11-19
draft = false
+++

[Watch the presentation]({{< relref "ip-addresses-and-cidr-ranges-slides.md" >}})

[Se presentationen på svenska]({{< relref "ip-addresses-and-cidr-ranges-slides-swe.md" >}})

Network communication requires a system for uniquely identifying devices and organizing them into manageable groups. IP addresses provide device identification, while CIDR notation enables flexible network organization. Understanding how these elements work together forms the foundation for designing and managing network infrastructure, whether in local environments or cloud platforms like Azure.

## IP Addresses as Device Identifiers

An **IP address** (Internet Protocol address) uniquely identifies a device on a network, enabling precise routing of data between systems. Without this identification system, networks could not deliver packets to their intended destinations—every device would be indistinguishable from every other.

IP addresses come in two formats, each serving the same fundamental purpose but with different address space characteristics.

### IPv4 Addresses

**IPv4** represents addresses as four decimal numbers separated by dots, such as **192.168.1.1**. Each number (called an octet) ranges from 0 to 255, representing 8 bits of binary data. The complete address consists of 32 bits, providing approximately 4.3 billion possible addresses.

This address space proved insufficient as internet-connected devices proliferated. The exhaustion of available IPv4 addresses drove the development of techniques like Network Address Translation (NAT) and eventually the creation of IPv6.

IPv4 addresses are categorized as **public** or **private**. Public addresses route across the internet and must be globally unique. Private addresses exist within local networks and can be reused across different organizations. The private address ranges are:

- **10.0.0.0 to 10.255.255.255** (10.0.0.0/8)
- **172.16.0.0 to 172.31.255.255** (172.16.0.0/12)
- **192.168.0.0 to 192.168.255.255** (192.168.0.0/16)

Private addresses cannot route directly to the internet. A gateway device using NAT translates private addresses to a public address when traffic leaves the local network.

### IPv6 Addresses

**IPv6** addresses the IPv4 exhaustion problem by using 128 bits instead of 32. Addresses are written as eight groups of four hexadecimal digits separated by colons, such as **2001:0db8:85a3:0000:0000:8a2e:0370:7334**. This format provides approximately 340 undecillion addresses—effectively unlimited for practical purposes.

IPv6 includes notation shortcuts to improve readability. Leading zeros in a group can be omitted, and consecutive groups of zeros can be replaced with a double colon (once per address). The example above becomes **2001:db8:85a3::8a2e:370:7334**.

IPv6 adoption continues gradually. Many networks operate dual-stack configurations, supporting both IPv4 and IPv6 simultaneously during the transition period.

## CIDR Notation for Network Organization

Before CIDR existed, IP addresses were allocated in fixed classes (Class A, B, C) with predetermined network sizes. A Class C network provided 254 usable addresses; a Class B provided 65,534. Organizations that needed more than 254 addresses but far fewer than 65,534 received a Class B allocation, wasting thousands of addresses.

**CIDR (Classless Inter-Domain Routing)** replaced this rigid system with flexible network sizing. CIDR notation expresses an IP address and network size together, written as **192.168.1.0/24**. The number after the slash specifies how many bits (starting from the left) define the network portion of the address. The remaining bits identify individual hosts within that network.

Understanding CIDR requires understanding binary representation. The IPv4 address **192.168.1.0** in binary is:

```
11000000.10101000.00000001.00000000
```

The **/24** indicates that the first 24 bits (the first three octets) represent the network, while the last 8 bits identify hosts. This network can contain 256 total addresses, with 254 usable for hosts (addresses ending in all zeros and all ones are reserved).

### Subnet Masks

A **subnet mask** represents the CIDR network size in dotted decimal notation. For a /24 network, the subnet mask is **255.255.255.0**:

```
11111111.11111111.11111111.00000000
```

The ones correspond to the network portion; the zeros correspond to the host portion. Network devices use the subnet mask in conjunction with the IP address to determine which addresses belong to the local network versus which require routing.

Common CIDR notations and their subnet masks:

| CIDR | Subnet Mask | Usable Hosts |
|------|-------------|--------------|
| /24 | 255.255.255.0 | 254 |
| /25 | 255.255.255.128 | 126 |
| /26 | 255.255.255.192 | 62 |
| /27 | 255.255.255.224 | 30 |
| /28 | 255.255.255.240 | 14 |
| /16 | 255.255.0.0 | 65,534 |
| /8 | 255.0.0.0 | 16,777,214 |

The flexibility to choose any prefix length allows network administrators to allocate address space efficiently, creating networks sized precisely for their requirements.

## Subnets for Network Segmentation

A **subnet** (subnetwork) divides a larger IP address space into smaller segments, each functioning as an independent network. Subnetting serves two primary purposes: improving performance by limiting broadcast domains and enhancing security through network isolation.

When a device broadcasts a message (such as an ARP request to resolve an IP address to a MAC address), every device in the same subnet receives it. Large broadcast domains generate unnecessary network traffic. Dividing a network into smaller subnets limits broadcast propagation to smaller groups of devices.

Subnetting also enables security policies that restrict traffic between network segments. A subnet for guest WiFi devices can be isolated from a subnet containing internal servers. Firewall rules at the subnet boundary control which traffic flows between segments.

### Creating Subnets

Subnetting works by allocating additional bits from the host portion to the network portion. Starting with **192.168.0.0/16** (65,536 addresses), you can create two /17 subnets by using one additional bit:

- **192.168.0.0/17** (192.168.0.0 to 192.168.127.255)
- **192.168.128.0/17** (192.168.128.0 to 192.168.255.255)

Each subnet now contains 32,768 addresses. Further subdivision continues by borrowing more host bits:

- **192.168.0.0/18** (16,384 addresses)
- **192.168.64.0/18** (16,384 addresses)
- **192.168.128.0/18** (16,384 addresses)
- **192.168.192.0/18** (16,384 addresses)

Subnets must not overlap. Each address can belong to only one subnet. Careful planning ensures the address space divides cleanly without conflicts.

### Routing Between Subnets

Devices within the same subnet communicate directly—their NICs transmit packets on the local network segment. Communication between different subnets requires a **router**. The router connects to multiple subnets and forwards packets from the source subnet to the destination subnet based on routing tables.

When a device needs to send a packet to an address outside its local subnet (determined by applying the subnet mask), it sends the packet to its configured **default gateway**—the router's IP address on the local subnet. The router then determines how to forward the packet toward its destination.

## Network Interface Cards

A **Network Interface Card (NIC)** provides the physical or virtual connection between a device and a network. Each NIC has a **MAC address** (Media Access Control address)—a globally unique 48-bit identifier assigned by the manufacturer. The MAC address operates at the data link layer (Layer 2), while IP addresses operate at the network layer (Layer 3).

Within a subnet, devices use both MAC and IP addresses. When a device knows the IP address it wants to reach but needs to deliver the packet on the physical network, it uses the Address Resolution Protocol (ARP) to discover the corresponding MAC address. The device then addresses the Ethernet frame to that MAC address for local delivery.

In virtualized and cloud environments, **virtual NICs (vNICs)** function identically to physical NICs from the software perspective. Each virtual machine or container receives a vNIC with its own MAC address and assigned IP address. Azure virtual machines, for example, can have multiple vNICs attached, each connected to different virtual networks or subnets.

## A Complete Network Example

Consider setting up a network for an organization with three departments that need separate network segments for security and management purposes.

### Network Address Allocation

Start with the private address space **10.0.0.0/16**, providing 65,536 total addresses. This space will be divided into subnets for each department:

- **Human Resources**: 10.0.1.0/24 (254 usable hosts)
- **Engineering**: 10.0.2.0/24 (254 usable hosts)
- **Finance**: 10.0.3.0/24 (254 usable hosts)

Each department subnet receives a /24 network, sufficient for typical departmental device counts while leaving room for future growth in the larger /16 space.

### Device Configuration

Each device in the HR department receives an IP address from the 10.0.1.0/24 range, such as **10.0.1.15**. The device's NIC is configured with:

- **IP Address**: 10.0.1.15
- **Subnet Mask**: 255.255.255.0 (/24)
- **Default Gateway**: 10.0.1.1 (the router interface)

The subnet mask tells the device that addresses from 10.0.1.1 to 10.0.1.254 are local—packets to these addresses transmit directly on the subnet. Any other address requires routing through the gateway.

Engineering devices receive addresses from 10.0.2.0/24, with gateway 10.0.2.1. Finance devices use 10.0.3.0/24 with gateway 10.0.3.1. The router has an interface on each subnet, providing the interconnection point.

### Inter-Subnet Communication

When an HR device at 10.0.1.15 needs to communicate with an Engineering device at 10.0.2.47, the subnet mask tells the HR device that 10.0.2.47 is not local. The HR device sends the packet to its default gateway (10.0.1.1). The router receives the packet, consults its routing table, and forwards it out the interface connected to the Engineering subnet (10.0.2.1). The Engineering device receives the packet.

Security policies can be enforced at the router. Perhaps HR and Finance devices should not communicate directly, but both need access to a shared file server in a separate server subnet (10.0.10.0/24). Access control lists or firewall rules on the router permit the allowed flows and block the prohibited ones.

## Dynamic Host Configuration Protocol

Manually configuring IP addresses, subnet masks, and gateway addresses on every device becomes impractical at scale. **DHCP (Dynamic Host Configuration Protocol)** automates this process.

A **DHCP server** manages a pool of available IP addresses within a subnet. When a device connects to the network, it broadcasts a DHCP discovery message. The DHCP server responds with an IP address offer, along with the appropriate subnet mask, default gateway, and DNS server addresses. The device requests that configuration, and the server confirms the assignment. This exchange takes seconds.

The DHCP server tracks which addresses are assigned and when leases expire. When a device disconnects, its address returns to the available pool for reuse. This dynamic allocation ensures efficient use of the address space—addresses go to devices that currently need them.

In Azure, each virtual network subnet typically has DHCP enabled automatically. When a VM starts, it receives its IP address from Azure's DHCP service. Static IP addresses can also be assigned when specific addresses must not change.

## Summary

IP addresses uniquely identify devices on networks, with IPv4 providing 32-bit addresses and IPv6 providing 128-bit addresses for a vastly larger address space. CIDR notation enables flexible network sizing by specifying how many bits define the network portion versus the host portion of addresses. Subnets divide larger address spaces into manageable segments, improving performance through smaller broadcast domains and enabling security through network isolation. NICs connect devices to networks and carry the MAC addresses used for local delivery within subnets. Routers forward traffic between subnets, enabling communication across network boundaries. DHCP automates the assignment of IP configurations, reducing manual effort and enabling dynamic address management. Together, these components form the foundation of network communication in both traditional and cloud environments.
