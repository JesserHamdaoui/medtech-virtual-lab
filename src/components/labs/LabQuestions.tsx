"use client";

import { useState } from "react";
import QuestionComponent from "@/components/QuestionComponent";
import MathText from "@/components/MathText";
import DynamicIcon from "@/components/DynamicIcon";
import { StudentAnswer, LabQuestion } from "@/lib/types";

interface LabQuestionsProps {
  labId: string;
  questions: LabQuestion[];
}

export default function LabQuestions({ labId, questions }: LabQuestionsProps) {
  const [answers, setAnswers] = useState<Record<string, StudentAnswer>>({});

  const handleAnswerChange = (
    questionId: string,
    answer: Partial<StudentAnswer>,
  ) => {
    setAnswers((prev) => {
      const existingAnswer = prev[questionId];
      const questionType =
        questions.find((q) => q.id === questionId)?.type || "text";

      const newAnswer: StudentAnswer = {
        ...existingAnswer,
        id: existingAnswer?.id || questionId + "-answer",
        questionId,
        studentId: existingAnswer?.studentId || "current-student",
        labId,
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

  return (
    <div className="space-y-8">
      {questions.map((question, index) => (
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
            onAnswerChange={(answer) => handleAnswerChange(question.id, answer)}
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
  );
}
