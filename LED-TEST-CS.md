# LCXL3 LED — první experiment pro Looper A (0.8 beta)

Modul je součástí stejného `MultiLooperDashboard.amxd`. Vedle zařízení musí zůstat `mld2_core.js`, `mld2_ui.js` a nový `mld2_led.js`. Používá stejný stav Looperu jako dashboard; nezjišťuje dodatečně skutečný začátek záznamu ani čekající Record.

## Co zůstává zachované

- Stopa: `Looper A`, na ní právě jeden vestavěný Looper.
- LCXL3: Custom Mode 2.
- Původní ovládání: horní řada tlačítek pod fadery, první zleva, channel 15 / CC37 / Control Change / momentary.
- Stávající Control Surface, vstupní porty, MIDI mapování, send C a audio průchod se nemění.
- Modul neposílá žádný příkaz pro přepnutí DAW/Custom režimu. Nereaguje na stisk tlačítka; pouze zobrazuje stav přečtený z Live.

## Nejdřív test barev

1. Načti nové `.amxd` a zkontroluj běžný dashboard. Klikni na **LED TEST** na zařízení; otevře se samostatné malé okno.
2. Nech **LED OUTPUT** i **FOLLOW A** zatím vypnuté.
3. V prvním menu vyber **LCXL3 1 (DAW In)**. Pokud Live používá alias **Launch_Control_XL_3 Output (LCXL3 1 …)** pro tento stejný DAW port, vyber jej. Ve druhém menu zvol **1 / Ch. 1**. Nevybírej `LCXL3 1 (MIDI In)` ani To DIN Out.
4. Pokud DAW výstup v nabídce chybí, v Live → Settings → Link, Tempo & MIDI zapni **Track pouze u výstupu odpovídajícího DAW In**. Na dodaném screenshotu jde o druhý výstup `Launch_Control_XL_3 Output (LCXL3 …)`; je přiřazen také jako Output vestavěného Control Surface. Názvy se mohou lišit podle aliasů. Neměň vstupy, mapování ani přiřazení Control Surface. Potom nové zařízení znovu načti pro obnovení seznamu.
5. Nech na LCXL3 aktivní **Custom Mode 2**. Zapni **LED OUTPUT**, FOLLOW A nech vypnuté. Stiskni postupně **WHITE**, **GREEN**, **RED**, **ORANGE** v testovacím okně.
6. Sleduj výhradně první tlačítko horní řady pod fadery. Má změnit barvu. Stavový řádek „TEST … sent“ potvrzuje pouze odeslání, nikoli reakci hardwaru.

Pokud se barvy nezmění, změní se jiná LED, nebo se barva hned přepíše, vypni LED OUTPUT a napiš výsledek. Zatím nepřepínej kontroler do jiného režimu a nic nepřemapovávej. Podpora této kombinace DAW barevných zpráv a viditelného Custom Mode 2 není dokumentací potvrzená; první test ji právě ověřuje. DAW port již používá skript Live, který může LED přepisovat.

## Teprve potom sledování Looperu

Pokud všechny čtyři barvy fungují, zapni **FOLLOW A** a ovládej Looper původním tlačítkem:

| Stav na dashboardu | LED |
|---|---|
| STOP | Tlumeně bílá |
| PLAY | Zelená |
| RECORD | Červená |
| OVERDUB | Oranžová |
| Chybějící / neznámý / nedostupný Looper nebo výpadek dat | Zhasnutá |

Při přepnutí stavu se barva odešle ihned. Během FOLLOW se obnovuje nejvýše dvakrát za sekundu, aby se mohla vrátit i po lokálním překreslení LED při uvolnění momentary tlačítka. Ruční barevné testy jsou při zapnutém FOLLOW blokované. Pro opakování barevného testu nejprve vypni FOLLOW A.

Vypnutím LED OUTPUT modul přestane odesílat zprávy a pokusí se jedinou LED zhasnout. Oba přepínače začínají po načtení vypnuté; LED funkce zatím není ukládána do Setu.

## Co poslat po testu

- Změnily ruční testy barvu správného tlačítka v Custom Mode 2?
- Drží barva i po stisku a uvolnění tlačítka, když je FOLLOW A zapnuté?
- Zůstalo původní rec/play/overdub ovládání beze změny?
- Pokud je něco jinak: přesný vybraný výstup/kanál a text stavového řádku.
