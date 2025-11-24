
+++
title = "Vad är Persistens?"
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

## Vad är persistens?
- Data som lagras över tid på ett permanent lagringsmedium (non-volatile).
- Klarar strömavbrott.
- Data finns kvar även efter att applikationen som skapat det inte finns kvar

---

## Medium för persistens
- HDD - Hard Disk Drives (magnetskiva)
- SSD - Solid State Disk (flash-minne, inga rörliga delar)
- Optiska Medium (CD, DVD)
- Magnetband (oftast för backup)
- Molnlagring (Amazon S3, Azure Blob Storage)

---

## Typer av persistens
- **Block Storage**: För filsystem. Hårddiskar eller SAN (iSCSI)
- **File Storage**: Hanterar filer och kataloger likt ett filsystem. NAS (SMB, CIFS, NFS)
- **Object Storage**: För objekt, likt filer, men utan hierarki i kataloger. (HTTP/S)
- **Databaser**: Lagrar strukturerad data för enkel åtkomst och manipulation.
