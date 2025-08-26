import React from 'react';
import { Layers, Database, Smartphone, Code, Cpu } from 'lucide-react';

const TechCard = ({ name, description }: { name: string, description: string }) => (
  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 text-center transition-all duration-300 hover:border-blue-500 hover:bg-gray-800">
    <p className="font-mono font-bold text-lg text-white">{name}</p>
    <p className="text-sm text-gray-400">{description}</p>
  </div>
);

const ArchLayer = ({ icon, name, color, children }: { icon: React.ReactNode, name: string, color: string, children: React.ReactNode }) => (
  <div className={`bg-${color}-900/30 p-4 rounded-lg text-center border border-${color}-700`}>
    <p className={`font-mono text-${color}-300 flex items-center justify-center`}>{icon}{name}</p>
    <div className="text-left text-xs text-gray-400 mt-2 pl-2 border-l-2 border-gray-600">
      {children}
    </div>
  </div>
);

export const TechnicalSection = () => {
  return (
    <section id="technical" className="py-20 sm:py-32 bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Approche Technique</h2>
          <p className="mt-4 text-lg text-gray-400">Une architecture solide pour une application fiable.</p>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <h3 className="text-2xl font-bold text-center text-white mb-8">Architecture DDD</h3>
            <div className="space-y-4">
               <ArchLayer icon={<Smartphone className="mr-2"/>} name="App (UI Layer)" color="blue">
                 <p>Interface utilisateur en React Native.</p>
                 <p>Interagit avec les Use Cases.</p>
               </ArchLayer>
               <div className="text-center text-gray-400">↓</div>
               <ArchLayer icon={<Layers className="mr-2"/>} name="Adapter (Infrastructure)" color="purple">
                 <p>Implémentations concrètes : Repositories, services externes.</p>
                 <p>Pont entre le Core et le monde extérieur.</p>
               </ArchLayer>
                <div className="text-center text-gray-400">↓</div>
               <ArchLayer icon={<Cpu className="mr-2"/>} name="Core (Application & Domain)" color="green">
                 <p>Logique métier pure, sans dépendances externes.</p>
                 <p>Use Cases, Entités, Value Objects.</p>
               </ArchLayer>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-center text-white mb-8">Stack Technologique</h3>
            <div className="grid grid-cols-2 gap-4">
              <TechCard name="React Native" description="Framework cross-platform" />
              <TechCard name="Expo" description="Écosystème et outillage" />
              <TechCard name="TypeScript" description="Typage statique" />
              <TechCard name="Bun" description="Runtime & Tooling" />
              <TechCard name="Vite" description="Build tool pour le web" />
              <TechCard name="Drizzle ORM" description="Accès base de données" />
              <TechCard name="TailwindCSS" description="Styling UI" />
              <TechCard name="Zod" description="Validation de schémas" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
