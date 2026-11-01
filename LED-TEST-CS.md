# LCXL3 — Custom CC ON/OFF test (0.13 beta)

Cíl: přepnout dvě barvy prvního tlačítka horní řady pod fadery v **Custom Mode 2**, při zachování mapování **channel 15 / CC37 / momentary**. FOLLOW A nově sleduje jediný Looper na stopě **Looper A**.

Původní test zůstává zachovaný. Pro více Looperů použij [LED SETUP](LED-SETUP-CS.md). Zapnutí LED OUTPUT v tomto okně zastaví SYNC v setupu; převzetí výstupu setupem vypne tento LED OUTPUT.

## Postup

1. Nahraď předchozí instanci novým **MultiLooperDashboard.amxd 0.13 beta**. Všech pět JS souborů musí zůstat vedle `.amxd`; samotná výměna JS nestačí.
2. LCXL3 nech v **Custom Mode 2**. Původní mapování a nastavení Control Surface ponech.
3. Otevři **LED TEST**. Vypni **LED OUTPUT** i **FOLLOW A**.
4. V nabídce protokolu vyber **Custom CC15/37 - ON/OFF**.
5. Vyber výstup **LCXL3 1 (MIDI In)** a kanál **15 / Ch. 15**. Nepoužívej DAW In ani DIN.
6. Pole **On value / Off value** mají výchozí hodnoty **127 / 0**. Pokud má stejné tlačítko v Components jiné hodnoty, zadej je sem. Přiřazení CC, kanál ani momentary neměň. Výsledné barvy odpovídají On/Off barvám uloženým v Custom Mode; pokud jsou stejné, nebude přepnutí viditelné.
7. Zapni **LED OUTPUT**. Stav musí začínat **ARMED CUSTOM CC**. FOLLOW A zůstává vypnuté.
8. Klikni **TEST ON**, pak **TEST OFF** a sleduj fyzickou LED. Zkus to nejprve bez dotyku kontroleru. Stav obsahuje **TEST CUSTOM ON/OFF**, hodnotu CC37, MIDI In a channel 15. To potvrzuje předání zprávy z modulu, nikoliv její přijetí hardwarem.
9. Pokud se barvy mění, klikni znovu TEST ON, pak fyzické tlačítko stiskni/uvolni. Sleduj, zda tím zvolenou LED barvu přepíše a zda původní ovládání Looperu dál funguje.
10. Nakonec vypni **LED OUTPUT**. Modul při platném směrování odešle nakonfigurovanou hodnotu Off. Off znamená barvu nastavenou v Components, nemusí znamenat zhasnutí.

## Automatické sledování

Po nastavení stejného protokolu, portu a kanálu zapni **LED OUTPUT** a **FOLLOW A**. Stav začíná **FOLLOW CUSTOM Looper A** a uvádí stav Looperu i způsob svícení.

| Stav | LED |
|---|---|
| STOP | Off barva z Components |
| PLAY | On barva z Components |
| RECORD | 500 ms On / 500 ms Off (1 Hz) |
| OVERDUB | 125 ms On / 125 ms Off (4 Hz) |

Blikání začíná On fází při vstupu do nového stavu; běžné aktualizace dashboardu ho nerestartují. Blikání je časové, není synchronizované s tempem Live. Stejná fáze se obnovuje po 100 ms, aby fyzický stisk/uvolnění nemohl LED trvale přepsat. Plánovač Maxu a MIDI mohou přidat zpoždění; nejde o přesný audio časovač.

1. Projdi STOP → RECORD → PLAY → OVERDUB a porovnej LED se stavem dashboardu.
2. V PLAY fyzicky stiskni/uvolni původní tlačítko a ověř, že LED brzy odpovídá aktuálnímu stavu. Původní ovládání Looperu musí zůstat stejné.
3. Vypni FOLLOW A: odešle se Off a přestane blikání i pravidelné obnovování. TEST ON/OFF dál funguje ručně. Opětovným zapnutím FOLLOW se ihned zobrazí aktuální stav.
4. Vypni LED OUTPUT: odešle se Off a zastaví se časovač.

Chybějící nebo víceznačný Looper A, neaktivní/nezjištěný stav a data starší než 1,5 s znamenají Off barvu. Po návratu platných dat se sledování obnoví. Testovací okno zůstává; dlouhé a dvojité stisky zatím zařízení nevyhodnocuje.

Pošli výsledek: **jsou čtyři stavy rozeznatelné**, **obnoví se LED po uvolnění tlačítka** a **zůstává původní ovládání Looperu stejné**. Při chybě přidej přesný stavový text.

Pokud by samotný TEST ON/OFF ovládal Looper, vypni LED OUTPUT a napiš to — přiřazení ani MIDI mapování kvůli testu neměň.

## Co se posílá

Jediná zpráva tohoto protokolu je **CC37 na MIDI kanálu 15**, s nakonfigurovanou hodnotou On nebo Off. Výchozí bajty jsou `BE 25 7F` a `BE 25 00` (hex). Nejsou to paletové indexy barev.

Novation/Focusrite odpověď v diskusi o XL3 uvádí, že v Custom Mode aktualizují LED příchozí zprávy shodné s přiřazením i kanálem, přes **první USB MIDI port**, a že pro On barvu musí přijít nakonfigurovaná On hodnota. Podmínkou je aktuální firmware. Uživatel v 0.10 potvrdil přepínání On/Off barev; fyzické uvolnění tlačítka vrací Off barvu. Automatická obnova a blikání v 0.11 ještě čekají na ověření.

Zdroj: [diskuse Launchcontrol XL3 customization, odpovědi TomFocusrite](https://www.reddit.com/r/Novation/comments/1lz4kez/launchcontrol_xl3_customization/).

## Předchozí experimenty

- Paletové CC přes DAW In funguje v DAW režimu; v Custom Mode 2 nemělo viditelný účinek.
- Uživatel nezaznamenal změnu LED ani při RGB SysEx experimentu v Custom Mode.
- Starší protokoly zůstávají v nabídce pro srovnání. Palette používá DAW In / kanál 1; RGB používá DAW In nebo MIDI In / kanál 1 a je ruční. Jejich WHITE/GREEN/RED/ORANGE tlačítka v novém Custom CC protokolu nevysílají.

Tento původní LED TEST nepřijímá MIDI ani nezapisuje Live API. Nový LED SETUP má samostatně povolovaný Stop-hold Clear a MIDI vstup. Mapování ani režim kontroleru se nemění. Launchpad X není součástí řešení.
