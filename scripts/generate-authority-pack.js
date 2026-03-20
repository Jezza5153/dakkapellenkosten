const fs = require("fs");
const path = require("path");

const root = process.cwd();
const siteUrl = "https://dakkapellenkosten.nl";
const updatedIso = "2026-03-11";
const updatedHuman = "11 maart 2026";
const contactEmail = "info@dakkapellenkosten.nl";
const contactEmailHref = `mailto:${contactEmail}`;
const organizationId = `${siteUrl}/#organization`;
const websiteId = `${siteUrl}/#website`;
const editorName = "J. Arrascaeta";
const editorProfileUrl = `${siteUrl}/redactie/#j-arrascaeta`;
const editorJobTitle = "Hoofdredacteur";

const categories = {
  kosten: {
    slug: "kosten",
    name: "Dakkapel kosten",
    shortName: "Kosten",
    label: "Dakkapel kosten",
    description:
      "Alles over dakkapel prijzen, kosten per meter, materiaalkeuzes en wat er wel of niet in een offerte zit.",
    intro: [
      "In deze categorie vind je alle kostenpagina's voor huiseigenaren die willen weten wat een dakkapel ongeveer kost en waar de verschillen in prijs vandaan komen. Dat gaat verder dan alleen een totaalbedrag: het type dakkapel, de breedte, het gekozen materiaal, de afwerking en de bereikbaarheid van het dak hebben allemaal invloed op de uiteindelijke offerte.",
      "De prijsinformatie op DakkapellenKosten.nl is geschreven als onafhankelijke samenvatting van openbare prijsindicaties van Nederlandse vergelijkingssites, leveranciers en dakkapelbedrijven. Gebruik deze bedragen als startpunt voor je oriëntatie en controleer ze altijd met actuele offertes voor jouw woning en dakconstructie.",
    ],
  },
  vergunning: {
    slug: "vergunning",
    name: "Vergunning & regels",
    shortName: "Vergunning",
    label: "Vergunning & regels",
    description:
      "Uitleg over vergunningsvrij bouwen, voor- en achterzijde, monumenten en het aanvragen van een omgevingsvergunning.",
    intro: [
      "Wie een dakkapel wil plaatsen, komt vroeg of laat uit bij de vraag of een vergunning nodig is. Vooral het verschil tussen voorzijde en achterzijde, de zichtbaarheid vanaf openbaar gebied en de status van de woning spelen hierbij een rol. Ook lokale regels en het omgevingsplan van de gemeente kunnen de uitkomst beïnvloeden.",
      "De artikelen in deze categorie vatten veelgenoemde voorwaarden samen uit openbare uitleg van gemeenten, omgevingsloketten en dakkapelaanbieders. Zie ze als praktische voorbereiding: de definitieve check doe je altijd via het Omgevingsloket en, bij twijfel, direct bij je eigen gemeente.",
    ],
  },
  materialen: {
    slug: "materialen",
    name: "Materialen & soorten",
    shortName: "Materialen",
    label: "Materialen",
    description:
      "Vergelijk prefab, traditioneel, kunststof, hout, polyester en veelgekozen uitvoeringen zoals een plat dak of rolluiken.",
    intro: [
      "Onder het kopje materialen en soorten vallen eigenlijk meerdere keuzes tegelijk: kies je voor prefab of traditioneel, welk materiaal past het beste bij je woning en welke uitvoering sluit aan op je smaak en onderhoudswensen? Die keuzes hebben direct invloed op prijs, uitstraling, levensduur en de snelheid van plaatsing.",
      "Deze categorie helpt je om het aanbod logisch te ordenen. Je vindt hier zowel overzichtspagina's als gerichte keuzehulpen over hout, kunststof, polyester, moderne modellen en veelgekozen details zoals een plat dak of rolluiken.",
    ],
  },
  plaatsing: {
    slug: "plaatsing",
    name: "Plaatsing & proces",
    shortName: "Plaatsing",
    label: "Plaatsing & proces",
    description:
      "Van voorbereiding en planning tot montage, binnenafwerking en veelgemaakte fouten tijdens het plaatsen van een dakkapel.",
    intro: [
      "Een dakkapel plaatsen is meer dan alleen de montagedag. Er gaan keuzes aan vooraf over maat, vergunning, bereikbaarheid, hijswerk en binnenafwerking. Wie begrijpt hoe het proces eruitziet, kan offertes beter beoordelen en voorkomt vertraging tijdens de uitvoering.",
      "In deze categorie lees je hoe de plaatsing meestal verloopt, hoe lang een traject duurt, wat er op de montagedag gebeurt en welke voorbereiding je zelf moet treffen. Daarmee is dit cluster vooral waardevol voor huiseigenaren die dicht tegen de offerte- of uitvoeringsfase aan zitten.",
    ],
  },
  onderhoud: {
    slug: "onderhoud",
    name: "Onderhoud & problemen",
    shortName: "Onderhoud",
    label: "Onderhoud & problemen",
    description:
      "Onderhoudstips, levensduur en oplossingen voor veelvoorkomende klachten zoals lekkage, tocht en condens.",
    intro: [
      "Een goed geplaatste dakkapel gaat lang mee, maar geen enkel dakonderdeel blijft onderhoudsvrij. Kitnaden, loodslabben, afwatering, schilderwerk en ventilatie vragen allemaal periodieke controle. Als je daar te laat bij bent, ontstaan vochtproblemen, houtrot, tocht of lekkage.",
      "De artikelen in deze categorie zijn geschreven om problemen vroeg te herkennen en om beter te bepalen wanneer een kleine onderhoudsbeurt volstaat en wanneer herstel of vervanging logisch wordt. Daarmee zijn deze pagina's niet alleen informatief, maar ook sterk servicegericht.",
    ],
  },
  bespaartips: {
    slug: "bespaartips",
    name: "Keuze, offertes & bespaartips",
    shortName: "Bespaartips",
    label: "Bespaartips",
    description:
      "Vergelijkingen, investeringskeuzes, offertechecklists en tips om beter een specialist of aannemer te selecteren.",
    intro: [
      "Veel huiseigenaren weten grofweg dat ze meer ruimte willen, maar twijfelen nog over de beste route. Kies je prefab of traditioneel, welke breedte is logisch en hoe weet je of een offerte echt compleet is? In de praktijk zit juist daar vaak het meeste besparingspotentieel.",
      "Deze categorie bundelt keuzehulp en conversiegerichte content. Dat betekent: slimme vergelijkingen, checklists, aannemerselectie en uitleg over wanneer een dakkapel financieel zinvol is. Het doel is dat je niet alleen een prijs ziet, maar ook begrijpt welke aanbieding inhoudelijk de beste is.",
    ],
  },
};

const trustPages = [
  {
    slug: "over-ons",
    title: "Over DakkapellenKosten.nl",
    metaTitle: "Over DakkapellenKosten.nl | Onafhankelijk platform voor dakkapel kosten en offertes",
    metaDescription:
      "Lees wie achter DakkapellenKosten.nl zit, hoe de informatie wordt samengesteld en hoe het platform huiseigenaren helpt bij dakkapel offertes.",
    label: "Over ons",
    schemaType: "AboutPage",
    description:
      "DakkapellenKosten.nl is een onafhankelijk informatie- en vergelijkplatform voor huiseigenaren die dakkapel prijzen, materialen, vergunningen en offertes beter willen begrijpen.",
    intro: [
      "DakkapellenKosten.nl is opgezet voor huiseigenaren die niet alleen snel een offerte willen, maar vooral eerst willen begrijpen waar prijsverschillen vandaan komen. In de praktijk blijken offertes vaak lastig te vergelijken doordat maatvoering, materiaal, plaatsing, binnenafwerking en vergunningen niet overal op dezelfde manier worden benoemd.",
      "Daarom combineren we een commerciële vergelijkingstool met een uitgebreid kenniscentrum. Het doel is dat bezoekers niet blind op de laagste prijs kiezen, maar beter voorbereid een specialist selecteren die past bij hun woning en plannen.",
    ],
    sections: [
      {
        id: "wat-we-doen",
        title: "Wat we doen",
        paragraphs: [
          "We publiceren uitlegpagina's over dakkapel kosten, materialen, vergunningen, plaatsing, onderhoud en offertevergelijking. Daarnaast bieden we bezoekers de mogelijkheid om vrijblijvend offertes aan te vragen bij dakkapel specialisten.",
          "Die combinatie is bewust gekozen. Een offerte is pas echt bruikbaar wanneer je als huiseigenaar snapt wat er wel en niet in de prijs zit en welke technische of vergunningstechnische keuzes jouw situatie beïnvloeden.",
        ],
        items: [
          "Prijsinformatie en richtbedragen samenvatten uit openbare Nederlandse bronnen.",
          "Complexe onderwerpen zoals vergunningen, materiaalkeuze en binnenafwerking praktisch uitleggen.",
          "Bezoekers helpen om offertes op inhoud te vergelijken in plaats van alleen op totaalprijs.",
        ],
      },
      {
        id: "informatiebronnen",
        title: "Waar onze informatie vandaan komt",
        paragraphs: [
          "De inhoud op DakkapellenKosten.nl wordt samengesteld als redactionele samenvatting van openbare marktinformatie van Nederlandse vergelijkingssites, leveranciers, dakkapelbedrijven en openbare vergunninguitleg van overheden en gemeenten.",
          "Voor prijsartikelen gebruiken we openbare prijsindicaties als vertrekpunt. Voor vergunningonderwerpen vatten we veelgenoemde voorwaarden samen, met de duidelijke kanttekening dat de uiteindelijke beoordeling altijd via het Omgevingsloket en de eigen gemeente loopt.",
        ],
        items: [
          "Openbare prijsvoorbeelden van Nederlandse aanbieders en vergelijkingplatforms.",
          "Officiële vergunninginformatie van overheid, Omgevingsloket en gemeenten.",
          "Veelgestelde vragen van huiseigenaren in de oriëntatie-, offerte- en uitvoeringsfase.",
        ],
      },
      {
        id: "wat-we-niet-doen",
        title: "Wat je niet van ons moet verwachten",
        paragraphs: [
          "We zijn geen aannemer, architect of vergunningverlener. De site is bedoeld als voorbereiding en keuzehulp, niet als vervanging van een technische opname, vergunningcheck of juridisch advies.",
          "Dat betekent ook dat prijsranges indicatief zijn. Een echte offerte blijft altijd afhankelijk van woningtype, dakconstructie, bereikbaarheid, afwerkingsniveau en de actuele marktsituatie van het moment waarop je aanvraagt.",
        ],
      },
    ],
    cta: {
      title: "Meer weten over onze redactie of werkwijze?",
      text: "Bekijk hoe artikelen worden samengesteld en hoe offerte-aanvragen op het platform worden ingezet.",
      primaryHref: "../redactie/",
      primaryLabel: "Naar redactie",
      secondaryHref: "../werkwijze/",
      secondaryLabel: "Bekijk werkwijze",
    },
  },
  {
    slug: "contact",
    title: "Contact",
    metaTitle: "Contact | DakkapellenKosten.nl",
    metaDescription:
      "Neem contact op met DakkapellenKosten.nl voor vragen over het platform, redactie, privacy of een lopende offerteaanvraag.",
    label: "Contact",
    schemaType: "ContactPage",
    description:
      "Contactinformatie voor vragen over DakkapellenKosten.nl, inhoudelijke correcties, privacyverzoeken en samenwerkingsvragen.",
    intro: [
      `Voor vragen over DakkapellenKosten.nl kun je contact opnemen via ${contactEmail}. Dat geldt voor redactionele opmerkingen, inhoudelijke correcties, vragen over een aanvraag of signalen over privacy en cookies.`,
      "Omdat het platform informatie en offertevergelijking combineert, is het handig om in je bericht kort te vermelden waar je vraag over gaat. Dan kunnen we sneller beoordelen of het een redactionele vraag, platformvraag of privacyvraag is.",
    ],
    sections: [
      {
        id: "contactmogelijkheden",
        title: "Zo neem je contact op",
        paragraphs: [
          `Het centrale contactadres is ${contactEmail}. Voor de meeste vragen is e-mail de snelste route, omdat we berichten dan direct kunnen doorzetten naar de juiste verantwoordelijke.`,
          "Gebruik in je onderwerpregel bij voorkeur een duidelijke categorie, bijvoorbeeld redactie, privacy, offerteaanvraag of samenwerking. Dat verkort de afhandeling.",
        ],
        items: [
          `Algemeen contact: ${contactEmail}`,
          "Redactionele correcties of aanvullingen: vermeld altijd de pagina of URL.",
          "Privacy- of gegevensvragen: vermeld zoveel mogelijk waar je aanvraag of contactmoment betrekking op heeft.",
        ],
      },
      {
        id: "waarvoor-contact",
        title: "Waarvoor kun je contact opnemen?",
        paragraphs: [
          "We ontvangen vooral vragen over inhoudelijke onduidelijkheden, correctieverzoeken, de werking van het offerteproces en privacygerelateerde verzoeken. Ook signalen over verouderde informatie of onjuiste links zijn welkom.",
          "Als je een vraag hebt over een concrete bouwaanvraag, vergunninguitkomst of technische opname van je woning, dan blijft een specialist, adviseur of gemeente de juiste partij voor de definitieve beoordeling.",
        ],
      },
      {
        id: "reactie-en-opvolging",
        title: "Reactie en opvolging",
        paragraphs: [
          "We proberen berichten zo snel mogelijk te beoordelen. Inhoudelijke correcties en privacymeldingen krijgen daarbij voorrang, omdat die direct invloed hebben op de kwaliteit en betrouwbaarheid van de site.",
          "Wanneer je bericht betrekking heeft op een offerteaanvraag of specialist, kan aanvullende informatie nodig zijn om te achterhalen welke aanvraag of welk contactmoment het betreft.",
        ],
      },
    ],
    cta: {
      title: "Snel verder met je voorbereiding?",
      text: "Gebruik het kenniscentrum om prijzen, vergunningen en materialen eerst goed te begrijpen voordat je offertes aanvraagt.",
      primaryHref: "../kenniscentrum/",
      primaryLabel: "Naar kenniscentrum",
      secondaryHref: "../index.html#offerte",
      secondaryLabel: "Offertes vergelijken",
    },
  },
  {
    slug: "redactie",
    title: "Redactie",
    metaTitle: "Redactie | Hoe DakkapellenKosten.nl artikelen samenstelt en bijwerkt",
    metaDescription:
      "Lees hoe de redactie van DakkapellenKosten.nl artikelen opstelt, bronnen gebruikt, actualiseert en corrigeert.",
    label: "Redactie",
    schemaType: "WebPage",
    description:
      "Uitleg over de redactionele uitgangspunten van DakkapellenKosten.nl, inclusief brongebruik, actualisatie en correcties.",
    intro: [
      "Het kenniscentrum van DakkapellenKosten.nl is bedoeld als praktische voorbereiding op een offerte of vergunningsvraag. Daarom is de redactionele aanpak gericht op helderheid, vergelijkbaarheid en het benoemen van onzekerheden die voor huiseigenaren relevant zijn.",
      "We schrijven artikelen niet als verkooppraatje per leverancier, maar als samenvatting van veelgenoemde marktinformatie en openbare regels. Daardoor sluiten de pagina's beter aan op de vragen die bezoekers echt hebben in de oriëntatie- en aanvraagfase.",
    ],
    sections: [
      {
        id: "redactionele-principes",
        title: "Redactionele uitgangspunten",
        paragraphs: [
          "We proberen informatie zo te formuleren dat een huiseigenaar snel begrijpt welke keuze of welk risico het belangrijkst is. Dat betekent: niet alleen zeggen dat iets 'mogelijk' is, maar uitleggen wanneer een keuze logisch is en wanneer juist niet.",
          "Bij onderwerpen met veel variatie, zoals prijzen en vergunningen, vermijden we absolute claims. We werken liever met bandbreedtes, randvoorwaarden en vervolgstappen die bezoekers helpen om hun eigen situatie beter te beoordelen.",
        ],
        items: [
          "Eerst de kernvraag beantwoorden, daarna pas verdiepen.",
          "Prijsranges altijd koppelen aan factoren, afwerking en beperkingen.",
          "Vergunningsuitleg altijd combineren met de waarschuwing dat de officiële check leidend blijft.",
        ],
      },
      {
        id: "brongebruik",
        title: "Brongebruik",
        paragraphs: [
          "Voor commerciële onderwerpen zoals kosten, materialen en plaatsing gebruiken we openbare Nederlandse marktinformatie als basis. Voor regelgeving en vergunningen gebruiken we openbare uitleg van overheid, Omgevingsloket en gemeenten.",
          "Wanneer bronnen verschillende prijsniveaus of nuances laten zien, kiezen we niet blind één bedrag. In plaats daarvan verwerken we de variatie in een bredere indicatie, zodat het artikel niet schijnnauwkeurig wordt.",
        ],
      },
      {
        id: "actualiseren-en-corrigeren",
        title: "Bijwerken en corrigeren",
        paragraphs: [
          `Artikelen krijgen een bijgewerkte datum zodat bezoekers kunnen zien wanneer de inhoud voor het laatst is herzien. Bij prijs- en vergunningonderwerpen kijken we extra kritisch naar veroudering, omdat dit de onderwerpen zijn die het snelst veranderen of lokaal kunnen afwijken.`,
          "Meld je een fout of verouderde passage, dan beoordelen we of aanpassing nodig is. Correcties die direct raken aan feitelijke duidelijkheid, vergunninginterpretatie of platforminformatie hebben prioriteit.",
        ],
      },
    ],
    cta: {
      title: "Een inhoudelijke fout gezien?",
      text: "Meld de pagina en de passage die volgens jou onjuist of verouderd is, zodat de redactie dit kan beoordelen.",
      primaryHref: "../contact/",
      primaryLabel: "Contact opnemen",
      secondaryHref: "../werkwijze/",
      secondaryLabel: "Bekijk werkwijze",
    },
  },
  {
    slug: "werkwijze",
    title: "Werkwijze",
    metaTitle: "Werkwijze | Hoe DakkapellenKosten.nl werkt voor artikelen en offerteaanvragen",
    metaDescription:
      "Lees hoe DakkapellenKosten.nl werkt, hoe bezoekers het kenniscentrum gebruiken en hoe een offerteaanvraag via het platform verloopt.",
    label: "Werkwijze",
    schemaType: "WebPage",
    description:
      "Praktische uitleg over hoe het platform werkt, hoe bezoekers kenniscentrum en offertevergelijking combineren en waar de grenzen van de service liggen.",
    intro: [
      "DakkapellenKosten.nl werkt volgens een eenvoudige gedachte: eerst begrijpen, dan vergelijken. Daarom bestaat het platform uit twee delen die elkaar versterken: een kenniscentrum met uitleg over dakkapel onderwerpen en een aanvraagroute voor vrijblijvende offertes.",
      "Voor veel bezoekers is die volgorde belangrijk. Wie alleen een formulier invult zonder kennis van materialen, vergunningen of afwerkingsniveau, loopt een grotere kans om onvolledige of slecht vergelijkbare offertes te ontvangen.",
    ],
    sections: [
      {
        id: "hoe-het-platform-werkt",
        title: "Hoe het platform werkt",
        paragraphs: [
          "Bezoekers kunnen zich eerst oriënteren via het kenniscentrum en daarna een aanvraag indienen voor offertes. De aanvraag bevat basisinformatie zoals type dakkapel, globale breedte en contactgegevens, zodat specialisten sneller kunnen inschatten of de aanvraag past.",
          "Het doel van het platform is niet om één vaste oplossing te pushen, maar om de voorbereiding en vergelijking logischer te maken. Daarom leggen we op veel pagina's uit hoe prijs, materiaal en plaatsing in de offerte terugkomen.",
        ],
        items: [
          "Oriënteren op kosten, vergunningen, materialen en plaatsing.",
          "Een aanvraag doen met basisgegevens over de gewenste dakkapel.",
          "Offertes vergelijken op inhoud, planning, materiaal en afwerking.",
        ],
      },
      {
        id: "hoe-je-de-site-het-best-gebruikt",
        title: "Hoe je de site het best gebruikt",
        paragraphs: [
          "De sterkste route is meestal om eerst de kernpagina over dakkapel kosten of vergunningen te lezen en pas daarna de meer specifieke artikelen open te klikken. Zo begrijp je sneller welke onderwerpen voor jouw woning echt bepalend zijn.",
          "Zodra je offertes ontvangt, gebruik je de site opnieuw, maar dan anders: vooral om te controleren of montage, binnenafwerking, materiaalkeuze en planning op dezelfde manier zijn uitgewerkt.",
        ],
      },
      {
        id: "grenzen-van-de-service",
        title: "Waar de service ophoudt",
        paragraphs: [
          "Het platform vervangt geen technische opname, vergunningcheck, constructieberekening of juridisch advies. Die onderdelen blijven afhankelijk van jouw woning en van de partijen die de uitvoering of beoordeling doen.",
          "Ook een vrijblijvende vergelijking geeft geen garantie dat elk project altijd binnen dezelfde termijn of met hetzelfde aantal specialisten kan worden opgepakt. Beschikbaarheid en projectgeschiktheid blijven daarbij meespelen.",
        ],
      },
    ],
    cta: {
      title: "Klaar om gericht te vergelijken?",
      text: "Gebruik eerst de belangrijkste gidsen en vraag daarna vrijblijvend offertes aan met een beter beeld van je situatie.",
      primaryHref: "../kenniscentrum/wat-kost-een-dakkapel/",
      primaryLabel: "Start met kostengids",
      secondaryHref: "../index.html#offerte",
      secondaryLabel: "Vergelijk offertes",
    },
  },
  {
    slug: "privacybeleid",
    title: "Privacybeleid",
    metaTitle: "Privacybeleid | DakkapellenKosten.nl",
    metaDescription:
      "Lees in hoofdlijnen welke persoonsgegevens DakkapellenKosten.nl verwerkt, waarom dat gebeurt en hoe je contact opneemt over privacyvragen.",
    label: "Privacybeleid",
    schemaType: "WebPage",
    description:
      "Privacybeleid in hoofdlijnen voor DakkapellenKosten.nl, gericht op bezoekers, offerteaanvragen en contactverzoeken.",
    intro: [
      "Op DakkapellenKosten.nl verwerken we gegevens die nodig zijn om het platform te laten werken, om contactverzoeken te behandelen en om offerteaanvragen mogelijk te maken. Daarbij gaat het vooral om gegevens die bezoekers zelf invullen, zoals naam, e-mailadres, telefoonnummer, postcode en projectinformatie.",
      "Dit privacybeleid is geschreven als heldere uitleg in hoofdlijnen, zodat bezoekers snel begrijpen welke soorten gegevens relevant zijn en waarom die worden gebruikt. Voor concrete privacyvragen of verzoeken blijft direct contact het beste vertrekpunt.",
    ],
    sections: [
      {
        id: "welke-gegevens",
        title: "Welke gegevens het platform kan verwerken",
        paragraphs: [
          "Bij een offerteaanvraag of contactmoment kunnen persoonsgegevens en projectgegevens worden verwerkt. Denk aan contactgegevens, globale informatie over de gewenste dakkapel en technische of praktische context die nodig is om een aanvraag te beoordelen.",
          "Daarnaast kunnen technische gegevens worden verwerkt die nodig zijn voor de werking, beveiliging of analyse van de website, voor zover dat binnen de gekozen instellingen en wettelijke kaders gebeurt.",
        ],
      },
      {
        id: "waarom-deze-gegevens",
        title: "Waarom deze gegevens worden gebruikt",
        paragraphs: [
          "Gegevens worden gebruikt om aanvragen te verwerken, contact op te nemen, de kwaliteit van het platform te verbeteren en misbruik of technische problemen te beperken. Zonder een deel van die gegevens is een offerteaanvraag praktisch niet bruikbaar.",
          "We proberen alleen gegevens te gebruiken voor doelen die logisch aansluiten op het gebruik van de site. Wanneer je privacyrechten wilt uitoefenen of uitleg wilt over een specifiek contactmoment, kun je dat rechtstreeks melden.",
        ],
      },
      {
        id: "vragen-en-rechten",
        title: "Privacyvragen en rechten",
        paragraphs: [
          `Voor vragen over privacy, inzage, correctie of verwijdering kun je contact opnemen via ${contactEmail}. Vermeld daarbij zo concreet mogelijk om welk formulier, contactmoment of e-mailadres het gaat.`,
          "Bij privacyverzoeken kijken we eerst welke gegevens of systemen op de vraag betrekking hebben, zodat een verzoek zorgvuldig kan worden opgevolgd.",
        ],
      },
    ],
    cta: {
      title: "Een privacyvraag of verzoek?",
      text: "Neem contact op met zoveel mogelijk context over je aanvraag of contactmoment, zodat de vraag snel beoordeeld kan worden.",
      primaryHref: "../contact/",
      primaryLabel: "Naar contact",
    },
  },
  {
    slug: "cookiebeleid",
    title: "Cookiebeleid",
    metaTitle: "Cookiebeleid | DakkapellenKosten.nl",
    metaDescription:
      "Lees hoe DakkapellenKosten.nl cookies en vergelijkbare technieken inzet voor werking, beveiliging en analyse van de website.",
    label: "Cookiebeleid",
    schemaType: "WebPage",
    description:
      "Cookiebeleid in hoofdlijnen voor het gebruik van functionele, analytische en mogelijke aanvullende cookies op DakkapellenKosten.nl.",
    intro: [
      "DakkapellenKosten.nl kan cookies of vergelijkbare technieken gebruiken om de site goed te laten werken, om formulieren bruikbaar te houden en om inzicht te krijgen in het gebruik van pagina's. Het precieze gebruik hangt af van de technische inrichting van het platform op dat moment.",
      "Deze pagina beschrijft in hoofdlijnen welke soorten cookies relevant kunnen zijn, waarom ze worden gebruikt en wat bezoekers kunnen doen als ze vragen hebben over het cookiegebruik op de site.",
    ],
    sections: [
      {
        id: "soorten-cookies",
        title: "Soorten cookies die relevant kunnen zijn",
        paragraphs: [
          "Functionele cookies helpen bij basisfuncties van de site, zoals formulieren, navigatie of beveiliging. Analytische cookies kunnen worden gebruikt om te begrijpen welke pagina's goed worden gebruikt en waar bezoekers afhaken.",
          "Als aanvullende cookies of scripts worden ingezet voor bijvoorbeeld marketing, meting of derde partijen, dan hoort dat op een manier te gebeuren die past bij de gekozen instellingen en geldende regels.",
        ],
      },
      {
        id: "waarom-cookies",
        title: "Waarom cookies worden gebruikt",
        paragraphs: [
          "Cookies ondersteunen de technische werking van de website en kunnen helpen om prestaties, foutmeldingen en gebruikspatronen te begrijpen. Dat is relevant voor een site die zowel informatiepagina's als een aanvraagformulier bevat.",
          "Het doel is niet om bezoekers te overladen met tracking, maar om een bruikbare en betrouwbare website te onderhouden.",
        ],
      },
      {
        id: "vragen-over-cookies",
        title: "Vragen over cookies",
        paragraphs: [
          `Heb je een vraag over cookiegebruik of over de manier waarop gegevens via de site worden verwerkt, neem dan contact op via ${contactEmail}.`,
          "Bij vragen over cookies is het handig om je browser, apparaat en de pagina waarop je vraag betrekking heeft te vermelden.",
        ],
      },
    ],
    cta: {
      title: "Meer weten over gegevens of contact?",
      text: "Bekijk ook het privacybeleid of neem rechtstreeks contact op als je een concreet verzoek hebt.",
      primaryHref: "../privacybeleid/",
      primaryLabel: "Bekijk privacybeleid",
      secondaryHref: "../contact/",
      secondaryLabel: "Contact opnemen",
    },
  },
  {
    slug: "algemene-voorwaarden",
    title: "Algemene voorwaarden",
    metaTitle: "Algemene voorwaarden | DakkapellenKosten.nl",
    metaDescription:
      "Lees de hoofdlijnen van de algemene voorwaarden van DakkapellenKosten.nl voor gebruik van de website, informatie en offerteaanvragen.",
    label: "Algemene voorwaarden",
    schemaType: "WebPage",
    description:
      "Algemene voorwaarden in hoofdlijnen voor het gebruik van DakkapellenKosten.nl, inclusief informatiegebruik, offerteaanvragen en aansprakelijkheid.",
    intro: [
      "De inhoud van DakkapellenKosten.nl is bedoeld als algemene informatie en voorbereiding op het vergelijken van dakkapel offertes. Gebruik van de website betekent niet dat er automatisch een overeenkomst met een uitvoerende partij of adviesrelatie tot stand komt.",
      "Deze pagina beschrijft de hoofdlijnen van de voorwaarden die passen bij een platform dat informatie en offertevergelijking combineert. Voor inhoudelijke vragen of onduidelijkheden is contact altijd mogelijk.",
    ],
    sections: [
      {
        id: "gebruik-van-de-website",
        title: "Gebruik van de website",
        paragraphs: [
          "Bezoekers mogen de informatie op de website gebruiken als algemene oriëntatie. De inhoud is niet bedoeld als vervanging van technisch, financieel, juridisch of vergunningstechnisch maatwerkadvies.",
          "Wie een offerteaanvraag doet, blijft zelf verantwoordelijk voor het controleren van de juistheid van de ingevoerde gegevens, de vergunningstatus en de geschiktheid van de gekozen specialist voor de eigen woning.",
        ],
      },
      {
        id: "offerteaanvragen-en-specialisten",
        title: "Offerteaanvragen en specialisten",
        paragraphs: [
          "Een aanvraag via het platform is bedoeld om contact met passende specialisten mogelijk te maken. Het platform garandeert niet dat voor iedere aanvraag altijd hetzelfde aantal reacties, dezelfde prijsniveaus of dezelfde doorlooptijden beschikbaar zijn.",
          "Offertes, garanties, uitvoering en contractvoorwaarden van specialisten blijven de verantwoordelijkheid van de betreffende partijen en van de afspraken die je rechtstreeks met hen maakt.",
        ],
      },
      {
        id: "aansprakelijkheid-en-contact",
        title: "Aansprakelijkheid en contact",
        paragraphs: [
          "We doen ons best om de informatie actueel en bruikbaar te houden, maar kunnen niet garanderen dat elke prijsindicatie, vergunningsituatie of marktomstandigheid altijd voor iedere woning exact van toepassing is.",
          `Zie je een fout, onduidelijkheid of heb je een vraag over het gebruik van de site, neem dan contact op via ${contactEmail}.`,
        ],
      },
    ],
    cta: {
      title: "Twijfel je over informatie of gebruik van het platform?",
      text: "Neem contact op of bekijk eerst de pagina's over redactie en werkwijze voor meer context.",
      primaryHref: "../contact/",
      primaryLabel: "Naar contact",
      secondaryHref: "../redactie/",
      secondaryLabel: "Bekijk redactie",
    },
  },
];

const priceNote =
  "De prijsranges op deze pagina zijn een onafhankelijke samenvatting van openbare prijsindicaties van Nederlandse vergelijkingssites, leveranciers en dakkapelbedrijven. Gebruik ze als indicatie en laat actuele offertes altijd op jouw woning afstemmen.";

const permitNote =
  "De vergunningsuitleg op deze pagina vat veelgenoemde voorwaarden uit openbare bronnen samen. Controleer je situatie altijd via de Vergunningcheck in het Omgevingsloket en het omgevingsplan van je gemeente.";

const articleIndex = {};
const articles = [];
const trustPageIndex = Object.fromEntries(trustPages.map((page) => [page.slug, page]));

function addArticle(article) {
  articles.push(article);
  articleIndex[article.slug] = article;
}

function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId,
    name: "DakkapellenKosten.nl",
    url: `${siteUrl}/`,
    logo: `${siteUrl}/assets/og-dakkapellenkosten.svg`,
    email: contactEmail,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: contactEmail,
        availableLanguage: ["Dutch"],
        areaServed: "NL",
      },
    ],
  };
}

function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    url: `${siteUrl}/`,
    name: "DakkapellenKosten.nl",
    inLanguage: "nl-NL",
    publisher: {
      "@id": organizationId,
    },
  };
}

function humanizeSlug(slug) {
  return slug
    .split("-")
    .map((part, index) => (index === 0 ? part.charAt(0).toUpperCase() + part.slice(1) : part))
    .join(" ");
}

function articleTitleFor(slug) {
  return articleIndex[slug]?.title || humanizeSlug(slug);
}

function articleLink(slug, text) {
  return `<a href="../${slug}/">${text || articleTitleFor(slug)}</a>`;
}

function trustPageLink(slug, text, prefix = "../") {
  const page = trustPageIndex[slug];
  return `<a href="${prefix}${page.slug}/">${text || page.title}</a>`;
}

function categoryLink(slug, text) {
  const category = categories[slug];
  return `<a href="../${category.slug}/">${text || category.name}</a>`;
}

function trustPageUrl(page) {
  return `${siteUrl}/${page.slug}/`;
}

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildFaqSchema(faq) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a.replace(/<[^>]+>/g, ""),
      },
    })),
  };
}

function editorialNoteFor(categorySlug, level) {
  const prefix = "../".repeat(level);
  const categoryNote =
    categorySlug === "vergunning"
      ? "Voor vergunningonderwerpen blijft de officiële check via het Omgevingsloket en je eigen gemeente altijd leidend."
      : "Gebruik prijs- en productinformatie altijd als indicatie en laat offertes en technische details op jouw woning afstemmen.";

  return `<div class="editorial-note">
              <strong>Redactionele noot:</strong> Dit artikel is bijgewerkt op ${updatedHuman} door de redactie van DakkapellenKosten.nl en geschreven als praktische samenvatting van openbare marktinformatie, leveranciersinformatie en vergunninguitleg. ${categoryNote} Lees meer over onze <a href="${prefix}redactie/">redactie</a> en <a href="${prefix}werkwijze/">werkwijze</a>.
            </div>`;
}

function renderExtraSection(section) {
  const items = !section.items?.length
    ? ""
    : section.ordered
      ? `            <ol>
${section.items.map((item) => `              <li>${item}</li>`).join("\n")}
            </ol>`
      : `            <ul>
${section.items.map((item) => `              <li>${item}</li>`).join("\n")}
            </ul>`;

  const callout = !section.callout
    ? ""
    : `            <div class="article-cta">
              <h3>${section.callout.title}</h3>
              <p>${section.callout.text}</p>
            </div>`;

  return `            <h2 id="${section.id}">${section.title}</h2>
${section.paragraphs.map((paragraph) => `            <p>${paragraph}</p>`).join("\n")}
${items}
${callout}`;
}

function commonArticle({
  slug,
  title,
  metaTitle,
  metaDescription,
  category,
  readTime,
  intro,
  quickTitle,
  quickAnswer,
  note,
  tableTitle,
  tableIntro,
  tableHeaders,
  tableRows,
  factorsTitle,
  factorsIntro,
  factors,
  examplesTitle,
  examples,
  tipsTitle,
  tips,
  faq,
  related,
  extraSections,
}) {
  addArticle({
    slug,
    title,
    metaTitle,
    metaDescription,
    category,
    readTime,
    intro,
    quickTitle,
    quickAnswer,
    note,
    tableTitle,
    tableIntro,
    tableHeaders,
    tableRows,
    factorsTitle,
    factorsIntro,
    factors,
    examplesTitle,
    examples,
    tipsTitle,
    tips,
    faq,
    related,
    extraSections: extraSections || [],
  });
}

