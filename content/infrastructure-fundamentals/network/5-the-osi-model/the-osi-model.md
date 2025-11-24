+++
title = "The OSI Model"
weight = 5
date = 2024-11-19
draft = false
+++

[Watch the presentation]({{< relref "the-osi-model-slides.md" >}})

[Se presentationen på svenska]({{< relref "the-osi-model-slides-swe.md" >}})

Network communication requires coordination across multiple independent concerns: physical signal transmission, routing between networks, reliable delivery, and application-level protocols. The **OSI Model** (Open Systems Interconnection Model) organizes these concerns into seven distinct layers, each handling a specific aspect of network communication. Understanding this layered architecture clarifies how protocols interact and where different network components operate.

## The Seven-Layer Architecture

The OSI Model defines seven layers, numbered from bottom (closest to physical hardware) to top (closest to user applications). Each layer provides services to the layer above it and consumes services from the layer below. This separation allows protocols at one layer to change without affecting other layers, as long as the interface between layers remains consistent.

### Layer 1: Physical Layer

The **Physical Layer** handles the transmission of raw bits over physical media. This layer defines the electrical signals, radio frequencies, or light pulses that represent binary data, along with the physical connectors, cable specifications, and transmission timing.

Network interface cards, Ethernet cables, fiber optic links, and wireless radios all operate at this layer. The Physical Layer has no understanding of addresses, packets, or protocols—it simply transmits and receives streams of bits.

### Layer 2: Data Link Layer

The **Data Link Layer** organizes bits into frames and manages node-to-node data transfer within a single network segment. This layer uses **MAC addresses** (Media Access Control addresses) to identify devices on the local network and includes error detection mechanisms to identify corrupted frames.

Switches operate at Layer 2, forwarding frames based on MAC addresses. When a frame arrives, the switch examines the destination MAC address and forwards it to the appropriate port. This layer also implements protocols like **ARP** (Address Resolution Protocol), which maps IP addresses to MAC addresses within a local network.

### Layer 3: Network Layer

The **Network Layer** enables routing across multiple networks, making internetwork communication possible. This layer uses **IP addresses** to identify devices globally and determines the path packets should take to reach their destination.

Routers operate at Layer 3, examining the destination IP address of each packet and consulting routing tables to forward it toward its destination. The **Internet Protocol (IP)** operates at this layer, defining the addressing scheme and packet structure that enables the global internet.

Layer 3 handles packet fragmentation when data exceeds the maximum transmission size for a network link, and reassembles fragments at the destination. It also implements **ICMP** (Internet Control Message Protocol), which provides network diagnostic capabilities like ping and traceroute.

### Layer 4: Transport Layer

The **Transport Layer** manages end-to-end communication between applications, ensuring data reaches the correct process on the destination machine. This layer uses **port numbers** to distinguish between multiple applications communicating simultaneously on the same host.

Two primary protocols operate at Layer 4, each suited to different communication needs:

**TCP (Transmission Control Protocol)** provides connection-oriented communication with guaranteed delivery. TCP establishes a connection between sender and receiver before transmitting data, tracks each segment with sequence numbers, and requires acknowledgment from the receiver. If segments arrive out of order, TCP reassembles them correctly. If segments are lost, TCP retransmits them. This reliability makes TCP appropriate for applications where data integrity matters: web browsing, file transfers, email, and database queries.

**UDP (User Datagram Protocol)** provides connectionless communication without delivery guarantees. UDP sends datagrams without establishing a connection, without confirming receipt, and without retransmitting lost data. This approach reduces overhead and latency, making UDP suitable for applications where speed matters more than perfect reliability: video streaming, voice calls, online gaming, and DNS queries. These applications can tolerate occasional packet loss—a dropped video frame or a delayed DNS query that gets retransmitted at the application level.

The choice between TCP and UDP depends on application requirements. If data must arrive complete and in order, TCP provides the necessary mechanisms. If low latency matters more than occasional loss, UDP eliminates the overhead of connection management and retransmission.

### Layer 5: Session Layer

The **Session Layer** manages the establishment, maintenance, and termination of sessions between applications. This layer coordinates the dialog between communicating systems, determining whether communication is half-duplex (one direction at a time) or full-duplex (simultaneous bidirectional).

Session management includes handling authentication, maintaining state during a conversation, and recovering from interruptions. In practice, many application protocols implement session management directly rather than relying on a distinct Layer 5 protocol.

### Layer 6: Presentation Layer

The **Presentation Layer** handles data format translation and encryption. Different systems may represent data differently—byte order, character encoding, data compression—and this layer ensures both sides interpret data identically.

