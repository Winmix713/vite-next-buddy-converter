
import { Github, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">Next.js → Vite Konverter</h3>
            <p className="text-gray-400">
              Egyszerű és hatékony eszköz a Next.js projektek Vite-ra konvertálásához.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Linkek</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Kezdőlap
                </a>
              </li>
              <li>
                <a href="#features" className="text-gray-400 hover:text-white transition-colors">
                  Funkciók
                </a>
              </li>
              <li>
                <a href="#converter" className="text-gray-400 hover:text-white transition-colors">
                  Konverter
                </a>
              </li>
              <li>
                <a href="#faq" className="text-gray-400 hover:text-white transition-colors">
                  GYIK
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Erőforrások</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://nextjs.org/docs/pages/guides/migrating/from-vite" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Next.js dokumentáció
                </a>
              </li>
              <li>
                <a 
                  href="https://vitejs.dev/guide/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Vite dokumentáció
                </a>
              </li>
              <li>
                <a 
                  href="https://reactrouter.com/docs/en/v6" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  React Router
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Kapcsolódj</h3>
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="h-6 w-6" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Next.js to Vite Konverter. Minden jog fenntartva.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
