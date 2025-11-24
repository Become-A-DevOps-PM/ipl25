+++
title = "Common Server Roles"
weight = 2
date = 2024-11-17
draft = false
+++

[Watch the presentation]({{< relref "common-server-roles-slides.md" >}})

[Se presentationen på svenska]({{< relref "common-server-roles-slides-swe.md" >}})

---

Infrastructure supporting applications requires servers that perform specific functions. Rather than building monolithic systems that handle everything, organizations deploy servers with defined roles—each optimized for a particular task. Understanding these roles clarifies how components of a system interact and helps inform architectural decisions.

This article surveys common server roles and examines four in detail: web servers, application servers, reverse proxies, and bastion hosts.

## Overview of Server Roles

Servers are categorized by the services they provide. The following roles appear frequently in infrastructure:

**Database Server** - Stores, retrieves, and manages structured data. Enforces data integrity and handles concurrent access from multiple clients. Examples: PostgreSQL, MySQL, Microsoft SQL Server.

**File Server** - Provides centralized file storage accessible across a network. Manages permissions and access control for shared resources. Examples: Windows File Server, Samba, NFS.

**Mail Server** - Handles email operations including sending, receiving, routing, and storing messages. Examples: Microsoft Exchange Server, Postfix.

**DNS Server** - Translates domain names into IP addresses, enabling clients to locate services using human-readable names. Examples: BIND, Microsoft DNS Server.

**DHCP Server** - Dynamically assigns IP addresses to devices on a network, eliminating manual IP configuration. Examples: Windows DHCP Server, ISC DHCP.

**Virtualization Server** - Hosts and manages virtual machines, allowing multiple isolated environments on shared physical hardware. Examples: VMware ESXi, Microsoft Hyper-V.

**Backup Server** - Manages data backup and recovery operations, protecting against data loss. Examples: Veeam Backup & Replication, Acronis Backup.

**Monitoring Server** - Tracks the health and performance of systems and network devices, generating alerts when issues occur. Examples: Nagios, Zabbix, Prometheus.

**Domain Controller** - Manages user authentication and access control within a network, centralizing identity management. Example: Active Directory Domain Services.

These roles represent common patterns, not an exhaustive list. Many specialized roles exist for specific use cases—game servers, media servers, print servers, and others.

## Web Servers

A **web server** accepts HTTP and HTTPS requests from clients and returns responses. When a browser requests a URL, the web server receives that request, locates the appropriate content, and sends it back.

Web servers handle two categories of content. **Static content**—HTML files, CSS, JavaScript, images—is served directly from disk. The server retrieves the file and transmits it without modification. **Dynamic content** requires processing; the web server delegates these requests to an application server or executes server-side code to generate the response.

Web servers manage many concurrent connections efficiently. They implement connection pooling, keep-alive connections, and event-driven architectures to handle thousands of simultaneous clients. Additional capabilities include:

- **SSL/TLS termination**: Encrypting and decrypting HTTPS traffic
- **Response compression**: Reducing bandwidth through gzip or Brotli encoding
- **Caching**: Storing frequently requested content to reduce backend load
- **Request routing**: Directing traffic to different backends based on URL patterns

nginx and Apache HTTP Server are the most widely deployed web servers. nginx uses an event-driven architecture that handles high concurrency with low memory usage. Apache uses a process-based or threaded model with extensive module support.

## Application Servers

An **application server** executes business logic and generates dynamic content. While web servers efficiently deliver static resources, application servers process requests that require computation—form submissions, database queries, API calls, and workflow execution.

Application servers provide the runtime environment for application code. For Python applications, servers like Gunicorn or uWSGI manage worker processes that execute Flask or Django code. For Java applications, servers like Tomcat or WildFly provide the servlet container and enterprise features.

The application server handles:

- **Request processing**: Receiving requests from the web server, executing application code, returning responses
- **Database connectivity**: Managing connection pools to database servers
- **Session management**: Tracking user state across requests
- **Resource management**: Allocating memory, threads, and other resources to handle concurrent requests

