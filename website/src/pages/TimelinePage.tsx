import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const timelineEvents = [
  {
    status: 'Terminé',
    date: 'Q1 2024',
    title: 'Idéation & Architecture',
    description: 'Définition des objectifs et conception de l\'architecture Domain-Driven Design (DDD) pour garantir une base saine et évolutive.',
  },
  {
    status: 'Terminé',
    date: 'Q2 2024',
    title: 'Développement du Core Métier',
    description: 'Implémentation de la logique métier de base pour l\'évaluation nutritionnelle, incluant les calculs de Z-scores selon les standards de l\'OMS.',
  },
  {
    status: 'En cours',
    date: 'Q3 2024',
    title: 'Version Alpha de l\'App Mobile',
    description: 'Développement de l\'interface utilisateur sur React Native & Expo, et intégration avec le core métier. Premiers tests internes.',
  },
  {
    status: 'Futur',
    date: 'Q4 2024',
    title: 'Bêta-test & Partenariats Stratégiques',
    description: 'Lancement d\'une phase de bêta-test privée avec des pédiatres et nutritionnistes. Recherche de partenariats avec des institutions de santé.',
  },
  {
    status: 'Futur',
    date: 'Q1 2025',
    title: 'Lancement Public v1.0',
    description: 'Déploiement sur les stores (iOS & Android). Intégration des retours de la bêta et stabilisation de la version.',
  },
  {
    status: 'Futur',
    date: 'Q2 2025',
    title: 'Module de Suivi Avancé',
    description: 'Ajout de fonctionnalités d\'analyse prédictive pour anticiper les risques de malnutrition et suggestions de plans de soins proactifs.',
  },
  {
    status: 'Futur',
    date: '2026',
    title: 'Interopérabilité & IA',
    description: 'Intégration avec les systèmes de dossiers médicaux électroniques (DME) et exploration de modèles d\'IA pour une aide au diagnostic encore plus poussée.',
  }
];

const TimelineItem = ({ event, isLeft }: { event: typeof timelineEvents[0], isLeft: boolean }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
    }, [controls, inView]);

    const variants = {
        hidden: { opacity: 0, x: isLeft ? -100 : 100 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
    };

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={variants}
            className="flex md:justify-normal md:w-1/2 md:flex-row-reverse"
        >
            <div className={`flex-shrink-0 w-24 text-right md:w-auto md:text-left ${isLeft ? 'md:text-right' : ''}`}>
                <h3 className={`text-lg font-bold text-white ${isLeft ? 'md:text-right' : ''}`}>{event.date}</h3>
                <p className={`text-sm ${event.status === 'Terminé' ? 'text-green-400' : 'text-yellow-400'}`}>{event.status}</p>
            </div>
            <div className="w-px bg-gray-700 md:w-0.5"></div>
            <div className="w-8 h-8 bg-blue-600 border-4 border-gray-900 rounded-full -ml-4 -mr-4 md:ml-0 md:mr-0 md:-mt-4"></div>
            <div className="w-full pl-4 md:pl-0 md:w-auto md:flex-1">
                <div className={`p-4 bg-gray-800/50 border border-gray-700 rounded-lg ${isLeft ? 'md:ml-12' : 'md:mr-12'}`}>
                    <h4 className="font-bold text-white">{event.title}</h4>
                    <p className="text-gray-400 text-sm mt-1">{event.description}</p>
                </div>
            </div>
        </motion.div>
    );
};

export const TimelinePage: React.FC = () => {
    return (
        <section className="py-20 sm:py-32 bg-gray-900/50 text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Timeline du Projet</h2>
                    <p className="mt-4 text-lg text-gray-400">Notre parcours et les prochaines étapes pour révolutionner la nutrition pédiatrique.</p>
                </div>
                <div className="relative">
                    <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-0.5 bg-gray-700"></div>
                    <div className="md:grid md:grid-cols-2 gap-y-16">
                        {timelineEvents.map((event, index) => (
                            <React.Fragment key={index}>
                                {index % 2 === 0 ? (
                                    <>
                                        <TimelineItem event={event} isLeft={true} />
                                        <div className="hidden md:block"></div>
                                    </>
                                ) : (
                                    <>
                                        <div className="hidden md:block"></div>
                                        <TimelineItem event={event} isLeft={false} />
                                    </>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
