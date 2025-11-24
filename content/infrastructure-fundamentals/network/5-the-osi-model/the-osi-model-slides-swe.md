
+++
title = "OSI-modellen"
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

## Vad är OSI-modellen?
- Ett konceptuellt ramverk för att förstå nätverkskommunikation.
- Definierar 7 lager, var och en med specifika funktioner.

---

## Lager i OSI-modellen
- 1 **Fysiskt Lager**: Rå datatransmission (t.ex. kablar, switchar).
- 2 **Datalänklager**: Felfri dataöverföring mellan närliggande noder.
- 3 **Nätverkslager**: Hanterar dataroutning och adressering (t.ex. IP).
- 4 **Transportlager**: Pålitlig dataöverföring (t.ex. TCP/UDP).

---

## Lager i OSI-modellen
- 5 **Sessionslager**: Sessioner och anslutningar mellan applikationer.
- 6 **Presentationslager**: Formaterar och krypterar data för applikationslagret.
- 7 **Applikationslager**: Tillhandahåller nätverkstjänster till slutanvändare (t.ex. HTTP, SMTP).

---

## Exempel på Protokoll per Lager
- **Fysiskt Lager**: Ethernet, Wi-Fi.
- **Datalänklager**: MAC addresses.
- **Nätverkslager**: IP, ICMP.
- **Transportlager**: TCP, UDP.
- **Sessionslager**: NetBIOS, RPC.
- **Presentationslager**: SSL/TLS, JPEG.
- **Applikationslager**: HTTP, FTP, SMTP, SSH, RDP, DNS.
