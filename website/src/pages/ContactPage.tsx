import React from 'react';
import { Send, Github } from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <section className="py-20 sm:py-32 bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Parlons-en</h2>
          <p className="mt-4 text-lg text-gray-400">
            Que vous soyez un professionnel de santé, un développeur ou simplement curieux, votre voix nous intéresse. Laissez-nous un message !
          </p>
        </div>

        <div className="mt-16 max-w-xl mx-auto">
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Nom
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  autoComplete="name"
                  className="block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Votre nom"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="vous@example.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                Message
              </label>
              <div className="mt-1">
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Votre message..."
                ></textarea>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Send className="w-5 h-5 mr-2" />
                Envoyer le message
              </button>
            </div>
          </form>

          <div className="mt-12 text-center">
            <p className="text-gray-400">Pour les plus techniques, notre projet est entièrement ouvert et accessible sur GitHub. Venez contribuer !</p>
            <a href="https://github.com/nx-hermano/nutriped" target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center text-blue-400 hover:text-blue-300">
              <Github className="w-5 h-5 mr-2" />
              nx-hermano/nutriped
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
