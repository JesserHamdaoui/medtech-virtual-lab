"use client";

import { useState } from "react";
import { labs, labQuestions } from "@/lib/data";
import { LabSubmission } from "@/lib/types";
import DynamicIcon from "@/components/DynamicIcon";
import MathText from "@/components/MathText";

// Mock data for current student's submissions
const mockStudentSubmissions: LabSubmission[] = [
  {
    id: "sub-1",
    studentId: "current-student",
    studentName: "Current Student",
    studentEmail: "current.student@example.com",
    labId: "collision-lab",
    answers: [
      {
        id: "ans-1",
        questionId: "collision-theory",
        studentId: "current-student",
        labId: "collision-lab",
        type: "text",
        textAnswer:
          "In elastic collisions, both momentum and kinetic energy are conserved. In inelastic collisions, only momentum is conserved while kinetic energy is not.",
        submittedAt: new Date("2024-01-15T10:30:00Z"),
        grade: {
          id: "grade-1",
          answerId: "ans-1",
          facultyId: "faculty-1",
          points: 8,
          maxPoints: 10,
          feedback:
            "Good understanding of the concepts. Could elaborate more on energy transfer mechanisms.",
          gradedAt: new Date("2024-01-16T09:15:00Z"),
        },
      },
      {
        id: "ans-2",
        questionId: "collision-data",
        studentId: "current-student",
        labId: "collision-lab",
        type: "table",
        tableAnswer: {
          data: [
            [
              "Mass 1 (kg)",
              "Velocity 1 (m/s)",
              "Mass 2 (kg)",
              "Velocity 2 (m/s)",
              "Final Velocity 1",
              "Final Velocity 2",
            ],
            ["2", "5", "1", "0", "1.67", "6.67"],
            ["3", "4", "2", "-1", "0.8", "5.2"],
            ["1", "8", "1", "2", "2", "8"],
          ],
        },
        submittedAt: new Date("2024-01-15T10:45:00Z"),
        grade: {
          id: "grade-2",
          answerId: "ans-2",
          facultyId: "faculty-1",
          points: 9,
          maxPoints: 10,
          feedback:
            "Excellent data collection and calculations. All values are accurate.",
          gradedAt: new Date("2024-01-16T09:20:00Z"),
        },
      },
      {
        id: "ans-3",
        questionId: "collision-plot",
        studentId: "current-student",
        labId: "collision-lab",
        type: "plot",
        plotAnswer: {
          points: [
            { x: 0, y: 10 },
            { x: 1, y: 8 },
            { x: 2, y: 6 },
            { x: 3, y: 4 },
          ],
        },
        submittedAt: new Date("2024-01-15T10:50:00Z"),
        grade: {
          id: "grade-3",
          answerId: "ans-3",
          facultyId: "faculty-1",
          points: 7,
          maxPoints: 10,
          feedback:
            "Good trend shown but needs more data points for accuracy. Consider adding error bars.",
          gradedAt: new Date("2024-01-16T09:25:00Z"),
        },
      },
    ],
    grades: [],
    totalPoints: 24,
    maxPoints: 30,
    status: "graded",
    submittedAt: new Date("2024-01-15T10:50:00Z"),
    isGraded: true,
  },
  {
    id: "sub-2",
    studentId: "current-student",
    studentName: "Current Student",
    studentEmail: "current.student@example.com",
    labId: "projectile-motion",
    answers: [
      {
        id: "ans-4",
        questionId: "projectile-theory",
        studentId: "current-student",
        labId: "projectile-motion",
        type: "text",
        textAnswer:
          "Projectile motion combines horizontal motion at constant velocity with vertical motion under constant acceleration due to gravity.",
        submittedAt: new Date("2024-01-14T14:20:00Z"),
      },
    ],
    grades: [],
    totalPoints: 0,
    maxPoints: 10,
    status: "submitted",
    submittedAt: new Date("2024-01-14T14:20:00Z"),
    isGraded: false,
  },
];

function getGradeColor(percentage: number) {
  if (percentage >= 90) return "text-green-600 bg-green-100";
  if (percentage >= 80) return "text-blue-600 bg-blue-100";
  if (percentage >= 70) return "text-yellow-600 bg-yellow-100";
  if (percentage >= 60) return "text-orange-600 bg-orange-100";
  return "text-red-600 bg-red-100";
}

function calculateSubmissionGrade(submission: LabSubmission) {
  const gradedAnswers = submission.answers.filter((answer) => answer.grade);
  if (gradedAnswers.length === 0) return null;

  const totalPoints = gradedAnswers.reduce(
    (sum, answer) => sum + (answer.grade?.points || 0),
    0,
  );
  const maxPoints = gradedAnswers.reduce(
    (sum, answer) => sum + (answer.grade?.maxPoints || 0),
    0,
  );

  return {
    points: totalPoints,
    maxPoints,
    percentage: maxPoints > 0 ? (totalPoints / maxPoints) * 100 : 0,
  };
}