function buildCostPillar() {
  commonArticle({
    slug: "wat-kost-een-dakkapel",
    title: "Wat kost een dakkapel? Complete gids",
    metaTitle: "Wat kost een dakkapel in 2026? Complete gids met prijzen en voorbeelden",
    metaDescription:
      "Wat kost een dakkapel in 2026? Bekijk indicatieve prijzen per type, meter, materiaal, montage en binnenafwerking in deze complete gids.",
    category: "kosten",
    readTime: 11,
    intro: [
      `De vraag wat een dakkapel kost, lijkt simpel, maar in de praktijk lopen offertes sterk uiteen. Voor een compacte prefab uitvoering aan de achterzijde kom je vaak lager uit dan voor een brede traditionele dakkapel met binnenafwerking, extra isolatie en lastige bereikbaarheid. Daarom is het slim om niet alleen naar een totaalbedrag te kijken, maar vooral naar de onderdelen waaruit een offerte is opgebouwd.`,
      `In deze gids lees je hoe Nederlandse aanbieders en vergelijkingssites de prijs meestal uitsplitsen, welke bedragen vaak worden genoemd en welke keuzes de offerte het meest beïnvloeden. Wil je daarna verder inzoomen, bekijk dan ook ${articleLink("prefab-dakkapel-kosten", "prefab dakkapel kosten")}, ${articleLink("dakkapel-kosten-per-meter", "dakkapel kosten per meter")} en ${articleLink("dakkapel-kosten-inclusief-binnenafwerking", "kosten inclusief binnenafwerking")}.`,
    ],
    quickTitle: "Kort antwoord",
    quickAnswer: [
      "Voor veel standaard situaties ligt een dakkapel in 2026 grofweg tussen ongeveer €5.500 en €12.000. Aan de onderkant van die bandbreedte zit meestal een compacte prefab oplossing; aan de bovenkant kom je uit bij maatwerk, grotere breedtes, luxere materialen of extra binnenafwerking.",
      "Een offerte is pas goed vergelijkbaar als duidelijk is of montage, hijswerk, afvoer van afval, vergunning, constructeur en binnenafwerking wel of niet zijn inbegrepen. Dat verklaart waarom twee offertes voor ogenschijnlijk dezelfde dakkapel toch flink kunnen verschillen.",
    ],
    note: priceNote,
    tableTitle: "Indicatieve prijsopbouw",
    tableIntro: [
      "Onderstaande tabel is een praktische samenvatting van de prijsniveaus die je op Nederlandse dakkapelsites en offertediensten vaak terugziet.",
    ],
    tableHeaders: ["Uitvoering", "Indicatieve prijs", "Praktische toelichting"],
    tableRows: [
      ["Prefab dakkapel", "€4.500 - €8.500", "Snel te plaatsen en vaak de scherpste prijs bij standaardmaten"],
      ["Traditionele dakkapel", "€7.000 - €15.000+", "Meer maatwerk, meer arbeid op locatie en meestal hogere afwerkingseisen"],
      ["3 meter breed", "€5.500 - €10.500", "Veelgekozen middenmaat voor slaapkamer of werkkamer"],
      ["5 meter breed", "€11.000 - €18.000+", "Vraagt vaak zwaardere constructie en hogere afwerkingskosten"],
      ["Binnenafwerking extra", "€1.000 - €3.500", "Afhankelijk van stucwerk, aftimmering, elektra en vensterbanken"],
    ],
    factorsTitle: "Welke factoren bepalen de prijs het meest?",
    factorsIntro: [
      `De grootste prijsverschillen ontstaan zelden door één keuze. Meestal is het een combinatie van breedte, bouwmethode, materiaal en afwerking. Wie deze posten begrijpt, vergelijkt offertes veel slimmer en voorkomt dat een lage instapprijs later alsnog oploopt. Twijfel je tussen bouwmethodes, lees dan ook ${articleLink("prefab-of-traditionele-dakkapel", "prefab vs traditionele dakkapel")}.`,
    ],
    factors: [
      "Breedte en indeling: meer meters betekenen meer materiaal, zwaardere constructie en vaak meer kozijnwerk.",
      "Prefab of traditioneel: prefab is meestal sneller en goedkoper, traditioneel flexibeler maar arbeidsintensiever.",
      "Materiaalkeuze: kunststof is vaak het basismateriaal, hout en polyester geven vaak een meerprijs.",
      "Bereikbaarheid van het dak: kraan, steiger of lastige plaatsing beïnvloeden de montagepost flink.",
      "Binnenafwerking en extra opties: rolluiken, horren, elektra, stucwerk en schilderwerk duwen de offerte omhoog.",
      "Vergunning en constructieve aanpassingen: vooral aan de voorzijde, bij monumenten of brede kapellen kunnen extra kosten ontstaan.",
    ],
    examplesTitle: "Voorbeelden uit de praktijk",
    examples: [
      {
        title: "Voorbeeld 1: compacte prefab aan de achterzijde",
        text: "Een standaard dakkapel van ongeveer 2 tot 3 meter aan de achterzijde van een rijwoning blijft vaak in het laagste prijssegment. Dit is de situatie waarin prefab meestal het meeste voordeel oplevert: weinig bouwtijd, weinig maatwerk en vaak beperkte overlast.",
      },
      {
        title: "Voorbeeld 2: traditionele dakkapel met houten uitstraling",
        text: "Zodra de wens verschuift naar een meer klassieke uitstraling met houten onderdelen, bijzondere kozijnindeling of specifieke afwerking, stijgt de prijs meestal duidelijk. De montage duurt langer en de offerte bevat vaker extra posten voor detaillering en schilderwerk.",
      },
      {
        title: "Voorbeeld 3: brede kapel met binnenafwerking",
        text: `Bij een bredere dakkapel van 4 tot 5 meter wordt het verschil vaak niet alleen door de buitenzijde gemaakt, maar vooral door de afwerking binnen. Kijk daarom altijd of de offerte inclusief ${articleLink("binnenafwerking-dakkapel-uitleg", "binnenafwerking")}, vensterbanken en elektra wordt aangeboden.`,
      },
    ],
    tipsTitle: "Tips voor huiseigenaren",
    tips: [
      "Vergelijk offertes altijd op identieke uitgangspunten: zelfde breedte, materiaal, beglazing en afwerkingsniveau.",
      "Vraag expliciet na of montage, kraan, steiger, afvoer en afvalverwerking zijn inbegrepen.",
      `Controleer vroeg in het traject de ${articleLink("vergunning-dakkapel-regels", "vergunningregels")}; een vergunningsplichtige situatie maakt de totale investering vaak hoger.`,
      `Gebruik prijsindicaties vooral om richting te bepalen en niet als eindbedrag. Voor echte vergelijking blijft ${articleLink("offerte-dakkapel-vergelijken", "offertes vergelijken")} de belangrijkste stap.`,
    ],
    extraSections: [
      {
        id: "kosten-per-keuze",
        title: "Hoe bouwmethode, materiaal en breedte elkaar beïnvloeden",
        paragraphs: [
          `De meeste huiseigenaren zoeken eerst op een totaalbedrag, maar in de praktijk wordt de offerte vooral gevormd door drie keuzes tegelijk: bouwmethode, materiaal en breedte. Een ${articleLink("prefab-dakkapel-kosten", "prefab dakkapel")} is bijvoorbeeld vaak gunstig geprijsd zolang de maat redelijk standaard blijft, terwijl een ${articleLink("traditionele-dakkapel-kosten", "traditionele dakkapel")} sneller oploopt zodra maatwerk, bijzondere kozijnindeling of langere bouwtijd nodig zijn.`,
          `Daarbovenop komt de materiaalkeuze. ${articleLink("kunststof-dakkapel-kosten", "Kunststof")} wordt vaak gekozen voor een gunstige prijs-kwaliteitverhouding en laag onderhoud. ${articleLink("houten-dakkapel-kosten", "Hout")} en ${articleLink("polyester-dakkapel-kosten", "polyester")} schuiven de totaalsom meestal op, maar kunnen aantrekkelijker zijn vanuit uitstraling of levensduur. Breedte is daarna de derde grote prijsbepaler: zie daarom ook ${articleLink("dakkapel-kosten-3-meter", "3 meter")}, ${articleLink("dakkapel-kosten-4-meter", "4 meter")} en ${articleLink("dakkapel-kosten-5-meter", "5 meter")}.`,
        ],
      },
      {
        id: "wat-zit-er-in-de-offerte",
        title: "Wat wel en niet standaard in een offerte zit",
        paragraphs: [
          "Een van de grootste fouten bij prijsvergelijking is aannemen dat elke dakkapelofferte dezelfde inhoud heeft. In werkelijkheid verschilt het sterk of zaken als kraankosten, afvalafvoer, steigermateriaal, dakaanpassingen, binnenaftimmering en schilderwerk zijn meegenomen.",
          `Dat is precies waarom twee offertes met hetzelfde formaat en ogenschijnlijk hetzelfde materiaal toch duizenden euro's uit elkaar kunnen liggen. Gebruik daarom naast deze gids ook ${articleLink("checklist-dakkapel-offerte", "de offertechecklist")} en ${articleLink("dakkapel-kosten-inclusief-montage", "de pagina over montage")}.`,
        ],
        items: [
          "Controleer altijd of montage, hijswerk en afvoer expliciet zijn benoemd.",
          "Vraag of binnenafwerking, vensterbanken en elektra zijn inbegrepen of optioneel zijn.",
          "Let op vergunning- en constructieposten bij bredere of zichtbare dakkapellen.",
          "Laat onduidelijke offertes herschrijven voordat je ze echt vergelijkt.",
        ],
      },
      {
        id: "zo-vergelijk-je-slim",
        title: "Zo vergelijk je dakkapel kosten zonder appels met peren",
        paragraphs: [
          "De slimste vergelijking begint niet bij de laagste prijs, maar bij het gelijk maken van de uitgangspunten. Kies eerst een breedte, een gewenste bouwmethode en een materiaalrichting. Vraag daarna aan elke partij dezelfde combinatie uit te werken, zodat de verschillen zichtbaar worden in planning, kwaliteit, garantie en afwerkingsniveau in plaats van in verborgen ontbrekende posten.",
          `Wie dat serieus aanpakt, leest meestal ook ${articleLink("offerte-dakkapel-vergelijken", "offertes vergelijken")}, ${articleLink("prefab-of-traditionele-dakkapel", "prefab of traditioneel")} en ${articleLink("binnenafwerking-dakkapel-uitleg", "binnenafwerking")} voordat er een definitieve keuze wordt gemaakt.`,
        ],
      },
      {
        id: "wanneer-goedkoop-duur-wordt",
        title: "Wanneer een goedkope dakkapel uiteindelijk toch duur uitpakt",
        paragraphs: [
          "De laagste offerte is niet automatisch de voordeligste keuze. Een prijs die in eerste instantie scherp lijkt, kan later oplopen als binnenafwerking, kraankosten, constructieve aanpassingen of vergunningondersteuning alsnog als meerwerk worden toegevoegd. Dat gebeurt vooral wanneer de eerste offerte nog heel globaal is opgesteld.",
          "Ook op langere termijn kan goedkoop duur worden. Een materiaalkeuze die weinig onderhoudsarm blijkt, of een offerte zonder duidelijke garantie op aansluitingen en afwerking, kan na plaatsing leiden tot extra onderhoud of herstel. Daarom hoort prijsvergelijking altijd samen te gaan met een beoordeling van kwaliteit, opleverniveau en nazorg.",
        ],
      },
    ],
    faq: [
      {
        q: "Wat kost een standaard dakkapel gemiddeld?",
        a: "Voor veel standaard situaties ligt een dakkapel grofweg tussen ongeveer 5.500 en 12.000 euro, afhankelijk van breedte, bouwmethode en afwerking.",
      },
      {
        q: "Is prefab altijd goedkoper dan traditioneel?",
        a: "Bij standaardmaten en een goed bereikbaar dak wel meestal. Traditioneel wordt vooral duurder doordat er meer arbeid en maatwerk op locatie nodig is.",
      },
      {
        q: "Zit binnenafwerking standaard in de prijs?",
        a: "Nee, dat verschilt sterk per aanbieder. Controleer altijd of aftimmering, stucwerk, schilderwerk en elektra zijn inbegrepen.",
      },
    ],
    related: [
      "prefab-dakkapel-kosten",
      "dakkapel-kosten-per-meter",
      "vergunning-dakkapel-regels",
      "offerte-dakkapel-vergelijken",
    ],
  });
}

function buildCostGuide(config) {
  commonArticle({
    slug: config.slug,
    title: config.title,
    metaTitle: config.metaTitle,
    metaDescription: config.metaDescription,
    category: "kosten",
    readTime: config.readTime || 7,
    intro: [
      `${config.title} is vooral interessant voor huiseigenaren die een offerte beter willen kunnen plaatsen. De bedragen die je online ziet, zijn namelijk bijna nooit een vaste prijs, maar een bandbreedte die afhankelijk is van maat, materiaal, bereikbaarheid en de vraag of montage en afwerking zijn meegenomen.`,
      `${config.intro} Zie deze pagina daarom als een praktische samenvatting van veelgenoemde marktprijzen. Wil je breder vergelijken, lees dan ook ${articleLink("wat-kost-een-dakkapel", "de complete gids over dakkapel kosten")} en ${articleLink("offerte-dakkapel-vergelijken", "hoe je offertes vergelijkt")}.`,
    ],
    quickTitle: "Kort antwoord",
    quickAnswer: [
      config.quickAnswer,
      "Voor deze pagina geldt hetzelfde uitgangspunt als bij alle kostenartikelen: vergelijk prijzen alleen als de uitgangspunten hetzelfde zijn. Verschillen in breedte, beglazing, afwerking en vergunningen maken een lage prijs anders snel misleidend.",
    ],
    note: priceNote,
    tableTitle: config.tableTitle || "Indicatieve richtprijzen",
    tableIntro: [
      config.tableIntro ||
        "De tabel hieronder laat zien hoe aanbieders deze uitvoering of prijspost vaak uitsplitsen in de praktijk.",
    ],
    tableHeaders: config.tableHeaders || ["Onderdeel", "Indicatie", "Toelichting"],
    tableRows: config.tableRows,
    factorsTitle: "Factoren die het bedrag beïnvloeden",
    factorsIntro: [
      `Ook binnen deze ene uitvoering lopen de verschillen snel op. De belangrijkste prijsbepalers zijn meestal goed zichtbaar in de offerte, maar worden niet altijd even duidelijk benoemd. Daarom is het slim om naast deze pagina ook ${articleLink("checklist-dakkapel-offerte", "de offertechecklist")} te gebruiken.`,
    ],
    factors: config.factors,
    examplesTitle: "Voorbeelden en scenario's",
    examples: config.examples,
    tipsTitle: "Tips voor huiseigenaren",
    tips: config.tips,
    faq: config.faq,
    related: config.related,
    extraSections: config.extraSections,
  });
}

function buildPermitGuide(config) {
  commonArticle({
    slug: config.slug,
    title: config.title,
    metaTitle: config.metaTitle,
    metaDescription: config.metaDescription,
    category: "vergunning",
    readTime: config.readTime || 6,
    intro: [
      `${config.title} gaat over een onderwerp waar veel verwarring over bestaat. Dakkapellen zijn in sommige situaties vergunningsvrij, maar het antwoord hangt af van de plaatsing, de zichtbaarheid vanaf openbaar gebied, het type woning en de lokale regels van de gemeente.`,
      `${config.intro} Gebruik deze pagina als voorbereiding en controleer de uitkomst daarna altijd via ${categoryLink("vergunning", "de vergunningcategorie")} of rechtstreeks bij het Omgevingsloket.`,
    ],
    quickTitle: "Korte uitleg",
    quickAnswer: [
      config.quickAnswer,
      "De landelijke randvoorwaarden geven richting, maar gemeenten kunnen aanvullende eisen stellen via het omgevingsplan, welstand of erfgoedregels. Dat betekent dat twee vergelijkbare woningen in verschillende gemeenten toch anders beoordeeld kunnen worden.",
    ],
    note: permitNote,
    tableTitle: config.tableTitle || "Praktische situaties",
    tableIntro: [
      config.tableIntro ||
        "De tabel hieronder zet de meest voorkomende praktijksituaties naast elkaar zodat je sneller ziet waar de aandachtspunten zitten.",
    ],
    tableHeaders: config.tableHeaders || ["Situatie", "Gebruikelijke uitkomst", "Aandachtspunt"],
    tableRows: config.tableRows,
    factorsTitle: "Waar moet je extra op letten?",
    factorsIntro: [
      `Bij vergunningvragen zit het detail vaak in de randvoorwaarden. Daarom is het verstandig om niet alleen te vragen óf iets mag, maar ook onder welke voorwaarden het plan nog aangepast moet worden. Wie al verder is in het traject, leest hierna vaak ook ${articleLink("omgevingsvergunning-dakkapel-aanvragen", "hoe een aanvraag verloopt")}.`,
    ],
    factors: config.factors,
    examplesTitle: "Voorbeelden uit de praktijk",
    examples: config.examples,
    tipsTitle: "Tips voor huiseigenaren",
    tips: config.tips,
    faq: config.faq,
    related: config.related,
    extraSections: config.extraSections,
  });
}

function buildTypeGuide(config) {
  commonArticle({
    slug: config.slug,
    title: config.title,
    metaTitle: config.metaTitle,
    metaDescription: config.metaDescription,
    category: "materialen",
    readTime: config.readTime || 6,
    intro: [
      `${config.title} is vooral een keuzevraag. Huiseigenaren willen weten wat deze uitvoering precies is, wanneer hij slim is en welke invloed de keuze heeft op prijs, onderhoud en uitstraling.`,
      `${config.intro} Zoek je vooral het prijsplaatje, combineer deze informatie dan met ${articleLink("wat-kost-een-dakkapel", "de kostengids")} of een gerichte prijspagina zoals ${articleLink(config.costLink, articleTitleFor(config.costLink))}.`,
    ],
    quickTitle: "Wat is het in het kort?",
    quickAnswer: [
      config.quickAnswer,
      "De beste keuze hangt bijna nooit alleen van de aanschafprijs af. Ook onderhoud, uitstraling, levensduur en plaatsingssnelheid tellen mee in de totale afweging.",
    ],
    note: config.note || null,
    tableTitle: config.tableTitle || "Belangrijkste kenmerken",
    tableIntro: [
      "Onderstaande vergelijking helpt om de uitvoering snel in perspectief te zetten ten opzichte van andere veelgekozen opties.",
    ],
    tableHeaders: ["Kenmerk", "Wat je meestal ziet", "Praktisch effect"],
    tableRows: config.tableRows,
    factorsTitle: "Wanneer past deze keuze goed?",
    factorsIntro: [
      `De juiste keuze hangt af van de woning, het beschikbare budget en hoe belangrijk je uitstraling of onderhoud vindt. Twijfel je tussen meerdere routes, bekijk dan ook ${articleLink(config.compareLink, articleTitleFor(config.compareLink))}.`,
    ],
    factors: config.factors,
    examplesTitle: "Praktische scenario's",
    examples: config.examples,
    tipsTitle: "Tips voor huiseigenaren",
    tips: config.tips,
    faq: config.faq,
    related: config.related,
    extraSections: config.extraSections,
  });
}

function buildPlacementGuide(config) {
  commonArticle({
    slug: config.slug,
    title: config.title,
    metaTitle: config.metaTitle,
    metaDescription: config.metaDescription,
    category: "plaatsing",
    readTime: config.readTime || 6,
    intro: [
      `${config.title} is een praktische pagina voor de fase waarin de offerte concreet wordt en de uitvoering dichterbij komt. Juist dan willen huiseigenaren weten wat er wanneer gebeurt, welke voorbereiding nodig is en waar vertraging of extra kosten vandaan komen.`,
      `${config.intro} Deze uitleg sluit daarom goed aan op ${articleLink("dakkapel-laten-plaatsen", "de complete gids over dakkapel plaatsen")} en ${articleLink("offerte-dakkapel-vergelijken", "offertes vergelijken")}.`,
    ],
    quickTitle: "Kort antwoord",
    quickAnswer: [
      config.quickAnswer,
      "De snelheid van plaatsing wordt vooral bepaald door de gekozen bouwmethode, bereikbaarheid van het dak, weersomstandigheden en de vraag of er nog constructieve of vergunningstechnische stappen nodig zijn.",
    ],
    note: config.note || null,
    tableTitle: config.tableTitle || "Proces in vogelvlucht",
    tableIntro: [
      "Met deze tabel zie je hoe aanbieders het traject meestal opdelen in fasen of aandachtspunten.",
    ],
    tableHeaders: config.tableHeaders || ["Stap of onderdeel", "Indicatie", "Aandachtspunt"],
    tableRows: config.tableRows,
    factorsTitle: "Wat beïnvloedt planning en uitvoering?",
    factorsIntro: [
      `Wie alleen naar de montagedag kijkt, mist vaak de voorbereiding die ervoor nodig is. Vooral ${articleLink("voorbereiding-dakkapel-montage", "voorbereiding")}, vergunningcheck en binnenafwerking maken het verschil tussen een soepel traject en gedoe achteraf.`,
    ],
    factors: config.factors,
    examplesTitle: "Voorbeelden en scenario's",
    examples: config.examples,
    tipsTitle: "Tips voor huiseigenaren",
    tips: config.tips,
    faq: config.faq,
    related: config.related,
    extraSections: config.extraSections,
  });
}

function buildMaintenanceGuide(config) {
  commonArticle({
    slug: config.slug,
    title: config.title,
    metaTitle: config.metaTitle,
    metaDescription: config.metaDescription,
    category: "onderhoud",
    readTime: config.readTime || 5,
    intro: [
      `${config.title} helpt je om problemen eerder te herkennen en om beter te bepalen of je nog met een onderhoudsklus te maken hebt of met echt herstelwerk. Bij dakkapellen zit de winst vaak in tijdig signaleren: kleine scheurtjes, versleten kit of matige ventilatie worden snel groter als je er te lang mee wacht.`,
      `${config.intro} Wie naast onderhoud ook nadenkt over de lange termijn, leest hierna vaak ook ${articleLink("levensduur-dakkapel-per-materiaal", "de levensduur per materiaal")} of ${articleLink("wanneer-dakkapel-vervangen", "wanneer vervanging logisch wordt")}.`,
    ],
    quickTitle: "Kern van de vraag",
    quickAnswer: [
      config.quickAnswer,
      "Onderhoud en klachten lopen vaak in elkaar over. Een terugkerende lekkage of condensprobleem is meestal geen los incident, maar een signaal dat detailafwerking, ventilatie of materiaalconditie aandacht vraagt.",
    ],
    note: config.note || null,
    tableTitle: config.tableTitle || "Waar moet je op letten?",
    tableIntro: [
      "Deze tabel vat de meest voorkomende signalen, oorzaken of onderhoudspunten samen.",
    ],
    tableHeaders: config.tableHeaders || ["Signaal of onderdeel", "Wat het vaak betekent", "Eerste stap"],
    tableRows: config.tableRows,
    factorsTitle: "Belangrijkste oorzaken of aandachtspunten",
    factorsIntro: [
      `Bij klachten is het slim om niet meteen uit te gaan van één oorzaak. Problemen ontstaan vaak door een combinatie van detailafwerking, veroudering en gebruik. Bekijk zo nodig ook ${articleLink(config.crossLink, articleTitleFor(config.crossLink))} voor een aangrenzend probleem of onderhoudsgebied.`,
    ],
    factors: config.factors,
    examplesTitle: "Voorbeelden uit de praktijk",
    examples: config.examples,
    tipsTitle: "Tips voor huiseigenaren",
    tips: config.tips,
    faq: config.faq,
    related: config.related,
    extraSections: config.extraSections,
  });
}

function buildDecisionGuide(config) {
  commonArticle({
    slug: config.slug,
    title: config.title,
    metaTitle: config.metaTitle,
    metaDescription: config.metaDescription,
    category: "bespaartips",
    readTime: config.readTime || 6,
    intro: [
      `${config.title} draait om kiezen, niet alleen om prijzen. Dit type pagina helpt vooral wanneer meerdere opties op papier logisch lijken, maar je nog wilt snappen welke keuze in jouw situatie het meest praktisch of rendabel is.`,
      `${config.intro} In de meeste gevallen werkt deze pagina het beste in combinatie met ${articleLink(config.linkA, articleTitleFor(config.linkA))} en ${articleLink(config.linkB, articleTitleFor(config.linkB))}.`,
    ],
    quickTitle: "Korte conclusie",
    quickAnswer: [
      config.quickAnswer,
      "Een goede keuze is meestal de optie die past bij je woning, planning en onderhoudswensen, niet automatisch de goedkoopste offerte op de eerste pagina van Google.",
    ],
    note: null,
    tableTitle: "Vergelijking in één oogopslag",
    tableIntro: [
      "De tabel hieronder helpt je om de afweging concreet te maken voordat je offertes laat uitwerken.",
    ],
    tableHeaders: ["Onderdeel", "Optie A", "Optie B of uitkomst"],
    tableRows: config.tableRows,
    factorsTitle: "Welke overwegingen wegen het zwaarst?",
    factorsIntro: [
      `Wie deze keuze goed wil maken, kijkt naar meer dan prijs. Ook montage, onderhoud, vergunningen en gebruiksdoel horen mee te wegen. Gebruik hiervoor eventueel ook ${articleLink("checklist-dakkapel-offerte", "de offertechecklist")}.`,
    ],
    factors: config.factors,
    examplesTitle: "Voorbeelden en scenario's",
    examples: config.examples,
    tipsTitle: "Tips voor huiseigenaren",
    tips: config.tips,
    faq: config.faq,
    related: config.related,
    extraSections: config.extraSections,
  });
}

function buildOfferGuide(config) {
  commonArticle({
    slug: config.slug,
    title: config.title,
    metaTitle: config.metaTitle,
    metaDescription: config.metaDescription,
    category: "bespaartips",
    readTime: config.readTime || 5,
    intro: [
      `${config.title} is bedoeld voor het moment waarop je al naar aanbieders kijkt en wilt voorkomen dat je appels met peren vergelijkt. Juist in deze fase ontstaat vaak het grootste prijsverschil, omdat niet elke offerte dezelfde uitgangspunten en inbegrepen posten bevat.`,
      `${config.intro} Deze pagina combineert daarom inhoudelijke controlepunten met praktische onderhandelingstips. Lees eventueel ook ${articleLink("offerte-dakkapel-vergelijken", "hoe je offertes vergelijkt")} en ${articleLink("waar-moet-je-op-letten-bij-aannemer", "waar je op let bij een aannemer")}.`,
    ],
    quickTitle: "Kort antwoord",
    quickAnswer: [
      config.quickAnswer,
      "Een scherpe offerte is pas echt scherp als de omschrijving volledig is, de planning haalbaar is en duidelijk is wie verantwoordelijk is voor montage, garantie, afwerking en eventuele vergunning- of constructieposten.",
    ],
    note: null,
    tableTitle: config.tableTitle || "Checklist of aandachtspunten",
    tableIntro: [
      "Gebruik deze punten als controletabel wanneer je meerdere offertes naast elkaar legt.",
    ],
    tableHeaders: config.tableHeaders || ["Controlepunt", "Waarom dit telt", "Wat je wilt zien"],
    tableRows: config.tableRows,
    factorsTitle: "Waar gaat het vaak mis?",
    factorsIntro: [
      "Het meeste gedoe ontstaat doordat iets impliciet blijft. Een leverancier denkt dat een onderdeel optioneel is, terwijl jij aanneemt dat het in de prijs zit. Een goede vergelijking dwingt die onduidelijkheid eruit.",
    ],
    factors: config.factors,
    examplesTitle: "Praktische voorbeelden",
    examples: config.examples,
    tipsTitle: "Tips voor huiseigenaren",
    tips: config.tips,
    faq: config.faq,
    related: config.related,
    extraSections: config.extraSections,
  });
}

buildCostPillar();

