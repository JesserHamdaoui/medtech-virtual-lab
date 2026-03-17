import Link from "next/link";
import DynamicIcon from "./DynamicIcon";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4 text-primary-400">
              MedTech Virtual Laboratory
            </h3>
            <p className="text-gray-300 mb-4">
              Empowering STEM education through interactive virtual laboratories
              at SMU (Mediterranean Institution of Technology). Explore physics
              simulations and enhance your learning experience.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
                aria-label="Facebook"
              >
                <DynamicIcon name="LogoFacebook" size={24} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
                aria-label="Twitter"
              >
                <DynamicIcon name="LogoTwitter" size={24} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <DynamicIcon name="LogoLinkedin" size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-primary-400 transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-primary-400 transition-colors duration-200"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/labs"
                  className="text-gray-300 hover:text-primary-400 transition-colors duration-200"
                >
                  Labs
                </Link>
              </li>
              <li>
                <Link
                  href="/evaluation"
                  className="text-gray-300 hover:text-primary-400 transition-colors duration-200"
                >
                  Evaluation
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-primary-400 transition-colors duration-200"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2 text-gray-300">
              <p>SMU - Mediterranean Institution of Technology</p>
              <p>Tunisia</p>
              <p>Email: info@medtech-vl.edu</p>
              <p>Phone: +216 XX XXX XXX</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>
              &copy; {new Date().getFullYear()} MedTech Virtual Laboratory. All
              rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