export default function StudentGrades() {
  const [selectedSubmission, setSelectedSubmission] =
    useState<LabSubmission | null>(null);
  const [submissions] = useState<LabSubmission[]>(mockStudentSubmissions);

  const gradedSubmissions = submissions.filter((sub) => sub.isGraded);
  const pendingSubmissions = submissions.filter((sub) => !sub.isGraded);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Lab Grades
          </h1>
          <p className="text-gray-600">
            View your completed lab submissions and grades
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DynamicIcon
                  name="Document"
                  size={24}
                  className="text-blue-600"
                />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {submissions.length}
                </h3>
                <p className="text-sm text-gray-600">Total Submissions</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DynamicIcon
                  name="CheckmarkFilled"
                  size={24}
                  className="text-green-600"
                />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {gradedSubmissions.length}
                </h3>
                <p className="text-sm text-gray-600">Graded</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DynamicIcon
                  name="Time"
                  size={24}
                  className="text-yellow-600"
                />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {pendingSubmissions.length}
                </h3>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Submissions List */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">
                  Lab Submissions
                </h2>
              </div>

              <div className="divide-y">
                {submissions.map((submission) => {
                  const lab = labs.find((l) => l.id === submission.labId);
                  const grade = calculateSubmissionGrade(submission);

                  return (
                    <div
                      key={submission.id}
                      onClick={() => setSelectedSubmission(submission)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedSubmission?.id === submission.id
                          ? "bg-primary-50 border-r-4 border-primary-500"
                          : ""
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {lab?.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Submitted:{" "}
                            {submission.submittedAt.toLocaleDateString()}
                          </p>
                          {grade && (
                            <p className="text-sm text-gray-600 mt-1">
                              Score: {grade.points}/{grade.maxPoints} (
                              {grade.percentage.toFixed(1)}%)
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {submission.isGraded ? (
                            <>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <DynamicIcon
                                  name="CheckmarkFilled"
                                  size={12}
                                  className="mr-1"
                                />
                                Graded
                              </span>
                              {grade && (
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-bold ${getGradeColor(
                                    grade.percentage,
                                  )}`}
                                >
                                  {grade.percentage.toFixed(0)}%
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <DynamicIcon
                                name="Time"
                                size={12}
                                className="mr-1"
                              />
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Grade Detail Panel */}
          <div>
            {selectedSubmission ? (
              <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {
                          labs.find((l) => l.id === selectedSubmission.labId)
                            ?.title
                        }
                      </h2>
                      <p className="text-gray-600">
                        Submitted:{" "}
                        {selectedSubmission.submittedAt.toLocaleDateString()}
                      </p>
                    </div>
                    {selectedSubmission.isGraded && (
                      <div className="text-right">
                        {(() => {
                          const grade =
                            calculateSubmissionGrade(selectedSubmission);
                          return grade ? (
                            <div>
                              <div
                                className={`inline-flex px-3 py-1 rounded-full text-lg font-bold ${getGradeColor(
                                  grade.percentage,
                                )}`}
                              >
                                {grade.percentage.toFixed(0)}%
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {grade.points}/{grade.maxPoints} points
                              </p>
                            </div>
                          ) : null;
                        })()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  {selectedSubmission.isGraded ? (
                    <div className="space-y-6">
                      {selectedSubmission.answers.map((answer, index) => {
                        const question = labQuestions.find(
                          (q) => q.id === answer.questionId,
                        );
                        if (!question) return null;

                        return (
                          <div
                            key={answer.id}
                            className="border border-gray-200 rounded-lg p-6"
                          >
                            <div className="flex items-start gap-4 mb-4">
                              <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                  <MathText text={question.title} inline />
                                </h3>
                                <MathText
                                  text={question.description}
                                  className="text-gray-600 text-sm"
                                />
                              </div>
                              {answer.grade && (
                                <div className="text-right">
                                  <div
                                    className={`inline-flex px-2 py-1 rounded-full text-sm font-bold ${getGradeColor(
                                      (answer.grade.points /
                                        answer.grade.maxPoints) *
                                        100,
                                    )}`}
                                  >
                                    {answer.grade.points}/
                                    {answer.grade.maxPoints}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Display the answer */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">
                                Your Answer:
                              </h4>
                              {answer.type === "text" && answer.textAnswer && (
                                <p className="text-sm text-gray-800">
                                  {answer.textAnswer}
                                </p>
                              )}
                              {answer.type === "table" &&
                                answer.tableAnswer && (
                                  <div className="overflow-x-auto">
                                    <table className="min-w-full border border-gray-300">
                                      <tbody>
                                        {answer.tableAnswer.data.map(
                                          (row, rowIndex) => (
                                            <tr key={rowIndex}>
                                              {row.map((cell, cellIndex) => (
                                                <td
                                                  key={cellIndex}
                                                  className={`border border-gray-300 px-3 py-2 text-sm ${
                                                    rowIndex === 0
                                                      ? "bg-gray-100 font-medium"
                                                      : "bg-white"
                                                  }`}
                                                >
                                                  {cell}
                                                </td>
                                              ))}
                                            </tr>
                                          ),
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              {answer.type === "plot" && answer.plotAnswer && (
                                <div className="bg-white border rounded p-4">
                                  <svg
                                    width="300"
                                    height="200"
                                    className="border"
                                  >
                                    {answer.plotAnswer.points.map(
                                      (point, i) => (
                                        <circle
                                          key={i}
                                          cx={point.x * 30 + 30}
                                          cy={200 - (point.y * 15 + 30)}
                                          r="4"
                                          fill="#3B82F6"
                                        />
                                      ),
                                    )}
                                  </svg>
                                </div>
                              )}
                            </div>

                            {/* Display feedback if available */}
                            {answer.grade && answer.grade.feedback && (
                              <div className="border-t pt-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                  Faculty Feedback:
                                </h4>
                                <p className="text-sm text-gray-800 bg-blue-50 p-3 rounded-lg">
                                  {answer.grade.feedback}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <DynamicIcon
                        name="Time"
                        size={48}
                        className="mx-auto mb-4 text-gray-300"
                      />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Grading in Progress
                      </h3>
                      <p className="text-gray-600">
                        Your submission is being reviewed by faculty. Check back
                        later for your grade.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                <DynamicIcon
                  name="ChartLine"
                  size={48}
                  className="mx-auto mb-4 text-gray-300"
                />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a Submission
                </h3>
                <p className="text-gray-600">
                  Choose a lab submission from the list to view your grades and
                  feedback
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
