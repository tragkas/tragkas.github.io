import Image from 'next/image';
import Link from 'next/link';

const EducationSection = () => {
  return (
    <section
      id="education"
      className="py-20 bg-gray-500 text-black"
      style={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="container mx-auto">
        <h2 className="text-2xl text-white md:text-3xl font-bold mb-8 text-center ">Education</h2>
        <p className="mt-4 text-lg text-white text-center">
          "A man travels the world over in search of what he needs and returns home to find it."
        </p>
        <p className="mt-4 text-lg text-white text-center">- George A. Moore</p>

        {/* Education Grid */}
        <div className="grid mt-8 grid-cols-1 md:grid-cols-3 gap-8">
          {/* Education Card */}
          {[
            {
              title: "Full-Stack Engineer",
              institution: "Codecademy, Online",
              date: "2023 - 2024",
              description:
                "Full-Stack Engineer Path | This path helps you to build web applications from start to finish. Starts with the front-end, moves to the back-end, then connects the two.",
            },
            {
              title: "M.Sc. in Negotiations",
              institution: "University of Athens, Greece",
              date: "2022 - 2023",
              description:
                "My master's studies focused on negotiations in the international, political and economic spheres.",
            },
            {
              title: "B.Sc. in Economics",
              institution: "University of Piraeus, Greece",
              date: "2015 - 2020",
              description:
                "Completing my Bachelor's degree at University of Piraeus has equipped me with the necessary skills and knowledge to succeed in the fields of economics and finance.",
            },
            {
              title: "Startup School",
              institution: "Y Combinator, Online",
              date: "November 2023 - Finished",
              description:
                "Y Combinator's Startup School is a free online program designed to help early-stage entrepreneurs launch their startups and provide them with the tools and resources needed to succeed.",
            },
            {
              title: "SBA",
              institution: "SBA, Online",
              date: "November 2023 - Finished",
              description:
                "SBA helps small businesses to confidently start, grow and expand their operations.",
            },
            {
              title: "SCORE",
              institution: "SCORE, Online",
              date: "November 2023 - Finished",
              description:
                "The Startup Roadmap is a free online program that helps new businesses to successfully start their operations.",
            },
            {
              title: "ECPE",
              institution: "Hellenic American Union, Greece",
              date: "May 19, 2019",
              description: "",
            },
            {
              title: "Google Certificates",
              institution: "Online",
              date: "2023",
              description:
                <Link href="https://drive.google.com/drive/folders/1Bum3Bzd51eNUeA5l6CfLqsxjPekqPU3C?usp=drive_link" target="_blank" rel="noopener noreferrer">see more ↗</Link>,
            },
            {
              title: "LinkedIn Certificates",
              institution: "Online",
              date: "2023",
              description:
                <Link href="https://drive.google.com/drive/folders/1BwpkMdzmDoxWxlmC_ClVxyK0iyuxFzoO?usp=drive_link" target="_blank" rel="noopener noreferrer">see more ↗</Link>,
            },
            {
              title: "Notion Essentials Badge",
              institution: "Online",
              date: "2024",
              description: (
                <>
                  Notion Essentials Badge holders have demonstrated baseline proficiency across all Notion features.{" "}
                  <Link href="https://www.credly.com/badges/6055a4e8-9f3c-46d1-8731-3866d93f09c8/public_url" target="_blank" rel="noopener noreferrer">
                    see more ↗
                  </Link>
                </>
              ),
            },
          ].map((item, index) => (
            <div key={index} className="bg-white p-4 shadow-md rounded-md">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-gray-700">{item.institution}</p>
              <p className="text-gray-500">{item.date}</p>
              <p className="mt-4">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
