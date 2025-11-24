+++
title = "Private and Public Networks"
weight = 3
date = 2024-11-19
draft = false
+++

[Watch the presentation]({{< relref "private-and-public-networks-slides.md" >}})

[Se presentationen på svenska]({{< relref "private-and-public-networks-slides-swe.md" >}})

Connecting every device directly to the internet would exhaust available addresses and expose internal systems to unnecessary risk. Network architecture solves this by distinguishing between addresses meant for internal communication and those meant for global connectivity. Understanding how **private networks** and **public networks** differ—and how they connect—reveals fundamental patterns in how infrastructure is organized.

## The Address Space Problem

The internet uses IP addresses to identify every connected device. IPv4 provides approximately 4.3 billion unique addresses, which seemed sufficient when the protocol was designed in the 1980s. The explosive growth of networked devices—computers, phones, servers, IoT sensors—made it clear this space would not last.

Rather than require a globally unique address for every device, networking standards define certain address ranges as **private**. Devices using these addresses can communicate within a local network but cannot route traffic directly across the public internet. This approach preserves public addresses for systems that genuinely need global reachability while allowing unlimited internal addressing.

## Private Networks

A **private network** uses non-routable IP addresses for internal communication. Devices within the network can reach each other using these addresses, but external systems cannot directly initiate connections to them. This isolation provides both a security boundary and address conservation.

### Reserved Address Ranges

RFC 1918 specifies three IP address ranges reserved for private use:

- **10.0.0.0/8** (10.0.0.0 – 10.255.255.255): Approximately 16 million addresses, suitable for large organizations
- **172.16.0.0/12** (172.16.0.0 – 172.31.255.255): Approximately 1 million addresses, often used for medium-sized networks
- **192.168.0.0/16** (192.168.0.0 – 192.168.255.255): 65,536 addresses, common in home and small office networks

These ranges can be reused by any organization. A home network and a corporate data center can both use 192.168.1.0/24 without conflict because the addresses only have meaning within their respective networks. The addresses are non-routable—internet routers discard packets addressed to these ranges, preventing accidental exposure.

### How Private Networks Operate

Consider a home network where multiple devices connect through a router. Each device receives a private IP address—perhaps 192.168.1.10 for a laptop, 192.168.1.20 for a phone, 192.168.1.30 for a printer. These devices communicate with each other using these addresses. The laptop sends a print job to 192.168.1.30, and the printer responds.

When a device needs to access the internet, the router performs **Network Address Translation (NAT)**. The device sends a request from its private address, but the router rewrites the source address to its own public IP before forwarding the packet to the internet. When the response returns, the router translates it back to the internal address and delivers it to the originating device.

This translation allows multiple devices to share a single public IP address. From the perspective of external systems, all requests appear to come from the router's public address. The router maintains a translation table tracking which internal device initiated which connection, ensuring responses reach the correct destination.

### Benefits and Constraints

Private networks provide several operational advantages:

**Address conservation**: Organizations can use as many internal addresses as needed without consuming public IP space. A corporate network with thousands of devices might use only a handful of public addresses.

**Security isolation**: Devices on private networks are not directly reachable from the internet. An attacker scanning public IP addresses will not find internal workstations, reducing the attack surface.

**Flexible addressing**: Private networks can be renumbered or subdivided without coordination with external authorities. Network administrators have complete control over internal address allocation.

The primary constraint is that private addresses cannot be used for services that require direct inbound connectivity from the internet. A web server or email server needs a public address (or NAT port forwarding) to be reachable by external clients.

## Public Networks

A **public network** uses globally unique, routable IP addresses. Any system with internet connectivity can potentially reach these addresses, making them suitable for services that need to be accessible to external users.

### Public IP Address Allocation

Internet Service Providers and cloud providers receive blocks of public IP addresses from regional registries. When you provision a virtual machine in Azure with a public IP, Azure assigns an address from its allocated ranges. This address is unique across the internet—no other device will have the same address at the same time.

Public IP addresses come in two forms:

**Static public IPs** remain constant. A web server with a static IP can be referenced by DNS records that don't need to change. Organizations often purchase static IPs for long-term services.

**Dynamic public IPs** may change when a device disconnects and reconnects. ISPs often assign dynamic IPs to residential connections, where stability is less critical and address reuse improves utilization.

### Connectivity and Exposure

Devices with public IP addresses are globally reachable. Any system that knows the address can attempt to connect, which enables services like web hosting but also requires robust security controls.