[
  {
    slug: "prefab-dakkapel-kosten",
    title: "Prefab dakkapel kosten",
    metaTitle: "Prefab dakkapel kosten in 2026: prijzen, voorbeelden en aandachtspunten",
    metaDescription:
      "Bekijk wat een prefab dakkapel kost in 2026, hoe prijzen per breedte verschillen en welke posten de offerte hoger maken.",
    intro:
      "Prefab dakkapellen worden in de markt vaak gepresenteerd als de snelste en meest betaalbare route. Dat klopt vaak, maar alleen als je werkt met vrij standaard maten en een goed bereikbaar dak.",
    quickAnswer:
      "Voor veel standaardmaten ligt een prefab dakkapel grofweg tussen ongeveer €4.500 en €9.000. Brede uitvoeringen, duurdere materialen of extra afwerking kunnen dit bedrag verder verhogen.",
    tableRows: [
      ["2 tot 3 meter", "€4.500 - €7.000", "Vaak de scherpste combinatie van prijs en snelheid"],
      ["3 tot 4 meter", "€6.500 - €8.500", "Populair bij extra slaapkamer- of werkruimte"],
      ["5 meter of breder", "€9.000 - €13.500", "Vraagt zwaardere opbouw en soms extra hijswerk"],
      ["Binnenafwerking erbij", "+ €1.000 - €3.000", "Afhankelijk van aftimmering, stucwerk en elektra"],
    ],
    factors: [
      "Fabrieksafwerking en standaardisatie drukken de prijs, maar beperken soms het maatwerk.",
      "Bereikbaarheid van het dak en de inzet van een kraan hebben veel invloed op de montagepost.",
      "De materiaalkeuze van kozijnen en boeidelen kan de basisprijs flink opschuiven.",
      "Niet elke prefab offerte bevat dezelfde binnenafwerking of afvoer van afval.",
    ],
    examples: [
      { title: "Standaard rijwoning", text: "Bij een achterdakvlak met goede bereikbaarheid zie je prefab het sterkst terug in de prijs." },
      { title: "Brede gezinsoplossing", text: "Zodra de breedte richting 4 of 5 meter gaat, blijft prefab vaak interessant, maar het verschil met traditioneel wordt kleiner." },
      { title: "Extra afwerking", text: `Wie ook direct binnen alles netjes wil laten afwerken, moet vooral kijken naar ${articleLink("dakkapel-kosten-inclusief-binnenafwerking", "de post binnenafwerking")}.` },
    ],
    tips: [
      "Vraag altijd naar de exacte maat en inhoud van het fabriekselement.",
      "Controleer of hijswerk, montage en afvoer in dezelfde prijs zijn opgenomen.",
      `Vergelijk prefab niet alleen op prijs, maar ook op levertijd en garantie via ${articleLink("prefab-of-traditionele-dakkapel", "de vergelijking met traditioneel")}.`,
    ],
    faq: [
      { q: "Is prefab altijd de goedkoopste optie?", a: "Bij standaardmaten meestal wel, maar bij complexe wensen of brede kapellen wordt het verschil soms kleiner." },
      { q: "Kan een prefab dakkapel in één dag geplaatst worden?", a: "Dat is juist een van de grote voordelen. De plaatsing zelf is vaak in één dag klaar, mits de voorbereiding rond is." },
      { q: "Zit binnenafwerking in de prefab prijs?", a: "Niet standaard. Dat verschilt per offerte en moet je expliciet controleren." },
    ],
    related: ["prefab-of-traditionele-dakkapel", "dakkapel-in-1-dag-plaatsen", "offerte-dakkapel-vergelijken"],
  },
  {
    slug: "traditionele-dakkapel-kosten",
    title: "Traditionele dakkapel kosten",
    metaTitle: "Traditionele dakkapel kosten in 2026: prijs, maatwerk en voorbeelden",
    metaDescription:
      "Lees wat een traditionele dakkapel kost, wanneer maatwerk loont en hoe de prijs zich verhoudt tot prefab.",
    intro:
      "Een traditionele dakkapel wordt op locatie opgebouwd. Daardoor krijg je meer maatwerkvrijheid, maar betaal je meestal ook meer arbeidsuren en heb je langer bouwverkeer aan huis.",
    quickAnswer:
      "Voor een traditionele dakkapel kom je in veel situaties uit tussen ongeveer €7.000 en €15.000 of hoger. Hoe complexer de vorm en afwerking, hoe sneller de prijs oploopt.",
    tableRows: [
      ["Kleine maat", "€7.000 - €9.500", "Interessant wanneer prefab net niet past"],
      ["Middenmaat", "€8.500 - €12.500", "Veel ruimte voor maatwerk in indeling en uitstraling"],
      ["Brede kapel", "€12.000 - €18.000+", "Hoger budget door extra arbeid en constructie"],
      ["Luxe afwerking", "+ €1.500 - €4.000", "Bij hout, sierdetails of uitgebreide binnenzijde"],
    ],
    factors: [
      "Meer arbeid op locatie betekent meer uren en dus een hogere offerte.",
      "Maatwerk in kozijnen, dakvorm, boeidelen of uitstraling duwt de prijs op.",
      "Bij traditionele bouw zijn binnen- en buitendetails vaak uitgebreider geprijsd.",
      "Weersinvloed en bouwtijd maken planning belangrijker dan bij prefab.",
    ],
    examples: [
      { title: "Karakteristieke woning", text: "Bij oudere of karaktervolle woningen wordt traditioneel vaak gekozen om het gevelbeeld beter te laten aansluiten." },
      { title: "Afwijkend dakvlak", text: "Als standaard prefabmaten niet passen, wordt traditioneel sneller logisch." },
      { title: "Maatwerk loont niet altijd", text: `Wie vooral op prijs en snelheid stuurt, vergelijkt deze route het best met ${articleLink("prefab-dakkapel-kosten", "prefab")}.` },
    ],
    tips: [
      "Vraag altijd waarom maatwerk in jouw situatie nodig zou zijn.",
      "Controleer of de offerte inclusief schilderwerk, aftimmering en bouwtijd is.",
      `Laat ook een prefab alternatief offreren via ${articleLink("offerte-dakkapel-vergelijken", "meerdere offertes")}.`,
    ],
    faq: [
      { q: "Waarom is traditioneel duurder?", a: "Omdat er meer werk op locatie gebeurt en meer maatwerk mogelijk is." },
      { q: "Wanneer kies je toch voor traditioneel?", a: "Vooral wanneer standaard prefab niet goed past bij de maat, dakvorm of uitstraling van de woning." },
      { q: "Is traditioneel altijd beter van kwaliteit?", a: "Nee. De kwaliteit hangt vooral af van ontwerp, materiaal en uitvoering, niet alleen van de bouwmethode." },
    ],
    related: ["prefab-of-traditionele-dakkapel", "wat-kost-een-dakkapel", "hoe-kies-je-een-goede-dakkapel-specialist"],
  },
  {
    slug: "kunststof-dakkapel-kosten",
    title: "Kunststof dakkapel kosten",
    metaTitle: "Kunststof dakkapel kosten: prijs, onderhoud en slimme keuzes",
    metaDescription:
      "Wat kost een kunststof dakkapel? Bekijk indicatieve prijzen, onderhoudsvoordelen en situaties waarin kunststof de slimste keuze is.",
    intro:
      "Kunststof wordt vaak gezien als de standaardkeuze voor een moderne, onderhoudsarme dakkapel. Daardoor kom je dit materiaal ook het vaakst tegen in online prijsvoorbeelden.",
    quickAnswer:
      "Een kunststof dakkapel zit meestal in het betaalbare tot middensegment. Voor veel standaardmaten zie je prijzen vanaf ongeveer €5.500 oplopen richting €10.000 of meer, afhankelijk van breedte en afwerking.",
    tableRows: [
      ["Prefab kunststof", "€5.500 - €8.500", "Onderhoudsarm en scherp geprijsd"],
      ["Traditioneel kunststof", "€7.500 - €11.500", "Meer maatwerk maar hogere montagekosten"],
      ["Extra opties", "+ €500 - €2.000", "Bijvoorbeeld rolluiken, speciale kleuren of luxe kozijnen"],
      ["Onderhoud op lange termijn", "Laag", "Vaak alleen schoonmaken en controleren"],
    ],
    factors: [
      "Breedte en beglazing bepalen nog altijd meer van de prijs dan het materiaal alleen.",
      "Kleuren, folieafwerkingen en extra raamindelingen kunnen kunststof duurder maken.",
      "Het lage onderhoud maakt kunststof op lange termijn vaak financieel interessant.",
      "Niet elke kunststof dakkapel is volledig houtvrij opgebouwd; vraag dus naar de exacte constructie.",
    ],
    examples: [
      { title: "Prijsbewuste keuze", text: "Kunststof past goed bij huiseigenaren die lage onderhoudslasten belangrijk vinden." },
      { title: "Moderne uitstraling", text: "Bij strakke, moderne gevels sluit kunststof vaak goed aan zonder veel onderhoud." },
      { title: "Vergelijking met hout", text: `Twijfel je tussen uitstraling en onderhoud, bekijk dan ook ${articleLink("kunststof-of-houten-dakkapel", "kunststof of hout")}.` },
    ],
    tips: [
      "Vraag of kleuren en afwerking standaard zijn of als meerwerk worden gerekend.",
      "Controleer hoe de leverancier omgaat met onderhoud, rubbers en hang- en sluitwerk.",
      `Bekijk naast de aanschafprijs ook ${articleLink("onderhoud-kunststof-dakkapel", "het onderhoud van kunststof")}.`,
    ],
    faq: [
      { q: "Is kunststof goedkoper dan hout?", a: "Vaak wel, zeker wanneer je ook onderhoud meeneemt in de vergelijking." },
      { q: "Moet een kunststof dakkapel geschilderd worden?", a: "Normaal gesproken niet. Schoonmaken en controle van rubbers en sluitwerk zijn meestal voldoende." },
      { q: "Past kunststof bij oudere woningen?", a: "Dat hangt af van kleur, profilering en uitstraling. Bij karakteristieke woningen wordt hout soms mooier gevonden." },
    ],
    related: ["kunststof-of-houten-dakkapel", "onderhoud-kunststof-dakkapel", "wat-kost-een-dakkapel"],
  },
  {
    slug: "houten-dakkapel-kosten",
    title: "Houten dakkapel kosten",
    metaTitle: "Houten dakkapel kosten: prijs, uitstraling en onderhoud",
    metaDescription:
      "Lees wat een houten dakkapel kost, welke meerprijs je vaak ziet en wanneer hout de beste keuze is.",
    intro:
      "Een houten dakkapel wordt vaak gekozen vanwege de warme uitstraling en de betere aansluiting op klassieke of karakteristieke woningen. Daar staat wel tegenover dat de prijs en het onderhoud meestal hoger liggen dan bij kunststof.",
    quickAnswer:
      "Voor een houten dakkapel ligt de prijs vaak iets boven kunststof. Reken meestal op een meerprijs van enkele honderden tot ruim duizend euro, afhankelijk van maat, afwerking en schilderwerk.",
    tableRows: [
      ["Basis hout", "Vanaf ongeveer €6.000", "Prijs hangt sterk af van maat en detaillering"],
      ["Meerprijs t.o.v. kunststof", "Vaak + €500 - €1.500", "Voor materiaal en afwerking"],
      ["Schilderwerk of behandeling", "Extra post of onderhoud", "Niet altijd in de offerte opgenomen"],
      ["Onderhoud op lange termijn", "Gemiddeld tot hoog", "Regelmatige controle en schilderbeurten nodig"],
    ],
    factors: [
      "De houtsoort en de afwerking hebben veel invloed op de prijs.",
      "Niet elke leverancier rekent schilderwerk op dezelfde manier mee.",
      "Onderhoudskosten op langere termijn horen mee in je vergelijking.",
      "Hout wordt vaker gekozen voor woningen waar uitstraling zwaarder weegt dan alleen prijs.",
    ],
    examples: [
      { title: "Jaren-30 woning", text: "Hout wordt vaak gekozen om aan te sluiten op bestaande kozijnen of een klassiek gevelbeeld." },
      { title: "Meer onderhoud, meer uitstraling", text: "Wie graag een natuurlijke look wil, accepteert meestal ook het extra onderhoud." },
      { title: "Twijfel tussen prijs en stijl", text: `Vergelijk hout daarom altijd naast ${articleLink("kunststof-dakkapel-kosten", "kunststof")} en ${articleLink("kunststof-of-houten-dakkapel", "de keuzehulp hout of kunststof")}.` },
    ],
    tips: [
      "Vraag of het hout al behandeld of gegrond wordt opgeleverd.",
      "Controleer wanneer de eerste schilderbeurt of onderhoudsinspectie verstandig is.",
      `Neem toekomstig onderhoud mee in je beoordeling via ${articleLink("onderhoud-houten-dakkapel", "onderhoud van houten dakkapellen")}.`,
    ],
    faq: [
      { q: "Is hout altijd duurder dan kunststof?", a: "In veel offertes wel, al hangt het exacte verschil af van uitvoering en afwerking." },
      { q: "Waarom kiezen mensen toch voor hout?", a: "Vooral vanwege uitstraling, detaillering en aansluiting op klassieke woningen." },
      { q: "Hoeveel onderhoud vraagt een houten dakkapel?", a: "Meer dan kunststof. Regelmatige controle en periodiek schilderwerk zijn gebruikelijk." },
    ],
    related: ["kunststof-of-houten-dakkapel", "onderhoud-houten-dakkapel", "wat-kost-een-dakkapel"],
  },
  {
    slug: "polyester-dakkapel-kosten",
    title: "Polyester dakkapel kosten",
    metaTitle: "Polyester dakkapel kosten: prijs, levensduur en onderhoud",
    metaDescription:
      "Bekijk wat een polyester dakkapel kost en hoe polyester scoort op prijs, onderhoud en levensduur.",
    intro:
      "Polyester komt vaak terug in prefab-systemen en wordt populair gevonden vanwege de strakke afwerking en de beperkte onderhoudsbehoefte. De prijs ligt meestal hoger dan de goedkoopste kunststof oplossingen, maar lager dan sommige luxe maatwerkvarianten.",
    quickAnswer:
      "Een polyester dakkapel zit meestal in het middensegment tot hogere segment. Veel offertes tonen een meerprijs ten opzichte van een eenvoudige kunststof uitvoering, vooral wanneer het om brede prefab-elementen gaat.",
    tableRows: [
      ["Prefab polyester", "Vaak vanaf €6.500", "Populair bij onderhoudsarme prefab oplossingen"],
      ["Meerprijs t.o.v. basis kunststof", "Vaak + €1.000 - €2.500", "Afhankelijk van breedte en afwerking"],
      ["Onderhoudsniveau", "Laag", "Weinig naden en vaak strakke afwerking"],
      ["Levensduur", "Lang", "Interessant wanneer je weinig wilt schilderen"],
    ],
    factors: [
      "De exacte opbouw verschilt per leverancier en systeem.",
      "Breedte en afwerkingsniveau blijven ook hier belangrijker dan het materiaal alleen.",
      "Polyester wordt vaker gekozen bij prefab concepten met weinig zichtbare naden.",
      "Vraag altijd wat er precies polyester is en welke delen nog uit andere materialen zijn opgebouwd.",
    ],
    examples: [
      { title: "Onderhoudsarm maatwerkgevoel", text: "Polyester wordt vaak gekozen door mensen die een strakke look willen zonder periodiek schilderwerk." },
      { title: "Prefab plus", text: "Binnen prefab-systemen zit polyester vaak boven een standaard basismodel qua prijs." },
      { title: "Lange termijn", text: `Combineer prijsvergelijking hier met ${articleLink("levensduur-dakkapel-per-materiaal", "levensduur per materiaal")}.` },
    ],
    tips: [
      "Vraag welke garanties gelden op afwerking en verkleuring.",
      "Controleer hoe eventuele beschadigingen of reparaties worden opgelost.",
      `Zet polyester altijd naast ${articleLink("kunststof-dakkapel-kosten", "kunststof")} en ${articleLink("polyester-dakkapel", "de eigenschappen van polyester")}.`,
    ],
    faq: [
      { q: "Is polyester duurder dan kunststof?", a: "Vaak wel, al hangt dat af van leverancier en systeem." },
      { q: "Waarom kiezen mensen voor polyester?", a: "Vooral vanwege de onderhoudsarme, strakke afwerking en de vaak lange levensduur." },
      { q: "Is polyester alleen prefab?", a: "Het materiaal wordt veel in prefab gebruikt, maar de precieze opbouw verschilt per aanbieder." },
    ],
    related: ["polyester-dakkapel", "levensduur-dakkapel-per-materiaal", "wat-kost-een-dakkapel"],
  },
  {
    slug: "dakkapel-kosten-per-meter",
    title: "Dakkapel kosten per meter",
    metaTitle: "Dakkapel kosten per meter: prijsverschillen per breedte uitgelegd",
    metaDescription:
      "Lees hoe de kosten van een dakkapel per meter oplopen en wat je ongeveer betaalt bij 2, 3, 4 en 5 meter breedte.",
    intro:
      "De prijs van een dakkapel beweegt voor een groot deel mee met de breedte. Dat is logisch: extra meters betekenen meer materiaal, zwaardere constructie en vaak meer afwerking.",
    quickAnswer:
      "Hoe breder de dakkapel, hoe hoger de prijs. In de praktijk is de prijs per extra meter niet volledig lineair, omdat ook vaste kosten voor productie en montage een rol spelen.",
    tableRows: [
      ["2 meter", "€4.500 - €6.500", "Compact en relatief budgetvriendelijk"],
      ["3 meter", "€5.500 - €10.500", "Veelgekozen standaardmaat"],
      ["4 meter", "€7.000 - €13.000", "Meer ruimte, maar ook sneller vergunning- of constructievragen"],
      ["5 meter", "€11.000 - €18.000+", "Groot effect op ruimte en budget"],
    ],
    factors: [
      "Vaste kosten zoals kraan, planning en montage spelen mee bij elke breedte.",
      "Bredere kapellen hebben vaker extra constructieve aandacht nodig.",
      "Binnenafwerking groeit mee met de breedte en wordt vaak onderschat.",
      "Bij grotere breedtes wordt het belangrijker om offertes inhoudelijk te vergelijken.",
    ],
    examples: [
      { title: "Van 3 naar 4 meter", text: "Deze stap voelt vaak logisch, maar maakt de offerte meestal duidelijk hoger dan veel huiseigenaren vooraf denken." },
      { title: "Van 4 naar 5 meter", text: "Bij 5 meter wordt ruimtewinst groot, maar vaak ook de noodzaak om beter naar constructie en vergunning te kijken." },
      { title: "Breedte kiezen", text: `Twijfel je nog? Bekijk dan ook ${articleLink("beste-breedte-voor-een-dakkapel", "welke breedte slim is")}.` },
    ],
    tips: [
      "Laat bij twijfel twee breedtes offreren in plaats van één.",
      "Kijk niet alleen naar prijs, maar ook naar de extra bruikbare ruimte die je wint.",
      "Controleer vanaf ongeveer 4 meter extra goed op vergunning, dakconstructie en binnenafwerking.",
    ],
    faq: [
      { q: "Stijgt de prijs per meter altijd evenveel?", a: "Nee, omdat vaste kosten en extra constructieve eisen een rol spelen." },
      { q: "Welke breedte is het populairst?", a: "Voor veel woningen is 3 meter een veelgekozen maat." },
      { q: "Is een bredere dakkapel altijd beter?", a: "Niet per se. Het hangt af van ruimtewinst, budget en vergunning- of constructiegrenzen." },
    ],
    related: ["dakkapel-kosten-3-meter", "dakkapel-kosten-4-meter", "beste-breedte-voor-een-dakkapel"],
  },
  {
    slug: "dakkapel-kosten-3-meter",
    title: "Dakkapel kosten 3 meter",
    metaTitle: "Dakkapel kosten 3 meter: prijs, voorbeelden en slimme keuzes",
    metaDescription:
      "Wat kost een dakkapel van 3 meter? Bekijk indicatieve prijzen voor prefab en traditioneel plus tips voor de meest gekozen maat.",
    intro:
      "Een dakkapel van 3 meter is voor veel woningen de praktische middenweg. Je wint duidelijk bruikbare ruimte zonder direct in het hoogste prijssegment te belanden.",
    quickAnswer:
      "Een dakkapel van 3 meter kost in veel situaties ongeveer €5.500 tot €10.500, afhankelijk van prefab of traditioneel, materiaal en afwerking.",
    tableRows: [
      ["Prefab 3 meter", "€5.500 - €7.500", "Interessant bij standaard achterdakvlakken"],
      ["Traditioneel 3 meter", "€8.000 - €10.500", "Meer maatwerk en afwerkingsruimte"],
      ["Binnenafwerking extra", "+ €1.000 - €2.500", "Hangt af van aftimmering en elektra"],
      ["Vergunning of constructeur", "Situatieafhankelijk", "Vooral relevant aan de voorzijde of bij bijzondere panden"],
    ],
    factors: [
      "Bouwmethode blijft de grootste prijsbepaler bij deze maat.",
      "Ook bij 3 meter kunnen materiaalkeuze en kozijnindeling flink schelen.",
      "De 3-metermaat wordt vaak gekozen voor een slaapkamer of thuiswerkplek.",
      "Offertes verschillen vooral op afwerking en inbegrepen montageposten.",
    ],
    examples: [
      { title: "Rijwoning achterzijde", text: "Bij een standaard situatie is 3 meter vaak de maat waar prefab het meeste prijsvoordeel laat zien." },
      { title: "Jaren-30 woning", text: "Als uitstraling belangrijk is, wordt bij 3 meter nog vaak voor hout of traditioneel gekozen." },
      { title: "Offertevergelijking", text: `Gebruik voor deze maat ook ${articleLink("checklist-dakkapel-offerte", "de checklist voor offertes")}.` },
    ],
    tips: [
      "Vraag minimaal twee varianten op: basisuitvoering en uitvoering met afwerking.",
      "Controleer of het raamtype en de beglazing in beide offertes gelijk zijn.",
      `Vergelijk 3 meter ook eens met ${articleLink("dakkapel-kosten-4-meter", "4 meter")} als je twijfelt over de ruimtewinst.`,
    ],
    faq: [
      { q: "Is 3 meter de populairste maat?", a: "Het is in ieder geval een veelgekozen formaat omdat prijs en ruimtewinst goed in balans zijn." },
      { q: "Past prefab goed bij 3 meter?", a: "Ja, dit is juist een maat waar prefab vaak scherp geprijsd is." },
      { q: "Kan 3 meter vergunningsvrij zijn?", a: "Dat hangt niet alleen van de breedte af, maar ook van plaatsing en de overige voorwaarden." },
    ],
    related: ["dakkapel-kosten-per-meter", "dakkapel-kosten-4-meter", "vergunning-dakkapel-regels"],
  },
  {
    slug: "dakkapel-kosten-4-meter",
    title: "Dakkapel kosten 4 meter",
    metaTitle: "Dakkapel kosten 4 meter: prijsrange, voorbeelden en aandachtspunten",
    metaDescription:
      "Bekijk wat een dakkapel van 4 meter kost en waar je op moet letten bij prijs, vergunning en constructie.",
    intro:
      "Een dakkapel van 4 meter geeft meestal een flinke sprong in bruikbare ruimte. Tegelijk schuift ook de offerte meestal merkbaar op, vooral wanneer de afwerking uitgebreid is.",
    quickAnswer:
      "Voor 4 meter breedte zie je vaak indicatieve prijzen vanaf ongeveer €7.000 oplopend naar €13.000 of meer, afhankelijk van type, materiaal en afwerking.",
    tableRows: [
      ["Prefab 4 meter", "€7.000 - €9.500", "Interessant als snelheid en prijs belangrijk zijn"],
      ["Traditioneel 4 meter", "€9.500 - €13.000", "Meer ruimte voor maatwerk en detaillering"],
      ["Extra afwerking", "+ €1.000 - €3.000", "Binnenzijde, elektra en afwerking trekken de prijs verder op"],
      ["Constructieve aandacht", "Vaker relevant", "Vooral bij bredere en zwaardere uitvoeringen"],
    ],
    factors: [
      "Bij 4 meter gaat constructie een grotere rol spelen dan bij kleinere maten.",
      "Binnenafwerking wordt duurder omdat de hele uitsparing groter is.",
      "Materiaalkeuze en kozijnindeling beïnvloeden het prijsverschil sterker.",
      "Niet elke woning is qua dakvlak even geschikt voor 4 meter zonder extra voorbereiding.",
    ],
    examples: [
      { title: "Gezinswoning met zolderkamer", text: "Een 4-meterkapel wordt vaak gekozen om van een zolder echt een volwaardige kamer te maken." },
      { title: "Combinatie met binnenafwerking", text: "Juist bij 4 meter kiezen veel mensen ervoor om direct ook binnen alles netjes af te werken." },
      { title: "Prijsvergelijking", text: `Twijfel je tussen 3 en 4 meter, leg ze dan naast elkaar via ${articleLink("beste-breedte-voor-een-dakkapel", "de breedtekeuzehulp")}.` },
    ],
    tips: [
      "Vraag of de leverancier zelf een constructeur inschakelt wanneer dat nodig blijkt.",
      "Controleer vroeg of vergunning of welstand een rol speelt.",
      "Laat de offerte niet alleen op buitenmaat uitschrijven, maar ook op afwerkingsniveau binnen.",
    ],
    faq: [
      { q: "Is 4 meter veel duurder dan 3 meter?", a: "Vaak wel merkbaar, vooral als binnenafwerking en constructie ook zwaarder worden." },
      { q: "Is 4 meter nog geschikt voor prefab?", a: "Ja, vaak wel, maar de winst ten opzichte van traditioneel wordt soms kleiner." },
      { q: "Heb je bij 4 meter sneller een vergunning nodig?", a: "Niet door de breedte alleen, maar grotere plannen vragen wel sneller om extra controle." },
    ],
    related: ["dakkapel-kosten-3-meter", "dakkapel-kosten-5-meter", "dakconstructie-aanpassen-voor-dakkapel"],
  },
  {
    slug: "dakkapel-kosten-5-meter",
    title: "Dakkapel kosten 5 meter",
    metaTitle: "Dakkapel kosten 5 meter: grote dakkapel prijzen en voorbeelden",
    metaDescription:
      "Wat kost een dakkapel van 5 meter? Lees welke prijsrange gebruikelijk is en waar je op moet letten bij een brede kapel.",
    intro:
      "Een dakkapel van 5 meter of breder zit duidelijk in het grotere segment. De ruimtewinst is groot, maar hetzelfde geldt meestal voor de investering en de voorbereiding.",
    quickAnswer:
      "Een dakkapel van 5 meter komt vaak uit vanaf ongeveer €11.000 en loopt door tot €18.000 of meer, afhankelijk van bouwmethode, materiaal, afwerking en constructieve eisen.",
    tableRows: [
      ["Prefab 5 meter", "€11.000 - €14.500", "Interessant bij goed bereikbaar dak en standaarduitvoering"],
      ["Traditioneel 5 meter", "€13.500 - €18.000+", "Meer maatwerk, maar ook meer bouwtijd en budget"],
      ["Binnenafwerking", "+ €1.500 - €3.500", "Grotere opening betekent meestal ook meer werk binnen"],
      ["Constructeur/vergunning", "Vaker noodzakelijk", "Brede plannen vragen vaak om extra controle"],
    ],
    factors: [
      "Bij 5 meter spelen draagkracht en detaillering bijna altijd een grotere rol.",
      "Het verschil tussen kale plaatsing en compleet afgewerkte oplevering is groot.",
      "Bereikbaarheid en hijswerk drukken zwaarder op de offerte omdat onderdelen groter zijn.",
      "Brede dakkapellen worden vaker gekoppeld aan een complete zolderverbouwing.",
    ],
    examples: [
      { title: "Maximale ruimtewinst", text: "Een 5-meterkapel is vooral interessant wanneer je van de zolder een volwaardige verdieping wilt maken." },
      { title: "Niet alleen prijs, ook planning", text: "Bij zulke breedtes is de voorbereidingsfase minstens zo belangrijk als het prijskaartje." },
      { title: "Combinatie met verbouwing", text: `Bekijk daarom ook ${articleLink("dakkapel-laten-plaatsen", "de complete plaatsingsgids")} en ${articleLink("dakkapel-kosten-inclusief-binnenafwerking", "de kosten van binnenafwerking")}.` },
    ],
    tips: [
      "Vraag extra expliciet naar constructieve onderbouwing en eventuele vergunningstappen.",
      "Controleer of grote breedtes invloed hebben op raamindeling, ventilatie en afwatering.",
      "Laat de meerwaarde voor ruimte en woningwaarde meewegen, niet alleen de aanschafprijs.",
    ],
    faq: [
      { q: "Is 5 meter nog haalbaar als prefab?", a: "Vaak wel, maar het hangt af van systeem, bereikbaarheid en dakconstructie." },
      { q: "Waarom stijgt de prijs bij 5 meter zo hard?", a: "Door meer materiaal, zwaardere constructie, grotere binnenafwerking en vaak extra voorbereiding." },
      { q: "Is 5 meter altijd vergunningplichtig?", a: "Niet automatisch, maar grote plannen vragen wel sneller om extra toetsing." },
    ],
    related: ["dakkapel-kosten-4-meter", "dakconstructie-aanpassen-voor-dakkapel", "woningwaarde-dakkapel"],
  },
  {
    slug: "dakkapel-kosten-inclusief-montage",
    title: "Dakkapel kosten inclusief montage",
    metaTitle: "Dakkapel kosten inclusief montage: wat zit er wel en niet in?",
    metaDescription:
      "Lees wat dakkapel kosten inclusief montage betekenen en welke montageposten vaak wel of niet in de offerte staan.",
    intro:
      "Veel aanbieders communiceren met prijzen inclusief montage, maar dat zegt pas iets als je weet welke montageposten werkelijk zijn inbegrepen. Juist daar ontstaan in de praktijk de grootste verschillen tussen offertes.",
    quickAnswer:
      "Kosten inclusief montage betekenen meestal dat plaatsing, montage-uren en een deel van de logistiek in de prijs zitten. Niet altijd inbegrepen zijn bijvoorbeeld steigerwerk, kraan, afvalafvoer, vergunning of uitgebreide binnenafwerking.",
    tableRows: [
      ["Montage-uren", "Vaak inbegrepen", "Basisonderdeel van de plaatsingsprijs"],
      ["Hijswerk of kraan", "Soms apart", "Hangt af van bereikbaarheid en leverancier"],
      ["Steiger of valbeveiliging", "Soms apart", "Vooral bij moeilijk bereikbare situaties"],
      ["Afvoer afval", "Niet altijd duidelijk", "Controleer of dit expliciet is benoemd"],
    ],
    factors: [
      "De term inclusief montage is niet bij elke aanbieder even volledig.",
      "Bij prefab is montage vaak compacter geprijsd dan bij traditioneel.",
      "Bereikbaarheid van het dak kan extra montagekosten veroorzaken.",
      "Binnenwerk wordt vaak ten onrechte als onderdeel van montage gezien, maar apart geoffreerd.",
    ],
    examples: [
      { title: "Eenvoudige achterzijde", text: "Hier is inclusief montage vaak echt overzichtelijk en redelijk compleet." },
      { title: "Complex dak of lastige straat", text: "Dan worden kraan, steiger en logistiek vaker apart benoemd of verhoogd." },
      { title: "Checklist nodig", text: `Gebruik daarom altijd ${articleLink("checklist-dakkapel-offerte", "een offertechecklist")} naast de prijs.` },
    ],
    tips: [
      "Vraag leveranciers om een regel-voor-regel uitsplitsing van de montagepost.",
      "Controleer of weersafhankelijk oponthoud of extra veiligheidsmaatregelen invloed hebben op de prijs.",
      `Lees daarnaast ${articleLink("wat-gebeurt-er-op-de-dag-van-plaatsing", "wat er op de montagedag gebeurt")} zodat je de montage beter kunt inschatten.`,
    ],
    faq: [
      { q: "Betekent inclusief montage ook inclusief kraan?", a: "Niet altijd. Dat hangt af van de leverancier en de bereikbaarheid van de woning." },
      { q: "Is binnenafwerking deel van montage?", a: "Vaak niet volledig. Het kan als aparte post of aanvullende optie zijn opgenomen." },
      { q: "Hoe controleer ik dit goed?", a: "Vraag om een gespecificeerde offerte waarin montage, hijswerk en afwerking apart benoemd staan." },
    ],
    related: ["checklist-dakkapel-offerte", "dakkapel-kosten-inclusief-binnenafwerking", "offerte-dakkapel-vergelijken"],
  },
  {
    slug: "dakkapel-kosten-inclusief-binnenafwerking",
    title: "Dakkapel kosten inclusief binnenafwerking",
    metaTitle: "Dakkapel kosten inclusief binnenafwerking: extra kosten uitgelegd",
    metaDescription:
      "Wat kost een dakkapel inclusief binnenafwerking? Lees welke afwerkingsposten er meestal bijkomen en hoe je offertes vergelijkt.",
    intro:
      "Veel prijsvoorbeelden online stoppen bij de buitenzijde en de plaatsing. In de praktijk willen veel huiseigenaren de ruimte binnen ook meteen netjes afgewerkt opleveren. Juist daar zit vaak een flinke extra post.",
    quickAnswer:
      "Voor binnenafwerking moet je vaak rekenen op een aanvullende post van ongeveer €1.000 tot €3.500 of meer, afhankelijk van de omvang van de uitsparing, het gewenste afwerkingsniveau en eventuele elektra of stucwerk.",
    tableRows: [
      ["Aftimmering", "Vaak onderdeel van de basisafwerking", "Controleer materiaal en detaillering"],
      ["Stucwerk of sauswerk", "Vaak extra", "Niet elke dakkapelspecialist levert dit mee"],
      ["Vensterbank en afwerkprofielen", "Soms inbegrepen", "Sterk offerteafhankelijk"],
      ["Elektra of radiatoren", "Meestal extra", "Vooral relevant bij complete zolderverbouwing"],
    ],
    factors: [
      "Hoe groter de opening, hoe meer werk aan dagkanten en aansluiting op bestaande wanden.",
      "Stucwerk, schilderwerk en elektra vallen niet altijd onder dezelfde aannemer.",
      "Binnenafwerking beïnvloedt niet alleen de prijs, maar ook de totale doorlooptijd.",
      "Een scherpe buitenprijs kan alsnog duur uitpakken als binnen alles nog open blijft.",
    ],
    examples: [
      { title: "Kaal geplaatst", text: "Sommige offertes leveren een dakkapel technisch geplaatst op, maar laten de binnenzijde ruw achter." },
      { title: "Turn-key oplevering", text: "Andere aanbieders nemen aftimmering, vensterbanken en schilderwerk wel mee, maar rekenen daar een duidelijke meerprijs voor." },
      { title: "Verbouwing combineren", text: `Combineer deze pagina met ${articleLink("binnenafwerking-dakkapel-uitleg", "de uitleg over binnenafwerking")} als je het traject echt wilt begrijpen.` },
    ],
    tips: [
      "Vraag leveranciers exact te omschrijven hoe de ruimte binnen wordt opgeleverd.",
      "Leg naast het totaalbedrag ook het afwerkingsniveau per offerte naast elkaar.",
      "Bepaal of je binnenafwerking wilt laten meeliften in één project of apart wilt aanbesteden.",
    ],
    faq: [
      { q: "Wat hoort bij binnenafwerking van een dakkapel?", a: "Meestal aftimmering, afwerkprofielen, dagkanten en soms stuc- of schilderwerk, maar dat verschilt per offerte." },
      { q: "Waarom is binnenafwerking vaak een aparte post?", a: "Omdat niet elke dakkapelspecialist ook alle afbouwwerkzaamheden uitvoert." },
      { q: "Is compleet opleveren duurder?", a: "Ja, maar het geeft wel sneller een bruikbare kamer en minder losse aannemers." },
    ],
    related: ["binnenafwerking-dakkapel-uitleg", "checklist-dakkapel-offerte", "wat-kost-een-dakkapel"],
  },
].forEach(buildCostGuide);

