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

export const MissionPage: React.FC = () => {
  return (
    <section className="py-20 sm:py-32 bg-gray-900/50 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Notre mission : la clarté au service du soin</h2>
          <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
            Nous croyons que des outils intelligents peuvent libérer le potentiel des soignants et protéger la santé de chaque enfant.
          </p>
        </div>

        <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-white">Un chiffre qui nous anime</h3>
            <p className="mt-4 text-lg text-blue-300 max-w-2xl mx-auto">
                Le saviez-vous ? Selon l'OMS, <span className="font-bold text-white">148 millions</span> d'enfants de moins de 5 ans souffrent d'un retard de croissance. C'est plus qu'un chiffre, c'est un appel à l'action.
            </p>
            <p className="mt-4 text-gray-400 max-w-3xl mx-auto">
                Nutriped est notre réponse : un outil pour armer les héros du quotidien - pédiatres, nutritionnistes, soignants - dans ce combat essentiel.
            </p>
        </div>


        <div className="mt-24">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Le processus, simplifié</h2>
              <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
                Moins de paperasse, plus de temps pour les patients.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <StepCard
                title="1. Centraliser"
                icon={<ClipboardList className="w-8 h-8" />}
              >
                Centralisez sans effort toutes les données du patient : mesures, signes cliniques, résultats biologiques. Fini les notes éparpillées.
              </StepCard>
              <StepCard
                title="2. Analyser"
                icon={<BrainCircuit className="w-8 h-8" />}
              >
                Notre moteur d'analyse calcule les Z-scores, compare aux standards de l'OMS et évalue les indicateurs clés en temps réel.
              </StepCard>
              <StepCard
                title="3. Visualiser"
                icon={<BarChart3 className="w-8 h-8" />}
              >
                Des codes couleurs intuitifs et des courbes de croissance interactives vous aident à prendre les bonnes décisions, plus rapidement.
              </StepCard>
            </div>
        </div>
      </div>
    </section>
  );
};
