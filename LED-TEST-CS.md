# LCXL3 — Custom CC ON/OFF test (0.10 beta)

Cíl: přepnout dvě barvy prvního tlačítka horní řady pod fadery v **Custom Mode 2**, při zachování mapování **channel 15 / CC37 / momentary**. Zatím bez automatického sledování Looperu.

## Postup

1. Nahraď předchozí instanci novým **MultiLooperDashboard.amxd 0.10 beta**. Všechny tři JS soubory musí zůstat vedle `.amxd`; samotná výměna JS nestačí.
2. LCXL3 nech v **Custom Mode 2**. Původní mapování a nastavení Control Surface ponech.
3. Otevři **LED TEST**. Vypni **LED OUTPUT** i **FOLLOW A**.
4. V nabídce protokolu vyber **Custom CC15/37 - ON/OFF**.
5. Vyber výstup **LCXL3 1 (MIDI In)** a kanál **15 / Ch. 15**. Nepoužívej DAW In ani DIN.
6. Pole **On value / Off value** mají výchozí hodnoty **127 / 0**. Pokud má stejné tlačítko v Components jiné hodnoty, zadej je sem. Přiřazení CC, kanál ani momentary neměň. Výsledné barvy odpovídají On/Off barvám uloženým v Custom Mode; pokud jsou stejné, nebude přepnutí viditelné.
7. Zapni **LED OUTPUT**. Stav musí začínat **ARMED CUSTOM CC**. FOLLOW A zůstává vypnuté.
8. Klikni **TEST ON**, pak **TEST OFF** a sleduj fyzickou LED. Zkus to nejprve bez dotyku kontroleru. Stav obsahuje **TEST CUSTOM ON/OFF**, hodnotu CC37, MIDI In a channel 15. To potvrzuje předání zprávy z modulu, nikoliv její přijetí hardwarem.
9. Pokud se barvy mění, klikni znovu TEST ON, pak fyzické tlačítko stiskni/uvolni. Sleduj, zda tím zvolenou LED barvu přepíše a zda původní ovládání Looperu dál funguje.
10. Nakonec vypni **LED OUTPUT**. Modul při platném směrování odešle nakonfigurovanou hodnotu Off. Off znamená barvu nastavenou v Components, nemusí znamenat zhasnutí.

Pošli výsledek: **mění TEST ON/OFF barvu**, **jaké jsou On/Off hodnoty** a **co se stane po stisku/uvolnění fyzického tlačítka**. Pokud nereaguje ani nyní, přidej přesný stavový text a ověř, zda On/Off barvy v Components nejsou stejné.

Pokud by samotný TEST ON/OFF ovládal Looper, vypni LED OUTPUT a napiš to — přiřazení ani MIDI mapování kvůli testu neměň.

## Co se posílá

Jediná zpráva tohoto protokolu je **CC37 na MIDI kanálu 15**, s nakonfigurovanou hodnotou On nebo Off. Výchozí bajty jsou `BE 25 7F` a `BE 25 00` (hex). Nejsou to paletové indexy barev.

Novation/Focusrite odpověď v diskusi o XL3 uvádí, že v Custom Mode aktualizují LED příchozí zprávy shodné s přiřazením i kanálem, přes **první USB MIDI port**, a že pro On barvu musí přijít nakonfigurovaná On hodnota. Podmínkou je aktuální firmware. To je podklad pro tento experiment; v uživatelově konfiguraci ještě není potvrzený.

Zdroj: [diskuse Launchcontrol XL3 customization, odpovědi TomFocusrite](https://www.reddit.com/r/Novation/comments/1lz4kez/launchcontrol_xl3_customization/).

## Předchozí experimenty

- Paletové CC přes DAW In funguje v DAW režimu; v Custom Mode 2 nemělo viditelný účinek.
- Uživatel nezaznamenal změnu LED ani při RGB SysEx experimentu v Custom Mode.
- Starší protokoly zůstávají v nabídce pro srovnání. Palette používá DAW In / kanál 1; RGB používá DAW In nebo MIDI In / kanál 1 a je ruční. Jejich WHITE/GREEN/RED/ORANGE tlačítka v novém Custom CC protokolu nevysílají.

Zařízení nepřijímá MIDI, nezapisuje Live API, nemění mapování ani neposílá změnu režimu nebo konfigurace kontroleru. Launchpad X není součástí řešení.
