+++
title = "What Is A Network"
weight = 1
date = 2024-11-19
draft = false
+++

[Watch the presentation]({{< relref "what-is-a-network-slides.md" >}})

[Se presentationen på svenska]({{< relref "what-is-a-network-slides-swe.md" >}})

Communication between computing devices requires infrastructure that connects them and manages the flow of data. The **network** provides this infrastructure, enabling everything from web browsing to distributed application architectures. Understanding networks involves recognizing both the physical and logical components that move data reliably and securely between systems.

## The Network Concept

A **network** connects computing devices to enable data exchange and resource sharing. These devices, called **nodes**, include servers, workstations, mobile devices, and infrastructure components. Data travels between nodes in discrete units called **packets**, each containing both payload data and routing information.

Networks exist at multiple scales. A **local area network** (LAN) connects devices within a limited geographic area—an office, building, or campus. A **wide area network** (WAN) spans larger distances, connecting multiple LANs across cities or continents. The internet itself is a global network of interconnected networks, using standardized protocols to enable worldwide communication.

The value of networking comes from shared access. Rather than duplicating resources on every device, networks enable centralized servers to provide services that many clients consume. A database server stores authoritative data that applications across the network query. A file server maintains documents that teams collaborate on. A web server delivers content to browsers anywhere in the world.

## Core Network Functions

Networks perform several essential functions that enable reliable communication between distributed systems.

### Connectivity and Routing

**Connectivity** establishes paths between nodes. At the physical layer, this involves cables, wireless signals, and network interfaces. At higher layers, software-defined networking creates logical connections over physical infrastructure.

**Routing** determines the path that packets take through the network. When a packet travels from source to destination, it may pass through multiple intermediate nodes. **Routers** examine packet destination addresses and forward them toward their target, making hop-by-hop decisions that collectively deliver the packet across potentially complex network topologies.

Routers operate at the **network layer** of the OSI model, working with IP addresses to forward traffic between different networks. This enables internetwork communication—connecting a device on one LAN to a server on a different LAN across the internet.

### Switching and Segmentation

Within a local network, **switches** forward traffic between devices based on **MAC addresses**—hardware identifiers assigned to network interfaces. Unlike routers, switches do not route between networks; they efficiently deliver packets to the correct device within the same network segment.

Switches operate at the **data link layer** of the OSI model. When a packet arrives at a switch, the device examines the destination MAC address and forwards the packet only to the port where that device connects. This targeted forwarding reduces unnecessary traffic and improves network performance.

Network segmentation divides a larger network into smaller logical sections. **Virtual LANs** (VLANs) create separate broadcast domains on the same physical infrastructure, isolating traffic for security or performance reasons. Segmentation limits the scope of broadcasts, reduces collision domains, and contains security incidents to specific network sections.

### Protocol-Governed Communication

Networks rely on **protocols**—formal specifications that define how data is formatted, transmitted, and interpreted. Protocols ensure that devices from different manufacturers can communicate by following the same rules.

The **TCP/IP protocol suite** provides the foundation for internet communication. The **Internet Protocol** (IP) handles addressing and routing, ensuring packets reach their destination network. The **Transmission Control Protocol** (TCP) operates above IP, providing reliable delivery through acknowledgments and retransmissions. Together, TCP/IP enables applications to exchange data reliably across interconnected networks.

Application-layer protocols build on this foundation. **HTTP** (Hypertext Transfer Protocol) defines how web browsers request pages and servers respond. **HTTPS** adds encryption through TLS, protecting data in transit. **DNS** (Domain Name System) translates human-readable domain names into IP addresses. Each protocol solves specific communication requirements while relying on lower-layer protocols for packet delivery.

### Traffic Management

As networks grow, managing traffic flow becomes critical to maintaining performance and reliability. Several infrastructure components specialize in traffic management.

