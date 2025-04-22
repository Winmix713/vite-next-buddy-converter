
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Next.js → Vite Konverter
        </h1>
        <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
          Egyszerű és hatékony eszköz Next.js projektjeid Vite-ra konvertálásához, hogy kihasználhasd a gyorsabb fejlesztési élményt és a rugalmasabb build folyamatot.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            size="lg"
            variant="secondary"
            className="font-semibold"
            onClick={() => {
              document.getElementById("converter")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Kezdés most
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-transparent border-white text-white hover:bg-white hover:text-indigo-700"
            asChild
          >
            <a href="https://nextjs.org/docs/pages/guides/migrating/from-vite" target="_blank" rel="noopener noreferrer">
              Hivatalos dokumentáció
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
