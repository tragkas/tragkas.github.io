import Link from "next/link";

const NavigationBar = () => {
  return (
    <nav className="bg-gray-500 py-6 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <Link href="/" className="hover:text-gray-800 text-xl font-semibold">
            George Tragkas
          </Link>
        </div>
        <ul className="flex space-x-4">
          <li>
            <Link href="#portfolio" className="hover:text-gray-800 focus-visible:ring focus-visible:ring-gray-400">
              Projects
            </Link>
          </li>
          <li>
            <Link href="#education" className="hover:text-gray-800 focus-visible:ring focus-visible:ring-gray-400">
              Education
            </Link>
          </li>
          <li>
            <Link href="#form" className="hover:text-gray-800 focus-visible:ring focus-visible:ring-gray-400">
              Newsletter
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavigationBar;
