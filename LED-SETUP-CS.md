# LED SETUP — více Looperů (0.13.2 beta)

Okno nastavuje LED zpětnou vazbu pro CC tlačítka LCXL3 v Custom Mode. Každý Looper musí být na vlastní, jednoznačně pojmenované stopě. Rec/Play/Overdub zůstává v původním mapování Live. Stop od 0.13.1 obsluhuje dashboard, proto pouze jeho původní mapování odstraň. Stop pak potřebuje zapnuté zařízení a **SYNC / CTRL**; při vypnutém nebo odstraněném dashboardu tato tlačítka Stop neobsluhuje.

## První nastavení

1. Nahraď předchozí zařízení novým **MultiLooperDashboard.amxd 0.13.2 beta**. Vedle něj musí zůstat **všech pět JS souborů**, včetně `mld2_led_setup.js` a nového `mld2_actions.js`.
2. Na zařízení klikni **LED SETUP**. Původní **LED TEST** je stále dostupný i ze setup okna.
3. Nahoře vyber **LCXL3 1 (MIDI In)**. Jde o výstup do hlavního USB MIDI portu kontroleru, stejně jako u ověřeného ON/OFF testu. Nepoužívej DAW In nebo DIN. Zařízení samo vybere **konkrétní výstupní kanál** podle přiřazení. Pro tvůj setup jde o **15**. Volba All Channels se nepoužívá. Zprávy se odešlou až po potvrzení správného portu a kanálu.
4. U každého Looperu nastav **CH**, **CC**, **LED+**, **LED-** jako hodnoty zpětné vazby. Nemusí být shodné s fyzickými hodnotami z Components. Typ je v této verzi pevně CC. Kanály jsou 1–16, CC a hodnoty 0–127. **Všechny zapnuté řádky pro SYNC musí mít stejný kanál**, u tebe 15. Smíšené kanály se zablokují s hláškou BLOCKED; jednotlivé ruční testy mohou samostatně vybrat kanál svého řádku. **CC -1 znamená nenastaveno**. Výchozí CH je 15; hlavní A má LED 126/1, B/C ponechávají 127/0. Nové řádky mají zapnutí vypnuté.
5. S vypnutým **SYNC** vyzkoušej u řádku **TEST ON** a **OFF**. Test funguje i před zapnutím řádku. Musí se změnit správná LED na barvy uložené v Components. Při čekání na směrování se test provede až po potvrzení správného výstupu.
6. Zapni požadované řádky v **ENABLE** (tlačítko ukazuje ON) a nahoře zapni **SYNC**. Průběžně se sledují všechny zapnuté řádky, včetně dalších stránek. **PREV/NEXT** listuje po čtyřech řádcích.
7. Ulož Live Set. Konfigurace zahrnuje společný výstup, všechna přiřazení, jejich zapnutí i stav SYNC. Pokud byl SYNC při uložení zapnutý, po obnovení konfigurace pokračuje, jakmile je potvrzen port a konkrétní společný kanál a přijdou data dashboardu. Nové zařízení má SYNC vypnuté.

Pro hlavní LED Looper A použij nyní ověřené **CH 15 / CC37 / LED+ 126 / LED- 1**. Components a nativní mapování jeho tlačítka stále používají 127/0. B/C mohou ponechat funkční LED 127/0. Další CC neodhaduj podle pořadí tlačítek; převezmi skutečná přiřazení z Components.

## Význam svícení

| Stav | LED |
|---|---|
| STOP | Off barva z Components |
| PLAY | On barva z Components |
| RECORD | 500 ms On / 500 ms Off (1 Hz) |
| OVERDUB | 125 ms On / 125 ms Off (4 Hz) |

Obnova stejné fáze po 100 ms vrací barvu přepsanou fyzickým uvolněním tlačítka. Blikání není synchronizované s tempem ani audio vláknem; zatížení Live může přidat zpoždění. Každý Looper má vlastní fázi a běžná aktualizace dashboardu ji nerestartuje.

## Stavové hlášky a změny projektu

- **UNASSIGNED:** není zadané CC. Žádná automatická zpráva pro nový Looper.
- **DISABLED:** přiřazení existuje, ale jeho ENABLE je vypnuté.
- **CONFLICT:** dva zapnuté řádky mají stejný kanál a CC. Obě přiřazení jsou blokovaná; nastav jiné CC/kanál nebo jeden řádek vypni. Ruční test také nesmí použít adresu jiného zapnutého přiřazení.
- **MISSING:** stopa/Looper chybí, uložené nastavení zůstává v seznamu. Při aktivním SYNC se pro něj vysílá Off. Návrat stejného jednoznačného názvu obnoví sledování.
- **AMBIGUOUS:** více detekovaných Looperů sdílí stejný název stopy; nevysílá se jejich aktivní stav. Zajisti jednu jednoznačně pojmenovanou stopu pro každý Looper.
- **UNAVAILABLE:** stav není známý, Looper je vypnutý nebo dashboard neposlal čerstvá data déle než 1,5 s. Použije se Off barva.