A web server listening on port 443 with a public IP will receive connection attempts from legitimate users accessing the website—and from automated scanners probing for vulnerabilities. Without proper configuration, every service running on the server is potentially exposed.

This exposure necessitates defense mechanisms:

**Firewalls** filter incoming connections, allowing only specific ports and protocols. A web server might permit traffic on ports 80 and 443 while blocking all other ports.

**Network security groups** in cloud environments define rules controlling which traffic can reach resources. These rules operate at the network level before traffic reaches the server.

**Intrusion detection** monitors traffic patterns for suspicious activity. Repeated failed login attempts or unusual request patterns might indicate an attack in progress.

Public networks trade accessibility for increased security requirements. Every publicly accessible service needs careful hardening and monitoring.

## Connecting Private and Public Networks

Most infrastructure combines both network types. Internal systems use private addresses for secure communication, while specific services use public addresses for external access.

### Network Address Translation

NAT enables private networks to access the internet while maintaining address isolation. The most common form is **source NAT**, where outbound connections have their source address translated to a public IP.

Consider a corporate network using 10.0.0.0/8 internally. When an employee's workstation at 10.0.5.25 requests a webpage, the network gateway translates the source address to the organization's public IP before forwarding the request. The web server sees the public IP, not the internal address. The response returns to the public IP, and the gateway translates it back to 10.0.5.25.

**Destination NAT** (also called port forwarding) works in reverse. An external user connects to a public IP on a specific port, and the gateway translates the destination to an internal address. This allows hosting services on private addresses while providing public access. A web server at 10.0.2.10 can be accessible via public IP 203.0.113.5 through destination NAT.

### DMZ and Network Segmentation

A **demilitarized zone (DMZ)** is a network segment that sits between the internal private network and the public internet. Systems in the DMZ have public IPs (or NAT mappings) making them accessible from the internet, but they are isolated from internal resources by additional firewall rules.

This architecture limits damage if a public-facing system is compromised. An attacker who compromises a web server in the DMZ gains access to that server but faces another security boundary before reaching internal databases or workstations.

Typical DMZ configurations include:

- Web servers that serve public content
- Application servers that process user requests
- Load balancers that distribute traffic
- API gateways that provide external interfaces

Internal systems like databases, file servers, and employee workstations remain on fully private networks, accessed by DMZ systems through tightly controlled firewall rules that permit only necessary connections.

### Hybrid Cloud Connectivity

Cloud environments often connect to on-premises networks through VPN tunnels or dedicated connections. These links extend the private network across the internet, allowing resources in different locations to communicate using private addresses.

Azure offers **Virtual Network (VNet)** peering and **VPN Gateway** services for this connectivity. A virtual machine in Azure using address 10.1.0.5 can reach an on-premises database at 10.2.0.50 through the VPN tunnel, with all traffic encrypted and treated as internal network communication.

This hybrid model allows organizations to gradually migrate to cloud infrastructure while maintaining connectivity to existing systems. Applications can span environments, accessing resources wherever they reside without exposing internal traffic to the public internet.

## Choosing Between Private and Public Addresses

The decision depends on whether a resource needs to be directly reachable from the internet:

| Requirement | Network Type | Rationale |
|-------------|--------------|-----------|
| Web server for public website | Public IP | Must be reachable by any internet user |
| Application server behind load balancer | Private IP | Receives traffic only from load balancer |
| Database server | Private IP | Should never be directly accessible from internet |
| Jump box for administrative access | Public IP | Entry point for administrators, heavily secured |
| Internal file server | Private IP | Used only by internal systems |
| API gateway | Public IP or NAT | Provides external access to internal services |

Resources that only communicate with other internal systems should use private addresses. Resources that must accept connections from external users need public addresses or NAT configurations.

Even when public access is required, many architectures use private addresses for most components. A load balancer with a public IP distributes traffic to application servers with private IPs. The application servers query databases with private IPs. Only the load balancer needs direct internet exposure; everything else operates on private networks with security groups controlling access.

## Summary

Private networks use non-routable addresses defined in RFC 1918 for internal communication, providing address conservation and security isolation. Public networks use globally unique addresses that enable direct internet connectivity but require robust security controls. Most infrastructure combines both types: internal resources use private addresses, while specific entry points use public addresses with NAT and firewalls managing the connection between them. Understanding this division enables designing networks that balance accessibility with security, exposing only what must be public while protecting internal systems.
