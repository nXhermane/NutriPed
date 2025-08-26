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
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Le défi du suivi nutritionnel</h2>
          <p className="mt-4 text-lg text-gray-400">Sur le terrain, les soignants font face à un vrai casse-tête.</p>
        </div>
        <div className="mt-16 grid max-w-4xl mx-auto grid-cols-1 md:grid-cols-2 gap-8">
          <Card
            title="Le Problème"
            icon={<HardDriveDownload className="w-8 h-8 text-red-400" />}
          >
            Chaque jour, les soignants dévoués perdent un temps précieux à naviguer entre des données éparpillées, des calculs de Z-scores à la main et des outils qui ne communiquent pas. Ce fardeau administratif augmente le risque d'erreur et détourne leur attention de l'essentiel : l'enfant.
          </Card>
          <Card
            title="Notre Solution"
            icon={<Stethoscope className="w-8 h-8 text-green-400" />}
          >
            Nutriped rend le pouvoir aux soignants. En centralisant les données, l'application automatise les calculs, éclaire les diagnostics (OMS) et transforme les chiffres en courbes de croissance parlantes. Le suivi redevient simple, fiable et rapide.
          </Card>
        </div>
      </div>
    </section>
  );
};
