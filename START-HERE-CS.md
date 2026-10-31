# Multi Looper Dashboard 0.3 beta

## Spuštění — bez úprav v Maxu

1. **Rozbal celý ZIP do stálé složky na Macu.** Nech `MultiLooperDashboard.amxd`, `mld2_core.js` a `mld2_ui.js` vedle sebe.
2. V Live 12 Suite přetáhni **`MultiLooperDashboard.amxd` na libovolnou audio stopu**, například novou prázdnou stopu Dashboard.
3. Na zařízení klikni **OPEN DASHBOARD**. Monitor si Loopery najde sám. Není potřeba přejmenovávat stopy, otevírat editor ani měnit MIDI nastavení.

Jde o grafickou aktualizaci předchozího beta zařízení. Tyto nové vizuální úpravy nebyly přímo v Live ověřeny; verzi 0.2 už jsi u sebe spustil.

## Co je nové v 0.3

- Méně textu: na kartě zůstává název stopy, velký barevný stav a délka reference.
- Silnější průběhový proužek s hranicemi a čísly jednotlivých taktů 1–4 nebo 1–8.
- Aktuální referenční takt má zvýrazněné číslo; pohyblivá svislá čára ukazuje pozici uvnitř taktu.
- Kliknutí na proužek přepíná referenci 4/8 taktů.
- Technický výpis je dostupný přes REPORT, nikoliv na každé kartě.
- Vyhledávání Looperů, stránkování a mapování MIDI fungují stejně jako ve verzi 0.2.

Automaticky se hledají všechny vestavěné Loopery ve stopách, returnech, Masteru a rackových řetězcích, včetně více Looperů na stejné stopě. Karty se zobrazují po šesti. Počet není omezený na čtyři; ochranný limit průchodu je 10 000 zařízení a hloubka racků 24.

## Jak číst displej

**STOP / PLAY / RECORD / OVERDUB** se zobrazí, když API vrátí odpovídající text parametru State. Číselné pořadí stavů se nehádá. Pokud text nelze poznat nebo není parametr dostupný, zůstane původní text nebo UNKNOWN. U API State zatím není v tvém Live ověřeno, zda se mění při vyžádání akce, nebo až při jejím skutečném provedení. Nápis RECORD proto zatím sám o sobě nepotvrzuje, že už probíhá záznam.

Skutečné čekání na nahrávání a čtecí hlava nejsou tímto buildem měřené. Opakované hlášky o tom byly z karet odstraněny; časový průběh je dál pouze referencí podle transportu.

**Průběhový proužek s čísly taktů** je pomocná fráze od začátku transportu (1.1.1), nikoliv měřený průběh smyčky. Kliknutím na proužek přepneš jen lokální referenci mezi 4 a 8 takty. Nenastavuješ tím Looper. Volba se při přesunu stejného zařízení během tohoto běhu zachová, po novém otevření Setu zatím začíná na 4.

**Bar / Beat / Next bar** jsou vypočtené z transportu pro pevné 4/4. Next bar odpočítává čtvrťové doby k další hranici jednoho taktu; na hranici ukáže 4. Není to odpočet konkrétního požadavku Record. Při zastavení transportu mřížka stojí, i kdyby Looper hrál samostatně. Pro proměnlivé metrum, posunutý začátek skladby, opačný směr nebo změněnou rychlost Looperu není tato mřížka jeho pozicí.

Zařízení pouze čte Live API. Neobsahuje MIDI příjem/výstup, zásahy do mapování LCXL3, ovládání transportu ani zápisy do parametrů Looperu. Audio na hostitelské stopě prochází stereo beze změny úrovně. Nic nenastavuješ na DAW portu ani Custom Mode Launch Controlu.

## Rychlé vyzkoušení

1. Po načtení zkontroluj, zda počet a názvy karet odpovídají projektu.
2. Ovládej Loopery původními tlačítky LCXL3 a porovnej texty s nativním UI. Přidej nebo odeber jeden Looper; monitor má změnu sám zachytit.
3. Vyzkoušej současný Play, Record, Overdub a Stop na různých Looperech. Proužky posuzuj pouze jako transportní vodítka.

Pokud něco nesedí, klikni **REPORT**, ulož soubor s příponou `.json` a pošli jej s přesnou verzí Live a Maxu a jednou větou, co nefunguje. Report obsahuje metadata a parametry nalezených Looperů a jejich umístění, nikoliv audio. Limit historie je 6 000 událostí; při delším běhu se nejstarší přepisují a zvyšuje se `dropped_events`.

## Když se něco nenačte

- Zkontroluj, že jsi ZIP rozbalil a oba JS soubory jsou vedle `.amxd`. Není potřeba je ručně přidávat do Max search paths.
- Pokud Live zařízení odmítne nebo okno zůstane prázdné, napiš konkrétní chybu. Přes kontextové menu zařízení → **Open Max Window** lze zobrazit Max Console. Výpis chyb je pro opravu užitečnější než opakování celé diagnostiky.
- Pro zachování závislostí při archivaci Setu můžeš zařízení po ověření otevřít v Maxu a použít Freeze Device; pro první vyzkoušení to není potřeba.

## Co bylo ověřeno

Skutečný AMXD kontejner (nikoliv přejmenovaný JSON) byl dekódován originálním parserem z Ableton/maxdevtools. Zkontrolovány zdroje, propojení, závislosti, stereo průchod a logika automatického hledání v simulovaných API testech. `.amxd` je nezmražené zařízení se dvěma sousedními JS závislostmi. **Parser neověřuje nativní běh Maxu, chování Looperu ani macOS.** To ověří první načtení u tebe.

Zdroje a sestavovací skript jsou v balíčku kvůli opravám; k běžnému spuštění nepotřebuješ Python, Node ani terminál.
