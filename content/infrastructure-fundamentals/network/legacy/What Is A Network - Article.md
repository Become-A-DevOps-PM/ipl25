+++
title = "What is a Network?"
weight = 1
date = 2024-11-19
draft = false
hidden = true
+++


[Watch the presentation]({{< relref "what-is-a-network-slides.md" >}})

[Se presentationen på svenska]({{< relref "what-is-a-network-slides-swe.md" >}})

<!-- # What is a Network? -->

A network is an interconnected system of devices designed to facilitate communication, data exchange, and resource sharing. Networks play a critical role in IT infrastructure, supporting everything from basic file sharing to the operation of complex distributed applications and services.

## Core Functions of a Network

A network connects multiple devices, called nodes, to allow for seamless data transmission. This data travels in packets, which are routed to their destination through network devices. Routers manage inter-network traffic, ensuring data flows between different networks, while switches control intra-network data transfer within the same network.

Communication within a network relies on protocols such as **TCP/IP** and **HTTP**, which establish the rules for formatting, transmitting, and receiving data to maintain consistency and security.

### Key Characteristics of a Network

1. **Connectivity**: Infrastructure nodes (routers, switches, etc.) connect devices within a network or between networks, ensuring efficient communication paths.
   
2. **Data Transmission**: Networks facilitate the transmission of data between devices through routing and switching. Data is sent in packets that are addressed and directed to the appropriate recipient. Routers handle this for inter-network traffic, while switches manage intra-network traffic. Load balancers distribute traffic evenly across compute resources.

3. **Protocols**: Networks operate using communication protocols (rules) like **TCP/IP** and **HTTP** to ensure data is transmitted correctly and securely.

5. **Security**: Networks implement security mechanisms, such as firewalls, IDS/IPS, encryption, and access control, to protect data and devices from unauthorized access and cyberattacks.

6. **Service-Oriented**: Networks provide services such as internet access, file sharing, and application hosting to connected devices.

## Key Network Infrastructure Components

1. **Routers**:
   - Routers direct data between different networks and determine the optimal path for data to travel, often connecting local area networks (LANs) to wide area networks (WANs). Operating at the **network layer** of the OSI model, routers use IP addresses to forward packets to their destination.

2. **Switches**:
   - Switches function within a local network (LAN) to forward data between devices based on **MAC addresses**. Unlike routers, switches do not facilitate communication between different networks; instead, they ensure efficient data transfer within the same network. They work at the **data link layer** of the OSI model.

3. **Firewalls**:
   - Firewalls safeguard the network by monitoring and managing incoming and outgoing traffic according to predefined security rules. They help block unauthorized access and defend against cyber threats. Firewalls can operate at different layers, from Layer 3 (network layer) to Layer 7 (application layer), depending on their configuration.

4. **Wireless Access Points**:
   - Wireless access points provide connectivity for wireless devices, enabling them to join a wired network. These devices manage radio signals and facilitate communication, typically operating at the edge of the network infrastructure.

5. **Intermediaries**:
   - **Load Balancers**: Distribute network traffic among multiple servers to prevent any single server from becoming overloaded, enhancing system availability and reliability. Load balancers function at Layer 4 (transport) or Layer 7 (application) of the OSI model.
   
   - **Reverse Proxies**: Serve as intermediaries that forward client requests to backend servers, providing functions such as load balancing, SSL termination, and caching. Reverse proxies enhance security and performance by managing traffic and hiding the backend infrastructure.
   
   - **Bastion Hosts**: Specialized servers that provide secure access to a private network from an external one. Bastion hosts act as gateways for administrators, offering a controlled entry point for managing internal resources while protecting the network from external threats.

## Network Topologies

The arrangement of devices in a network, known as its topology, plays an important role in how data is managed and transmitted. Each topology has unique characteristics that affect network performance, reliability, and scalability:

- **Bus Topology**: All devices share a single communication line. This simple layout is cost-effective but can lead to performance issues if many devices are active simultaneously.
- **Star Topology**: Devices connect to a central hub. This structure is easy to manage and isolates faults effectively, but failure of the central hub can disrupt the entire network.
- **Ring Topology**: Devices are connected in a circular format, allowing data to move in one or both directions. It offers efficient data transmission but can be affected by a single point of failure unless redundancy is built in.
- **Mesh Topology**: Each device is connected to multiple others, providing multiple data paths. This setup enhances reliability and redundancy but can be complex and costly to implement.
- **Hybrid Topology**: Combines elements of different topologies, balancing efficiency, resilience, and scalability to suit specific network needs.

**Star topology** dominates on-premises setups for its simplicity and effective fault isolation, while **mesh topology** is prominent in cloud environments for its robustness and support for distributed applications and services.

## Levels of Abstraction inNetworking

Networks today operate across multiple levels of abstraction, from physical hardware to fully virtualized environments:

- **Physical Layer**: The most tangible level, involving cables, routers, and switches that carry data signals through wired or wireless media.
- **Virtual Network Layer**: This layer abstracts physical infrastructure to create isolated network segments using technologies like **VLANs** and **VPNs**, enabling more flexible and scalable network designs.
- **Cloud Network Layer**: In cloud-based networks, platforms like **Azure VNets** and **AWS VPCs** offer managed and software-configured networking solutions that provide secure, scalable connectivity without direct hardware management.
- **Serverless Networking**: In serverless environments, such as **AWS Lambda** and **Azure Functions**, networking is managed behind the scenes by the cloud provider. This abstraction automates routing, security, and scaling, freeing users from manual configuration.

## Security in Network Infrastructure

Network security is a critical component in safeguarding data and preventing unauthorized access. Firewalls, intrusion detection systems (IDS), and encryption protocols form a multi-layered approach to protecting network traffic and maintaining data integrity. These mechanisms help prevent breaches and ensure the network functions reliably and securely.

### Conclusion

Understanding networks is essential for connecting devices and enabling communication and data sharing. Knowing the different components, from physical infrastructure like cables and routers to virtual and cloud-based setups, helps create networks that support reliable connectivity, scalability, and security.