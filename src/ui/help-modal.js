/**
 * Help Modal Module
 * Displays format help dialog
 */

const HELP_TEXT = `-- Formátum help --
Gyors példa:

10-01 1.0 taszk leírás 1
demo
  10-02 1.5 taszk leírás 2
  10-03 2.5 taszk leírás 3
# ez egy komment sor
insnet
  10-04 8.0 taszk leírás 4

A munkaidő bejegyzéseket soronként kell megadni. Az inputot tetszés szerint lehet tagolni üres sorokkal, a sorokat pedig bármennyi szóközzel beljebb lehet igazítani, a feldolgozó ezeket figyelmen kívül hagyja. #-vel kezdődő sor kommentnek számít. Csak a soreleji # számít kommentnek.
Munkaidő bejegyzést tartalmazó sor formátuma a következő:

12-26 4.0 Ez itt a leírás szövege
- vagy -
2016-12-26 3.0 Ez itt a leírás szövege

A sorokat az első két előforduló szóköz osztja 3 részre (a soreleji behúzás nem számít).

1. Dátum/idő.
YYYY-MM-DD vagy MM-DD, az év tehát opcionális. Ha nincs megadva, akkor automatikusan az aktuális év lesz érvényes a sorra.

2. Munkaórák száma.
Ez lehet egész szám vagy tizedes tört ponttal jelölve.

3. Leírás szövege.
Ez a sor teljes hátralévő része, a közben előforduló szóközökkel együtt.
A leírás első szava opcionálisan lehet Redmine/Youtrack issue azonosító. Ezt a feldolgozó automatikusan felismeri. Az előnézet szekcióban a sikeres felismerést az jelzi, hogy meg is jelenik egy link az issue-hoz. Az issue azonosítót a backend felé a külön erre szolgáló mezőben küldjük be, tehát ez explicit külön lesz letárolva, és az elmentett munkaidő bejegyzéseknél is látszódni fog. Abban az esetben ha a leírás rész csak egy szó, és ez pont issue azonosító is egyben, akkor ezt issue azonosítóként és leírásként is beküldjük.

Dátumcímkék használata

A dátumokat meg lehet adni címkeként is.
Ha munkaidő bejegyzést tartalmazó sorban szimplán csak egy kötőjelet adunk meg dátum helyett, akkor a legutóbbi dátum címke értéke lesz érvényes rá.
Egy sorban a sor elején explicit módon megadott dátum nem íródik felül címke értékkel.
Ha kötőjeles dátumos sor előtt nem szerepelt még dátumcímke, akkor a mai nap lesz megadva dátumként.

példa:
# ez a mai napon volt
- 2.4 nahát
10-12
- 2.4 ötös taszk
- 1.4 hatos taszk
10-11 3.2 előtte való napon történt
- 2.0 még egy taszk 10-12-re

Kategóriák:
Alapesetben minden sorra a fenti legördülő mezőkben aktuálisan kiválasztott értékek lesznek érvényesek.
A gyakrabban használt kategóriákat el lehet menteni a kedvencek közé a ★Fav gombbal.
A hozzáadás után a kedvenceket címkével kell ellátni, mert ezekkel tudunk hivatkozni rájuk.

A fenti legelső példában a taszk 1 a lenyílókban aktuálisan kiválasztott kategóriákat fogja megkapni, a taszk 2 és taszk 3 a demo címkével ellátott kedvenc kategóriáit, a taszk 4 pedig az insnet kategóriáit.

A címkék hatása alapértelmezetten a következő ugyanolyan típusú (kategória vagy dátum) címkéig érvényes.
Ha egy kategória címke neve elejére vagy a végére / vagy \\ karaktert rakunk, akkor csak a közvetlenül utána következő sorra lesz érvényes.

Nincs megkötés, hogy először dátum aztán kategória címkét kell használni, vagy fordítva. Tehát mondhatjuk akár azt is, hogy először napokra csoportosítva és azon belül pedig kategóriánként bontva visszük fel az adatokat, de akár azt is, hogy először projektek szerint csoportosítunk, és ezen belül adjuk meg a napokat:

10-11
insnet
  - 2.4 nahát
  - 2.0 ööö...
ciggar
  - 2.8 dejó

10-12
insnet
  - 1.0 na még
ciggar
  - 1.8 na még ez is


-VAGY-

insnet
10-11
  - 2.4 nahát
  - 2.0 ööö...
10-12
  - 1.0 na még

ciggar
10-11
  - 2.8 dejó
10-12
  - 1.8 na még ez is

`.replace(/\n/g, "\n");

/**
 * Create and inject the help modal into the page
 */
export function createHelpModal() {
  const helpModalHTML = `
    <div class="modal" id="helpModal" tabindex="-1" role="dialog" aria-labelledby="helpModalLabel" aria-hidden="true" style="display: none;">
    <div class="modal-header">
      <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
      <h3 id="myModalLabel">Formátum help</h3>
    </div>
    <div class="modal-body">
      <pre>${HELP_TEXT}</pre>
    </div>
    </div>
  `;

  $("body").append(helpModalHTML);
}

/**
 * Setup help modal button
 */
export function setupHelpModalButton() {
  $("#open-help-dialog").button().on("click", () => {
    $('#helpModal').modal();
  });
}

/**
 * Get the help text (for use in textarea placeholder)
 */
export function getHelpText() {
  return HELP_TEXT;
}
