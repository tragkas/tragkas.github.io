const Footer = () => {
  return (
    <footer className="bg-gray-500 text-white py-10">
      <div className="container mx-auto px-6">
        {/* Divider */}
        <div className="border-t border-gray-400 mb-8"></div>

        {/* Three Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Column 1 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Revisit</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#education" className="hover:text-gray-800 transition-colors">Education</a></li>
              <li><a href="#portfolio" className="hover:text-gray-800 transition-colors">Portfolio</a></li>
              <li><a href="#about" className="hover:text-gray-800 transition-colors">About me</a></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Socials</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://www.instagram.com/georgiostragkas_/" target="_blank" className="hover:text-gray-800 transition-colors">Instagram</a></li>
              <li><a href="https://www.youtube.com/@georgiostragkas" target="_blank" className="hover:text-gray-800 transition-colors">YouTube</a></li>
              <li><a href="https://www.linkedin.com/in/georgiostragkas/" target="_blank" className="hover:text-gray-800 transition-colors">Linkedin</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">More..</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://www.goodreads.com/user/show/181012332-georgios-tragkas" target="_blank" className="hover:text-gray-800 transition-colors">Books</a></li>
              <li><a href="https://roadmap.sh/r/ladders-of-wealth-creation" target="_blank" className="hover:text-gray-800 transition-colors">Wealth</a></li>
            </ul>
          </div>

        </div>


      </div>
    </footer>
  );
};

export default Footer;