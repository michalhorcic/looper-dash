# Multi Looper Dashboard 0.13.3 beta

## Spuštění — bez úprav v Maxu

1. **Rozbal celý ZIP do stálé složky na Macu.** Nech `MultiLooperDashboard.amxd`, `mld2_core.js`, `mld2_ui.js`, `mld2_led.js`, `mld2_led_setup.js` a `mld2_actions.js` vedle sebe.
2. V Live 12 Suite přetáhni **`MultiLooperDashboard.amxd` na libovolnou audio stopu**, například novou prázdnou stopu Dashboard.
3. Na zařízení klikni **OPEN DASHBOARD**. Monitor si Loopery najde sám. Není potřeba přejmenovávat stopy, otevírat editor ani měnit MIDI nastavení.

Verze 0.3 byla uživatelem ověřena v Ableton Live 12 Suite. Nové funkce včetně změny velikosti okna ve verzi 0.9 zatím nebyly přímo v Live ověřeny.

## Oprava ukládání v 0.13.3

- Ukládací Blob parametr je nově explicitně registrovaný v hlavním patcheru i v jeho hierarchii a má nativně uložené Parameter Mode Enable / Stored Only atributy.
- Každá změna LED SETUP jde přímo do parametru Live. Při otevření Setu se obnoví z tohoto parametru; odložené inicializační načtení ji nepřepisuje výchozími hodnotami.
- Automatické načítání změněných JS souborů během běhu je vypnuté. Po aktualizaci vždy načti novou instanci `.amxd`; samotná výměna JS není aktualizace běžícího zařízení.
- Nejprve ověř uložení na jediném nastaveném Looperu: nahraď starou instanci verzí **0.13.3**, zkontroluj verzi na zařízení, nastav jeden řádek, ulož Set přes Cmd+S, zavři Live a znovu tentýž Set otevři. Teprve po úspěšném testu nastav zbytek.
- Simulované testy pokrývají registraci parametru, zápis/obnovu přes hranici hostitele, nové spuštění JS, pozdní inicializaci, oddělení dvou zařízení a migraci starších konfigurací. Skutečný restart Live ještě potřebuje ověřit uživatel.

## Oprava LED Looperu A v 0.13.2

- Uživatel ověřil, že **hlavní LED A: LED+ 126 / LED- 1** obnoví správný Rec/Play/Overdub i barvy. Components i nativní Rec/Play mapování zůstává na fyzických **127/0**.
- Přímý pasivní CoreMIDI záznam před Live ukázal chybějící hrany CC37 s LED 127/0; s LED 126/1 byly opakovaně správné dvojice 127 → 0. B posílal správné dvojice i s původními hodnotami. Přesný důvod odlišnosti A (konfigurace nebo firmware) není určený.
- Při převodu starší uložené konfigurace se upraví pouze známé přiřazení **Looper A / CH15 / CC37**, z hodnot 127/0 na 126/1. B/C a vlastní nestandardní hodnoty se nemění. Nové přiřazení Looper A začíná 126/1.
- Sloupce **LED+ / LED-** určují pouze LED zpětnou vazbu. U Stop řádku jsou nová samostatná pole **IN+ / IN-** pro fyzický stisk/uvolnění (u tebe 127/0). Změna LED na 126/1 tak nemění rozpoznávání Stop/Clear.
- Stop/Clear už byl uživatelem ověřen na B. Jeho funkční LED 127/0 zůstává zachovaná. A s 126/1 byl následně potvrzen i po obnovení výstupního Remote na původní On.

## Oprava a změna ovládání v 0.13.1

