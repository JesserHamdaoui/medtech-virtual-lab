import Image from "next/image";
import { labCategories, labs } from "@/lib/data";
import LabsExplorer from "@/components/labs/LabsExplorer";

export default function LabsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Virtual Physics Laboratories
              </h1>
              <p className="text-xl text-primary-100 mb-8">
                Explore interactive physics simulations designed to enhance your
                understanding of fundamental concepts through hands-on
                experimentation.
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold">{labs.length}</div>
                  <div className="text-primary-200 text-sm">
                    Interactive Labs
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold">
                    {labCategories.length}
                  </div>
                  <div className="text-primary-200 text-sm">Categories</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">∞</div>
                  <div className="text-primary-200 text-sm">Attempts</div>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Labs Hero Placeholder */}
              <div className="w-full h-80 rounded-2xl shadow-2xl border-2 border-white/30 overflow-hidden relative">
                <Image
                  src="/images/students.webp"
                  alt="Laboratory equipment and practical experiment"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Floating lab preview cards */}
              <div className="absolute -bottom-6 left-6 bg-white p-3 rounded-lg shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-blue-600"
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
                  <div>
                    <div className="text-xs font-semibold text-gray-800">
                      Mechanics
                    </div>
                    <div className="text-xs text-gray-600">Interactive</div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-white p-3 rounded-lg shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-800">
                      Physics
                    </div>
                    <div className="text-xs text-gray-600">Simulations</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LabsExplorer />
    </div>
  );
}
