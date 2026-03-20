const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

const pages = [
  {
    file: "kenniscentrum/levensduur-dakkapel-per-materiaal/index.html",
    title: "Levensduur dakkapel per materiaal: hout, kunststof en polyester vergeleken",
    description:
      "Lees hoe de levensduur van een dakkapel verschilt per materiaal en welke rol onderhoud, afwerking en plaatsing spelen in de totale gebruiksduur.",
    h1: "Levensduur dakkapel per materiaal",
    readTime: "8 min leestijd",
    articleHtml: `
            <div class="article-toc">
              <h2>Inhoudsopgave</h2>
              <ol>
                <li><a href="#kort-antwoord">Kort antwoord</a></li>
                <li><a href="#vergelijking">Hoe verschilt de levensduur per materiaal?</a></li>
                <li><a href="#onderhoud">Wat bepaalt de werkelijke levensduur?</a></li>
                <li><a href="#vervangen">Wanneer denk je aan vervangen in plaats van onderhouden?</a></li>
                <li><a href="#voorbeelden">Praktische scenario's</a></li>
                <li><a href="#checklist">Checklist voor beoordeling</a></li>
                <li><a href="#tips">Tips voor huiseigenaren</a></li>
                <li><a href="#bronnen">Bronnen en referenties</a></li>
                <li><a href="#faq">Veelgestelde vragen</a></li>
              </ol>
            </div>
            <div class="editorial-note">
              <strong>Redactionele noot:</strong> Dit artikel is bijgewerkt op 11 maart 2026 door <strong>J. Arrascaeta</strong>, hoofdredacteur van DakkapellenKosten.nl. De materiaalvergelijking is gebaseerd op openbare productinformatie, onderhoudsuitleg en gangbare marktinschattingen over gebruiksduur van dakkapellen. Lees meer over onze <a href="../../redactie/#j-arrascaeta">redactie</a> en <a href="../../werkwijze/">werkwijze</a>.
            </div>
            <p>De levensduur van een dakkapel wordt vaak te simpel voorgesteld alsof alleen het materiaal bepaalt hoe lang hij meegaat. In werkelijkheid is materiaal maar een van de factoren. Ook kwaliteit van plaatsing, detailafwerking, blootstelling aan weer, onderhoud en tijdig herstel maken groot verschil. Daarom is de juiste vraag niet alleen "hoe lang gaat hout of kunststof mee?", maar ook "onder welke omstandigheden?".</p>
            <p>Dat gezegd hebbende, geeft materiaal wel degelijk richting. Hout, kunststof en polyester hebben elk een ander onderhoudsprofiel en een andere gevoeligheid voor slijtage. Deze pagina helpt je de verschillen praktisch te lezen. Gebruik haar samen met <a href="../onderhoud-dakkapel/">onderhoud en levensduur van dakkapellen</a> en de afzonderlijke materiaalgidsen.</p>

            <h2 id="kort-antwoord">Kort antwoord</h2>
            <p>Een dakkapel gaat vaak tientallen jaren mee als materiaal, onderhoud en plaatsing goed op elkaar aansluiten. Kunststof en polyester staan bekend als onderhoudsarm, terwijl hout vooral sterk is in uitstraling en herstelbaarheid, maar meer onderhoud vraagt om die levensduur ook echt te halen.</p>
            <p>De praktijk is daarom eenvoudig: slecht onderhouden hout kan sneller achteruitgaan, maar goed onderhouden hout kan lang meegaan. Onderhoudsarme materialen winnen juist doordat minder onderhoud nodig is om op niveau te blijven.</p>

            <h2 id="vergelijking">Hoe verschilt de levensduur per materiaal?</h2>
            <div style="overflow-x:auto;margin-bottom:var(--sp-6);">
              <table class="price-table">
                <thead>
                  <tr><th>Materiaal</th><th>Typisch profiel</th><th>Sterk punt</th><th>Aandachtspunt</th></tr>
                </thead>
                <tbody>
                  <tr><td>Hout</td><td>Lang mee te laten gaan bij goed onderhoud</td><td>Herstelbaar en sterk in uitstraling</td><td>Onderhoud bepaalt de uitkomst sterk</td></tr>
                  <tr><td>Kunststof</td><td>Onderhoudsarm en stabiel in gebruik</td><td>Weinig schilderwerk nodig</td><td>Aansluitingen en detailonderhoud blijven belangrijk</td></tr>
                  <tr><td>Polyester</td><td>Onderhoudsarm prefabprofiel</td><td>Strakke schaal en weinig naden</td><td>Minder maatwerkvrijheid en detailherstel</td></tr>
                </tbody>
              </table>
            </div>
            <p>Openbare marktinformatie laat daarbij meestal hetzelfde beeld zien: niet het kale materiaal is de grootste levensduurvraag, maar de combinatie van uitvoering en onderhoud. Een goede dakkapel faalt dus zelden omdat het verkeerde label erop stond, maar vaker omdat onderhoud, aansluitingen of afwerking te weinig aandacht kregen.</p>

            <h2 id="onderhoud">Wat bepaalt de werkelijke levensduur?</h2>
            <ul>
              <li><strong>Plaatsing en aansluitingen</strong> bepalen of water, tocht en detailproblemen vroeg ontstaan.</li>
              <li><strong>Onderhoudsniveau</strong> weegt zwaarder bij hout, maar ook kunststof en polyester vragen inspectie van naden en afwatering.</li>
              <li><strong>Ligging en weersbelasting</strong> maken uit: wind, zon en regenbelasting verschillen per dakvlak.</li>
              <li><strong>Kwaliteit van afwerking</strong> bepaalt of een dakkapel rustig oud wordt of snel kleine herstelpunten laat zien.</li>
              <li><strong>Gebruik en ventilatie</strong> beïnvloeden vooral binnenzijde, condens en detailslijtage.</li>
            </ul>
            <p>Wie dus een materiaal alleen op levensduur kiest zonder onderhoudsprofiel mee te nemen, kiest onvolledig. Levensduur is altijd een combinatie van product en gedrag.</p>

            <h2 id="vervangen">Wanneer denk je aan vervangen in plaats van onderhouden?</h2>
            <p>Een dakkapel hoeft niet vervangen te worden bij elk gebrek. Vervanging wordt pas logisch als meerdere zwakke punten samenkomen: verouderde constructie, terugkerende lekkage, veel detailschade, achterstallig onderhoud en een uitvoeringsniveau dat niet meer aansluit op je huidige wensen.</p>
            <ul>
              <li><strong>Onderhoud is logisch</strong> als schade lokaal en goed herstelbaar is.</li>
              <li><strong>Gedeeltelijk herstel is logisch</strong> als vooral naden, afwerking of losse onderdelen aandacht vragen.</li>
              <li><strong>Vervanging wordt logischer</strong> als verschillende problemen tegelijk terugkomen en de dakkapel technisch of esthetisch achterhaald is.</li>
            </ul>
            <p>Daarom loont het om levensduur altijd samen te lezen met de vraag wanneer een dakkapel vervangen moet worden, niet los daarvan.</p>

            <h2 id="voorbeelden">Praktische scenario's</h2>
            <h3>Scenario 1: houten dakkapel met regelmatig onderhoud</h3>
            <p>Die kan nog lang mee, juist omdat hout herstelbaar is en kleine signalen op tijd worden aangepakt.</p>
            <h3>Scenario 2: kunststof dakkapel zonder controles</h3>
            <p>Onderhoudsarm betekent niet dat problemen niet kunnen ontstaan. Vergeten naden en afwatering kunnen ook hier levensduur kosten.</p>
            <h3>Scenario 3: oudere dakkapel met terugkerende lekkage</h3>
            <p>Dan moet je verder kijken dan alleen materiaal. De combinatie van ouderdom, detailschade en herstelhistorie bepaalt de beslissing.</p>
            <h3>Scenario 4: nieuwe dakkapel, goede uitvoering</h3>
            <p>Hier zit de winst vooral in een consistent onderhoudsritme waarmee kleine problemen klein blijven.</p>

            <h2 id="checklist">Checklist voor beoordeling</h2>
            <ol>
              <li>Past het onderhoudsprofiel van het materiaal bij hoe jij de woning gebruikt?</li>
              <li>Zijn naden, afwatering en detailafwerking nog in goede staat?</li>
              <li>Gaat het om lokaal herstel of om meerdere terugkerende problemen tegelijk?</li>
              <li>Heb je het verschil tussen materiaallevensduur en detaillevensduur scherp?</li>
              <li>Beoordeel je de dakkapel op techniek en niet alleen op uiterlijk?</li>
            </ol>

            <h2 id="tips">Tips voor huiseigenaren</h2>
            <ol>
              <li>Kies materiaal niet alleen op aanschafprijs, maar ook op het onderhoud dat je later echt wilt doen.</li>
              <li>Gebruik jaarlijkse controles om levensduur te verlengen, ongeacht materiaal.</li>
              <li>Zie terugkerende kleine klachten als levensduursignaal, niet als losse incidenten.</li>
              <li>Vraag bij twijfel een beoordeling op basis van herstelbaarheid in plaats van direct vervanging.</li>
            </ol>

            <h2 id="bronnen">Bronnen en referenties</h2>
            <p>Voor dit artikel is gebruikgemaakt van openbare marktinformatie van onder meer:</p>
            <ul>
              <li><a href="https://www.homedeal.nl/dakkapel/" rel="nofollow noopener" target="_blank">Homedeal: dakkapel informatie</a></li>
              <li><a href="https://slimster.nl/dakkapellen/" rel="nofollow noopener" target="_blank">Slimster: dakkapellen overzicht</a></li>
              <li><a href="https://www.werkspot.nl/uitbouw-renovatie/prijzen-kosten/dakkapel-plaatsen-vervangen" rel="nofollow noopener" target="_blank">Werkspot: dakkapel plaatsen of vervangen</a></li>
            </ul>

            <h2 id="faq">Veelgestelde vragen</h2>
            <h3>Gaat kunststof langer mee dan hout?</h3>
            <p>Niet automatisch. Kunststof vraagt minder onderhoud, maar goed onderhouden hout kan ook lang meegaan. Het verschil zit vooral in het onderhoudsprofiel.</p>
            <h3>Is polyester het duurzaamste materiaal?</h3>
            <p>Polyester is onderhoudsarm, maar de totale levensduur hangt nog steeds af van plaatsing, details en gebruik.</p>
            <h3>Wanneer wordt levensduur vooral een onderhoudskwestie?</h3>
            <p>Bij hout is dat het duidelijkst zichtbaar, maar ook kunststof en polyester verliezen kwaliteit als naden en afwatering worden genegeerd.</p>
            <h3>Moet je een oudere dakkapel meteen vervangen?</h3>
            <p>Nee. Eerst moet je beoordelen of problemen lokaal herstelbaar zijn of dat meerdere zwakke punten samenkomen.</p>
            <h3>Wat is de beste manier om levensduur te verlengen?</h3>
            <p>Regelmatig inspecteren, vroeg herstellen en materiaal kiezen dat past bij jouw onderhoudsbereidheid.</p>`,
    faqs: [
      {
        q: "Gaat kunststof langer mee dan hout?",
        a: "Niet automatisch. Kunststof vraagt minder onderhoud, maar goed onderhouden hout kan ook lang meegaan. Het verschil zit vooral in het onderhoudsprofiel."
      },
      {
        q: "Is polyester het duurzaamste materiaal?",
        a: "Polyester is onderhoudsarm, maar de totale levensduur hangt nog steeds af van plaatsing, details en gebruik."
      },
      {
        q: "Wanneer wordt levensduur vooral een onderhoudskwestie?",
        a: "Bij hout is dat het duidelijkst zichtbaar, maar ook kunststof en polyester verliezen kwaliteit als naden en afwatering worden genegeerd."
      },
      {
        q: "Moet je een oudere dakkapel meteen vervangen?",
        a: "Nee. Eerst moet je beoordelen of problemen lokaal herstelbaar zijn of dat meerdere zwakke punten samenkomen."
      },
      {
        q: "Wat is de beste manier om levensduur te verlengen?",
        a: "Regelmatig inspecteren, vroeg herstellen en materiaal kiezen dat past bij jouw onderhoudsbereidheid."
      }
    ]
  },
  {
    file: "kenniscentrum/woningwaarde-dakkapel/index.html",
    title: "Verhoogt een dakkapel de woningwaarde? Dit bepaalt het effect",
    description:
      "Lees wanneer een dakkapel echt kan bijdragen aan de woningwaarde en waarom uitvoering, extra bruikbare ruimte en de lokale markt belangrijker zijn dan de dakkapel alleen.",
    h1: "Verhoogt een dakkapel de woningwaarde?",
    readTime: "8 min leestijd",
    articleHtml: `
            <div class="article-toc">
              <h2>Inhoudsopgave</h2>
              <ol>
                <li><a href="#kort-antwoord">Kort antwoord</a></li>
                <li><a href="#waarde">Waardoor kan een dakkapel waarde toevoegen?</a></li>
                <li><a href="#niet-automatisch">Waarom is waardestijging niet automatisch?</a></li>
                <li><a href="#taxatie">Hoe kijkt een koper of taxateur hiernaar?</a></li>
                <li><a href="#voorbeelden">Praktische scenario's</a></li>
                <li><a href="#checklist">Checklist voor waardegerichte keuzes</a></li>
                <li><a href="#tips">Tips voor huiseigenaren</a></li>
                <li><a href="#bronnen">Bronnen en referenties</a></li>
                <li><a href="#faq">Veelgestelde vragen</a></li>
              </ol>
            </div>
            <div class="editorial-note">
              <strong>Redactionele noot:</strong> Dit artikel is bijgewerkt op 11 maart 2026 door <strong>J. Arrascaeta</strong>, hoofdredacteur van DakkapellenKosten.nl. De inhoud is gebaseerd op openbare marktinformatie over verbouwen, woonruimte, koperswensen en algemene waardering van extra bruikbare meters. Lees meer over onze <a href="../../redactie/#j-arrascaeta">redactie</a> en <a href="../../werkwijze/">werkwijze</a>.
            </div>
            <p>Ja, een dakkapel kan de woningwaarde verhogen, maar niet omdat er simpelweg een dakkapel op het dak staat. De echte waardewinst komt uit extra bruikbare ruimte, betere lichtinval, een logischer zolderindeling en een nette, professionele uitvoering die past bij de woning. Een rommelig uitgevoerde dakkapel of een oplossing die weinig functionele winst oplevert, voegt veel minder toe dan mensen vaak denken.</p>
            <p>De juiste vraag is dus niet "levert een dakkapel altijd meer op dan hij kost?", maar "vertaalt deze ingreep zich in betere verkoopbaarheid en meer bruikbare woonkwaliteit?". Dat hangt af van woningtype, buurt, afwerking en hoe sterk de extra ruimte in de praktijk benut kan worden.</p>

            <h2 id="kort-antwoord">Kort antwoord</h2>
            <p>Een dakkapel kan positief bijdragen aan woningwaarde wanneer de extra ruimte ook echt bruikbaar wordt, de uitvoering netjes is en de ingreep logisch past bij het huis. Vooral een zolder die verandert van beperkte berg- of loopruimte naar volwaardige slaap-, werk- of gezinsruimte kan aantrekkelijker worden voor kopers.</p>
            <p>De waardestijging is echter niet automatisch gelijk aan de investering. De opbrengst hangt af van markt, woningtype, afwerking, vergunning, locatie en de mate waarin de dakkapel het dagelijks gebruik echt verbetert.</p>

            <h2 id="waarde">Waardoor kan een dakkapel waarde toevoegen?</h2>
            <ul>
              <li><strong>Meer bruikbare woonruimte</strong> is de kern. Niet alleen extra vierkante meters, maar vooral extra stahoogte en gebruiksmogelijkheid tellen.</li>
              <li><strong>Betere indeling</strong> maakt zolders aantrekkelijker als slaapkamer, werkruimte of gezinsruimte.</li>
              <li><strong>Meer daglicht</strong> en een opener gevoel verhogen de beleving van de ruimte.</li>
              <li><strong>Nette uitvoering</strong> geeft kopers vertrouwen dat de woning professioneel is verbeterd.</li>
            </ul>
            <p>Een dakkapel werkt dus vooral waardeverhogend als hij functioneel overtuigt. Een brede of luxe uitvoering zonder duidelijke ruimtelijke winst is minder sterk dan een goed geplaatste dakkapel die de hele zolder bruikbaarder maakt.</p>

            <h2 id="niet-automatisch">Waarom is waardestijging niet automatisch?</h2>
            <ul>
              <li><strong>Niet elke dakkapel voegt evenveel bruikbaarheid toe.</strong> Soms blijft de winst vooral visueel of beperkt tot meer licht.</li>
              <li><strong>De kwaliteit van afwerking</strong> bepaalt of kopers de ingreep zien als meerwaarde of als toekomstig werk.</li>
              <li><strong>De lokale markt</strong> speelt mee: in sommige markten telt extra zolderkwaliteit sterker mee dan in andere.</li>
              <li><strong>De investering zelf</strong> kan hoger zijn dan de directe waardesprong, zeker bij luxe maatwerk.</li>
            </ul>
            <p>Daarom is het verstandig om woningwaarde niet als exacte rekensom te benaderen, maar als combinatie van marktwaarde, gebruikswaarde en verkoopbaarheid.</p>

            <h2 id="taxatie">Hoe kijkt een koper of taxateur hiernaar?</h2>
            <p>Kopers zien vooral het effect: voelt de zolder als echte woonruimte of niet? Taxateurs kijken bovendien naar de totale woning, de kwaliteit van de aanpassing en hoe logisch de dakkapel in het object past.</p>
            <div style="overflow-x:auto;margin-bottom:var(--sp-6);">
              <table class="price-table">
                <thead>
                  <tr><th>Aspect</th><th>Positief effect</th><th>Rem op waarde</th></tr>
                </thead>
                <tbody>
                  <tr><td>Ruimtewinst</td><td>Volwaardige kamer of betere indeling</td><td>Beperkte functiewinst</td></tr>
                  <tr><td>Uitvoering</td><td>Nette afwerking, passend ontwerp</td><td>Rommelige of gedateerde uitvoering</td></tr>
                  <tr><td>Regelgeving</td><td>Correct en passend uitgevoerd</td><td>Twijfel over vergunning of kwaliteit</td></tr>
                  <tr><td>Marktperceptie</td><td>Meer licht, ruimte en gebruiksgemak</td><td>Te specifiek of te duur uitgevoerd</td></tr>
                </tbody>
              </table>
            </div>

            <h2 id="voorbeelden">Praktische scenario's</h2>
            <h3>Scenario 1: zolder wordt volwaardige slaapkamer</h3>
            <p>Dat is meestal de sterkste waardecase, omdat de woning functioneel beter wordt voor gezinnen of thuiswerkers.</p>
            <h3>Scenario 2: alleen wat extra licht en loopruimte</h3>
            <p>Ook dat kan positief zijn, maar het effect op waarde is meestal subtieler dan bij een echte functiewijziging.</p>
            <h3>Scenario 3: luxe maatwerk op een al ruime woning</h3>
            <p>Dan neemt gebruikskwaliteit toe, maar de investering kan groter zijn dan de directe meerwaarde in de markt.</p>
            <h3>Scenario 4: slordige of half afgewerkte dakkapel</h3>
            <p>Dan werkt de ingreep eerder als risico-indicator dan als overtuigende meerwaarde.</p>

            <h2 id="checklist">Checklist voor waardegerichte keuzes</h2>
            <ol>
              <li>Maakt de dakkapel de zolder aantoonbaar bruikbaarder?</li>
              <li>Past de maat en uitstraling bij de woning en het dakvlak?</li>
              <li>Is de uitvoering netjes en verkoopklaar afgewerkt?</li>
              <li>Voeg je functionele kwaliteit toe of vooral alleen luxe?</li>
              <li>Heb je naast marktwaarde ook eigen woonwaarde meegewogen?</li>
            </ol>

            <h2 id="tips">Tips voor huiseigenaren</h2>
            <ol>
              <li>Denk bij waarde vooral in ruimtefunctie, niet alleen in oppervlak.</li>
              <li>Kies een uitvoering die past bij de woning en niet alleen bij trend of brochurebeeld.</li>
              <li>Werk de binnenzijde goed af als je de dakkapel ooit bij verkoop wilt laten meetellen als duidelijke meerwaarde.</li>
              <li>Zie een dakkapel als combinatie van wooncomfort en mogelijke waardesteun, niet als gegarandeerde winstmachine.</li>
            </ol>

            <h2 id="bronnen">Bronnen en referenties</h2>
            <p>Voor dit artikel is gebruikgemaakt van openbare marktinformatie van onder meer:</p>
            <ul>
              <li><a href="https://www.verenigingEigenhuis.nl" rel="nofollow noopener" target="_blank">Vereniging Eigen Huis</a></li>
              <li><a href="https://www.nvm.nl" rel="nofollow noopener" target="_blank">NVM</a></li>
              <li><a href="https://www.homedeal.nl/dakkapel/" rel="nofollow noopener" target="_blank">Homedeal: dakkapel informatie</a></li>
              <li><a href="https://slimster.nl/dakkapellen/" rel="nofollow noopener" target="_blank">Slimster: dakkapellen overzicht</a></li>
            </ul>

            <h2 id="faq">Veelgestelde vragen</h2>
            <h3>Verhoogt een dakkapel altijd de woningwaarde?</h3>
            <p>Nee. Het effect hangt af van bruikbare ruimtewinst, afwerking, woningtype en de lokale markt.</p>
            <h3>Wat telt het meest mee voor waarde?</h3>
            <p>Dat de zolder echt beter bruikbaar wordt en dat de uitvoering netjes en passend is.</p>
            <h3>Is luxe afwerking altijd beter voor waarde?</h3>
            <p>Niet per se. Functionaliteit en passende uitvoering wegen vaak zwaarder dan overmatige luxe.</p>
            <h3>Moet je de dakkapel direct terugverdienen om het een goede zet te laten zijn?</h3>
            <p>Nee. Wooncomfort en verkoopbaarheid maken ook deel uit van de totale waarde.</p>
            <h3>Wat schrikt kopers juist af?</h3>
            <p>Onduidelijkheid over kwaliteit, half afgewerkte details en een dakkapel die niet logisch in de woning past.</p>`,
    faqs: [
      {
        q: "Verhoogt een dakkapel altijd de woningwaarde?",
        a: "Nee. Het effect hangt af van bruikbare ruimtewinst, afwerking, woningtype en de lokale markt."
      },
      {
        q: "Wat telt het meest mee voor waarde?",
        a: "Dat de zolder echt beter bruikbaar wordt en dat de uitvoering netjes en passend is."
      },
      {
        q: "Is luxe afwerking altijd beter voor waarde?",
        a: "Niet per se. Functionaliteit en passende uitvoering wegen vaak zwaarder dan overmatige luxe."
      },
      {
        q: "Moet je de dakkapel direct terugverdienen om het een goede zet te laten zijn?",
        a: "Nee. Wooncomfort en verkoopbaarheid maken ook deel uit van de totale waarde."
      },
      {
        q: "Wat schrikt kopers juist af?",
        a: "Onduidelijkheid over kwaliteit, half afgewerkte details en een dakkapel die niet logisch in de woning past."
      }
    ]
  },
  {
    file: "kenniscentrum/wanneer-is-een-dakkapel-een-goede-investering/index.html",
    title: "Wanneer is een dakkapel een goede investering?",
    description:
      "Lees wanneer een dakkapel financieel en praktisch een slimme investering is en wanneer wooncomfort, gebruiksduur en marktkans zwaarder wegen dan directe terugverdientijd.",
    h1: "Wanneer is een dakkapel een goede investering?",
    readTime: "8 min leestijd",
    articleHtml: `
            <div class="article-toc">
              <h2>Inhoudsopgave</h2>
              <ol>
                <li><a href="#kort-antwoord">Kort antwoord</a></li>
                <li><a href="#slim">Wanneer is de investering meestal slim?</a></li>
                <li><a href="#minder-slim">Wanneer is een dakkapel juist minder logisch?</a></li>
                <li><a href="#afweging">Hoe maak je de afweging goed?</a></li>
                <li><a href="#voorbeelden">Praktische scenario's</a></li>
                <li><a href="#checklist">Checklist voor je beslissing</a></li>
                <li><a href="#tips">Tips voor huiseigenaren</a></li>
                <li><a href="#bronnen">Bronnen en referenties</a></li>
                <li><a href="#faq">Veelgestelde vragen</a></li>
              </ol>
            </div>
            <div class="editorial-note">
              <strong>Redactionele noot:</strong> Dit artikel is bijgewerkt op 11 maart 2026 door <strong>J. Arrascaeta</strong>, hoofdredacteur van DakkapellenKosten.nl. De afweging is gebaseerd op openbare prijsinformatie, koperswensen, wooncomfortfactoren en marktinformatie rond verbouwen en waardebeleving. Lees meer over onze <a href="../../redactie/#j-arrascaeta">redactie</a> en <a href="../../werkwijze/">werkwijze</a>.
            </div>
            <p>Een dakkapel is een goede investering als de extra kosten zich vertalen in duidelijke gebruikswaarde, betere indeling en een sterker woningprofiel. Dat hoeft niet te betekenen dat je de volledige investering direct terugziet in een taxatie. Ook een grote toename in wooncomfort, bruikbaarheid van de zolder en verkoopbaarheid maakt de investering logisch. De fout die veel mensen maken is dat ze investering alleen als directe terugverdientijd bekijken.</p>
            <p>De beste manier om deze vraag te beantwoorden is daarom dubbel: kijk naar marktwaarde én naar hoe lang je zelf nog van de extra ruimte profiteert. Een dakkapel waar je nog jaren dagelijks voordeel van hebt, mag anders worden beoordeeld dan een snelle ingreep vlak voor verkoop.</p>

            <h2 id="kort-antwoord">Kort antwoord</h2>
            <p>Een dakkapel is meestal een goede investering als hij van een matige zolder een goed bruikbare woonruimte maakt, past bij de woning en professioneel wordt uitgevoerd. Hoe sterker de functiewinst, hoe logischer de investering.</p>
            <p>De investering is minder sterk als de ruimtewinst beperkt blijft, de uitvoering vooral luxe toevoegt zonder praktisch effect of de kosten hoog oplopen terwijl je de woning maar kort gebruikt.</p>

            <h2 id="slim">Wanneer is de investering meestal slim?</h2>
            <ul>
              <li><strong>Als de zolder echt een volwaardige functie krijgt</strong>, zoals slaapkamer, werkruimte of gezinsruimte.</li>
              <li><strong>Als je nog meerdere jaren in de woning blijft</strong> en dus zelf ook van de ruimtewinst profiteert.</li>
              <li><strong>Als de verhouding tussen maat, uitvoering en woningtype klopt</strong> en de dakkapel logisch in het huis past.</li>
              <li><strong>Als de afwerking netjes is</strong> en de ingreep geen toekomstige herstelvraag oproept.</li>
            </ul>
            <p>In zulke situaties werkt een dakkapel niet alleen als verbouwing, maar als kwaliteitsverbetering van de woning. Dat maakt de investering sterker dan wanneer hij alleen wordt gekozen omdat "kopers dat mooi vinden".</p>

            <h2 id="minder-slim">Wanneer is een dakkapel juist minder logisch?</h2>
            <ul>
              <li><strong>Als de ruimtelijke winst klein blijft</strong> en de zolder nauwelijks beter bruikbaar wordt.</li>
              <li><strong>Als de uitvoering duur maatwerk vereist</strong> zonder dat de woning of functie daar duidelijk om vraagt.</li>
              <li><strong>Als je vooral investeert voor snelle terugverdientijd</strong> terwijl de markt die luxe niet vanzelf beloont.</li>
              <li><strong>Als vergunning, bereikbaarheid of constructie</strong> de totale kosten en doorlooptijd zwaar omhoog duwen.</li>
            </ul>
            <p>Een dakkapel kan dan nog steeds wenselijk zijn voor comfort, maar de investering is minder rationeel als je haar puur als financiële zet bekijkt.</p>

            <h2 id="afweging">Hoe maak je de afweging goed?</h2>
            <div style="overflow-x:auto;margin-bottom:var(--sp-6);">
              <table class="price-table">
                <thead>
                  <tr><th>Vraag</th><th>Als het antwoord ja is</th><th>Als het antwoord nee is</th></tr>
                </thead>
                <tbody>
                  <tr><td>Wordt de zolder echt beter bruikbaar?</td><td>De investering wordt sterker</td><td>De waarde rust vooral op comfort, niet op functie</td></tr>
                  <tr><td>Blijf je nog jaren wonen?</td><td>Je profiteert ook zelf van de uitgave</td><td>De beoordeling wordt verkoopgerichter</td></tr>
                  <tr><td>Past de dakkapel bij woning en budget?</td><td>Grotere kans op logische meerwaarde</td><td>Risico op overinvestering</td></tr>
                  <tr><td>Zijn uitvoering en afwerking duidelijk?</td><td>Minder risico op extra kosten</td><td>Grotere kans op teleurstelling achteraf</td></tr>
                </tbody>
              </table>
            </div>
            <p>Deze afweging maakt duidelijk waarom twee identieke dakkapellen voor twee huishoudens toch een andere investering kunnen zijn. Het gebruiksdoel bepaalt veel meer dan mensen vaak denken.</p>

            <h2 id="voorbeelden">Praktische scenario's</h2>
            <h3>Scenario 1: jong gezin, extra slaapkamer nodig</h3>
            <p>Hier is de investering vaak sterk, omdat de extra ruimte direct en jarenlang wordt gebruikt.</p>
            <h3>Scenario 2: woning gaat binnen korte tijd in verkoop</h3>
            <p>Dan moet je kritischer zijn. De ingreep kan helpen, maar directe terugverdientijd is minder vanzelfsprekend.</p>
            <h3>Scenario 3: luxe maatwerk voor beperkte functiewinst</h3>
            <p>Dat kan wooncomfort geven, maar is als investering minder overtuigend.</p>
            <h3>Scenario 4: standaard dakkapel op een onbruikbare zolder</h3>
            <p>Daar kan juist een relatief eenvoudige ingreep heel veel waarde creëren in gebruik en beleving.</p>

            <h2 id="checklist">Checklist voor je beslissing</h2>
            <ol>
              <li>Welke concrete functie krijgt de zolder na plaatsing?</li>
              <li>Blijf je lang genoeg wonen om van de ingreep te profiteren?</li>
              <li>Past de gekozen maat en uitvoering bij de woning?</li>
              <li>Heb je comfort, waarde en kosten alle drie meegewogen?</li>
              <li>Is de offerte duidelijk genoeg om verrassingen te voorkomen?</li>
            </ol>

            <h2 id="tips">Tips voor huiseigenaren</h2>
            <ol>
              <li>Beoordeel een investering niet alleen op terugverdientijd, maar ook op dagelijks gebruik.</li>
              <li>Kies liever voor een logisch uitgevoerde dakkapel dan voor maximale luxe zonder duidelijke functiewinst.</li>
              <li>Vergelijk scenario's: wat verandert er echt in de woning na plaatsing?</li>
              <li>Maak een beslissing op basis van jouw woonhorizon, niet alleen op basis van algemene vuistregels.</li>
            </ol>

            <h2 id="bronnen">Bronnen en referenties</h2>
            <p>Voor dit artikel is gebruikgemaakt van openbare marktinformatie van onder meer:</p>
            <ul>
              <li><a href="https://www.verenigingEigenhuis.nl" rel="nofollow noopener" target="_blank">Vereniging Eigen Huis</a></li>
              <li><a href="https://www.nvm.nl" rel="nofollow noopener" target="_blank">NVM</a></li>
              <li><a href="https://www.homedeal.nl/dakkapel/" rel="nofollow noopener" target="_blank">Homedeal: dakkapel informatie</a></li>
              <li><a href="https://slimster.nl/dakkapellen/" rel="nofollow noopener" target="_blank">Slimster: dakkapellen overzicht</a></li>
            </ul>

            <h2 id="faq">Veelgestelde vragen</h2>
            <h3>Is een dakkapel financieel altijd een goede investering?</h3>
            <p>Nee. Dat hangt af van functiewinst, kosten, woonduur en hoe goed de ingreep bij de woning past.</p>
            <h3>Wanneer is de investering het sterkst?</h3>
            <p>Als de zolder echt een bruikbare woonfunctie krijgt en je daar ook zelf nog jaren van profiteert.</p>
            <h3>Is wooncomfort ook onderdeel van de investering?</h3>
            <p>Ja. Een investering in wonen draait niet alleen om verkoopwaarde, maar ook om dagelijks gebruik en kwaliteit.</p>
            <h3>Wanneer is een dakkapel eerder overinvestering?</h3>
            <p>Als de kosten hoog oplopen terwijl de functionele winst beperkt blijft of de woning het niveau niet vraagt.</p>
            <h3>Hoe voorkom je een zwakke investering?</h3>
            <p>Door maat, budget, uitvoering en functie vanaf het begin op elkaar af te stemmen.</p>`,
    faqs: [
      {
        q: "Is een dakkapel financieel altijd een goede investering?",
        a: "Nee. Dat hangt af van functiewinst, kosten, woonduur en hoe goed de ingreep bij de woning past."
      },
      {
        q: "Wanneer is de investering het sterkst?",
        a: "Als de zolder echt een bruikbare woonfunctie krijgt en je daar ook zelf nog jaren van profiteert."
      },
      {
        q: "Is wooncomfort ook onderdeel van de investering?",
        a: "Ja. Een investering in wonen draait niet alleen om verkoopwaarde, maar ook om dagelijks gebruik en kwaliteit."
      },
      {
        q: "Wanneer is een dakkapel eerder overinvestering?",
        a: "Als de kosten hoog oplopen terwijl de functionele winst beperkt blijft of de woning het niveau niet vraagt."
      },
      {
        q: "Hoe voorkom je een zwakke investering?",
        a: "Door maat, budget, uitvoering en functie vanaf het begin op elkaar af te stemmen."
      }
    ]
  },
  {
    file: "kenniscentrum/condens-bij-dakkapel/index.html",
    title: "Condens bij dakkapel: oorzaken, verschil met lekkage en oplossingen",
    description:
      "Lees waardoor condens bij een dakkapel ontstaat, hoe je het onderscheidt van lekkage en welke oplossingen rond ventilatie, isolatie en gebruik helpen.",
    h1: "Condens bij dakkapel",
    readTime: "8 min leestijd",
    articleHtml: `
            <div class="article-toc">
              <h2>Inhoudsopgave</h2>
              <ol>
                <li><a href="#kort-antwoord">Kort antwoord</a></li>
                <li><a href="#oorzaken">Waardoor ontstaat condens?</a></li>
                <li><a href="#verschil">Hoe onderscheid je condens van lekkage?</a></li>
                <li><a href="#oplossingen">Welke oplossingen helpen echt?</a></li>
                <li><a href="#voorbeelden">Praktische scenario's</a></li>
                <li><a href="#checklist">Checklist bij condens</a></li>
                <li><a href="#tips">Tips voor huiseigenaren</a></li>
                <li><a href="#bronnen">Bronnen en referenties</a></li>
                <li><a href="#faq">Veelgestelde vragen</a></li>
              </ol>
            </div>
            <div class="editorial-note">
              <strong>Redactionele noot:</strong> Dit artikel is bijgewerkt op 11 maart 2026 door <strong>J. Arrascaeta</strong>, hoofdredacteur van DakkapellenKosten.nl. De uitleg is gebaseerd op openbare bouwkundige informatie over ventilatie, isolatie, koudebruggen en vochtgedrag in woonruimtes. Lees meer over onze <a href="../../redactie/#j-arrascaeta">redactie</a> en <a href="../../werkwijze/">werkwijze</a>.
            </div>
            <p>Condens bij een dakkapel ontstaat meestal niet doordat er water van buiten naar binnen komt, maar doordat warme vochtige binnenlucht afkoelt op een koud oppervlak. Juist daarom wordt condens vaak verward met lekkage. Dat lijkt logisch, want beide geven natte plekken, aanslag of vocht op ramen en afwerking. Toch vragen ze om een andere aanpak.</p>
            <p>De kernvraag is dus: gaat het om vocht uit de lucht in de ruimte, of om water dat van buiten binnendringt? Als je dat verschil goed ziet, voorkom je dat je het verkeerde probleem probeert op te lossen.</p>

            <h2 id="kort-antwoord">Kort antwoord</h2>
            <p>Condens bij een dakkapel ontstaat meestal door een combinatie van vochtige binnenlucht, te weinig ventilatie, koude oppervlakken en soms gebrekkige isolatie of koudebruggen. Het probleem zie je vaak op ramen, kozijnen, hoeken of rondom details waar warmteverlies sneller optreedt.</p>
            <p>De oplossing zit daarom meestal in ventileren, vochtproductie beter afvoeren en kritisch kijken naar isolatie, roosters en koude zones. Niet in het willekeurig dichten van naden zonder diagnose.</p>

            <h2 id="oorzaken">Waardoor ontstaat condens?</h2>
            <ul>
              <li><strong>Te weinig ventilatie</strong> zorgt dat vochtige lucht in de ruimte blijft hangen.</li>
              <li><strong>Koude oppervlakken</strong> op glas, kozijnen of zwakke details laten vocht uit de lucht neerslaan.</li>
              <li><strong>Hoge vochtproductie</strong> door slapen, douchen, wassen of drogen vergroot het probleem.</li>
              <li><strong>Onvoldoende isolatie of koudebruggen</strong> maken sommige delen duidelijk kouder dan de rest van de ruimte.</li>
            </ul>
            <p>Bij een dakkapel speelt mee dat de ruimte vaak relatief klein is en dat de temperatuur- en vochtbalans sneller uitslaat dan in grotere kamers.</p>

            <h2 id="verschil">Hoe onderscheid je condens van lekkage?</h2>
            <div style="overflow-x:auto;margin-bottom:var(--sp-6);">
              <table class="price-table">
                <thead>
                  <tr><th>Signaal</th><th>Vaker condens</th><th>Vaker lekkage</th></tr>
                </thead>
                <tbody>
                  <tr><td>Vocht op glas of kozijnen in koude periodes</td><td>Ja</td><td>Minder waarschijnlijk</td></tr>
                  <tr><td>Probleem vooral in ochtend of na slapen</td><td>Ja</td><td>Minder waarschijnlijk</td></tr>
                  <tr><td>Vochtplek na slagregen op vaste plek</td><td>Minder waarschijnlijk</td><td>Ja</td></tr>
                  <tr><td>Combinatie met slechte ventilatie en beslagen ramen</td><td>Ja</td><td>Minder waarschijnlijk</td></tr>
                </tbody>
              </table>
            </div>
            <p>Condens volgt vaker een patroon van weer, ventilatie en gebruik van de ruimte. Lekkage volgt vaker regenbelasting of een specifieke buitensituatie. Twijfel je, vergelijk deze pagina dan ook met <a href="../lekkage-bij-dakkapel-oorzaken/">lekkage bij een dakkapel</a>.</p>

            <h2 id="oplossingen">Welke oplossingen helpen echt?</h2>
            <ul>
              <li><strong>Ventilatie verbeteren</strong> is bijna altijd de eerste stap.</li>
              <li><strong>Vochtproductie beperken of sneller afvoeren</strong> helpt vooral bij slaapkamers en wasgerelateerde ruimtes.</li>
              <li><strong>Isolatie en koudebruggen beoordelen</strong> is nodig als het probleem steeds op dezelfde koude plekken terugkomt.</li>
              <li><strong>Ramen en roosters correct gebruiken</strong> maakt vaak al veel verschil.</li>
              <li><strong>Structureel patroon? Dan specialistisch laten beoordelen</strong> om foutieve aannames te voorkomen.</li>
            </ul>
            <p>Condens is dus vaak deels gebruiksafhankelijk en deels bouwkundig. Juist daarom werkt een oplossing het best als je beide kanten bekijkt.</p>

            <h2 id="voorbeelden">Praktische scenario's</h2>
            <h3>Scenario 1: beslagen ramen in de ochtend</h3>
            <p>Dit wijst vaker op vochtige binnenlucht en beperkte ventilatie dan op lekkage van buiten.</p>
            <h3>Scenario 2: natte hoek op steeds dezelfde plek</h3>
            <p>Dan moet je kijken of daar een koudebrug, zwakke isolatie of detailprobleem zit.</p>
            <h3>Scenario 3: vocht alleen na harde regen</h3>
            <p>Dan ligt lekkage meer voor de hand dan condens.</p>
            <h3>Scenario 4: nieuwe dakkapel, toch vochtklachten</h3>
            <p>Dan zijn ventilatie, detailisolatie en gebruik van de ruimte de eerste dingen om samen te bekijken.</p>

            <h2 id="checklist">Checklist bij condens</h2>
            <ol>
              <li>Ontstaat het vocht vooral bij kou, slapen of beperkte ventilatie?</li>
              <li>Zijn ramen, roosters en ventilatiemogelijkheden voldoende in gebruik?</li>
              <li>Zit het probleem op een koude hoek, raam of detailpunt?</li>
              <li>Is het patroon anders dan bij regenwater van buiten?</li>
              <li>Blijft het terugkomen ondanks beter ventileren? Laat het dan beoordelen.</li>
            </ol>

            <h2 id="tips">Tips voor huiseigenaren</h2>
            <ol>
              <li>Noteer wanneer condens ontstaat; het patroon is belangrijker dan een losse natte plek.</li>
              <li>Ventilatie structureel verbeteren werkt beter dan af en toe hard ingrijpen.</li>
              <li>Vergelijk condensklachten altijd met gebruik van de ruimte en buitentemperatuur.</li>
              <li>Los condens niet op alsof het automatisch lekkage is; diagnose bepaalt de juiste maatregel.</li>
            </ol>

            <h2 id="bronnen">Bronnen en referenties</h2>
            <p>Voor dit artikel is gebruikgemaakt van openbare bouwkundige uitleg van onder meer:</p>
            <ul>
              <li><a href="https://www.verenigingEigenhuis.nl" rel="nofollow noopener" target="_blank">Vereniging Eigen Huis</a></li>
              <li><a href="https://www.rijksoverheid.nl/onderwerpen/bouwregelgeving" rel="nofollow noopener" target="_blank">Rijksoverheid: bouwregelgeving</a></li>
              <li><a href="https://slimster.nl/dakkapellen/" rel="nofollow noopener" target="_blank">Slimster: dakkapellen overzicht</a></li>
            </ul>

            <h2 id="faq">Veelgestelde vragen</h2>
            <h3>Hoe herken je condens op een dakkapelraam?</h3>
            <p>Vaak als beslagen of nat glas in koude periodes, vooral 's ochtends of bij weinig ventilatie.</p>
            <h3>Is condens hetzelfde als lekkage?</h3>
            <p>Nee. Condens komt meestal van binnenlucht, lekkage van buitenwater.</p>
            <h3>Wat is de eerste stap bij condens?</h3>
            <p>Beter ventileren en het patroon van vochtvorming goed observeren.</p>
            <h3>Wanneer is isolatie een aandachtspunt?</h3>
            <p>Als condens steeds op dezelfde koude plek terugkomt, ondanks voldoende ventilatie.</p>
            <h3>Moet je hulp inschakelen als het blijft terugkomen?</h3>
            <p>Ja. Structurele condens kan wijzen op een bouwkundig detail dat beoordeeld moet worden.</p>`,
    faqs: [
      {
        q: "Hoe herken je condens op een dakkapelraam?",
        a: "Vaak als beslagen of nat glas in koude periodes, vooral 's ochtends of bij weinig ventilatie."
      },
      {
        q: "Is condens hetzelfde als lekkage?",
        a: "Nee. Condens komt meestal van binnenlucht, lekkage van buitenwater."
      },
      {
        q: "Wat is de eerste stap bij condens?",
        a: "Beter ventileren en het patroon van vochtvorming goed observeren."
      },
      {
        q: "Wanneer is isolatie een aandachtspunt?",
        a: "Als condens steeds op dezelfde koude plek terugkomt, ondanks voldoende ventilatie."
      },
      {
        q: "Moet je hulp inschakelen als het blijft terugkomen?",
        a: "Ja. Structurele condens kan wijzen op een bouwkundig detail dat beoordeeld moet worden."
      }
    ]
  }
];