- **Stop nyní obsluhuje dashboard.** V Live odstraň pouze mapování Stop pro CC45/46/47, aby jejich stisk i uvolnění prošly do MIDI vstupu. Rec/Play/Overdub mapování ponech. Tato změna byla uživatelem odsouhlasená po ověření, že namapované Stop CC Live spotřebuje, zatímco nenamapovaná tlačítka dorazí.
- Zapnutý Stop řádek pošle jeden přímý Stop na stisk i s vypnutým HOLD. HOLD ON navíc povoluje jeden Clear po 1,5 s držení, pouze při potvrzeném STOP. Nový Stop funguje už při prvním stisku; před dlouhým Clear je po zapnutí/změně stále potřeba uvolnění.
- Diagnostika nyní píše **INPUT ROUTED**, což potvrzuje směrování, a zvlášť ukazuje skutečně přijaté bajty, raw CC, poslední kanál/CC/hodnotu a počet zpráv přijatých filtrem.
- **Historický problém 0.13:** uživatel potvrdil, že její zapnutí narušuje Overdub a může vymazat smyčku; vypnutí pouze této LED ovládání obnoví. Od 0.13.2 je pro A ověřené LED 126/1; s tímto nastavením lze jeho hlavní ENABLE zapnout. Jedna instance a vypnutý starý LED TEST byly ověřené. Softwarový Stop/Clear se ze samotné LED obnovy nevyvolává; návrat MIDI do Remote nebo chování kontroleru vyžaduje nativní diagnostiku.

## Co je nové v 0.13

- Každý Looper má v LED SETUP druhý řádek **STOP / HOLD CLEAR** s nastavením CC, On/Off, zapnutím Stop LED, ručním testem a přepínačem **HOLD ON/OFF**.
- Pro stopy přesně pojmenované Looper A/B/C se předvyplní Stop CC **45/46/47**. Zapnutí Stop LED a Hold Clear je zpočátku vypnuté. Kanál je společný s hlavním tlačítkem; u tebe 15. On/Off je výchozí 127/0.
- Stop LED: potvrzený prázdný buffer = **On barva**, existující smyčka = **Off barva**. Neznámá délka bufferu = Off a text BUFFER UNKNOWN; STOP samo neznamená prázdnou smyčku.
- Nový MIDI vstup se vybírá samostatně: **LCXL3 1 (MIDI Out)**. Výstup dál používá **LCXL3 1 (MIDI In)**. Oba vybírají konkrétní kanál 15.
- Držení Stop **1,5 sekundy** vyvolá jednou Clear, ještě během držení, pokud je cílový Looper potvrzený jako zastavený. Délku lze změnit nahoře v HOLD seconds. Po zapnutí/změně konfigurace nejprve Stop krátce stiskni a uvolni.
- Od 0.13.1 krátký Stop obsluhuje dashboard; jeho původní mapování v Live je potřeba odstranit. Dashboard přijme nemapovaný Stop CC a přímo vyvolá Stop nebo explicitně povolený dlouhý Clear. Rec/Play/Overdub mapování zůstává stejné.
- Okno má čtyři Loopery na stránku, aby se oba řádky vešly. Původní CLEAR pro odstranění přiřazení se nyní jmenuje **RESET**; audio nemaže.
- Konfigurace starší verze se převede a nový Hold zůstane vypnutý. Nové nastavení včetně vstupu, délky držení a Stop CC se ukládá do Setu.
- Vedle `.amxd` musí zůstat **všech pět JS souborů**, včetně nového `mld2_actions.js`. Postup: [LED-SETUP-CS.md](LED-SETUP-CS.md).

## Oprava 0.12.1

- Opravené čekání v LED SETUP: předchozí verze vyžadovala nepodloženou volbu All Channels a mohla nevyslat žádné zprávy, přestože stav Looperu v řádku fungoval.
- Výstup teď vybírá konkrétní kanál jako ověřený LED TEST. **Všechny zapnuté řádky nastav na CH 15**, podle svého skutečného mapování.
- SYNC nyní vyžaduje jeden společný kanál pro zapnutá přiřazení. Smíšené kanály se explicitně zablokují. Ruční test může jednotlivě vybrat kanál svého řádku.
- Nahoře se ukazuje požadovaný a aktuální kanál při čekání; chybějící kanál je BLOCKED. Původní uložená přiřazení jsou kompatibilní.

