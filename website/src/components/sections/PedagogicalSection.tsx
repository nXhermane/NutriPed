import React from 'react';
import { ClipboardList, BrainCircuit, BarChart3 } from 'lucide-react';

const StepCard = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <div className="flex flex-col items-center text-center p-4">
    <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-blue-600 text-white shadow-lg">
      {icon}
    </div>
    <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
    <p className="text-gray-400 max-w-xs">
      {children}
    </p>
  </div>
);

export const PedagogicalSection = () => {
  return (
    <section id="pedagogical" className="py-20 sm:py-32 bg-gray-900/50 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Comment ça marche, en langage simple ?</h2>
          <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
            Imaginez Nutriped comme un carnet de santé numérique et intelligent pour la croissance des enfants.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <StepCard
            title="1. Collecter"
            icon={<ClipboardList className="w-8 h-8" />}
          >
            Tel un secrétaire méticuleux, l'application enregistre toutes les informations importantes : poids, taille, signes cliniques, etc. Fini les notes éparpillées.
          </StepCard>
          <StepCard
            title="2. Analyser"
            icon={<BrainCircuit className="w-8 h-8" />}
          >
            Tel un assistant expert, Nutriped compare instantanément ces données aux standards de référence mondiaux (OMS). Il fait tous les calculs compliqués en un clin d'œil.
          </StepCard>
          <StepCard
            title="3. Visualiser"
            icon={<BarChart3 className="w-8 h-8" />}
          >
            Tel un tableau de bord clair, l'application montre la santé nutritionnelle de l'enfant avec des codes couleurs simples et des courbes de croissance faciles à lire.
          </StepCard>
        </div>
      </div>
    </section>
  );
};
