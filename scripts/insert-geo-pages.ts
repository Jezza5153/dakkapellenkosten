/**
 * Insert 5 geo-pages into the database
 * Usage: npx dotenv -e .env.local -- npx tsx scripts/insert-geo-pages.ts
 */

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../src/db/schema";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error("DATABASE_URL not set"); process.exit(1); }

const sql = neon(DATABASE_URL);
const db = drizzle(sql, { schema });

const geoPages = [
    {
        title: "Dakkapel plaatsen in Amsterdam",
        slug: "dakkapel-amsterdam",
        city: "Amsterdam",
        service: "dakkapel",
        seoTitle: "Dakkapel Amsterdam | Prijzen, regels en offertes 2026",
        seoDescription: "Vergelijk gratis dakkapel offertes in Amsterdam. Bekijk prijsindicaties, aandachtspunten en informatie over vergunningen en plaatsing.",
        content: `<p>Amsterdam is een stad waar dakkapellen veel extra woonruimte kunnen opleveren, maar waar je ook sneller tegen lokale regels en welstand aanloopt dan in veel andere gemeenten. Zeker bij woningen in dichtbebouwde buurten, karakteristieke panden en gebieden met extra ruimtelijke eisen is het slim om niet alleen naar prijs te kijken, maar ook naar uitvoerbaarheid, uitstraling en vergunningkans. De gemeente Amsterdam werkt met de vergunningcheck en wijst er daarnaast op dat in sommige stadsdelen, zoals Zuid, Oost en West, afwijkende regels kunnen gelden voor onder meer dakkapellen.</p>

<p>Wie in Amsterdam een dakkapel wil laten plaatsen, doet er goed aan om eerst drie dingen scherp te krijgen: aan welke zijde van het dak de dakkapel komt, of de woning in een gebied met extra eisen ligt, en of prefab of maatwerk logischer is. In veel Amsterdamse straten telt het uiterlijk van het dakvlak zwaar mee. Daardoor is de goedkoopste optie niet altijd de slimste optie.</p>

<h2>Wat kost een dakkapel in Amsterdam?</h2>

<p>De prijs van een dakkapel in Amsterdam hangt af van breedte, materiaal, afwerking, bereikbaarheid en vergunningstraject. In de praktijk ligt de totaalprijs vaak hoger dan in minder stedelijke gebieden, onder meer door logistiek, beperkte werkruimte en strengere eisen aan uitvoering en uitstraling.</p>

<p>Globaal kun je rekening houden met:</p>
<ul>
<li>kleinere prefab dakkapel: vanaf ongeveer het lagere middensegment</li>
<li>bredere of luxer afgewerkte dakkapel: snel richting hoger segment</li>
<li>maatwerk of complex dakvlak: duidelijk hogere totaalprijs</li>
</ul>

<p>Bij Amsterdamse woningen kunnen kraankosten, bereikbaarheid, verkeersmaatregelen en aanvullende tekeningen of voorbereiding relatief zwaar meewegen in de offerte.</p>

<h2>Vergunning en regels in Amsterdam</h2>

<p>Voor Amsterdam geldt niet één simpele vuistregel die altijd overal klopt. De gemeente verwijst inwoners eerst naar de vergunningcheck en noemt daarnaast expliciet dat er in delen van de stad afwijkende regels kunnen gelden voor verbouwingen zoals dakkapellen. Dat maakt lokaal vooronderzoek extra belangrijk.</p>

<p>Praktisch betekent dit:</p>
<ul>
<li>check altijd eerst de vergunningcheck</li>
<li>kijk of jouw woning in een gebied ligt met aanvullende eisen</li>
<li>wees extra alert bij karakteristieke panden, monumenten of gevoelige straatbeelden</li>
<li>laat de offerte aansluiten op de gewenste uitstraling van de woning</li>
</ul>

<h2>Welke dakkapel past vaak goed in Amsterdam?</h2>

<p>In Amsterdam zie je vaak twee logische richtingen:</p>
<ul>
<li>strakke prefab dakkapel voor snelheid en voorspelbare montage</li>
<li>maatwerk dakkapel wanneer uitstraling, dakvorm of omgeving daar om vraagt</li>
</ul>

<p>Bij woningen waar het straatbeeld belangrijk is, loont het vaak om niet alleen op prijs te selecteren maar ook op ervaring met stedelijke projecten.</p>

<h2>Waar let je op bij offertes vergelijken in Amsterdam?</h2>

<p>Let in Amsterdam extra op:</p>
<ul>
<li>bereikbaarheid en kraanplanning</li>
<li>vergunning of vooroverleg</li>
<li>steiger- en verkeersmaatregelen</li>
<li>buitenafwerking die past bij het pand</li>
<li>regenafvoer, isolatie en binnenafwerking</li>
<li>duidelijke planning en oplevering</li>
</ul>

<p>Een goedkope offerte die dit niet goed uitwerkt, wordt in Amsterdam sneller duurder achteraf.</p>

<h2>Veelgestelde vragen over dakkapellen in Amsterdam</h2>

<h3>Heb je in Amsterdam altijd een vergunning nodig voor een dakkapel?</h3>
<p>Niet per se altijd, maar Amsterdam verwijst nadrukkelijk naar de vergunningcheck en kent op sommige plekken afwijkende regels. Daardoor moet je dit per situatie toetsen.</p>

<h3>Zijn de regels in Amsterdam strenger dan gemiddeld?</h3>
<p>Vaak wel in de praktijk, vooral door stedelijke context, straatbeeld en gebieden met aanvullende eisen.</p>

<h3>Is prefab in Amsterdam een goede keuze?</h3>
<p>Vaak wel, zeker als snelheid en beperkte overlast belangrijk zijn. Bij complexere panden of gevoelige uitstraling kan maatwerk logischer zijn.</p>

<h3>Wat maakt een offerte in Amsterdam duurder?</h3>
<p>Vooral logistiek, bereikbaarheid, kraanwerk, werkruimte, vergunningvoorbereiding en afwerking.</p>`,
    },
    {
        title: "Dakkapel plaatsen in Rotterdam",
        slug: "dakkapel-rotterdam",
        city: "Rotterdam",
        service: "dakkapel",
        seoTitle: "Dakkapel Rotterdam | Prijzen, regels en offertes 2026",
        seoDescription: "Vergelijk gratis dakkapel offertes in Rotterdam. Bekijk prijsindicaties, vergunninginformatie en aandachtspunten voor plaatsing en afwerking.",
        content: `<p>In Rotterdam kiezen veel huiseigenaren voor een dakkapel om een zolder bruikbaarder te maken of extra licht en loopruimte te creëren. De stad heeft veel verschillende woningtypen, van vooroorlogse woonwijken tot nieuwere woongebieden, en die verschillen hebben invloed op wat technisch, esthetisch en vergunningstechnisch verstandig is. De gemeente Rotterdam geeft duidelijk aan dat je voor een dakkapel aan de voorkant van de woning bijna altijd een vergunning nodig hebt. Ook verwijst de gemeente naar een stappenplan en zelfs een voorbeeldtekening voor dakkapel-aanvragen.</p>

<p>Dat maakt Rotterdam een stad waar voorbereiding belangrijk is. Wie snel offertes vergelijkt zonder de locatie, het dakvlak en de vergunningkant mee te nemen, vergelijkt vaak onvolledige voorstellen.</p>

<h2>Wat kost een dakkapel in Rotterdam?</h2>

<p>De kosten van een dakkapel in Rotterdam hangen af van breedte, materiaal, wel of geen prefab, afwerking en bereikbaarheid van de woning. In wijken met makkelijkere kraantoegang en meer standaard woningen is prefab vaak aantrekkelijk. Bij lastig bereikbare straten of woningen waar uitstraling zwaarder weegt, loopt de prijs meestal op.</p>

<p>Houd grofweg rekening met:</p>
<ul>
<li>standaard prefab: gunstiger geprijsd</li>
<li>bredere dakkapel of luxere afwerking: midden tot hoger segment</li>
<li>maatwerk met extra voorbereiding: hoger geprijsd</li>
</ul>

<h2>Vergunning en regels in Rotterdam</h2>

<p>Rotterdam is hier vrij duidelijk over: voor een dakkapel aan de voorkant van de woning heb je bijna altijd een vergunning nodig. De gemeente adviseert daarnaast het bouwplan te toetsen via de check en noemt de mogelijkheid van een conceptverzoek als je vooraf wilt laten meekijken.</p>

<p>Dat is vooral slim als:</p>
<ul>
<li>je woning in een opvallend straatbeeld staat</li>
<li>je twijfelt over maat, hoogte of plaatsing</li>
<li>je snel wilt weten of het plan kansrijk is</li>
<li>je later geen tijd wilt verliezen in het vergunningstraject</li>
</ul>

<h2>Welke dakkapel wordt vaak gekozen in Rotterdam?</h2>

<p>In Rotterdam zie je vaak:</p>
<ul>
<li>prefab dakkapellen bij praktische uitbreidingen</li>
<li>kunststof dakkapellen vanwege onderhoudsgemak</li>
<li>maatwerk bij woningen waar het vooraanzicht of de verhoudingen belangrijk zijn</li>
</ul>

<h2>Waar moet je op letten bij offertes in Rotterdam?</h2>

<p>Vraag niet alleen een prijs op, maar laat de aanbieder ook aangeven:</p>
<ul>
<li>of vergunningbegeleiding inbegrepen is</li>
<li>welke tekeningen of stukken nodig zijn</li>
<li>hoe de afwerking is opgebouwd</li>
<li>of kraan- en montagekosten compleet zijn</li>
<li>hoeveel overlast en montagetijd je kunt verwachten</li>
</ul>

<h2>Veelgestelde vragen over dakkapellen in Rotterdam</h2>

<h3>Heb je in Rotterdam voor een dakkapel aan de voorkant een vergunning nodig?</h3>
<p>Ja, volgens de gemeente bijna altijd.</p>

<h3>Kun je vooraf laten toetsen of het plan haalbaar is?</h3>
<p>Ja, Rotterdam biedt een conceptverzoek aan voor plannen waarbij je vooraf duidelijkheid wilt.</p>

<h3>Is prefab een goede keuze in Rotterdam?</h3>
<p>Vaak wel, zeker bij standaard situaties en als snelheid belangrijk is.</p>

<h3>Waarom verschillen offertes in Rotterdam soms sterk?</h3>
<p>Door verschil in vergunningbegeleiding, afwerking, bereikbaarheid, materiaalkeuze en volledigheid van de offerte.</p>`,
    },
    {
        title: "Dakkapel plaatsen in Utrecht",
        slug: "dakkapel-utrecht",
        city: "Utrecht",
        service: "dakkapel",
        seoTitle: "Dakkapel Utrecht | Prijzen, regels en offertes 2026",
        seoDescription: "Vergelijk gratis dakkapel offertes in Utrecht. Bekijk kosten, vergunningregels en praktische aandachtspunten voor jouw woning.",
        content: `<p>In Utrecht is een dakkapel vaak een slimme manier om een zolderkamer echt bruikbaar te maken. Tegelijk is Utrecht een gemeente waar de regels vrij concreet zijn: de gemeente zegt dat je voor een dakkapel aan de voorkant van je huis altijd een omgevingsvergunning nodig hebt. Voor een dakkapel aan de achterkant of zijkant heb je soms een vergunning nodig, en bij een monument is een vergunning altijd nodig. De gemeente verwijst daarbij direct naar de vergunningcheck.</p>

<p>Die duidelijkheid is prettig, maar betekent ook dat je in Utrecht al vroeg moet weten aan welke zijde van het dak je wilt bouwen. Dat bepaalt namelijk direct een groot deel van het traject.</p>

<h2>Wat kost een dakkapel in Utrecht?</h2>

<p>De kosten hangen af van:</p>
<ul>
<li>breedte van de dakkapel</li>
<li>prefab of traditioneel</li>
<li>materiaalkeuze</li>
<li>binnenafwerking</li>
<li>bereikbaarheid van de woning</li>
<li>vergunningvoorbereiding</li>
</ul>

<p>Bij veel Utrechtse woningen is prefab interessant vanwege snelle montage. Bij woningen waar uiterlijk en maatvoering zwaarder wegen, kan traditioneel maatwerk beter passen.</p>

<h2>Vergunning en regels in Utrecht</h2>

<p>De gemeente Utrecht maakt een belangrijk onderscheid:</p>
<ul>
<li><strong>voorkant woning:</strong> altijd vergunning nodig</li>
<li><strong>achterkant of zijkant:</strong> soms vergunning nodig</li>
<li><strong>monument:</strong> altijd vergunning nodig</li>
</ul>

<p>Daarnaast legt Utrecht onder de Omgevingswet uit dat de vergunningcheck onderscheid maakt tussen technische en ruimtelijke onderdelen van een aanvraag. Soms moet je voor het technische deel met een kwaliteitsborger werken.</p>

<h2>Waarom is Utrecht interessant voor dakkapellen?</h2>

<p>De gemeente Utrecht noemt zelf dat een dakkapel vaak een logischer manier is om extra ruimte te winnen dan een dakopbouw, omdat een dakopbouw meestal niet is toegestaan waar de herkenbaarheid van daklijnen belangrijk is.</p>

<p>Dat maakt een dakkapel in Utrecht vaak een praktisch én planologisch slim alternatief.</p>

<h2>Waar let je op bij een offerte in Utrecht?</h2>

<p>Let op:</p>
<ul>
<li>positie van de dakkapel</li>
<li>vergunning of vergunningcheck</li>
<li>tekenwerk en maatvoering</li>
<li>isolatie en ventilatie</li>
<li>buitenafwerking passend bij de woning</li>
<li>inbegrepen binnenafwerking</li>
<li>planning van montage en oplevering</li>
</ul>

<h2>Veelgestelde vragen over dakkapellen in Utrecht</h2>

<h3>Heb je in Utrecht voor een dakkapel aan de voorkant altijd een vergunning nodig?</h3>
<p>Ja. De gemeente Utrecht zegt dit expliciet.</p>

<h3>Heb je aan de achterkant in Utrecht ook altijd een vergunning nodig?</h3>
<p>Nee, soms wel en soms niet. Dat moet je per situatie toetsen.</p>

<h3>Is een dakkapel in Utrecht vaak logischer dan een dakopbouw?</h3>
<p>Vaak wel. Utrecht geeft aan dat een dakopbouw meestal niet is toegestaan, terwijl een dakkapel vaak een beter passend alternatief is.</p>

<h3>Wat maakt een offerte in Utrecht sterk?</h3>
<p>Een sterke offerte is volledig, houdt rekening met vergunning en afwerking, en sluit aan op de positie van de dakkapel.</p>`,
    },
    {
        title: "Dakkapel plaatsen in Den Haag",
        slug: "dakkapel-den-haag",
        city: "Den Haag",
        service: "dakkapel",
        seoTitle: "Dakkapel Den Haag | Prijzen, regels en offertes 2026",
        seoDescription: "Vergelijk gratis dakkapel offertes in Den Haag. Bekijk prijsindicaties, vergunninginformatie en aandachtspunten voor plaatsing.",
        content: `<p>In Den Haag kan een dakkapel veel verschil maken in licht, ruimte en gebruiksgemak van de bovenste verdieping. De stad kent veel verschillende woningtypes en buurten, waardoor het slim is om niet alleen naar de technische uitvoering te kijken, maar ook naar regels, uitstraling en het proces van aanvragen. Voor omgevingsvergunningen geeft Den Haag aan dat een eenvoudig bouwplan normaal gesproken binnen 8 weken wordt beoordeeld, maar dat het door drukte momenteel minimaal 12 weken duurt. Bij ingewikkelde plannen moet je vaak langer rekenen.</p>

<p>Wie een dakkapel in Den Haag wil laten plaatsen, doet er dus goed aan om tijdig te starten met voorbereiding en offertes.</p>

<h2>Wat kost een dakkapel in Den Haag?</h2>

<p>De prijs wordt vooral bepaald door:</p>
<ul>
<li>breedte</li>
<li>materiaal</li>
<li>prefab of maatwerk</li>
<li>moeilijkheid van plaatsing</li>
<li>binnenafwerking</li>
<li>voorbereiding van het vergunningstraject</li>
</ul>

<p>In dichtbebouwde Haagse wijken kunnen logistiek, vergunningvoorbereiding en uitstraling meer invloed hebben dan veel mensen vooraf denken.</p>

<h2>Vergunning en regels in Den Haag</h2>

<p>Den Haag werkt met de omgevingsvergunning en het omgevingsplan. De gemeente noemt bij plannen aan een woning, waaronder een dakkapel, ook nadrukkelijk het belang van buurtoverleg als je plan niet aansluit op het omgevingsplan.</p>

<p>Daarnaast publiceert de gemeente een stappenplan na aanvraag, waarin wordt uitgelegd dat de aanvraag op volledigheid en op passendheid binnen de regels wordt beoordeeld. Als het plan niet voldoet, kijkt de gemeente of aanpassing mogelijk is.</p>

<h2>Welke dakkapel past vaak goed in Den Haag?</h2>

<p>Dat hangt sterk af van de buurt en het woningtype. In Den Haag werkt een onderhoudsarme kunststof of prefab oplossing vaak goed, maar bij woningen waar het straatbeeld of de verhoudingen gevoelig liggen is maatwerk regelmatig de betere keuze.</p>

<h2>Waar moet je op letten bij offertes in Den Haag?</h2>

<p>Let op:</p>
<ul>
<li>is vergunningbegeleiding meegenomen?</li>
<li>zijn tekeningen inbegrepen?</li>
<li>hoe lang is de verwachte doorlooptijd?</li>
<li>is binnenafwerking apart of inbegrepen?</li>
<li>hoe wordt de buitenzijde afgewerkt?</li>
<li>hoe realistisch is de planning gezien de lokale vergunningduur?</li>
</ul>

<h2>Veelgestelde vragen over dakkapellen in Den Haag</h2>

<h3>Hoe lang duurt een vergunningtraject in Den Haag?</h3>
<p>Bij een eenvoudig bouwplan meestal 8 weken, maar Den Haag meldt dat het door drukte momenteel minimaal 12 weken duurt. Complexere plannen duren vaak langer.</p>

<h3>Moet je in Den Haag soms met buren overleggen?</h3>
<p>Ja, vooral als je plan niet past binnen het omgevingsplan. De gemeente noemt buurtoverleg dan expliciet.</p>

<h3>Is prefab in Den Haag een goede keuze?</h3>
<p>Vaak wel voor snelheid en voorspelbaarheid, maar niet altijd als uitstraling of maatwerk doorslaggevend is.</p>

<h3>Waar zitten vaak de extra kosten?</h3>
<p>Vooral in vergunningvoorbereiding, bereikbaarheid, afwerking en maatwerk.</p>`,
    },
    {
        title: "Dakkapel plaatsen in Eindhoven",
        slug: "dakkapel-eindhoven",
        city: "Eindhoven",
        service: "dakkapel",
        seoTitle: "Dakkapel Eindhoven | Prijzen, regels en offertes 2026",
        seoDescription: "Vergelijk gratis dakkapel offertes in Eindhoven. Bekijk kosten, vergunningregels en aandachtspunten voor plaatsing en afwerking.",
        content: `<p>In Eindhoven is een dakkapel voor veel huiseigenaren een praktische manier om meer stahoogte, daglicht en bruikbare woonruimte te creëren. De gemeente Eindhoven geeft aan dat je in het Omgevingsloket kunt checken of je een vergunning nodig hebt en noemt daarbij expliciet dat voor sommige activiteiten geen vergunning nodig is, bijvoorbeeld voor een kleine dakkapel aan de achterkant van de woning. Voor een dakkapel aan de voorkant moet je volgens de gemeente altijd een vergunning aanvragen.</p>

<p>Daardoor is in Eindhoven vooral de positie van de dakkapel een belangrijke eerste vraag. Wie dat vooraf goed uitzoekt, voorkomt vertraging en onnodige kosten.</p>

<h2>Wat kost een dakkapel in Eindhoven?</h2>

<p>De kosten hangen af van:</p>
<ul>
<li>breedte</li>
<li>materiaal</li>
<li>prefab of traditioneel</li>
<li>isolatie en afwerking</li>
<li>kraan- en montagewerk</li>
<li>voorbereiding en vergunning</li>
</ul>

<p>Bij veel woningen in Eindhoven is prefab aantrekkelijk door de snelheid, maar bij afwijkende dakvormen of specifieke uitstraling kan maatwerk een betere investering zijn.</p>

<h2>Vergunning en regels in Eindhoven</h2>

<p>Eindhoven verwijst voor de beoordeling naar het Omgevingsloket. De gemeente noemt daarbij twee belangrijke punten:</p>
<ul>
<li>voor een kleine dakkapel aan de achterkant van de woning is soms geen vergunning nodig</li>
<li>voor een dakkapel aan de voorkant moet je altijd een vergunning aanvragen</li>
</ul>

<p>Dat maakt de offertefase eenvoudiger: je weet meestal snel of je vooral op uitvoering kunt sturen of ook op een vergunningstraject.</p>

<h2>Welke dakkapellen zijn populair in Eindhoven?</h2>

<p>Vaak gekozen:</p>
<ul>
<li>kunststof dakkapellen vanwege onderhoudsgemak</li>
<li>prefab dakkapellen vanwege snelle plaatsing</li>
<li>maatwerk bij woningen waar de detaillering beter moet aansluiten op het bestaande dak</li>
</ul>

<h2>Waar moet je op letten bij offertes in Eindhoven?</h2>

<p>Vraag altijd of de offerte duidelijk maakt:</p>
<ul>
<li>of vergunninghulp inbegrepen is</li>
<li>hoe de isolatie wordt uitgevoerd</li>
<li>of binnenafwerking is meegenomen</li>
<li>wat de planning is</li>
<li>welke garanties worden gegeven</li>
<li>of kraan- en montagekosten volledig zijn opgenomen</li>
</ul>

<h2>Veelgestelde vragen over dakkapellen in Eindhoven</h2>

<h3>Heb je in Eindhoven voor een dakkapel aan de voorkant een vergunning nodig?</h3>
<p>Ja, de gemeente zegt dat je daarvoor altijd een vergunning moet aanvragen.</p>

<h3>Kan een dakkapel aan de achterkant soms zonder vergunning?</h3>
<p>Ja, Eindhoven noemt dat voor sommige kleine dakkapellen aan de achterkant geen vergunning nodig is. Controle per situatie blijft nodig via het Omgevingsloket.</p>

<h3>Is prefab in Eindhoven slim?</h3>
<p>Vaak wel, zeker als snelheid en een voorspelbaar traject belangrijk zijn.</p>

<h3>Waar moet je vooral op letten bij het vergelijken?</h3>
<p>Volledigheid van de offerte, afwerking, isolatie en de vraag of vergunningbegeleiding is inbegrepen.</p>`,
    },
];

async function main() {
    console.log("Inserting 5 geo-pages...\n");

    for (const page of geoPages) {
        try {
            await db.insert(schema.pages).values({
                ...page,
                status: "published",
                createdAt: new Date(),
                updatedAt: new Date(),
            }).onConflictDoNothing();
            console.log(`✅ ${page.city} — /${page.slug}`);
        } catch (err: any) {
            console.error(`❌ ${page.city}: ${err.message}`);
        }
    }

    console.log("\nDone!");
}

main().catch(console.error);
