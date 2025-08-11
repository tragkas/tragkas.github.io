const NewsletterSection = () => {
    return (
      <section
        id="form"
        className="py-20 bg-gray-500 text-white"
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Newsletter</h2>
          <p className="mt-4 text-lg">"Always laugh when you can, it is cheap medicine."</p>
          <p className="mt-4 text-lg">- Lord Byron</p>
  
          <div className="bg-gray-100 p-12 rounded-lg shadow-lg text-center max-w-lg mx-auto mt-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Personal Hard Reset</h1>
            <p className="text-gray-600 mb-8">
              Insights to Navigate Your 20s. Join us to get 1 short email every Monday to 10x Your Life in just 4 minutes.
            </p>
            
            {/* Button to redirect to the newsletter signup page */}
            <div className="mt-8">
              <a
                href="https://yourpersonalhardreset.beehiiv.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black hover:bg-gray-500 text-white py-3 px-6 rounded-lg transition duration-300 focus:outline-none focus:ring focus:ring-blue-500"
              >
                Join Our Newsletter
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default NewsletterSection;
  