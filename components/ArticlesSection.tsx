import Link from 'next/link';

const ArticlesSection = () => {
  const articles = [
    {
      title: "7 Pieces of Advice That Will Change the Way you Think (Part I)",
      url: "https://www.linkedin.com/posts/georgiostragkas_7-pieces-of-advice-that-will-change-the-way-activity-7185604589444882432-RoUZ?utm_source=share&utm_medium=member_desktop",
    },
    {
      title: "How to Use YouTube to Learn and Not Waste Your Time",
      url: "https://www.linkedin.com/posts/georgiostragkas_how-to-use-youtube-to-learn-and-not-waste-activity-7183070937578102785-14mW?utm_source=share&utm_medium=member_desktop",
    },
    {
      title: "How to Leverage Social Media Algorithms",
      url: "https://www.linkedin.com/posts/georgiostragkas_how-to-leverage-social-media-algorithms-activity-7180562411781767168-ysr_?utm_source=share&utm_medium=member_desktop",
    },
    {
      title: "Practical Frameworks for Decision Making",
      url: "https://www.linkedin.com/posts/georgiostragkas_practical-frameworks-for-decision-making-activity-7176548944162807808-Kvno?utm_source=share&utm_medium=member_desktop",
    },
    {
      title: "How to resolve arguments?",
      url: "https://www.linkedin.com/posts/georgiostragkas_how-to-resolve-arguments-2-min-read-activity-7173977741808029696-5D-n?utm_source=share&utm_medium=member_desktop",
    },
    {
      title: "Understanding Value: Intrinsic vs. Market",
      url: "https://www.linkedin.com/posts/georgiostragkas_understanding-value-intrinsic-vs-market-activity-7168294620462870531-4gSq?utm_source=share&utm_medium=member_desktop",
    },
    {
      title: "How to Find Ideas so You'll Always Have Something to Create?",
      url: "https://www.linkedin.com/posts/georgiostragkas_how-to-find-ideas-so-youll-always-have-something-activity-7165343462077198338-ypRK?utm_source=share&utm_medium=member_desktop",
    },
    {
      title: "How to create products that scale?",
      url: "https://www.linkedin.com/posts/georgiostragkas_how-to-create-products-that-scale-2-activity-7163062448508289025-2D9i?utm_source=share&utm_medium=member_desktop",
    },
    {
      title: "How to minimize the friction of creating content?",
      url: "https://www.linkedin.com/posts/georgiostragkas_how-to-minimize-the-friction-of-creating-activity-7160291333687934978-DGKV?utm_source=share&utm_medium=member_desktop",
    },
    {
      title: "How to create content that scales?",
      url: "https://www.linkedin.com/posts/georgiostragkas_how-to-create-content-that-scales-in-3-activity-7157765718019559424-c4iG?utm_source=share&utm_medium=member_desktop",
    },
  ];

  return (
    <section id="articles" className="py-20 bg-gray-100 text-gray-800">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Articles</h2>
        <p className="mt-4 text-lg text-center">"You are what you are today because of the choices you made in the past."</p>
        <p className="mt-4 text-lg text-center">- Jim Rohn</p>

        {/* Articles Table */}
        <div className="overflow-x-auto mt-8">
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              {articles.map((article, index) => (
                <tr key={index}>
                  <td className="border border-transparent px-4 py-2 text-center">
                  <Link href={article.url} className="text-gray-950 hover:text-gray-500" target="_blank" rel="noopener noreferrer">
                    {article.title} ↗
                  </Link>
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

export default ArticlesSection;