[
  {
    slug: "vergunning-dakkapel-regels",
    title: "Dakkapel vergunning regels in Nederland",
    metaTitle: "Dakkapel vergunning regels in Nederland: complete gids 2026",
    metaDescription:
      "Lees de belangrijkste vergunningregels voor dakkapellen in Nederland en wanneer je een vergunning nodig hebt of vergunningsvrij kunt bouwen.",
    intro:
      "Deze gids geeft overzicht over de regels die het vaakst terugkomen in openbare uitleg van gemeenten, vergunningchecks en dakkapelsites. Daarmee krijg je snel zicht op de situaties waarin een aanvraag logisch of zelfs verplicht wordt.",
    quickAnswer:
      "In veel gevallen is een dakkapel aan het achterdakvlak of een niet-openbaar zijdakvlak onder voorwaarden vergunningsvrij. Aan de voorzijde, bij monumenten of in beschermd stadsgezicht is een vergunning veel sneller nodig.",
    tableRows: [
      ["Achterdakvlak", "Vaak vergunningsvrij mogelijk", "Alleen als ook aan de overige randvoorwaarden wordt voldaan"],
      ["Voordakvlak", "Vaak vergunning nodig", "Door zichtbaarheid en welstandseisen"],
      ["Monument", "Vaak vergunningplichtig", "Erfgoedregels spelen mee"],
      ["Beschermd stadsgezicht", "Extra controle nodig", "Lokale eisen en welstand wegen zwaarder"],
      ["Afwijkende vorm of nokwijziging", "Vaker vergunning nodig", "Grotere impact op dakbeeld en constructie"],
    ],
    factors: [
      "Zichtbaarheid vanaf openbaar gebied is een belangrijk onderscheid.",
      "De exacte plaatsing ten opzichte van nok, dakvoet en zijkanten telt mee.",
      "Monumentale status of beschermd stadsgezicht maakt de beoordeling strenger.",
      "Gemeentelijke regels en welstand kunnen de uitkomst aanscherpen.",
      "Ook als iets vergunningsvrij lijkt, kan een constructeur of VvE nog een rol spelen.",
    ],
    examples: [
      { title: "Standaard achterzijde", text: "Bij een reguliere woning aan de achterzijde is vergunningsvrij vaak kansrijk, mits je aan de randvoorwaarden voldoet." },
      { title: "Voorkant van de woning", text: "Zodra de dakkapel aan de straatzijde ligt, wordt de kans op een vergunning aanzienlijk groter." },
      { title: "Bijzondere woning", text: `Voor monumenten en beschermd stadsgezicht lees je het best ook ${articleLink("dakkapel-bij-monumentale-woning", "de monumentpagina")} en ${articleLink("regels-voor-dakkapel-in-beschermd-stadsgezicht", "de pagina over beschermd stadsgezicht")}.` },
    ],
    tips: [
      "Doe altijd eerst de Vergunningcheck voordat je offertes laat uitwerken.",
      "Vraag leveranciers of zij ervaring hebben met jouw gemeente of wijk.",
      "Laat twijfelgevallen liever vroeg toetsen dan achteraf herstellen.",
      `Bekijk voor het aanvraagproces ${articleLink("omgevingsvergunning-dakkapel-aanvragen", "de uitleg over aanvragen")}.`,
    ],
    extraSections: [
      {
        id: "hoe-je-de-vergunningcheck-leest",
        title: "Hoe je de vergunningcheck slim gebruikt",
        paragraphs: [
          "Veel huiseigenaren zien de vergunningcheck als een simpele ja-of-nee test, maar in de praktijk is het vooral een routewijzer. De uitkomst helpt je te bepalen welke onderdelen extra aandacht vragen: zichtbaarheid, plaatsing, monumentstatus, afstanden tot dakranden of aanvullende lokale regels.",
          `De uitkomst van die check is het meest waardevol wanneer je hem meteen koppelt aan de artikelen over ${articleLink("vergunningsvrije-dakkapel-achterkant", "vergunningsvrij aan de achterkant")}, ${articleLink("vergunning-dakkapel-voorkant", "de voorkant van de woning")} en ${articleLink("bouwregels-dakkapel-afstand-dakrand", "afstand tot dakrand en nok")}. Dan wordt duidelijk welke aanpassing je plan eventueel nog vergunningsvrij kan houden en wanneer een aanvraag logischer is.`,
        ],
      },
      {
        id: "veelgemaakte-vergunningsfouten",
        title: "Veelgemaakte fouten rond vergunningen",
        paragraphs: [
          "De grootste fout is aannemen dat een situatie vergunningsvrij is omdat iemand in de straat al een dakkapel heeft. Vergunningen worden niet alleen op het bestaan van vergelijkbare voorbeelden beoordeeld, maar ook op exacte positie, zichtbaarheid, actuele regels en de context van het pand of gebied.",
          "Een tweede fout is te laat controleren. Zodra een offerte al is geaccepteerd of de planning al vastligt, wordt elk vergunningsprobleem duurder. Denk aan uitstel, nieuwe tekeningen of aanpassingen in maat en uitstraling die de prijs en uitvoerbaarheid opnieuw veranderen.",
        ],
        items: [
          "Te vroeg uitgaan van vergunningsvrij bouwen.",
          "Alleen naar landelijke regels kijken en lokale regels negeren.",
          "Geen rekening houden met monument, beschermd stadsgezicht of VvE.",
          "Pas na akkoord op de offerte beginnen met vergunningvragen.",
        ],
      },
      {
        id: "wanneer-je-hulp-inschakelt",
        title: "Wanneer je gemeente, leverancier of tekenaar vroeg betrekt",
        paragraphs: [
          `Bij een standaard achterdakvlak kun je vaak ver komen met een goede vergunningcheck en globale maatvoering. Maar zodra de dakkapel aan de straatzijde komt, in een gevoelig gebied ligt of duidelijk afwijkt van de standaard, is het slim om eerder specialistische hulp te betrekken. Dat kan via een leverancier die aanvraagbegeleiding biedt of via een tekenaar die de situatie goed kan uitwerken.`,
          `Die extra stap klinkt misschien als vertraging, maar voorkomt vaak juist stilstand later in het proces. Wie al weet dat het project vergunningsgevoelig is, combineert deze gids daarom het best met ${articleLink("omgevingsvergunning-dakkapel-aanvragen", "het aanvraagstappenplan")} en ${articleLink("dakkapel-vergunning-gemeente-regels", "de gemeentelijke regels")}.`,
        ],
      },
      {
        id: "invloed-op-offertes",
        title: "Hoe vergunningregels je offerte en planning beïnvloeden",
        paragraphs: [
          "Vergunningvragen zijn niet alleen een juridisch onderwerp, maar ook een directe prijsfactor. Zodra tekenwerk, extra documentatie, langere doorlooptijd of aanpassingen aan vorm en materiaal nodig zijn, verandert ook de offerte. Vooral aan de voorzijde of in beschermde situaties zie je dat leveranciers voorzichtiger begroten of extra posten opnemen voor begeleiding en afstemming.",
          `Daarom is het slim om vergunningstatus niet los te zien van kosten en planning. Wie die onderwerpen aan elkaar koppelt, vergelijkt offertes realistischer en voorkomt dat een aanvankelijk goedkope offerte later minder aantrekkelijk blijkt dan een iets hogere maar completere aanbieding.`,
        ],
      },
    ],
    faq: [
      { q: "Is een dakkapel aan de achterkant altijd vergunningsvrij?", a: "Nee, niet altijd. De ligging helpt, maar ook andere randvoorwaarden moeten kloppen." },
      { q: "Heb je voor een dakkapel aan de voorkant meestal een vergunning nodig?", a: "In de praktijk vaak wel, juist vanwege zichtbaarheid en welstand." },
      { q: "Waar controleer ik dit het beste?", a: "Via het Omgevingsloket en de gemeentelijke regels voor jouw adres." },
    ],
    related: ["wanneer-is-een-dakkapel-vergunningsvrij", "vergunning-dakkapel-voorkant", "omgevingsvergunning-dakkapel-aanvragen"],
  },
  {
    slug: "vergunningsvrije-dakkapel-achterkant",
    title: "Vergunningsvrije dakkapel achterkant",
    metaTitle: "Vergunningsvrije dakkapel aan de achterkant: wanneer mag het?",
    metaDescription:
      "Lees wanneer een dakkapel aan de achterkant van je woning vergunningsvrij kan zijn en welke voorwaarden meestal gelden.",
    intro:
      "De achterzijde van de woning is de plek waar vergunningsvrij bouwen het vaakst mogelijk is. Dat betekent niet dat alles daar automatisch mag, maar wel dat de kans groter is wanneer de maatvoering en positie binnen de randvoorwaarden blijven.",
    quickAnswer:
      "Een dakkapel aan de achterkant kan vaak vergunningsvrij zijn als hij op het juiste dakvlak ligt en voldoet aan de veelgenoemde voorwaarden voor afstand tot dakranden en nok. Controle blijft nodig.",
    tableRows: [
      ["Achterdakvlak", "Vaak kansrijk", "Controleer maatvoering en plaatsing"],
      ["Niet naar openbaar gebied gekeerd zijdakvlak", "Soms vergelijkbare ruimte", "Check gemeente en ligging goed"],
      ["Te dicht op nok of rand", "Probleemgevoelig", "Afstanden zijn belangrijk"],
      ["Monument of beschermd gebied", "Niet automatisch vergunningsvrij", "Lokale regels gaan voor"],
    ],
    factors: [
      "Achterzijde helpt, maar is geen blanco cheque.",
      "Afstanden tot nok, dakvoet en zijkanten worden vaak expliciet genoemd.",
      "Monumenten en beschermde gebieden blijven aparte gevallen.",
      "Ook bij vergunningsvrij bouwen kan een VvE of burensituatie extra aandacht vragen.",
    ],
    examples: [
      { title: "Rijwoning achtertuin", text: "Hier is vergunningsvrij vaak het eerste scenario dat wordt onderzocht." },
      { title: "Hoekwoning met zichtbaar zijdakvlak", text: "Bij een zijkant die zichtbaar is vanaf de openbare weg wordt de situatie al snel minder eenvoudig." },
      { title: "Controle blijft nodig", text: `Gebruik naast deze pagina ook ${articleLink("bouwregels-dakkapel-afstand-dakrand", "de regels rond dakranden en afstanden")}.` },
    ],
    tips: [
      "Maak eerst een simpele schets met globale maatvoering voordat je offertes aanvraagt.",
      "Vraag leveranciers of zij de vergunningcheck voor je kunnen meelopen.",
      "Bewaar de uitkomst van de check bij je offertes en correspondentie.",
    ],
    faq: [
      { q: "Is achterkant hetzelfde als vergunningsvrij?", a: "Nee. De achterkant vergroot de kans, maar de rest van de voorwaarden blijft gelden." },
      { q: "Moet ik nog steeds de vergunningcheck doen?", a: "Ja, altijd. Dat blijft de veiligste route." },
      { q: "Gelden monumenten als uitzondering?", a: "Ja, daar spelen erfgoedregels en gemeentelijke eisen vaker een rol." },
    ],
    related: ["wanneer-is-een-dakkapel-vergunningsvrij", "bouwregels-dakkapel-afstand-dakrand", "vergunning-dakkapel-regels"],
  },
  {
    slug: "vergunning-dakkapel-voorkant",
    title: "Vergunning dakkapel voorkant",
    metaTitle: "Vergunning voor een dakkapel aan de voorkant: wat moet je weten?",
    metaDescription:
      "Lees waarom een dakkapel aan de voorkant vaak vergunningplichtig is en welke aandachtspunten gemeenten belangrijk vinden.",
    intro:
      "Een dakkapel aan de voorkant van de woning raakt direct het straatbeeld. Daarom is dit precies de situatie waarin vergunning, welstand en gemeentelijke beoordeling veel vaker een rol spelen dan aan de achterzijde.",
    quickAnswer:
      "Voor een dakkapel aan de voorkant is in de praktijk vaak een vergunning nodig. De zichtbaarheid vanaf openbaar gebied maakt gemeenten en welstand kritischer op maat, vorm en uitstraling.",
    tableRows: [
      ["Voordakvlak zichtbaar vanaf straat", "Vaak vergunning nodig", "Welstand en straatbeeld tellen zwaar mee"],
      ["Gelijke kapellen in straat aanwezig", "Kan helpen", "Maar is geen automatische garantie"],
      ["Afwijkend ontwerp", "Meer kans op discussie", "Sterker afwijkend straatbeeld"],
      ["Beschermd gebied of monument", "Extra streng", "Meer documenten en langere beoordeling mogelijk"],
    ],
    factors: [
      "Welstand kijkt vaker mee bij de voorkant dan bij de achterkant.",
      "Aansluiting op bestaande kapellen in de straat kan invloed hebben op de beoordeling.",
      "De aanvraag vraagt vaker tekeningen en een duidelijke omschrijving van materiaal en kleur.",
      "De doorlooptijd kan langer worden dan veel huiseigenaren verwachten.",
    ],
    examples: [
      { title: "Woning in een uniforme straat", text: "Hier kijken gemeenten vaak extra naar herhaling van maat en uitstraling." },
      { title: "Afwijkende vorm of kleur", text: "Hoe sterker de dakkapel afwijkt, hoe belangrijker de motivatie en vormkwaliteit worden." },
      { title: "Offertetraject", text: `Vraag in deze situatie vroeg om tekeningen en bekijk ook ${articleLink("omgevingsvergunning-dakkapel-aanvragen", "hoe de aanvraag verloopt")}.` },
    ],
    tips: [
      "Check of vergelijkbare dakkapellen in de straat al een goed referentiebeeld geven.",
      "Vraag leveranciers of zij tekeningen en aanvraagondersteuning bieden.",
      "Houd rekening met extra tijd in planning en plaatsing.",
    ],
    faq: [
      { q: "Is een dakkapel aan de voorkant altijd vergunningplichtig?", a: "Niet elk geval is identiek, maar in de praktijk is een vergunning hier veel vaker nodig." },
      { q: "Helpt het als buren al een dakkapel hebben?", a: "Dat kan helpen als referentie, maar geeft geen automatische toestemming." },
      { q: "Wat kijkt de gemeente vooral na?", a: "Meestal zichtbaarheid, vorm, maat, materiaal en inpassing in het straatbeeld." },
    ],
    related: ["vergunning-dakkapel-regels", "omgevingsvergunning-dakkapel-aanvragen", "dakkapel-vergunning-gemeente-regels"],
  },
  {
    slug: "dakkapel-vergunning-gemeente-regels",
    title: "Dakkapel vergunning gemeente regels",
    metaTitle: "Dakkapel vergunning en gemeente regels: waarom lokaal verschil telt",
    metaDescription:
      "Lees waarom gemeentelijke regels bij een dakkapel belangrijk zijn en hoe lokale eisen de vergunningcheck kunnen beïnvloeden.",
    intro:
      "Veel dakkapelpagina's online geven alleen de landelijke hoofdlijnen. In de praktijk bepaalt de gemeente echter mede hoe strikt jouw plan wordt bekeken via het omgevingsplan, welstand en lokale erfgoedregels.",
    quickAnswer:
      "Gemeentelijke regels zijn belangrijk omdat ze de landelijke basiskaders in de praktijk kunnen aanscherpen. Daardoor kan een plan dat elders goed past, lokaal extra eisen krijgen of langer duren.",
    tableRows: [
      ["Landelijke regels", "Basisrichting", "Handig voor eerste oriëntatie"],
      ["Gemeentelijk omgevingsplan", "Lokale aanvulling", "Kan extra eisen of beperkingen bevatten"],
      ["Welstand", "Vooral relevant bij zichtbare situaties", "Kijkt naar uitstraling en straatbeeld"],
      ["Erfgoedregels", "Bij monumenten en beschermd gebied", "Vaak zwaardere toets"],
    ],
    factors: [
      "Niet elke gemeente beoordeelt zichtbare dakkapellen hetzelfde.",
      "Lokale voorbeelden in de straat of wijk kunnen meespelen.",
      "Documenten en tekeningen kunnen per gemeente iets verschillen.",
      "Plaatsing in monumentale of beschermde zones maakt lokaal beleid extra belangrijk.",
    ],
    examples: [
      { title: "Zelfde type woning, andere gemeente", text: "Toch kan de vergunningsroute anders uitpakken door lokale welstand of omgevingsplan." },
      { title: "Nieuwe wijk versus historisch centrum", text: "In een historisch centrum ligt de nadruk vaak veel sterker op inpassing en uitstraling." },
      { title: "Praktische voorbereiding", text: `Koppel deze pagina aan ${articleLink("vergunning-dakkapel-regels", "de algemene regels")} en ${articleLink("omgevingsvergunning-dakkapel-aanvragen", "de aanvraagstappen")}.` },
    ],
    tips: [
      "Check niet alleen landelijke blogs, maar ook de gemeentelijke informatiepagina van jouw adres.",
      "Vraag je leverancier of architect of zij ervaring hebben met jouw gemeente.",
      "Bewaar de link of uitkomst van de vergunningcheck bij je dossier.",
    ],
    faq: [
      { q: "Waarom verschillen regels per gemeente?", a: "Omdat gemeenten via het omgevingsplan en welstand lokaal extra eisen kunnen stellen." },
      { q: "Zijn landelijke regels dan niet genoeg?", a: "Wel voor de eerste oriëntatie, maar niet altijd voor de definitieve uitkomst." },
      { q: "Wanneer merk je dat verschil het meest?", a: "Bij dakkapellen aan de voorkant, bij monumenten en in beschermde gebieden." },
    ],
    related: ["vergunning-dakkapel-voorkant", "regels-voor-dakkapel-in-beschermd-stadsgezicht", "omgevingsvergunning-dakkapel-aanvragen"],
  },
  {
    slug: "dakkapel-zonder-vergunning-bouwen",
    title: "Dakkapel zonder vergunning bouwen",
    metaTitle: "Dakkapel zonder vergunning bouwen: wanneer kan dat en wat zijn de risico's?",
    metaDescription:
      "Lees wanneer een dakkapel zonder vergunning gebouwd kan worden en wat de risico's zijn als je te snel aanneemt dat het mag.",
    intro:
      "Veel mensen zoeken op dakkapel zonder vergunning bouwen omdat ze vooral tempo willen maken. Dat is begrijpelijk, maar juist dan is het belangrijk om het onderscheid tussen vergunningsvrij en vergunningloos niet te simplificeren.",
    quickAnswer:
      "Zonder vergunning bouwen kan alleen als jouw plan echt vergunningsvrij is. Wie dat te snel aanneemt, loopt het risico op aanpassingen, handhaving of extra kosten achteraf.",
    tableRows: [
      ["Vergunningsvrij plan", "Mogelijk zonder aanvraag", "Wel eerst checken en documenteren"],
      ["Twijfelgeval", "Niet starten", "Eerst uitkomst vergunningcheck afwachten"],
      ["Voorkant of monument", "Hoog risico", "Vaak vergunning nodig of extra toetsing"],
      ["Afwijkende maten", "Extra alert", "Grote kans dat randvoorwaarden worden overschreden"],
    ],
    factors: [
      "De grootste fout is starten op basis van aannames of voorbeeldsituaties van anderen.",
      "Ook leveranciers gebruiken soms grove aannames in de eerste offertefase.",
      "Documenteer de uitkomst van de vergunningcheck als onderdeel van je dossier.",
      "Bij discussie achteraf ben jij als eigenaar degene die het plan moet kunnen onderbouwen.",
    ],
    examples: [
      { title: "Snel willen plannen", text: "Huiseigenaren willen soms direct akkoord geven op een offerte zonder de vergunningcheck af te ronden." },
      { title: "Achterzijde is niet genoeg", text: "Zelfs een achterdakvlak vraagt nog steeds een inhoudelijke check." },
      { title: "Veilige route", text: `Maak daarom eerst gebruik van ${articleLink("wanneer-is-een-dakkapel-vergunningsvrij", "de vergunningsvrij-check")} voordat je tekent.` },
    ],
    tips: [
      "Start nooit op basis van alleen een mondelinge indruk of een snelle offerte-opmerking.",
      "Controleer altijd of je woning in een beschermd of monumentaal gebied ligt.",
      "Neem vergunningstatus op als aparte stap in je offerte- en plaatsingsplanning.",
    ],
    faq: [
      { q: "Mag je een dakkapel zonder vergunning bouwen?", a: "Alleen wanneer het plan daadwerkelijk vergunningsvrij is." },
      { q: "Wat is het risico als je fout zit?", a: "Dan kunnen aanpassingen, vertraging of handhaving volgen." },
      { q: "Is een offerte van een specialist genoeg als bewijs?", a: "Nee, de vergunningcheck en de officiële regels blijven leidend." },
    ],
    related: ["wanneer-is-een-dakkapel-vergunningsvrij", "vergunning-dakkapel-regels", "omgevingsvergunning-dakkapel-aanvragen"],
  },
  {
    slug: "wanneer-is-een-dakkapel-vergunningsvrij",
    title: "Wanneer is een dakkapel vergunningsvrij?",
    metaTitle: "Wanneer is een dakkapel vergunningsvrij? Uitleg per situatie",
    metaDescription:
      "Lees wanneer een dakkapel vergunningsvrij kan zijn en welke voorwaarden meestal terugkomen in openbare vergunninginformatie.",
    intro:
      "Dit is de praktische vraag achter bijna elke dakkapelvergunning. De uitkomst draait meestal om plaatsing, zichtbaarheid en de bekende randvoorwaarden rond dakranden en nok.",
    quickAnswer:
      "Een dakkapel is vooral vergunningsvrij in situaties waar hij minder invloed heeft op het openbare straatbeeld en binnen de gebruikelijke randvoorwaarden voor maat en positie blijft.",
    tableRows: [
      ["Achterdakvlak", "Vaak gunstiger", "Controleer alle maatvoorwaarden"],
      ["Niet-openbare zijkant", "Soms mogelijk", "Afhankelijk van ligging en zichtbaarheid"],
      ["Voordakvlak", "Vaak ongunstig", "Grotere kans op vergunningplicht"],
      ["Monument of beschermd gebied", "Altijd extra check", "Lokale regels kunnen leidend zijn"],
    ],
    factors: [
      "Plaatsing ten opzichte van dakvoet, nok en zijkanten is cruciaal.",
      "Zichtbaarheid vanaf openbaar gebied bepaalt vaak de richting van de uitkomst.",
      "De status van de woning kan doorslaggevend zijn.",
      "Ook vergunningsvrije plannen moeten technisch verantwoord zijn.",
    ],
    examples: [
      { title: "Reguliere achterzijde", text: "Hier begint de vergunningcheck vaak met een positief uitgangspunt." },
      { title: "Historische wijk", text: "Zelfs bij een achterzijde kan lokale bescherming extra regels activeren." },
      { title: "Concrete maatvoering", text: `Gebruik ook ${articleLink("bouwregels-dakkapel-afstand-dakrand", "de pagina over afstanden en dakranden")} om de randvoorwaarden beter te begrijpen.` },
    ],
    tips: [
      "Meet je dakvlak globaal op voordat je de check doet.",
      "Koppel de uitkomst meteen terug aan de leverancier of adviseur.",
      "Ga niet uit van algemene forums of voorbeelden van anderen als vervanging van de check.",
    ],
    faq: [
      { q: "Is een dakkapel aan de achterkant meestal vergunningsvrij?", a: "Dat is vaak de gunstigste situatie, maar het blijft afhankelijk van de randvoorwaarden." },
      { q: "Speelt de breedte de hoofdrol?", a: "Breedte telt mee, maar de positie op het dak en de zichtbaarheid zijn minstens zo belangrijk." },
      { q: "Kan een monument vergunningsvrij zijn?", a: "Bij monumenten is extra controle vrijwel altijd nodig en ligt de lat meestal hoger." },
    ],
    related: ["vergunningsvrije-dakkapel-achterkant", "bouwregels-dakkapel-afstand-dakrand", "dakkapel-bij-monumentale-woning"],
  },
  {
    slug: "omgevingsvergunning-dakkapel-aanvragen",
    title: "Omgevingsvergunning dakkapel aanvragen",
    metaTitle: "Omgevingsvergunning voor een dakkapel aanvragen: stappenplan",
    metaDescription:
      "Lees hoe het aanvragen van een omgevingsvergunning voor een dakkapel meestal verloopt en welke stukken vaak nodig zijn.",
    intro:
      "Als blijkt dat je plan niet vergunningsvrij is, verschuift de aandacht van ontwerp en prijs naar voorbereiding en dossieropbouw. Een goede aanvraag voorkomt onnodige vertraging en extra vragen van de gemeente.",
    quickAnswer:
      "Een omgevingsvergunning voor een dakkapel vraag je aan via het Omgevingsloket. Reken op een traject waarin maatvoering, tekeningen, situering, materiaal en soms constructieve onderbouwing belangrijk zijn.",
    tableRows: [
      ["Vergunningcheck", "Eerste stap", "Bevestigt of een aanvraag nodig lijkt"],
      ["Tekeningen en stukken", "Vaak noodzakelijk", "Afhankelijk van plan en gemeente"],
      ["Indienen via Omgevingsloket", "Formele aanvraag", "Zorg voor complete invoer"],
      ["Beoordeling door gemeente", "Doorlooptijd wisselt", "Vragen of aanvullingen zijn mogelijk"],
    ],
    factors: [
      "Onvolledige stukken vertragen de aanvraag sneller dan veel mensen denken.",
      "Aan de voorzijde of in beschermd gebied wordt uitstraling extra belangrijk.",
      "Ook materiaal, kleur en detaillering kunnen onderdeel van de beoordeling zijn.",
      "Vraag vroeg wie de aanvraag begeleidt: jij, de aannemer of een tekenbureau.",
    ],
    examples: [
      { title: "Leverancier regelt mee", text: "Sommige dakkapelaanbieders bieden tekenwerk en indiening als extra dienst aan." },
      { title: "Eigen aanvraag", text: "Doe je het zelf, zorg dan dat de offerte en tekeninginhoud op elkaar aansluiten." },
      { title: "Langere planning", text: `Koppel de aanvraag daarom aan ${articleLink("dakkapel-laten-plaatsen", "je totale plaatsingsplanning")}.` },
    ],
    tips: [
      "Start op tijd; een vergunningstraject hoort in je planning vóór de montagedatum.",
      "Vraag leveranciers welke stukken zij standaard leveren.",
      "Controleer of een constructeur nodig kan zijn en neem dit mee in budget en timing.",
    ],
    faq: [
      { q: "Waar vraag ik een dakkapelvergunning aan?", a: "Via het Omgevingsloket." },
      { q: "Welke stukken zijn vaak nodig?", a: "Vaak tekeningen, situatietekening, omschrijving van materiaal en soms constructieve informatie." },
      { q: "Kan de aannemer dit regelen?", a: "Ja, sommige leveranciers bieden begeleiding of complete aanvraagondersteuning." },
    ],
    related: ["vergunning-dakkapel-regels", "vergunning-dakkapel-voorkant", "dakkapel-laten-plaatsen"],
  },
  {
    slug: "bouwregels-dakkapel-afstand-dakrand",
    title: "Bouwregels dakkapel afstand dakrand",
    metaTitle: "Bouwregels dakkapel: afstand tot dakrand, nok en zijkanten",
    metaDescription:
      "Lees welke afstanden tot dakrand, dakvoet en nok vaak worden genoemd bij vergunningsvrij bouwen van een dakkapel.",
    intro:
      "Afstanden tot dakrand, dakvoet en nok zijn precies de technische details waar vergunningsvragen vaak op vastlopen. Ze lijken klein, maar zijn in de praktijk doorslaggevend.",
    quickAnswer:
      "Openbare vergunninginformatie noemt vaak minimale afstanden tot zijkanten en nok en een beperkte zone boven de dakvoet. Wie daarbuiten komt, loopt sneller richting vergunningplicht of planwijziging.",
    tableRows: [
      ["Zijkanten van het dakvlak", "Vaak minimaal 0,5 meter", "Controleer of jouw dakvorm uitzonderingen kent"],
      ["Bovenzijde onder de nok", "Vaak minimaal 0,5 meter vrijhouden", "Belangrijk voor het dakbeeld"],
      ["Onderzijde boven de dakvoet", "Vaak in een begrensde zone", "Controleer de actuele randvoorwaarden"],
      ["Afwijkende vorm of verlegde nok", "Meer risico", "Vraagt sneller om extra toetsing"],
    ],
    factors: [
      "De exacte betekenis van dakrand en dakvoet moet goed op jouw dak worden toegepast.",
      "Bij oude of complexe daken zijn metingen minder vanzelfsprekend dan bij standaardwoningen.",
      "Grote breedtes vergroten de kans dat je tegen randvoorwaarden aanloopt.",
      "Bij twijfel is een schets met maatvoering veel waardevoller dan gokken.",
    ],
    examples: [
      { title: "Nok te dichtbij", text: "Zelfs een verder logisch plan kan hierdoor uit de vergunningsvrije sfeer vallen." },
      { title: "Te weinig ruimte aan de zijkant", text: "Dit speelt vooral bij smallere dakvlakken of hoekwoningen." },
      { title: "Maatvoering eerst", text: `Combineer deze regels altijd met ${articleLink("wanneer-is-een-dakkapel-vergunningsvrij", "de vergunningsvrij-pagina")}.` },
    ],
    tips: [
      "Laat een leverancier of tekenaar de maatvoering controleren als je dicht op de grens zit.",
      "Gebruik deze regels niet los van de volledige vergunningcheck.",
      "Bewaar je maatvoering samen met offertes en eventuele tekeningen.",
    ],
    faq: [
      { q: "Zijn de afstanden overal hetzelfde?", a: "De veelgenoemde landelijke randvoorwaarden geven richting, maar lokale regels kunnen aanvullend zijn." },
      { q: "Waarom zijn deze afstanden zo belangrijk?", a: "Omdat ze bepalen of een plan nog binnen de vergunningsvrije voorwaarden valt." },
      { q: "Wat doe ik bij twijfel?", a: "Laat de maatvoering controleren en voer altijd de officiële vergunningcheck uit." },
    ],
    related: ["wanneer-is-een-dakkapel-vergunningsvrij", "vergunningsvrije-dakkapel-achterkant", "vergunning-dakkapel-regels"],
  },
  {
    slug: "dakkapel-bij-monumentale-woning",
    title: "Dakkapel bij monumentale woning",
    metaTitle: "Dakkapel bij monumentale woning: regels, aandachtspunten en voorbereiding",
    metaDescription:
      "Lees waar je op moet letten bij een dakkapel op een monumentale woning en waarom voorbereiding hier extra belangrijk is.",
    intro:
      "Bij monumentale woningen verschuift de discussie van standaard prijs en plaatsing naar behoud van karakter, erfgoedregels en zorgvuldige afstemming met de gemeente. Daardoor is dit een heel andere opgave dan bij een standaard rijwoning.",
    quickAnswer:
      "Voor een dakkapel bij een monumentale woning is vrijwel altijd extra toetsing nodig. Erfgoed en uitstraling wegen hier veel zwaarder mee, en een vergunningtraject ligt vaak voor de hand.",
    tableRows: [
      ["Monumentstatus", "Extra zwaarwegend", "Erfgoedbelang staat centraal"],
      ["Materiaal en uitstraling", "Sterk beoordeeld", "Aansluiting op bestaand beeld is belangrijk"],
      ["Vergunningtraject", "Vaak noodzakelijk", "Richt je op zorgvuldige voorbereiding"],
      ["Levertijd en planning", "Langzamer", "Meer afstemming en tekenwerk mogelijk"],
    ],
    factors: [
      "De cultuurhistorische waarde van het pand speelt een grote rol.",
      "Opvallende of moderne ingrepen passen niet altijd in de beoordeling.",
      "Detaillering, materiaal en positie worden strenger bekeken dan bij standaardwoningen.",
      "Vraag vroeg of een gespecialiseerd teken- of erfgoedbureau nuttig is.",
    ],
    examples: [
      { title: "Historisch pand in binnenstad", text: "Hier is de kans groot dat zowel vorm als materiaalkeuze uitgebreid wordt beoordeeld." },
      { title: "Behouden van karakter", text: "Vaak is een subtiele oplossing kansrijker dan een grote, opvallende kapel." },
      { title: "Planning", text: `Neem voor dit soort trajecten extra tijd in de ${articleLink("omgevingsvergunning-dakkapel-aanvragen", "vergunningsplanning")}.` },
    ],
    tips: [
      "Verzamel vroeg referentiebeelden, tekeningen en bestaande gevelinformatie.",
      "Werk met leveranciers die ervaring hebben met monumentale panden.",
      "Laat prijs, vergunning en ontwerp niet los van elkaar beoordelen.",
    ],
    faq: [
      { q: "Heb je bij een monument sneller een vergunning nodig?", a: "Ja, in de praktijk vrijwel altijd extra toetsing en vaak een vergunning." },
      { q: "Kan modern materiaal een probleem zijn?", a: "Dat kan, als het te veel afwijkt van het karakter van het pand." },
      { q: "Waarom duurt dit traject langer?", a: "Omdat ontwerp, erfgoed en vergunning sterker op elkaar ingrijpen." },
    ],
    related: ["regels-voor-dakkapel-in-beschermd-stadsgezicht", "omgevingsvergunning-dakkapel-aanvragen", "hoe-kies-je-een-goede-dakkapel-specialist"],
  },
  {
    slug: "regels-voor-dakkapel-in-beschermd-stadsgezicht",
    title: "Regels voor dakkapel in beschermd stadsgezicht",
    metaTitle: "Dakkapel in beschermd stadsgezicht: regels en aandachtspunten",
    metaDescription:
      "Lees welke regels en aandachtspunten gelden voor een dakkapel in beschermd stadsgezicht en waarom lokale toetsing belangrijk is.",
    intro:
      "Een beschermd stadsgezicht betekent niet automatisch dat niets mag, maar wel dat de omgeving en beeldkwaliteit veel zwaarder meewegen. Daardoor zit hier vaak meer nuance in dan op algemene vergunningpagina's.",
    quickAnswer:
      "Bij een dakkapel in beschermd stadsgezicht is extra controle nodig. De gemeente kijkt doorgaans scherper naar zichtbaarheid, materiaal, vorm en samenhang met de omgeving.",
    tableRows: [
      ["Achterdakvlak uit zicht", "Soms gunstiger", "Maar nog steeds goed checken"],
      ["Voordakvlak", "Vaak kritisch", "Straatbeeld weegt zwaar mee"],
      ["Niet-monument in beschermd gebied", "Nog steeds extra toetsing", "Gebiedsbescherming telt mee"],
      ["Monument in beschermd gebied", "Meest gevoelig", "Erfgoed en gebiedsbescherming stapelen op"],
    ],
    factors: [
      "Beschermd stadsgezicht draait sterk om samenhang en beeldkwaliteit.",
      "Lokale richtlijnen kunnen per gemeente sterk verschillen.",
      "Zelfs wanneer iets technisch kan, kan de vormgeving alsnog discussie opleveren.",
      "Vergelijkbare voorbeelden in de buurt geven soms nuttige richting, maar geen zekerheid.",
    ],
    examples: [
      { title: "Binnenstedelijk dakvlak", text: "Kleine verschillen in zichtlijn of materiaal kunnen dan al belangrijk zijn." },
      { title: "Niet-zichtbare achterzijde", text: "Ook daar blijft controle nodig, maar de kans op ruimte is soms groter." },
      { title: "Praktische aanpak", text: `Koppel deze pagina aan ${articleLink("dakkapel-vergunning-gemeente-regels", "gemeentelijke regels")} voor een realistischer beeld.` },
    ],
    tips: [
      "Vraag specifiek of jouw adres in beschermd stadsgezicht valt en wat dat praktisch betekent.",
      "Laat materiaal en kleur niet pas laat in het traject open.",
      "Werk met een partij die ervaring heeft met vergunningsgevoelige situaties.",
    ],
    faq: [
      { q: "Is een dakkapel in beschermd stadsgezicht altijd verboden?", a: "Nee, maar de lat ligt vaak hoger en extra toetsing is gebruikelijk." },
      { q: "Speelt de zichtbaarheid vanaf de straat hier extra mee?", a: "Ja, juist dat is meestal een belangrijk beoordelingspunt." },
      { q: "Moet ik altijd bij de gemeente checken?", a: "Ja, zonder lokale check is de kans op verkeerde aannames groot." },
    ],
    related: ["dakkapel-bij-monumentale-woning", "dakkapel-vergunning-gemeente-regels", "vergunning-dakkapel-voorkant"],
  },
].forEach(buildPermitGuide);