## Co je nové v 0.12

- **LED SETUP** má řádek pro každý detekovaný Looper, společný výstup LCXL3 MIDI In a nastavení **CH / CC / ON / OFF / ENABLE / TEST**. Po čtyřech řádcích se stránkuje PREV/NEXT; sledování běží i na ostatních stránkách.
- Nové Loopery zůstávají nenastavené a vypnuté. Pro Looper A zadej dosud ověřené **15 / 37 / 127 / 0**. Ostatní nastavení převezmi z Components.
- **SYNC** sleduje všechny zapnuté řádky: STOP Off, PLAY On, RECORD pomalé blikání (1 Hz), OVERDUB rychlé (4 Hz). Hodnoty a barvy dál odpovídají Components.
- Konfigurace včetně výstupu, zapnutí řádků a SYNC se ukládá do Live Setu. Zapnutý uložený SYNC se obnoví po potvrzení správného směrování. Nové zařízení začíná vypnuté.
- Stejné kanál/CC u zapnutých přiřazení jsou blokované jako CONFLICT. Chybějící řádky se uchovávají; obnovení se váže na přesný, jedinečný název stopy. Přejmenovanou stopu nastav znovu, starou vymaž RESET.
- Společný výstup používá konkrétní kanál podle zapnutých řádků. Všechny zapnuté řádky musí mít stejný kanál; u tebe 15. Nastavení a ukládání ještě potřebují nativní test v Live.
- Původní **LED TEST** zůstává. Oba způsoby si předávají společný výstup a automaticky se navzájem zastaví při převzetí ovládání.
- Přibylo `mld2_led_setup.js`: vedle `.amxd` musí být **všech pět JS souborů**. MIDI Learn, dlouhé a dvojité stisky zatím nepřidáváme.
- Postup nového nastavení: [LED-SETUP-CS.md](LED-SETUP-CS.md). Původní test: [LED-TEST-CS.md](LED-TEST-CS.md).

## Opravy 0.8.1

- Opravené zapojení LED OUTPUT / FOLLOW A: přepínače teď předávají číselné 0/1 místo textového popisku.
- Opravené rozlišení portu/kanálu z číselných indexů vracených `live.routing`. Původní neúspěšný test verze 0.8 kvůli těmto chybám nepotvrzuje omezení hardwaru.

## LED experiment (od 0.8)

- Nové tlačítko **LED TEST** otevře experimentální test jediné LED LCXL3 pro stopu **Looper A**. Výchozí stav je vypnutý; běžný dashboard se chová stejně.
- Pro Custom Mode použij ověřený protokol Custom CC15/37 přes MIDI In / kanál 15. Starší paletový a RGB experiment zůstávají pro srovnání.
- Horní tlačítko pod fadery, první zleva, má dokumentovanou DAW LED adresu 37. Původní mapování **channel 15 / CC37 / momentary** se nemění.
- Ruční On/Off v **Custom Mode 2** už uživatel ověřil; automatické blikání čeká na test. Modul nepřepíná režimy a nesnaží se přebírat vestavěný skript Live. Přesný postup je v [LED-TEST-CS.md](LED-TEST-CS.md).

## Grafika (od 0.7.1)

- Jemně zaoblené karty a tlačítka, spojené přepínače CARDS a SIZE s jasně označenou volbou.
- Klidnější záhlaví s jemným tónováním, výrazným proužkem barvy stopy a sjednocenými pomocnými popisky. Velký stav zůstává dominantní.
- Čitelnější transportní reference: kontrastnější 2px hranice taktů, tučná čísla 14/16 px a jemné podbarvení aktuálního taktu. Výrazná čára dál ukazuje aktuální referenční pozici.
- Nová volba **3 karty** zobrazuje tři široké řádky: stav vlevo, reference a sendy vpravo. Rozložení 2/4/6 má nadále dva sloupce.
- Dlouhé názvy se zkracují podle skutečně změřené šířky textu, aby nepřekrývaly ostatní údaje.

