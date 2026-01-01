import Image from "next/image";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section id="about" className="relative flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-500 text-white px-6 md:px-12 py-16">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl gap-12 md:gap-16">
        {/* Left side - Text content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 text-center md:text-left space-y-6"
        >
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight">
            Hi, I&apos;m George
          </h1>

          <h2 className="text-2xl sm:text-3xl font-medium text-gray-200">
            A self-taught front-end developer based in Greece. Now exploring instagram 👉
          </h2>

          <p className="text-lg text-gray-300">
            I also hold a <strong>B.Sc. in Economics</strong> from UNIPI and
            <strong> M.Sc. in International Negotiations</strong> from AUEB.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center md:justify-start">
            <a
              href="https://drive.google.com/file/d/1h4SYZ_dYsqhNcPELkHu-7odHIuxciyyw/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-black font-medium py-3 px-8 rounded-xl hover:bg-gray-200 transition"
            >
              Resume
            </a>
            <a
              href="https://drive.google.com/file/d/1h49o9kHqK5Qo3Y5gZw0G2ah9iQpW_e35/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent border border-white py-3 px-8 rounded-xl hover:bg-white/10 transition"
            >
              Personal Assessment
            </a>
          </div>
        </motion.div>

        {/* Right side - Instagram summary */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="md:w-1/2 flex flex-col items-center text-center"
        >
          <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/screenshot.png" // move image to /public
              alt="Instagram Analytics Overview"
              width={800}
              height={600}
              className="object-cover"
            />
          </div>

          <p className="mt-6 text-gray-300 max-w-md">
            <strong>Instagram Organic Growth 2025: </strong>  
            <br /> My funnel: 28.1M views → 83.1K profile visits → <br /> 217 linktree visits → 111 Gumroad visits → 0 sales.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
