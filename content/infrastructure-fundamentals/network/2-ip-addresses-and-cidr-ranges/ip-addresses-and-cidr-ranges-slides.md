
+++
title = "IP Addresses and CIDR Ranges"
type = "slide"
date = 2024-12-02
draft = false
hidden = true

theme = "sky"
[revealOptions]
controls= true
progress= true
history= true
center= true
+++

## What are IP Addresses?
- Unique identifiers for devices in a network.

---

## Types of IP Addresses
- **IPv4**: 32-bit addresses (e.g., 192.168.1.1); widely used.
  - Limited address space; NAT often required.
- **IPv6**: 128-bit addresses (e.g., 2001:0db8:85a3::8a2e:0370:7334); designed for scalability.
  - Vast address space

---

## CIDR (Classless Inter-Domain Routing)
- CIDR simplifies IP address allocation by grouping addresses.
- Represented as `IP/Prefix`, where `Prefix` indicates the subnet size.
- Example: `192.168.1.0/24` represents 256 addresses.
- Example: `192.168.1.1/32` represents 1 addresses.
- Example: `0.0.0.0/0` represents all addresses.

---

## Subnetting with CIDR
- Divides IP ranges into smaller networks.
- Improves network organization and security.
- Reduces waste in address allocation.

---

## Example of CIDR Range
- `192.168.1.0/24`:
  - Subnet contains addresses from `192.168.1.0` to `192.168.1.255`.
  - Supports 256 addresses.

