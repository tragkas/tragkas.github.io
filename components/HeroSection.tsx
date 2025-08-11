const HeroSection = () => {
  return (
    <section
      className="relative flex justify-center items-center h-screen bg-gray-500 bg-cover bg-center"
    >
      {/* Optional subtle overlay for text readability */}
      <div className="absolute inset-0 bg-gray-500/30" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl px-6 text-center">
        <h1 className="text-5xl sm:text-7xl font-extrabold text-white drop-shadow-lg leading-tight">
          Hi, I&apos;m George
        </h1>

        <h2 className="mt-4 text-2xl sm:text-3xl font-medium text-white/90 leading-snug">
          A self-taught front-end developer based in Greece, crafting
          user-focused websites that convert.
        </h2>

        <p className="mt-6 text-lg sm:text-xl text-white/80 drop-shadow-md leading-relaxed">
          I hold a <strong>B.Sc. in Economics</strong> from UNIPI and an
          <strong> M.Sc. in International Negotiations</strong> from AUEB.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://drive.google.com/file/d/1h4SYZ_dYsqhNcPELkHu-7odHIuxciyyw/view?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black hover:bg-gray-600 text-white py-3 px-8 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Resume
          </a>
          <a
            href="https://drive.google.com/file/d/1h49o9kHqK5Qo3Y5gZw0G2ah9iQpW_e35/view?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black hover:bg-gray-600 text-white py-3 px-8 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Personal Assessment
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
