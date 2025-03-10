import Image from 'next/image';
import Link from 'next/link';

const socialMediaCertifications = [
  {
    name: "Customer Persona",
    url: "https://drive.google.com/file/d/10BcnMFInoT3R45mOMMiRx-sTyJy9Dlhd/view?usp=drive_link",
    imageSrc: "/persona-pictue.jpg",
    alt: "Customer Persona image",
  },
  {
    name: "Creative Brief",
    url: "https://drive.google.com/file/d/1-um2VEfYqZa7TFRHP9rTTdTS5d9QXivl/view?usp=drive_link",
    imageSrc: "/brief-picture.jpg",
    alt: "Creative Brief image",
  },
  {
    name: "Instagram Account",
    url: "https://drive.google.com/file/d/1-u9SjyxgvGb0GgYtSxSbntx8ByDVa5ei/view?usp=drive_link",
    imageSrc: "/instaccount-picture.jpg",
    alt: "Instagram Account image",
  },
  {
    name: "Instagram Post",
    url: "https://drive.google.com/file/d/1-lnu1xbKCpISvXciz00mK1gkCdk2W5OR/view?usp=drive_link",
    imageSrc: "/instapost-picture.jpg",
    alt: "Instagram Post image",
  },
  {
    name: "Instagram Ad",
    url: "https://drive.google.com/file/d/1-gueNuFQ8redli8CNQWsMRflt-pwp4lo/view?usp=drive_link",
    imageSrc: "/instaad-picture.jpg",
    alt: "Instagram Ad image",
  },
  {
    name: "Content Calendar",
    url: "https://docs.google.com/spreadsheets/d/1-eAfKB-mSMyaxUZk7flOcjxBEzLwk1_I/edit?usp=drive_link&ouid=118413621441124305970&rtpof=true&sd=true",
    imageSrc: "/calendar-picture.jpg",
    alt: "Content Calendar image",
  },
];

const SocialMediaManagementCertificateSection = () => {
  return (
    <section id="portfolio" className="py-20 text-center bg-gray-100 text-gray-800">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">
          Meta Social Media Marketing Professional Certificate (Project Portfolio)
        </h2>
        <p className="mt-4 text-lg text-center">"Nature optimizes for the whole, not for the individual, but most people judge good and bad based only on how it affects them"</p>
        <p className="mt-4 text-lg text-center">- Ray Dalio</p>
        
        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {socialMediaCertifications.map((item) => (
            <figure key={item.name} className="border border-gray-500 rounded-lg overflow-hidden shadow-md">
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                <Image
                  src={item.imageSrc}
                  alt={item.alt}
                  width={500}
                  height={300}
                  className="w-full h-auto object-cover"
                  priority
                />
              </a>
              <figcaption className="p-4">
                <a
                  href={item.url}
                  className="text-black hover:text-gray-500 block mb-2 text-lg font-semibold focus-visible:ring focus-visible:ring-gray-500"
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

export default SocialMediaManagementCertificateSection;
