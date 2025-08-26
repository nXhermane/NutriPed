import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/sections/HeroSection';
import { ContextSection } from './components/sections/ContextSection';
import { TechnicalSection } from './components/sections/TechnicalSection';
import { PedagogicalSection } from './components/sections/PedagogicalSection';
import { VisionSection } from './components/sections/VisionSection';
import { TimelineSection } from './components/sections/TimelineSection';
import { ContactSection } from './components/sections/ContactSection';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <ContextSection />
        <PedagogicalSection />
        <TechnicalSection />
        <VisionSection />
        <TimelineSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
