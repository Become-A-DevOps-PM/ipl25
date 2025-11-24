
+++
title = "Nätverksförmedlare"
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

## Vad är Network Intermediaries?
- Enheter eller programvara som hanterar dataflöde mellan nätverksenheter.
- Förbättrar prestanda, säkerhet och tillgänglighet.

---

## Typer av Network Intermediaries
1. **Lastbalanserare**: Fördelar trafik mellan flera servrar.
2. **Reverse Proxies**: Fångar upp klientförfrågningar och vidarebefordrar dem till backend-servrar.
3. **Gateways**: Översätter protokoll mellan olika nätverkstyper.
4. **Bastion Hosts**: Ger säker administrationsåtkomst till privata nätverk.

---

## Lastbalanserare
- Förbättrar tillgänglighet och prestanda genom att fördela nätverkstrafik jämnt.
- Fungerar på Lager 4 (Transport) eller Lager 7 (Applikation) i OSI-modellen.

---

## Reverse Proxies
- Förbättrar säkerheten genom att dölja backend-infrastrukturen.
- Tillhandahåller funktioner som SSL-terminering, caching och filtrering.

---

## Gateways  
- Fungerar som brygga mellan olika nätverk eller system.  
- Exempel: VPN-gateways, API-gateways.  

---

## Bastion Hosts  
- Säker åtkomstpunkt för administratörer som hanterar privata servrar.  
- Vanligtvis förstärkta med ytterligare säkerhetsåtgärder.  