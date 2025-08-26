import React from 'react';
import { ShieldCheck, Globe, Zap } from 'lucide-react';

const PillarCard = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <div className="text-center p-4">
    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 text-white border border-gray-700">
      {icon}
    </div>
    <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
    <p className="text-gray-400 max-w-xs mx-auto">{children}</p>
  </div>
);

export const VisionSection = () => {
  return (
    <section id="vision" className="py-20 sm:py-32 bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Vision & Futur</h2>
          <p className="mt-4 text-lg text-gray-300">
            Devenir l'outil de référence open-source pour la santé nutritionnelle pédiatrique, en se basant sur trois piliers fondamentaux.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <PillarCard
            title="Fiabilité"
            icon={<ShieldCheck className="w-8 h-8" />}
          >
            Ancrer chaque diagnostic sur des standards validés (OMS) et une architecture logicielle robuste, garantissant la confiance des professionnels.
          </PillarCard>
          <PillarCard
            title="Accessibilité"
            icon={<Globe className="w-8 h-8" />}
          >
            Rendre l'outil disponible au plus grand nombre grâce à son modèle open-source et sa compatibilité cross-platform.
          </PillarCard>
          <PillarCard
            title="Intelligence"
            icon={<Zap className="w-8 h-8" />}
          >
            Évoluer au-delà du suivi pour intégrer des analyses prédictives et suggérer des plans de soins proactifs et personnalisés.
          </PillarCard>
        </div>
      </div>
    </section>
  );
};