Encryption and decryption occur at this layer, translating between plaintext and encrypted formats. Character set conversion, image format handling, and data compression also fall within the Presentation Layer's responsibilities.

Like the Session Layer, many applications integrate presentation concerns directly into the application protocol rather than using separate Layer 6 protocols.

### Layer 7: Application Layer

The **Application Layer** provides network services directly to user applications. This layer implements the protocols that applications use to exchange data across networks.

Several widely-used protocols operate at Layer 7:

**HTTP (Hypertext Transfer Protocol)** governs communication between web browsers and web servers. HTTP defines request methods (GET, POST, PUT, DELETE), status codes (200 OK, 404 Not Found, 500 Server Error), and headers that carry metadata about requests and responses. **HTTPS** adds encryption through **TLS** (Transport Layer Security), protecting data from interception and tampering.

**DNS (Domain Name System)** translates human-readable domain names into IP addresses. When a browser requests `example.com`, a DNS query resolves that name to an IP address that the network layer can route to. DNS operates over both UDP (for standard queries) and TCP (for zone transfers and large responses).

**SSH (Secure Shell)** provides encrypted remote access to command-line interfaces, enabling secure server administration. **FTP (File Transfer Protocol)** and **SFTP (SSH File Transfer Protocol)** handle file uploads and downloads. **SMTP (Simple Mail Transfer Protocol)** manages email transmission between mail servers.

Each protocol defines the message format and exchange patterns specific to its purpose. The Application Layer contains the protocol logic that applications need to communicate, while lower layers handle the mechanics of reliable delivery across networks.

## Load Balancers in the OSI Model

**Load balancers** distribute incoming traffic across multiple servers, improving availability and resource utilization. Load balancers operate at different OSI layers, with Layer 4 and Layer 7 being the most common.

### Layer 4 Load Balancing

A **Layer 4 load balancer** makes routing decisions based on transport layer information: IP addresses and port numbers. The load balancer examines the TCP or UDP header, determines which backend server should receive the connection, and forwards packets to that server.

Layer 4 load balancing operates without examining the actual data being transmitted. The load balancer sees a connection request to port 443 (HTTPS) and routes it to an available web server, but does not inspect the HTTP request within that connection. This approach offers high performance because minimal processing is required—the load balancer works at the network and transport layers without parsing application protocols.

This model suits scenarios where all traffic to a particular port should be handled similarly. If you need to distribute database connections, video streams, or any TCP/UDP traffic across backend servers, Layer 4 load balancing provides efficient routing without application-layer complexity.

### Layer 7 Load Balancing

A **Layer 7 load balancer** makes routing decisions based on application layer content. The load balancer parses the HTTP request, examining the URL path, headers, cookies, and request body to determine where to route the traffic.

This granular inspection enables sophisticated routing logic. A Layer 7 load balancer might:

- Route `/api/*` requests to API servers and `/static/*` requests to content delivery nodes
- Direct requests with specific session cookies to designated servers for session affinity
- Send mobile user-agent requests to mobile-optimized backends
- Perform SSL/TLS termination, decrypting traffic at the load balancer and routing unencrypted traffic to backend servers on a private network

Layer 7 load balancing requires more processing than Layer 4 because the load balancer must parse application protocols. The benefit is flexibility—routing decisions can reflect application logic, not just network addressing.

### Choosing Load Balancer Layers

Layer 4 load balancing provides high throughput and low latency, suitable when traffic to a service should be distributed evenly without content-based routing. Layer 7 load balancing enables application-aware routing at the cost of additional processing overhead.

Many production deployments use both. A Layer 4 load balancer might distribute traffic across multiple Layer 7 load balancers, which then route to specific backend services based on request content. This architecture balances network-level efficiency with application-level intelligence.

## The OSI Model in Practice

The OSI Model provides a conceptual framework rather than a strict implementation blueprint. Real-world protocols do not always map cleanly to single layers—HTTP, nominally a Layer 7 protocol, depends on TCP (Layer 4), IP (Layer 3), and Ethernet (Layer 2), and implementations often combine functionality across layers.

Despite this imprecision, the model remains useful. When troubleshooting network issues, the OSI Model provides a systematic approach: verify physical connectivity (Layer 1), check local network configuration (Layer 2), confirm IP routing (Layer 3), test transport protocols (Layer 4), and examine application behavior (Layer 7). When discussing network architecture, referring to layers clarifies where components operate and which concerns they address.

Understanding the OSI Model enables reasoning about network communication systematically. The layered architecture explains why TCP provides reliability that UDP lacks, how load balancers can operate with or without inspecting application data, and where different protocols fit in the communication stack. This framework helps make informed decisions about protocol selection, network design, and infrastructure architecture.
