# Changelog

Az ArpyEnhance fontosabb változásai ebben a fájlban kerülnek dokumentálásra.

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
