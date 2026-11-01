# LCXL3 — RGB SysEx experiment (0.9 beta)

Cíl: změnit barvu **prvního tlačítka horní řady pod fadery** při zachování **Custom Mode 2** a původního mapování **channel 15 / CC37 / momentary**. Launchpad X už není k dispozici; tento experiment používá pouze LCXL3.

Předchozí výsledek: v 0.8.1 fungovala paletová CC zpráva přes DAW In v DAW režimu, ale ne při zobrazeném Custom Mode 2. Teď testujeme jiný formát zprávy — přímou RGB SysEx. Podporu v Custom Mode 2 Novation nepotvrzuje; jde o ohraničený experiment, ne hotové řešení.

## Příprava

1. Odstraň předchozí instanci dashboardu a načti nové `MultiLooperDashboard.amxd` verze **0.9 beta**. Vedle zařízení musí zůstat všechny tři JS soubory včetně nového `mld2_led.js`. Opravené je i zapojení a nabídka v `.amxd`, samotná výměna JS nestačí.
2. Na LCXL3 nech **Custom Mode 2**. Neměň Components, původní MIDI mapování ani nastavení Control Surface.
3. Otevři **LED TEST**. Nech **LED OUTPUT** a **FOLLOW A** vypnuté.
4. V nové spodní nabídce vyber **RGB SysEx - manual test**. Protokol jde změnit pouze při vypnutém LED OUTPUT.

## Test A — DAW In

1. Vyber výstup **LCXL3 1 (DAW In)**, případně jeho dříve použitý alias **Launch_Control_XL_3 Output (LCXL3 1 …)**. Zvol kanál **1 / Ch. 1**. SysEx nemá MIDI kanál, ale pro toto směrování necháváme volbu 1.
2. Zapni **LED OUTPUT**, FOLLOW A nech vypnuté. Stav má začínat **ARMED RGB**.
3. Stiskni postupně **RED**, **GREEN**, **ORANGE**, **WHITE**. Vždy počkej na pozorování výsledku, nemačkej tlačítka rychle za sebou. Zůstávej v Custom Mode 2.
4. Stavový řádek musí obsahovat **TEST RGB**, barvu, výstup a **13 SysEx bytes**. To potvrzuje předání zprávy výstupu modulu, nikoliv její přijetí kontrolerem.
5. Sleduj správné tlačítko a zda barva zůstane i po jeho stisku/uvolnění.

## Test B — MIDI In

1. Vypni **LED OUTPUT**. Nech zvolený protokol **RGB SysEx - manual test** a vypnuté FOLLOW A.
2. Přepni výstup na **LCXL3 1 (MIDI In)** a znovu vyber **1 / Ch. 1**. Nepoužívej To DIN Out / To DIN Out 2.
3. Zapni LED OUTPUT a zopakuj RED / GREEN / ORANGE / WHITE, stále v **Custom Mode 2**.
4. Na MIDI In modul povoluje pouze tento RGB SysEx test. Původní paletové CC zprávy jsou zde blokované; automatické FOLLOW je pro RGB blokované na obou portech.

Při dokončení vypni LED OUTPUT. Modul odešle pouze RGB zhasnutí stejné LED. Nevysílá změny režimu, nahrání Custom Mode ani CC na kanálu 15. Nezapisuje do Looperu, transportu, audio routingu nebo původního MIDI mapování.

## Výsledek testu

Pošli prosím:

| Port v Custom Mode 2 | Správná LED změnila barvu? | Drží po stisku/uvolnění? |
|---|---|---|
| DAW In, RGB SysEx | ano / ne | ano / ne |
| MIDI In, RGB SysEx | ano / ne | ano / ne |

Pokud stav neukazuje ARMED RGB nebo TEST RGB, pošli přesný text. Pokud se objeví chyba v Max Console, pošli ji také. Pokud nejde ani jedna cesta, nic nepřemapovávej: výsledek zapíšeme jako nefunkční RGB experiment pro tuto konfiguraci.

## Formát zprávy

Používá se jediný dokumentovaný RGB příkaz pro LED 37:

`F0 00 20 29 02 15 01 53 25 R G B F7`

`25` je hexadecimální adresa 37. RED = 127/0/0, GREEN = 0/127/0, ORANGE = 127/40/0, WHITE = 32/32/32. Všechna RGB data jsou 7bitová. Žádné jiné SysEx příkazy experiment neposílá.

Zdroj: https://userguides.novationmusic.com/hc/en-gb/articles/27840466544402-Launch-Control-XL-3-programmer-s-DAW-mode
