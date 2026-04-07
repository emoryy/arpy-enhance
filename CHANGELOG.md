# Changelog

Az ArpyEnhance fontosabb változásai ebben a fájlban kerülnek dokumentálásra.

## [0.16.3] - 2026-04-07

### Új funkciók
- **Batch küldés hibakezelés**: Sikertelen POST kérések automatikus újrapróbálása növekvő várakozási idővel (5 próbálkozás, 2s-32s)
- **Visszaszámláló**: Élő visszaszámláló a státusz sávban az újrapróbálás előtti várakozás során
- **Folytatás gomb**: Megállítás vagy maximális próbálkozások után folytatási lehetőség az oldal újratöltése nélkül
- **Editor linting**: A parser hibák Monaco editor markerként jelennek meg (piros/sárga aláhúzás a hibás sorokon)
- **Küldés gomb letiltása**: A küldés gomb inaktív, amíg parser hibák vannak a szövegben
- **Nap neve beállítás**: Opcionális magyar napnév megjelenítés az óra-összesítőben

### Hibajavítások
- **Státusz sáv**: A státusz üzenetek most a helyes `#status` elemet használják
- **Sötét mód**: Folyamatjelző sáv háttér, `.btn-warning` stílus, státusz szöveg színek, ikon színezés javítva
- **Parser**: Ismeretlen címke detekció, `shouldPopProjectData` sorrend javítás, üres bemenet kezelés
- **Gombok**: Unicode ikonok helyett Bootstrap 2 Glyphicon-ok használata

## [0.16.0] - 2025-01-26

### Új funkciók
- **Monaco Editor**: Monaco szerkesztő integráció szintaxis kiemeléssel és automatikus kiegészítéssel
- **Sötét mód**: Teljes sötét téma támogatás, kapcsolóval a navigációs sávban
- **Beállítások modal**: Konfigurálható beállítások (cél munkaórák, maximum megjelenített órák, Redmine API kulcs)
- **Advanced kategória kiválasztó/kereső**: Új UI a kategóriák kiválasztásához három oszlopos hierarchikus nézettel és fuzzy kereséssel
- **Redmine gyorsítótár TTL-lel**: A Redmine ticket adatokat localStorage-ba cache-eljük 24 órás lejárattal
- **Manuális újratöltés gomb**: Redmine ticketek egyenkénti újratöltési lehetősége az előnézeti panelen
- **Átméretezhető panelek**: Húzással átméretezhető felső/alsó panelek, maximalizálás gombbal a kedvenceknél
- **Panel csere**: A Kedvencek és szerkesztő panel pozíciójának cseréje
- **Gyors szűrő**: Kedvencek lista gyorsszűrése
- **Kedvencek validáció**: Lezárt/érvénytelen kategória kedvencek detektálása, kiemelése, törlése
- **Aszinkron betöltés folyamatjelző**: Vizuális folyamatjelző sáv Redmine ticketek és projekt adatok betöltésekor

### Változtatások
- **Teljes kód modularizáció**: Egyetlen fájlból moduláris struktúrára refaktorálva Vite build rendszerrel

## [0.15] - Régi verzió

Első dokumentált verzió batch bevitellel, Redmine integrációval és kedvencek rendszerrel.
