# Changelog

Az ArpyEnhance fontosabb változásai ebben a fájlban kerülnek dokumentálásra.

## [0.17.0] - 2026-09-01

### Hibajavítások
- **Al-todo nélküli kedvencek**: Ha egy kedvenc csak projektre vagy kategóriára (todo listára) mutatott, al-todo elem nélkül, akkor a rá hivatkozó bejegyzés feldolgozása kivétellel elszállt. Mivel a sorok párhuzamosan dolgozódnak fel, ez az egész feldolgozást megszakította: az előnézet a betöltésjelzőn ragadt és onnantól semmire nem frissült.
- **Előnézet hibakezelés**: Ha a feldolgozás váratlan hibába ütközik, az előnézet mostantól kiírja a hibát és letiltja a küldés gombot, ahelyett hogy némán a legutolsó állapoton maradna. Korábban az ilyen hiba kezeletlen promise rejection volt, így csak a konzolban látszott.
- **Előnézet görgetési pozíció**: Az előnézet újrarajzolásakor a görgetés a lista tetejére ugrott vissza. A panel mostantól a tényleges felhasználói görgetést jegyzi meg, és a program által okozott görgetéseket figyelmen kívül hagyja.
- **Fejléc alatti üres sáv**: A fejléc alatt fenntartott hely fix töréspontból (1282px) jött, a navigációs sáv viszont csak jóval keskenyebb ablaknál tördelődik két sorba, így 1160-1282px között 40px üres sáv keletkezett és az oldal alja levágódott. A tördelés helye a fejléc tartalmának szélességétől függ (a bejelentkezett felhasználó nevének hosszától is: mérve ~1159px rövid, ~1280px hosszú névnél), ezért töréspont helyett a fenntartott hely mostantól a navigációs sáv tényleges magasságát követi. Ez egyben a keskeny ablaknál (915px alatt) jelentkező ellentétes hibát is megszünteti, ahol a fejléc rálógott a tartalomra.
- **Kedvencek "+" gomb**: Az advanced kiválasztóban, ha több todo elem ki volt jelölve, akkor bármelyik sor "+" gombja a teljes kijelölést adta hozzá, akkor is ha a kattintott sor nem volt része a kijelölésnek. Mostantól csak akkor ad hozzá többet, ha a kattintott sor is ki van jelölve, egyébként csak azt az egy sort (ez egyezik a "−" gomb viselkedésével).

### Új funkciók
- **Címke nélküli bejegyzések megjelenítése**: Ha egy bejegyzéshez nem tartozik kategória címke (se explicit, se Redmine "Arpy jelentés" mezőből származó), az korábban egyszerűen kimaradt az előnézetből, ráadásul bármilyen hiba esetén az előnézet csak a hibalistát mutatta, táblázatot nem. Mostantól a hibás sorok is megjelennek az előnézetben `?` jelöléssel és narancssárga kiemeléssel, a szerkesztőben pedig markert kapnak.
- **Hover információk a szerkesztőben**: A kategória címke sorra állva megjelenik, hogy melyik kedvencre mutat, a teljes projekt / kategória / todo elem útvonallal (lezárt kedvencnél jelöléssel együtt). Ticket számra állva (`#1234`) a Redmine link mellett a ticket címe, projektje és "Arpy jelentés" mezője is látszik a gyorsítótárból, YouTrack azonosítónál (`ABC-12`) pedig a hivatkozás.
- **Buborékok a szerkesztő területén kívül**: A hover és az automatikus kiegészítés buborékjai mostantól a `body` alá kerülnek, így nem vágja le őket a szerkesztő kerete, amikor a felső sorok fölé nyílnának, és a rögzített fejléc sem takarja ki őket.
- **Hover alsó sávja nem csúszik ki**: A Monaco a buborék méretét az első megjelenítéskor rögzíti. Mivel a Redmine hover először csak egy rövid "betöltés folyamatban" szöveget mutat, a buborék keskeny maradt, és amikor a tartalom kicserélődött, a lint marker alsó sávja ("View Problem", "No quick fixes available") beszorult: mindkét felirat két sorba tördelődött és a buborék alja levágta. Az alsó sáv mostantól egy sorban marad és a buborék elég széles hozzá.
- **Scoped címkék szintaxis kiemelése**: A csak a következő bejegyzésre érvényes címkék (`/címke` vagy `címke/`) saját színt kaptak, így ránézésre megkülönböztethetők a normál, továbbélő címkéktől. A feldolgozó eddig is támogatta ezt a formát, csak a kiemelés hiányzott.
- **Minimap csúszka**: A szerkesztő minimapján a csúszka mindig látszik, nem csak ráhúzáskor.

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
