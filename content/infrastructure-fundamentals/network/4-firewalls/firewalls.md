+++
title = "Firewalls"
weight = 4
date = 2024-11-24
draft = false
+++

[Watch the presentation]({{< relref "firewalls-slides.md" >}})

[Se presentationen på svenska]({{< relref "firewalls-slides-swe.md" >}})

# Firewalls

Networks that connect to the internet face continuous traffic from untrusted sources. Some of this traffic serves legitimate purposes; some attempts to exploit vulnerabilities, probe for weaknesses, or gain unauthorized access to systems. Infrastructure security requires a mechanism to evaluate each incoming and outgoing connection against policy and permit only traffic that meets criteria. The **firewall** implements this traffic control, acting as a barrier between trusted and untrusted networks.

## How Firewalls Make Decisions

A firewall examines each data packet attempting to cross the network boundary and decides whether to permit or block it. This decision follows **rules** defined by network administrators—specifications that describe what traffic is acceptable based on attributes like source and destination addresses, ports, and protocols.

The fundamental mechanism involves inspection and matching. When a packet arrives, the firewall extracts key attributes from the packet headers and compares them against the rule set. If a rule matches and permits the traffic, the packet passes through. If a rule matches and denies the traffic, the firewall drops the packet. If no rule matches, a default policy determines the outcome—typically "deny all" for security.

### The Five-Tuple

Firewall rules commonly use five packet attributes for matching decisions, collectively called the **five-tuple**:

- **Source IP address**: The originating system's network address
- **Destination IP address**: The target system's network address
- **Source port**: The port number on the originating system
- **Destination port**: The port on the target system that identifies the service
- **Protocol**: The transport protocol (typically TCP or UDP)

This combination uniquely identifies network flows. For example, a connection from IP `203.0.113.25` port `54321` to IP `10.0.1.50` port `443` using TCP represents a specific HTTPS connection from an external client to an internal web server.

### Ports and Services

Network services listen on specific **ports**—numeric identifiers that direct traffic to the correct application process. Well-known services use standardized port numbers:

- **Port 22**: SSH (secure remote access)
- **Port 80**: HTTP (web traffic)
- **Port 443**: HTTPS (encrypted web traffic)
- **Port 3306**: MySQL database connections
- **Port 5432**: PostgreSQL database connections

When a firewall rule permits traffic to port 443, it allows HTTPS connections. Blocking port 22 prevents SSH access. Port-based filtering provides coarse-grained control—it grants or denies access to entire services rather than specific operations within those services.

## Firewall Architectures

Different firewall architectures offer varying levels of intelligence about the traffic they inspect. The architecture determines what information the firewall can use to make decisions and what threats it can detect.

### Packet-Filtering Firewalls

**Packet-filtering firewalls** examine individual packets in isolation. They match packets against rules based on the five-tuple attributes, making independent allow/deny decisions for each packet.

This approach executes quickly—the firewall performs simple header inspection without maintaining connection state. However, packet filtering cannot detect certain attack patterns that span multiple packets or verify that traffic legitimately belongs to an established connection. An attacker who can craft packets with spoofed headers might bypass packet-filtering rules.

### Stateful Firewalls

**Stateful firewalls** (or stateful inspection firewalls) track the state of network connections. When an outbound connection initiates, the firewall records it in a state table. Return traffic matching that established connection is permitted automatically, even without an explicit rule allowing inbound traffic.

This approach prevents attackers from sending unsolicited packets that claim to be responses to legitimate connections. If no outbound connection exists in the state table, the firewall rejects the inbound packet regardless of its attributes. Stateful tracking also enables the firewall to verify that TCP connections follow the proper handshake sequence—SYN, SYN-ACK, ACK—rejecting malformed connection attempts.

Most modern firewalls operate statefully by default. The additional context about connection state provides meaningful security value with acceptable performance overhead.

### Next-Generation Firewalls

**Next-generation firewalls** (NGFWs) extend traditional firewall capabilities with application-layer awareness. Rather than making decisions based solely on IP addresses and ports, NGFWs inspect packet contents to identify specific applications, protocols, and even user identities.

An NGFW can distinguish between HTTPS traffic to different destinations—permitting access to approved SaaS applications while blocking social media sites—despite both using port 443. It can detect malware signatures in traffic or identify suspicious patterns indicating attacks. Some NGFWs integrate with identity systems to apply user-specific policies rather than just host-based rules.

This intelligence requires more processing power than stateless or stateful firewalls. NGFWs inspect deep into packet payloads, maintain more extensive state information, and correlate traffic patterns across connections. For networks requiring fine-grained application control or advanced threat detection, this trade-off proves worthwhile.

## Firewall Rules

Rules define the firewall's behavior—what traffic to permit and what to block. Effective rule design requires understanding both the security requirements and the operational needs of the systems being protected.

### Rule Components

