const Footer = () => {
  return (
    <footer className="bg-gray-100 text-black py-6">
      <div className="container mx-auto flex flex-col items-center justify-center md:flex-row md:justify-between">
        {/* Navigation Links */}
        <div className="flex space-x-6 mb-4 md:mb-0">
          <a href="#portfolio" className="hover:text-gray-500">
            Projects
          </a>
          <a href="#education" className="hover:text-gray-500">
            Education
          </a>
          <a href="#articles" className="hover:text-gray-500">
            Articles
          </a>
        </div>

        {/* LinkedIn Icon */}
        <div className="text-center mb-4 md:mb-0">
          <a
            href="https://www.linkedin.com/in/georgiostragkas/"
            className="text-black hover:text-gray-500"
            aria-label="Visit LinkedIn Profile"
          >
            <svg
              className="w-6 h-6 inline-block"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.15c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.15h-3v-5.5c0-1.104-.896-2-2-2s-2 .896-2 2v5.5h-3v-10h3v1.306c.781-.625 1.75-1.306 3-1.306 2.206 0 4 1.794 4 4v6z"/>
            </svg>
          </a>
        </div>

        {/* Copyright Information */}
        <div className="text-center">
          <p className="text-sm text-black">&copy; Copyright 2025. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