Pořadí karet/stop a dočasná Live ID nemění přiřazení. Klíčem pro obnovení je **přesný název stopy**. Přejmenování stopy znamená nový nenastavený řádek a původní MISSING řádek; přenes hodnoty ručně a původní přiřazení odstraň **RESET**. Duplicitní názvy se nesnažíme odhadovat.

**RESET** odstraní nastavení daného řádku. Detekovaný Looper zůstane jako nenastavený, chybějící řádek po vymazání zmizí.

Vypnutí SYNC nebo řádku vrátí dříve ovládané LED na jejich Off barvu. Off nemusí znamenat zhasnutí. Ruční TEST ON/OFF je při zapnutém SYNC blokovaný. Původní LED TEST a nový setup si předávají výstup: zapnutí LED OUTPUT ve starém testu zastaví SYNC; spuštění setupu/testu vypne starý LED OUTPUT. Pro návrat zapni příslušný režim znovu.

MIDI Learn, jiné LED protokoly a dvojité stisky tato verze neobsahuje. Monitor zůstává read-only. Nově lze výslovně povolit Stop-hold Clear přes samostatný MIDI vstup a akční modul; Rec/Play/Overdub mapování zůstává stejné, Stop mapování v Live se odstraňuje.

## Stop LED a dlouhý stisk Clear (0.13)

Každý Looper má nyní dva řádky. Horní řádek zůstává pro Rec/Play/Overdub LED. Pod ním je **STOP / HOLD CLEAR**, který používá stejný CH z horního řádku a vlastní CC / On / Off.

1. Pro Looper A zkontroluj **Stop CC45**, B **CC46**, C **CC47**, všechny na **CH15**. Nová pole **IN+ 127 / IN- 0** odpovídají fyzickému stisku/uvolnění v Components. Samostatné **LED+ / LED-** určují jen zpětnou vazbu; na B je ověřené původní 127/0. Čísla lze změnit stejně jako u hlavní LED. **V Live odstraň pouze mapování těchto Stop tlačítek.** Jinak Live jejich CC spotřebuje a dashboard je neuvidí. Rec/Play/Overdub mapování neměň. V Components nech momentary a skutečné hodnoty 127/0.
2. Zapni Stop řádek ve sloupci ENABLE. Se SYNC vypnutým můžeš jeho TEST ON/OFF ověřit ručně. Tyto testy pouze mění LED, nikdy nevyvolají Clear.
3. Nahoře vyber nový **vstup LCXL3 1 (MIDI Out)**. Výstup zůstává **LCXL3 1 (MIDI In)**. Vstup i výstup používají explicitní kanál 15; All Channels se nepoužívá. V Live musí být pro hlavní vstupní port povolené Track; dosavadní Remote a mapování ponech.
4. Na prvním testovaném Looperu zapni **HOLD ON** a nahoře **SYNC**. HOLD seconds má výchozí **1,5** (nastavitelné 0,5–5 sekund). Před prvním držením nebo po změně konfigurace **jednou Stop krátce stiskni a uvolni**, aby modul viděl uvolnění.
5. Nahoře očekávej **INPUT ROUTED ch15** a při stisku/uvolnění změnu počítadla CC a údaj **CC45=127 / CC45=0**. Nápis ROUTED potvrzuje jen směrování; příjem prokazuje až růst bajtů / CC. Krátký stisk pošle Stop i s vypnutým HOLD; Hold Clear navíc potřebuje předchozí uvolnění.
6. Nahraj zkušební smyčku. Krátký Stop ji má pouze zastavit a zachovat buffer. Jeho LED zůstane na **Off barvě**.
7. Podrž Stop: po **1,5 sekundy**, ještě při stisku, modul jednou požádá o Clear. Looper musí už být STOP; akční modul to znovu čte přímo z nativního State před Clear. Pokud je Stop kvantizovaný a ještě se neprovedl, Clear se přeskočí a později se sám neopakuje — uvolni a zkus nové držení po zastavení.
8. Po vymazání a potvrzení délky bufferu 0 přejde Stop LED na **On barvu**. Delší držení nevyvolává další Clear. Další pokus potřebuje nové uvolnění/stisk.