[
  {
    slug: "soorten-dakkapellen",
    title: "Soorten dakkapellen uitgelegd",
    metaTitle: "Soorten dakkapellen uitgelegd: complete gids voor materiaal, vorm en uitvoering",
    metaDescription:
      "Ontdek welke soorten dakkapellen er zijn en hoe prefab, traditioneel, materiaal en dakvorm de keuze beïnvloeden.",
    intro:
      "Wie op zoek is naar een dakkapel ontdekt snel dat 'soort' meerdere dingen tegelijk kan betekenen: bouwmethode, materiaal, dakvorm of extra opties. Die mix maakt vergelijken lastig, maar ook belangrijk.",
    quickAnswer:
      "De belangrijkste keuzes zijn meestal prefab of traditioneel, daarna materiaal zoals kunststof, hout of polyester, en pas daarna specifieke uitvoeringen zoals een plat dak of rolluiken.",
    costLink: "wat-kost-een-dakkapel",
    compareLink: "prefab-of-traditionele-dakkapel",
    tableRows: [
      ["Bouwmethode", "Prefab of traditioneel", "Bepaalt vaak prijs, snelheid en maatwerk"],
      ["Materiaal", "Kunststof, hout of polyester", "Beïnvloedt uitstraling en onderhoud"],
      ["Dakvorm", "Plat of schuin", "Heeft effect op uiterlijk en detaillering"],
      ["Extra opties", "Rolluiken, ventilatie, kleur", "Verfijnt comfort en gebruiksgemak"],
    ],
    factors: [
      "Bouwmethode bepaalt de route; materiaal verfijnt daarna de keuze.",
      "Niet elke materiaalsoort past even logisch bij elke woningstijl.",
      "Dakvorm en rolluiken zijn vaak keuzes die later in het traject concreet worden.",
      "De goedkoopste soort is niet automatisch de beste voor uitstraling of onderhoud.",
    ],
    examples: [
      { title: "Prijsgedreven keuze", text: `Dan start de vergelijking meestal bij ${articleLink("prefab-dakkapel", "prefab")}.` },
      { title: "Karaktervolle woning", text: `Dan wegen ${articleLink("houten-dakkapel", "hout")} en ${articleLink("traditionele-dakkapel", "traditioneel bouwen")} vaak zwaarder.` },
      { title: "Onderhoudsarm wonen", text: `Dan komen ${articleLink("kunststof-dakkapel", "kunststof")} en ${articleLink("polyester-dakkapel", "polyester")} sneller in beeld.` },
    ],
    tips: [
      "Begin niet met alle opties tegelijk; kies eerst bouwmethode, daarna materiaal en details.",
      "Laat een leverancier uitleggen wat in jouw woning technisch en esthetisch logisch is.",
      "Vergelijk soorten altijd naast de kosten en het onderhoud op langere termijn.",
    ],
    extraSections: [
      {
        id: "volgorde-van-kiezen",
        title: "De slimste volgorde om een soort dakkapel te kiezen",
        paragraphs: [
          "Veel mensen proberen alle keuzes in één keer te maken en raken daardoor juist het overzicht kwijt. Praktischer is om eerst de grote richting te bepalen: wil je vooral snelheid en voorspelbaarheid, of juist maatwerk en een specifieke uitstraling? Daarmee kom je vanzelf uit bij prefab of traditioneel als eerste hoofdkeuze.",
          `Pas daarna wordt de materiaalvraag echt relevant. ${articleLink("kunststof-dakkapel", "Kunststof")}, ${articleLink("houten-dakkapel", "hout")} en ${articleLink("polyester-dakkapel", "polyester")} zijn geen losse werelden, maar verfijnen de route die je al hebt gekozen. Tot slot kijk je naar model- en comfortkeuzes zoals ${articleLink("dakkapel-met-plat-dak", "plat dak")}, ${articleLink("dakkapel-met-schuin-dak", "schuin dak")} en ${articleLink("dakkapel-met-rolluiken", "rolluiken")}.`,
        ],
      },
      {
        id: "welke-soort-past-bij-welke-woning",
        title: "Welke soort past vaak bij welke woning",
        paragraphs: [
          "Bij rijwoningen en standaard achterdakvlakken zie je vaak dat prefab en onderhoudsarme materialen het sterkst scoren. Het dak is goed bereikbaar, de maatvoering is redelijk voorspelbaar en de combinatie van prijs en snelheid weegt zwaar.",
          "Bij oudere woningen, karaktervolle gevels of zichtbare straatzijden verschuift de afweging vaak. Daar worden traditionele bouw, houtlook of subtielere detaillering interessanter, juist omdat uitstraling dan meer invloed heeft op de uiteindelijke tevredenheid dan het laagste prijskaartje.",
        ],
        items: [
          "Rijwoning achterzijde: vaak prefab en onderhoudsarm.",
          "Karakteristieke woning: vaker maatwerk en uitstralinggericht.",
          "Gezinsuitbreiding op zolder: breedte en binnenafwerking worden belangrijker dan alleen materiaal.",
          "Lang in woning blijven: onderhoud en levensduur tellen zwaarder mee.",
        ],
      },
      {
        id: "veelgemaakte-keuzefouten",
        title: "Veelgemaakte keuzefouten bij soorten dakkapellen",
        paragraphs: [
          "Een veelgemaakte fout is te vroeg focussen op een materiaal omdat het online vaak genoemd wordt als beste keuze. In werkelijkheid hangt de beste keuze af van je woningtype, onderhoudswens, budget en de mate waarin uitstraling zichtbaar is vanaf straat of tuin.",
          `Een tweede fout is comfortdetails pas heel laat bespreken. Zaken als zonwering, ventilatie, raamindeling en binnenafwerking hebben minder impact op SEO-termen, maar in het echte gebruik juist veel invloed op hoe tevreden je later bent met de dakkapel.`,
        ],
      },
      {
        id: "van-keuze-naar-offerte",
        title: "Van shortlist naar een bruikbare offerteaanvraag",
        paragraphs: [
          "Zodra je weet welke soorten voor jouw woning kansrijk zijn, hoef je niet elke mogelijke variant meer te laten offreren. Beter is het om een kleine shortlist te maken: bijvoorbeeld één onderhoudsarme route, één maatwerkroute en eventueel één alternatief als referentie. Zo worden de verschillen in prijs en inhoud veel duidelijker.",
          `Die aanpak voorkomt dat je verdwaalt in tientallen details tegelijk. In de offertefase wil je namelijk vooral zien hoe bouwmethode, materiaal en afwerking doorwerken in planning, garantie en oplevering. Dat maakt de stap van keuzehulp naar concrete beslissing een stuk rustiger.`,
        ],
      },
      {
        id: "welke-soort-past-bij-budget",
        title: "Welke soort past vaak bij welk budgetprofiel",
        paragraphs: [
          "Bij een budgetgerichte aanpak ligt de focus vaak op een onderhoudsarme prefab dakkapel met een vrij standaard kozijnindeling. Dat geeft veel huiseigenaren een duidelijk startpunt en houdt de offerte beter voorspelbaar.",
          "Wie meer ruimte ziet voor maatwerk, uitstraling of een specifieke afwerkingswens, schuift sneller op richting traditionele bouw, hout of luxere detaillering. Het belangrijkste is niet om meteen maximaal te kiezen, maar om helder te hebben waarom een duurdere route in jouw geval wel of niet waarde toevoegt.",
        ],
      },
    ],
    faq: [
      { q: "Wat zijn de belangrijkste soorten dakkapellen?", a: "Meestal kijk je eerst naar prefab of traditioneel en daarna naar materiaal en uitvoering." },
      { q: "Is prefab ook een soort dakkapel?", a: "Ja, dat is een bouwmethode die veel invloed heeft op prijs en plaatsingssnelheid." },
      { q: "Wanneer kies je vooral op materiaal?", a: "Als onderhoud, uitstraling en levensduur voor jou belangrijke verschillen maken." },
    ],
    related: ["prefab-dakkapel", "kunststof-dakkapel", "prefab-of-traditionele-dakkapel", "wat-kost-een-dakkapel"],
  },
  {
    slug: "prefab-dakkapel",
    title: "Prefab dakkapel",
    metaTitle: "Prefab dakkapel: voordelen, nadelen en wanneer het slim is",
    metaDescription:
      "Lees wat een prefab dakkapel precies is, wanneer prefab slim is en hoe deze keuze scoort op prijs en plaatsingssnelheid.",
    intro:
      "Een prefab dakkapel wordt grotendeels in de fabriek voorbereid en daarna op locatie geplaatst. Daardoor verschuift veel werk van de bouwplaats naar het productieproces.",
    quickAnswer:
      "Prefab is vooral interessant wanneer snelheid, voorspelbaarheid en een scherpe prijs belangrijk zijn. Het systeem past het best bij standaardmaten en goed bereikbare daken.",
    costLink: "prefab-dakkapel-kosten",
    compareLink: "prefab-of-traditionele-dakkapel",
    tableRows: [
      ["Productie", "Grotendeels in fabriek", "Minder werk op locatie"],
      ["Plaatsing", "Vaak snel", "Soms in één dag geplaatst"],
      ["Maatwerk", "Beperkter dan traditioneel", "Afhankelijk van systeem en leverancier"],
      ["Prijsniveau", "Vaak gunstig", "Vooral bij standaardmaten"],
    ],
    factors: [
      "Prefab werkt het best wanneer de situatie goed voorspelbaar is.",
      "Bij ingewikkelde daken of afwijkende vormen kan maatwerk belangrijker worden.",
      "Snelle plaatsing betekent niet automatisch dat het hele traject ook kort is; vergunningen en voorbereiding blijven tellen.",
      "Vraag altijd hoe compleet het prefab element wordt geleverd.",
    ],
    examples: [
      { title: "Standaard achterzijde", text: "Hier scoort prefab vaak het sterkst op prijs en snelheid." },
      { title: "Beperkt maatwerk nodig", text: "Dan is prefab vaak ruim voldoende." },
      { title: "Complexe woning", text: `Twijfel je, vergelijk dan altijd met ${articleLink("traditionele-dakkapel", "traditioneel bouwen")}.` },
    ],
    tips: [
      "Vraag leveranciers hoe lang de productietijd is naast de montagedag zelf.",
      "Controleer of binnenafwerking en kozijnindeling bij het prefab pakket horen.",
      "Bekijk garantie en detailafwerking minstens zo kritisch als de prijs.",
    ],
    faq: [
      { q: "Wat is het grootste voordeel van prefab?", a: "Snelheid en voorspelbaarheid, vaak in combinatie met een scherpe prijs." },
      { q: "Is prefab altijd binnen één dag klaar?", a: "De plaatsing zelf vaak wel, maar voorbereiding en afwerking kosten ook tijd." },
      { q: "Wanneer is prefab minder logisch?", a: "Bij veel maatwerk, bijzondere dakvormen of specifieke esthetische wensen." },
    ],
    related: ["prefab-dakkapel-kosten", "dakkapel-in-1-dag-plaatsen", "prefab-of-traditionele-dakkapel"],
  },
  {
    slug: "traditionele-dakkapel",
    title: "Traditionele dakkapel",
    metaTitle: "Traditionele dakkapel: wanneer kies je voor maatwerk?",
    metaDescription:
      "Lees wat een traditionele dakkapel is en wanneer maatwerk, uitstraling en flexibiliteit zwaarder wegen dan plaatsingssnelheid.",
    intro:
      "Een traditionele dakkapel wordt in hoofdzaak op locatie opgebouwd. Daardoor is de aanpak flexibeler en vaak beter te sturen op maatwerk en uitstraling.",
    quickAnswer:
      "Traditioneel bouwen is vooral interessant wanneer standaard prefab niet goed past, of wanneer uitstraling, maatwerk en detaillering voorrang hebben op pure snelheid.",
    costLink: "traditionele-dakkapel-kosten",
    compareLink: "prefab-of-traditionele-dakkapel",
    tableRows: [
      ["Opbouw", "Op locatie", "Meer vrijheid in uitvoering"],
      ["Snelheid", "Lager dan prefab", "Meer bouwtijd op locatie"],
      ["Maatwerk", "Hoog", "Sterk bij afwijkende situaties"],
      ["Prijsniveau", "Gemiddeld tot hoog", "Meer arbeid betekent hogere kosten"],
    ],
    factors: [
      "Traditioneel is sterker wanneer ontwerpvrijheid centraal staat.",
      "De langere bouwtijd betekent ook meer overlast en planning.",
      "Niet elke situatie vraagt om maatwerk; soms betaalt prefab zich beter uit.",
      "De uitvoerende partij maakt veel uit voor kwaliteit en detaillering.",
    ],
    examples: [
      { title: "Bijzondere dakvorm", text: "Traditioneel wordt gekozen als een standaard fabrieksmodule niet goed past." },
      { title: "Klassieke uitstraling", text: "Bij karakteristieke woningen sluit traditioneel vaak mooier aan." },
      { title: "Prijsafweging", text: `Vergelijk dit altijd direct met ${articleLink("prefab-dakkapel", "prefab")} en ${articleLink("prefab-of-traditionele-dakkapel", "de keuzehulp")}.` },
    ],
    tips: [
      "Vraag referentieprojecten op die lijken op jouw woningtype.",
      "Controleer welke afwerking standaard is en wat meerwerk wordt.",
      "Neem bouwtijd en overlast mee in je afweging, niet alleen prijs.",
    ],
    faq: [
      { q: "Wanneer kies je voor traditioneel?", a: "Vooral wanneer maatwerk en uitstraling belangrijk zijn." },
      { q: "Is traditioneel altijd duurder?", a: "Vaak wel, maar het hangt af van maatwerk en afwerking." },
      { q: "Is traditioneel beter dan prefab?", a: "Niet per se; het is vooral anders en geschikter voor andere situaties." },
    ],
    related: ["traditionele-dakkapel-kosten", "prefab-of-traditionele-dakkapel", "hoe-kies-je-een-goede-dakkapel-specialist"],
  },
  {
    slug: "kunststof-dakkapel",
    title: "Kunststof dakkapel",
    metaTitle: "Kunststof dakkapel: voordelen, nadelen en wanneer het slim is",
    metaDescription:
      "Lees waarom een kunststof dakkapel populair is en hoe kunststof scoort op onderhoud, prijs en uitstraling.",
    intro:
      "Kunststof is voor veel huiseigenaren de standaardkeuze geworden. Het materiaal staat bekend om het lage onderhoud en de relatief voorspelbare prijs.",
    quickAnswer:
      "Een kunststof dakkapel is vooral aantrekkelijk wanneer je een onderhoudsarme oplossing zoekt met een gunstige prijs-kwaliteitverhouding.",
    costLink: "kunststof-dakkapel-kosten",
    compareLink: "kunststof-of-houten-dakkapel",
    tableRows: [
      ["Onderhoud", "Laag", "Vaak vooral schoonmaken en controleren"],
      ["Prijsniveau", "Gunstig tot gemiddeld", "Populair in vergelijking met hout"],
      ["Uitstraling", "Modern en strak", "Afhankelijk van kleur en profilering"],
      ["Levensduur", "Goed", "Vooral interessant bij regelmatig basisonderhoud"],
    ],
    factors: [
      "Kunststof is niet automatisch de goedkoopste in elke luxe uitvoering.",
      "Kleuren en profielen bepalen of het materiaal modern of klassiek oogt.",
      "Het onderhoudsvoordeel maakt het verschil groter naarmate je langer in de woning blijft.",
      "Niet elke leverancier bedoelt precies hetzelfde met kunststof opbouw.",
    ],
    examples: [
      { title: "Onderhoudsarm gezinshuis", text: "Hier is kunststof vaak de meest logische balans tussen prijs en gebruiksgemak." },
      { title: "Strakke nieuwbouw", text: "Kunststof sluit vaak goed aan bij moderne gevels en kozijnlijnen." },
      { title: "Vergelijking met hout", text: `Twijfel je, bekijk dan ${articleLink("kunststof-of-houten-dakkapel", "de vergelijking kunststof of hout")}.` },
    ],
    tips: [
      "Vraag naar afwerking, kleurvastheid en garantie op geveldelen.",
      "Controleer hoe de leverancier omgaat met rubbers, hang- en sluitwerk en schoonmaakadvies.",
      "Neem ook levensduur en onderhoud mee in je offertevergelijking.",
    ],
    faq: [
      { q: "Waarom is kunststof zo populair?", a: "Vooral vanwege het beperkte onderhoud en de gunstige prijs-kwaliteitverhouding." },
      { q: "Past kunststof alleen bij moderne huizen?", a: "Nee, maar de juiste kleur en profilering zijn dan extra belangrijk." },
      { q: "Moet kunststof geschilderd worden?", a: "Normaal gesproken niet." },
    ],
    related: ["kunststof-dakkapel-kosten", "kunststof-of-houten-dakkapel", "onderhoud-kunststof-dakkapel"],
  },
  {
    slug: "houten-dakkapel",
    title: "Houten dakkapel",
    metaTitle: "Houten dakkapel: uitstraling, onderhoud en wanneer hout slim is",
    metaDescription:
      "Lees wanneer een houten dakkapel de beste keuze is en hoe hout zich verhoudt tot kunststof op uitstraling en onderhoud.",
    intro:
      "Hout blijft populair bij woningen waar uitstraling en detaillering zwaar wegen. Het materiaal oogt vaak warmer en klassieker dan kunststof, maar vraagt ook meer aandacht.",
    quickAnswer:
      "Een houten dakkapel is vooral interessant wanneer je karakter, detaillering en aansluiting op bestaande kozijnen belangrijker vindt dan minimaal onderhoud.",
    costLink: "houten-dakkapel-kosten",
    compareLink: "kunststof-of-houten-dakkapel",
    tableRows: [
      ["Uitstraling", "Warm en klassiek", "Past goed bij karaktervolle woningen"],
      ["Onderhoud", "Hoger", "Regelmatige controle en schilderwerk nodig"],
      ["Prijsniveau", "Gemiddeld tot hoog", "Meestal hoger dan basis kunststof"],
      ["Flexibiliteit", "Goed", "Sterk in detaillering en maatwerk"],
    ],
    factors: [
      "Hout vraagt meer onderhoud maar geeft vaak een rijkere uitstraling.",
      "De kwaliteit van het schilderwerk bepaalt mede hoe lang het mooi blijft.",
      "Bij klassieke gevels sluit hout esthetisch vaak beter aan.",
      "Kies je voor hout, dan moet je het onderhoud bewust meenemen in je planning.",
    ],
    examples: [
      { title: "Jaren-30 uitstraling", text: "Hout wordt vaak gekozen om de bestaande stijl van een woning te respecteren." },
      { title: "Meer onderhoud, meer karakter", text: "Voor sommige huiseigenaren is dat een prima afweging." },
      { title: "Vergelijking", text: `Bekijk ook ${articleLink("kunststof-dakkapel", "kunststof")} en ${articleLink("kunststof-of-houten-dakkapel", "de directe vergelijking")}.` },
    ],
    tips: [
      "Vraag naar houtsoort, voorbehandeling en eerste onderhoudsmoment.",
      "Leg vast wie verantwoordelijk is voor schilderwerk en controle na oplevering.",
      "Combineer hout liefst met een realistische meerjarenplanning voor onderhoud.",
    ],
    faq: [
      { q: "Waarom kiezen mensen voor hout?", a: "Vooral voor uitstraling, detaillering en aansluiting op klassieke woningen." },
      { q: "Is hout altijd duurder?", a: "Vaak wel iets, zeker als onderhoud wordt meegerekend." },
      { q: "Kan hout ook onderhoudsarm zijn?", a: "Nooit zo onderhoudsarm als kunststof, maar goede afwerking helpt wel." },
    ],
    related: ["houten-dakkapel-kosten", "onderhoud-houten-dakkapel", "kunststof-of-houten-dakkapel"],
  },
  {
    slug: "polyester-dakkapel",
    title: "Polyester dakkapel",
    metaTitle: "Polyester dakkapel: eigenschappen, prijsniveau en onderhoud",
    metaDescription:
      "Lees wat een polyester dakkapel is en hoe polyester scoort op onderhoud, prijs en levensduur.",
    intro:
      "Polyester wordt vaak gekozen door huiseigenaren die een strakke, onderhoudsarme dakkapel willen. Het materiaal zie je regelmatig terug in prefab-concepten met weinig zichtbare naden.",
    quickAnswer:
      "Een polyester dakkapel is vooral interessant voor wie onderhoudsarm wil bouwen en een strakke afwerking zoekt, maar bereid is iets meer te betalen dan voor de eenvoudigste kunststof basisopties.",
    costLink: "polyester-dakkapel-kosten",
    compareLink: "kunststof-dakkapel",
    tableRows: [
      ["Onderhoud", "Laag", "Weinig schilderwerk nodig"],
      ["Afwerking", "Strak", "Vaak weinig naden zichtbaar"],
      ["Prijsniveau", "Middensegment tot hoger", "Meerprijs t.o.v. basis kunststof komt vaak voor"],
      ["Gebruik", "Vaak prefab", "Maar systeem verschilt per leverancier"],
    ],
    factors: [
      "Polyester wordt gewaardeerd om de nette afwerking en het beperkte onderhoud.",
      "De exacte opbouw kan verschillen per leverancier.",
      "Prijs en systeem hangen sterk samen; vergelijk dus niet alleen op materiaalnaam.",
      "Controleer hoe afwatering en detaillering zijn opgelost bij het gekozen systeem.",
    ],
    examples: [
      { title: "Onderhoudsarm wonen", text: "Hier is polyester vaak aantrekkelijk voor mensen die niet willen schilderen." },
      { title: "Strakke prefab uitstraling", text: "Polyester wordt veel gekozen waar een moderne look belangrijk is." },
      { title: "Lange termijn", text: `Neem ook ${articleLink("levensduur-dakkapel-per-materiaal", "de levensduurvergelijking")} mee in je keuze.` },
    ],
    tips: [
      "Vraag welke delen exact uit polyester bestaan en welke niet.",
      "Controleer garantie op afwerking en verkleuring.",
      "Laat het prijsverschil altijd naast kunststof en hout uitwerken.",
    ],
    faq: [
      { q: "Is polyester onderhoudsarm?", a: "Ja, dat is juist een van de belangrijkste redenen om ervoor te kiezen." },
      { q: "Is polyester duurder dan kunststof?", a: "Vaak wel iets, afhankelijk van systeem en afwerking." },
      { q: "Wordt polyester vooral prefab toegepast?", a: "Dat zie je in de markt vaak terug, al verschilt de constructie per aanbieder." },
    ],
    related: ["polyester-dakkapel-kosten", "levensduur-dakkapel-per-materiaal", "kunststof-dakkapel"],
  },
  {
    slug: "moderne-dakkapellen",
    title: "Moderne dakkapellen",
    metaTitle: "Moderne dakkapellen: uitstraling, materiaalkeuze en voorbeelden",
    metaDescription:
      "Lees wat moderne dakkapellen kenmerkt en welke materialen, kleuren en details vaak bij een strakke uitstraling passen.",
    intro:
      "Moderne dakkapellen draaien minder om één technisch systeem en meer om uitstraling: strakke lijnen, weinig onderhoud, subtiele profilering en een rustige aansluiting op het dakvlak.",
    quickAnswer:
      "Een moderne dakkapel herken je meestal aan strakke vormen, rustige detaillering, onderhoudsarme materialen en een sobere raamindeling die past bij de gevel.",
    costLink: "kunststof-dakkapel-kosten",
    compareLink: "kunststof-dakkapel",
    tableRows: [
      ["Vormgeving", "Strak en rustig", "Minder klassieke detaillering"],
      ["Materialen", "Vaak kunststof of polyester", "Onderhoudsarm en eigentijds"],
      ["Kleuren", "Veel wit, zwart, antraciet", "Sluit aan op moderne kozijnen"],
      ["Details", "Beperkt en clean", "Minder sierlijsten, meer eenvoud"],
    ],
    factors: [
      "Moderne uitstraling zit vooral in details, niet alleen in materiaal.",
      "Bij oudere woningen moet een moderne kapel nog steeds passend ogen.",
      "Kleur, profilering en raamverdeling bepalen samen het beeld.",
      "Onderhoudsarme materialen worden vaak gekozen om de strakke look te behouden.",
    ],
    examples: [
      { title: "Nieuwbouwwoning", text: "Hier past een moderne dakkapel vaak vanzelfsprekend in het gevelbeeld." },
      { title: "Bestaande woning met update", text: "Met de juiste kleur en maat kan ook een oudere woning moderner ogen." },
      { title: "Prijsbewuste modernisering", text: `Kunststof en polyester zijn dan vaak logische opties. Zie ook ${articleLink("kunststof-dakkapel", "kunststof")} en ${articleLink("polyester-dakkapel", "polyester")}.` },
    ],
    tips: [
      "Vraag voorbeelden op van soortgelijke woningen en niet alleen losse showroombeelden.",
      "Controleer of de moderne uitstraling niet botst met welstandseisen aan de voorzijde.",
      "Let op de balans tussen kleur, profiel en raamverdeling.",
    ],
    faq: [
      { q: "Wat maakt een dakkapel modern?", a: "Vooral strakke lijnen, rustige detaillering en onderhoudsarme materiaalkeuze." },
      { q: "Past modern ook bij oudere woningen?", a: "Soms wel, maar de inpassing moet zorgvuldig gebeuren." },
      { q: "Zijn moderne dakkapellen duurder?", a: "Niet automatisch. Dat hangt af van materiaal en afwerking." },
    ],
    related: ["kunststof-dakkapel", "polyester-dakkapel", "vergunning-dakkapel-voorkant"],
  },
  {
    slug: "dakkapel-met-plat-dak",
    title: "Dakkapel met plat dak",
    metaTitle: "Dakkapel met plat dak: eigenschappen, prijs en aandachtspunten",
    metaDescription:
      "Lees wat een dakkapel met plat dak kenmerkt en waar je op moet letten bij afwatering, uitstraling en prijs.",
    intro:
      "Een dakkapel met plat dak is in Nederland een veelgekozen uitvoering. Het model oogt rustig, is praktisch in opbouw en past goed binnen veel prefab- en traditionele systemen.",
    quickAnswer:
      "Een dakkapel met plat dak is populair omdat hij functioneel, relatief eenvoudig en breed toepasbaar is. Vooral afwatering en detaillering van de dakrand verdienen extra aandacht.",
    costLink: "wat-kost-een-dakkapel",
    compareLink: "dakkapel-met-schuin-dak",
    tableRows: [
      ["Vorm", "Compact en recht", "Past bij veel woningtypes"],
      ["Afwatering", "Belangrijk aandachtspunt", "Platte delen vragen goede afvoer"],
      ["Toepassing", "Breed", "Veel prefab en traditionele systemen gebruiken dit model"],
      ["Prijsniveau", "Vaak goed beheersbaar", "Sterk afhankelijk van materiaal en maat"],
    ],
    factors: [
      "Een plat dak vraagt om goede afwatering en nette detaillering.",
      "Het model past goed bij strakke en standaard uitvoeringen.",
      "Onderhoud aan goten en afvoer blijft belangrijk.",
      "De keuze tussen plat en schuin dak is vaak ook een esthetische keuze.",
    ],
    examples: [
      { title: "Prefab standaard", text: "Veel prefab-systemen werken juist met een plat dak vanwege eenvoud en voorspelbaarheid." },
      { title: "Strakke gevel", text: "Bij moderne woningen oogt een plat dak vaak rustig en logisch." },
      { title: "Onderhoud", text: `Lees daarnaast ${articleLink("onderhoud-dakkapel", "de onderhoudsgids")} voor afwatering en controlepunten.` },
    ],
    tips: [
      "Vraag hoe waterafvoer en dakbedekking zijn opgelost.",
      "Controleer onderhoud aan goten en afvoeren periodiek.",
      "Kijk niet alleen naar prijs, maar ook naar afwerkingskwaliteit van de dakrand.",
    ],
    faq: [
      { q: "Is een plat dak op een dakkapel normaal?", a: "Ja, het is juist een veelgekozen uitvoering." },
      { q: "Waar moet je extra op letten?", a: "Vooral op afwatering, dakbedekking en onderhoud." },
      { q: "Is een plat dak goedkoper dan een schuin dak?", a: "Dat hangt af van systeem en afwerking, maar het model is vaak praktisch en efficiënt." },
    ],
    related: ["dakkapel-met-schuin-dak", "onderhoud-dakkapel", "wat-kost-een-dakkapel"],
  },
  {
    slug: "dakkapel-met-schuin-dak",
    title: "Dakkapel met schuin dak",
    metaTitle: "Dakkapel met schuin dak: uitstraling, regels en wanneer het past",
    metaDescription:
      "Lees wanneer een dakkapel met schuin dak interessant is en hoe deze uitvoering scoort op uitstraling en vergunning.",
    intro:
      "Een dakkapel met schuin dak wordt vaak gekozen om beter aan te sluiten op de bestaande dakvorm of op woningen waar een traditioneler beeld gewenst is. Daarmee is het vaak net zo goed een esthetische als een technische keuze.",
    quickAnswer:
      "Een dakkapel met schuin dak past vooral goed bij woningen waar de aansluiting op het bestaande dakbeeld belangrijk is. Tegelijk vraagt dit model vaker om extra aandacht voor ontwerp, vergunning en detaillering.",
    costLink: "traditionele-dakkapel-kosten",
    compareLink: "dakkapel-met-plat-dak",
    tableRows: [
      ["Uitstraling", "Traditioneler", "Sluit vaak mooier aan op bestaande kapvorm"],
      ["Complexiteit", "Hoger", "Meer detaillering dan bij een recht model"],
      ["Vergunning", "Vaker aandachtspunt", "Door vorm en zichtbaarheid"],
      ["Prijs", "Soms hoger", "Afhankelijk van ontwerp en maatwerk"],
    ],
    factors: [
      "Een schuin dak wordt vaker gekozen voor esthetische aansluiting op de woning.",
      "Het ontwerp is meestal minder standaard dan een recht model.",
      "Vergunning en welstand kunnen sterker meespelen bij opvallende vormen.",
      "Vraag extra duidelijk naar detaillering en waterafvoer.",
    ],
    examples: [
      { title: "Karakteristieke woning", text: "Een schuin dak past hier soms beter in het totaalbeeld." },
      { title: "Voordakvlak", text: "Juist daar kan uitstraling zwaar meewegen in de beoordeling." },
      { title: "Vergelijking", text: `Leg dit model naast ${articleLink("dakkapel-met-plat-dak", "een plat dak")} voor een eerlijke afweging.` },
    ],
    tips: [
      "Vraag om gevelaanzichten of impressies voordat je beslist.",
      "Controleer of de gekozen vorm invloed heeft op vergunning en prijs.",
      "Let extra op detaillering rond aansluitingen en afwatering.",
    ],
    faq: [
      { q: "Wanneer kies je voor een schuin dak?", a: "Vooral als aansluiting op bestaande architectuur belangrijk is." },
      { q: "Is een schuin dak duurder?", a: "Dat kan, vooral als het ontwerp meer maatwerk vraagt." },
      { q: "Speelt vergunning hier sneller mee?", a: "Dat gebeurt vaker als de vorm het straatbeeld sterker beïnvloedt." },
    ],
    related: ["dakkapel-met-plat-dak", "vergunning-dakkapel-voorkant", "traditionele-dakkapel"],
  },
  {
    slug: "dakkapel-met-rolluiken",
    title: "Dakkapel met rolluiken",
    metaTitle: "Dakkapel met rolluiken: comfort, kosten en aandachtspunten",
    metaDescription:
      "Lees wat een dakkapel met rolluiken toevoegt aan comfort, prijs en gebruik en waar je op moet letten bij de keuze.",
    intro:
      "Rolluiken op een dakkapel worden vaak gekozen voor verduistering, warmtewering en extra comfort in slaapkamers of zolderkamers. Tegelijk zijn ze een extra optie die de offerte en het ontwerp beïnvloedt.",
    quickAnswer:
      "Een dakkapel met rolluiken kan comfort en gebruiksgemak vergroten, maar het is een meerwerkoptie die invloed heeft op prijs, uiterlijk en soms op de technische uitwerking.",
    costLink: "wat-kost-een-dakkapel",
    compareLink: "moderne-dakkapellen",
    tableRows: [
      ["Verduistering", "Hoog", "Vooral prettig in slaapruimtes"],
      ["Warmtewering", "Positief effect", "Kan comfort op zolder verbeteren"],
      ["Prijs", "Meerwerk", "Niet standaard in basisoffertes"],
      ["Techniek", "Extra aandacht", "Aansturing en afwerking meenemen in de offerte"],
    ],
    factors: [
      "Rolluiken zijn comfortopties en dus bijna altijd een aanvullende keuze.",
      "Elektrische bediening en afwerking beïnvloeden de meerprijs.",
      "Bij een strakke uitstraling moet het systeem goed worden geïntegreerd.",
      "Vraag of onderhoud, motor en garantie duidelijk zijn omschreven.",
    ],
    examples: [
      { title: "Zolder als slaapkamer", text: "Hier leveren rolluiken vaak direct merkbaar comfort op." },
      { title: "Warme zuidzijde", text: "Bij veel zon kan zonwering of verduistering extra aantrekkelijk worden." },
      { title: "Offerte", text: `Neem deze optie altijd expliciet mee in ${articleLink("checklist-dakkapel-offerte", "de offertechecklist")}.` },
    ],
    tips: [
      "Vraag naar bediening, onderhoud en storingsservice.",
      "Controleer of rolluiken invloed hebben op levertijd of uitstraling.",
      "Kijk ook of horren of andere comfortopties beter bij je gebruik passen.",
    ],
    faq: [
      { q: "Zijn rolluiken standaard bij een dakkapel?", a: "Nee, het is meestal een extra optie." },
      { q: "Wat is het voordeel van rolluiken?", a: "Verduistering, warmtewering en extra comfort." },
      { q: "Heeft dit invloed op de prijs?", a: "Ja, rolluiken worden vrijwel altijd als meerwerk meegenomen." },
    ],
    related: ["moderne-dakkapellen", "checklist-dakkapel-offerte", "wat-kost-een-dakkapel"],
  },
].forEach(buildTypeGuide);

