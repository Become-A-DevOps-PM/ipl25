
+++
title = "Vad är ett nätverk?"
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

## Vad är ett nätverk?
- Möjliggör kommunikation mellan enheter (noder) i ett nätverk.
- Överför data via routing (mellan nätverk) och switching (inom nätverk).
- Säkerställer att data överförs korrekt och säkert med olika protokoll (t.ex. TCP/IP, HTTP).
- Implementerar säkerhet med brandväggar, kryptering och åtkomstkontroller för att skydda data.

---

## Nyckelkomponenter i ett nätverk
- **Routrar**: Dirigerar data mellan nätverk; använder IP-adresser.
- **Switchar**: Hanterar data inom lokala nätverk; använder MAC-adresser.
- **Brandväggar**: Kontrollerar trafik med hjälp av säkerhetsregler.
- **Trådlösa åtkomstpunkter**: Kopplar trådlösa enheter till ett trådbundet nätverk.

---

## Nyckelkomponenter i ett nätverk
- **Intermediaries**: Lastbalanserare, reverse proxies och bastion hosts förbättrar prestanda och säkerhet.

---

## Nätverkstopologier
- **Stjärna**: Alla enheter är kopplade till en central nod.
- **Buss**: Alla enheter delar en gemensam kommunikationsbuss.
- **Ring**: Varje enhet är kopplad till två andra, bildar en sluten krets.
- **Mesh**: Varje enhet är direkt kopplad till flera andra för redundans.
- **Hybrid**: Kombination av två eller fler topologier för att möta specifika behov.

---

## Abstraktionsnivåer  
- **Fysiskt Lager**: Hårdvara som kablar, switchar och routrar.  
- **Virtuellt Nätverkslager**: Isolerade nätverkssegment (t.ex. VLAN, VPN).  
- **Molnnätverkslager**: Hanterade lösningar som Azure VNets och AWS VPCs.  
- **Serverlös Nätverksfunktionalitet**: Automatisk routning och skalning av molnleverantörer.  

---

## Nätverkssäkerhet
- **Kryptering**: Skyddar data under överföring genom att göra den oläslig utan nyckel.
- **Brandväggar**: Filtrerar trafik baserat på regler.
- **VPN (virtuellt privat nätverk)**: Säker och krypterad anslutning för fjärråtkomst.
- **IDS/IPS**: IDS (Intrusion Detection System) and IPS (Intrusion Prevention System). Identifierar och förebygger potentiella hot mot nätverket.
