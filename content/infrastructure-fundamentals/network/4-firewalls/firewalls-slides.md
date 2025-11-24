
+++
title = "Firewalls"
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

## What is a Firewall?
- A firewall acts as a security barrier between trusted internal networks and untrusted external ones.
- It monitors and controls incoming and outgoing network traffic based on security rules.

---

## How Firewalls Work
- Examine data packets to decide whether to **allow** or **deny** them.
- Implement rules based on the 5 tuples:
  - **Source/Destination IP**
  - **Source/Destination Port**
  - **Protocol**

---

## Firewall Techniques
1. **Packet Filtering**:
   - Inspects packets individually based on predefined rules.
2. **Stateful Inspection**:
   - Tracks the state of active connections to make more informed decisions.
3. **Next-Generation Firewalls (NGFW)**:
   - Incorporate advanced features like deep packet inspection and intrusion prevention.

---

## Best Practices
- Follow the Principle of Least Privilege: Only permit necessary traffic and block all else
- Use Specific Rules: Specify exact IP ranges, ports, and protocols to control traffic
- Enable Logging and Monitoring: Track which rules are being triggered to identify unusual traffic patterns and potential security incidents.