[
  {
    slug: "dakkapel-laten-plaatsen",
    title: "Dakkapel laten plaatsen: complete gids",
    metaTitle: "Dakkapel laten plaatsen: complete gids van voorbereiding tot oplevering",
    metaDescription:
      "Lees stap voor stap hoe een dakkapel laten plaatsen verloopt, van voorbereiding en vergunning tot montage en afwerking.",
    intro:
      "Deze gids brengt het hele plaatsingsproces samen: van eerste oriëntatie en offerte tot vergunning, montagedag en afwerking. Daarmee is het de beste startpagina voor iedereen die verder is dan alleen prijsvergelijking.",
    quickAnswer:
      "Een dakkapel laten plaatsen begint met oriëntatie, maatbepaling en vergunningcheck. Daarna volgen offertevergelijking, voorbereiding, montage en vaak nog een fase van binnenafwerking of nazorg.",
    tableRows: [
      ["Oriëntatie en maatkeuze", "Eerste stap", "Bepaal doel, breedte en type"],
      ["Vergunningcheck", "Vroeg uitvoeren", "Voorkomt vertraging later"],
      ["Offertes en planning", "Vergelijk inhoudelijk", "Kijk verder dan totaalprijs"],
      ["Montage en afwerking", "Laatste fasen", "Binnenzijde niet vergeten"],
    ],
    factors: [
      "De vergunningstatus beïnvloedt planning en uitvoerbaarheid sterk.",
      "Prefab en traditioneel verschillen niet alleen in prijs, maar ook in montageroute.",
      "Binnenafwerking wordt in planning en budget vaak onderschat.",
      "Een goede leverancier begeleidt ook de voorbereiding, niet alleen de plaatsing.",
    ],
    examples: [
      { title: "Prefab traject", text: "Korter op de bouwplaats, maar nog steeds afhankelijk van vergunning en productie." },
      { title: "Traditioneel traject", text: "Meer vrijheid in maatwerk, maar meer bouwtijd op locatie." },
      { title: "Plannen als project", text: `Gebruik deze gids samen met ${articleLink("offerte-dakkapel-vergelijken", "offertevergelijking")} en ${articleLink("voorbereiding-dakkapel-montage", "voorbereiding")}.` },
    ],
    tips: [
      "Werk van buiten naar binnen: eerst regelgeving en techniek, dan pas planning en afwerking.",
      "Vraag leveranciers naar doorlooptijd én montageduur.",
      "Maak vooraf duidelijk hoe de ruimte binnen wordt opgeleverd.",
    ],
    extraSections: [
      {
        id: "van-idee-tot-oplevering",
        title: "Van eerste idee tot oplevering: zo verloopt het traject meestal",
        paragraphs: [
          "Een dakkapelproject begint zelden met de montage, maar met de vraag wat je met de extra ruimte wilt doen. Een slaapruimte, werkkamer of grotere zolder vraagt namelijk om andere keuzes in breedte, raamindeling en afwerkingsniveau. Zodra dat doel duidelijk is, volgen maatkeuze, materiaalrichting en de eerste vergunningcheck.",
          `Daarna verschuift het traject naar vergelijking: welke partij biedt een passende combinatie van prijs, planning en afwerking? Pas als die inhoud klopt, wordt montage concreet. Zelfs dan blijft het verstandig om ook de binnenzijde mee te nemen, via ${articleLink("binnenafwerking-dakkapel-uitleg", "binnenafwerking")} en ${articleLink("dakkapel-isoleren-tijdens-plaatsing", "isolatie tijdens plaatsing")}.`,
        ],
      },
      {
        id: "wat-je-zelf-moet-voorbereiden",
        title: "Wat je zelf vooraf moet regelen",
        paragraphs: [
          "Bezoekers focussen vaak op wat de leverancier doet, maar een soepel traject hangt ook af van wat je als eigenaar vooraf regelt. Denk aan bereikbaarheid rond de woning, vrije werkruimte op zolder, duidelijke keuze over opleverniveau binnen en het tijdig afronden van vergunning- of tekenwerk.",
          "Juist omdat veel van die punten buiten de montagedag vallen, worden ze vaak onderschat. Toch zijn het precies deze voorbereidingen die bepalen of het project strak doorloopt of vertraagt door losse eindjes.",
        ],
        items: [
          "Vergunningstatus of aanvraag vroeg afronden.",
          "Duidelijk kiezen tussen technisch geplaatst of compleet afgewerkt.",
          "Werkruimte op zolder en rondom de woning voorbereiden.",
          "Afspraken over planning, bereikbaarheid en nazorg schriftelijk vastleggen.",
        ],
      },
      {
        id: "waar-planning-vaak-uitloopt",
        title: "Waar de planning van dakkapel plaatsing vaak uitloopt",
        paragraphs: [
          "Vertraging ontstaat meestal niet tijdens de feitelijke montage, maar ervoor. Een onduidelijke vergunningstatus, ontbrekende tekeningen, onvolledige offerte of late keuze over materiaal en binnenafwerking kunnen allemaal dagen of weken toevoegen aan het proces.",
          `Daarom is deze gids het sterkst wanneer je hem combineert met ${articleLink("hoe-lang-duurt-een-dakkapel-plaatsen", "de tijdlijn per fase")}, ${articleLink("voorbereiding-dakkapel-montage", "voorbereiding voor montage")} en ${articleLink("checklist-dakkapel-offerte", "de offertechecklist")}.`,
        ],
      },
      {
        id: "offerte-naar-uitvoering",
        title: "Hoe je van offerte naar realistische uitvoeringsplanning gaat",
        paragraphs: [
          "Een goede offerte is nog geen planning. Pas wanneer vergunningstatus, productietijd, kraaninzet, bereikbaarheid en oplevering van de binnenzijde duidelijk zijn, ontstaat er een realistische uitvoeringsdatum. Vooral bij prefab wordt de montagedag vaak genoemd, terwijl de voorbereiding daarvoor nog verschillende stappen bevat.",
          "Daarom is het slim om vóór akkoord al te vragen welke onderdelen harde voorwaarden zijn voor de planning. Is tekenwerk afgerond? Is de productietijd bevestigd? Is de woning goed bereikbaar voor hijswerk? Die vragen maken het verschil tussen een theoretische datum en een uitvoerbaar plan.",
        ],
      },
      {
        id: "na-de-oplevering",
        title: "Wat je na oplevering meteen controleert",
        paragraphs: [
          "Na plaatsing kijken veel huiseigenaren vooral of de dakkapel er van buiten goed uitziet. Toch is de eerste controle binnen minstens zo belangrijk. Let op de afwerking van dagkanten, sluiting van ramen, ventilatie, aansluiting op bestaande wanden en de vraag of het afgesproken opleverniveau echt is gehaald.",
          `Juist die eerste opleverronde bepaalt of kleine afwerkpunten nog eenvoudig worden opgelost. Koppel de oplevering daarom aan je offerte en eventuele afspraken over ${articleLink("binnenafwerking-dakkapel-uitleg", "binnenafwerking")} en ${articleLink("onderhoud-dakkapel", "onderhoud")}.`,
        ],
      },
    ],
    faq: [
      { q: "Wat is de eerste stap bij een dakkapel laten plaatsen?", a: "Doel, maat en vergunningstatus bepalen." },
      { q: "Hoe lang duurt het hele traject?", a: "Dat verschilt sterk; voorbereiding en vergunning kunnen meer tijd vragen dan de montagedag zelf." },
      { q: "Wat wordt vaak vergeten?", a: "Binnenafwerking, planning en de inhoudelijke vergelijking van offertes." },
    ],
    related: ["stappenplan-dakkapel-plaatsen", "voorbereiding-dakkapel-montage", "offerte-dakkapel-vergelijken"],
  },
  {
    slug: "hoe-lang-duurt-een-dakkapel-plaatsen",
    title: "Hoe lang duurt een dakkapel plaatsen",
    metaTitle: "Hoe lang duurt een dakkapel plaatsen? Tijdlijn per type en fase",
    metaDescription:
      "Lees hoe lang het plaatsen van een dakkapel duurt en waar het verschil zit tussen voorbereiding, montage en afwerking.",
    intro:
      "De vraag hoe lang een dakkapel plaatsen duurt, wordt vaak verward met de montagedag zelf. In de praktijk bestaat het traject uit meerdere fasen die ieder tijd kosten.",
    quickAnswer:
      "De plaatsing zelf kan bij prefab soms in één dag gebeuren, maar het totale traject inclusief voorbereiding, vergunning, productie en afwerking duurt meestal langer.",
    tableRows: [
      ["Oriëntatie en offerte", "Dagen tot weken", "Hangt af van snelheid van vergelijken"],
      ["Vergunning of tekenwerk", "Extra doorlooptijd", "Vooral bij vergunningplichtige situaties"],
      ["Prefab montagedag", "Vaak 1 dag", "Maar voorbereiding loopt daarvoor al"],
      ["Traditionele bouw op locatie", "Meerdere dagen", "Meer arbeid en afwerking op het dak"],
    ],
    factors: [
      "Vergunning en tekenwerk kosten vaak meer tijd dan verwacht.",
      "Prefab verkort vooral de montagedag, niet altijd de totale levertijd.",
      "Binnenafwerking kan de totale oplevering verlengen.",
      "Bereikbaarheid, weer en planning van de aannemer spelen mee.",
    ],
    examples: [
      { title: "Prefab met strakke voorbereiding", text: "Hier kan de zichtbare bouwtijd heel kort zijn." },
      { title: "Maatwerk of vergunning", text: "Dan verschuift meer tijd naar de voorbereiding en beoordeling." },
      { title: "Totale planning", text: `Bekijk daarom ook ${articleLink("stappenplan-dakkapel-plaatsen", "het stappenplan")} voor een realistischer beeld.` },
    ],
    tips: [
      "Vraag altijd naar totale doorlooptijd én naar tijd op locatie.",
      "Leg vergunning, productie en montage als aparte fasen vast.",
      "Plan binnenwerk niet te optimistisch direct na de montage zonder afstemming.",
    ],
    faq: [
      { q: "Kan een dakkapel in één dag geplaatst worden?", a: "Ja, vooral prefab, maar dat zegt niet alles over de totale doorlooptijd." },
      { q: "Wat kost meestal de meeste tijd?", a: "Voorbereiding, vergunning en planning kunnen langer duren dan de montage zelf." },
      { q: "Duurt traditioneel langer?", a: "Op de bouwplaats meestal wel, omdat meer werk ter plekke gebeurt." },
    ],
    related: ["dakkapel-in-1-dag-plaatsen", "stappenplan-dakkapel-plaatsen", "dakkapel-laten-plaatsen"],
  },
  {
    slug: "dakkapel-in-1-dag-plaatsen",
    title: "Dakkapel in 1 dag plaatsen",
    metaTitle: "Dakkapel in 1 dag plaatsen: wanneer kan dat echt?",
    metaDescription:
      "Lees wanneer een dakkapel echt in 1 dag geplaatst kan worden en welke voorbereiding daarvoor nodig is.",
    intro:
      "De belofte van een dakkapel in 1 dag spreekt veel huiseigenaren aan. Meestal gaat het dan om de plaatsing van een prefab-element, niet om het volledige traject van aanvraag tot volledig afgewerkte kamer.",
    quickAnswer:
      "Een dakkapel kan vaak in 1 dag geplaatst worden als het om een prefab-element gaat, de voorbereiding rond is en het dak goed bereikbaar is. De totale doorlooptijd blijft langer.",
    tableRows: [
      ["Prefab element", "Voorwaarde", "Zonder prefab is 1 dag minder waarschijnlijk"],
      ["Bereikbaarheid", "Cruciaal", "Kraan en straatruimte moeten passen"],
      ["Vergunning en planning", "Moet al rond zijn", "Niet iets voor de laatste week"],
      ["Binnenafwerking", "Vaak later", "Niet altijd dezelfde dag volledig klaar"],
    ],
    factors: [
      "Het succes van 1 dag zit in voorbereiding, niet alleen in snelheid op de dag zelf.",
      "Kraanplanning en weersomstandigheden zijn belangrijk.",
      "Niet elke woning is praktisch geschikt voor deze route.",
      "Binnenzijde kan na de montagedag nog extra werk vragen.",
    ],
    examples: [
      { title: "Prefab achterzijde met goede kraanplek", text: "Dit is de ideale 1-dag-situatie." },
      { title: "Beperkte straatruimte", text: "Dan kan logistiek de snelle route in de weg zitten." },
      { title: "Kamer nog niet af", text: `Lees ook ${articleLink("binnenafwerking-dakkapel-uitleg", "wat binnenafwerking nog vraagt")}.` },
    ],
    tips: [
      "Vraag wat precies binnen die ene dag gebeurt en wat erna nog volgt.",
      "Controleer of vergunning, productie en logistiek al volledig rond zijn.",
      "Laat je niet alleen verleiden door snelheid; kwaliteit en inhoud van de offerte blijven leidend.",
    ],
    faq: [
      { q: "Betekent 1 dag plaatsen ook volledig klaar?", a: "Niet altijd. De buitenplaatsing kan klaar zijn terwijl binnen nog afwerking nodig is." },
      { q: "Kan traditioneel ook in 1 dag?", a: "Dat is veel minder gebruikelijk dan bij prefab." },
      { q: "Wat is de belangrijkste voorwaarde?", a: "Een goed voorbereid prefab traject met goede bereikbaarheid." },
    ],
    related: ["prefab-dakkapel", "hoe-lang-duurt-een-dakkapel-plaatsen", "voorbereiding-dakkapel-montage"],
  },
  {
    slug: "stappenplan-dakkapel-plaatsen",
    title: "Stappenplan dakkapel plaatsen",
    metaTitle: "Stappenplan dakkapel plaatsen: van idee tot oplevering",
    metaDescription:
      "Bekijk een praktisch stappenplan voor het plaatsen van een dakkapel, van oriëntatie en vergunning tot montage en nazorg.",
    intro:
      "Een duidelijk stappenplan voorkomt dat je in de verkeerde volgorde werkt. Veel vertraging ontstaat doordat offertes al worden geaccepteerd voordat vergunning, maatvoering en afwerking goed zijn afgestemd.",
    quickAnswer:
      "Een goed traject verloopt meestal via oriëntatie, vergunningcheck, offertevergelijking, maatwerk of productie, montage en vervolgens controle en eventuele binnenafwerking.",
    tableRows: [
      ["Stap 1", "Doel en maat bepalen", "Welke ruimte wil je winnen?"],
      ["Stap 2", "Vergunningcheck", "Voorkom verkeerde aannames"],
      ["Stap 3", "Offertes vergelijken", "Niet alleen op prijs"],
      ["Stap 4", "Planning en voorbereiding", "Maak alle randvoorwaarden concreet"],
      ["Stap 5", "Montage en oplevering", "Controleer binnen en buiten"],
    ],
    factors: [
      "Een verkeerde volgorde maakt het traject duurder en trager.",
      "Wie meteen op prijs focust, mist vaak vergunning- en afwerkingsvragen.",
      "Een compleet stappenplan laat zien welke stukken en keuzes nog ontbreken.",
      "Nazorg en oplevercontrole verdienen net zo goed een vaste plek.",
    ],
    examples: [
      { title: "Prijs eerst, regels later", text: "Dat lijkt snel, maar veroorzaakt vaak terugwerk." },
      { title: "Regels eerst, dan offerte", text: "Dit geeft meer grip op planning en minder verrassingen." },
      { title: "Oplevering", text: `Gebruik bij de eindfase ook ${articleLink("checklist-dakkapel-offerte", "een checklist")} en inspecteer het resultaat zorgvuldig.` },
    ],
    tips: [
      "Leg elke stap vast voordat je naar de volgende gaat.",
      "Laat leveranciers meedenken, maar houd zelf de regie over vergunning en inhoud.",
      "Neem oplevering en binnenafwerking mee in de planning vanaf het begin.",
    ],
    faq: [
      { q: "Wat is de eerste fout in een dakkapeltraject?", a: "Te vroeg tekenen of plannen zonder de vergunningstatus te kennen." },
      { q: "Wanneer vraag je offertes aan?", a: "Nadat je doel, maat en vergunningrichting redelijk scherp zijn." },
      { q: "Hoort binnenafwerking in het stappenplan?", a: "Ja, anders blijft de kamer vaak technisch wel af maar praktisch nog niet bruikbaar." },
    ],
    related: ["dakkapel-laten-plaatsen", "voorbereiding-dakkapel-montage", "offerte-dakkapel-vergelijken"],
  },
  {
    slug: "voorbereiding-dakkapel-montage",
    title: "Voorbereiding dakkapel montage",
    metaTitle: "Voorbereiding dakkapel montage: wat moet je regelen?",
    metaDescription:
      "Lees hoe je de montage van een dakkapel voorbereidt en welke praktische zaken je vooraf moet regelen.",
    intro:
      "Goede voorbereiding maakt de montagedag sneller, veiliger en voorspelbaarder. Juist de praktische zaken in en om de woning worden daarbij vaak onderschat.",
    quickAnswer:
      "Voorbereiding voor dakkapelmontage draait om bereikbaarheid, planning, vrijmaken van ruimtes, veiligheid en duidelijke afspraken over oplevering en afwerking.",
    tableRows: [
      ["Buitenruimte", "Vrijmaken", "Kraan en montageploeg moeten erbij kunnen"],
      ["Binnenruimte", "Beschermen en opruimen", "Voorkom schade en rommel"],
      ["Planning", "Bevestigen", "Zeker als vergunning of levering meespeelt"],
      ["Opleverafspraken", "Vooraf vastleggen", "Voorkomt discussie achteraf"],
    ],
    factors: [
      "Straatruimte en bereikbaarheid zijn cruciaal bij prefab plaatsing.",
      "Binnen moet voldoende ruimte zijn voor werk en bescherming tegen stof.",
      "Afspraken over stroom, sanitair en aanwezigheid van bewoners helpen de dag soepel te laten verlopen.",
      "Ook weersafspraken en noodscenario's zijn het bespreken waard.",
    ],
    examples: [
      { title: "Rijwoning in drukke straat", text: "Daar moet logistiek vaak extra strak worden geregeld." },
      { title: "Zolder vol spullen", text: "Onvoldoende voorbereiding binnen vertraagt de montage en maakt de oplevering rommelig." },
      { title: "Praktische checklist", text: `Leg deze voorbereiding naast ${articleLink("wat-gebeurt-er-op-de-dag-van-plaatsing", "de montagedag-uitleg")}.` },
    ],
    tips: [
      "Vraag de leverancier om een concrete voorbereidingslijst voor jouw woning.",
      "Maak foto's van de situatie voor en na montage.",
      "Spreek vooraf af wat er gebeurt als levering of weer uitloopt.",
    ],
    faq: [
      { q: "Moet ik binnen veel voorbereiden?", a: "Ja, zeker de zolderruimte zelf en de route waarlangs mensen en materiaal bewegen." },
      { q: "Waarom is buitenruimte zo belangrijk?", a: "Voor kraan, montage en veilige toegang tot het dak." },
      { q: "Wat moet ik vooraf op papier zetten?", a: "Planning, oplevering, eventuele restpunten en verantwoordelijkheden." },
    ],
    related: ["wat-gebeurt-er-op-de-dag-van-plaatsing", "dakkapel-in-1-dag-plaatsen", "dakkapel-laten-plaatsen"],
  },
  {
    slug: "wat-gebeurt-er-op-de-dag-van-plaatsing",
    title: "Wat gebeurt er op de dag van plaatsing",
    metaTitle: "Wat gebeurt er op de dag van plaatsing van een dakkapel?",
    metaDescription:
      "Lees hoe de dag van plaatsing van een dakkapel meestal verloopt en waar je als huiseigenaar op kunt letten.",
    intro:
      "De montagedag is het zichtbaarste deel van het hele traject. Juist daarom is het prettig om vooraf te weten welke stappen je ongeveer kunt verwachten en op welke momenten je moet meekijken of controleren.",
    quickAnswer:
      "Op de dag van plaatsing wordt meestal eerst de werkplek ingericht, daarna het dak geopend of voorbereid, de dakkapel geplaatst en vervolgens de aansluiting water- en winddicht gemaakt. Afwerking volgt deels direct en deels later.",
    tableRows: [
      ["Start werkdag", "Werkplek inrichten", "Veiligheid en logistiek eerst"],
      ["Openen dakvlak", "Voorbereidende fase", "Hier ontstaat de opening voor de kapel"],
      ["Plaatsing kapel", "Kernmoment", "Vaak met kraan of tilwerk"],
      ["Aansluiten en dichtmaken", "Cruciaal", "Water- en winddichtheid eerst"],
      ["Controle en afronding", "Laatste stap", "Loop samen de oplevering door"],
    ],
    factors: [
      "Prefab en traditioneel verschillen sterk in hoe compact deze dag verloopt.",
      "Weersomstandigheden kunnen invloed hebben op het tempo.",
      "Aansluitingen, afwerking en controlepunten zijn belangrijker dan de hijsactie zelf.",
      "Goede communicatie tijdens de dag voorkomt misverstanden over restwerk.",
    ],
    examples: [
      { title: "Prefab dag", text: "Hier ligt de nadruk op hijsen, plaatsen en aansluiten." },
      { title: "Traditionele dag", text: "Hier verschuift meer werk naar opbouw en detaillering op locatie." },
      { title: "Na afloop", text: `Controleer samen met ${articleLink("checklist-dakkapel-offerte", "je checklist")} of de oplevering overeenkomt met de offerte.` },
    ],
    tips: [
      "Vraag vooraf naar de planning per uur of per fase.",
      "Loop de buiten- en binnenzijde aan het einde van de dag samen door.",
      "Noteer restpunten direct in plaats van ze mondeling te laten hangen.",
    ],
    faq: [
      { q: "Is de woning open tijdens plaatsing?", a: "Een deel van het dak wordt geopend, maar het doel is om zo snel mogelijk weer wind- en waterdicht te werken." },
      { q: "Moet ik de hele dag thuis zijn?", a: "Dat is meestal verstandig, al is het maar voor afstemming en oplevercontrole." },
      { q: "Is alles dezelfde dag helemaal af?", a: "Niet altijd; binnenafwerking of restpunten kunnen later volgen." },
    ],
    related: ["voorbereiding-dakkapel-montage", "dakkapel-in-1-dag-plaatsen", "checklist-dakkapel-offerte"],
  },
  {
    slug: "binnenafwerking-dakkapel-uitleg",
    title: "Binnenafwerking dakkapel uitleg",
    metaTitle: "Binnenafwerking van een dakkapel: wat houdt het precies in?",
    metaDescription:
      "Lees wat binnenafwerking van een dakkapel inhoudt en welke keuzes er zijn voor aftimmering, stucwerk en oplevering.",
    intro:
      "Na de plaatsing van een dakkapel is de buitenzijde vaak technisch klaar, maar de kamer binnen niet altijd. Binnenafwerking bepaalt of de ruimte meteen bruikbaar en netjes oogt.",
    quickAnswer:
      "Binnenafwerking gaat over de afwerking van dagkanten, aftimmering, vensterbanken, naden, isolatie-aansluitingen en soms ook stuc-, schilder- of elektrawerk.",
    tableRows: [
      ["Aftimmering", "Basisafwerking", "Maakt de opening netjes en bruikbaar"],
      ["Stucwerk", "Niet altijd standaard", "Vaak aparte afbouwpost"],
      ["Vensterbank en profielen", "Sterk offerteafhankelijk", "Bepalen de uitstraling sterk"],
      ["Elektra", "Soms apart", "Bijvoorbeeld verlichting of stopcontacten"],
    ],
    factors: [
      "Binnenafwerking wordt vaak niet volledig in dezelfde offerte aangeboden.",
      "Het gekozen afwerkingsniveau bepaalt of je nog een losse vakman nodig hebt.",
      "Een strakke oplevering binnen maakt de totale investering hoger maar ook praktischer.",
      "Detailwerk aan naden en dagkanten beïnvloedt het eindbeeld sterk.",
    ],
    examples: [
      { title: "Technisch opgeleverd", text: "De dakkapel staat, maar de dagkanten en wanden vragen nog extra werk." },
      { title: "Compleet afgewerkt", text: "Hier is de kamer bijna direct bruikbaar, maar wel tegen hogere kosten." },
      { title: "Offerte lezen", text: `Gebruik hiervoor ook ${articleLink("dakkapel-kosten-inclusief-binnenafwerking", "de kostenpagina voor binnenafwerking")}.` },
    ],
    tips: [
      "Vraag altijd naar foto's van het beloofde afwerkingsniveau.",
      "Leg vast of schilderwerk en stucwerk in één pakket zitten.",
      "Bepaal vooraf of je één partij of meerdere vakmensen wilt gebruiken.",
    ],
    faq: [
      { q: "Is binnenafwerking standaard inbegrepen?", a: "Nee, dat verschilt sterk per aanbieder." },
      { q: "Waarom is dit zo belangrijk?", a: "Omdat het bepaalt of je zolder direct bruikbaar en netjes is." },
      { q: "Kan ik binnenafwerking later doen?", a: "Ja, maar dan blijft de ruimte vaak tijdelijk onafgewerkt." },
    ],
    related: ["dakkapel-kosten-inclusief-binnenafwerking", "wat-gebeurt-er-op-de-dag-van-plaatsing", "checklist-dakkapel-offerte"],
  },
  {
    slug: "dakkapel-isoleren-tijdens-plaatsing",
    title: "Dakkapel isoleren tijdens plaatsing",
    metaTitle: "Dakkapel isoleren tijdens plaatsing: waarom dit het beste moment is",
    metaDescription:
      "Lees waarom het slim is om isolatie direct mee te nemen tijdens plaatsing van een dakkapel en waar je op moet letten.",
    intro:
      "Plaatsing is hét moment om isolatie goed mee te nemen. De constructie ligt open, aansluitingen zijn zichtbaar en fouten of koudebruggen kun je dan nog relatief eenvoudig voorkomen.",
    quickAnswer:
      "Isoleren tijdens plaatsing is slim omdat dak, kapel en binnenafwerking dan in één keer goed op elkaar kunnen aansluiten. Achteraf verbeteren is meestal omslachtiger en duurder.",
    tableRows: [
      ["Dak en kapel tegelijk", "Meest logisch", "Aansluitingen direct netjes oplossen"],
      ["Achteraf bij-isoleren", "Minder efficiënt", "Meer openbreken en herstelwerk"],
      ["Ventilatie", "Blijft belangrijk", "Isolatie zonder goede opbouw kan klachten geven"],
      ["Binnenafwerking", "Nauw verbonden", "Goede isolatie vraagt ook nette afwerking"],
    ],
    factors: [
      "Isolatie werkt alleen goed als aansluitingen zorgvuldig worden uitgevoerd.",
      "Ventilatie en dampremming spelen mee in het voorkomen van condensproblemen.",
      "Het is efficiënter om isolatie en afwerking samen te plannen.",
      "Vraag expliciet welke isolatiewaarden en materialen worden toegepast.",
    ],
    examples: [
      { title: "Nieuwe dakkapel, kale zolder", text: "Dan is plaatsing vaak het perfecte moment om de hele opbouw goed te laten aansluiten." },
      { title: "Bestaande zolder met oude isolatie", text: "Juist dan loont het om aansluitingen opnieuw te beoordelen." },
      { title: "Vocht voorkomen", text: `Bekijk ook ${articleLink("condens-bij-dakkapel", "de pagina over condensproblemen")}.` },
    ],
    tips: [
      "Vraag leveranciers welke isolatie standaard in de opbouw zit.",
      "Controleer hoe de aansluiting op bestaand dak en wanden wordt opgelost.",
      "Gebruik isolatie niet los van ventilatie en afwerking.",
    ],
    faq: [
      { q: "Waarom isoleren tijdens plaatsing?", a: "Omdat de constructie dan open ligt en aansluitingen direct goed kunnen worden gemaakt." },
      { q: "Voorkomt goede isolatie ook condens?", a: "Het helpt, maar alleen als ventilatie en opbouw ook kloppen." },
      { q: "Moet ik hier apart naar vragen in de offerte?", a: "Ja, zeker als comfort en energieprestaties belangrijk zijn." },
    ],
    related: ["condens-bij-dakkapel", "binnenafwerking-dakkapel-uitleg", "dakkapel-laten-plaatsen"],
  },
  {
    slug: "dakconstructie-aanpassen-voor-dakkapel",
    title: "Dakconstructie aanpassen voor dakkapel",
    metaTitle: "Dakconstructie aanpassen voor een dakkapel: wanneer is dat nodig?",
    metaDescription:
      "Lees wanneer de dakconstructie aangepast moet worden voor een dakkapel en waarom dit invloed heeft op prijs en planning.",
    intro:
      "Een dakkapel betekent altijd een ingreep in het dakvlak. Soms blijft dat binnen een relatief eenvoudige aanpassing, soms vraagt het om extra constructieve aandacht. Juist die nuance maakt dit onderwerp belangrijk.",
    quickAnswer:
      "Aanpassing van de dakconstructie kan nodig zijn wanneer de opening groot wordt, de belasting toeneemt of de bestaande dakopbouw extra versteviging vraagt. Dat beïnvloedt prijs, planning en soms vergunning.",
    tableRows: [
      ["Kleine standaardopening", "Beperkter effect", "Nog steeds technisch werk, maar vaak overzichtelijk"],
      ["Brede kapel", "Meer aandacht nodig", "Grotere opening vraagt vaak zwaardere oplossing"],
      ["Oudere woning", "Extra alert", "Bestaande constructie kan beperkend zijn"],
      ["Constructeursadvies", "Soms nodig", "Voor zekerheid en onderbouwing"],
    ],
    factors: [
      "Breedte en gewicht beïnvloeden de constructieve vraag het meest.",
      "Oudere daken of afwijkende kapconstructies vragen eerder om maatwerk.",
      "Constructieve wijzigingen kunnen ook invloed hebben op vergunning of verzekering.",
      "Vraag vroeg in het traject wie deze beoordeling maakt.",
    ],
    examples: [
      { title: "Standaard prefab middenmaat", text: "Vaak relatief overzichtelijk, maar nog steeds niet vrijblijvend." },
      { title: "5 meter brede kapel", text: "Daar wordt constructie een veel zichtbaarder onderdeel van de voorbereiding." },
      { title: "Planning", text: `Neem dit onderwerp altijd mee in ${articleLink("dakkapel-kosten-5-meter", "brede dakkapellen")} en ${articleLink("omgevingsvergunning-dakkapel-aanvragen", "vergunningaanvragen")}.` },
    ],
    tips: [
      "Vraag of constructieve controle onderdeel is van de offerte of later volgt.",
      "Kijk bij brede of zware uitvoeringen niet alleen naar prijs, maar ook naar technische onderbouwing.",
      "Laat de gevolgen voor planning en afwerking expliciet benoemen.",
    ],
    faq: [
      { q: "Moet de dakconstructie altijd aangepast worden?", a: "Er is altijd een ingreep, maar de mate van aanpassing verschilt sterk per situatie." },
      { q: "Wanneer heb je een constructeur nodig?", a: "Vooral bij bredere, zwaardere of technisch afwijkende situaties." },
      { q: "Maakt dit de dakkapel veel duurder?", a: "Dat kan, zeker als extra versteviging of onderbouwing nodig blijkt." },
    ],
    related: ["dakkapel-kosten-5-meter", "vergunning-dakkapel-regels", "dakkapel-laten-plaatsen"],
  },
  {
    slug: "veelgemaakte-fouten-bij-dakkapel-plaatsing",
    title: "Veelgemaakte fouten bij dakkapel plaatsing",
    metaTitle: "Veelgemaakte fouten bij dakkapel plaatsing: zo voorkom je ze",
    metaDescription:
      "Lees welke fouten vaak worden gemaakt bij het plaatsen van een dakkapel en hoe je problemen in planning, afwerking en uitvoering voorkomt.",
    intro:
      "Fouten bij dakkapelplaatsing ontstaan zelden pas op de montagedag. Meestal beginnen ze al eerder: bij onduidelijke offertes, te snelle planning of onrealistische verwachtingen over afwerking en vergunning.",
    quickAnswer:
      "De meest voorkomende fouten zijn te vroeg plannen, te weinig aandacht voor vergunning en afwerking, onduidelijke afspraken over montage en het onderschatten van logistiek en constructie.",
    tableRows: [
      ["Te vroeg akkoord geven", "Risico op terugwerk", "Eerst regels en inhoud helder krijgen"],
      ["Binnenafwerking vergeten", "Onvolledige oplevering", "Ruimte lijkt klaar maar is dat niet"],
      ["Logistiek onderschatten", "Vertraging op montagedag", "Kraan en bereikbaarheid zijn cruciaal"],
      ["Offerte te globaal", "Discussie achteraf", "Inbegrepen posten niet duidelijk"],
    ],
    factors: [
      "Veel fouten zijn in wezen communicatie- en voorbereidingsfouten.",
      "Een strakke planning zonder ruimte voor vergunning of levering geeft druk op kwaliteit.",
      "Binnen en buiten moeten als één project worden gezien.",
      "Hoe groter de dakkapel, hoe zwaarder voorbereiding en constructie tellen.",
    ],
    examples: [
      { title: "Prijs boven inhoud", text: "Wie alleen op het laagste bedrag tekent, ontdekt vaak te laat wat ontbreekt." },
      { title: "Te optimistische planning", text: "Vooral bij vergunningplichtige of maatwerktrajecten." },
      { title: "Praktische oplossing", text: `Gebruik een combinatie van ${articleLink("stappenplan-dakkapel-plaatsen", "een stappenplan")} en ${articleLink("checklist-dakkapel-offerte", "een offertechecklist")}.` },
    ],
    tips: [
      "Maak één document met planning, vergunningstatus, offerte-inhoud en opleverafspraken.",
      "Controleer de ruimte binnen en buiten minstens een week voor montage nog eens.",
      "Neem restpunten direct op in de oplevering en niet achteraf uit het geheugen.",
    ],
    faq: [
      { q: "Wat is de grootste fout bij dakkapelplaatsing?", a: "Een offerte accepteren voordat vergunning, inhoud en afwerking echt duidelijk zijn." },
      { q: "Waar gaat het op de montagedag vaak mis?", a: "Bij logistiek, bereikbaarheid en onduidelijke verwachtingen over oplevering." },
      { q: "Hoe voorkom je dit het best?", a: "Met betere voorbereiding, duidelijke checklists en inhoudelijke offertevergelijking." },
    ],
    related: ["stappenplan-dakkapel-plaatsen", "checklist-dakkapel-offerte", "offerte-dakkapel-vergelijken"],
  },
].forEach(buildPlacementGuide);

[
  {
    slug: "onderhoud-dakkapel",
    title: "Onderhoud en levensduur van dakkapellen",
    metaTitle: "Onderhoud en levensduur van dakkapellen: complete gids",
    metaDescription:
      "Lees hoe je een dakkapel goed onderhoudt, welke onderdelen het eerst slijten en hoe de levensduur per materiaal verschilt.",
    intro:
      "Deze gids bundelt de belangrijkste onderhoudspunten voor dakkapellen: schoonmaken, inspecteren, kit en lood controleren, afwatering vrijhouden en op tijd ingrijpen bij slijtage. Daarmee is het de basispagina voor onderhoud en levensduur.",
    quickAnswer:
      "Een goed onderhouden dakkapel gaat duidelijk langer mee. Hoeveel onderhoud nodig is, hangt vooral af van materiaal, afwerking, plaatsing en hoe snel kleine gebreken worden aangepakt.",
    tableRows: [
      ["Kunststof", "Weinig schilderwerk", "Vooral schoonmaken en controleren"],
      ["Hout", "Meer onderhoud", "Regelmatige inspectie en schilderwerk nodig"],
      ["Kit en aansluitingen", "Belangrijk aandachtspunt", "Vaak eerste plek waar problemen ontstaan"],
      ["Goten en afvoer", "Periodiek vrijmaken", "Voorkomt stilstaand water en lekkage"],
    ],
    factors: [
      "Materiaalkeuze bepaalt het onderhoudsprofiel sterk.",
      "Afwatering en dakdetails zijn cruciaal voor de levensduur.",
      "Te laat ingrijpen maakt kleine gebreken snel duurder.",
      "Onderhoud is niet alleen schoonmaken, maar ook periodiek controleren.",
    ],
    examples: [
      { title: "Onderhoudsarme kunststof", text: "Minder schilderwerk, maar nog steeds aandacht voor afwatering en rubbers." },
      { title: "Houten dakkapel", text: "Meer esthetisch onderhoud, maar met goed beheer nog steeds duurzaam." },
      { title: "Klachten voorkomen", text: `Bekijk aanvullend ${articleLink("lekkage-bij-dakkapel-oorzaken", "lekkage")}, ${articleLink("condens-bij-dakkapel", "condens")} en ${articleLink("tocht-bij-dakkapel-oplossen", "tochtproblemen")}.` },
    ],
    tips: [
      "Plan minimaal jaarlijks een visuele controle van goten, kit en aansluitingen.",
      "Maak onderhoud onderdeel van de opleverinstructie van je leverancier.",
      "Wacht bij vochtplekken of tocht niet tot het vanzelf erger wordt.",
    ],
    extraSections: [
      {
        id: "jaarlijkse-onderhoudskalender",
        title: "Een praktische onderhoudskalender voor huiseigenaren",
        paragraphs: [
          "Onderhoud werkt het best als je het niet laat afhangen van toeval. Een korte visuele controle in het voorjaar en najaar helpt vaak al om veel problemen vroeg te herkennen. Kijk naar vuil in goten, open naden, slijtage van kit, verkleuring van hout en signalen van vocht aan de binnenzijde van de kamer.",
          "Dat hoeft niet meteen technisch of ingewikkeld te zijn. Het belangrijkste is dat je consequent kijkt en afwijkingen noteert. Juist kleine veranderingen, zoals een terugkerende vochtplek of een kier die langzaam groter wordt, vertellen vaak dat een klein onderhoudspunt begint uit te groeien tot herstelwerk.",
        ],
        items: [
          "Voorjaar: afwatering, kitnaden en zichtbare vervuiling controleren.",
          "Najaar: bladeren, goten en waterafvoer vrijmaken.",
          "Na zware regen of storm: extra letten op lekkage en detailafwerking.",
          "Bij oplevering: onderhoudsinstructies van de leverancier bewaren.",
        ],
      },
      {
        id: "repareren-of-vervangen",
        title: "Wanneer onderhoud genoeg is en wanneer vervanging logischer wordt",
        paragraphs: [
          "Niet elk probleem betekent dat een dakkapel vervangen moet worden. Versleten kit, kleine lekkagepunten of achterstallig schilderwerk zijn vaak nog goed te herstellen, mits je er op tijd bij bent. Dat geldt vooral wanneer de hoofdconstructie nog in orde is en de problemen zich beperken tot afwerking of aansluitingen.",
          `Vervanging komt eerder in beeld wanneer klachten terugkeren, meerdere onderdelen tegelijk slijten of de dakkapel niet meer aansluit op moderne comfort- en isolatiewensen. In die fase is het zinvol om ook ${articleLink("wanneer-dakkapel-vervangen", "wanneer vervanging logisch wordt")} en ${articleLink("levensduur-dakkapel-per-materiaal", "de levensduur per materiaal")} te bekijken.`,
        ],
      },
      {
        id: "eerste-signalen-van-problemen",
        title: "De eerste signalen van grotere problemen",
        paragraphs: [
          "De meeste grote dakkapelproblemen beginnen klein: een vochtplek die alleen bij harde regen zichtbaar wordt, een hardnekkige tochtstroom rondom het kozijn, of condens die niet meer past bij normaal wintergebruik. Dat soort signalen lijken onschuldig, maar zijn juist waardevol omdat ze vroeg waarschuwen.",
          `Wie zulke symptomen ziet, hoeft niet meteen in paniek te raken, maar moet wel doorpakken. Combineer deze onderhoudsgids daarom met de specifieke probleemartikelen over ${articleLink("lekkage-bij-dakkapel-oorzaken", "lekkage")}, ${articleLink("condens-bij-dakkapel", "condens")} en ${articleLink("tocht-bij-dakkapel-oplossen", "tocht")}.`,
        ],
      },
      {
        id: "wat-je-bij-oplevering-vastlegt",
        title: "Wat je bij oplevering van een nieuwe dakkapel meteen vastlegt",
        paragraphs: [
          "Goed onderhoud begint eigenlijk al bij oplevering. Vraag naar onderhoudsadvies, garantievoorwaarden, gebruikte materialen, schilder- of schoonmaakadvies en de onderdelen die de leverancier als normaal periodiek onderhoud ziet. Als dat niet duidelijk is, merk je pas later dat verwachtingen uiteenlopen.",
          "Door die informatie direct te bewaren, kun je problemen sneller plaatsen. Je weet dan welke onderdelen nieuw horen te zijn, wanneer een eerste controle verstandig is en of een klacht onder onderhoud, afwerking of garantie valt. Dat maakt ook het gesprek met de leverancier later veel concreter.",
        ],
      },
      {
        id: "onderhoud-per-materiaal",
        title: "Waarom onderhoud per materiaal echt verschilt",
        paragraphs: [
          "Onderhoud lijkt soms een algemeen onderwerp, maar de praktijk verschilt sterk per materiaal. Kunststof vraagt vooral regelmatige controle en schoonmaak, terwijl hout daarnaast gevoelig blijft voor schilderwerk en verwering. Polyester zit daar vaak tussenin: onderhoudsarm, maar wel afhankelijk van de kwaliteit van afwerking en aansluitingen.",
          `Daarom is de juiste onderhoudsstrategie altijd gekoppeld aan de materiaalkeuze die je eerder hebt gemaakt. Wie nog twijfelt over de lange termijn, combineert deze gids het best met ${articleLink("onderhoud-houten-dakkapel", "onderhoud van hout")}, ${articleLink("onderhoud-kunststof-dakkapel", "onderhoud van kunststof")} en ${articleLink("levensduur-dakkapel-per-materiaal", "de levensduurvergelijking")}.`,
        ],
      },
    ],
    faq: [
      { q: "Heeft elke dakkapel onderhoud nodig?", a: "Ja, ook onderhoudsarme uitvoeringen hebben periodieke controle nodig." },
      { q: "Wat slijt meestal het eerst?", a: "Vaak afwatering, kitnaden en aansluitingen." },
      { q: "Is hout veel onderhoudsgevoeliger?", a: "Ja, vooral qua schilderwerk en controle op verwering." },
    ],
    crossLink: "levensduur-dakkapel-per-materiaal",
    related: ["onderhoud-houten-dakkapel", "onderhoud-kunststof-dakkapel", "levensduur-dakkapel-per-materiaal"],
  },
  {
    slug: "onderhoud-houten-dakkapel",
    title: "Onderhoud houten dakkapel",
    metaTitle: "Onderhoud houten dakkapel: schilderwerk, controle en levensduur",
    metaDescription:
      "Lees hoe je een houten dakkapel onderhoudt en waar je op moet letten bij schilderwerk, kitnaden en slijtage.",
    intro:
      "Hout vraagt meer aandacht dan kunststof, maar blijft aantrekkelijk door uitstraling en detaillering. Goed onderhoud is dan ook de sleutel om die kwaliteit te behouden.",
    quickAnswer:
      "Onderhoud van een houten dakkapel draait vooral om controle van schilderwerk, naden, aansluitingen en beginnende slijtage. Regelmatig onderhoud verlengt de levensduur duidelijk.",
    tableRows: [
      ["Schilderwerk", "Regelmatig controleren", "Belangrijk tegen verwering"],
      ["Houtverbindingen", "Alert op scheuren", "Open naden geven risico op vocht"],
      ["Kit en aansluitingen", "Controleren", "Vocht dringt vaak via details binnen"],
      ["Afwatering", "Schoon houden", "Beschermt ook het schilderwerk"],
    ],
    factors: [
      "Zon, regen en ligging bepalen hoe snel schilderwerk slijt.",
      "Open naden en kleine beschadigingen moet je vroeg aanpakken.",
      "Goed onderhoud voorkomt dat esthetische schade constructief wordt.",
      "Niet elke offerte of leverancier beschrijft het onderhoud na oplevering even duidelijk.",
    ],
    examples: [
      { title: "Eerste jaren na plaatsing", text: "Juist dan is een goede onderhoudsroutine handig om vroeg slijtage te herkennen." },
      { title: "Oudere houten kapel", text: "Dan wordt schilderwerk en controle nog belangrijker." },
      { title: "Vergelijking met kunststof", text: `Zie ook ${articleLink("onderhoud-kunststof-dakkapel", "onderhoud van kunststof")}.` },
    ],
    tips: [
      "Controleer jaarlijks op scheurtjes, blazen en open naden.",
      "Wacht niet met bijwerken als een beschadiging zichtbaar wordt.",
      "Combineer onderhoud bij voorkeur met andere buiteninspecties aan het dak.",
    ],
    faq: [
      { q: "Waarom vraagt hout meer onderhoud?", a: "Omdat het materiaal gevoeliger is voor weersinvloed en schilderwerk nodig heeft." },
      { q: "Wat controleer je als eerste?", a: "Schilderwerk, verbindingen, kitnaden en afwatering." },
      { q: "Is hout dan een slechte keuze?", a: "Nee, zolang je het onderhoud bewust meeneemt." },
    ],
    crossLink: "lekkage-bij-dakkapel-oorzaken",
    related: ["houten-dakkapel", "houten-dakkapel-kosten", "levensduur-dakkapel-per-materiaal"],
  },
  {
    slug: "onderhoud-kunststof-dakkapel",
    title: "Onderhoud kunststof dakkapel",
    metaTitle: "Onderhoud kunststof dakkapel: schoonmaken, controleren en levensduur",
    metaDescription:
      "Lees hoe je een kunststof dakkapel onderhoudt en welke controlepunten ondanks het onderhoudsarme karakter belangrijk blijven.",
    intro:
      "Kunststof staat bekend als onderhoudsarm, maar onderhoudsvrij is het niet. Juist omdat veel mensen dat denken, worden rubbers, afwatering en kleine beschadigingen soms te laat opgemerkt.",
    quickAnswer:
      "Onderhoud van een kunststof dakkapel bestaat vooral uit schoonmaken, controleren van rubbers en hang- en sluitwerk en het vrijhouden van goten en afvoerpunten.",
    tableRows: [
      ["Schoonmaken", "Regelmatig", "Voorkomt aanslag en vervuiling"],
      ["Rubbers en beslag", "Inspecteren", "Belangrijk voor sluiting en waterdichtheid"],
      ["Afvoer en goten", "Vrijhouden", "Voorkomt waterophoping"],
      ["Schilderwerk", "Meestal niet nodig", "Wel afhankelijk van specifieke afwerking"],
    ],
    factors: [
      "Onderhoudsarm betekent vooral minder schilderwerk, niet nul aandacht.",
      "Afwatering en bewegende delen blijven echte onderhoudspunten.",
      "Schoonmaken met agressieve middelen is niet verstandig.",
      "Controle van rubbers en sluitwerk voorkomt comfort- en vochtproblemen.",
    ],
    examples: [
      { title: "Nieuw geplaatste kapel", text: "Direct een eenvoudig onderhoudsritme afspreken voorkomt verwaarlozing." },
      { title: "Kunststof met veel blad of vuil", text: "Dan zijn goten en afvoer sneller een aandachtspunt." },
      { title: "Levensduur", text: `Zie ook ${articleLink("levensduur-dakkapel-per-materiaal", "de levensduurvergelijking")}.` },
    ],
    tips: [
      "Gebruik milde reiniging en vermijd schurende middelen.",
      "Controleer na zware regenval of water goed wegloopt.",
      "Neem rubbers en beslag mee in een vaste jaarlijkse inspectie.",
    ],
    faq: [
      { q: "Moet een kunststof dakkapel geschilderd worden?", a: "In de regel niet." },
      { q: "Wat is het belangrijkste onderhoudspunt?", a: "Afwatering, rubbers en hang- en sluitwerk." },
      { q: "Waarom toch onderhoud als kunststof onderhoudsarm is?", a: "Omdat vuil, verstoppingen en slijtage aan details nog steeds problemen kunnen geven." },
    ],
    crossLink: "tocht-bij-dakkapel-oplossen",
    related: ["kunststof-dakkapel", "kunststof-dakkapel-kosten", "levensduur-dakkapel-per-materiaal"],
  },
  {
    slug: "lekkage-bij-dakkapel-oorzaken",
    title: "Lekkage bij dakkapel oorzaken",
    metaTitle: "Lekkage bij een dakkapel: oorzaken, eerste checks en aanpak",
    metaDescription:
      "Lees wat de meest voorkomende oorzaken zijn van lekkage bij een dakkapel en welke eerste controles je kunt doen.",
    intro:
      "Lekkage bij een dakkapel wordt vaak pas zichtbaar wanneer het probleem al wat langer speelt. Vochtplekken, verkleuring of druppels binnen zijn meestal het gevolg van een detail dat buiten al langer niet meer goed werkt.",
    quickAnswer:
      "Veelvoorkomende oorzaken van dakkapellekkage zijn versleten kitnaden, problemen met loodslabben, dakbedekking, afwatering of een onzorgvuldige aansluiting op het hoofddak.",
    tableRows: [
      ["Kitnaden", "Verdroogd of los", "Controleer randen en aansluitingen"],
      ["Loodslabben", "Scheur of slechte aansluiting", "Veelvoorkomende bron van lekkage"],
      ["Dakbedekking", "Verouderd of beschadigd", "Vooral bij platte dakkapeldaken"],
      ["Goten en afvoer", "Verstopt", "Water zoekt dan een andere route"],
    ],
    factors: [
      "Lekkage zit vaak in details, niet in het grote oppervlak.",
      "Slechte afwatering maakt kleine gebreken sneller erger.",
      "Oude kit of noodreparaties zijn vaak tijdelijke oplossingen.",
      "Bij terugkerende lekkage is een tweede inspectie vaak verstandig.",
    ],
    examples: [
      { title: "Vochtplek bij aansluiting", text: "Dat wijst vaak op kit, lood of aansluiting met het hoofddak." },
      { title: "Na hevige regen zichtbaar", text: "Dan speelt afwatering of waterbelasting vaak mee." },
      { title: "Onderhoudsrelatie", text: `Combineer deze pagina met ${articleLink("onderhoud-dakkapel", "de onderhoudsgids")} om herhaling te voorkomen.` },
    ],
    tips: [
      "Maak foto's van plekken binnen en buiten zodra het probleem zichtbaar is.",
      "Controleer eerst eenvoudige oorzaken zoals verstopping voordat je grote conclusies trekt.",
      "Laat terugkerende lekkage door een specialist beoordelen en niet alleen dichtkitten.",
    ],
    faq: [
      { q: "Wat is de meest voorkomende oorzaak van lekkage?", a: "Vaak zijn dat kitnaden, loodslabben of afwateringsproblemen." },
      { q: "Kan ik lekkage zelf oplossen?", a: "Kleine controles wel, maar structurele oorzaak en herstel vragen vaak vakwerk." },
      { q: "Waarom komt lekkage soms pas laat binnen in beeld?", a: "Omdat water een route aflegt voordat het zichtbaar wordt." },
    ],
    crossLink: "condens-bij-dakkapel",
    related: ["onderhoud-dakkapel", "wanneer-dakkapel-vervangen", "hoe-kies-je-een-goede-dakkapel-specialist"],
  },
  {
    slug: "condens-bij-dakkapel",
    title: "Condens bij dakkapel",
    metaTitle: "Condens bij een dakkapel: oorzaken en wat je eraan kunt doen",
    metaDescription:
      "Lees waarom condens bij een dakkapel ontstaat en hoe isolatie, ventilatie en gebruik samenhangen met vochtproblemen.",
    intro:
      "Condens wordt vaak verward met lekkage, maar de oorzaak ligt meestal in een combinatie van vochtproductie, ventilatie en temperatuurverschillen. Juist op zolders en in dakkapellen kan dat snel zichtbaar worden.",
    quickAnswer:
      "Condens bij een dakkapel ontstaat vaak wanneer warme, vochtige lucht onvoldoende weg kan en afkoelt op koudere oppervlakken of in een slecht geventileerde opbouw.",
    tableRows: [
      ["Beslagen ramen", "Binnenklimaat te vochtig", "Ventilatie verbeteren"],
      ["Vocht in hoeken", "Koudebrug of stilstaande lucht", "Isolatie en ventilatie samen bekijken"],
      ["Na douche of slapen erger", "Gebruiksvocht", "Gebruik en ventilatie spelen mee"],
      ["Structureel probleem", "Opbouwfout mogelijk", "Laat de constructie controleren"],
    ],
    factors: [
      "Ventilatie en isolatie moeten op elkaar aansluiten.",
      "Een luchtdichte opbouw zonder goede ventilatie vergroot het risico.",
      "Gebruiksvocht van slapen, wassen of drogen op zolder kan een grote rol spelen.",
      "Condens kan wijzen op kleine koudebruggen of onjuiste opbouwlagen.",
    ],
    examples: [
      { title: "Winter en koude nachten", text: "Dan wordt condens vaak het eerst zichtbaar op glas en koude hoeken." },
      { title: "Net geïsoleerde ruimte", text: "Juist dan kan ventilatie ineens te weinig blijken." },
      { title: "Plaatsing combineren", text: `Daarom is ${articleLink("dakkapel-isoleren-tijdens-plaatsing", "isolatie tijdens plaatsing")} zo belangrijk.` },
    ],
    tips: [
      "Ventileer consequent en laat vochtproducerende activiteiten niet te lang in de ruimte hangen.",
      "Controleer of roosters, ramen en afzuiging goed werken.",
      "Laat hardnekkige condens beoordelen als ventilatieverbetering niet helpt.",
    ],
    faq: [
      { q: "Is condens hetzelfde als lekkage?", a: "Nee, condens ontstaat meestal door binnenklimaat en opbouw, lekkage door water van buiten." },
      { q: "Waarom is het in een dakkapel extra zichtbaar?", a: "Door temperatuurverschillen en de specifieke opbouw van de ruimte." },
      { q: "Kun je het alleen met ventileren oplossen?", a: "Soms wel, maar bij opbouwfouten of koudebruggen is meer nodig." },
    ],
    crossLink: "dakkapel-isoleren-tijdens-plaatsing",
    related: ["tocht-bij-dakkapel-oplossen", "dakkapel-isoleren-tijdens-plaatsing", "onderhoud-dakkapel"],
  },
  {
    slug: "tocht-bij-dakkapel-oplossen",
    title: "Tocht bij dakkapel oplossen",
    metaTitle: "Tocht bij een dakkapel oplossen: oorzaken en praktische checks",
    metaDescription:
      "Lees waar tocht bij een dakkapel vandaan kan komen en welke controles je kunt doen om comfortproblemen op te lossen.",
    intro:
      "Tocht bij een dakkapel voelt soms als een klein comfortprobleem, maar is vaak een aanwijzing dat naden, aansluitingen, rubbers of isolatie niet optimaal functioneren. Daardoor is dit een nuttig signaal om serieus te nemen.",
    quickAnswer:
      "Tocht ontstaat meestal door kieren, slechte aansluitingen, versleten rubbers, onvoldoende isolatie of een combinatie daarvan. De eerste stap is altijd lokaliseren waar de luchtstroom precies vandaan komt.",
    tableRows: [
      ["Ramen en rubbers", "Slijtage of afstelling", "Controleer sluiting en kierdichting"],
      ["Aansluiting op dak of wand", "Kierdichting probleem", "Kan comfort én energieverlies geven"],
      ["Binnenafwerking", "Onvolledige afwerking", "Achter koven of dagkanten kan tocht ontstaan"],
      ["Ventilatieroosters", "Normale luchtstroom", "Niet elke luchtbeweging is een defect"],
    ],
    factors: [
      "Tocht hoeft niet altijd van buitenwaterdichting te komen; ook afwerking binnen speelt mee.",
      "Versleten rubbers of slecht sluitende ramen worden vaak pas laat opgemerkt.",
      "Bij oudere dakkapellen zijn kierproblemen vaker onderdeel van normale veroudering.",
      "Een comfortprobleem kan ook extra stookkosten betekenen.",
    ],
    examples: [
      { title: "Tocht rond raam", text: "Hier zijn rubbers of afstelling vaak de eerste verdachten." },
      { title: "Tocht uit de aftimmering", text: "Dan is de binnenopbouw of kierdichting verdacht." },
      { title: "Relatie met condens", text: `Bekijk ook ${articleLink("condens-bij-dakkapel", "condensproblemen")} als er tegelijk vocht optreedt.` },
    ],
    tips: [
      "Voel systematisch langs naden, raamprofielen en aansluitingen.",
      "Maak onderscheid tussen normale ventilatie en ongewenste luchtlekken.",
      "Laat terugkerende tochtklachten combineren met inspectie van afwerking en sluitwerk.",
    ],
    faq: [
      { q: "Komt tocht vaak door slechte montage?", a: "Dat kan, maar ook verouderde rubbers of onvolledige afwerking spelen vaak mee." },
      { q: "Kan tocht schade geven?", a: "Het geeft vooral comfortverlies en energieverlies, maar kan samen met vocht ook andere klachten verergeren." },
      { q: "Waar begin ik met controleren?", a: "Bij ramen, rubbers, naden en aansluitingen." },
    ],
    crossLink: "onderhoud-kunststof-dakkapel",
    related: ["condens-bij-dakkapel", "onderhoud-kunststof-dakkapel", "onderhoud-houten-dakkapel"],
  },
  {
    slug: "levensduur-dakkapel-per-materiaal",
    title: "Levensduur dakkapel per materiaal",
    metaTitle: "Levensduur van een dakkapel per materiaal: kunststof, hout en polyester",
    metaDescription:
      "Lees hoe de levensduur van een dakkapel verschilt per materiaal en hoe onderhoud die levensduur beïnvloedt.",
    intro:
      "De levensduur van een dakkapel hangt niet alleen van materiaal af, maar ook van kwaliteit van plaatsing en onderhoud. Toch geeft materiaal wel een duidelijke eerste indicatie van wat je op lange termijn mag verwachten.",
    quickAnswer:
      "Kunststof en polyester worden vaak gezien als onderhoudsarm met een lange levensduur, terwijl hout sterk afhankelijk is van goed schilderwerk en periodieke controle. Slechte detaillering verkort elk materiaaltype.",
    tableRows: [
      ["Kunststof", "Lang en onderhoudsarm", "Regelmatige controle blijft nodig"],
      ["Hout", "Goed bij goed onderhoud", "Meer afhankelijk van schilderwerk en bescherming"],
      ["Polyester", "Lang", "Strakke afwerking en weinig onderhoud vaak als pluspunt genoemd"],
      ["Constructie en details", "Doorslaggevend", "Slechte plaatsing verkort elk materiaaltype"],
    ],
    factors: [
      "Materiaal bepaalt onderhoudsbehoefte, maar uitvoering bepaalt duurzaamheid.",
      "Aansluitingen, dakbedekking en afwatering zijn net zo belangrijk als het gevelmateriaal.",
      "Goed onderhoud kan de levensduur merkbaar verlengen.",
      "De goedkoopste optie is niet altijd het voordeligst op lange termijn.",
    ],
    examples: [
      { title: "Onderhoudsarme focus", text: "Dan komen kunststof en polyester vaak bovendrijven." },
      { title: "Klassieke uitstraling", text: "Dan blijft hout aantrekkelijk, maar onderhoud hoort erbij." },
      { title: "Investering", text: `Koppel levensduur altijd aan ${articleLink("wanneer-is-een-dakkapel-een-goede-investering", "de investeringsafweging")}.` },
    ],
    tips: [
      "Kijk niet alleen naar levensduurclaims, maar ook naar garantie en onderhoudsadvies.",
      "Vraag hoe de leverancier de kritische aansluitingen uitvoert.",
      "Plan onderhoud voordat klachten ontstaan, niet erna.",
    ],
    faq: [
      { q: "Gaat kunststof langer mee dan hout?", a: "Vaak wordt kunststof onderhoudsarmer gevonden, maar goed onderhouden hout kan ook lang meegaan." },
      { q: "Is polyester duurzaam?", a: "Ja, polyester wordt juist vaak gekozen vanwege een lange levensduur en weinig onderhoud." },
      { q: "Wat verkort de levensduur het meest?", a: "Slechte detailing, achterstallig onderhoud en vochtproblemen." },
    ],
    crossLink: "wanneer-dakkapel-vervangen",
    related: ["onderhoud-dakkapel", "wanneer-dakkapel-vervangen", "polyester-dakkapel"],
  },
  {
    slug: "wanneer-dakkapel-vervangen",
    title: "Wanneer dakkapel vervangen",
    metaTitle: "Wanneer een dakkapel vervangen? Signalen en afwegingen",
    metaDescription:
      "Lees wanneer repareren niet meer genoeg is en wanneer vervanging van een dakkapel logischer wordt.",
    intro:
      "Niet elke klacht betekent dat een dakkapel direct vervangen moet worden. Soms is onderhoud of herstel genoeg, maar soms stapelen leeftijd, schade en comfortproblemen zich op tot een moment waarop vervanging logischer wordt.",
    quickAnswer:
      "Vervanging komt in beeld wanneer structurele schade, terugkerende lekkage, verouderde opbouw en hoge onderhoudslasten samenkomen en herstel geen duurzame oplossing meer biedt.",
    tableRows: [
      ["Kleine schade", "Vaak herstelbaar", "Denk aan kit, schilderwerk of detailherstel"],
      ["Terugkerende lekkage", "Waarschuwingssignaal", "Zoek naar structurele oorzaak"],
      ["Sterk verouderde opbouw", "Vervanging realistischer", "Zeker als meerdere delen tegelijk slijten"],
      ["Wens tot grotere upgrade", "Vervanging kansrijk", "Bij ruimtewinst of energiewens"],
    ],
    factors: [
      "Leeftijd alleen is niet genoeg; de staat van onderhoud is minstens zo belangrijk.",
      "Terugkerende vochtklachten wijzen vaker op een fundamenteel probleem.",
      "Ook comfort, isolatie en uitstraling kunnen reden zijn om niet meer te repareren.",
      "Vergelijk herstelkosten altijd met de meerwaarde van een nieuwe, betere oplossing.",
    ],
    examples: [
      { title: "Oude houten dakkapel", text: "Hier kan vervanging logischer zijn wanneer meerdere onderhoudsposten tegelijk spelen." },
      { title: "Terugkerende lekkage", text: "Als de oorzaak telkens terugkomt, wordt opnieuw herstellen minder aantrekkelijk." },
      { title: "Upgrade overwegen", text: `Combineer deze afweging met ${articleLink("wanneer-is-een-dakkapel-een-goede-investering", "de investeringsvraag")}.` },
    ],
    tips: [
      "Laat bij twijfel een specialist zowel herstel als vervanging doorrekenen.",
      "Kijk niet alleen naar schade, maar ook naar comfort, isolatie en gebruikswaarde.",
      "Vraag bij vervanging meteen naar huidige materiaal- en onderhoudskeuzes.",
    ],
    faq: [
      { q: "Wanneer is vervangen slimmer dan repareren?", a: "Als klachten terugkeren en meerdere delen tegelijk aan het einde van hun levensduur zitten." },
      { q: "Is leeftijd alleen genoeg reden?", a: "Nee, staat en prestaties zijn belangrijker." },
      { q: "Moet je dan weer helemaal opnieuw naar vergunning kijken?", a: "Dat hangt af van de omvang van de vervanging en of het ontwerp verandert." },
    ],
    crossLink: "levensduur-dakkapel-per-materiaal",
    related: ["lekkage-bij-dakkapel-oorzaken", "levensduur-dakkapel-per-materiaal", "wanneer-is-een-dakkapel-een-goede-investering"],
  },
].forEach(buildMaintenanceGuide);

