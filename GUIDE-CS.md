# Recording Guide — 0.15.0 beta

Dashboard nyní zobrazuje jeden velký průvodce a kompaktní stavové karty. Karty ukazují stav, obsah bufferu, plánovanou délku prvního záznamu a sendy A/B. Rozložení 2/3/4/6 a zoom zůstávají; jednotlivé referenční hlavy 4/8 taktů jsou odstraněné.

## Před prvním testem

Ulož si kopii Live Setu. Původní LED nastavení zůstává kompatibilní. Načti novou instanci AMXD se všemi pěti sousedními JS; běžící instance změnu JS automaticky nenačítá.

Pro průvodce platí: Live transport běží, metrum 4/4, Quantization na každém Looperu **1 Bar**, běžná rychlost, Reverse vypnutý. První záznam má pevnou délku a následný přechod do Play. Délka se čte z nativního Record Length seznamu a indexu; neznámý formát nevytváří náhradní čtyřtaktovou délku.

## Zapnutí zachycení stisků

Původní nativní Rec/Play/Overdub MIDI mapování lze dál používat se stavovými kartami. Bez zachyceného příkazu průvodce nezná začátek a zobrazí neznámou pozici.

Pro odpočet zapni **GUIDE CTRL** v LED SETUP:

1. Ve zkušebním Setu odstraň nativní MIDI mapování hlavních Rec/Play/Overdub tlačítek, která chceš převést na dashboard. Nesmaž mapování knobů/faderů.
2. V LED SETUP ponech správné hlavní CC, CH15, ENABLE a ověřené LED hodnoty (u A 126/1). Vstup je LCXL3 MIDI Out, výstup MIDI In. Zapni SYNC / CTRL.
3. Zapni GUIDE CTRL. Hlavní fyzická tlačítka musí být momentary 127 při stisku, 0 při uvolnění. Hodnoty LED zůstávají nezávislé.
4. Nejprve hlavní tlačítko stiskni a uvolni pro připravení vstupu. Teprve další stisk vyšle příkaz. Opakované 127 během držení se ignorují.
5. Dashboard obsluhuje krátké stisky: prázdný STOP → Record; nahraný STOP → Play; Play → Overdub; Record/Overdub → Play. Dlouhé a dvojité stisky původního multipurpose tlačítka se nepřenášejí. Stop/Clear dál obstarává stávající druhé tlačítko.

Od 0.14.3 se **GUIDE CTRL ukládá do Live Setu** spolu s LED/Stop konfigurací. Zapni ho a ulož Set přes Cmd+S; při dalším otevření se obnoví stejná volba i přepínač v UI. Ovládání počká na potvrzené správné MIDI směrování a SYNC / CTRL. Rozpracované stisky ani připravení tlačítek se neukládají: po obnovení je potřeba hlavní tlačítko jednou uvolnit (případně krátce stisknout/uvolnit), teprve další stisk spustí akci. Nové zařízení a konfigurace převedené z verzí 1–3 začínají s GUIDE CTRL vypnutým. Při návratu ke starému ovládání vypni GUIDE CTRL a obnov nativní mapování. Dva způsoby nepoužívej současně.

## Co ukazuje panel

- READY: společné doby a čas do příštího taktu.
- PLANNED: odpočet od přijatého a provedeného příkazu k očekávanému začátku na příštím taktu.
- REC: odhad taktu/doby a zbývající délky, až když API potvrdí stav Record. Poslední takt je zvýrazněný.
- OVERDUB: odhad pozice původní smyčky a počtu průchodů od vstupu do overdubu. Není to odpočet automatického ukončení overdubu.
- DONE: krátké potvrzení po pozorovaném přechodu do Play.
- WAITING: očekávaná hranice nastala, ale příslušný stav nebyl potvrzen.
- POSITION UNKNOWN: chybí zachycený začátek smyčky; hlava se nevymýšlí.

