import Image from "next/image";
import Link from "next/link";

const digitalPresences = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/georgiostragkas",
    imageSrc: "/linkedin-pictue.png",
    alt: "LinkedIn profile image",
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/@georgiostragkas",
    imageSrc: "/youtube-picture.png",
    alt: "YouTube channel image",
  },
  {
    name: "Pinterest",
    url: "https://gr.pinterest.com/georgiostragkas/",
    imageSrc: "/pinterest-picture.png",
    alt: "Pinterest profile image",
  },
  {
    name: "Newsletter",
    url: "https://yourpersonalhardreset.beehiiv.com/",
    imageSrc: "/newsletter-picture.png",
    alt: "Newsletter image",
  },
  {
    name: "Gumroad",
    url: "https://georgiostragkas.gumroad.com/",
    imageSrc: "/gumroad-picture.png",
    alt: "Gumroad profile image",
  },
];

const DigitalPresenceSection = () => {
  return (
    <section id="digital-presence" className="py-20 text-center bg-gray-100 text-gray-800">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Digital Presence</h2>
        <blockquote className="text-lg italic text-gray-700">
          "Everything you can imagine is real"
        </blockquote>
        <p className="mt-4 text-lg text-gray-600">- Pablo Picasso</p>

        {/* Digital Presence Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          {digitalPresences.map((presence) => (
            <figure key={presence.name} className="border border-gray-400 rounded-lg overflow-hidden shadow-md">
              <a href={presence.url} target="_blank" rel="noopener noreferrer">
                <Image
                  src={presence.imageSrc}
                  alt={presence.alt}
                  width={400}
                  height={250}
                  className="w-full h-auto object-cover"
                  priority
                />
              </a>
              <figcaption className="p-4">
                <a
                  href={presence.url}
                  className="text-black hover:text-gray-500 block text-lg font-semibold focus-visible:ring focus-visible:ring-gray-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Check it ↗
                </a>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DigitalPresenceSection;