**Load balancers** distribute incoming requests across multiple servers, preventing any single server from becoming overwhelmed. When a request arrives, the load balancer selects a backend server based on its configured algorithm—round-robin, least connections, or weighted distribution. This enables horizontal scaling: adding more servers increases capacity without requiring more powerful individual machines.

Load balancers can operate at different layers. Layer 4 load balancers make routing decisions based on IP addresses and TCP ports, while Layer 7 load balancers examine HTTP headers and content to route requests based on URLs, cookies, or other application data.

**Reverse proxies** sit between clients and backend servers, forwarding requests and returning responses. While load balancing is one function they provide, reverse proxies also handle SSL/TLS termination, caching, compression, and content modification. They hide backend infrastructure from clients, presenting a single endpoint that internally routes to multiple services.

### Security Mechanisms

Networks implement multiple security layers to protect data and control access. **Firewalls** monitor traffic and enforce rules about what communications are permitted. A firewall examines packet headers—source and destination addresses, ports, protocols—and allows or blocks traffic based on configured policies.

Firewalls can be stateless or stateful. Stateless firewalls evaluate each packet independently against rules. Stateful firewalls track connection state, understanding the relationship between packets in a session and applying more sophisticated policies. Most production firewalls operate statefully.

**Network security groups** (in cloud environments) function similarly to traditional firewalls but apply rules at the network interface or subnet level. They define inbound and outbound rules that filter traffic before it reaches virtual machines or other resources.

**Intrusion detection systems** (IDS) and **intrusion prevention systems** (IPS) monitor network traffic for suspicious patterns. An IDS alerts administrators to potential attacks; an IPS actively blocks malicious traffic. These systems use signature-based detection (matching known attack patterns) and anomaly detection (identifying unusual behavior).

Encryption protects data as it traverses the network. **TLS** (Transport Layer Security) encrypts application-layer protocols like HTTP, preventing intermediaries from reading or modifying data in transit. **VPNs** (Virtual Private Networks) create encrypted tunnels through untrusted networks, enabling secure remote access to private network resources.

## Network Infrastructure Components

Several specialized devices form the physical and logical infrastructure that networks rely on.

### Routers

Routers connect different networks and determine optimal paths for packet delivery. In a typical enterprise setup, routers connect the local network to the internet, making decisions about whether traffic stays local or travels to external networks.

Routing decisions use **routing tables**—databases of network destinations and the best paths to reach them. Routers learn routes through manual configuration (static routing) or by communicating with other routers using protocols like BGP (Border Gateway Protocol) or OSPF (Open Shortest Path First).

Beyond basic packet forwarding, routers often provide additional services: **Network Address Translation** (NAT) allows multiple devices to share a single public IP address, **DHCP** (Dynamic Host Configuration Protocol) assigns IP addresses to devices joining the network, and packet filtering restricts traffic based on security policies.

### Switches

Switches forward traffic within a local network, learning which devices connect to which ports by observing MAC addresses in packet headers. When a switch receives a packet, it checks its MAC address table to determine the correct outbound port. If the destination is unknown, the switch floods the packet to all ports except the source port; the responding device reveals its location for future packets.

Managed switches offer additional capabilities beyond basic forwarding. VLAN configuration creates logical network segments on the same physical switch. Quality of Service (QoS) settings prioritize certain traffic types—voice or video over bulk data transfers. Port mirroring copies traffic to monitoring tools for analysis. These features enable more sophisticated network designs on the same hardware infrastructure.

### Firewalls

Firewalls control traffic flow based on security policies. Traditional firewalls operate at the network and transport layers (Layers 3-4), filtering based on IP addresses and port numbers. **Application-layer firewalls** (Layer 7) inspect the actual content of packets, understanding protocols like HTTP and enforcing policies based on URLs, methods, or payload content.

**Next-generation firewalls** (NGFW) combine traditional firewall functions with intrusion prevention, application awareness, and threat intelligence. They can identify applications regardless of port (many applications now run over HTTP/HTTPS on standard ports), apply granular policies based on user identity, and block traffic matching known malware signatures.

