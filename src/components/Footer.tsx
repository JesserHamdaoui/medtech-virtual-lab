import Link from "next/link";
import DynamicIcon from "./DynamicIcon";

export default function Footer() {
  const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/labs", label: "Labs" },
    { href: "/evaluation", label: "Evaluation" },
    { href: "/contact", label: "Contact" },
  ];

  const emails = [
    "rim.gharbi@medtech.tn",
    "jesser.hamdaoui@medtech.tn",
    "rim.gouia@medtech.tn",
  ];

  const phones = ["(+216) 70 016 100", "(+216) 28 434 328"];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h3 className="mb-4 text-xl font-bold text-primary-400">
              MedTech Virtual Laboratory
            </h3>
            <p className="mb-6 max-w-xl text-gray-300">
              Empowering STEM education through interactive virtual laboratories
              at SMU (Mediterranean Institution of Technology). Explore physics
              simulations and enhance your learning experience.
            </p>
            <div className="space-y-3 text-sm text-gray-300">
              <p>SMU - Mediterranean Institution of Technology</p>
              <p>South Mediterranean University, Tunisia</p>
              <p>Fax: (+216) 70 018 600</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://www.facebook.com/medtech.tn/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-gray-300 transition-colors duration-200 hover:bg-primary-600 hover:text-white"
                aria-label="Visit MedTech Facebook page"
              >
                <DynamicIcon name="LogoFacebook" size={18} />
              </a>
              <a
                href="https://www.linkedin.com/company/medtech/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-gray-300 transition-colors duration-200 hover:bg-primary-600 hover:text-white"
                aria-label="Visit MedTech LinkedIn page"
              >
                <DynamicIcon name="LogoLinkedin" size={18} />
              </a>
              <a
                href="https://www.smu.tn/medtech"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-gray-300 transition-colors duration-200 hover:bg-primary-600 hover:text-white"
                aria-label="Visit MedTech website"
              >
                <DynamicIcon name="Globe" size={18} />
              </a>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4 className="mb-4 text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors duration-200 hover:text-primary-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h4 className="mb-4 text-lg font-semibold">Contact</h4>
            <div className="space-y-5 text-gray-300">
              <div>
                <p className="mb-2 font-medium text-white">Email</p>
                <ul className="space-y-2 text-sm">
                  {emails.map((email) => (
                    <li key={email}>
                      <a
                        href={`mailto:${email}`}
                        className="transition-colors duration-200 hover:text-primary-400"
                      >
                        {email}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="mb-2 font-medium text-white">Phone</p>
                <ul className="space-y-2 text-sm">
                  {phones.map((phone) => (
                    <li key={phone}>
                      <a
                        href={`tel:${phone.replace(/[^+\d]/g, "")}`}
                        className="transition-colors duration-200 hover:text-primary-400"
                      >
                        {phone}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8 text-gray-400">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <p>
              &copy; {new Date().getFullYear()} MedTech Virtual Laboratory. All
              rights reserved.
            </p>
            <p className="text-sm text-gray-500">
              Built for SMU Mediterranean Institution of Technology.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
