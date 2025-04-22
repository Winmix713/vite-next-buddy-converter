
import Header from "@/components/Header";
import Converter from "@/components/Converter";
import Features from "@/components/Features";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main>
        <section id="features">
          <Features />
        </section>
        
        <section id="converter" className="py-24">
          <Converter />
        </section>
        
        <section id="faq">
          <FAQ />
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