function replaceRequired(content, pattern, replacement, label) {
  if (!pattern.test(content)) {
    throw new Error(`Pattern not found for ${label}`);
  }
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
  html = replaceRequired(
    html,
    /<meta name="description"[\s\S]*?content="[^"]*"[\s\S]*?>/,
    `<meta name="description" content="${page.description}">`,
    `${page.file} meta description`
  );
  html = replaceRequired(
    html,
    /<meta property="og:title"[\s\S]*?content="[^"]*"[\s\S]*?>/,
    `<meta property="og:title" content="${page.title}">`,
    `${page.file} og title`
  );
  html = replaceRequired(
    html,
    /<meta property="og:description"[\s\S]*?content="[^"]*"[\s\S]*?>/,
    `<meta property="og:description" content="${page.description}">`,
    `${page.file} og description`
  );
  html = replaceRequired(
    html,
    /<meta name="twitter:title"[\s\S]*?content="[^"]*"[\s\S]*?>/,
    `<meta name="twitter:title" content="${page.title}">`,
    `${page.file} twitter title`
  );
  html = replaceRequired(
    html,
    /<meta name="twitter:description"[\s\S]*?content="[^"]*"[\s\S]*?>/,
    `<meta name="twitter:description" content="${page.description}">`,
    `${page.file} twitter description`
  );
  html = replaceRequired(html, /<h1>[^<]*<\/h1>/, `<h1>${page.h1}</h1>`, `${page.file} h1`);
  html = replaceRequired(
    html,
    /(<article class="article-body" style="max-width:none;padding-top:var\(--sp-10\);">)[\s\S]*?(<\/article>)/,
    `$1\n${page.articleHtml}\n          $2`,
    `${page.file} article body`
  );
  html = replaceRequired(
    html,
    /<span>⏱️ [^<]*<\/span>/,
    `<span>⏱️ ${page.readTime}</span>`,
    `${page.file} read time`
  );

  const ldJsonMatch = html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/);
  if (!ldJsonMatch) {
    throw new Error(`JSON-LD not found for ${page.file}`);
  }

  const structuredData = JSON.parse(ldJsonMatch[1]);
  const blogPosting = structuredData.find((item) => item["@type"] === "BlogPosting");
  const faqPage = structuredData.find((item) => item["@type"] === "FAQPage");
  if (!blogPosting || !faqPage) {
    throw new Error(`Expected BlogPosting and FAQPage for ${page.file}`);
  }

  blogPosting.headline = page.h1;
  blogPosting.description = page.description;
  blogPosting.wordCount = stripHtml(page.articleHtml).split(/\s+/).filter(Boolean).length;

  faqPage.mainEntity = page.faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a
    }
  }));

  html = html.replace(
    ldJsonMatch[0],
    `<script type="application/ld+json">\n${JSON.stringify(structuredData, null, 2)}\n    </script>`
  );

  fs.writeFileSync(filePath, html);
  console.log(`Updated ${page.file}`);
}