## Zobrazení a velikost okna

- Zůstává pouze režim pro hraní. Classic i přepínací tlačítko LIVE VIEW byly odstraněny; nahoře je pouze volba CARDS 2 / 3 / 4 / 6.
- Volba 3× byla odstraněna; maximální velikost je nyní 2×.
- Přepínač **SIZE 0.5x / 1x / 2x** v dolní liště mění velikost celého okna i obsahu dashboardu.
- Výchozí 1× odpovídá ploše 1040 × 780; další volby jsou 520 × 390 a 2080 × 1560. Jde o rozměry plochy dashboardu, bez systémového rámečku okna. Velká měřítka vyžadují odpovídající prostor na obrazovce a mohou být omezena správcem oken.
- Rozložení 2/3/4/6, aktuální stránka a reference 4/8 taktů se při změně velikosti zachovají. Nastavení velikosti je lokální pro aktuální běh dashboardu.

## Sendy A/B (od 0.5)

- Každá karta dole zobrazuje **sendy A a B hostitelské stopy**: název returnu, textovou hodnotu z Live a tenký proužek polohy sendu.
- Hodnoty se aktualizují automaticky, také při změně názvu nebo pořadí returnů. Sendy se přiřazují podle stopy Looperu, nikoliv shody názvů stop.
- Jde o nastavení sendu, nikoliv měření audio signálu. Nulová poloha sendu je platná hodnota; chybějící nebo nedostupný send ukazuje pomlčku.
- Send C není čtený ani ovládaný. Audio routing, původní MIDI mapování a úrovně zůstávají beze změny.
- Sendy jsou pouze monitorovací: kliknutí na ně nic nenastavuje. Zobrazují se ve všech rozloženích 2/3/4/6.

## Režim pro hraní a barvy stop (od 0.4)

- Dashboard se otevírá v režimu pro hraní se čtyřmi velkými kartami.
- Tlačítka **2 / 3 / 4 / 6** vybírají počet karet na stránce; velikost stavů a karet se přizpůsobí.
- Při změně rozložení zůstane první dosud viditelný Looper na aktuální stránce.
- Barevný proužek u názvu a jemně tónované záhlaví sledují barvu hostitelské stopy v Live, také u Looperů uvnitř racků. Změna barvy v Live se přenese automaticky. Pokud barva není dostupná, použije se neutrální záhlaví.
- Barvy stavů STOP / PLAY / RECORD / OVERDUB zůstávají nezávislé na barvě stopy.
- Proužky 4/8 taktů, stručný transport a diagnostika zůstávají dostupné. Volba zobrazení platí pouze do opětovného načtení zařízení; neukládá se do Setu.

Automaticky se hledají všechny vestavěné Loopery ve stopách, returnech, Masteru a rackových řetězcích, včetně více Looperů na stejné stopě. Karty se zobrazují po dvou, třech, čtyřech nebo šesti podle zvoleného režimu. Počet není omezený na čtyři; ochranný limit průchodu je 10 000 zařízení a hloubka racků 24.

## Jak číst displej

**STOP / PLAY / RECORD / OVERDUB** se zobrazí, když API vrátí odpovídající text parametru State. Číselné pořadí stavů se nehádá. Pokud text nelze poznat nebo není parametr dostupný, zůstane původní text nebo UNKNOWN. U API State zatím není v tvém Live ověřeno, zda se mění při vyžádání akce, nebo až při jejím skutečném provedení. Nápis RECORD proto zatím sám o sobě nepotvrzuje, že už probíhá záznam.

Skutečné čekání na nahrávání a čtecí hlava nejsou tímto buildem měřené. Opakované hlášky o tom byly z karet odstraněny; časový průběh je dál pouze referencí podle transportu.

**Průběhový proužek s čísly taktů** je pomocná fráze od začátku transportu (1.1.1), nikoliv měřený průběh smyčky. Kliknutím na proužek přepneš jen lokální referenci mezi 4 a 8 takty. Nenastavuješ tím Looper. Volba se při přesunu stejného zařízení během tohoto běhu zachová, po novém otevření Setu zatím začíná na 4.

