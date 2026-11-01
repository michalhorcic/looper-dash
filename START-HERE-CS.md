# Multi Looper Dashboard 0.8 beta

## Spuštění — bez úprav v Maxu

1. **Rozbal celý ZIP do stálé složky na Macu.** Nech `MultiLooperDashboard.amxd`, `mld2_core.js`, `mld2_ui.js` a `mld2_led.js` vedle sebe.
2. V Live 12 Suite přetáhni **`MultiLooperDashboard.amxd` na libovolnou audio stopu**, například novou prázdnou stopu Dashboard.
3. Na zařízení klikni **OPEN DASHBOARD**. Monitor si Loopery najde sám. Není potřeba přejmenovávat stopy, otevírat editor ani měnit MIDI nastavení.

Verze 0.3 byla uživatelem ověřena v Ableton Live 12 Suite. Nové funkce včetně změny velikosti okna ve verzi 0.8 zatím nebyly přímo v Live ověřeny.

## Co je nové v 0.8

- Nové tlačítko **LED TEST** otevře experimentální test jediné LED LCXL3 pro stopu **Looper A**. Výchozí stav je vypnutý; běžný dashboard se chová stejně.
- Nejprve se ručně ověří barvy WHITE / GREEN / RED / ORANGE na DAW výstupu, kanál 1. Teprve pak se zapne FOLLOW A.
- Horní tlačítko pod fadery, první zleva, má dokumentovanou DAW LED adresu 37. Původní mapování **channel 15 / CC37 / momentary** se nemění.
- Chování barev při aktivním **Custom Mode 2** není ověřené. Modul nepřepíná režimy a nesnaží se přebírat vestavěný skript Live. Přesný postup je v [LED-TEST-CS.md](LED-TEST-CS.md).

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

Zařízení pouze čte Live API. Neobsahuje MIDI příjem, zásahy do mapování LCXL3, ovládání transportu ani zápisy do parametrů Looperu. Volitelný LED modul má samostatný MIDI výstup pro jedinou LED na DAW portu LCXL3 a ve výchozím stavu je vypnutý. Audio na hostitelské stopě prochází stereo beze změny úrovně. Pro běžný dashboard nic nenastavuješ na MIDI portech ani v Custom Mode Launch Controlu. LED test vyžaduje ruční výběr DAW MIDI výstupu; postup je v LED-TEST-CS.md.

## Rychlé vyzkoušení

1. Po načtení zkontroluj, zda počet a názvy karet odpovídají projektu.
2. Ovládej Loopery původními tlačítky LCXL3 a porovnej texty s nativním UI. Přidej nebo odeber jeden Looper; monitor má změnu sám zachytit.
3. Přepni 2 / 3 / 4 / 6, vyzkoušej stránkování i volbu 4/8 taktů na jiné stránce. Změň barvu stopy v Live a ověř záhlaví všech jejích Looperů.
4. Porovnej A/B na kartě s příslušnou stopou v Live. Změň oba sendy, přejmenuj return a ověř průběžnou aktualizaci. Send C nadále používej pro své směrování audia.
5. Vyzkoušej SIZE 0.5x / 1x / 2x podle dostupné plochy obrazovky. Ověř velikost celého okna i obsahu, stránkování a klikání na reference 4/8 taktů.
6. Vyzkoušej současný Play, Record, Overdub a Stop na různých Looperech. Proužky posuzuj pouze jako transportní vodítka.

Pokud něco nesedí, klikni **REPORT**, ulož soubor s příponou `.json` a pošli jej s přesnou verzí Live a Maxu a jednou větou, co nefunguje. Report obsahuje metadata a parametry nalezených Looperů a jejich umístění, nikoliv audio. Limit historie je 6 000 událostí; při delším běhu se nejstarší přepisují a zvyšuje se `dropped_events`.

## Když se něco nenačte

- Zkontroluj, že jsi ZIP rozbalil a všechny tři JS soubory jsou vedle `.amxd`. Není potřeba je ručně přidávat do Max search paths.
- Pokud Live zařízení odmítne nebo okno zůstane prázdné, napiš konkrétní chybu. Přes kontextové menu zařízení → **Open Max Window** lze zobrazit Max Console. Výpis chyb je pro opravu užitečnější než opakování celé diagnostiky.
- Pro zachování závislostí při archivaci Setu můžeš zařízení po ověření otevřít v Maxu a použít Freeze Device; pro první vyzkoušení to není potřeba.

## Co bylo ověřeno

Skutečný AMXD kontejner (nikoliv přejmenovaný JSON) byl dekódován originálním parserem z Ableton/maxdevtools. Zkontrolovány zdroje, propojení, závislosti, stereo průchod a logika automatického hledání v simulovaných API testech. `.amxd` je nezmražené zařízení se třemi sousedními JS závislostmi. **Parser neověřuje nativní běh Maxu, chování Looperu ani macOS.** To ověří první načtení u tebe.

Zdroje a sestavovací skript jsou v balíčku kvůli opravám; k běžnému spuštění nepotřebuješ Python, Node ani terminál.
