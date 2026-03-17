"use client";

import { useState } from "react";
import Link from "next/link";

interface Question {
  id: string;
  question: string;
  type: "multiple-choice" | "scale" | "text";
  options?: string[];
  required?: boolean;
}

const evaluationQuestions: Question[] = [
  {
    id: "overall-satisfaction",
    question:
      "How would you rate your overall satisfaction with the virtual laboratory experience?",
    type: "scale",
    required: true,
  },
  {
    id: "ease-of-use",
    question:
      "How easy was it to navigate and use the virtual laboratory platform?",
    type: "scale",
    required: true,
  },
  {
    id: "learning-effectiveness",
    question:
      "How effective were the virtual labs in helping you understand physics concepts?",
    type: "scale",
    required: true,
  },
  {
    id: "favorite-lab",
    question: "Which virtual laboratory did you find most engaging?",
    type: "multiple-choice",
    options: [
      "Collision Lab",
      "Projectile Motion",
      "Pendulum Lab",
      "Wave on a String",
      "Sound Waves",
      "Circuit Construction Kit",
      "Charges and Fields",
      "Energy Forms and Changes",
      "Geometric Optics",
      "Bending Light",
    ],
    required: true,
  },
  {
    id: "technical-issues",
    question:
      "Did you experience any technical issues while using the platform?",
    type: "multiple-choice",
    options: [
      "No issues",
      "Slow loading times",
      "Simulation not working properly",
      "Navigation problems",
      "Mobile compatibility issues",
      "Other",
    ],
    required: true,
  },
  {
    id: "improvement-suggestions",
    question:
      "What suggestions do you have for improving the virtual laboratory experience?",
    type: "text",
    required: false,
  },
  {
    id: "recommend",
    question:
      "Would you recommend this virtual laboratory platform to other students?",
    type: "multiple-choice",
    options: [
      "Definitely yes",
      "Probably yes",
      "Maybe",
      "Probably no",
      "Definitely no",
    ],
    required: true,
  },
  {
    id: "additional-features",
    question:
      "What additional features would you like to see in future updates?",
    type: "text",
    required: false,
  },
];

export default function EvaluationPage() {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const isFormValid = () => {
    const requiredQuestions = evaluationQuestions.filter((q) => q.required);
    return requiredQuestions.every(
      (q) => responses[q.id] && responses[q.id].trim() !== "",
    );
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            Your feedback has been submitted successfully. Your input helps us
            improve the virtual laboratory experience for all students.
          </p>
          <Link
            href="/labs"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 inline-block"
          >
            Continue Learning
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Laboratory Experience Evaluation
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your feedback is valuable to us. Please take a few minutes to
            evaluate your experience with our virtual laboratory platform. Your
            responses will help us improve and enhance the learning experience
            for all students.
          </p>
        </div>
      </div>

      {/* Evaluation Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-primary-600 text-white px-8 py-6">
            <h2 className="text-2xl font-semibold">Evaluation Form</h2>
            <p className="text-primary-100 mt-2">
              Fields marked with * are required
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {evaluationQuestions.map((question, index) => (
              <div
                key={question.id}
                className="border-b border-gray-200 pb-8 last:border-b-0"
              >
                <label className="block text-lg font-medium text-gray-900 mb-4">
                  {index + 1}. {question.question}
                  {question.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>

                {question.type === "scale" && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                      <span>Very Poor</span>
                      <span>Excellent</span>
                    </div>
                    <div className="flex gap-4">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <label
                          key={value}
                          className="flex flex-col items-center cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={question.id}
                            value={value.toString()}
                            onChange={(e) =>
                              handleResponseChange(question.id, e.target.value)
                            }
                            className="w-4 h-4 text-primary-600 focus:ring-primary-500 focus:ring-2"
                          />
                          <span className="mt-2 text-sm font-medium">
                            {value}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {question.type === "multiple-choice" && (
                  <div className="space-y-3">
                    {question.options?.map((option) => (
                      <label
                        key={option}
                        className="flex items-center cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={option}
                          onChange={(e) =>
                            handleResponseChange(question.id, e.target.value)
                          }
                          className="w-4 h-4 text-primary-600 focus:ring-primary-500 focus:ring-2"
                        />
                        <span className="ml-3 text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {question.type === "text" && (
                  <textarea
                    rows={4}
                    placeholder="Please share your thoughts..."
                    value={responses[question.id] || ""}
                    onChange={(e) =>
                      handleResponseChange(question.id, e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-vertical"
                  />
                )}
              </div>
            ))}

            {/* Submit Section */}
            <div className="pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="text-sm text-gray-500">
                  Your responses are anonymous and will be used solely for
                  improving our platform.
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!isFormValid() || isSubmitting}
                    className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="w-4 h-4 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      "Submit Evaluation"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Additional Information */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-blue-50 rounded-xl p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-blue-600"
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
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Your Privacy Matters
              </h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                All responses are collected anonymously and are used exclusively
                for improving our virtual laboratory platform. We do not share
                individual responses with third parties, and your feedback helps
                us create better learning experiences for all students at SMU
                Mediterranean Institution of Technology.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
