"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { getLabById, labCategories } from "@/lib/data";
import DynamicIcon from "@/components/DynamicIcon";
import QuestionComponent from "@/components/QuestionComponent";
import MathText from "@/components/MathText";
import { StudentAnswer } from "@/lib/types";

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "Beginner":
      return "bg-green-100 text-green-800 border-green-200";
    case "Intermediate":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Advanced":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

export default function LabPage() {
  const params = useParams();
  const labId = params.id as string;
  const lab = getLabById(labId);
  const [answers, setAnswers] = useState<Record<string, StudentAnswer>>({});

  const handleAnswerChange = (
    questionId: string,
    answer: Partial<StudentAnswer>,
  ) => {
    if (!lab) return;

    setAnswers((prev) => {
      const existingAnswer = prev[questionId];
      const questionType =
        lab.questions?.find((q) => q.id === questionId)?.type || "text";

      const newAnswer: StudentAnswer = {
        ...existingAnswer,
        id: existingAnswer?.id || questionId + "-answer",
        questionId,
        studentId: existingAnswer?.studentId || "current-student",
        labId: labId,
        type: questionType,
        submittedAt: new Date(),
        ...answer,
      };

      return {
        ...prev,
        [questionId]: newAnswer,
      };
    });
  };

  if (!lab) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Lab Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The laboratory you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/labs"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200"
          >
            Back to Labs
          </Link>
        </div>
      </div>
    );
  }

  const category = labCategories.find((cat) => cat.id === lab.category);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <nav className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/labs" className="text-gray-500 hover:text-gray-700">
              Labs
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">
              <MathText text={lab.title} inline />
            </span>
          </div>
        </div>
      </nav>

      {/* Lab Header */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full font-medium">
                  {category?.name}
                </span>
                <span
                  className={`px-3 py-1 border text-sm rounded-full font-medium ${getDifficultyColor(
                    lab.difficulty,
                  )}`}
                >
                  {lab.difficulty}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {lab.title}
              </h1>

              <p className="text-lg text-gray-600 mb-6">{lab.description}</p>

              <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-2">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Duration: {lab.duration}</span>
                </div>
                <div className="flex items-center gap-2">
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
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <span>{lab.topics.length} Topics</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {lab.topics.map((topic, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {topic}
                  </span>
                ))}
              </div>

              {(lab.metadata?.course ||
                lab.metadata?.institution ||
                lab.metadata?.term ||
                lab.metadata?.level) && (
                <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    Lab Details
                  </h3>
                  <div className="space-y-1 text-sm text-gray-700">
                    {lab.metadata?.sourceTitle && (
                      <p>
                        <span className="font-medium">Title:</span>{" "}
                        {lab.metadata.sourceTitle}
                      </p>
                    )}
                    {lab.metadata?.course && (
                      <p>
                        <span className="font-medium">Course:</span>{" "}
                        {lab.metadata.course}
                      </p>
                    )}
                    {lab.metadata?.level && (
                      <p>
                        <span className="font-medium">Level:</span>{" "}
                        {lab.metadata.level}
                      </p>
                    )}
                    {lab.metadata?.institution && (
                      <p>
                        <span className="font-medium">Institution:</span>{" "}
                        {lab.metadata.institution}
                      </p>
                    )}
                    {(lab.metadata?.term || lab.metadata?.academicYear) && (
                      <p>
                        <span className="font-medium">Term:</span>{" "}
                        {[lab.metadata.term, lab.metadata.academicYear]
                          .filter(Boolean)
                          .join(" / ")}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:w-80">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Learning Objectives
                </h3>
                <ul className="space-y-2">
                  {lab.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
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
                      <span className="text-sm text-gray-700">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simulation Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-primary-600 text-white px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Interactive Simulation
                </h2>
                <div className="flex items-center gap-4">
                  <span className="text-primary-200 text-sm">
                    Powered by MedTech Virtual Labs
                  </span>
                </div>
              </div>
            </div>

            <div className="relative">
              <iframe
                src={lab.phetUrl}
                className="w-full h-[600px] border-0"
                title={lab.title}
                allow="fullscreen"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Lab Questions Section */}
      {lab.questions && lab.questions.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Lab Assessment
              </h2>
              <p className="text-gray-600">
                Complete the following questions based on your observations from
                the simulation.
              </p>
            </div>

            <div className="space-y-8">
              {lab.questions.map((question, index) => (
                <div key={question.id} className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        <MathText text={question.title} inline />
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {question.sourceLabel && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                            <MathText text={question.sourceLabel} inline />
                          </span>
                        )}
                        {question.responseFormat && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                            <MathText text={question.responseFormat} inline />
                          </span>
                        )}
                      </div>
                      <MathText
                        text={question.description}
                        className="text-gray-600 text-sm mb-4"
                      />
                    </div>
                  </div>
                  <QuestionComponent
                    question={question}
                    onAnswerChange={(answer) =>
                      handleAnswerChange(question.id, answer)
                    }
                    answer={answers[question.id]}
                  />
                </div>
              ))}

              <div className="flex justify-center pt-4">
                <button
                  onClick={() => {
                    alert("Progress saved successfully!");
                  }}
                  className="bg-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center gap-2"
                >
                  <DynamicIcon name="Save" size={20} />
                  Save Progress
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Instructions and Tips */}
      <section className="py-12 bg-gray-50" id="details">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-xl shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Lab Instructions
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Explore the Interface
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Familiarize yourself with the simulation controls and
                      available parameters.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Experiment with Variables
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Modify different parameters and observe how they affect
                      the system behavior.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Record Observations
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Take note of patterns, relationships, and any unexpected
                      results.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Test Your Understanding
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Try to predict outcomes before running experiments to test
                      your comprehension.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Tips for Success
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-yellow-500 mt-0.5 flex-shrink-0"
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
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Start Simple
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Begin with basic scenarios before exploring more complex
                      situations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-blue-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Take Notes
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Document your findings and any questions that arise during
                      experimentation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Repeat Experiments
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Don&apos;t hesitate to repeat experiments with different
                      parameters to verify results.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-purple-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Ask Questions
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Use unexpected results as learning opportunities to deepen
                      your understanding.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-8 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <Link
              href="/labs"
              className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to All Labs
            </Link>

            <Link
              href="/evaluation"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 text-center"
            >
              Complete Lab Evaluation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
