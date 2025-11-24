+++
title = "Network Intermediaries"
weight = 6
date = 2024-11-19
draft = false
+++

[Watch the presentation]({{< relref "network-intermediaries-slides.md" >}})

[Se presentationen på svenska]({{< relref "network-intermediaries-slides-swe.md" >}})

Network traffic between clients and servers rarely flows directly. Intermediary systems intercept, route, and manage this traffic to improve security, performance, and reliability. Understanding these intermediaries—proxies, reverse proxies, load balancers, and bastion hosts—enables informed decisions about network architecture and traffic management.

## The Role of Network Intermediaries

A **network intermediary** is any device or service positioned between clients and servers to manage the traffic passing through. Rather than clients connecting directly to servers, requests pass through one or more intermediaries that perform specific functions: routing traffic to appropriate destinations, distributing load across multiple servers, filtering potentially harmful requests, caching frequently accessed content, or hiding internal infrastructure details.

This indirect routing adds value in several ways. Intermediaries can inspect and modify traffic, making security and performance decisions that individual clients and servers cannot coordinate on their own. They can aggregate and distribute traffic, preventing individual servers from becoming overwhelmed. They can provide a stable access point even as backend infrastructure changes. These capabilities make intermediaries fundamental components of production network architecture.

## Proxy Servers

A **proxy server** mediates between clients and external servers. When a client makes a request—accessing a website, downloading a file, or calling an API—the request goes to the proxy first. The proxy forwards the request to the target server, receives the response, and relays it back to the client.

This arrangement serves several purposes. The proxy can enforce access policies, blocking requests to specific domains or content types. It can cache responses, serving subsequent requests for the same content directly from its storage rather than forwarding them to the external server. It can log all outbound traffic, providing visibility into client behavior. It can modify requests, adding authentication headers or stripping identifying information.

From the external server's perspective, requests appear to originate from the proxy, not from the individual clients behind it. This masks client IP addresses and other identifying details, providing a degree of anonymity. Corporate networks commonly deploy proxies to control employee internet access, monitor usage, and enforce content filtering policies.

The proxy operates on the client side of the connection. Clients know they are using a proxy—their network configuration explicitly directs traffic through it. This distinguishes proxies from reverse proxies, which operate transparently from the client's perspective.

## Reverse Proxies

A **reverse proxy** sits in front of backend servers, intercepting inbound client requests before they reach the actual application servers. Unlike a proxy that clients configure explicitly, a reverse proxy operates transparently. Clients believe they are connecting directly to the target server; they have no awareness that an intermediary stands between them.

Reverse proxies perform several critical functions. They can distribute incoming requests across multiple backend servers, preventing any single server from becoming a bottleneck. They can handle SSL/TLS termination, decrypting HTTPS traffic at the reverse proxy and using unencrypted HTTP for communication with backend servers. This offloads the computational overhead of encryption from application servers. They can cache responses for frequently requested content, reducing load on backend servers and improving response times. They can inspect requests and block those that appear malicious, providing a security layer before traffic reaches application code.

From the client's perspective, the reverse proxy is the server. The client connects to a single address, and the reverse proxy determines which backend server should handle each request. This abstraction allows backend infrastructure to change—servers can be added, removed, or replaced—without affecting clients. The reverse proxy maintains a stable interface while the implementation behind it evolves.

Web servers like nginx commonly serve as reverse proxies. In a typical configuration, nginx receives all incoming HTTP/HTTPS traffic, serves static files directly, and forwards application requests to backend processes running Flask or another application framework.

## Load Balancers

A **load balancer** distributes incoming traffic across multiple servers, ensuring that no single server handles a disproportionate share of requests. This distribution improves both performance and availability. If traffic exceeds a single server's capacity, multiple servers working in parallel can handle the load. If one server fails, the load balancer routes traffic to remaining healthy servers.

Load balancers operate at different network layers, and the layer determines what information they use to make routing decisions.

### Layer 4 Load Balancers

A **Layer 4 load balancer** operates at the transport layer of the network stack. It makes routing decisions based on IP addresses and TCP/UDP port numbers, without examining the content of packets. When a connection arrives, the load balancer selects a backend server using an algorithm—round-robin, least connections, or source IP hashing—and forwards all packets in that connection to the chosen server.

Layer 4 load balancing is fast because it requires minimal packet inspection. The load balancer does not need to understand HTTP, decrypt SSL, or parse application-level data. It simply routes packets based on connection parameters available in transport layer headers.

Azure Load Balancer operates at Layer 4, distributing traffic based on source IP, source port, destination IP, destination port, and protocol type. It suits workloads where connection-level distribution suffices and application-level decisions are unnecessary.

### Layer 7 Load Balancers

A **Layer 7 load balancer** operates at the application layer. It understands application protocols like HTTP and can make routing decisions based on request content: URL paths, HTTP headers, cookies, or request methods.

This capability enables more sophisticated routing. A Layer 7 load balancer can send requests for `/api/` to one set of servers and requests for `/images/` to different servers optimized for serving static content. It can route users to specific servers based on session cookies, ensuring that a user's requests consistently reach the same backend. It can inspect requests for signs of attacks—SQL injection attempts, cross-site scripting—and block them before they reach application servers.

Layer 7 load balancing requires more processing because the load balancer must decrypt SSL, parse HTTP, and evaluate routing rules against request content. This overhead is justified when application-aware routing improves system performance or enables advanced traffic management.

Azure Application Gateway provides Layer 7 load balancing with capabilities including URL-based routing, SSL termination, and web application firewall (WAF) functionality.

