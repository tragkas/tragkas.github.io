import Image from "next/image";

const HeroSection = () => {
  return (
    <section
      className="relative flex justify-center items-center text-center bg-gray-500 h-screen"
      style={{
 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Content */}
      <div className="max-w-2xl p-6">
        <h1 className="text-6xl sm:text-8xl font-bold text-white drop-shadow-lg">
          Welcome Stranger
        </h1>
        <p className="mt-8 text-xl sm:text-2xl text-white drop-shadow-md">
          Hi, I'm George.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://drive.google.com/file/d/1h4SYZ_dYsqhNcPELkHu-7odHIuxciyyw/view?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black hover:bg-gray-500 text-white py-3 px-6 rounded-lg transition duration-300 focus:outline-none focus:ring focus:ring-gray-500"
          >
            Resume
          </a>
          <a
            href="https://drive.google.com/file/d/1h49o9kHqK5Qo3Y5gZw0G2ah9iQpW_e35/view?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black hover:bg-gray-500 text-white py-3 px-6 rounded-lg transition duration-300 focus:outline-none focus:ring focus:ring-gray-500"
          >
            Assessment
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
