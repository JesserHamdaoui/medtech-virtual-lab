import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                About Our Virtual Laboratory
              </h1>
              <p className="text-xl text-primary-100 mb-8">
                Discover how we&apos;re revolutionizing STEM education through
                innovative virtual laboratory experiences at SMU Mediterranean
                School of Business.
              </p>
              <div className="flex items-center gap-4">
                <Image
                  src="/images/medtech-logo.png"
                  alt="MedTech Logo"
                  width={60}
                  height={60}
                  className="rounded-lg bg-white/10 p-2"
                />
                <div>
                  <div className="font-semibold text-lg">
                    SMU - Mediterranean Institution of Technology
                  </div>
                  <div className="text-primary-200">
                    South Mediterranean University
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              {/* Hero Image Placeholder */}
              <div className="w-full h-[400px] rounded-2xl shadow-2xl border-2 border-white/30 overflow-hidden relative">
                <Image
                  src="/images/students-reading-book.webp"
                  alt="Students reading and studying physics materials"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                We believe that every student deserves access to high-quality,
                interactive physics education. Our virtual laboratory platform
                bridges the gap between theoretical knowledge and practical
                understanding.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Interactive Learning
                    </h3>
                    <p className="text-gray-600">
                      Hands-on simulations that make abstract concepts tangible
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Accessible Education
                    </h3>
                    <p className="text-gray-600">
                      Available 24/7 from anywhere with an internet connection
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Evidence-Based Learning
                    </h3>
                    <p className="text-gray-600">
                      Built on proven educational research and methodologies
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              {/* Students Learning Placeholder */}
              <div className="w-full h-[400px] rounded-2xl shadow-lg border-2 border-blue-300 overflow-hidden relative">
                <Image
                  src="/images/boy-and-girl-using-bread-board.jpg"
                  alt="Students learning with breadboard electronics"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-primary-600 text-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold">3+</div>
                <div className="text-primary-200">Virtual Labs</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ... keep the rest of your sections unchanged ... */}

      {/* Call to Action */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Our Educational Revolution
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Experience the future of STEM education with our virtual laboratory
            platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/labs"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-200"
            >
              Start Learning
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
