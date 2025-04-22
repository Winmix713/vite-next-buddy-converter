
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqItems = [
    {
      question: "Miért váltsak Next.js-ről Vite-ra?",
      answer:
        "A Vite jelentősen gyorsabb fejlesztési élményt kínál az azonnali HMR (Hot Module Replacement) révén. Emellett rugalmasabb konfigurációs lehetőségeket biztosít, és nem kényszerít rá egy szigorú routing vagy rendering modellt. Ha kevésbé van szükséged a Next.js által nyújtott SSR/SSG funkciókra, a Vite könnyebb és gyorsabb alternatíva lehet."
    },
    {
      question: "Milyen korlátai vannak a konverternek?",
      answer:
        "A konverter fő célja a Next.js-specifikus kód átalakítása, de vannak korlátai. Összetett getStaticProps vagy getServerSideProps logika, egyedi middleware használata, vagy speciális Next.js funkciók (pl. Incremental Static Regeneration) további manuális konvertálást igényelhetnek. A szerver oldali funkciók átalakítása külön API megvalósítást igényel."
    },
    {
      question: "Mi történik az API route-okkal?",
      answer:
        "A Next.js API route-ok nem működnek közvetlenül a Vite-ban. A konverter javasolja, hogy ezeket a backend funkciókat külön szolgáltatásba (pl. Express.js server, serverless functions) szervezzük ki. A konvertálás eredménye tartalmaz útmutatót és példakódot a javasolt implementációval."
    },
    {
      question: "A konvertált kód azonnal működőképes lesz?",
      answer:
        "A legtöbb esetben a konverter jó kiindulási pontot nyújt, de valószínűleg szükség lesz kézi finomhangolásra. Összetett projektek esetén különösen ajánlott a konvertált kód alapos átnézése és tesztelése. A konverter célja a kezdeti lépések automatizálása, nem a teljes migráció végrehajtása."
    },
    {
      question: "Mi történik a CSS és asset kezeléssel?",
      answer:
        "A Vite natívan támogatja a CSS importot, a CSS Modulokat, a preprocesszorokat (Sass, Less, Stylus), és az asset importot. A konverter megtartja a stílusimportokat, de egyes Next.js-specifikus asset kezelési módszerek módosítást igényelhetnek, például az Image komponensek standard img elemekre cserélése."
    },
    {
      question: "Hogyan kezeli a konverter a dinamikus route-okat?",
      answer:
        "A Next.js dinamikus route-jait ([id].js vagy [[...slug]].js) a konverter React Router paraméteres útvonalakká alakítja (:id vagy *). A nested route-ok esetében a konverter igyekszik fenntartani a hierarchiát, de ezt a konverzió után érdemes ellenőrizni és szükség esetén módosítani."
    }
  ];

  return (
    <div className="container mx-auto py-24 px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">Gyakori kérdések</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Válaszok a Next.js to Vite konvertálással kapcsolatos leggyakoribb kérdésekre.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-medium">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ;