Časová poloha je vždy **odhad z příkazu a Live transportu**, nikoli čtení skutečné hlavy Looperu. Přesná shoda hranic vyžaduje nativní test; API stav může reprezentovat už požadovanou akci. Přijetí příkazu není důkazem skutečného začátku záznamu. Nepoužívej panel k měření latence v milisekundách.

Od 0.15.0 se známá délka dokončené smyčky ukládá do Live Setu spolu s přesným názvem stopy, názvem zařízení, umístěním v racku a kontrolní délkou bufferu. Odhad fáze ani interní ID se nepersistují. Po Stop se zahodí stará pozice, ale zachová se známá délka dokončené smyčky. Uživatel ověřil, že Looper po Stop → Play začíná od začátku: průvodce proto po zachyceném Play a potvrzení stavu PLAY založí novou referenci na očekávané taktové hranici. Další Overdub už používá tuto novou referenci. Výstup Overdub → Play ji nepřestavuje. Clear a zjištěná změna délky bufferu nebo identity cíle ruší i uloženou délku. Po novém otevření Setu se uložená metadata spojí pouze s jednoznačným odpovídajícím Looperem a shodným neprázdným bufferem. Nové Play potom založí nový začátek; samotné načtení nevytváří fázi. Při přechodu z verze 0.14.x je nutný jeden nový dokončený záznam, protože starší verze tuto informaci neukládala. Samotné nastavení délky budoucího záznamu není důkazem délky existujícího audia. Skok či ztráta transportních dat zneplatní fázi. Pro současný overdub/record více Looperů se průvodce zablokuje, samotné Loopery pokračují.

## Nativní ověření

Nejdřív na jednom zkušebním Looperu ověř: (1) doručení 127/0 po odstranění nativního mapování, (2) odpočet a skutečný začátek na další první době, (3) pevnou délku např. 2 takty a automatický Play, (4) jinou délku na dalším Looperu, (5) Overdub spuštěný uprostřed existující smyčky, (6) výstup z overdubu, Stop, Hold Clear, (7) zapni GUIDE CTRL, ulož Set, zavři a znovu otevři Live: ověř obnovený přepínač, správné MIDI směrování a nový stisk po uvolnění. Pokud akce neprojde, výsledek je v input diagnostice LED SETUP. Příkazy se při chybě neopakují.

Automatické testy ověřují model a propojení, nikoli skutečné časování Abletonu nebo LCXL3.

## Ověření uložení smyčky (0.15.0)

1. Načti nový AMXD se všemi pěti JS, zapni GUIDE CTRL a pořiď nový pevně dlouhý záznam s přechodem do Play.
2. Ulož Set přes Cmd+S až po dokončení záznamu. Ukládají se metadata dashboardu; samotné audio nadále spravuje nativní Looper/Live.
3. Zavři Live, otevři stejný Set, spusť globální transport a uvolněním připrav hlavní tlačítko.
4. Přes GUIDE CTRL spusť smyčku tlačítkem Play. Při dalším Overdub má průvodce ukazovat odhad pozice se správnou obnovenou délkou.
5. Po změně metadat (nový záznam nebo Clear) Set znovu ulož.

Prázdné úvodní načítání nepřepisuje uložené údaje. Nová interní ID po restartu nevadí. Více Looperů na stejně pojmenované stopě, jiný název zařízení/racková cesta nebo jiná délka bufferu brání převzetí délky. Po otevření automaticky běžícího Looperu bez zachyceného Play zůstane fáze neznámá. Shodný název a délka nejsou otisk audia: neodhalíme externí výměnu audia za stejně dlouhé se zcela shodnými názvy při zavřeném dashboardu. V takovém případě vytvoř nový záznam a Set znovu ulož.

Nové testy propojují skutečné skripty core/setup, generovaný host parametr, uložení a nové instance se změněnými runtime ID. Přesné obnovení v nativním Live je stále třeba ověřit.