**Stop LED obsah:** potvrzený prázdný zastavený buffer = On; nahraná smyčka i při zastavení = Off. První záznam s dosud nulovou délkou = Off. Pokud Live délku bufferu nezpřístupní nebo data nejsou platná, zůstane Off s textem **BUFFER UNKNOWN**, nikoliv domněnka prázdného bufferu.

HOLD ON potřebuje také zapnutý Stop řádek a SYNC. Při vypnutí SYNC, převzetí výstupu starým LED TEST, změně mapování/času, ztrátě vstupu, nejednoznačném cíli nebo změně identity Looperu se držení ruší. Nové gesto opět potřebuje uvolnění. Clear se nikdy nevysílá z LED testu ani při obnově uložené konfigurace.

Pokud **počítadlo CC neroste**, napiš přesný INPUT status — potřebujeme ověřit, zda Live předává MIDI i pro tlačítko mapované přes Remote. Pro Stop je od 0.13.1 odstranění nativního mapování požadované; ostatní mapování neměň. Pokud je vstup v pořádku, ale řádek hlásí **Clear API unavailable** nebo **BUFFER UNKNOWN**, pošli REPORT a případně Max Console; dané rozhraní Looperu musí ověřit tvá konkrétní verze Live/Max.

Samostatný akční modul používá pouze dokumentované `LooperDevice.stop` a `clear`. Nemění parametry State, globální transport, směrování audia ani mapování. API reference: [LooperDevice](https://docs.cycling74.com/apiref/lom/looperdevice/).

## Looper A: ověřená oprava hodnot LED

Pro hlavní řádek A nastav **LED+ 126 / LED- 1**, CH15 / CC37. Jeho ENABLE a SYNC / CTRL mohou být zapnuté. Components a nativní Rec/Play/Overdub mapování ponech 127/0. Uživatel potvrdil správné ovládání včetně Overdubu a barev. B/C mají funkční původní hodnoty, proto je automaticky neměníme.

Pasivní záznam přímo z hardwarového MIDI zdroje před Live ukázal při LED 127/0 opakované CC37=127 bez uvolnění a později samostatné CC37=0 bez náběhu. B (CC38) měl párované 127/0. Při LED 126/1 byly na A opakovaně správné dvojice 127 → 0. To vysvětluje chybějící aktivaci Overdubu a odpovídá i nativnímu držení víceúčelového tlačítka. Nelze z toho určit, zda je původní rozdíl A/B v nastavení Custom Mode nebo ve firmwaru.

Starší konfigurace přesně známého A (název Looper A, CH15, CC37) se převede z LED 127/0 na 126/1. B/C, jiné adresy a vlastní nestandardní LED hodnoty se zachovají. Nový formát v3 navíc ukládá Stop IN+/IN- odděleně od jeho LED hodnot. Při převodu z v1/v2 se fyzické Stop hodnoty převezmou z původních On/Off; dosavadní funkční Stop chování se nemění.

A s LED 126/1 byl následně potvrzen funkční i při výstupním Remote znovu zapnutém. Samotné vypnutí Remote při LED 127/0 dříve nepomohlo. Výstupní Remote proto může zůstat na původním On; DAW port se nemění.

Volitelný pasivní macOS pozorovatel je v `source/midi_observe.swift`: `swift -module-cache-path /tmp/mld-midi-swift-cache source/midi_observe.swift 60`. Vyžaduje Swift a přístup ke CoreMIDI. Jen poslouchá hlavní LCXL3 USB vstup, nevytváří MIDI výstup a nic do kontroleru neposílá. Není součástí běžného běhu `.amxd`.

Ableton popisuje spotřebování Remote MIDI v [Routing and I/O](https://www.ableton.com/en/manual/routing-and-i-o/).

## Co ověřit v Live

1. Nastav Looper A a další Looper; porovnej všechny čtyři stavy, správné tlačítko a reakci po uvolnění.
2. Pro všechny zapnuté řádky nastav CH 15. Nahoře při SYNC očekávej „SYNC ON / channel 15“. Pokud čeká, nový stav ukazuje požadovaný i aktuální kanál; chybějící kanál v nabídce je BLOCKED.
3. Ulož Set, zavři jej a znovu otevři. Zkontroluj port, CC, hodnoty, ENABLE i SYNC. Nativní ukládání této verze přes parametr Live ještě není uživatelem potvrzené.
4. Přehoď pořadí stop, dočasně odstraň/obnov Looper a ověř, že se nastavení nepřesune na jiné tlačítko. Zkus i jednu duplicitní adresu a pak ji oprav.

Při chybě pošli text globálního stavu a příslušného řádku, případně chybu z Max Console. Původní test jediného tlačítka je popsán v [LED-TEST-CS.md](LED-TEST-CS.md).
