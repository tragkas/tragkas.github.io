import Image from "next/image";
import Link from "next/link";

const projects = [
  {
    name: "Lattly",
    url: "https://tragkas.github.io/lattly/",
    imageSrc: "/lattly.gif",
    alt: "Lattly Project Image",
  },
  {
    name: "Startxub",
    url: "https://tragkas.github.io/startxub/",
    imageSrc: "/startxub.gif",
    alt: "Startxub Project Image",
  },
  {
    name: "Your Personal Reset Button",
    url: "https://resetbutton.carrd.co/",
    imageSrc: "/reset.gif",
    alt: "Your Personal Reset Button Project Image",
  },
  {
    name: "Your Plumber",
    url: "https://plumber-project-tawny.vercel.app/",
    imageSrc: "/plumber.gif",
    alt: "Your Personal Plumber Project Image",
  },
  {
    name: "Airbnb Link Tree",
    url: "https://airbnb-link-tree.vercel.app/",
    imageSrc: "/linktree.gif",
    alt: "Airbnb Link Tree Project Image",
  },
  {
    name: "Chrome Extension",
    url: "https://chromewebstore.google.com/detail/bookmark-organizer/cbooolhmbfhplnkfedjohjinljbdjjcg",
    imageSrc: "/chrome.gif",
    alt: "Chrome Extension Project Image",
  },
];

const PortfolioSection = () => {
  return (
    <section id="portfolio" className="py-20 text-center bg-gray-100 text-gray-800">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Projects</h2>
        <blockquote className="text-lg italic text-gray-700">
          "At first, people refuse to believe that a strange new thing can be done, then they begin to hope it can be done, then they see it can be done, then it is done, and all the world wonders why it was not done centuries ago."
        </blockquote>
        <p className="mt-4 text-lg text-gray-600">- Frances Hodgson Burnett</p>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          {projects.map((project) => (
            <figure key={project.name} className="border border-gray-400 rounded-lg overflow-hidden shadow-md">
              <a href={project.url} target="_blank" rel="noopener noreferrer">
                <Image 
                  src={project.imageSrc} 
                  alt={project.alt} 
                  width={400} 
                  height={250} 
                  className="w-full h-auto object-cover"
                />
              </a>
              <figcaption className="p-4">
                <a 
                  href={project.url} 
                  className="text-black hover:text-gray-500 block text-lg font-semibold focus-visible:ring focus-visible:ring-gray-500"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  View Project ↗
                </a>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Button to Projects Page */}
        <div className="mt-12">
          <Link href="/projects" className="bg-black hover:bg-gray-500 text-white py-3 px-6 rounded-lg inline-block transition duration-300 focus-visible:ring focus-visible:ring-gray-500">
            View All Projects
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
