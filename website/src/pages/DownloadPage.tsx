import React from 'react';
import { Rocket } from 'lucide-react';

export const DownloadPage: React.FC = () => {
  return (
    <section className="py-20 sm:py-32 bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <Rocket className="w-16 h-16 mx-auto text-blue-400" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">Le futur du suivi pédiatrique arrive</h2>
          <p className="mt-4 text-lg text-gray-400">
            Nous mettons la dernière main à l'application Nutriped. Elle sera bientôt disponible sur iOS et Android pour transformer votre pratique au quotidien.
          </p>
        </div>

        <div className="mt-16 max-w-xl mx-auto">
            <div className="text-center">
                <h3 className="text-xl font-semibold text-white">Devenez un pionnier</h3>
                <p className="mt-2 text-gray-400">
                    Laissez-nous votre email pour être notifié en avant-première du lancement et accéder à des informations exclusives sur le projet.
                </p>
            </div>
            <form className="mt-8 flex gap-x-4">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                  placeholder="Entrez votre email"
                />
                <button
                  type="submit"
                  className="flex-none rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Me notifier
                </button>
            </form>
        </div>
      </div>
    </section>
  );
};