Application servers typically sit behind web servers in a deployment architecture. The web server handles SSL termination, static content, and request routing, then forwards dynamic requests to the application server. This separation allows each component to be optimized and scaled independently.

When traffic increases, application servers scale horizontally. Additional instances are deployed behind a load balancer, distributing requests across the pool. Stateless application design—where requests contain all necessary context—enables this scaling pattern.

## Reverse Proxies

A **reverse proxy** sits between clients and backend servers, receiving client requests and forwarding them to the appropriate backend. Unlike a forward proxy (which acts on behalf of clients), a reverse proxy acts on behalf of servers.

Clients connect to the reverse proxy, which then establishes separate connections to backend servers. The response flows back through the proxy to the client. From the client's perspective, the proxy appears to be the origin server.

Reverse proxies provide several capabilities:

**Load balancing** - Distributes incoming requests across multiple backend servers. Algorithms include round-robin, least connections, and weighted distribution. If a backend becomes unavailable, the proxy routes traffic to healthy servers.

**SSL termination** - Handles encryption and decryption at the proxy layer, offloading this CPU-intensive work from backend servers. Internal traffic between proxy and backends can use unencrypted HTTP.

**Caching** - Stores responses from backends and serves them directly for subsequent identical requests. Reduces load on application servers and improves response times.

**Request routing** - Directs requests to different backends based on URL path, headers, or other criteria. Enables microservice architectures where different services handle different endpoints.

**Security filtering** - Inspects requests and blocks malicious traffic. Protects against common attacks and hides backend server details from clients.

nginx, HAProxy, and Apache (with mod_proxy) are commonly used as reverse proxies. Cloud platforms provide managed reverse proxy services—Azure Application Gateway, AWS Application Load Balancer—that integrate with their infrastructure.

## Bastion Hosts

A **bastion host** provides secure administrative access to servers in a private network. Servers handling application traffic should not be directly accessible from the internet for administrative purposes. A bastion host creates a controlled entry point for administrators.

The architecture places the bastion host in a position where it can receive connections from external networks and connect to internal servers. Administrators SSH or RDP to the bastion host, then connect from there to target servers. The bastion host is the only server with both external accessibility and internal network access for administration.

This approach provides several security benefits:

**Reduced attack surface** - Internal servers have no administrative ports exposed to the internet. Only the bastion host requires hardening against external attacks.

**Centralized access control** - Authentication and authorization for administrative access occur at a single point. Multi-factor authentication can be enforced at the bastion.

**Audit logging** - All administrative sessions pass through the bastion, creating a single location for logging and monitoring access patterns.

**Network isolation** - Private servers can reside in subnets with no internet gateway. The bastion provides the only path for administrative access.

Bastion hosts require careful hardening: minimal installed services, strong authentication (typically SSH keys with MFA), aggressive logging, and regular patching. They represent a high-value target—their compromise grants access to the internal network.

Cloud platforms offer managed bastion services. Azure Bastion provides browser-based RDP/SSH access to VMs without exposing public IPs on those VMs. AWS Systems Manager Session Manager provides similar functionality. These services eliminate the need to manage bastion host infrastructure while maintaining the security model.

## How These Roles Interact

A typical web application deployment combines these roles. Clients connect to a reverse proxy, which terminates SSL and routes requests. Static content is served directly; dynamic requests forward to application servers. Application servers execute business logic, querying database servers for data. Administrators access any of these servers through a bastion host.

Each role can be deployed on separate infrastructure or combined on fewer servers depending on scale and requirements. Small deployments might run nginx (as both web server and reverse proxy), Gunicorn, and PostgreSQL on a single VM with a separate bastion for access. Large deployments separate these roles across multiple servers, allowing independent scaling and fault isolation.

Understanding server roles enables matching infrastructure components to their functions and making informed decisions about deployment architecture.
