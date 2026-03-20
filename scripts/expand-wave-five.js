const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

const pages = [
  {
    file: "kenniscentrum/dakkapel-met-rolluiken/index.html",
    title: "Dakkapel met rolluiken: comfort, kosten en wanneer het loont",
    description:
      "Lees wanneer rolluiken op een dakkapel echt waarde toevoegen en wat ze betekenen voor comfort, uitstraling, techniek en prijs.",
    h1: "Dakkapel met rolluiken",
    readTime: "8 min leestijd",
    articleHtml: `
            <div class="article-toc">
              <h2>Inhoudsopgave</h2>
              <ol>
                <li><a href="#kort-antwoord">Kort antwoord</a></li>
                <li><a href="#voordelen">Waarom kiezen mensen voor rolluiken?</a></li>
                <li><a href="#aandachtspunten">Welke aandachtspunten horen erbij?</a></li>
                <li><a href="#offerte">Wat moet er in de offerte staan?</a></li>
                <li><a href="#voorbeelden">Praktische scenario's</a></li>
                <li><a href="#checklist">Checklist voor je keuze</a></li>
                <li><a href="#tips">Tips voor huiseigenaren</a></li>
                <li><a href="#bronnen">Bronnen en referenties</a></li>
                <li><a href="#faq">Veelgestelde vragen</a></li>
              </ol>
            </div>
            <div class="editorial-note">
              <strong>Redactionele noot:</strong> Dit artikel is bijgewerkt op 11 maart 2026 door <strong>J. Arrascaeta</strong>, hoofdredacteur van DakkapellenKosten.nl. De uitleg is gebaseerd op openbare leveranciersinformatie over rolluiken, zonwering, comfortopties en offerte-opbouw bij dakkapellen. Lees meer over onze <a href="../../redactie/#j-arrascaeta">redactie</a> en <a href="../../werkwijze/">werkwijze</a>.
            </div>
            <p>Een dakkapel met rolluiken is vooral interessant als de ruimte als slaapkamer, werkplek of warm gelegen zolderkamer wordt gebruikt. Rolluiken kunnen dan zorgen voor betere verduistering, extra warmtewering en soms ook een gevoel van privacy of comfort. Het is daarmee geen standaardonderdeel van elke dakkapel, maar een bewuste comfortkeuze die het gebruik van de ruimte merkbaar kan veranderen.</p>
            <p>De belangrijkste fout is om rolluiken alleen als accessoire te zien. In de praktijk beïnvloeden ze ook de offerte, de techniek, de uitstraling van de voorzijde en soms zelfs de levertijd. Juist daarom moet je deze keuze goed vergelijken en niet als losse bijregel onderaan de offerte laten verdwijnen.</p>

            <h2 id="kort-antwoord">Kort antwoord</h2>
            <p>Rolluiken op een dakkapel zijn vooral zinvol als verduistering, zonwering en comfort belangrijk zijn. Ze passen goed bij slaapkamers en zolders op warme of zonnige dakvlakken.</p>
            <p>De keuze is minder vanzelfsprekend als je vooral een strakke minimalistische uitstraling wilt, weinig hinder hebt van licht of warmte, of de meerprijs niet opweegt tegen het gebruik. De vraag is dus niet alleen of het kan, maar of het echt iets oplost.</p>

            <h2 id="voordelen">Waarom kiezen mensen voor rolluiken?</h2>
            <ul>
              <li><strong>Verduistering</strong> maakt een dakkapel aantrekkelijker als slaapruimte, zeker in de zomer.</li>
              <li><strong>Warmtewering</strong> kan helpen om een zolderruimte beter bruikbaar te houden op zonnige dagen.</li>
              <li><strong>Comfort en privacy</strong> spelen mee, vooral bij zichtlocaties of direct tegenover andere woningen.</li>
              <li><strong>Combinatie met elektrische bediening</strong> maakt dagelijks gebruik makkelijker, maar verhoogt ook de technische complexiteit.</li>
            </ul>
            <p>Wie vooral naar comfort kijkt, moet rolluiken daarom ook vergelijken met alternatieven zoals screens, horren of een andere glas- en zonweringskeuze. Niet elke kamer vraagt dezelfde oplossing.</p>

            <h2 id="aandachtspunten">Welke aandachtspunten horen erbij?</h2>
            <div style="overflow-x:auto;margin-bottom:var(--sp-6);">
              <table class="price-table">
                <thead>
                  <tr><th>Onderdeel</th><th>Waar je op let</th><th>Waarom het telt</th></tr>
                </thead>
                <tbody>
                  <tr><td>Bediening</td><td>Handmatig of elektrisch</td><td>Gemak, meerprijs en onderhoud verschillen</td></tr>
                  <tr><td>Inbouw of opbouw</td><td>Hoe het systeem zichtbaar blijft</td><td>Beïnvloedt uitstraling en detaillering</td></tr>
                  <tr><td>Garantie en service</td><td>Motor, bediening en onderdelen</td><td>Belangrijk bij storingen of slijtage</td></tr>
                  <tr><td>Levertijd</td><td>Extra optie in de productie</td><td>Kan planning van het project beïnvloeden</td></tr>
                </tbody>
              </table>
            </div>
            <p>Vooral de zichtbaarheid van de kast en de manier van integreren bepalen of rolluiken netjes ogen of als toegevoegd element aanvoelen. Dat is extra belangrijk bij een strakke of moderne dakkapel.</p>

            <h2 id="offerte">Wat moet er in de offerte staan?</h2>
            <ul>
              <li><strong>Type rolluik</strong> en of het om opbouw of geïntegreerde uitvoering gaat.</li>
              <li><strong>Bediening</strong>: handmatig, elektrisch of slim aanstuurbaar.</li>
              <li><strong>Garantie en onderhoud</strong> op motor, bediening en geleiders.</li>
              <li><strong>Invloed op levertijd en planning</strong>, zeker bij prefabtrajecten.</li>
            </ul>
            <p>Neem rolluiken altijd expliciet mee in <a href="../checklist-dakkapel-offerte/">de offertechecklist</a>. Als de optie te globaal blijft omschreven, vergelijk je geen echte totaalaanbiedingen.</p>

            <h2 id="voorbeelden">Praktische scenario's</h2>
            <h3>Scenario 1: zolder als slaapkamer</h3>
            <p>Hier voegen rolluiken vaak direct merkbaar comfort toe, vooral voor verduistering en warmtewering.</p>
            <h3>Scenario 2: zonnige zuidzijde</h3>
            <p>Dan kan de comfortwinst groter zijn dan bij een schaduwrijke ligging, waardoor de meerprijs logischer voelt.</p>
            <h3>Scenario 3: strakke moderne voorzijde</h3>
            <p>Dan moet je kritisch kijken naar integratie en zichtbaarheid van de rolluikkast, zodat het ontwerp niet rommelig wordt.</p>
            <h3>Scenario 4: beperkte gebruikswaarde</h3>
            <p>Als de zolder vooral opslag blijft, is de meerprijs vaak minder logisch dan in een dagelijks gebruikte woonruimte.</p>

            <h2 id="checklist">Checklist voor je keuze</h2>
            <ol>
              <li>Lost het rolluik echt een probleem op in licht, warmte of privacy?</li>
              <li>Is duidelijk welk systeem wordt geleverd en hoe het zichtbaar blijft?</li>
              <li>Vergelijk je rolluiken met alternatieve comfortopties?</li>
              <li>Zijn garantie, bediening en service goed vastgelegd?</li>
              <li>Past de optie bij het ontwerp van jouw woning en dakkapel?</li>
            </ol>

            <h2 id="tips">Tips voor huiseigenaren</h2>
            <ol>
              <li>Vraag om foto's van vergelijkbare dakkapellen met rolluiken op echte woningen.</li>
              <li>Laat de optie apart prijzen zodat je de meerwaarde goed kunt beoordelen.</li>
              <li>Let op de integratie van de kast bij moderne of zichtbare gevels.</li>
              <li>Koppel comfortopties altijd aan het daadwerkelijke gebruik van de ruimte.</li>
            </ol>

            <h2 id="bronnen">Bronnen en referenties</h2>
            <p>Voor dit artikel is gebruikgemaakt van openbare marktinformatie van onder meer:</p>
            <ul>
              <li><a href="https://slimster.nl/dakkapellen/" rel="nofollow noopener" target="_blank">Slimster: dakkapellen overzicht</a></li>
              <li><a href="https://www.homedeal.nl/dakkapel/" rel="nofollow noopener" target="_blank">Homedeal: dakkapel informatie</a></li>
              <li><a href="https://www.werkspot.nl/uitbouw-renovatie/prijzen-kosten/dakkapel-plaatsen-vervangen" rel="nofollow noopener" target="_blank">Werkspot: dakkapel plaatsen of vervangen</a></li>
            </ul>

            <h2 id="faq">Veelgestelde vragen</h2>
            <h3>Zijn rolluiken standaard bij een dakkapel?</h3>
            <p>Nee. Het is meestal een comfortoptie die apart wordt meegenomen in de offerte.</p>
            <h3>Wat is het grootste voordeel?</h3>
            <p>Verduistering en warmtewering, vooral in slaapkamers en zonnige zolders.</p>
            <h3>Heeft het invloed op de prijs?</h3>
            <p>Ja. Rolluiken zijn vrijwel altijd meerwerk en beïnvloeden ook de technische uitvoering.</p>
            <h3>Past het altijd bij een moderne dakkapel?</h3>
            <p>Nee. De integratie moet goed zijn, anders kan het ontwerp rommelig worden.</p>
            <h3>Moet je ook naar garantie kijken?</h3>
            <p>Ja, vooral bij elektrische bediening en motoronderdelen.</p>`,
    faqs: [
      { q: "Zijn rolluiken standaard bij een dakkapel?", a: "Nee. Het is meestal een comfortoptie die apart wordt meegenomen in de offerte." },
      { q: "Wat is het grootste voordeel?", a: "Verduistering en warmtewering, vooral in slaapkamers en zonnige zolders." },
      { q: "Heeft het invloed op de prijs?", a: "Ja. Rolluiken zijn vrijwel altijd meerwerk en beïnvloeden ook de technische uitvoering." },
      { q: "Past het altijd bij een moderne dakkapel?", a: "Nee. De integratie moet goed zijn, anders kan het ontwerp rommelig worden." },
      { q: "Moet je ook naar garantie kijken?", a: "Ja, vooral bij elektrische bediening en motoronderdelen." }
    ]
  },
  {
    file: "kenniscentrum/moderne-dakkapellen/index.html",
    title: "Moderne dakkapellen: kenmerken, materialen en waar je op let",
    description:
      "Lees wat moderne dakkapellen onderscheidt van traditionele stijlen en hoe materialen, details en proporties de uitstraling bepalen.",
    h1: "Moderne dakkapellen",
    readTime: "8 min leestijd",
    articleHtml: `
            <div class="article-toc">
              <h2>Inhoudsopgave</h2>
              <ol>
                <li><a href="#kort-antwoord">Kort antwoord</a></li>
                <li><a href="#kenmerken">Wat maakt een dakkapel modern?</a></li>
                <li><a href="#materialen">Welke materialen en details passen daarbij?</a></li>
                <li><a href="#valkuilen">Welke ontwerpfouten maken een moderne dakkapel zwakker?</a></li>
                <li><a href="#voorbeelden">Praktische scenario's</a></li>
                <li><a href="#checklist">Checklist voor een moderne uitstraling</a></li>
                <li><a href="#tips">Tips voor huiseigenaren</a></li>
                <li><a href="#bronnen">Bronnen en referenties</a></li>
                <li><a href="#faq">Veelgestelde vragen</a></li>
              </ol>
            </div>
            <div class="editorial-note">
              <strong>Redactionele noot:</strong> Dit artikel is bijgewerkt op 11 maart 2026 door <strong>J. Arrascaeta</strong>, hoofdredacteur van DakkapellenKosten.nl. De stijluitleg is gebaseerd op openbare leveranciersinformatie, ontwerptrends en veelgebruikte materiaalkeuzes bij strakke dakkapellen. Lees meer over onze <a href="../../redactie/#j-arrascaeta">redactie</a> en <a href="../../werkwijze/">werkwijze</a>.
            </div>
            <p>Een moderne dakkapel herken je meestal niet aan één materiaal, maar aan de totale compositie: strakke lijnen, rustige detaillering, heldere kozijnverdeling en een opbouw die logisch in het dakvlak ligt. Veel mensen denken bij modern direct aan zwart of antraciet kunststof, maar modern is vooral een kwestie van proportie, afwerking en terughoudendheid in details.</p>
            <p>Juist daarom kun je een dure dakkapel laten plaatsen die toch niet modern oogt. Een verkeerde kast, te drukke vakverdeling of onrustige afwerking haalt de kracht uit het ontwerp. Moderne dakkapellen vragen dus minder decoratie en meer discipline in keuzes.</p>

            <h2 id="kort-antwoord">Kort antwoord</h2>
            <p>Een moderne dakkapel draait om strakke lijnen, rustige materialen en een ontwerp dat als logisch onderdeel van de woning voelt. De beste moderne dakkapellen zijn meestal helder in vorm, terughoudend in details en zorgvuldig in kleurgebruik en kozijnverdeling.</p>
            <p>Het uiterlijk wordt niet alleen bepaald door materiaal, maar ook door breedte, dakvorm, boeidelen, raammaten en eventuele extra opties zoals rolluiken of ventilatieroosters.</p>

            <h2 id="kenmerken">Wat maakt een dakkapel modern?</h2>
            <ul>
              <li><strong>Strakke belijning</strong> zonder overbodige profilering of klassieke sierdetails.</li>
              <li><strong>Rustige kozijnindeling</strong> met logische raamverhoudingen.</li>
              <li><strong>Beperkte zichtbaarheid van extra techniek</strong>, zoals kasten of losse elementen.</li>
              <li><strong>Consistente kleur en materiaalkeuze</strong> die past bij de woning.</li>
            </ul>
            <p>Een moderne dakkapel hoeft dus niet per se extreem minimalistisch te zijn. Belangrijker is dat hij coherent oogt en geen optelsom van losse keuzes wordt.</p>

            <h2 id="materialen">Welke materialen en details passen daarbij?</h2>
            <div style="overflow-x:auto;margin-bottom:var(--sp-6);">
              <table class="price-table">
                <thead>
                  <tr><th>Keuze</th><th>Waarom vaak modern</th><th>Aandachtspunt</th></tr>
                </thead>
                <tbody>
                  <tr><td>Kunststof</td><td>Strakke profielen en onderhoudsarm</td><td>Let op profielbreedte en kleurtoon</td></tr>
                  <tr><td>Polyester/prefab schaal</td><td>Naadarm en strak uiterlijk</td><td>Minder ontwerpvrijheid</td></tr>
                  <tr><td>Donkere of neutrale kleuren</td><td>Rustig en hedendaags beeld</td><td>Moet bij de woning passen</td></tr>
                  <tr><td>Rustige kozijnverdeling</td><td>Versterkt moderne uitstraling</td><td>Te veel vakken maakt het druk</td></tr>
                </tbody>
              </table>
            </div>
            <p>Daarmee is meteen duidelijk dat modern niet automatisch hetzelfde is als goedkoop of onderhoudsarm. Een modern beeld kan prima samengaan met maatwerk of luxere afwerking.</p>

            <h2 id="valkuilen">Welke ontwerpfouten maken een moderne dakkapel zwakker?</h2>
            <ul>
              <li><strong>Te veel losse elementen</strong> zoals zichtbare kasten, drukke raamverdeling of onnadenkende toevoegingen.</li>
              <li><strong>Verhoudingen die niet kloppen</strong> met het dakvlak of de rest van de woning.</li>
              <li><strong>Een kleur die modieus lijkt maar niet past</strong> bij gevel, kozijnen of dakpannen.</li>
              <li><strong>Opties zonder integratie</strong>, zoals rolluiken of ventilatie die als losse toevoeging ogen.</li>
            </ul>
            <p>Modern ontwerp is dus minder vergevingsgezind dan veel mensen denken. Hoe eenvoudiger het beeld, hoe meer elke fout opvalt.</p>

            <h2 id="voorbeelden">Praktische scenario's</h2>
            <h3>Scenario 1: moderne rijwoning</h3>
            <p>Hier werkt een strakke kunststof of polyester uitstraling vaak goed, mits de maatvoering rustig blijft.</p>
            <h3>Scenario 2: oudere woning met modern gewenste toevoeging</h3>
            <p>Dan moet je zorgen dat de dakkapel hedendaags is zonder visueel te botsen met de rest van het huis.</p>
            <h3>Scenario 3: dakkapel met extra opties</h3>
            <p>Dan telt integratie dubbel mee. Elke losse toevoeging kan het moderne beeld verzwakken.</p>
            <h3>Scenario 4: veel glas en brede opzet</h3>
            <p>Dat kan modern ogen, maar alleen als de verhoudingen van de ramen en het dakvlak blijven kloppen.</p>

            <h2 id="checklist">Checklist voor een moderne uitstraling</h2>
            <ol>
              <li>Klopt de verhouding tussen dakkapel, dakvlak en raamverdeling?</li>
              <li>Is de materiaal- en kleurkeuze rustig en passend bij de woning?</li>
              <li>Zijn extra opties visueel goed geïntegreerd?</li>
              <li>Is de detaillering strak in plaats van druk?</li>
              <li>Bekijk je voorbeelden op echte woningen en niet alleen op studiofoto's?</li>
            </ol>

            <h2 id="tips">Tips voor huiseigenaren</h2>
            <ol>
              <li>Kijk bij moderne ontwerpen extra kritisch naar verhoudingen en niet alleen naar losse materialen.</li>
              <li>Vraag de leverancier om referenties op vergelijkbare woningen.</li>
              <li>Beoordeel kleur en glans altijd in relatie tot bestaande kozijnen en gevel.</li>
              <li>Houd accessoires en extra opties ondergeschikt aan het totaalbeeld.</li>
            </ol>

            <h2 id="bronnen">Bronnen en referenties</h2>
            <p>Voor dit artikel is gebruikgemaakt van openbare marktinformatie van onder meer:</p>
            <ul>
              <li><a href="https://slimster.nl/dakkapellen/" rel="nofollow noopener" target="_blank">Slimster: dakkapellen overzicht</a></li>
              <li><a href="https://www.homedeal.nl/dakkapel/" rel="nofollow noopener" target="_blank">Homedeal: dakkapel informatie</a></li>
              <li><a href="https://www.homedeal.nl/dakkapel/dakkapel-vergelijken/" rel="nofollow noopener" target="_blank">Homedeal: dakkapellen vergelijken</a></li>
            </ul>

            <h2 id="faq">Veelgestelde vragen</h2>
            <h3>Is een moderne dakkapel altijd van kunststof?</h3>
            <p>Nee. Kunststof komt vaak voor, maar modern draait vooral om vorm, proportie en afwerking.</p>
            <h3>Welke kleur past het best?</h3>
            <p>Meestal rustige neutrale kleuren, maar de beste keuze hangt af van de woning zelf.</p>
            <h3>Kunnen rolluiken bij een moderne dakkapel?</h3>
            <p>Ja, maar alleen als ze goed worden geïntegreerd en het ontwerp niet onrustig maken.</p>
            <h3>Waarom ogen sommige moderne dakkapellen toch rommelig?</h3>
            <p>Omdat verhoudingen, extra opties of raamverdeling niet goed op elkaar zijn afgestemd.</p>
            <h3>Is modern altijd duurder?</h3>
            <p>Nee, maar strakke detaillering en nette integratie vragen wel vaak om zorgvuldiger ontwerpkeuzes.</p>`,
    faqs: [
      { q: "Is een moderne dakkapel altijd van kunststof?", a: "Nee. Kunststof komt vaak voor, maar modern draait vooral om vorm, proportie en afwerking." },
      { q: "Welke kleur past het best?", a: "Meestal rustige neutrale kleuren, maar de beste keuze hangt af van de woning zelf." },
      { q: "Kunnen rolluiken bij een moderne dakkapel?", a: "Ja, maar alleen als ze goed worden geïntegreerd en het ontwerp niet onrustig maken." },
      { q: "Waarom ogen sommige moderne dakkapellen toch rommelig?", a: "Omdat verhoudingen, extra opties of raamverdeling niet goed op elkaar zijn afgestemd." },
      { q: "Is modern altijd duurder?", a: "Nee, maar strakke detaillering en nette integratie vragen wel vaak om zorgvuldiger ontwerpkeuzes." }
    ]
  },
  {
    file: "kenniscentrum/dakkapel-met-plat-dak/index.html",
    title: "Dakkapel met plat dak: voordelen, uitstraling en aandachtspunten",
    description:
      "Lees wanneer een dakkapel met plat dak de logische keuze is en welke rol uitstraling, plaatsing, onderhoud en afwatering spelen.",
    h1: "Dakkapel met plat dak",
    readTime: "8 min leestijd",
    articleHtml: `
            <div class="article-toc"><h2>Inhoudsopgave</h2><ol>
                <li><a href="#kort-antwoord">Kort antwoord</a></li>
                <li><a href="#waarom">Waarom wordt een plat dak zo vaak gekozen?</a></li>
                <li><a href="#aandachtspunten">Welke aandachtspunten horen erbij?</a></li>
                <li><a href="#vergelijking">Plat dak versus schuin dak</a></li>
                <li><a href="#voorbeelden">Praktische scenario's</a></li>
                <li><a href="#checklist">Checklist voor je keuze</a></li>
                <li><a href="#tips">Tips voor huiseigenaren</a></li>
                <li><a href="#bronnen">Bronnen en referenties</a></li>
                <li><a href="#faq">Veelgestelde vragen</a></li>
            </ol></div>
            <div class="editorial-note"><strong>Redactionele noot:</strong> Dit artikel is bijgewerkt op 11 maart 2026 door <strong>J. Arrascaeta</strong>, hoofdredacteur van DakkapellenKosten.nl. De uitleg is gebaseerd op openbare leveranciersinformatie over dakvormen, prefab/maatwerk en onderhoud van platte dakkapeldaken. Lees meer over onze <a href="../../redactie/#j-arrascaeta">redactie</a> en <a href="../../werkwijze/">werkwijze</a>.</div>
            <p>Een dakkapel met plat dak is in Nederland de meest voorkomende uitvoering. Dat komt niet alleen door smaak, maar ook doordat deze vorm praktisch, goed maakbaar en breed inzetbaar is. Een plat dak laat zich relatief eenvoudig combineren met prefab, moderne uitstraling en een efficiënte binnenruimte.</p>
            <p>Dat maakt een plat dak niet automatisch voor elke woning de enige logische keuze. Ook hier tellen proportie, afwatering, onderhoud en ontwerp mee. Wie alleen denkt “plat is standaard”, mist de kwaliteit van de uitwerking.</p>
            <h2 id="kort-antwoord">Kort antwoord</h2>
            <p>Een dakkapel met plat dak is vaak de logische standaard omdat hij praktisch, breed toepasbaar en goed te combineren is met prefab en moderne materialen. De vorm levert vaak veel bruikbare binnenruimte op en laat zich relatief strak ontwerpen.</p>
            <p>Belangrijk blijft wel dat afwatering, dakbedekking en de totale verhouding met het dakvlak goed worden uitgevoerd. Een plat dak is pas sterk als de details kloppen.</p>
            <h2 id="waarom">Waarom wordt een plat dak zo vaak gekozen?</h2>
            <ul>
              <li><strong>Praktische uitvoerbaarheid</strong> maakt deze vorm geschikt voor veel standaardwoningen.</li>
              <li><strong>Veel bruikbare binnenruimte</strong> zonder onnodige vormverliezen aan de bovenzijde.</li>
              <li><strong>Strakke uitstraling</strong> die goed past bij moderne en neutrale ontwerpen.</li>
              <li><strong>Goede combinatie met prefab</strong>, waardoor plaatsing efficiënt kan verlopen.</li>
            </ul>
            <h2 id="aandachtspunten">Welke aandachtspunten horen erbij?</h2>
            <div style="overflow-x:auto;margin-bottom:var(--sp-6);"><table class="price-table"><thead><tr><th>Onderdeel</th><th>Waarom het telt</th><th>Waar je op let</th></tr></thead><tbody>
              <tr><td>Afwatering</td><td>Plat betekent niet dat water mag blijven staan</td><td>Goede afvoer en detailafwerking</td></tr>
              <tr><td>Dakbedekking</td><td>Kwetsbare detailzone</td><td>Kwaliteit en onderhoud blijven belangrijk</td></tr>
              <tr><td>Verhouding</td><td>Rustig ontwerp vraagt goede maatvoering</td><td>Breedte en hoogte moeten kloppen</td></tr>
              <tr><td>Onderhoud</td><td>Ook een plat dakkapeldak vraagt controle</td><td>Inspecteer naden en vervuiling periodiek</td></tr>
            </tbody></table></div>
            <h2 id="vergelijking">Plat dak versus schuin dak</h2>
            <p>Een plat dak is meestal praktischer en neutraler in uitstraling. Een schuin dak wordt vaker gekozen als stijl of woningkarakter belangrijker is. De keuze gaat dus niet alleen over smaak, maar ook over hoe standaard of opvallend de dakkapel mag zijn.</p>
            <h2 id="voorbeelden">Praktische scenario's</h2>
            <h3>Scenario 1: standaard rijwoning</h3><p>Hier is een plat dak meestal de logische, rustige en efficiënt te realiseren oplossing.</p>
            <h3>Scenario 2: moderne woning</h3><p>Een plat dak sluit vaak goed aan op een strak ontwerp, mits maatvoering en kozijnverdeling kloppen.</p>
            <h3>Scenario 3: woning met uitgesproken karakter</h3><p>Dan moet je afwegen of een schuin dak beter aansluit op het bestaande beeld.</p>
            <h2 id="checklist">Checklist voor je keuze</h2>
            <ol>
              <li>Past een strakke standaardvorm bij jouw woning?</li>
              <li>Is afwatering en dakbedekking duidelijk uitgewerkt in de offerte?</li>
              <li>Vergelijk je deze vorm ook met een schuin dak op uitstraling?</li>
              <li>Klopt de maatvoering met het dakvlak?</li>
              <li>Weet je welk onderhoud het platte dakdeel vraagt?</li>
            </ol>
            <h2 id="tips">Tips voor huiseigenaren</h2>
            <ol>
              <li>Beoordeel een plat dak niet als “standaard dus vanzelf goed”; details blijven bepalend.</li>
              <li>Vraag expliciet naar dakbedekking en afwatering van het bovendeel.</li>
              <li>Kijk naar voorbeelden op vergelijkbare woningen, niet alleen naar losse productfoto’s.</li>
              <li>Gebruik de rustige vorm als kans om ook kozijnindeling en breedte goed af te stemmen.</li>
            </ol>
            <h2 id="bronnen">Bronnen en referenties</h2>
            <p>Voor dit artikel is gebruikgemaakt van openbare marktinformatie van onder meer:</p>
            <ul>
              <li><a href="https://slimster.nl/dakkapellen/" rel="nofollow noopener" target="_blank">Slimster: dakkapellen overzicht</a></li>
              <li><a href="https://www.homedeal.nl/dakkapel/" rel="nofollow noopener" target="_blank">Homedeal: dakkapel informatie</a></li>
              <li><a href="https://www.werkspot.nl/uitbouw-renovatie/prijzen-kosten/dakkapel-plaatsen-vervangen" rel="nofollow noopener" target="_blank">Werkspot: dakkapel plaatsen of vervangen</a></li>
            </ul>
            <h2 id="faq">Veelgestelde vragen</h2>
            <h3>Waarom hebben de meeste dakkapellen een plat dak?</h3><p>Omdat die vorm praktisch, efficiënt en breed toepasbaar is.</p>
            <h3>Is een plat dak onderhoudsgevoeliger?</h3><p>Niet per se, maar afwatering en dakbedekking moeten wel goed worden gecontroleerd.</p>
            <h3>Past een plat dak altijd beter bij moderne woningen?</h3><p>Vaak wel, maar de totale uitvoering bepaalt uiteindelijk het beeld.</p>
            <h3>Is dit de goedkoopste vorm?</h3><p>Vaak wel een logische en concurrerende standaard, maar prijs hangt ook af van breedte, materiaal en afwerking.</p>
            <h3>Moet ik een schuin dak ook mee vergelijken?</h3><p>Ja, zeker als uitstraling en woningkarakter zwaar meewegen.</p>`,
    faqs: [
      { q: "Waarom hebben de meeste dakkapellen een plat dak?", a: "Omdat die vorm praktisch, efficiënt en breed toepasbaar is." },
      { q: "Is een plat dak onderhoudsgevoeliger?", a: "Niet per se, maar afwatering en dakbedekking moeten wel goed worden gecontroleerd." },
      { q: "Past een plat dak altijd beter bij moderne woningen?", a: "Vaak wel, maar de totale uitvoering bepaalt uiteindelijk het beeld." },
      { q: "Is dit de goedkoopste vorm?", a: "Vaak wel een logische en concurrerende standaard, maar prijs hangt ook af van breedte, materiaal en afwerking." },
      { q: "Moet ik een schuin dak ook mee vergelijken?", a: "Ja, zeker als uitstraling en woningkarakter zwaar meewegen." }
    ]
  },
  {
    file: "kenniscentrum/dakkapel-met-schuin-dak/index.html",
    title: "Dakkapel met schuin dak: uitstraling, toepassing en aandachtspunten",
    description:
      "Lees wanneer een dakkapel met schuin dak beter past dan een plat dak en hoe uitstraling, woningtype en uitvoering de keuze bepalen.",
    h1: "Dakkapel met schuin dak",
    readTime: "8 min leestijd",
    articleHtml: `
            <div class="article-toc"><h2>Inhoudsopgave</h2><ol>
              <li><a href="#kort-antwoord">Kort antwoord</a></li>
              <li><a href="#waarom">Wanneer kies je voor een schuin dak?</a></li>
              <li><a href="#verschil">Verschil met een plat dak</a></li>
              <li><a href="#aandachtspunten">Belangrijke aandachtspunten</a></li>
              <li><a href="#voorbeelden">Praktische scenario's</a></li>
              <li><a href="#checklist">Checklist voor je keuze</a></li>
              <li><a href="#tips">Tips voor huiseigenaren</a></li>
              <li><a href="#bronnen">Bronnen en referenties</a></li>
              <li><a href="#faq">Veelgestelde vragen</a></li>
            </ol></div>
            <div class="editorial-note"><strong>Redactionele noot:</strong> Dit artikel is bijgewerkt op 11 maart 2026 door <strong>J. Arrascaeta</strong>, hoofdredacteur van DakkapellenKosten.nl. De uitleg is gebaseerd op openbare leveranciersinformatie over dakvormen, maatwerk en ontwerpkeuzes bij dakkapellen. Lees meer over onze <a href="../../redactie/#j-arrascaeta">redactie</a> en <a href="../../werkwijze/">werkwijze</a>.</div>
            <p>Een dakkapel met schuin dak wordt meestal niet gekozen omdat hij standaard of het goedkoopst is, maar omdat hij visueel beter aansluit op een bepaalde woning. Bij karaktervolle huizen, traditionele dakbeelden of situaties waarin de dakkapel nadrukkelijk zichtbaar is, kan een schuin dak veel natuurlijker ogen dan een plat model.</p>
            <p>Daarmee is een schuin dak vooral een ontwerpkeuze met praktische gevolgen. Het vraagt vaak meer aandacht voor maatwerk, detaillering en samenhang met het bestaande dakvlak.</p>
            <h2 id="kort-antwoord">Kort antwoord</h2>
            <p>Een dakkapel met schuin dak is vooral logisch als uitstraling en aansluiting op de woning belangrijker zijn dan de meest standaard en efficiënte vorm. De keuze wordt vaak gestuurd door stijl, welstand of woningkarakter.</p>
            <p>Praktisch gezien vraagt deze vorm meer ontwerp- en uitvoeringsaandacht dan een plat dak. Daarom moet je goed kijken of de esthetische winst in jouw situatie echt relevant is.</p>
            <h2 id="waarom">Wanneer kies je voor een schuin dak?</h2>
            <ul>
              <li><strong>Bij karaktervolle of traditionele woningen</strong> waar een plat dak te modern of te hard oogt.</li>
              <li><strong>Bij zichtbare voorzijdes</strong> waar het straatbeeld of welstand zwaarder kan meewegen.</li>
              <li><strong>Als de dakkapel onderdeel van de architectuur moet voelen</strong> in plaats van een duidelijke toevoeging.</li>
            </ul>
            <h2 id="verschil">Verschil met een plat dak</h2>
            <div style="overflow-x:auto;margin-bottom:var(--sp-6);"><table class="price-table"><thead><tr><th>Onderdeel</th><th>Schuin dak</th><th>Plat dak</th></tr></thead><tbody>
              <tr><td>Uitstraling</td><td>Traditioneler en zachter</td><td>Strakker en neutraler</td></tr>
              <tr><td>Toepassing</td><td>Meer ontwerpkeuze</td><td>Vaker standaardoplossing</td></tr>
              <tr><td>Uitvoering</td><td>Vraagt vaker maatwerk</td><td>Vaker efficiënt en prefab</td></tr>
              <tr><td>Kiezen op</td><td>Woningkarakter en zichtwaarde</td><td>Praktiek, ruimte en standaardisatie</td></tr>
            </tbody></table></div>
            <h2 id="aandachtspunten">Belangrijke aandachtspunten</h2>
            <ul>
              <li><strong>Verhoudingen zijn cruciaal</strong>; een schuin dak moet echt aansluiten op het huis.</li>
              <li><strong>Prijs en maatwerk</strong> kunnen hoger uitvallen dan bij een standaard plat dak.</li>
              <li><strong>Vergunning en welstand</strong> kunnen juist een reden zijn om deze vorm te kiezen.</li>
              <li><strong>Niet elke woning wint erbij</strong>; soms wordt het ontwerp juist onrustiger.</li>
            </ul>
            <h2 id="voorbeelden">Praktische scenario's</h2>
            <h3>Scenario 1: jaren-30 woning</h3><p>Hier kan een schuin dak visueel veel logischer zijn dan een strak plat model.</p>
            <h3>Scenario 2: moderne achterzijde</h3><p>Dan wint een plat dak vaak op rust en efficiëntie.</p>
            <h3>Scenario 3: zichtzijde met ontwerpgevoeligheid</h3><p>Daar kan een schuin dak het verschil maken tussen passend en toegevoegd.</p>
            <h2 id="checklist">Checklist voor je keuze</h2>
            <ol>
              <li>Past de schuin-dakvorm aantoonbaar beter bij de woning?</li>
              <li>Is maatwerk of extra ontwerpwerk acceptabel binnen je budget?</li>
              <li>Speelt zichtbaarheid of welstand een rol?</li>
              <li>Vergelijk je ook met een plat dak op uitstraling en prijs?</li>
              <li>Heb je referenties gezien op vergelijkbare woningen?</li>
            </ol>
            <h2 id="tips">Tips voor huiseigenaren</h2>
            <ol>
              <li>Kies een schuin dak alleen als het woningbeeld daar echt sterker van wordt.</li>
              <li>Vraag visuele voorbeelden of tekeningen, niet alleen technische omschrijvingen.</li>
              <li>Weeg ontwerpwinst af tegen extra maatwerk en prijs.</li>
              <li>Vergelijk altijd met een plat dak om te zien of de meerwaarde echt zichtbaar is.</li>
            </ol>
            <h2 id="bronnen">Bronnen en referenties</h2>
            <p>Voor dit artikel is gebruikgemaakt van openbare marktinformatie van onder meer:</p>
            <ul>
              <li><a href="https://www.homedeal.nl/dakkapel/" rel="nofollow noopener" target="_blank">Homedeal: dakkapel informatie</a></li>
              <li><a href="https://slimster.nl/dakkapellen/" rel="nofollow noopener" target="_blank">Slimster: dakkapellen overzicht</a></li>
              <li><a href="https://www.werkspot.nl/uitbouw-renovatie/prijzen-kosten/dakkapel-plaatsen-vervangen" rel="nofollow noopener" target="_blank">Werkspot: dakkapel plaatsen of vervangen</a></li>
            </ul>
            <h2 id="faq">Veelgestelde vragen</h2>
            <h3>Waarom kiezen mensen voor een dakkapel met schuin dak?</h3><p>Vooral vanwege uitstraling en betere aansluiting op traditionele of karaktervolle woningen.</p>
            <h3>Is een schuin dak duurder?</h3><p>Dat kan, omdat maatwerk en ontwerp vaker een grotere rol spelen.</p>
            <h3>Past een schuin dak beter op de voorkant?</h3><p>In veel gevallen wel, zeker als het straatbeeld of welstand zwaar meeweegt.</p>
            <h3>Levert een schuin dak meer ruimte op?</h3><p>Niet per se; de keuze is vaker esthetisch dan ruimtelijk.</p>
            <h3>Moet je deze vorm altijd met een plat dak vergelijken?</h3><p>Ja, anders zie je niet goed of de ontwerpwinst de extra aandacht waard is.</p>`,
    faqs: [
      { q: "Waarom kiezen mensen voor een dakkapel met schuin dak?", a: "Vooral vanwege uitstraling en betere aansluiting op traditionele of karaktervolle woningen." },
      { q: "Is een schuin dak duurder?", a: "Dat kan, omdat maatwerk en ontwerp vaker een grotere rol spelen." },
      { q: "Past een schuin dak beter op de voorkant?", a: "In veel gevallen wel, zeker als het straatbeeld of welstand zwaar meeweegt." },
      { q: "Levert een schuin dak meer ruimte op?", a: "Niet per se; de keuze is vaker esthetisch dan ruimtelijk." },
      { q: "Moet je deze vorm altijd met een plat dak vergelijken?", a: "Ja, anders zie je niet goed of de ontwerpwinst de extra aandacht waard is." }
    ]
  },
  {
    file: "kenniscentrum/dakkapel-isoleren-tijdens-plaatsing/index.html",
    title: "Dakkapel isoleren tijdens plaatsing: waarom dit het slimste moment is",
    description:
      "Lees waarom isolatie tijdens de plaatsing van een dakkapel efficiënter is dan achteraf verbeteren en waar je op moet letten bij opbouw, ventilatie en afwerking.",
    h1: "Dakkapel isoleren tijdens plaatsing",
    readTime: "8 min leestijd",
    articleHtml: `
            <div class="article-toc"><h2>Inhoudsopgave</h2><ol>
              <li><a href="#kort-antwoord">Kort antwoord</a></li>
              <li><a href="#waarom">Waarom is plaatsing het beste isolatiemoment?</a></li>
              <li><a href="#kritische-punten">Welke onderdelen moeten dan meteen goed?</a></li>
              <li><a href="#offerte">Wat vraag je uit in de offerte?</a></li>
              <li><a href="#voorbeelden">Praktische scenario's</a></li>
              <li><a href="#checklist">Checklist voor isolatiekeuzes</a></li>
              <li><a href="#tips">Tips voor huiseigenaren</a></li>
              <li><a href="#bronnen">Bronnen en referenties</a></li>
              <li><a href="#faq">Veelgestelde vragen</a></li>
            </ol></div>
            <div class="editorial-note"><strong>Redactionele noot:</strong> Dit artikel is bijgewerkt op 11 maart 2026 door <strong>J. Arrascaeta</strong>, hoofdredacteur van DakkapellenKosten.nl. De uitleg is gebaseerd op openbare leveranciersinformatie, bouwkundige uitleg over isolatie en algemene richtlijnen rond condens, ventilatie en binnenafwerking. Lees meer over onze <a href="../../redactie/#j-arrascaeta">redactie</a> en <a href="../../werkwijze/">werkwijze</a>.</div>
            <p>Een dakkapel isoleren tijdens plaatsing is vrijwel altijd slimmer dan dezelfde verbetering achteraf proberen in te bouwen. Tijdens de montage liggen constructie, aansluitingen en binnenzijde nog open. Dat maakt het veel eenvoudiger om isolatie, kierdichting, dampremming en afwerking als één systeem te behandelen in plaats van als losse reparatie achteraf.</p>
            <p>Daarmee is isolatie tijdens plaatsing niet alleen een energiekeuze, maar ook een comfort- en kwaliteitskeuze. Goede isolatie werkt pas echt als details rond aansluitingen, ventilatie en binnenafwerking tegelijk goed worden meegenomen.</p>

            <h2 id="kort-antwoord">Kort antwoord</h2>
            <p>Het slimste moment om een dakkapel goed te isoleren is tijdens de plaatsing zelf. Dan kun je de opbouw in één keer goed uitvoeren en voorkom je later extra openbreekwerk, herstelkosten en comfortproblemen.</p>
            <p>Vooral de aansluiting op bestaand dak, wand en binnenafwerking bepaalt of de isolatie echt goed presteert. Juist daar gaat het mis als je isolatie als losse optie ziet.</p>

            <h2 id="waarom">Waarom is plaatsing het beste isolatiemoment?</h2>
            <ul>
              <li><strong>De constructie ligt open</strong>, waardoor je details direct goed kunt uitvoeren.</li>
              <li><strong>Aansluitingen zijn zichtbaar</strong> en daardoor beter te controleren op koudebruggen en kieren.</li>
              <li><strong>Binnenafwerking kan meteen aansluiten</strong> op de gekozen isolatie-opbouw.</li>
              <li><strong>Achteraf verbeteren</strong> betekent vaak extra werk, meer rommel en minder efficiënt herstel.</li>
            </ul>

            <h2 id="kritische-punten">Welke onderdelen moeten dan meteen goed?</h2>
            <div style="overflow-x:auto;margin-bottom:var(--sp-6);"><table class="price-table"><thead><tr><th>Onderdeel</th><th>Waarom belangrijk</th><th>Gevolg als het niet klopt</th></tr></thead><tbody>
              <tr><td>Aansluiting op dak en wand</td><td>Voorkomt kieren en koudebruggen</td><td>Tocht en warmteverlies</td></tr>
              <tr><td>Isolatie-opbouw</td><td>Bepaalt comfort en prestatie</td><td>Minder effect dan verwacht</td></tr>
              <tr><td>Dampremming/vochtbeheersing</td><td>Beperkt condensrisico</td><td>Vochtproblemen aan de binnenzijde</td></tr>
              <tr><td>Ventilatie</td><td>Houdt luchtvocht in balans</td><td>Condens en benauwd comfort</td></tr>
            </tbody></table></div>

            <h2 id="offerte">Wat vraag je uit in de offerte?</h2>
            <ul>
              <li><strong>Welke isolatie standaard in de dakkapelopbouw zit</strong>.</li>
              <li><strong>Hoe de aansluiting op bestaand dak en bestaande wanden wordt uitgevoerd</strong>.</li>
              <li><strong>Of binnenafwerking onderdeel is van dezelfde aanpak</strong>.</li>
              <li><strong>Hoe ventilatie en condenspreventie zijn meegenomen</strong>.</li>
            </ul>
            <p>Vooral bij prefab moet je goed weten wat al in de fabriek gebeurt en wat nog op locatie wordt afgewerkt.</p>

            <h2 id="voorbeelden">Praktische scenario's</h2>
            <h3>Scenario 1: nieuwe dakkapel op kale zolder</h3><p>Dan is dit het ideale moment om de hele opbouw direct goed te laten aansluiten.</p>
            <h3>Scenario 2: bestaande zolder met oude isolatie</h3><p>Dan moet je niet alleen de nieuwe dakkapel, maar ook de overgang naar de bestaande situatie kritisch bekijken.</p>
            <h3>Scenario 3: ruimte met eerder vocht- of condensverleden</h3><p>Dan zijn ventilatie en dampopbouw minstens zo belangrijk als de isolatiedikte zelf.</p>

            <h2 id="checklist">Checklist voor isolatiekeuzes</h2>
            <ol>
              <li>Weet je welke isolatieopbouw standaard wordt toegepast?</li>
              <li>Is de aansluiting op bestaand dak en binnenzijde duidelijk uitgewerkt?</li>
              <li>Wordt ventilatie expliciet meegenomen in de oplossing?</li>
              <li>Is binnenafwerking onderdeel van het traject of volgt die later?</li>
              <li>Beoordeel je isolatie als systeem en niet als losse optie?</li>
            </ol>

            <h2 id="tips">Tips voor huiseigenaren</h2>
            <ol>
              <li>Vraag niet alleen naar isolatiewaarde, maar ook naar de complete opbouw.</li>
              <li>Koppel isolatie altijd aan ventilatie en afwerking.</li>
              <li>Gebruik de plaatsingsfase om koudebruggen en kierproblemen direct te voorkomen.</li>
              <li>Lees deze keuze altijd samen met condens- en binnenafwerkingsvragen.</li>
            </ol>

            <h2 id="bronnen">Bronnen en referenties</h2>
            <p>Voor dit artikel is gebruikgemaakt van openbare informatie van onder meer:</p>
            <ul>
              <li><a href="https://slimster.nl/dakkapellen/" rel="nofollow noopener" target="_blank">Slimster: dakkapellen overzicht</a></li>
              <li><a href="https://www.homedeal.nl/dakkapel/" rel="nofollow noopener" target="_blank">Homedeal: dakkapel informatie</a></li>
              <li><a href="https://www.rijksoverheid.nl/onderwerpen/bouwregelgeving" rel="nofollow noopener" target="_blank">Rijksoverheid: bouwregelgeving</a></li>
            </ul>

            <h2 id="faq">Veelgestelde vragen</h2>
            <h3>Waarom is isoleren tijdens plaatsing slimmer dan achteraf?</h3><p>Omdat constructie en aansluitingen dan nog open liggen en je de opbouw in één keer goed kunt uitvoeren.</p>
            <h3>Voorkomt goede isolatie ook condens?</h3><p>Dat helpt, maar alleen in combinatie met goede ventilatie en correcte opbouw.</p>
            <h3>Moet je dit apart bespreken in de offerte?</h3><p>Ja, vooral de opbouw en aansluiting moeten expliciet benoemd zijn.</p>
            <h3>Is alleen de isolatiewaarde genoeg informatie?</h3><p>Nee. De totale detailopbouw bepaalt of de prestatie in de praktijk ook klopt.</p>
            <h3>Wanneer is dit extra belangrijk?</h3><p>Bij oude zolders, bekende comfortklachten of wanneer de ruimte intensief gebruikt gaat worden.</p>`,
    faqs: [
      { q: "Waarom is isoleren tijdens plaatsing slimmer dan achteraf?", a: "Omdat constructie en aansluitingen dan nog open liggen en je de opbouw in één keer goed kunt uitvoeren." },
      { q: "Voorkomt goede isolatie ook condens?", a: "Dat helpt, maar alleen in combinatie met goede ventilatie en correcte opbouw." },
      { q: "Moet je dit apart bespreken in de offerte?", a: "Ja, vooral de opbouw en aansluiting moeten expliciet benoemd zijn." },
      { q: "Is alleen de isolatiewaarde genoeg informatie?", a: "Nee. De totale detailopbouw bepaalt of de prestatie in de praktijk ook klopt." },
      { q: "Wanneer is dit extra belangrijk?", a: "Bij oude zolders, bekende comfortklachten of wanneer de ruimte intensief gebruikt gaat worden." }
    ]
  },
  {
    file: "kenniscentrum/dakconstructie-aanpassen-voor-dakkapel/index.html",
    title: "Dakconstructie aanpassen voor dakkapel: wanneer is dat nodig?",
    description:
      "Lees wanneer een dakconstructie voor een dakkapel moet worden aangepast en waarom opname, berekening en uitvoeringskwaliteit hierbij belangrijk zijn.",
    h1: "Dakconstructie aanpassen voor dakkapel",
    readTime: "8 min leestijd",
    articleHtml: `
            <div class="article-toc"><h2>Inhoudsopgave</h2><ol>
              <li><a href="#kort-antwoord">Kort antwoord</a></li>
              <li><a href="#wanneer">Wanneer is een constructieve aanpassing nodig?</a></li>
              <li><a href="#proces">Hoe wordt dat normaal beoordeeld?</a></li>
              <li><a href="#offerte">Wat moet je hierover terugzien in de offerte?</a></li>
              <li><a href="#voorbeelden">Praktische scenario's</a></li>
              <li><a href="#checklist">Checklist voor huiseigenaren</a></li>
              <li><a href="#tips">Tips voor huiseigenaren</a></li>
              <li><a href="#bronnen">Bronnen en referenties</a></li>
              <li><a href="#faq">Veelgestelde vragen</a></li>
            </ol></div>
            <div class="editorial-note"><strong>Redactionele noot:</strong> Dit artikel is bijgewerkt op 11 maart 2026 door <strong>J. Arrascaeta</strong>, hoofdredacteur van DakkapellenKosten.nl. De uitleg is gebaseerd op openbare informatie over dakkapelplaatsing, bouwregelgeving en gangbare praktijk rond opname, tekenwerk en constructieve beoordeling. Lees meer over onze <a href="../../redactie/#j-arrascaeta">redactie</a> en <a href="../../werkwijze/">werkwijze</a>.</div>
            <p>Een dakconstructie aanpassen voor een dakkapel is niet bij elk project nodig, maar het is ook geen uitzonderlijk onderwerp. Zodra een dakkapel invloed heeft op dragende delen, maatvoering, overspanning of de bestaande dakopbouw, moet beoordeeld worden of extra constructieve maatregelen nodig zijn. Dat gebeurt meestal niet op gevoel, maar op basis van opname, ervaring en soms berekening of tekenwerk.</p>
            <p>Voor huiseigenaren is het belangrijkste om te begrijpen dat constructie geen losse administratieve stap is. Het bepaalt of een plan technisch klopt, wat het kost en of de uitvoering zonder verrassingen kan verlopen.</p>

            <h2 id="kort-antwoord">Kort antwoord</h2>
            <p>Een constructieve aanpassing kan nodig zijn als de dakkapel breed is, de bestaande dakopbouw kwetsbaar is of wanneer het plan invloed heeft op dragende onderdelen van het dak. Dat wordt normaal beoordeeld tijdens opname en voorbereiding.</p>
            <p>Juist daarom is het belangrijk dat een leverancier niet alleen over de dakkapel zelf praat, maar ook over de technische haalbaarheid van jouw dak.</p>

            <h2 id="wanneer">Wanneer is een constructieve aanpassing nodig?</h2>
            <ul>
              <li><strong>Bij bredere dakkapellen</strong> die meer invloed hebben op het bestaande dakvlak.</li>
              <li><strong>Bij oudere of minder standaard dakconstructies</strong> waar de bestaande opbouw niet vanzelfsprekend is.</li>
              <li><strong>Bij complexe maatwerkoplossingen</strong> waar standaarduitvoering niet goed past.</li>
              <li><strong>Wanneer vergunning of tekenwerk</strong> extra onderbouwing vraagt.</li>
            </ul>

            <h2 id="proces">Hoe wordt dat normaal beoordeeld?</h2>
            <div style="overflow-x:auto;margin-bottom:var(--sp-6);"><table class="price-table"><thead><tr><th>Stap</th><th>Wat gebeurt er</th><th>Waarom belangrijk</th></tr></thead><tbody>
              <tr><td>Opname</td><td>De bestaande situatie wordt bekeken</td><td>Eerste check op haalbaarheid en risico's</td></tr>
              <tr><td>Technische beoordeling</td><td>Dakopbouw en maatvoering worden gespiegeld</td><td>Bepaalt of standaardplaatsing volstaat</td></tr>
              <tr><td>Eventueel tekenwerk/berekening</td><td>Nodig bij meer complexiteit</td><td>Maakt plan uitvoerbaar en beter onderbouwd</td></tr>
              <tr><td>Uitvoering</td><td>Aanpassing wordt meegenomen in plaatsing</td><td>Voorkomt improvisatie tijdens montage</td></tr>
            </tbody></table></div>
            <p>Het cruciale punt is dat constructie zo vroeg mogelijk duidelijk moet zijn. Als dit pas laat opduikt, verschuiven prijs en planning vaak mee.</p>

            <h2 id="offerte">Wat moet je hierover terugzien in de offerte?</h2>
            <ul>
              <li><strong>Of constructief werk is inbegrepen</strong> of nog als risico openstaat.</li>
              <li><strong>Of tekenwerk of berekening nodig kan zijn</strong>.</li>
              <li><strong>Wie de verantwoordelijkheid draagt</strong> voor deze beoordeling.</li>
              <li><strong>Wat de impact op planning en prijs is</strong> als extra werk nodig blijkt.</li>
            </ul>
            <p>Hier gaat het vaak mis: een offerte lijkt scherp, maar constructiewerk blijkt later nog buiten beeld te zijn gehouden.</p>

            <h2 id="voorbeelden">Praktische scenario's</h2>
            <h3>Scenario 1: standaard prefab achterzijde</h3><p>Hier is de kans groter dat de constructieve vraag overzichtelijk blijft, al moet ook dan de opname serieus genomen worden.</p>
            <h3>Scenario 2: brede maatwerkdakkapel</h3><p>Dan ligt het meer voor de hand dat technische beoordeling of extra werk nodig is.</p>
            <h3>Scenario 3: oudere woning</h3><p>De bestaande dakopbouw kan dan juist reden zijn om constructie eerder en uitgebreider te bekijken.</p>

            <h2 id="checklist">Checklist voor huiseigenaren</h2>
            <ol>
              <li>Is tijdens opname expliciet naar de dakconstructie gekeken?</li>
              <li>Weet je of constructief werk al in de prijs zit?</li>
              <li>Is duidelijk wie tekenwerk of berekening regelt als dat nodig blijkt?</li>
              <li>Vergelijk je offertes ook op technische volledigheid?</li>
              <li>Is het plan realistisch voor jouw type woning en dak?</li>
            </ol>

            <h2 id="tips">Tips voor huiseigenaren</h2>
            <ol>
              <li>Vraag bij twijfel altijd of er constructieve onzekerheden zijn.</li>
              <li>Zie opname niet als formaliteit, maar als technische sleutelstap.</li>
              <li>Vergelijk aanbieders ook op hoe serieus ze de dakopbouw meenemen.</li>
              <li>Laat prijs nooit los van technische haalbaarheid beoordelen.</li>
            </ol>

            <h2 id="bronnen">Bronnen en referenties</h2>
            <p>Voor dit artikel is gebruikgemaakt van openbare informatie van onder meer:</p>
            <ul>
              <li><a href="https://omgevingsloket.nl" rel="nofollow noopener" target="_blank">Omgevingsloket</a></li>
              <li><a href="https://www.rijksoverheid.nl/onderwerpen/bouwregelgeving" rel="nofollow noopener" target="_blank">Rijksoverheid: bouwregelgeving</a></li>
              <li><a href="https://www.werkspot.nl/uitbouw-renovatie/prijzen-kosten/dakkapel-plaatsen-vervangen" rel="nofollow noopener" target="_blank">Werkspot: dakkapel plaatsen of vervangen</a></li>
            </ul>

            <h2 id="faq">Veelgestelde vragen</h2>
            <h3>Moet elke dakkapel een constructieberekening hebben?</h3><p>Nee, maar elke dakkapel moet wel technisch passend zijn bij het bestaande dak.</p>
            <h3>Wanneer is extra constructiewerk waarschijnlijker?</h3><p>Bij brede, complexe of minder standaard situaties.</p>
            <h3>Komt dit altijd direct in de offerte terug?</h3><p>Dat zou moeten, maar in de praktijk blijft het soms te vaag omschreven.</p>
            <h3>Waarom is opname zo belangrijk?</h3><p>Omdat juist daar zichtbaar wordt of standaardplaatsing haalbaar is of niet.</p>
            <h3>Heeft dit invloed op planning?</h3><p>Ja. Zodra constructiewerk of tekenwerk nodig is, verschuift de voorbereiding vaak mee.</p>`,
    faqs: [
      { q: "Moet elke dakkapel een constructieberekening hebben?", a: "Nee, maar elke dakkapel moet wel technisch passend zijn bij het bestaande dak." },
      { q: "Wanneer is extra constructiewerk waarschijnlijker?", a: "Bij brede, complexe of minder standaard situaties." },
      { q: "Komt dit altijd direct in de offerte terug?", a: "Dat zou moeten, maar in de praktijk blijft het soms te vaag omschreven." },
      { q: "Waarom is opname zo belangrijk?", a: "Omdat juist daar zichtbaar wordt of standaardplaatsing haalbaar is of niet." },
      { q: "Heeft dit invloed op planning?", a: "Ja. Zodra constructiewerk of tekenwerk nodig is, verschuift de voorbereiding vaak mee." }
    ]
  },
  {
    file: "kenniscentrum/fouten-vergelijken-dakkapel-offertes/index.html",
    title: "Veelgemaakte fouten bij dakkapel offertes vergelijken",
    description:
      "Lees welke fouten vaak worden gemaakt bij het vergelijken van dakkapel offertes en hoe je appels met appels vergelijkt op prijs, scope en uitvoering.",
    h1: "Veelgemaakte fouten bij dakkapel offertes vergelijken",
    readTime: "8 min leestijd",
    articleHtml: `
            <div class="article-toc"><h2>Inhoudsopgave</h2><ol>
              <li><a href="#kort-antwoord">Kort antwoord</a></li>
              <li><a href="#topfouten">De grootste vergelijkingsfouten</a></li>
              <li><a href="#scope">Waarom scope belangrijker is dan totaalprijs</a></li>
              <li><a href="#signalen">Welke signalen maken een offerte verdacht?</a></li>
              <li><a href="#voorbeelden">Praktische scenario's</a></li>
              <li><a href="#checklist">Checklist voor eerlijke vergelijking</a></li>
              <li><a href="#tips">Tips voor huiseigenaren</a></li>
              <li><a href="#bronnen">Bronnen en referenties</a></li>
              <li><a href="#faq">Veelgestelde vragen</a></li>
            </ol></div>
            <div class="editorial-note"><strong>Redactionele noot:</strong> Dit artikel is bijgewerkt op 11 maart 2026 door <strong>J. Arrascaeta</strong>, hoofdredacteur van DakkapellenKosten.nl. De uitleg is gebaseerd op openbare marktinformatie, offertevergelijkingen en veelvoorkomende praktijkfouten rond prijs, planning en scope. Lees meer over onze <a href="../../redactie/#j-arrascaeta">redactie</a> en <a href="../../werkwijze/">werkwijze</a>.</div>
            <p>De grootste fout bij dakkapel offertes vergelijken is denken dat je drie prijzen naast elkaar hoeft te zetten en dan de laagste kunt kiezen. In werkelijkheid vergelijk je vaak drie verschillende pakketten: verschillende maten, verschillende afwerking, andere oplevering, andere garanties en soms zelfs een andere bouwmethode. De prijs is dan niet het probleem, de ongelijkheid van de vergelijking wel.</p>
            <p>Wie goed wil vergelijken, moet dus vooral leren herkennen wat níet gelijk is. Pas daarna zegt de totaalprijs iets nuttigs.</p>

            <h2 id="kort-antwoord">Kort antwoord</h2>
            <p>Offertes vergelijken gaat mis zodra breedte, materiaal, afwerking, binnenwerk, planning of garantie niet hetzelfde zijn. Dan lijkt de ene partij goedkoper, terwijl hij in feite minder levert of meer risico open laat.</p>
            <p>Een goede vergelijking begint dus bij scope, niet bij prijs.</p>

            <h2 id="topfouten">De grootste vergelijkingsfouten</h2>
            <ul>
              <li><strong>Alleen naar de eindprijs kijken</strong>.</li>
              <li><strong>Niet controleren of breedte en kozijnindeling gelijk zijn</strong>.</li>
              <li><strong>Binnenafwerking en oplevergrens overslaan</strong>.</li>
              <li><strong>Prefab en traditioneel behandelen alsof het hetzelfde traject is</strong>.</li>
              <li><strong>Constructie, vergunning of tekenwerk buiten beeld laten</strong>.</li>
            </ul>

            <h2 id="scope">Waarom scope belangrijker is dan totaalprijs</h2>
            <div style="overflow-x:auto;margin-bottom:var(--sp-6);"><table class="price-table"><thead><tr><th>Onderdeel</th><th>Als dit verschilt</th><th>Gevolg voor vergelijking</th></tr></thead><tbody>
              <tr><td>Breedte/maat</td><td>Je vergelijkt ander volume</td><td>Prijs zegt weinig</td></tr>
              <tr><td>Materiaal</td><td>Onderhoud en uitstraling verschillen</td><td>Goedkoop en gelijkwaardig zijn niet hetzelfde</td></tr>
              <tr><td>Binnenafwerking</td><td>Oplevering verschilt sterk</td><td>Grote kans op verborgen meerwerk</td></tr>
              <tr><td>Planning en techniek</td><td>Risico’s blijven open</td><td>Lage prijs kan schijnvoordeel zijn</td></tr>
            </tbody></table></div>
            <p>Een offerte is pas echt vergelijkbaar als je weet wat er exact voor het bedrag geleverd wordt. Anders vergelijk je geen leveranciers, maar aannames.</p>

            <h2 id="signalen">Welke signalen maken een offerte verdacht?</h2>
            <ul>
              <li><strong>Weinig detail</strong> in materialen, afwerking of planning.</li>
              <li><strong>Vage formuleringen</strong> als “compleet”, “af” of “standaard inbegrepen” zonder uitwerking.</li>
              <li><strong>Geen duidelijke uitleg</strong> over wie plaatst, wie verantwoordelijk is en wat nazorg inhoudt.</li>
              <li><strong>Een opvallend lage prijs</strong> zonder inhoudelijke verklaring.</li>
            </ul>
            <p>Dat hoeft niet te betekenen dat een partij onbetrouwbaar is, maar wel dat je nog geen echte vergelijking hebt kunnen maken.</p>

            <h2 id="voorbeelden">Praktische scenario's</h2>
            <h3>Scenario 1: goedkope offerte, weinig tekst</h3><p>Vaak de grootste valkuil. Juist de ontbrekende details komen later als vraag of meerwerk terug.</p>
            <h3>Scenario 2: duurdere offerte, maar veel completer</h3><p>Die kan uiteindelijk realistischer en zelfs voordeliger zijn als minder risico open blijft.</p>
            <h3>Scenario 3: prefab versus traditioneel</h3><p>Als je die twee gelijk behandelt, vergelijk je geen identieke trajecten maar verschillende methodes.</p>

            <h2 id="checklist">Checklist voor eerlijke vergelijking</h2>
            <ol>
              <li>Zijn maat, materiaal en kozijnverdeling gelijk?</li>
              <li>Is binnenafwerking op dezelfde manier opgenomen?</li>
              <li>Zijn vergunning, constructie en tekenwerk duidelijk benoemd?</li>
              <li>Is de planning realistisch en vergelijkbaar?</li>
              <li>Weet je wat niet inbegrepen is?</li>
            </ol>

            <h2 id="tips">Tips voor huiseigenaren</h2>
            <ol>
              <li>Gebruik een vaste checklist en laat alle aanbieders op dezelfde punten reageren.</li>
              <li>Vraag ontbrekende details altijd op voordat je een prijsverschil beoordeelt.</li>
              <li>Zie de laagste offerte als startpunt voor vragen, niet als automatische winnaar.</li>
              <li>Vergelijk ook risico, duidelijkheid en nazorg, niet alleen product en prijs.</li>
            </ol>

            <h2 id="bronnen">Bronnen en referenties</h2>
            <p>Voor dit artikel is gebruikgemaakt van openbare marktinformatie van onder meer:</p>
            <ul>
              <li><a href="https://www.werkspot.nl/uitbouw-renovatie/prijzen-kosten/dakkapel-plaatsen-vervangen" rel="nofollow noopener" target="_blank">Werkspot: dakkapel plaatsen of vervangen</a></li>
              <li><a href="https://slimster.nl/dakkapellen/" rel="nofollow noopener" target="_blank">Slimster: dakkapellen overzicht</a></li>
              <li><a href="https://www.bouwendnederland.nl" rel="nofollow noopener" target="_blank">Bouwend Nederland</a></li>
            </ul>

            <h2 id="faq">Veelgestelde vragen</h2>
            <h3>Wat is de grootste fout bij offertes vergelijken?</h3><p>Alleen naar de totaalprijs kijken zonder de scope gelijk te maken.</p>
            <h3>Waarom lijkt een goedkope offerte soms aantrekkelijker dan hij is?</h3><p>Omdat belangrijke onderdelen of risico’s niet volledig zijn uitgewerkt.</p>
            <h3>Moet binnenafwerking altijd apart worden gecontroleerd?</h3><p>Ja, omdat daar veel verschillen tussen offertes ontstaan.</p>
            <h3>Zijn prefab en traditioneel goed vergelijkbaar?</h3><p>Alleen als je duidelijk maakt welke verschillen in planning, maatwerk en afwerking je meeneemt.</p>
            <h3>Wat is de beste manier om appels met appels te vergelijken?</h3><p>Door op vaste punten dezelfde informatie op te vragen bij alle aanbieders.</p>`,
    faqs: [
      { q: "Wat is de grootste fout bij offertes vergelijken?", a: "Alleen naar de totaalprijs kijken zonder de scope gelijk te maken." },
      { q: "Waarom lijkt een goedkope offerte soms aantrekkelijker dan hij is?", a: "Omdat belangrijke onderdelen of risico’s niet volledig zijn uitgewerkt." },
      { q: "Moet binnenafwerking altijd apart worden gecontroleerd?", a: "Ja, omdat daar veel verschillen tussen offertes ontstaan." },
      { q: "Zijn prefab en traditioneel goed vergelijkbaar?", a: "Alleen als je duidelijk maakt welke verschillen in planning, maatwerk en afwerking je meeneemt." },
      { q: "Wat is de beste manier om appels met appels te vergelijken?", a: "Door op vaste punten dezelfde informatie op te vragen bij alle aanbieders." }
    ]
  },
  {
    file: "kenniscentrum/tocht-bij-dakkapel-oplossen/index.html",
    title: "Tocht bij dakkapel oplossen: oorzaken, checks en aanpak",
    description:
      "Lees waardoor tocht bij een dakkapel ontstaat en hoe je luchtlekken, rubbers, aansluitingen en comfortproblemen systematisch beoordeelt.",
    h1: "Tocht bij dakkapel oplossen",
    readTime: "8 min leestijd",
    articleHtml: `
            <div class="article-toc"><h2>Inhoudsopgave</h2><ol>
              <li><a href="#kort-antwoord">Kort antwoord</a></li>
              <li><a href="#oorzaken">Wat zijn de meest voorkomende oorzaken?</a></li>
              <li><a href="#lokaliseren">Hoe lokaliseer je het probleem?</a></li>
              <li><a href="#oplossen">Welke oplossingen zijn logisch?</a></li>
              <li><a href="#voorbeelden">Praktische scenario's</a></li>
              <li><a href="#checklist">Checklist bij tochtklachten</a></li>
              <li><a href="#tips">Tips voor huiseigenaren</a></li>
              <li><a href="#bronnen">Bronnen en referenties</a></li>
              <li><a href="#faq">Veelgestelde vragen</a></li>
            </ol></div>
            <div class="editorial-note"><strong>Redactionele noot:</strong> Dit artikel is bijgewerkt op 11 maart 2026 door <strong>J. Arrascaeta</strong>, hoofdredacteur van DakkapellenKosten.nl. De uitleg is gebaseerd op openbare onderhoudsinformatie en algemene bouwkundige praktijkpunten rond kierdichting, aansluitingen, rubbers en comfortproblemen. Lees meer over onze <a href="../../redactie/#j-arrascaeta">redactie</a> en <a href="../../werkwijze/">werkwijze</a>.</div>
            <p>Tocht bij een dakkapel voelt soms als een klein comfortprobleem, maar het wijst vaak op iets concreets: versleten rubbers, kieren in de afwerking, luchtlekken rond aansluitingen of een detail in de opbouw dat niet goed afsluit. Daarom is tocht niet iets om zomaar weg te wuiven. Zelfs als er geen lekkage is, kost tocht comfort, energie en vaak ook rust in de ruimte.</p>
            <p>De eerste stap is niet direct repareren, maar gericht lokaliseren waar de luchtbeweging vandaan komt. Pas daarna kun je beoordelen of het om normaal ventilatiegedrag, een afstelprobleem of echte kierdichting gaat.</p>

            <h2 id="kort-antwoord">Kort antwoord</h2>
            <p>Tocht ontstaat meestal door kieren, versleten rubbers, onvolledige binnenafwerking of zwakke aansluitingen tussen dakkapel en bestaand dak of wand. De oplossing hangt dus af van de precieze bron van de luchtstroom.</p>
            <p>Wie tocht oplost zonder eerst te lokaliseren waar het vandaan komt, behandelt vaak alleen het symptoom.</p>

            <h2 id="oorzaken">Wat zijn de meest voorkomende oorzaken?</h2>
            <ul>
              <li><strong>Versleten of slecht sluitende raamrubbers</strong>.</li>
              <li><strong>Onvoldoende kierdichting</strong> rond aansluitingen of afwerking.</li>
              <li><strong>Luchtlekken achter dagkanten of aftimmering</strong>.</li>
              <li><strong>Verwarring tussen ventilatie en ongewenste luchtstromen</strong>.</li>
            </ul>

            <h2 id="lokaliseren">Hoe lokaliseer je het probleem?</h2>
            <div style="overflow-x:auto;margin-bottom:var(--sp-6);"><table class="price-table"><thead><tr><th>Plek</th><th>Wat je controleert</th><th>Wat het kan betekenen</th></tr></thead><tbody>
              <tr><td>Rond raamprofiel</td><td>Rubbers, sluiting en kier</td><td>Afstelling of slijtage</td></tr>
              <tr><td>Bij aftimmering</td><td>Lucht uit naden of koven</td><td>Afwerkings- of aansluitprobleem</td></tr>
              <tr><td>Bij roosters</td><td>Normale luchtstroom</td><td>Niet elke beweging is een defect</td></tr>
              <tr><td>Bij koude hoeken</td><td>Combinatie met isolatie</td><td>Comfort- en detailprobleem samen</td></tr>
            </tbody></table></div>
            <p>Tocht heeft vaak een duidelijker bronpatroon dan mensen denken. Door systematisch te voelen en te observeren voorkom je dat je het hele systeem verdenkt terwijl het probleem lokaal zit.</p>

            <h2 id="oplossen">Welke oplossingen zijn logisch?</h2>
            <ul>
              <li><strong>Ramen en rubbers afstellen of vervangen</strong> als de klacht direct rond een raam zit.</li>
              <li><strong>Kierdichting of afwerking verbeteren</strong> als lucht vanuit aansluitingen of koven komt.</li>
              <li><strong>Isolatie en detailopbouw beoordelen</strong> als tocht samenhangt met koude zones.</li>
              <li><strong>Ventilatiewerking begrijpen</strong> voordat je iets afsluit wat bewust lucht doorlaat.</li>
            </ul>
            <p>Daarom is tocht oplossen geen universele kitklus. Soms is het een klein afstelwerk, soms een signaal van een groter detailprobleem.</p>

            <h2 id="voorbeelden">Praktische scenario's</h2>
            <h3>Scenario 1: tocht rond het draaiende raam</h3><p>Dan zijn rubbers en sluiting de logische eerste verdachten.</p>
            <h3>Scenario 2: tocht uit de binnenaftimmering</h3><p>Dan moet je eerder denken aan een kier of onvolledige detailafwerking achter de zichtlaag.</p>
            <h3>Scenario 3: tocht en condens tegelijk</h3><p>Dan hangen isolatie, ventilatie en detailafwerking waarschijnlijk samen.</p>

            <h2 id="checklist">Checklist bij tochtklachten</h2>
            <ol>
              <li>Voel je de luchtstroom bij raam, rooster of aftimmering?</li>
              <li>Zijn rubbers en sluiting van het raam nog in goede staat?</li>
              <li>Is het normale ventilatie of echt ongewenst luchtverlies?</li>
              <li>Komt de klacht samen met koude oppervlakken of condens?</li>
              <li>Blijft het probleem terugkomen? Laat dan de opbouw beoordelen.</li>
            </ol>

            <h2 id="tips">Tips voor huiseigenaren</h2>
            <ol>
              <li>Werk systematisch: bepaal eerst de bron van de tocht.</li>
              <li>Sluit niet blind alles af zonder te weten of ventilatie bewust aanwezig is.</li>
              <li>Koppel tochtklachten aan onderhoud van rubbers en afwerking.</li>
              <li>Zie comfortverlies als serieus signaal, ook zonder zichtbare lekkage.</li>
            </ol>

            <h2 id="bronnen">Bronnen en referenties</h2>
            <p>Voor dit artikel is gebruikgemaakt van openbare informatie van onder meer:</p>
            <ul>
              <li><a href="https://www.verenigingEigenhuis.nl" rel="nofollow noopener" target="_blank">Vereniging Eigen Huis</a></li>
              <li><a href="https://slimster.nl/dakkapellen/" rel="nofollow noopener" target="_blank">Slimster: dakkapellen overzicht</a></li>
              <li><a href="https://www.homedeal.nl/dakkapel/" rel="nofollow noopener" target="_blank">Homedeal: dakkapel informatie</a></li>
            </ul>

            <h2 id="faq">Veelgestelde vragen</h2>
            <h3>Komt tocht vaak door slechte montage?</h3><p>Dat kan, maar ook rubbers, afstelling en binnenafwerking spelen vaak mee.</p>
            <h3>Is elke luchtstroom een probleem?</h3><p>Nee. Ventilatieroosters geven bewust lucht door; ongewenste tocht zit vaak op andere plekken.</p>
            <h3>Waar begin je met controleren?</h3><p>Bij raamrubbers, sluiting, naden en de binnenafwerking rond de dakkapel.</p>
            <h3>Kan tocht ook met isolatie te maken hebben?</h3><p>Ja, vooral als luchtlekken samengaan met koude oppervlakken en comfortverlies.</p>
            <h3>Wanneer schakel je een specialist in?</h3><p>Als de bron onduidelijk blijft of de klacht terugkomt ondanks eerste maatregelen.</p>`,
    faqs: [
      { q: "Komt tocht vaak door slechte montage?", a: "Dat kan, maar ook rubbers, afstelling en binnenafwerking spelen vaak mee." },
      { q: "Is elke luchtstroom een probleem?", a: "Nee. Ventilatieroosters geven bewust lucht door; ongewenste tocht zit vaak op andere plekken." },
      { q: "Waar begin je met controleren?", a: "Bij raamrubbers, sluiting, naden en de binnenafwerking rond de dakkapel." },
      { q: "Kan tocht ook met isolatie te maken hebben?", a: "Ja, vooral als luchtlekken samengaan met koude oppervlakken en comfortverlies." },
      { q: "Wanneer schakel je een specialist in?", a: "Als de bron onduidelijk blijft of de klacht terugkomt ondanks eerste maatregelen." }
    ]
  }
];

