"use client";

import { FormEvent, useMemo, useState } from "react";
import { LabQuestion, StudentAnswer } from "@/lib/types";
import {
  LAB_ASSISTANT_CONTROL_EVENT,
  LabAssistantControlDetail,
} from "./events";

type ChatRole = "user" | "assistant";

interface ChatMessage {
  role: ChatRole;
  content: string;
}

interface LabAssistantChatProps {
  labId: string;
  labTitle: string;
  objectives: string[];
  questionTitles: string[];
  questions: LabQuestion[];
  answers: StudentAnswer[];
}

export default function LabAssistantChat({
  labId,
  labTitle,
  objectives,
  questionTitles,
  questions,
  answers,
}: LabAssistantChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I’m your lab guide. I can help you plan experiments, interpret trends, and think through questions step-by-step — but I won’t provide direct final answers.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const quickPrompts = useMemo(
    () => [
      "Help me choose 3 experiments to run first.",
      "What variables should I change one-by-one?",
      "Can you check if my reasoning is complete without giving the answer?",
    ],
    [],
  );

  const submit = async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || isLoading) return;

    setError(null);
    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/labs/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          labId,
          labTitle,
          objectives,
          questionTitles,
          questions,
          answers,
          messages: nextMessages,
        }),
      });

      const data = (await response.json()) as {
        reply?: string;
        error?: string;
        controlAction?: Record<string, unknown> | null;
        controlApplied?: boolean;
        controlError?: string | null;
      };

      if (!response.ok || !data.reply) {
        throw new Error(data.error || "Assistant request failed");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply! },
      ]);

      if (data.controlApplied && data.controlAction) {
        const detail: LabAssistantControlDetail = {
          labId,
          action: data.controlAction,
          at: Date.now(),
        };

        window.dispatchEvent(
          new CustomEvent<LabAssistantControlDetail>(
            LAB_ASSISTANT_CONTROL_EVENT,
            { detail },
          ),
        );
      }

      if (data.controlError) {
        setError(data.controlError);
      }
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Could not reach assistant";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submit(input);
  };

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-primary-600 text-white px-6 py-4">
            <h2 className="text-xl font-semibold">AI Lab Assistant</h2>
            <p className="text-primary-100 text-sm mt-1">
              Guided support for {labTitle}: experiment planning, reasoning
              checks, and concept discovery.
            </p>
          </div>

          <div className="p-4 md:p-6 space-y-4">
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900">
              This assistant does not provide final direct answers to graded lab
              questions.
            </div>

            <div className="h-80 overflow-y-auto border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`max-w-[90%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                    message.role === "user"
                      ? "ml-auto bg-primary-600 text-white"
                      : "mr-auto bg-white border border-gray-200 text-gray-800"
                  }`}
                >
                  {message.content}
                </div>
              ))}
              {isLoading && (
                <div className="mr-auto bg-white border border-gray-200 text-gray-500 rounded-lg px-3 py-2 text-sm">
                  Thinking...
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => submit(prompt)}
                  disabled={isLoading}
                  className="text-xs md:text-sm border border-primary-200 text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-full px-3 py-1 transition-colors disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <form onSubmit={onSubmit} className="space-y-2">
              <label htmlFor="lab-assistant-input" className="sr-only">
                Ask the lab assistant
              </label>
              <textarea
                id="lab-assistant-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask for hints, experiment ideas, or reasoning feedback..."
                className="w-full min-h-24 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 p-3 text-sm"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  Tip: Share your observation first, then ask what to test next.
                </p>
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </form>

            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
