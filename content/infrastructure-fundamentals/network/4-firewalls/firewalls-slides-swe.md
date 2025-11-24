
+++
title = "Brandväggar"
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

## Vad är en Brandvägg?
- En brandvägg fungerar som en säkerhetsbarriär mellan betrodda interna nätverk och opålitliga externa.
- Den övervakar och kontrollerar inkommande och utgående nätverkstrafik baserat på säkerhetsregler.

---

## Hur Brandväggar Fungerar
- Undersöker datapaket för att avgöra om de ska **tillåtas** eller **nekas**.
- Implementerar regler baserade på 5 "tuples":
  - **Source/Destination IP**
  - **Source/Destination Port**
  - **Protocol**

---

## Tekniker för Brandväggar
1. **Packet Filtering**:
   - Inspekterar paket individuellt baserat på fördefinierade regler.
2. **Stateful Inspection**:
   - Kontrollerar tillståndet för aktiva anslutningar för att fatta mer informerade beslut.
3. **Next-Generation Brandväggar (NGFW)**:
   - Inkluderar avancerade funktioner som deep packet inspection och intrusion prevention.

---

## Best Practices
- Följ principen om Least Privilege: Tillåt endast nödvändig trafik och blockera allt annat.  
- Använd specifika regler: Ange exakta IP-intervall, portar och protokoll för att kontrollera trafiken.  
- Aktivera loggning och övervakning: Spåra vilka regler som utlöses för att identifiera ovanliga trafikmönster och potentiella säkerhetsincidenter.  