In cloud environments, firewalls often exist as services rather than physical appliances. Azure Firewall and AWS Network Firewall provide managed filtering for virtual networks, with policies defined through configuration rather than physical device management.

### Wireless Access Points

Wireless access points (APs) bridge wireless devices to wired network infrastructure. They transmit and receive radio signals, enabling laptops, tablets, and phones to connect to the network without physical cables.

Enterprise wireless networks typically deploy multiple access points to provide coverage across a building or campus. Wireless controllers coordinate these APs, managing channel selection to minimize interference, enabling seamless roaming as devices move between APs, and enforcing consistent security policies.

Wireless networks use protocols like WPA3 for authentication and encryption, preventing unauthorized access and protecting data transmitted over radio waves. The trade-off with wireless connectivity is reduced performance compared to wired connections—wireless bandwidth is shared among all devices in range, and radio interference can degrade signal quality.

### Bastion Hosts

A **bastion host** provides secure access to a private network from external networks. Rather than exposing internal servers directly to the internet, administrators connect to the bastion host first, then access internal resources from that controlled entry point.

Bastion hosts implement strict security controls: limited user access, comprehensive logging, no unnecessary services, and often multi-factor authentication. They serve as a chokepoint where all administrative access can be monitored and audited. If internal servers have no direct internet connectivity, compromising them requires first breaching the hardened bastion host.

Cloud platforms offer managed bastion services. Azure Bastion provides RDP and SSH connectivity to virtual machines through the Azure portal without exposing VMs to the public internet. This reduces the attack surface while maintaining administrative access.

## Network Topologies

The physical or logical arrangement of network connections—the **topology**—affects performance, reliability, and scalability. Different topologies suit different requirements.

### Common Topologies

**Bus topology** connects all devices to a single shared cable. Data travels along this backbone, with each device receiving all transmissions and filtering for packets addressed to it. This simple design minimizes cable requirements but suffers from poor fault tolerance (a cable break affects the entire network) and performance degradation as traffic increases.

**Star topology** connects each device to a central hub or switch. Traffic flows through this central point, which forwards packets to their destinations. Star topologies dominate modern LANs because they isolate faults (one failed cable affects only one device) and allow easy addition of new devices. The central device becomes a critical point; its failure disrupts the entire network.

**Ring topology** connects devices in a closed loop, with data traveling in one or both directions around the ring. Each device receives packets and forwards them to the next device. Token Ring networks used this approach, though Ethernet-based star topologies have largely replaced them. Ring topologies provide predictable performance but are vulnerable to cable breaks unless implemented with redundancy.

**Mesh topology** creates multiple connections between devices, providing multiple paths for data to reach its destination. **Full mesh** connects every device to every other device; **partial mesh** selectively creates redundant paths where needed. Mesh topologies maximize reliability—traffic automatically routes around failed links—but require more infrastructure and complex routing.

### Topology and Deployment Environment

Traditional on-premises networks typically use star topologies at the access layer (devices connecting to switches) with redundant links between switches and routers forming partial mesh architectures in the distribution and core layers. This design balances simplicity, cost, and fault tolerance.

Cloud environments inherently implement mesh-like architectures. Virtual networks in Azure or AWS connect through multiple redundant paths across the provider's infrastructure. Traffic between regions traverses the provider's global backbone rather than the public internet, ensuring reliable connectivity with built-in redundancy. Cloud network topologies abstract the underlying complexity, presenting simple virtual network constructs while implementing sophisticated routing underneath.

## Network Abstraction Layers

Networks operate at multiple levels of abstraction, from physical hardware to fully virtualized environments. Understanding these layers helps clarify how modern networks function.

### Physical Networks