[
  {
    slug: "prefab-of-traditionele-dakkapel",
    title: "Prefab vs traditionele dakkapel",
    metaTitle: "Prefab vs traditionele dakkapel: wat past het best bij jouw woning?",
    metaDescription:
      "Vergelijk prefab en traditionele dakkapellen op prijs, snelheid, maatwerk en afwerking en ontdek wat het beste bij jouw woning past.",
    intro:
      "Prefab en traditioneel worden vaak in één adem genoemd, maar ze lossen niet precies hetzelfde probleem op. De ene route wint vaak op snelheid en prijs, de andere op maatwerk en uitstraling.",
    quickAnswer:
      "Prefab is meestal slimmer als je snelheid, voorspelbaarheid en een scherpe prijs zoekt. Traditioneel wordt sterker wanneer maatwerk, architectuur en specifieke afwerking belangrijker zijn.",
    linkA: "prefab-dakkapel",
    linkB: "traditionele-dakkapel",
    tableRows: [
      ["Prijs", "Prefab vaak gunstiger", "Traditioneel meestal hoger"],
      ["Snelheid", "Prefab vaak sneller", "Traditioneel meer bouwtijd op locatie"],
      ["Maatwerk", "Beperkter", "Traditioneel sterker"],
      ["Overlast", "Minder bouwtijd", "Meer werkzaamheden op locatie"],
    ],
    factors: [
      "Bouwmethode moet passen bij je dak en wensen, niet alleen bij je budget.",
      "Traditioneel loont vooral wanneer standaardmaten of systemen niet passen.",
      "Prefab wint vaak wanneer snelheid en duidelijkheid prioriteit hebben.",
      "Ook garantie en afwerking moet je meewegen in de keuze.",
    ],
    examples: [
      { title: "Standaard rijwoning", text: "Prefab komt hier vaak sterk uit de vergelijking." },
      { title: "Bijzondere kap of karakterpand", text: "Traditioneel krijgt dan meer gewicht." },
      { title: "Offerte lezen", text: `Laat beide routes naast elkaar offreren via ${articleLink("offerte-dakkapel-vergelijken", "meerdere offertes")}.` },
    ],
    tips: [
      "Vraag niet alleen wat goedkoper is, maar ook wat technisch en esthetisch het beste past.",
      "Laat planning, vergunning en binnenafwerking in beide varianten meenemen.",
      "Controleer of de vergeleken offertes echt hetzelfde afwerkingsniveau hebben.",
    ],
    faq: [
      { q: "Is prefab altijd goedkoper?", a: "In standaard situaties meestal wel, maar niet elk project is standaard." },
      { q: "Wanneer kies je traditioneel?", a: "Vooral wanneer maatwerk of uitstraling zwaarder weegt." },
      { q: "Is prefab van mindere kwaliteit?", a: "Niet automatisch. Kwaliteit hangt vooral af van ontwerp, materiaal en uitvoering." },
    ],
    related: ["prefab-dakkapel-kosten", "traditionele-dakkapel-kosten", "offerte-dakkapel-vergelijken"],
  },
  {
    slug: "kunststof-of-houten-dakkapel",
    title: "Kunststof of houten dakkapel",
    metaTitle: "Kunststof of houten dakkapel: wat is slimmer voor jouw woning?",
    metaDescription:
      "Vergelijk kunststof en houten dakkapellen op prijs, onderhoud, uitstraling en levensduur en maak een betere keuze.",
    intro:
      "Deze vergelijking draait om een van de meest praktische materiaalkeuzes in het dakkapeltraject. Kunststof wint vaak op onderhoud en voorspelbaarheid, hout op uitstraling en karakter.",
    quickAnswer:
      "Kunststof is vaak slimmer als je weinig onderhoud wilt en strak op prijs wilt sturen. Hout past beter wanneer uitstraling en aansluiting op een karaktervolle woning belangrijk zijn.",
    linkA: "kunststof-dakkapel",
    linkB: "houten-dakkapel",
    tableRows: [
      ["Onderhoud", "Laag bij kunststof", "Hoger bij hout"],
      ["Uitstraling", "Strak en modern", "Warm en klassiek"],
      ["Prijs", "Vaak gunstiger", "Vaak wat hoger"],
      ["Langetermijnwerk", "Minder schilderwerk", "Meer periodieke aandacht"],
    ],
    factors: [
      "De woningstijl bepaalt vaak welke keuze visueel het beste werkt.",
      "Onderhoudslast telt zwaarder als je lang in de woning blijft.",
      "Hout hoeft niet onlogisch te zijn als uitstraling de hoofdrol speelt.",
      "De beste keuze combineert prijs, beeld en onderhoud realistischer dan alleen een eerste offerte.",
    ],
    examples: [
      { title: "Nieuwbouwwoning", text: "Hier is kunststof vaak de logische standaard." },
      { title: "Jaren-30 woning", text: "Daar wint hout esthetisch vaker punten." },
      { title: "Langetermijnkeuze", text: `Neem ook ${articleLink("onderhoud-houten-dakkapel", "houtonderhoud")} en ${articleLink("onderhoud-kunststof-dakkapel", "kunststofonderhoud")} mee.` },
    ],
    tips: [
      "Laat beide materialen offreren op exact dezelfde maat en indeling.",
      "Vraag naar onderhoudsadvies over meerdere jaren, niet alleen naar aanschafprijs.",
      "Kijk naar foto's van vergelijkbare woningen, niet alleen losse productbeelden.",
    ],
    faq: [
      { q: "Is kunststof goedkoper dan hout?", a: "Vaak wel, zeker als onderhoud meeweegt." },
      { q: "Waarom kiezen mensen toch voor hout?", a: "Voor uitstraling en aansluiting op karaktervolle woningen." },
      { q: "Welke keuze is slimmer op lange termijn?", a: "Dat hangt af van hoe belangrijk onderhoudsarm wonen voor je is." },
    ],
    related: ["kunststof-dakkapel-kosten", "houten-dakkapel-kosten", "onderhoud-houten-dakkapel"],
  },
  {
    slug: "beste-breedte-voor-een-dakkapel",
    title: "Beste breedte voor een dakkapel",
    metaTitle: "Beste breedte voor een dakkapel: hoe kies je slim tussen 3, 4 of 5 meter?",
    metaDescription:
      "Lees hoe je de beste breedte voor een dakkapel kiest en wanneer 3, 4 of 5 meter logisch is voor jouw woning.",
    intro:
      "De beste breedte is niet automatisch de grootste breedte die op het dak past. Het gaat om de juiste balans tussen ruimtewinst, kosten, constructie en uitstraling.",
    quickAnswer:
      "Voor veel woningen is 3 of 4 meter de meest logische bandbreedte. 5 meter wordt vooral interessant als maximale ruimtewinst belangrijker is dan een strakker budget en eenvoudige uitvoering.",
    linkA: "dakkapel-kosten-3-meter",
    linkB: "dakkapel-kosten-5-meter",
    tableRows: [
      ["3 meter", "Balans tussen prijs en ruimte", "Veelgekozen standaardmaat"],
      ["4 meter", "Meer ruimte", "Hogere investering en vaker extra voorbereiding"],
      ["5 meter", "Maximale ruimte", "Hoger budget en constructieve aandacht"],
      ["Kleine maat", "Budgetvriendelijk", "Minder grote impact op bruikbare ruimte"],
    ],
    factors: [
      "Kijk naar functie van de kamer: opbergzolder, slaapkamer of volwaardige verdieping.",
      "De extra ruimte moet opwegen tegen de meerprijs per meter.",
      "Grotere breedtes vragen vaker om constructieve of vergunningstechnische aandacht.",
      "Ook het gevelbeeld en de verhouding op het dak zijn relevant.",
    ],
    examples: [
      { title: "Slaapkamer maken", text: "Dan blijkt 3 of 4 meter vaak al ruim voldoende." },
      { title: "Volwaardige verdieping", text: "Dan wordt 5 meter of breder eerder interessant." },
      { title: "Breedte naast kosten", text: `Vergelijk daarom altijd ${articleLink("dakkapel-kosten-per-meter", "de kosten per meter")} met de ruimtewinst.` },
    ],
    tips: [
      "Laat twee breedtes offreren en vergelijk de meerprijs per stap.",
      "Maak een simpele plattegrond om de ruimtelijke winst concreet te zien.",
      "Kijk niet alleen naar dakmaat, maar ook naar binnengebruik en meubelindeling.",
    ],
    faq: [
      { q: "Is 3 meter meestal genoeg?", a: "Voor veel slaapkamers of werkplekken wel." },
      { q: "Wanneer is 5 meter logisch?", a: "Als maximale ruimtewinst echt voorop staat." },
      { q: "Moet ik breedte alleen op prijs kiezen?", a: "Nee, gebruik, constructie en uitstraling tellen net zo goed mee." },
    ],
    related: ["dakkapel-kosten-per-meter", "dakkapel-kosten-3-meter", "dakkapel-kosten-4-meter"],
  },
  {
    slug: "woningwaarde-dakkapel",
    title: "Verhoogt een dakkapel de woningwaarde?",
    metaTitle: "Verhoogt een dakkapel de woningwaarde? Rendement en afweging",
    metaDescription:
      "Lees of een dakkapel de woningwaarde verhoogt en wanneer de investering zich vaak beter terugverdient.",
    intro:
      "Een dakkapel wordt vaak niet alleen gekocht voor extra comfort, maar ook als investering in de woning. De vraag is dan niet alleen wat het kost, maar ook wat het oplevert aan bruikbare ruimte en aantrekkelijkheid bij verkoop.",
    quickAnswer:
      "Een dakkapel kan de woningwaarde verhogen, vooral wanneer de zolder hierdoor echt bruikbaar wordt als kamer. Hoe groot dat effect is, hangt af van locatie, kwaliteit, maat en afwerking.",
    linkA: "wat-kost-een-dakkapel",
    linkB: "wanneer-is-een-dakkapel-een-goede-investering",
    tableRows: [
      ["Extra bruikbare ruimte", "Positief effect", "Vaak belangrijker dan de kapel zelf"],
      ["Kwaliteit van uitvoering", "Groot verschil", "Netjes afgewerkt verkoopt sterker"],
      ["Ligging en woningtype", "Sterk bepalend", "Marktwaarde verschilt per regio"],
      ["Onderhoudsstaat", "Telt mee", "Gebreken drukken het rendement"],
    ],
    factors: [
      "Een bruikbare extra kamer telt zwaarder dan alleen een mooier dak.",
      "Netto rendement hangt af van aankoopprijs, afwerking en woningmarkt.",
      "Een slecht onderhouden dakkapel levert minder op dan een nette, goed afgewerkte uitvoering.",
      "Waarde is niet alleen verkoopwaarde maar ook dagelijks gebruikscomfort.",
    ],
    examples: [
      { title: "Zolder wordt slaapkamer", text: "Dat is vaak de situatie waarin meerwaarde het duidelijkst voelbaar wordt." },
      { title: "Kleine cosmetische ingreep", text: "Dan is het effect op waarde kleiner dan veel mensen hopen." },
      { title: "Investering toetsen", text: `Koppel deze vraag aan ${articleLink("wanneer-is-een-dakkapel-een-goede-investering", "wanneer de investering logisch is")}.` },
    ],
    tips: [
      "Kijk naar ruimtewinst, niet alleen naar bouwkosten.",
      "Zorg dat de afwerking bij het woningniveau past.",
      "Neem onderhoud en levensduur mee in je rendementsoverweging.",
    ],
    faq: [
      { q: "Levert een dakkapel altijd meer woningwaarde op?", a: "Niet automatisch, maar vaak wel als de zolder er echt bruikbaarder door wordt." },
      { q: "Is nette afwerking belangrijk voor de waarde?", a: "Ja, kwaliteit en uitstraling tellen mee in hoe kopers het beoordelen." },
      { q: "Moet ik het alleen als investering zien?", a: "Nee, dagelijks comfort en gebruik zijn minstens zo belangrijk." },
    ],
    related: ["wanneer-is-een-dakkapel-een-goede-investering", "wat-kost-een-dakkapel", "levensduur-dakkapel-per-materiaal"],
  },
  {
    slug: "wanneer-is-een-dakkapel-een-goede-investering",
    title: "Wanneer is een dakkapel een goede investering",
    metaTitle: "Wanneer is een dakkapel een goede investering? Zo maak je de afweging",
    metaDescription:
      "Lees wanneer een dakkapel financieel en praktisch een goede investering is en welke factoren je mee moet nemen in de afweging.",
    intro:
      "Een dakkapel is een goede investering wanneer de extra ruimte, het wooncomfort en de mogelijke waardestijging opwegen tegen kosten, onderhoud en uitvoering. Die afweging is persoonlijk, maar wel systematisch te maken.",
    quickAnswer:
      "Een dakkapel is vooral een goede investering als de ruimtewinst direct bruikbaar is, de uitvoering goed aansluit op de woning en de totale kosten realistisch blijven ten opzichte van wat je ervoor terugkrijgt.",
    linkA: "wat-kost-een-dakkapel",
    linkB: "woningwaarde-dakkapel",
    tableRows: [
      ["Ruimtewinst", "Hoog gewicht", "Hoe meer bruikbare meters, hoe interessanter de investering"],
      ["Totale kosten", "Goed controleren", "Neem montage, binnenafwerking en vergunning mee"],
      ["Woningwaarde", "Positief maar wisselend", "Niet in elke situatie even sterk"],
      ["Onderhoud en levensduur", "Meenemen", "Lage aanschafprijs is niet altijd de slimste keuze"],
    ],
    factors: [
      "Een dakkapel is vaak vooral een wooninvestering met mogelijk extra waardeeffect.",
      "De maat en kwaliteit van uitvoering bepalen het nut in het dagelijks gebruik.",
      "Wie toch binnen enkele jaren verhuist, kijkt anders naar rendement dan iemand die lang blijft wonen.",
      "Onderhoud en materiaalkeuze beïnvloeden de totale eigendomskosten.",
    ],
    examples: [
      { title: "Zolder wordt volwaardige kamer", text: "Dan is de investering vaak het makkelijkst te verdedigen." },
      { title: "Kleine uitbreiding zonder duidelijke gebruikswinst", text: "Dan voelt de investering sneller minder logisch." },
      { title: "Langetermijnblik", text: `Neem ook ${articleLink("levensduur-dakkapel-per-materiaal", "levensduur en onderhoud")} mee in je berekening.` },
    ],
    tips: [
      "Bereken niet alleen de aanschafprijs, maar ook onderhoud en afwerkingskosten.",
      "Kijk naar comfort, gebruikswaarde en doorverkoop tegelijk.",
      "Vergelijk minstens twee uitvoeringen om te zien welke investering het beste voelt.",
    ],
    faq: [
      { q: "Is een dakkapel altijd rendabel?", a: "Niet automatisch, maar vaak wel als je de ruimte echt intensief gebruikt." },
      { q: "Telt woningwaarde zwaar mee?", a: "Ja, maar comfort en bruikbare ruimte zijn vaak minstens zo belangrijk." },
      { q: "Hoe maak ik de afweging?", a: "Door kosten, ruimtewinst, onderhoud en waardeeffect samen te bekijken." },
    ],
    related: ["woningwaarde-dakkapel", "wat-kost-een-dakkapel", "levensduur-dakkapel-per-materiaal"],
  },
].forEach(buildDecisionGuide);

[
  {
    slug: "offerte-dakkapel-vergelijken",
    title: "Offerte dakkapel vergelijken",
    metaTitle: "Offerte dakkapel vergelijken: zo voorkom je appels-met-peren offertes",
    metaDescription:
      "Lees hoe je een dakkapel offerte vergelijkt en welke onderdelen altijd duidelijk in de vergelijking moeten terugkomen.",
    intro:
      "Offertes vergelijken lijkt eenvoudig, maar bij dakkapellen lopen inhoud en oplevering sterk uiteen. Daardoor kun je alleen goed vergelijken als je prijs, inhoud en planning tegelijk beoordeelt.",
    quickAnswer:
      "Vergelijk een dakkapelofferte nooit alleen op totaalprijs. Kijk altijd ook naar maat, materiaal, beglazing, montage, afwerking, garantie en eventuele vergunning- of constructieposten.",
    tableRows: [
      ["Maat en type", "Basis van de vergelijking", "Alle offertes moeten dezelfde uitgangspunten hebben"],
      ["Montage en logistiek", "Grote prijsverschillen", "Kraan, steiger en afvoer expliciet maken"],
      ["Binnenafwerking", "Vaak vergeten", "Bepaalt of de ruimte bruikbaar wordt opgeleverd"],
      ["Garantie en planning", "Net zo belangrijk", "Lage prijs zonder duidelijkheid is riskant"],
    ],
    factors: [
      "Een lage offerte is soms gewoon een minder complete offerte.",
      "Vooral montage, afwerking en garantie worden niet altijd even duidelijk benoemd.",
      "Wie prefab en traditioneel vergelijkt zonder dat te beseffen, vergelijkt twee verschillende producten.",
      "Een goede offertevergelijking vraagt om dezelfde scope op papier.",
    ],
    examples: [
      { title: "Goedkope basisofferte", text: "Lijkt aantrekkelijk, maar blijkt vaak minder compleet op afwerking en logistiek." },
      { title: "Duurdere maar complete offerte", text: "Kan uiteindelijk realistischer en veiliger zijn." },
      { title: "Vergelijkingshulp", text: `Gebruik ook ${articleLink("checklist-dakkapel-offerte", "de checklist")} en ${articleLink("fouten-vergelijken-dakkapel-offertes", "veelgemaakte fouten")}.` },
    ],
    tips: [
      "Leg offertes in een eigen vergelijkingstabel naast elkaar.",
      "Vraag leveranciers om ontbrekende posten alsnog te specificeren.",
      "Vergelijk planning, garantie en afwerking net zo hard als het totaalbedrag.",
    ],
    faq: [
      { q: "Wat is de grootste fout bij offertevergelijking?", a: "Alleen naar de totaalprijs kijken." },
      { q: "Moet ik verschillende bouwmethodes apart beoordelen?", a: "Ja, prefab en traditioneel moet je niet als één-op-één gelijk product behandelen." },
      { q: "Waarom is binnenafwerking zo belangrijk?", a: "Omdat die vaak bepaalt of de oplevering echt compleet is." },
    ],
    related: ["checklist-dakkapel-offerte", "fouten-vergelijken-dakkapel-offertes", "waar-moet-je-op-letten-bij-aannemer"],
  },
  {
    slug: "checklist-dakkapel-offerte",
    title: "Checklist dakkapel offerte",
    metaTitle: "Checklist dakkapel offerte: wat moet er minimaal in staan?",
    metaDescription:
      "Gebruik deze checklist om een dakkapel offerte te controleren op maat, materiaal, montage, afwerking, planning en garantie.",
    intro:
      "Een checklist is de snelste manier om onduidelijke of onvolledige offertes te ontmaskeren. Hoe concreter de omschrijving, hoe beter je kunt vergelijken.",
    quickAnswer:
      "Een goede dakkapelofferte noemt minimaal de maat, het type, materiaal, beglazing, montage, planning, afwerking, garantie en alle mogelijke meerwerkposten.",
    tableRows: [
      ["Afmetingen en type", "Moet exact zijn", "Zonder maat is prijsvergelijking zinloos"],
      ["Materiaal en kozijnen", "Concreet benoemd", "Geen vage productomschrijvingen"],
      ["Montage en afvoer", "Uitgeschreven", "Controleer logistieke posten"],
      ["Binnenafwerking", "Wel of niet inbegrepen", "Heel vaak bron van misverstand"],
      ["Garantie", "Zichtbaar", "Niet alleen mondeling bespreken"],
    ],
    factors: [
      "Vage offertes maken vergelijken moeilijk en discussies waarschijnlijker.",
      "Bouwmethodes, materialen en oplevering moeten specifiek op papier staan.",
      "Meerwerk ontstaat vaak juist bij de posten die niet expliciet benoemd zijn.",
      "Een goede checklist voorkomt dat je achteraf dingen 'erbij' koopt.",
    ],
    examples: [
      { title: "Volledige offerte", text: "Hierin staat niet alleen het product, maar ook hoe en wanneer het wordt opgeleverd." },
      { title: "Vage offerte", text: "Die gebruikt algemene termen zonder maat, materiaal of afwerkingsniveau te specificeren." },
      { title: "Praktische controle", text: `Gebruik de checklist samen met ${articleLink("offerte-dakkapel-vergelijken", "de vergelijkpagina")} en ${articleLink("waar-moet-je-op-letten-bij-aannemer", "de aannemercheck")}.` },
    ],
    tips: [
      "Vraag ontbrekende punten altijd zwart-op-wit op voordat je tekent.",
      "Gebruik de checklist ook in het gesprek met de leverancier.",
      "Sla een offerte op met aantekeningen zodat je later weet wat is besproken.",
    ],
    faq: [
      { q: "Wat ontbreekt het vaakst in een offerte?", a: "Binnenafwerking, logistieke posten en heldere garantieomschrijving." },
      { q: "Moet maat exact in de offerte staan?", a: "Ja, anders is vergelijken onbetrouwbaar." },
      { q: "Is garantie echt zo belangrijk?", a: "Ja, zeker bij een dakdoorbreking waar waterdichtheid cruciaal is." },
    ],
    related: ["offerte-dakkapel-vergelijken", "waar-moet-je-op-letten-bij-aannemer", "veelgemaakte-fouten-bij-dakkapel-plaatsing"],
  },
  {
    slug: "waar-moet-je-op-letten-bij-aannemer",
    title: "Waar moet je op letten bij aannemer",
    metaTitle: "Waar moet je op letten bij een aannemer voor een dakkapel?",
    metaDescription:
      "Lees waar je op moet letten bij het kiezen van een aannemer voor een dakkapel en hoe je betrouwbaarheid en vakmanschap beter beoordeelt.",
    intro:
      "De aannemer of specialist bepaalt uiteindelijk hoe goed de dakkapel wordt uitgevoerd. Daarom is dit geen bijzaak naast de offerte, maar een kernonderdeel van de kwaliteit van het project.",
    quickAnswer:
      "Let bij een aannemer vooral op ervaring met vergelijkbare projecten, duidelijkheid in de offerte, planning, garantie, communicatie en de manier waarop vergunning en afwerking worden meegenomen.",
    tableRows: [
      ["Ervaring", "Liefst aantoonbaar", "Vraag naar vergelijkbare projecten"],
      ["Offertekwaliteit", "Concreet en volledig", "Vage offertes zijn een risico"],
      ["Garantie en nazorg", "Moet duidelijk zijn", "Belangrijk bij waterdichting"],
      ["Communicatie", "Praktisch en helder", "Voorkomt fouten in planning en uitvoering"],
    ],
    factors: [
      "Ervaring met dakkapellen is belangrijker dan algemene bouwervaring alleen.",
      "Een goede aannemer denkt ook mee over voorbereiding en vergunning.",
      "Reageert iemand traag of onduidelijk in de offertefase, dan zegt dat vaak ook iets over de uitvoering.",
      "Vraag naar wie het werk daadwerkelijk uitvoert en hoe toezicht is geregeld.",
    ],
    examples: [
      { title: "Mooie prijs, weinig detail", text: "Dat is meestal geen goed teken." },
      { title: "Duidelijke planning en referenties", text: "Dat geeft meer vertrouwen in de uitvoering." },
      { title: "Koppeling met offerte", text: `Gebruik deze afweging ook naast ${articleLink("hoe-kies-je-een-goede-dakkapel-specialist", "de specialistkeuze")} en ${articleLink("checklist-dakkapel-offerte", "de offertechecklist")}.` },
    ],
    tips: [
      "Vraag naar recente projecten die vergelijkbaar zijn met jouw woning.",
      "Beoordeel hoe compleet en duidelijk iemand communiceert vóór de opdracht.",
      "Kies niet automatisch de goedkoopste aanbieder als onduidelijkheid groot blijft.",
    ],
    faq: [
      { q: "Wat is belangrijker: prijs of ervaring?", a: "Ervaring en duidelijkheid wegen zwaar, zeker bij een dakingreep." },
      { q: "Moet een aannemer ook over vergunning kunnen meedenken?", a: "Bij voorkeur wel, zeker in complexere situaties." },
      { q: "Hoe herken je een zwakke partij?", a: "Vaagheid in offerte, planning en verantwoordelijkheid is vaak een rode vlag." },
    ],
    related: ["hoe-kies-je-een-goede-dakkapel-specialist", "offerte-dakkapel-vergelijken", "veelgemaakte-fouten-bij-dakkapel-plaatsing"],
  },
  {
    slug: "hoe-kies-je-een-goede-dakkapel-specialist",
    title: "Hoe kies je een goede dakkapel specialist",
    metaTitle: "Hoe kies je een goede dakkapel specialist? Praktische selectiecriteria",
    metaDescription:
      "Lees hoe je een goede dakkapel specialist kiest en welke signalen helpen om kwaliteit, ervaring en betrouwbaarheid te beoordelen.",
    intro:
      "Niet elke partij die dakkapellen aanbiedt, heeft dezelfde rol. Sommige bedrijven zijn vooral leverancier, andere regelen ook vergunning, plaatsing en afwerking. Daarom is het slim om vooraf duidelijk te hebben wat jij precies van een specialist verwacht.",
    quickAnswer:
      "Een goede dakkapel specialist herken je aan ervaring met jouw type woning, een duidelijke offerte, realistische planning, heldere garantie en een aanpak die verder gaat dan alleen de verkoop van een product.",
    tableRows: [
      ["Projectervaring", "Belangrijk", "Liefst vergelijkbaar met jouw situatie"],
      ["Aanpak", "Volledig of deels", "Wie regelt wat precies?"],
      ["Offerte", "Duidelijk", "Concreet in maat, afwerking en planning"],
      ["Nazorg", "Meenemen", "Zeker bij montage en waterdichtheid relevant"],
    ],
    factors: [
      "Een specialist moet passen bij jouw type project: standaard, maatwerk of vergunningsgevoelig.",
      "Hoe completer de begeleiding, hoe minder losse schakels je zelf hoeft te organiseren.",
      "Heldere communicatie is vaak een sterke voorspeller van een soepel project.",
      "Referenties en voorbeelden wegen zwaarder dan losse marketingclaims.",
    ],
    examples: [
      { title: "Prefab specialist", text: "Sterk als snelheid en standaardisatie belangrijk zijn." },
      { title: "Maatwerk specialist", text: "Interessanter bij traditionele bouw, moeilijke daken of karaktervolle panden." },
      { title: "Juiste match", text: `Koppel de keuze altijd aan ${articleLink("prefab-of-traditionele-dakkapel", "de juiste bouwmethode")} en ${articleLink("waar-moet-je-op-letten-bij-aannemer", "de aannemercheck")}.` },
    ],
    tips: [
      "Vraag niet alleen naar prijs, maar ook naar werkwijze en begeleiding.",
      "Kies een specialist die jouw vragen inhoudelijk beantwoordt, niet alleen commercieel.",
      "Laat voorbeelden zien van jouw woningtype en vraag wat zij daar anders zouden doen.",
    ],
    faq: [
      { q: "Wat is het verschil tussen aannemer en specialist?", a: "Een specialist focust vaak sterker op dakkapellen als product en proces." },
      { q: "Moet een specialist ook vergunningen kunnen begeleiden?", a: "Dat is zeker een pluspunt bij complexere projecten." },
      { q: "Hoe voorkom ik een verkeerde keuze?", a: "Door ervaring, offertekwaliteit en communicatie samen te beoordelen." },
    ],
    related: ["waar-moet-je-op-letten-bij-aannemer", "offerte-dakkapel-vergelijken", "prefab-of-traditionele-dakkapel"],
  },
  {
    slug: "fouten-vergelijken-dakkapel-offertes",
    title: "Veelgemaakte fouten bij offerte vergelijken",
    metaTitle: "Veelgemaakte fouten bij dakkapel offerte vergelijken",
    metaDescription:
      "Lees welke fouten huiseigenaren vaak maken bij het vergelijken van dakkapel offertes en hoe je ze voorkomt.",
    intro:
      "Offertevergelijking gaat meestal mis op dezelfde punten: te veel focus op het laagste bedrag, te weinig aandacht voor afwerking en te veel aannames over wat wel of niet inbegrepen is.",
    quickAnswer:
      "De grootste fouten zijn alleen op totaalprijs sturen, verschillende bouwmethodes als gelijk product behandelen en niet checken wat montage, afwerking en garantie precies betekenen.",
    tableRows: [
      ["Alleen naar totaalprijs kijken", "Zeer vaak", "Vergelijk scope en inhoud, niet alleen bedrag"],
      ["Prefab en traditioneel verwarren", "Veelvoorkomend", "Dat zijn niet zomaar gelijkwaardige offertes"],
      ["Binnenafwerking vergeten", "Kostbaar", "Ruimte blijkt minder compleet opgeleverd"],
      ["Garantie niet vergelijken", "Riskant", "Waterdichtheid en nazorg tellen mee"],
    ],
    factors: [
      "Veel fouten ontstaan omdat de offerte visueel compleet oogt maar inhoudelijk niet volledig is.",
      "Mensen vergelijken graag snel, terwijl dakkapels juist detailgevoelige offertes zijn.",
      "Extra posten zitten vaak verborgen in logistiek, afwerking of vergunningbegeleiding.",
      "Een simpele checklist voorkomt een groot deel van deze fouten al.",
    ],
    examples: [
      { title: "Laagste offerte wint", text: "Tot blijkt dat binnenafwerking en hijswerk ontbreken." },
      { title: "Geen inhoudelijke vergelijking", text: "Daardoor worden twee verschillende producten toch naast elkaar gelegd." },
      { title: "Praktisch voorkomen", text: `Gebruik daarom ${articleLink("checklist-dakkapel-offerte", "de checklist")} en ${articleLink("offerte-dakkapel-vergelijken", "de uitgebreide vergelijkpagina")}.` },
    ],
    tips: [
      "Maak één vergelijkingsoverzicht waarin je per offerte exact dezelfde punten noteert.",
      "Vraag onduidelijke posten na voordat je leveranciers gaat rangschikken.",
      "Neem naast prijs ook planning, garantie en oplevering mee in je eindkeuze.",
    ],
    faq: [
      { q: "Wat is de meest gemaakte fout?", a: "Alleen naar de totaalprijs kijken zonder scopevergelijking." },
      { q: "Waarom is binnenafwerking zo'n valkuil?", a: "Omdat veel mensen aannemen dat het erbij hoort terwijl dat niet altijd zo is." },
      { q: "Hoe voorkom ik dit snel?", a: "Gebruik een vaste checklist en vraag ontbrekende posten expliciet na." },
    ],
    related: ["offerte-dakkapel-vergelijken", "checklist-dakkapel-offerte", "waar-moet-je-op-letten-bij-aannemer"],
  },
].forEach(buildOfferGuide);

