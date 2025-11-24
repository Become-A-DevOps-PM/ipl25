+++
title = "Firewalls"
weight = 4
date = 2024-11-19
draft = false
hidden = true
+++

[Watch the presentation]({{< relref "firewalls-slides.md" >}})

[Se presentationen på svenska]({{< relref "firewalls-slides-swe.md" >}})

<!-- # Firewalls -->

Firewalls acts as a protective barrier between trusted internal networks and untrusted external ones, such as the internet. By filtering and controlling the flow of network traffic based on predefined security rules, firewalls help prevent unauthorized access, cyberattacks, and other potential threats. Their primary function is to allow legitimate traffic while blocking any harmful or unauthorized data.

## How Firewalls Work

Firewalls inspect data packets as they enter or exit a network, deciding whether to permit or block them based on a set of rules. These rules specify criteria such as **source and destination IP addresses**, **ports**, and **protocols**. Firewalls can operate at various layers of the network stack, from analyzing individual packets to monitoring entire network sessions and applications.

## Ports and Their Relationship with Firewalls

Ports are logical endpoints used to identify services or applications that data packets are intended for. For example, web traffic typically uses **port 80** for HTTP and **port 443** for HTTPS. When a firewall inspects traffic, it checks the destination port to determine which service is being accessed. Firewalls can block or allow traffic on specific ports to control access to services and enhance security.

**Examples of ports used by some common services**

- **Port 80**: **HTTP (web browsing)** – Used for standard web traffic.
- **Port 443**: **HTTPS (secure web browsing)** – Used for secure web traffic.

- **Port 22**: **SSH (secure remote login)** – Used for secure shell access to remote systems.
- **Port 3389**: **RDP (Remote Desktop Protocol)** – Used for remote desktop access to Windows systems.

- **Port 21**: **FTP (file transfer)** – Used for file transfers.
- **Port 23**: **Telnet** – Used for unencrypted text communications; largely replaced by SSH.

- **Port 53**: **DNS (Domain Name System)** – Used for domain name resolution.

- **Port 25**: **SMTP (email sending)** – Used for sending emails.
- **Port 110**: **POP3 (Post Office Protocol 3)** – Used for retrieving email from a mail server.
- **Port 143**: **IMAP (Internet Message Access Protocol)** – Used for accessing email on a mail server with advanced features.

- **Port 3306**: **MySQL Database** – The default port for MySQL database connections.
- **Port 1433**: **Microsoft SQL Server** – Used for connections to Microsoft SQL Server databases.
- **Port 27017**: **MongoDB** – Used for connections to MongoDB databases.

## Types of Firewalls

1. **Packet-Filtering Firewalls**: These basic firewalls inspect individual packets at the network layer, making decisions based on **IP addresses**, **ports**, and **protocols**. They do not track connections, making them limited in detecting complex threats.
2. **Stateful Inspection Firewalls**: More advanced than packet-filtering firewalls, stateful firewalls monitor the state of active connections and ensure that only traffic matching an established connection is allowed.
3. **Next-Generation Firewalls (NGFWs)**: NGFWs include traditional firewall capabilities with added features like **deep packet inspection**, **intrusion prevention**, and **application awareness**. They operate at the application layer, allowing them to identify and control specific types of traffic.

## Designing Firewall Rules

Firewall rules dictate the conditions under which traffic is allowed or blocked. A standard firewall rule comprises five main elements, known as the **five-tuple**:

- **Source IP Address**: Indicates where the traffic originates.
- **Destination IP Address**: Specifies where the traffic is headed.
- **Source Port**: Identifies the port on the source device.
- **Destination Port**: Determines the service being accessed on the destination device.
- **Protocol**: Defines the transmission protocol, such as **TCP** or **UDP**.

**Example of a Firewall Rule**

Suppose a firewall rule is set to permit internal HTTP traffic from a device within the corporate network with the IP **10.0.1.25** to reach an internal web server with the IP **10.0.2.50**. This rule would be defined as follows:

- **Source IP**: `10.0.1.25`
- **Destination IP**: `10.0.2.50`
- **Source Port**: `Any` (devices typically use ephemeral ports for outgoing connections)
- **Destination Port**: `80` (HTTP)
- **Protocol**: `TCP`

This rule allows traffic from **10.0.1.25** (e.g., an employee's workstation) to access the internal web server at **10.0.2.50** over port **80**. Any traffic that does not match this rule would be blocked by default, ensuring that only permitted internal traffic can access the web server while maintaining security controls across the corporate network.

### Types of Firewall Rules

- **Allow Rules**: Permit traffic based on the specified criteria, such as allowing HTTP traffic from specific IP ranges.
- **Deny Rules**: Block traffic that meets defined conditions, such as preventing all access to **port 22** except from specific IPs to restrict SSH access.
- **Default Rules**: The overarching policy that applies to all traffic not specifically allowed or denied, such as "deny all" or "allow all."

### Best Practices for Firewall Management

Implementing effective firewall rules requires a strategic approach:

- **Follow the Principle of Least Privilege**: Only permit necessary traffic and block all else to minimize exposure to potential threats.
- **Use Specific Rules**: Avoid broad permissions. Specify exact IP ranges, ports, and protocols to control traffic effectively.
- **Enable Logging and Monitoring**: Track which rules are being triggered to identify unusual traffic patterns and potential security incidents.
- **Regularly Update Rules**: Keep firewall configurations up-to-date to adapt to evolving security requirements and new threats.

### Conclusion

Firewalls are essential for securing networks by filtering traffic and enforcing access control. Understanding how they function and how to design effective firewall rules is critical for protecting an organization’s network from unauthorized access and cyber threats.