### Load Balancing Algorithms

Load balancers use various algorithms to select which backend server should handle each request:

- **Round-robin**: Cycles through available servers in sequence. Simple and effective when all servers have similar capacity.
- **Least connections**: Routes new requests to the server currently handling the fewest active connections. Useful when request processing times vary significantly.
- **IP hash**: Selects a server based on the client's IP address, ensuring the same client consistently reaches the same server. Supports session persistence without requiring application-level session management.
- **Weighted algorithms**: Assigns different weights to servers based on capacity, routing more traffic to more powerful servers.

The choice of algorithm depends on application characteristics: whether servers have equivalent capacity, whether session state must persist, and how request processing times vary.

## Bastion Hosts

A **bastion host** provides controlled access to servers within a private network. Administrative access to production servers typically requires SSH or RDP connections, but allowing direct internet access to these protocols exposes servers to attack. A bastion host solves this by serving as a hardened, single-purpose gateway.

The bastion host sits in a **demilitarized zone (DMZ)**—a network segment positioned between the public internet and the internal private network. Administrators connect to the bastion host from the internet, then from the bastion host connect onward to servers in the private network. Internal servers accept administrative connections only from the bastion host's IP address, not from the general internet.

This architecture reduces attack surface. Only one system—the bastion host—exposes administrative interfaces to the internet, and that system can be hardened specifically for this purpose: minimal software installed, strict firewall rules, comprehensive logging, and possibly multi-factor authentication. If an attacker compromises the bastion, they gain only the ability to access the private network—they do not immediately gain control of application servers.

Azure Bastion provides bastion host functionality as a managed service. Rather than maintaining a VM for this purpose, Azure Bastion integrates with the Azure portal to provide browser-based SSH and RDP access to VMs in a virtual network. This eliminates the need to expose VMs to the public internet while still allowing administrative access.

## Comparing Network Intermediaries

While these intermediaries share some capabilities—all sit between clients and servers, all can filter traffic—their primary purposes differ:

| Intermediary | Direction | Primary Purpose | Key Capabilities |
|--------------|-----------|-----------------|------------------|
| Proxy | Outbound (client to internet) | Access control, content filtering, caching | Anonymity, logging, policy enforcement |
| Reverse Proxy | Inbound (internet to server) | Request routing, SSL termination, caching | Backend abstraction, security, performance |
| Load Balancer | Inbound (internet to servers) | Traffic distribution across multiple servers | High availability, horizontal scaling |
| Bastion Host | Inbound (internet to private network) | Secure administrative access | Access control, reduced attack surface |

These roles can overlap. A reverse proxy can perform load balancing. A load balancer can cache content. Nginx serves as both a web server and a reverse proxy. The distinctions matter not for categorization but for understanding what problems each intermediary solves and when to deploy it.

## Use Cases in Production Architecture

### Content Delivery Networks

**Content Delivery Networks (CDNs)** rely on reverse proxies and load balancers distributed geographically. When a user requests content, the CDN's DNS returns the IP address of the nearest edge server. That server acts as a reverse proxy, either serving cached content directly or forwarding the request to origin servers. Load balancers distribute traffic among multiple edge servers in each location and across multiple origin servers in the backend.

This architecture reduces latency because content travels shorter distances. It improves availability because CDN infrastructure absorbs traffic spikes that might overwhelm a single origin server. It improves performance because edge servers cache static content, eliminating repeated origin requests for the same files.

### Enterprise Network Security

Corporate environments commonly deploy forward proxies to manage outbound internet access. All employee traffic flows through the proxy, which enforces content filtering policies—blocking access to specific domains or content categories—and logs all requests for security auditing. This visibility enables detecting compromised machines that attempt to contact command-and-control servers or exfiltrate data.

Proxies can also enforce authentication, requiring users to authenticate before accessing external resources. This ties network activity to specific users, improving accountability and enabling user-specific access policies.

### Web Application Security

Reverse proxies often integrate with **Web Application Firewalls (WAFs)** to inspect and filter HTTP/HTTPS traffic. The reverse proxy terminates SSL connections, making request content available for inspection. The WAF examines requests against rules designed to detect common attacks: SQL injection attempts, cross-site scripting, path traversal, and malformed requests exploiting known vulnerabilities.

When a request matches an attack pattern, the WAF blocks it before the request reaches application code. This defense-in-depth approach protects against both known vulnerabilities and zero-day exploits targeting common attack vectors. Azure Application Gateway includes WAF functionality, combining Layer 7 load balancing with security filtering.

### High Availability Architectures

Production systems combine multiple intermediaries to achieve high availability. A Layer 7 load balancer receives all incoming traffic and distributes it across multiple reverse proxies. Each reverse proxy manages a set of application servers. Database connections flow through a separate Layer 4 load balancer that routes to primary and replica database servers.

This layered architecture ensures that failure of any single component does not take down the entire system. Load balancers monitor backend health, removing failed instances from rotation automatically. New instances can be added without disrupting existing traffic. The combination of distribution and redundancy enables both horizontal scaling and resilience.

## Summary

Network intermediaries—proxies, reverse proxies, load balancers, and bastion hosts—provide essential capabilities for secure, performant, and reliable network architecture. Proxies control and monitor outbound traffic. Reverse proxies abstract and protect backend infrastructure. Load balancers distribute traffic to prevent overload and maintain availability. Bastion hosts secure administrative access to private networks. Understanding when and how to deploy these intermediaries enables building infrastructure that scales with demand and withstands component failures.
