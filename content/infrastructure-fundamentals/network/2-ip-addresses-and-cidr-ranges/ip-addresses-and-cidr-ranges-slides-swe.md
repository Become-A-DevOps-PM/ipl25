
+++
title = "IP-adresser och CIDR-intervall"
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

## Vad är IP-adresser?
- Unikt ID för noder i ett nätverk.

---

## Typer av IP-adresser
- **IPv4**: 32-bitarsadresser (t.ex. 192.168.1.1); vanligast.
  - Begränsat antal; NAT krävs ofta.
- **IPv6**: 128-bitarsadresser (t.ex. 2001:0db8:85a3::8a2e:0370:7334); skalbarhet.
  - Enormt antal adresser.

---

## CIDR (Classless Inter-Domain Routing)
- CIDR förenklar tilldelning av IP-adresser genom att gruppera adresser.
- Representeras som `IP/Prefix`, där `Prefix` anger subnätets storlek.
- Exempel: `192.168.1.0/24` (256 adresser)
- Exempel: `192.168.1.1/32` (1 adress)
- Exempel: `0.0.0.0/0` (alla adresser)

---

## Subnät med CIDR
- Delar IP-intervall i mindre nätverk.
- Förbättrar nätverksorganisation och säkerhet.
- Minskar slöseri med IP-adresser.

---

## Exempel på CIDR Range
- `192.168.1.0/24`:
  - Subnät innehåller adresser från `192.168.1.0` till `192.168.1.255`.
  - 256 adresser.

