"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { labCategories, labs, searchLabs } from "@/lib/data";
import DynamicIcon from "@/components/DynamicIcon";
import type { Lab } from "@/lib/types";

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "Beginner":
      return "bg-green-100 text-green-800";
    case "Intermediate":
      return "bg-yellow-100 text-yellow-800";
    case "Advanced":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function LabCard({ lab }: { lab: Lab }) {
  const getLabImage = (category: string) => {
    const images = {
      mechanics: "/images/boy-using-oscilloscope.png",
      waves: "/images/students-reading-book.webp",
      electricity: "/images/girl-using-bread-board.png",
      default: "/images/students.webp",
    };
    return images[category as keyof typeof images] || images.default;
  };

  const cardImage = lab.thumbnail || getLabImage(lab.category);

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {/* Lab Preview Image Placeholder */}
      <div className="w-full h-48 border-2 border-gray-200 overflow-hidden relative">
        <Image
          src={cardImage}
          alt={`${lab.title} preview image`}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{lab.title}</h3>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
              lab.difficulty,
            )}`}
          >
            {lab.difficulty}
          </span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-3">{lab.description}</p>

        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
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
            {lab.duration}
          </div>
          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            {lab.topics.length} topics
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {lab.topics.slice(0, 3).map((topic, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full"
            >
              {topic}
            </span>
          ))}
          {lab.topics.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{lab.topics.length - 3} more
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <Link
            href={`/labs/${lab.id}`}
            className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 text-center"
          >
            Start Lab
          </Link>
          <Link
            href={`/labs/${lab.id}#details`}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LabsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLabs = useMemo(() => {
    let filtered = labs;

    if (searchQuery) {
      filtered = searchLabs(searchQuery);
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((lab) => lab.category === selectedCategory);
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

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

      {/* Search and Filter Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="flex-1">
                <label
                  htmlFor="search"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Search Labs
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    placeholder="Search by title, description, or topic..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <svg
                    className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Category Filter */}
              <div className="lg:w-64">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Category
                </label>
                <select
                  id="category"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {labCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Category Buttons */}
            <div className="mt-6">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    selectedCategory === "all"
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                {labCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      selectedCategory === category.id
                        ? "bg-primary-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Labs Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredLabs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No labs found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search criteria or category filter.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory === "all"
                    ? `All Labs (${filteredLabs.length})`
                    : `${
                        labCategories.find((cat) => cat.id === selectedCategory)
                          ?.name
                      } Labs (${filteredLabs.length})`}
                </h2>
                <div className="text-sm text-gray-500">
                  {searchQuery && `Showing results for "${searchQuery}"`}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLabs.map((lab) => (
                  <LabCard key={lab.id} lab={lab} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Categories Overview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Laboratory Categories
            </h2>
            <p className="text-xl text-gray-600">
              Explore different areas of physics through specialized virtual
              laboratories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {labCategories.map((category) => {
              const categoryLabs = labs.filter(
                (lab) => lab.category === category.id,
              );
              return (
                <div
                  key={category.id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className="w-16 h-16 bg-primary-100 flex items-center justify-center mb-4">
                    <DynamicIcon
                      name={category.icon}
                      size="xl"
                      className="text-primary-600"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {categoryLabs.length} labs
                    </span>
                    <span className="text-primary-600 font-medium hover:text-primary-700">
                      Explore →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