A typical firewall rule specifies:

- **Direction**: Whether the rule applies to inbound traffic (entering the network), outbound traffic (leaving the network), or both
- **Source criteria**: IP address or range from which traffic originates
- **Destination criteria**: IP address or range that traffic targets
- **Port and protocol**: Which service the traffic accesses and which protocol it uses
- **Action**: Whether to allow or deny traffic matching these criteria

**Example: Permit web traffic to an internal server**

```
Direction: Inbound
Source: 0.0.0.0/0 (any address)
Destination: 10.0.2.50 (internal web server)
Destination port: 443
Protocol: TCP
Action: Allow
```

This rule permits HTTPS connections from any source to a specific internal server. Traffic to other ports on that server, or to port 443 on other internal systems, would not match this rule and would be evaluated against subsequent rules.

### Rule Ordering

Firewalls process rules in order, applying the action of the first matching rule. Once a match occurs, rule processing stops for that packet. This ordering matters when rules overlap.

A common pattern places specific allow rules first, followed by more general deny rules, with a default deny policy at the end. For example:

1. Allow SSH from specific management IP range
2. Deny SSH from all other sources
3. Allow HTTP/HTTPS from any source
4. Default: Deny all

If the allow SSH rule appears after the deny SSH rule, the allow rule would never execute because the broader deny rule matches first.

### Default Policy

The **default policy** determines what happens to traffic that matches no explicit rule. Two approaches exist:

- **Default deny**: Block all traffic unless explicitly permitted
- **Default allow**: Permit all traffic unless explicitly blocked

Security best practice favors default deny. This approach implements the principle of least privilege—only traffic that meets an approved purpose passes through. If configuration errors leave gaps in the rule set, the default deny policy prevents unauthorized access rather than permitting it by omission.

## Azure Network Security Groups

Cloud platforms implement firewall functionality through services that integrate with their virtual network infrastructure. In Azure, **Network Security Groups** (NSGs) provide stateful packet filtering for virtual machines and subnets.

An NSG contains security rules that allow or deny traffic. These rules use the same five-tuple model—source and destination addresses, ports, and protocols. NSGs apply to network interfaces (protecting individual VMs) or to subnets (protecting all resources within a network segment).

Azure NSG rules include priority numbers. Lower priority values execute first, allowing precise control over rule ordering. This explicit priority system avoids ambiguity about which rule applies when multiple rules could match the same traffic.

NSGs integrate with Azure's service tags and application security groups. Service tags represent groups of Azure service IP addresses, simplifying rules that permit traffic to Azure services without specifying exact IP ranges. Application security groups allow rules based on workload function rather than IP addresses, abstracting network configuration from infrastructure changes.

## Designing Effective Firewall Policies

Firewall configuration reflects security policy—the organization's decisions about what traffic serves legitimate purposes and what traffic presents unacceptable risk. Several principles guide policy design:

**Apply least privilege**: Permit only traffic required for operations. If a database needs connections only from application servers, restrict its firewall rules to that source range rather than permitting access from the entire network.

**Use specific criteria**: Broad rules (permit all traffic from any source) grant more access than necessary. Narrow rules (permit port 5432 from specific application server IPs) limit the attack surface.

**Separate network zones**: Place systems with different security requirements in different network segments with firewalls between them. Web servers in a DMZ (demilitarized zone) can accept internet traffic while database servers in an internal zone accept connections only from the DMZ.

**Log and monitor**: Enable logging for denied traffic to detect attack attempts and for permitted traffic to verify that rules function as intended. Regular review of logs identifies suspicious patterns or configuration errors.

**Test changes**: Firewall misconfigurations can block legitimate traffic or permit unauthorized access. Testing rule changes in a non-production environment or outside business hours reduces risk of disruption.

## Firewalls in Practice

A typical web application deployment uses firewalls at multiple layers:

- **Perimeter firewall**: Controls traffic between the internet and the internal network, permitting only HTTP/HTTPS to web servers
- **Application firewall**: Sits between web servers and application servers, allowing connections only from approved web server IPs
- **Database firewall**: Restricts database access to specific application server addresses on database ports

This defense-in-depth approach limits the impact of compromise. If an attacker gains control of a web server, the application firewall prevents lateral movement to database servers. Each firewall implements the minimum access necessary for that network zone's function.

Cloud deployments often combine NSGs (for host and subnet protection) with cloud provider edge firewalls or third-party NGFW solutions for advanced threat detection and application-layer filtering. The architecture depends on security requirements, compliance constraints, and operational capabilities.

## Summary

Firewalls control network traffic by evaluating packets against defined rules and permitting only traffic that meets security policy. Packet-filtering firewalls inspect individual packets; stateful firewalls track connection state; next-generation firewalls add application awareness and threat detection. Effective firewall configuration requires specific rules, appropriate default policies, and careful consideration of network architecture to implement defense in depth.
