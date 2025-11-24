+++
title = "Private and Public Networks"
weight = 3
date = 2024-11-19
draft = false
hidden = true
+++

[Watch the presentation]({{< relref "private-and-public-networks-slides.md" >}})

[Se presentationen på svenska]({{< relref "private-and-public-networks-slides-swe.md" >}})

<!-- # Private and Public Networks -->

This article explores how private networks create secure, internal communication environments using non-routable IP addresses, while public networks facilitate global connectivity with public IPs. Understanding the unique characteristics, benefits, and challenges of each network type provides valuable insight into their use cases and how they connect with the wider internet.

## What Are Private Networks?

**Private networks** are used for internal communication within an organization or a defined environment, such as a home, office, or data center. Devices on a private network use **non-routable IP addresses**, meaning they cannot directly communicate with external networks or the public internet. This ensures a level of isolation that enhances security and control over data flow.

### Non-Routable IP Ranges

The concept of non-routable IP addresses, also known as **private IP addresses**, was established to support internal network communication without the use of public IPs. These address ranges are defined by **RFC 1918** and include:

- **10.0.0.0 – 10.255.255.255**: A large range suitable for extensive networks with numerous devices.
- **172.16.0.0 – 172.31.255.255**: A range often used for medium-sized networks.
- **192.168.0.0 – 192.168.255.255**: Commonly used in home and small office networks.

Devices within these ranges communicate freely with one another within the network but require a mechanism like **Network Address Translation (NAT)** to connect to the public internet.

### How Private Networks Operate

In a private network, data stays within a secure, internal boundary unless routed externally. For example, a home network might use the **192.168.1.x** range for devices like computers and smartphones. The router performs **NAT**, translating the internal private IPs to a public IP assigned by the Internet Service Provider (ISP). This process enables multiple devices within the network to share a single public IP address when accessing the internet.

### Benefits of Private Networks

- **Enhanced Security**: Devices on private networks are hidden from direct access by external users, reducing exposure to potential threats.
- **IP Conservation**: By using non-routable addresses internally, organizations minimize the need for public IPs, preserving a limited resource.
- **Internal Communication**: Private networks facilitate seamless communication and resource sharing among connected devices within the network.

## What Are Public Networks?

**Public networks** are accessible to any device with an internet connection and use **public IP addresses**. These addresses are unique and globally routable, allowing direct communication between devices across the internet. ISPs and data centers allocate public IPs to users and services that need direct exposure to external networks.

### Public Network Operation and Use Cases

Public networks enable devices and services to be reachable by anyone on the internet. For instance, websites and web applications use public IPs so that users worldwide can access them. While public networks are essential for global communication and accessibility, they come with inherent security risks due to their exposure.

## Security and Access Control

Managing public and private networks often involves striking a balance between accessibility and security. Private networks provide a protective barrier against direct internet access, while public networks require additional security measures, such as firewalls and encryption, to safeguard data.

**Example**

In a corporate environment, internal communication, file sharing, and application hosting may occur on a private network using non-routable IPs. For services that need to be externally accessible, such as a company website, public IP addresses are used. **NAT** and **firewall configurations** can help regulate traffic between private and public network segments, allowing controlled external access while protecting internal resources.

## Conclusion

Private and public networks play distinct roles in how data is managed and shared. Private networks enable secure, internal communication and resource management, while public networks allow external connectivity and global access.