const categoryArticles = Object.values(categories).reduce((acc, category) => {
  acc[category.slug] = [];
  return acc;
}, {});

articles.forEach((article) => {
  categoryArticles[categories[article.category].slug].push(article);
});

function articleUrl(article) {
  return `${siteUrl}/kenniscentrum/${article.slug}/`;
}

function categoryUrl(category) {
  return `${siteUrl}/kenniscentrum/${category.slug}/`;
}

function renderHead({ level, title, description, canonicalPath, type, schema }) {
  const prefix = "../".repeat(level);
  return `  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <meta name="author" content="${editorName}">
    <meta name="theme-color" content="#16324F">
    <link rel="canonical" href="${siteUrl}${canonicalPath}">
    <link rel="alternate" hreflang="nl-NL" href="${siteUrl}${canonicalPath}">
    <link rel="stylesheet" href="${prefix}css/style.css">
    <meta property="og:site_name" content="DakkapellenKosten.nl">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(description)}">
    <meta property="og:type" content="${type}">
    <meta property="og:url" content="${siteUrl}${canonicalPath}">
    <meta property="og:locale" content="nl_NL">
    <meta property="og:image" content="${siteUrl}/assets/og-dakkapellenkosten.svg">
    <meta property="og:image:alt" content="DakkapellenKosten.nl">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${esc(title)}">
    <meta name="twitter:description" content="${esc(description)}">
    <meta name="twitter:image" content="${siteUrl}/assets/og-dakkapellenkosten.svg">
    <script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
    </script>
  </head>`;
}

function renderHeader(level) {
  const prefix = "../".repeat(level);
  return `  <header class="header" id="header">
    <div class="container header__inner">
      <a href="${prefix}index.html" class="header__logo">Dakkapellen<span>Kosten</span>.nl</a>
      <nav class="nav" id="nav">
        <ul class="nav__list">
          <li><a href="${prefix}kenniscentrum/kosten/" class="nav__link">Kosten</a></li>
          <li><a href="${prefix}kenniscentrum/vergunning/" class="nav__link">Vergunning</a></li>
          <li><a href="${prefix}kenniscentrum/materialen/" class="nav__link">Materialen</a></li>
          <li><a href="${prefix}kenniscentrum/" class="nav__link">Kenniscentrum</a></li>
          <li><a href="${prefix}contact/" class="nav__link">Contact</a></li>
          <li><a href="${prefix}index.html#offerte" class="btn btn--primary btn--sm">Gratis offertes →</a></li>
        </ul>
      </nav>
      <a href="${prefix}index.html#offerte" class="btn btn--primary btn--sm header__cta">Gratis offertes →</a>
      <button class="mobile-toggle" id="mobileToggle" aria-label="Menu openen"><span></span><span></span><span></span></button>
    </div>
  </header>`;
}

function renderFooter(level) {
  const prefix = "../".repeat(level);
  return `  <footer class="footer">
    <div class="container">
      <div class="footer__inner">
        <div class="footer__brand">
          <div class="footer__brand-name">Dakkapellen<span>Kosten</span>.nl</div>
          <p>Onafhankelijke gids voor dakkapel kosten, vergunningen, materialen en offertes.</p>
          <p><a href="${contactEmailHref}">${contactEmail}</a></p>
        </div>
        <div>
          <h4 class="footer__heading">Populaire pagina's</h4>
          <ul class="footer__list">
            <li><a href="${prefix}kenniscentrum/wat-kost-een-dakkapel/">Wat kost een dakkapel?</a></li>
            <li><a href="${prefix}kenniscentrum/vergunning-dakkapel-regels/">Vergunning dakkapel</a></li>
            <li><a href="${prefix}kenniscentrum/prefab-of-traditionele-dakkapel/">Prefab vs traditioneel</a></li>
            <li><a href="${prefix}kenniscentrum/offerte-dakkapel-vergelijken/">Offertes vergelijken</a></li>
          </ul>
        </div>
        <div>
          <h4 class="footer__heading">Categorieën</h4>
          <ul class="footer__list">
            <li><a href="${prefix}kenniscentrum/kosten/">Kosten</a></li>
            <li><a href="${prefix}kenniscentrum/vergunning/">Vergunning</a></li>
            <li><a href="${prefix}kenniscentrum/materialen/">Materialen</a></li>
            <li><a href="${prefix}kenniscentrum/plaatsing/">Plaatsing</a></li>
            <li><a href="${prefix}kenniscentrum/onderhoud/">Onderhoud</a></li>
            <li><a href="${prefix}kenniscentrum/bespaartips/">Bespaartips</a></li>
          </ul>
        </div>
        <div>
          <h4 class="footer__heading">Platform</h4>
          <ul class="footer__list">
            <li><a href="${prefix}over-ons/">Over ons</a></li>
            <li><a href="${prefix}redactie/">Redactie</a></li>
            <li><a href="${prefix}werkwijze/">Werkwijze</a></li>
            <li><a href="${prefix}contact/">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 class="footer__heading">Juridisch</h4>
          <ul class="footer__list">
            <li><a href="${prefix}privacybeleid/">Privacybeleid</a></li>
            <li><a href="${prefix}cookiebeleid/">Cookiebeleid</a></li>
            <li><a href="${prefix}algemene-voorwaarden/">Algemene voorwaarden</a></li>
            <li><a href="${prefix}index.html#offerte">Gratis offertes vergelijken</a></li>
          </ul>
        </div>
      </div>
      <div class="footer__bottom">
        <span>© 2026 DakkapellenKosten.nl — Alle rechten voorbehouden</span>
        <div class="footer__bottom-links">
          <a href="${prefix}privacybeleid/">Privacybeleid</a>
          <a href="${prefix}cookiebeleid/">Cookiebeleid</a>
          <a href="${prefix}algemene-voorwaarden/">Algemene voorwaarden</a>
        </div>
      </div>
    </div>
  </footer>
  <div class="mobile-cta" id="mobileCta">
    <a href="${prefix}index.html#offerte" class="btn btn--primary">Nu gratis offertes vergelijken →</a>
  </div>
  <script src="${prefix}js/main.js"></script>`;
}

function renderCard(article, hrefPrefix = "../") {
  return `        <a class="blog-card reveal" href="${hrefPrefix}${article.slug}/">
          <div class="blog-card__image"><span class="blog-card__image-placeholder">🏠</span></div>
          <div class="blog-card__body">
            <span class="blog-card__category">${categories[article.category].label}</span>
            <h3 class="blog-card__title">${article.title}</h3>
            <p class="blog-card__excerpt">${article.metaDescription}</p>
            <span class="blog-card__meta">${article.readTime} min leestijd · Bijgewerkt ${updatedHuman}</span>
          </div>
        </a>`;
}

function renderTrustSidebar(level) {
  const prefix = "../".repeat(level);
  return `          <aside style="padding-top:var(--sp-10);">
            <div class="blog-sidebar">
              <div class="sidebar-card">
                <h4>Vertrouwen & platform</h4>
                <ul class="footer__list">
                  <li><a href="${prefix}over-ons/">Over ons</a></li>
                  <li><a href="${prefix}redactie/">Redactie</a></li>
                  <li><a href="${prefix}werkwijze/">Werkwijze</a></li>
                  <li><a href="${prefix}contact/">Contact</a></li>
                </ul>
              </div>
              <div class="sidebar-card">
                <h4>Belangrijke gidsen</h4>
                <ul class="footer__list">
                  <li><a href="${prefix}kenniscentrum/wat-kost-een-dakkapel/">Wat kost een dakkapel?</a></li>
                  <li><a href="${prefix}kenniscentrum/vergunning-dakkapel-regels/">Vergunning dakkapel</a></li>
                  <li><a href="${prefix}kenniscentrum/soorten-dakkapellen/">Soorten dakkapellen</a></li>
                  <li><a href="${prefix}kenniscentrum/dakkapel-laten-plaatsen/">Dakkapel laten plaatsen</a></li>
                </ul>
              </div>
            </div>
          </aside>`;
}

function renderArticlePage(article) {
  const category = categories[article.category];
  const related = article.related.map((slug) => articleIndex[slug]).filter(Boolean);
  const tocItems = [
    { id: "kort-antwoord", title: article.quickTitle },
    { id: "overzicht", title: article.tableTitle },
    { id: "factoren", title: article.factorsTitle },
    { id: "voorbeelden", title: article.examplesTitle },
    ...article.extraSections.map((section) => ({ id: section.id, title: section.title })),
    { id: "tips", title: article.tipsTitle },
    { id: "faq", title: "Veelgestelde vragen" },
  ];
  const schema = [
    organizationSchema(),
    websiteSchema(),
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
        { "@type": "ListItem", position: 2, name: "Kenniscentrum", item: `${siteUrl}/kenniscentrum/` },
        { "@type": "ListItem", position: 3, name: category.name, item: categoryUrl(category) },
        { "@type": "ListItem", position: 4, name: article.title, item: articleUrl(article) },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: article.title,
      description: article.metaDescription,
      datePublished: updatedIso,
      dateModified: updatedIso,
      author: {
        "@type": "Person",
        "@id": editorProfileUrl,
        name: editorName,
        url: editorProfileUrl,
        jobTitle: editorJobTitle,
      },
      publisher: {
        "@id": organizationId,
      },
      mainEntityOfPage: articleUrl(article),
      articleSection: category.name,
      inLanguage: "nl-NL",
      image: `${siteUrl}/assets/og-dakkapellenkosten.svg`,
      isAccessibleForFree: true,
    },
    buildFaqSchema(article.faq),
  ];

  return `<!DOCTYPE html>
<html lang="nl">
${renderHead({
    level: 2,
    title: article.metaTitle,
    description: article.metaDescription,
    canonicalPath: `/kenniscentrum/${article.slug}/`,
    type: "article",
    schema,
  })}
<body>
${renderHeader(2)}
  <main>
    <section class="article-hero">
      <div class="container container--narrow">
        <nav class="breadcrumbs" aria-label="Breadcrumb">
          <a href="../../index.html">Home</a>
          <span>›</span>
          <a href="../index.html">Kenniscentrum</a>
          <span>›</span>
          <a href="../${category.slug}/">${category.name}</a>
          <span>›</span>
          <span aria-current="page">${article.title}</span>
        </nav>
        <span class="badge badge--blue mb-4">${category.label}</span>
        <h1>${article.title}</h1>
        <div class="article-meta">
          <span>📅 Bijgewerkt: <time datetime="${updatedIso}">${updatedHuman}</time></span>
          <span>⏱️ ${article.readTime} min leestijd</span>
          <span>✍️ <a href="../../redactie/#j-arrascaeta">${editorName}</a></span>
        </div>
      </div>
    </section>
    <section class="section section--light" style="padding-top:0;">
      <div class="container">
        <div class="article-layout">
          <article class="article-body" style="max-width:none;padding-top:var(--sp-10);">
            <div class="article-toc">
              <h2>Inhoudsopgave</h2>
              <ol>
${tocItems.map((item) => `                <li><a href="#${item.id}">${item.title}</a></li>`).join("\n")}
              </ol>
            </div>
${editorialNoteFor(article.category, 2)}
${article.intro.map((p) => `            <p>${p}</p>`).join("\n")}
            <h2 id="kort-antwoord">${article.quickTitle}</h2>
${article.quickAnswer.map((p) => `            <p>${p}</p>`).join("\n")}
${article.note ? `            <div class="article-cta" data-nosnippet><h3>Bronnen en methodiek</h3><p>${article.note}</p><a href="../../index.html#offerte" class="btn btn--primary">Gratis offertes vergelijken →</a></div>` : ""}
            <h2 id="overzicht">${article.tableTitle}</h2>
${article.tableIntro.map((p) => `            <p>${p}</p>`).join("\n")}
            <div style="overflow-x:auto;margin-bottom:var(--sp-6);">
              <table class="price-table">
                <thead>
                  <tr>${article.tableHeaders.map((header) => `<th>${header}</th>`).join("")}</tr>
                </thead>
                <tbody>
${article.tableRows
  .map((row) => `                  <tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`)
  .join("\n")}
                </tbody>
              </table>
            </div>
            <h2 id="factoren">${article.factorsTitle}</h2>
${article.factorsIntro.map((p) => `            <p>${p}</p>`).join("\n")}
            <ul>
${article.factors.map((item) => `              <li>${item}</li>`).join("\n")}
            </ul>
            <div class="article-cta" data-nosnippet>
              <h3>Benieuwd wat dit betekent voor jouw woning?</h3>
              <p>Vergelijk gratis offertes van dakkapel specialisten en gebruik deze pagina als inhoudelijke voorbereiding op je aanvraag.</p>
              <a href="../../index.html#offerte" class="btn btn--primary">Nu gratis offertes vergelijken →</a>
            </div>
            <h2 id="voorbeelden">${article.examplesTitle}</h2>
${article.examples
  .map(
    (example) => `            <h3>${example.title}</h3>
            <p>${example.text}</p>`
  )
  .join("\n")}
${article.extraSections.map((section) => renderExtraSection(section)).join("\n")}
            <h2 id="tips">${article.tipsTitle}</h2>
            <ol>
${article.tips.map((tip) => `              <li>${tip}</li>`).join("\n")}
            </ol>
            <h2 id="faq">Veelgestelde vragen</h2>
${article.faq
  .map(
    (item) => `            <h3>${item.q}</h3>
            <p>${item.a}</p>`
  )
  .join("\n")}
          </article>
          <aside style="padding-top:var(--sp-10);">
            <div class="blog-sidebar">
              <div class="sidebar-cta mb-6" data-nosnippet>
                <h4>Gratis offertes?</h4>
                <p>Vergelijk prijzen van dakkapel specialisten en gebruik de inhoud van dit artikel voor een betere offerteaanvraag.</p>
                <a href="../../index.html#offerte" class="btn btn--primary btn--full">Vergelijk nu →</a>
              </div>
              <div class="sidebar-card">
                <h4>Over deze inhoud</h4>
                <ul class="footer__list">
                  <li><a href="../../redactie/">Redactie</a></li>
                  <li><a href="../../werkwijze/">Werkwijze</a></li>
                  <li><a href="../../contact/">Contact</a></li>
                </ul>
              </div>
              <div class="sidebar-card">
                <h4>Gerelateerde artikelen</h4>
                <ul class="footer__list">
${related
  .slice(0, 5)
  .map((rel) => `                  <li><a href="../${rel.slug}/">${rel.title}</a></li>`)
  .join("\n")}
                </ul>
              </div>
              <div class="sidebar-card">
                <h4>Meer in deze categorie</h4>
                <ul class="footer__list">
                  <li><a href="../${category.slug}/">${category.name}</a></li>
                  <li><a href="../index.html">Alle artikelen</a></li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
        <div class="related-articles" style="padding-bottom:var(--sp-12);">
          <h2 class="mb-6 reveal">Verder lezen</h2>
          <div class="grid grid--3">
${related.slice(0, 3).map((rel) => renderCard(rel)).join("\n")}
          </div>
        </div>
      </div>
    </section>
  </main>
  <section class="final-cta" data-nosnippet>
    <div class="container">
      <h2>Klaar om dakkapel offertes te vergelijken?</h2>
      <p>Gebruik deze kennis om beter te vergelijken en ontvang gratis vrijblijvende offertes van specialisten bij jou in de buurt.</p>
      <a href="../../index.html#offerte" class="btn btn--primary btn--lg">Nu gratis offertes vergelijken →</a>
    </div>
  </section>
${renderFooter(2)}
</body>
</html>`;
}

function renderCategoryPage(category) {
  const items = categoryArticles[category.slug];
  const schema = [
    organizationSchema(),
    websiteSchema(),
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: category.name,
      description: category.description,
      url: categoryUrl(category),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
        { "@type": "ListItem", position: 2, name: "Kenniscentrum", item: `${siteUrl}/kenniscentrum/` },
        { "@type": "ListItem", position: 3, name: category.name, item: categoryUrl(category) },
      ],
    },
  ];

  return `<!DOCTYPE html>
<html lang="nl">
${renderHead({
    level: 2,
    title: `${category.name} | DakkapellenKosten.nl`,
    description: category.description,
    canonicalPath: `/kenniscentrum/${category.slug}/`,
    type: "website",
    schema,
  })}
<body>
${renderHeader(2)}
  <main>
    <section class="blog-hero">
      <div class="container">
        <nav class="breadcrumbs" aria-label="Breadcrumb">
          <a href="../../index.html">Home</a>
          <span>›</span>
          <a href="../index.html">Kenniscentrum</a>
          <span>›</span>
          <span aria-current="page">${category.name}</span>
        </nav>
        <span class="section-label">${category.shortName}</span>
        <h1>${category.name}</h1>
        <p class="section-subtitle">${category.description}</p>
      </div>
    </section>
    <section class="section section--light" style="padding-top:var(--sp-10);">
      <div class="container">
${category.intro.map((paragraph) => `        <p class="mb-4">${paragraph}</p>`).join("\n")}
        <div class="editorial-note mb-10">
          <strong>Redactionele noot:</strong> Deze categorie wordt onderhouden door DakkapellenKosten.nl als samenvatting van openbare marktinformatie en praktische vergunninguitleg. Lees meer over onze <a href="../../redactie/">redactie</a> en <a href="../../werkwijze/">werkwijze</a>.
        </div>
        <div class="article-cta reveal mb-10" data-nosnippet>
          <h3>Gebruik deze categorie als beslisroute</h3>
          <p>Open eerst de artikelen die het dichtst bij jouw situatie liggen en vergelijk daarna offertes op inhoud, niet alleen op prijs.</p>
          <a href="../../index.html#offerte" class="btn btn--primary">Gratis offertes vergelijken →</a>
        </div>
        <div class="grid grid--3">
${items.map((article) => renderCard(article)).join("\n")}
        </div>
      </div>
    </section>
  </main>
${renderFooter(2)}
</body>
</html>`;
}

function renderKnowledgeCenterHome() {
  const pillars = [
    articleIndex["wat-kost-een-dakkapel"],
    articleIndex["vergunning-dakkapel-regels"],
    articleIndex["soorten-dakkapellen"],
    articleIndex["dakkapel-laten-plaatsen"],
    articleIndex["onderhoud-dakkapel"],
  ];

  const categoryCards = Object.values(categories)
    .map(
      (category) => `        <a class="blog-card reveal" href="${category.slug}/">
          <div class="blog-card__image"><span class="blog-card__image-placeholder">📚</span></div>
          <div class="blog-card__body">
            <span class="blog-card__category">${category.shortName}</span>
            <h3 class="blog-card__title">${category.name}</h3>
            <p class="blog-card__excerpt">${category.description}</p>
            <span class="blog-card__meta">${categoryArticles[category.slug].length} artikelen</span>
          </div>
        </a>`
    )
    .join("\n");

  const latest = articles.slice(0, 12);
  const schema = [
    organizationSchema(),
    websiteSchema(),
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Kenniscentrum dakkapellen",
      description:
        "Kenniscentrum met 60 artikelen over dakkapel kosten, vergunningen, materialen, plaatsing, onderhoud en offertes.",
      url: `${siteUrl}/kenniscentrum/`,
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Dakkapel artikelen",
      numberOfItems: articles.length,
      itemListElement: articles.slice(0, 20).map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: articleUrl(article),
        name: article.title,
      })),
    },
  ];

  return `<!DOCTYPE html>
<html lang="nl">
${renderHead({
    level: 1,
    title: "Kenniscentrum dakkapel | 60 artikelen over kosten, vergunningen en plaatsing",
    description:
      "Kenniscentrum met 60 artikelen over dakkapel kosten, vergunningen, materialen, plaatsing, onderhoud en offerte vergelijken.",
    canonicalPath: "/kenniscentrum/",
    type: "website",
    schema,
  })}
<body>
${renderHeader(1)}
  <main>
    <section class="blog-hero">
      <div class="container">
        <nav class="breadcrumbs" aria-label="Breadcrumb">
          <a href="../index.html">Home</a>
          <span>›</span>
          <span aria-current="page">Kenniscentrum</span>
        </nav>
        <span class="section-label">Kenniscentrum</span>
        <h1>Alles over dakkapellen</h1>
        <p class="section-subtitle">Een complete contenthub met 60 artikelen over dakkapel kosten, vergunningen, soorten, plaatsing, onderhoud en offertevergelijking. Geschreven als onafhankelijke samenvatting van openbare marktinformatie en vergunninguitleg.</p>
      </div>
    </section>
    <section class="section section--light" style="padding-top:var(--sp-10);">
      <div class="container">
        <h2 class="mb-6">De 5 pillar pages</h2>
        <div class="grid grid--3 mb-10">
${pillars.map((article) => renderCard(article, "")).join("\n")}
        </div>
        <h2 class="mb-6">Categorieën</h2>
        <div class="grid grid--3 mb-10">
${categoryCards}
        </div>
        <div class="grid grid--2 mb-10">
          <div class="card card--flat reveal">
            <div class="why-card">
              <div class="why-card__icon" style="background:#EEF4FA;color:var(--blue);">✍️</div>
              <h3>Redactioneel onderhouden</h3>
              <p>Lees hoe de artikelen worden samengesteld, bijgewerkt en gecontroleerd op prijs- en vergunningnuance.</p>
              <a href="../redactie/" class="btn btn--secondary">Bekijk redactie</a>
            </div>
          </div>
          <div class="card card--flat reveal reveal-delay-1">
            <div class="why-card">
              <div class="why-card__icon" style="background:#FEF3C7;color:var(--cta);">⚙️</div>
              <h3>Platform & werkwijze</h3>
              <p>Ontdek hoe kenniscentrum en offertevergelijking samen werken en waar de grenzen van de service liggen.</p>
              <a href="../werkwijze/" class="btn btn--secondary">Bekijk werkwijze</a>
            </div>
          </div>
        </div>
        <div class="grid grid--2 mb-10">
          <div class="card card--flat reveal">
            <div class="why-card">
              <div class="why-card__icon" style="background:#E0ECF8;color:var(--blue);">📊</div>
              <h3>Gebaseerd op marktinformatie</h3>
              <p>De prijs- en keuzeartikelen zijn geschreven op basis van openbare informatie van Nederlandse vergelijkingssites, leveranciers en dakkapelbedrijven. Daardoor sluiten ze goed aan op vragen die bezoekers in de offertefase hebben.</p>
            </div>
          </div>
          <div class="card card--flat reveal reveal-delay-1">
            <div class="why-card">
              <div class="why-card__icon" style="background:#FEF3C7;color:var(--cta);">📋</div>
              <h3>Praktisch voor offertes</h3>
              <p>Gebruik het kenniscentrum als voorbereiding op een offerteaanvraag. De pagina's helpen je om prijzen, vergunningen, materialen en afwerking beter te begrijpen voordat je aanbieders vergelijkt.</p>
            </div>
          </div>
        </div>
        <h2 class="mb-6">Meest gelezen onderwerpen</h2>
        <div class="grid grid--3 mb-10">
${latest.map((article) => renderCard(article, "")).join("\n")}
        </div>
        <div class="article-cta reveal mb-10" data-nosnippet>
          <h3>Ook benieuwd naar jouw dakkapel kosten?</h3>
          <p>Vergelijk gratis en vrijblijvend offertes van specialisten bij jou in de buurt en gebruik dit kenniscentrum om betere keuzes te maken.</p>
          <a href="../index.html#offerte" class="btn btn--primary">Nu gratis offertes vergelijken →</a>
        </div>
      </div>
    </section>
  </main>
${renderFooter(1)}
</body>
</html>`;
}

function renderTrustPage(page) {
  const schema = [
    organizationSchema(),
    websiteSchema(),
    {
      "@context": "https://schema.org",
      "@type": page.schemaType,
      name: page.title,
      description: page.metaDescription,
      url: trustPageUrl(page),
      inLanguage: "nl-NL",
      about: {
        "@id": organizationId,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
        { "@type": "ListItem", position: 2, name: page.title, item: trustPageUrl(page) },
      ],
    },
  ];

  if (page.slug === "contact") {
    schema.push({
      "@context": "https://schema.org",
      "@type": "ContactPoint",
      contactType: "customer support",
      email: contactEmail,
      areaServed: "NL",
      availableLanguage: ["Dutch"],
    });
  }

  return `<!DOCTYPE html>
<html lang="nl">
${renderHead({
    level: 1,
    title: page.metaTitle,
    description: page.metaDescription,
    canonicalPath: `/${page.slug}/`,
    type: "website",
    schema,
  })}
<body>
${renderHeader(1)}
  <main>
    <section class="blog-hero">
      <div class="container container--narrow">
        <nav class="breadcrumbs" aria-label="Breadcrumb">
          <a href="../index.html">Home</a>
          <span>›</span>
          <span aria-current="page">${page.title}</span>
        </nav>
        <span class="section-label">${page.label}</span>
        <h1>${page.title}</h1>
        <p class="section-subtitle">${page.description}</p>
        <div class="article-meta">
          <span>📅 Bijgewerkt: <time datetime="${updatedIso}">${updatedHuman}</time></span>
          <span>✍️ DakkapellenKosten.nl</span>
          <span>✉️ <a href="${contactEmailHref}">${contactEmail}</a></span>
        </div>
      </div>
    </section>
    <section class="section section--light" style="padding-top:0;">
      <div class="container">
        <div class="article-layout">
          <article class="article-body" style="max-width:none;padding-top:var(--sp-10);">
            <div class="article-toc">
              <h2>Op deze pagina</h2>
              <ol>
${page.sections.map((section) => `                <li><a href="#${section.id}">${section.title}</a></li>`).join("\n")}
              </ol>
            </div>
${page.intro.map((paragraph) => `            <p>${paragraph}</p>`).join("\n")}
            <div class="editorial-note">
              <strong>Platforminformatie:</strong> Deze pagina beschrijft hoe DakkapellenKosten.nl werkt en hoe we omgaan met inhoud, contact en platformgebruik. Voor vragen kun je mailen naar <a href="${contactEmailHref}">${contactEmail}</a>.
            </div>
${page.sections
  .map((section) => {
    const items = !section.items?.length
      ? ""
      : `            <ul>
${section.items.map((item) => `              <li>${item}</li>`).join("\n")}
            </ul>`;

    return `            <h2 id="${section.id}">${section.title}</h2>
${section.paragraphs.map((paragraph) => `            <p>${paragraph}</p>`).join("\n")}
${items}`;
  })
  .join("\n")}
${page.cta
  ? `            <div class="article-cta" data-nosnippet>
              <h3>${page.cta.title}</h3>
              <p>${page.cta.text}</p>
              <div class="button-row">
                <a href="${page.cta.primaryHref}" class="btn btn--primary">${page.cta.primaryLabel}</a>
                ${page.cta.secondaryHref ? `<a href="${page.cta.secondaryHref}" class="btn btn--secondary">${page.cta.secondaryLabel}</a>` : ""}
              </div>
            </div>`
  : ""}
          </article>
${renderTrustSidebar(1)}
        </div>
      </div>
    </section>
  </main>
${renderFooter(1)}
</body>
</html>`;
}

function renderRedirectPage(targetPath, title, description) {
  return `<!DOCTYPE html>
<html lang="nl">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0; url=${targetPath}">
    <meta name="description" content="${esc(description)}">
    <meta name="robots" content="noindex, follow">
    <title>${esc(title)}</title>
    <link rel="canonical" href="${siteUrl}/kenniscentrum/${targetPath.replace(/^\.\.\//, "").replace(/index\.html$/, "").replace(/\.html$/, "/")}">
  </head>
  <body>
    <p>Ga verder naar <a href="${targetPath}">${esc(title)}</a>.</p>
  </body>
</html>`;
}

function writeFile(relativePath, content) {
  const fullPath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}

articles.forEach((article) => {
  writeFile(`kenniscentrum/${article.slug}/index.html`, renderArticlePage(article));
});

Object.values(categories).forEach((category) => {
  writeFile(`kenniscentrum/${category.slug}/index.html`, renderCategoryPage(category));
});

writeFile("kenniscentrum/index.html", renderKnowledgeCenterHome());

trustPages.forEach((page) => {
  writeFile(`${page.slug}/index.html`, renderTrustPage(page));
});

writeFile(
  "kenniscentrum/vergunning-dakkapel/index.html",
  renderRedirectPage("../vergunning-dakkapel-regels/", "Vergunning dakkapel regels", "Redirect naar de actuele gids over vergunningregels voor dakkapellen.")
);
writeFile(
  "kenniscentrum/kosten-dakkapel-3-4-5-meter/index.html",
  renderRedirectPage("../dakkapel-kosten-per-meter/", "Dakkapel kosten per meter", "Redirect naar de actuele gids over dakkapel kosten per meter.")
);
writeFile(
  "kenniscentrum/wat-zit-er-in-een-dakkapel-offerte/index.html",
  renderRedirectPage("../checklist-dakkapel-offerte/", "Checklist dakkapel offerte", "Redirect naar de actuele checklist voor dakkapel offertes.")
);

const sitemapEntries = [
  { loc: `${siteUrl}/`, priority: "1.0" },
  { loc: `${siteUrl}/kenniscentrum/`, priority: "0.95" },
  ...trustPages.map((page) => ({ loc: trustPageUrl(page), priority: page.slug === "contact" ? "0.65" : "0.55" })),
  ...Object.values(categories).map((category) => ({ loc: categoryUrl(category), priority: "0.8" })),
  ...articles.map((article) => ({ loc: articleUrl(article), priority: "0.7" })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries
  .map(
    (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${updatedIso}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

writeFile("sitemap.xml", sitemap);

console.log(
  `Generated ${articles.length} article pages, ${Object.keys(categories).length} category hubs, ${trustPages.length} trust pages, the knowledge center index, redirects and sitemap.`
);
