import React from 'react';
import { Github } from 'lucide-react';

export const ContactSection = () => {
  return (
    <section id="contact" className="py-20 sm:py-32 bg-gray-900/50 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Participer au Projet</h2>
        <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
          Nutriped est un projet open-source. Que vous soyez développeur, professionnel de santé ou simplement intéressé par notre vision, votre contribution est la bienvenue.
        </p>
        <div className="mt-8">
          <a
            href="https://github.com/malnutrix/nutriped" // Placeholder link, assuming this is the repo
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 font-semibold text-white bg-gray-700 rounded-md hover:bg-gray-600 transition-all duration-300 shadow-lg"
          >
            <Github className="w-5 h-5 mr-2" />
            Voir sur GitHub
          </a>
        </div>
      </div>
    </section>
  );
};
