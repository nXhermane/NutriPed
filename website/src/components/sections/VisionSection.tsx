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
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Bâtir le futur de la santé pédiatrique</h2>
          <p className="mt-4 text-lg text-gray-300">
            Notre ambition est de créer un écosystème ouvert, intelligent et fiable, au service des soignants et des enfants.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <PillarCard
            title="Fiabilité"
            icon={<ShieldCheck className="w-8 h-8" />}
          >
            Chaque calcul, chaque diagnostic s'appuie sur les standards de l'OMS et une architecture logicielle éprouvée. La confiance n'est pas une option, c'est notre fondation.
          </PillarCard>
          <PillarCard
            title="Accessibilité"
            icon={<Globe className="w-8 h-8" />}
          >
            Le savoir et les outils doivent être partagés. Notre modèle open-source et notre approche cross-platform garantissent que Nutriped soit accessible à tous, partout.
          </PillarCard>
          <PillarCard
            title="Intelligence"
            icon={<Zap className="w-8 h-8" />}
          >
            Demain, Nutriped ne se contentera pas de suivre. Il anticipera. Grâce à l'analyse de données, nous voulons offrir une aide à la décision pour des soins proactifs et personnalisés.
          </PillarCard>
        </div>
      </div>
    </section>
  );
};