The **physical layer** includes tangible infrastructure: Ethernet cables, fiber optic links, network interface cards, switches, and routers. Data travels as electrical signals on copper, light pulses in fiber, or radio waves in wireless systems.

Physical network design considers cable types (copper Cat6 for short distances, fiber for longer runs or higher bandwidth), physical security (protecting equipment from tampering), environmental factors (temperature, power), and physical topology (how cables actually connect devices).

### Virtual Networks

**Virtual LANs** (VLANs) create logical network segments on shared physical infrastructure. A single physical switch can host multiple VLANs, with each VLAN functioning as a separate network. Devices in different VLANs cannot communicate directly, even when connected to the same physical switch, unless a router bridges between the VLANs.

VLANs enable flexible network design. An organization can create separate VLANs for different departments, security zones, or traffic types without requiring separate physical switches for each. VLAN configuration happens through software, making network reorganization faster than rewiring physical connections.

**Virtual Private Networks** (VPNs) create secure tunnels over public networks. A remote worker's laptop establishes an encrypted VPN connection to the corporate network, making the laptop function as if directly connected to the office LAN. The VPN abstracts the underlying internet connection, presenting a logical point-to-point link.

### Cloud Networks

Cloud platforms provide network infrastructure as a service. **Azure Virtual Networks** (VNets) and **AWS Virtual Private Clouds** (VPCs) create isolated network environments where resources communicate as if on a private network, even though they run on shared physical infrastructure.

Cloud networks operate through software-defined networking. Network rules, routing tables, and security policies exist as configuration rather than physical device settings. This enables rapid provisioning—creating a new network with subnets, routing, and security takes minutes through API calls or configuration files.

Cloud networks connect to on-premises infrastructure through VPN gateways or dedicated circuits like Azure ExpressRoute. These hybrid architectures extend private networks into the cloud, enabling applications to span environments while maintaining network security.

### Serverless Networking

In serverless computing environments, networking becomes entirely abstracted. A serverless function executes in response to events, with the platform automatically handling network connectivity, load balancing, and scaling. The function code never explicitly manages network connections; it simply processes requests and returns responses.

This highest level of abstraction removes operational overhead—no configuring subnets, routing tables, or security groups for serverless functions. The trade-off is reduced control. The platform makes networking decisions, which may not suit all application requirements. Serverless works well for event-driven workloads where automatic scaling and minimal operational burden matter more than fine-grained network control.

## Choosing Network Architectures

Network design involves balancing requirements across several dimensions: performance, reliability, security, scalability, and operational complexity. The appropriate architecture depends on specific workload characteristics and organizational constraints.

For applications requiring maximum control and predictable performance, traditional physical networks with dedicated hardware provide complete visibility and tuning capability. When rapid scaling and reduced operational overhead matter more than absolute control, cloud-based virtual networks offer flexibility with managed infrastructure. Most production environments combine approaches—on-premises networks for sensitive systems with regulatory constraints, cloud networks for scalable application tiers, and hybrid connectivity bridging both environments.

Security requirements influence architecture significantly. Applications handling sensitive data may require network segmentation, private connectivity, and hardware security modules. Public-facing applications need protection from DDoS attacks, intrusion attempts, and data exfiltration. Each requirement shapes decisions about firewalls, network boundaries, and traffic inspection.

Understanding network fundamentals—how packets route, how protocols enable communication, how security mechanisms protect traffic—enables evaluating these trade-offs and selecting architectures that match application requirements with available resources and operational capabilities.

## Summary

Networks provide the infrastructure that enables communication between computing devices. They route packets through interconnected devices using protocols that ensure reliable delivery. Network components—routers, switches, firewalls, load balancers—perform specialized functions that collectively enable secure, efficient data transmission. Modern networks exist at multiple abstraction levels, from physical cables and switches to virtual networks and fully managed cloud infrastructure. Understanding these concepts and components enables designing network architectures appropriate to application requirements, balancing performance, security, reliability, and operational considerations.
