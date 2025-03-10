const Portfolio = () => {
    return (
      <section id="portfolio" className="py-20 bg-gray-500 text-center">
        <div className="container mx-auto">
          {/* Portfolio Title */}
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Project Portfolio</h2>
  
          {/* Back Button */}
          <div className="mt-12">
            <a
              href="/"
              className="bg-black hover:bg-gray-500 text-white py-3 px-6 rounded-lg inline-block transition duration-300"
            >
              Back
            </a>
          </div>
  
          {/* Table of Projects */}
          <div className="overflow-x-auto mt-8">
            <table className="mx-auto w-full max-w-3xl divide-y divide-gray-200 shadow-lg rounded-lg">
              <tbody className="bg-white text-black divide-y divide-gray-200">
                {/* Project Rows */}
                {[
                  {
                    year: '2025',
                    title: 'Free Extension - Bookmark Manager',
                    tag: '#extension',
                    link: 'https://chromewebstore.google.com/detail/bookmark-organizer/cbooolhmbfhplnkfedjohjinljbdjjcg?authuser=0&hl=en',
                  },
                  {
                    year: '2024',
                    title: 'Free Startup Pitch Deck',
                    tag: '#finance',
                    link: 'https://www.canva.com/design/DAFzf78TIbE/7k1yl8R-ONhc9b73dqHbbg/view?utm_content=DAFzf78TIbE&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview',
                  },
                  {
                    year: '2024',
                    title: 'lattly',
                    tag: '#website',
                    link: 'https://tragkas.github.io/lattly/',
                  },
                  {
                    year: '2024',
                    title: 'startxub',
                    tag: '#website',
                    link: 'https://tragkas.github.io/startxub/',
                  },
                  {
                    year: '2024',
                    title: 'Your Personal Reset Button',
                    tag: '#website',
                    link: 'https://resetbutton.carrd.co/',
                  },
                  {
                    year: '2024',
                    title: 'Filo Filo',
                    tag: '#website',
                    link: 'https://filofilo.gr/',
                  },
                  {
                    year: '2024',
                    title: 'Airbnb Customer Preferences Research',
                    tag: '#real-estate',
                    link: 'https://drive.google.com/file/d/1gg3kcbGe1joklsd2MqbxcisPCYgHkTUj/view?usp=sharing',
                  },
                  {
                    year: '2024',
                    title: 'Business Brand Kit Information Form',
                    tag: '#other',
                    link: 'https://github.com/tragkas/brand-kit',
                  },
                  {
                    year: '2024',
                    title: 'Google My Business Profile Setup Form',
                    tag: '#other',
                    link: 'https://github.com/tragkas/google-my-business-form',
                  },
                  {
                    year: '2023',
                    title: 'M.Sc. Thesis: Presentation',
                    tag: '#finance',
                    link: 'https://drive.google.com/file/d/1gNMXbkgEdYnmzXxRwzyK_oHjaGXagNr_/view?usp=drive_link',
                  },
                  {
                    year: '2023',
                    title: 'M.Sc. Thesis: The role of crowdfunding in startup financing',
                    tag: '#finance',
                    link: 'https://www.pyxida.aueb.gr/index.php?op=view_object&object_id=10734&lang=en',
                  },
                  {
                    year: '2023',
                    title: 'Russia and Ukraine: Presentation using Open-source intelligence',
                    tag: '#negotiations',
                    link: 'https://drive.google.com/file/d/1gOnTCvZ_QKLG3dsp0r6DBBv9YJ1AhqZ2/view?usp=drive_link',
                  },
                  {
                    year: '2023',
                    title: 'Random Date Ideas',
                    tag: '#website',
                    link: 'https://tragkas.github.io/random-date/',
                  },
                  {
                    year: '2023',
                    title: 'Random Movie Ideas',
                    tag: '#website',
                    link: 'https://tragkas.github.io/random-movie/',
                  },
                  {
                    year: '2023',
                    title: 'Free Resumes',
                    tag: '#other',
                    link: 'https://github.com/tragkas/free-beige-black-white-resume',
                  },
                  {
                    year: '2023',
                    title: 'Dispute Resolution Method',
                    tag: '#negotiations',
                    link: 'https://github.com/tragkas/dispute-resolution-method',
                  },
                  {
                    year: '2023',
                    title: 'Investor\'s Risk Tolerance',
                    tag: '#finance',
                    link: 'https://github.com/tragkas/investors-risk-tolerance',
                  },
                  {
                    year: '2022',
                    title: 'Discord Server Template',
                    tag: '#other',
                    link: 'https://discord.new/NNqa7yXtZcWB',
                  },
                  {
                    year: '2021',
                    title: 'Army Packing List',
                    tag: '#other',
                    link: 'https://drive.google.com/file/d/1CFFaqpIQowZql2TM-uDzdR-X4UtnFdKu/view?usp=drive_link',
                  },
                  {
                    year: '2020',
                    title: 'GTAinside | 230K+ Downloads',
                    tag: '#other',
                    link: 'https://www.gtainside.com/user/iuser',
                  },
                ].map((project, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">{project.year}</td>
                    <td className="px-6 py-4">
                      <div className="text-left">
                        {project.title}{' '}
                        <span className="inline-block text-gray-500 text-sm px-2 py-1 rounded">
                          {project.tag}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        href={project.link}
                        className="bg-black hover:bg-gray-500 text-white font-bold py-2 px-4 rounded inline-block"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    );
  };
  
  export default Portfolio;
  