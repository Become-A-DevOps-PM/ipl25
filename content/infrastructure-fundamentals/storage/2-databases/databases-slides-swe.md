
+++
title = "Databaser"
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

## Vad är en Databas?
- Lagrar _strukturerad_ data (ex. tabeller, dokument, tidsserier).
- Gör det möjligt att söka i data (ex. SQL Structured Query Language).
- Upprätthåller _dataintegritet_ (ex. Primary keys, foreign keys, not null, unique, 1->n, n->n)

---

## Typer av Databaser
**Relationsdatabaser**
   - Använder tabeller med rader och kolumner (t.ex. MySQL, PostgreSQL).
   - Structured Query Language (SQL) för datamanipulation.

---

## Typer av Databaser
**NoSQL-databaser**
   - Designade för semistrukturerad data (t.ex. MongoDB, DynamoDB).
   - Flexibla scheman för olika datatyper (dokument, key-value)

---

## Typer av Databaser
**In-Memory-databaser**
   - Lagrar data i RAM för snabb åtkomst (t.ex. Redis, Memcached).

---

## Typer av Databaser
**Tidsseriedatabaser**
   - Speciellt designade för att hantera tidsstämplad data (ex. loggar)

---

| **Koncept**             | **Fokus**                  | **Innehåll**                                                                 |
|--------------------------|----------------------------|------------------------------------------------------------------------------|
| **Databas**             | Logisk container för data | Data och metadata; en eller flera scheman.              |
| **Schema**              | Logisk struktur           | Tabeller och relationer. |
| **Databasinstans**      | Den körande processen   | Själva programmet.                 | 
