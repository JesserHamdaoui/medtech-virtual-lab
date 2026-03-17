"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import DynamicIcon from "./DynamicIcon";

const navItems = [
  { name: "Home", href: "/", icon: "Home" },
  { name: "About", href: "/about", icon: "Information" },
  { name: "Labs", href: "/labs", icon: "Research" },
  { name: "Contact", href: "/contact", icon: "Email" },
];

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/images/medtech-logo.png"
              alt="MedTech Virtual Laboratory"
              width={120}
              height={120}
              className="rounded-lg"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                <DynamicIcon name={item.icon} size={16} />
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button & user menu */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none focus:text-primary-600"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <DynamicIcon name="Close" size={24} />
              ) : (
                <DynamicIcon name="Menu" size={24} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-600 px-3 py-2 text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <DynamicIcon name={item.icon} size={16} />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
