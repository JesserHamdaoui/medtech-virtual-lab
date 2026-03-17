"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import DynamicIcon from "@/components/DynamicIcon";

const testimonials = [
  {
    name: "Sarra Attabai",
    initials: "S",
    color: "primary",
    rating: 5,
    quote: "I'm so happy and proud with this improvement in phy lab.",
  },
  {
    name: "Mohamed Rayen Chelly",
    initials: "M",
    color: "green",
    rating: 5,
    quote:
      "No suggestions, the lab was smooth and easy, had no problem and really enjoyed them.",
  },
  {
    name: "Balkis Fatma Soudani",
    initials: "B",
    color: "blue",
    rating: 4,
    quote:
      "The lab instruction was so beneficial it helped me understand more in the lecture session.",
  },
  {
    name: "Yassine El Gares",
    initials: "Y",
    color: "purple",
    rating: 5,
    quote: "Make all labs have a virtual section included.",
  },
];

const avatarColorMap = {
  primary: {
    bg: "bg-primary-100",
    text: "text-primary-600",
  },
  green: {
    bg: "bg-green-100",
    text: "text-green-600",
  },
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-600",
  },
  purple: {
    bg: "bg-purple-100",
    text: "text-purple-600",
  },
} as const;

export default function HomePage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const current = testimonials[activeTestimonial];
  const avatarColors =
    avatarColorMap[current.color as keyof typeof avatarColorMap];

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Virtual Laboratory
                <span className="block text-primary-200">
                  for STEM Education
                </span>
              </h1>
              <p className="text-xl mb-8 text-primary-100">
                Explore interactive physics simulations and enhance your
                learning experience at SMU Mediterranean Institution of
                Technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/labs"
                  className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-200 text-center"
                >
                  Explore Labs
                </Link>
                <Link
                  href="/about"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors duration-200 text-center"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="relative">
              {/* Hero Image Placeholder */}
              <div className="w-full h-[400px] rounded-2xl shadow-2xl border-2 border-primary-300 overflow-hidden relative">
                <Image
                  src="/images/boy-using-oscilloscope.png"
                  alt="Student using laboratory oscilloscope"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Live Learning
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* University Branding Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                SMU Mediterranean Institution of Technology
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Leading innovation in STEM education through virtual learning
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary-50 border border-primary-100 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-primary-700">3+</div>
                  <div className="text-sm text-gray-600">Virtual Labs</div>
                </div>
                <div className="bg-green-50 border border-green-100 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-green-700">24/7</div>
                  <div className="text-sm text-gray-600">Platform Access</div>
                </div>
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-blue-700">100%</div>
                  <div className="text-sm text-gray-600">Safe Experiments</div>
                </div>
                <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-purple-700">Live</div>
                  <div className="text-sm text-gray-600">Interactive Sims</div>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block h-64">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-100 to-blue-100" />
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur rounded-xl p-4 shadow-lg border border-white">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary-600 rounded-full flex items-center justify-center text-white">
                    <DynamicIcon name="Research" size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Hands-on Learning
                    </p>
                    <p className="text-xs text-gray-600">
                      Experiment virtually in real time
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur rounded-xl p-4 shadow-lg border border-white">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-green-600 rounded-full flex items-center justify-center text-white">
                    <DynamicIcon name="ChartLine" size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Better Outcomes
                    </p>
                    <p className="text-xs text-gray-600">
                      Track progress and growth
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Campus Image Placeholder */}
            <div className="group cursor-pointer">
              <div className="w-full h-48 rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-200 border-2 border-gray-200 overflow-hidden relative">
                <Image
                  src="/images/medtech-building.jpg"
                  alt="SMU MedTech campus building"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Students Image Placeholder */}
            <div className="group cursor-pointer">
              <div className="w-full h-48 rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-200 border-2 border-green-300 overflow-hidden relative">
                <Image
                  src="/images/students.webp"
                  alt="Students collaborating in a learning environment"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Technology Image Placeholder */}
            <div className="group cursor-pointer">
              <div className="w-full h-48 rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-200 border-2 border-purple-300 overflow-hidden relative">
                <Image
                  src="/images/girl-using-bread-board.png"
                  alt="Student using lab technology"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Virtual Labs?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform provides cutting-edge virtual laboratory experiences
              designed to enhance your understanding of physics concepts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow duration-200">
              <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Interactive Simulations
              </h3>
              <p className="text-gray-600">
                Engage with realistic physics simulations that respond to your
                inputs and help visualize complex concepts.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow duration-200">
              <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Comprehensive Curriculum
              </h3>
              <p className="text-gray-600">
                Access a wide range of physics topics and experiments aligned
                with academic standards and learning objectives.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow duration-200">
              <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Progress Tracking
              </h3>
              <p className="text-gray-600">
                Monitor your learning progress with detailed analytics and
                performance tracking across all experiments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Our Platform Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Virtual Laboratory?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of STEM education with cutting-edge
              technology and proven pedagogical methods
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border border-blue-200">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Interactive Simulations
              </h3>
              <p className="text-gray-600 mb-4">
                Hands-on physics experiments with real-time feedback and
                unlimited trial attempts.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  PhET-powered simulations
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  Real-time data visualization
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  Risk-free experimentation
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border border-green-200">
              <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                24/7 Accessibility
              </h3>
              <p className="text-gray-600 mb-4">
                Learn at your own pace, anytime, anywhere with our cloud-based
                platform.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                  Cross-device compatibility
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                  No software installation
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                  Auto-save progress
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl border border-purple-200">
              <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Progress Analytics
              </h3>
              <p className="text-gray-600 mb-4">
                Track your learning journey with detailed insights and
                performance metrics.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                  Detailed performance reports
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                  Learning path recommendations
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                  Competency mapping
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Student Success Stories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Student Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              See how our virtual laboratory is transforming STEM education
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-md">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={prevTestimonial}
                  className="w-10 h-10 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 flex items-center justify-center transition-colors"
                  aria-label="Previous testimonial"
                >
                  <DynamicIcon name="ArrowLeft" size={14} />
                </button>

                <div className="flex items-center">
                  <div
                    className={`w-12 h-12 ${avatarColors.bg} rounded-full flex items-center justify-center`}
                  >
                    <span className={`${avatarColors.text} font-bold text-lg`}>
                      {current.initials}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">
                      {current.name}
                    </h4>
                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <DynamicIcon
                          key={index}
                          name="Star"
                          size={14}
                          className={
                            index < current.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={nextTestimonial}
                  className="w-10 h-10 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 flex items-center justify-center transition-colors"
                  aria-label="Next testimonial"
                >
                  <DynamicIcon name="ArrowRight" size={14} />
                </button>
              </div>

              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                &ldquo;{current.quote}&rdquo;
              </p>

              <div className="flex items-center justify-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === activeTestimonial
                        ? "w-8 bg-primary-600"
                        : "w-2 bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Learning Experience?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already experiencing the future
            of STEM education with our interactive virtual laboratories.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/labs"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Start Exploring Labs
            </Link>
            <Link
              href="/about"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Learn More
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">3+</div>
              <div className="text-primary-200">Interactive Labs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-primary-200">Access Anytime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">100%</div>
              <div className="text-primary-200">Safe Learning</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
