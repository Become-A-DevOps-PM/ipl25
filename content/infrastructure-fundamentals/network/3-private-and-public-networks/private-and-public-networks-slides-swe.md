
+++
title = "Privata och Offentliga Nätverk"
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

## Privata och Publika Nätverk
- Nätverk kategoriseras som **privata** eller **publika** baserat på deras åtkomstmöjligheter.

---

## Vad är ett Privat Nätverk?
- Konceptet "non-routable" IP-adresser.
- Används ofta i företags- och hemnätverk.
- Exempel: **192.168.0.0/16**, **10.0.0.0/8**, **172.16.0.0/12** (RFC 1918-intervall).

- **NAT (Network Address Translation)**:
  - Översätter privata IP till publika IP för internetaccess.

---

## Vad är ett Publikt Nätverk?
- Tillgängligt för alla enheter med internetåtkomst.
- Routbara globalt
- Exempel: Publika IP-adresser som tilldelas av internetleverantörer, t.ex. **8.8.8.8** (Google DNS).