**Bar / Beat / Next bar** jsou vypočtené z transportu pro pevné 4/4. Next bar odpočítává čtvrťové doby k další hranici jednoho taktu; na hranici ukáže 4. Není to odpočet konkrétního požadavku Record. Při zastavení transportu mřížka stojí, i kdyby Looper hrál samostatně. Pro proměnlivé metrum, posunutý začátek skladby, opačný směr nebo změněnou rychlost Looperu není tato mřížka jeho pozicí.

Monitor pouze čte Live API a nemění audio ani původní Rec/Play/Overdub MIDI mapování. Volitelný LED SETUP vysílá zpětnou vazbu a od 0.13 může přijímat MIDI pro Stop-hold Clear. Samostatný akční modul smí po výslovně povoleném dlouhém stisku vyvolat Clear konkrétního zastaveného Looperu. Stop vyvolává pouze nový stisk nakonfigurovaného tlačítka. Globální transport neovládá. Původní LED TEST zůstává dostupný. Audio prochází stereo beze změny úrovně. Pro běžný dashboard nic nenastavuješ na MIDI portech ani v Components.

## Rychlé vyzkoušení

1. Po načtení zkontroluj, zda počet a názvy karet odpovídají projektu.
2. Ovládej Loopery původními tlačítky LCXL3 a porovnej texty s nativním UI. Přidej nebo odeber jeden Looper; monitor má změnu sám zachytit.
3. Přepni 2 / 3 / 4 / 6, vyzkoušej stránkování i volbu 4/8 taktů na jiné stránce. Změň barvu stopy v Live a ověř záhlaví všech jejích Looperů.
4. Porovnej A/B na kartě s příslušnou stopou v Live. Změň oba sendy, přejmenuj return a ověř průběžnou aktualizaci. Send C nadále používej pro své směrování audia.
5. Vyzkoušej SIZE 0.5x / 1x / 2x podle dostupné plochy obrazovky. Ověř velikost celého okna i obsahu, stránkování a klikání na reference 4/8 taktů.
6. Vyzkoušej současný Play, Record, Overdub a Stop na různých Looperech. Proužky posuzuj pouze jako transportní vodítka.

Pokud něco nesedí, klikni **REPORT**, ulož soubor s příponou `.json` a pošli jej s přesnou verzí Live a Maxu a jednou větou, co nefunguje. Report obsahuje metadata a parametry nalezených Looperů a jejich umístění, nikoliv audio. Limit historie je 6 000 událostí; při delším běhu se nejstarší přepisují a zvyšuje se `dropped_events`.

## Když se něco nenačte

- Zkontroluj, že jsi ZIP rozbalil a všech pět JS souborů jsou vedle `.amxd`. Není potřeba je ručně přidávat do Max search paths.
- Pokud Live zařízení odmítne nebo okno zůstane prázdné, napiš konkrétní chybu. Přes kontextové menu zařízení → **Open Max Window** lze zobrazit Max Console. Výpis chyb je pro opravu užitečnější než opakování celé diagnostiky.
- Pro zachování závislostí při archivaci Setu můžeš zařízení po ověření otevřít v Maxu a použít Freeze Device; pro první vyzkoušení to není potřeba.

## Co bylo ověřeno

Skutečný AMXD kontejner (nikoliv přejmenovaný JSON) byl dekódován originálním parserem z Ableton/maxdevtools. Zkontrolovány zdroje, propojení, závislosti, stereo průchod a logika automatického hledání v simulovaných API testech. `.amxd` je nezmražené zařízení s pěti sousedními JS závislostmi. **Parser neověřuje nativní běh Maxu, chování Looperu ani macOS.** To ověří první načtení u tebe.

Zdroje a sestavovací skript jsou v balíčku kvůli opravám; k běžnému spuštění nepotřebuješ Python, Node ani terminál.
