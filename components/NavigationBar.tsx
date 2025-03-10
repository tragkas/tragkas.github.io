import Link from "next/link";

const NavigationBar = () => {
  return (
    <nav className="bg-gray-100 py-6 text-black">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <Link href="/" className="hover:text-gray-500 text-xl font-semibold">
            George Tragkas
          </Link>
        </div>
        <ul className="flex space-x-4">
          <li>
            <Link href="#portfolio" className="hover:text-gray-500 focus-visible:ring focus-visible:ring-gray-400">
              Projects
            </Link>
          </li>
          <li>
            <Link href="#education" className="hover:text-gray-500 focus-visible:ring focus-visible:ring-gray-400">
              Education
            </Link>
          </li>
          <li>
            <Link href="#articles" className="hover:text-gray-500 focus-visible:ring focus-visible:ring-gray-400">
              Articles
            </Link>
          </li>
          <li>
            <a 
              href="https://www.goodreads.com/user/show/181012332-georgios-tragkas" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-gray-500 focus-visible:ring focus-visible:ring-gray-400"
            >
              Books
            </a>
          </li>
          <li>
            <Link href="#form" className="font-bold hover:text-gray-500 focus-visible:ring focus-visible:ring-gray-400">
              Newsletter
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavigationBar;
