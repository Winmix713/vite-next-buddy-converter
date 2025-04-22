
import { CheckCircle2 } from "lucide-react";

const Features = () => {
  const features = [
    {
      title: "Egyszerű kódkonvertálás",
      description: "Töltsd fel Next.js projektjeid fájljait vagy másold be a kódod, és a konverter automatikusan átalakítja azokat Vite-kompatibilis formátumra."
    },
    {
      title: "package.json optimalizálás",
      description: "Az alkalmazás automatikusan frissíti a package.json fájlt, eltávolítja a Next.js függőségeket és hozzáadja a Vite-hoz szükséges csomagokat."
    },
    {
      title: "Routing konvertálás",
      description: "A Next.js fájlalapú routing rendszerét átalakítja React Router útvonalakká a zökkenőmentes átállás érdekében."
    },
    {
      title: "API Route-ok kezelése",
      description: "Útmutatást nyújt a Next.js API route-ok külön backend szolgáltatásba történő áthelyezéséhez különböző megvalósítási opciókkal."
    },
    {
      title: "Data Fetching konvertálása",
      description: "A getStaticProps és getServerSideProps függvényeket React horgokra (useState, useEffect) alakítja a kliens oldali adatlekéréshez."
    },
    {
      title: "Next.js komponensek cseréje",
      description: "A Next.js specifikus komponenseket (Image, Link, stb.) standard HTML elemekre vagy más könyvtárak megfelelőire cseréli."
    }
  ];

  return (
    <div className="bg-gray-50 py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Funkciók</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A Next.js to Vite konverter számos funkciót kínál, hogy a migrációs folyamat a lehető legegyszerűbb legyen.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="text-primary mb-4">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
