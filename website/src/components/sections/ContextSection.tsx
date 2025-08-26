import React from 'react';
import { HardDriveDownload, Stethoscope } from 'lucide-react';

const Card = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 backdrop-blur-sm">
    <div className="flex items-center space-x-4">
      {icon}
      <h3 className="text-xl font-bold text-white">{title}</h3>
    </div>
    <p className="mt-4 text-gray-400">
      {children}
    </p>
  </div>
);

export const ContextSection = () => {
  return (
    <section id="context" className="py-20 sm:py-32 bg-gray-900/50 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Contexte et Motivation</h2>
          <p className="mt-4 text-lg text-gray-400">Pourquoi ce projet existe-t-il et quel problème résout-il ?</p>
        </div>
        <div className="mt-16 grid max-w-4xl mx-auto grid-cols-1 md:grid-cols-2 gap-8">
          <Card
            title="Le Problème"
            icon={<HardDriveDownload className="w-8 h-8 text-red-400" />}
          >
            Les professionnels de la santé pédiatrique jonglent avec des données fragmentées, des calculs manuels complexes (Z-scores, percentiles) et des outils hétérogènes. Ce processus est chronophage, source d'erreurs potentielles, et complique le suivi longitudinal précis de la croissance d'un enfant.
          </Card>
          <Card
            title="Notre Solution"
            icon={<Stethoscope className="w-8 h-8 text-green-400" />}
          >
            Nutriped centralise toutes les données patient (anthropométriques, cliniques, biologiques) en un seul endroit. L'application automatise les calculs complexes, génère des diagnostics standardisés basés sur les normes de l'OMS, et fournit des visualisations claires comme les courbes de croissance.
          </Card>
        </div>
      </div>
    </section>
  );
};
