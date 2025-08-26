
export const HeroSection = () => {
  return (
    <section id="home" className="w-full h-screen flex items-center justify-center bg-gray-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="absolute left-0 right-0 top-[-10%] h-[1000px] w-[1000px] rounded-full bg-[radial-gradient(circle_400px_at_50%_300px,#fbfbfb36,#000)]"></div>
      </div>

      <div className="text-center px-4 z-10">
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 pb-2">
          Nutriped
        </h1>
        <p className="mt-4 text-lg md:text-2xl text-gray-300">
          La nutrition pédiatrique, simplifiée et précise.
        </p>
        <p className="mt-2 max-w-2xl mx-auto text-gray-400">
          Un outil open-source intelligent pour aider les professionnels de santé à évaluer et suivre l'état nutritionnel des enfants.
        </p>
        <div className="mt-8">
          <a
            href="#context"
            className="px-6 py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-all duration-300 shadow-lg"
          >
            Découvrir le projet
          </a>
        </div>
      </div>
    </section>
  );
};
