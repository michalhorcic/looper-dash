# LED SETUP — více Looperů (0.12 beta)

Okno nastavuje LED zpětnou vazbu pro CC tlačítka LCXL3 v Custom Mode. Každý Looper musí být na vlastní, jednoznačně pojmenované stopě. Ovládání Looperů zůstává v původním MIDI mapování Live.

## První nastavení

1. Nahraď předchozí zařízení novým **MultiLooperDashboard.amxd 0.12 beta**. Vedle něj musí zůstat **všechny čtyři JS soubory**, včetně nového `mld2_led_setup.js`.
2. Na zařízení klikni **LED SETUP**. Původní **LED TEST** je stále dostupný i ze setup okna.
3. Nahoře vyber **LCXL3 1 (MIDI In)**. Jde o výstup do hlavního USB MIDI portu kontroleru, stejně jako u ověřeného ON/OFF testu. Nepoužívej DAW In nebo DIN. Zařízení samo požádá o **All Channels**, aby každý řádek mohl používat vlastní kanál. Pokud tato volba není dostupná nebo potvrzená, zůstane výstup blokovaný a stav ukáže WAITING.
4. U každého Looperu nastav **CH**, **CC**, **ON**, **OFF** přesně podle Components. Typ je v této verzi pevně CC. Kanály jsou 1–16, CC a hodnoty 0–127. **CC -1 znamená nenastaveno**. Výchozí CH je 15 a ON/OFF 127/0. Nové řádky mají zapnutí vypnuté.
5. S vypnutým **SYNC** vyzkoušej u řádku **TEST ON** a **OFF**. Test funguje i před zapnutím řádku. Musí se změnit správná LED na barvy uložené v Components. Při čekání na směrování se test provede až po potvrzení správného výstupu.
6. Zapni požadované řádky v **ENABLE** (tlačítko ukazuje ON) a nahoře zapni **SYNC**. Průběžně se sledují všechny zapnuté řádky, včetně dalších stránek. **PREV/NEXT** listuje po osmi řádcích.
7. Ulož Live Set. Konfigurace zahrnuje společný výstup, všechna přiřazení, jejich zapnutí i stav SYNC. Pokud byl SYNC při uložení zapnutý, po obnovení konfigurace pokračuje, jakmile je potvrzen port/All Channels a přijdou data dashboardu. Nové zařízení má SYNC vypnuté.

Pro Looper A použij dosud ověřené **CH 15 / CC37 / ON 127 / OFF 0**. Další CC neodhaduj podle pořadí tlačítek; převezmi skutečná přiřazení z Components.

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

Pořadí karet/stop a dočasná Live ID nemění přiřazení. Klíčem pro obnovení je **přesný název stopy**. Přejmenování stopy znamená nový nenastavený řádek a původní MISSING řádek; přenes hodnoty ručně a původní přiřazení odstraň **CLEAR**. Duplicitní názvy se nesnažíme odhadovat.

**CLEAR** odstraní nastavení daného řádku. Detekovaný Looper zůstane jako nenastavený, chybějící řádek po vymazání zmizí.

Vypnutí SYNC nebo řádku vrátí dříve ovládané LED na jejich Off barvu. Off nemusí znamenat zhasnutí. Ruční TEST ON/OFF je při zapnutém SYNC blokovaný. Původní LED TEST a nový setup si předávají výstup: zapnutí LED OUTPUT ve starém testu zastaví SYNC; spuštění setupu/testu vypne starý LED OUTPUT. Pro návrat zapni příslušný režim znovu.

MIDI Learn, jiné LED protokoly, dlouhé a dvojité stisky tato verze neobsahuje. Nemění mapování, nepřijímá MIDI a neovládá Looper ani transport.

## Co ověřit v Live

1. Nastav Looper A a další Looper; porovnej všechny čtyři stavy, správné tlačítko a reakci po uvolnění.
2. Vyzkoušej rozdílné kanály, pokud je ve svém Custom Mode používáš. Nové společné směrování All Channels potřebuje nativní ověření.
3. Ulož Set, zavři jej a znovu otevři. Zkontroluj port, CC, hodnoty, ENABLE i SYNC. Nativní ukládání této verze přes parametr Live ještě není uživatelem potvrzené.
4. Přehoď pořadí stop, dočasně odstraň/obnov Looper a ověř, že se nastavení nepřesune na jiné tlačítko. Zkus i jednu duplicitní adresu a pak ji oprav.

Při chybě pošli text globálního stavu a příslušného řádku, případně chybu z Max Console. Původní test jediného tlačítka je popsán v [LED-TEST-CS.md](LED-TEST-CS.md).