function replaceRequired(content, pattern, replacement, label) {
  if (!pattern.test(content)) throw new Error(`Pattern not found for ${label}`);
  return content.replace(pattern, replacement);
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

for (const page of pages) {
  const filePath = path.join(root, page.file);
  let html = fs.readFileSync(filePath, "utf8");

  html = replaceRequired(html, /<title>.*?<\/title>/, `<title>${page.title}</title>`, `${page.file} title`);
  html = replaceRequired(html, /<meta name="description"[\s\S]*?content="[^"]*"[\s\S]*?>/, `<meta name="description" content="${page.description}">`, `${page.file} meta`);
  html = replaceRequired(html, /<meta property="og:title"[\s\S]*?content="[^"]*"[\s\S]*?>/, `<meta property="og:title" content="${page.title}">`, `${page.file} og:title`);
  html = replaceRequired(html, /<meta property="og:description"[\s\S]*?content="[^"]*"[\s\S]*?>/, `<meta property="og:description" content="${page.description}">`, `${page.file} og:description`);
  html = replaceRequired(html, /<meta name="twitter:title"[\s\S]*?content="[^"]*"[\s\S]*?>/, `<meta name="twitter:title" content="${page.title}">`, `${page.file} twitter:title`);
  html = replaceRequired(html, /<meta name="twitter:description"[\s\S]*?content="[^"]*"[\s\S]*?>/, `<meta name="twitter:description" content="${page.description}">`, `${page.file} twitter:description`);
  html = replaceRequired(html, /<h1>[^<]*<\/h1>/, `<h1>${page.h1}</h1>`, `${page.file} h1`);
  html = replaceRequired(html, /(<article class="article-body" style="max-width:none;padding-top:var\(--sp-10\);">)[\s\S]*?(<\/article>)/, `$1\n${page.articleHtml}\n          $2`, `${page.file} article`);
  html = replaceRequired(html, /<span>⏱️ [^<]*<\/span>/, `<span>⏱️ ${page.readTime}</span>`, `${page.file} readtime`);

  const ldJsonMatch = html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/);
  if (!ldJsonMatch) throw new Error(`JSON-LD not found for ${page.file}`);
  const data = JSON.parse(ldJsonMatch[1]);
  const blog = data.find((x) => x["@type"] === "BlogPosting");
  const faq = data.find((x) => x["@type"] === "FAQPage");
  if (!blog || !faq) throw new Error(`BlogPosting/FAQPage missing for ${page.file}`);
  blog.headline = page.h1;
  blog.description = page.description;
  blog.wordCount = stripHtml(page.articleHtml).split(/\s+/).filter(Boolean).length;
  faq.mainEntity = page.faqs.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a }
  }));

  html = html.replace(ldJsonMatch[0], `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n    </script>`);

  fs.writeFileSync(filePath, html);
  console.log(`Updated ${page.file}`);
}
