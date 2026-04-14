import { NextResponse } from "next/server";

interface IncomingMessage {
  role: "user" | "assistant";
  content: string;
}

interface AssistantRequest {
  labId: string;
  labTitle: string;
  objectives: string[];
  questionTitles: string[];
  questions: unknown[];
  answers: unknown[];
  messages: IncomingMessage[];
}

interface AssistantServiceResponse {
  reply?: string;
  controlAction?: Record<string, unknown> | null;
  controlApplied?: boolean;
  controlError?: string | null;
}

const FALLBACK_REPLY =
  "I can help you reason through the lab. Tell me one observation you made, and I’ll suggest the next variable to test. I won’t provide direct final answers.";

function normalizeAssistantServiceUrl(rawUrl: string) {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return trimmed;
  }

  return trimmed.replace("http://localhost:", "http://127.0.0.1:");
}

function buildAssistantUrlCandidates(rawUrl: string) {
  const normalized = normalizeAssistantServiceUrl(rawUrl).replace(/\/$/, "");
  const candidates = [normalized];

  if (normalized.includes(":8001")) {
    candidates.push(normalized.replace(":8001", ":8111"));
  }

  if (normalized.includes(":8111")) {
    candidates.push(normalized.replace(":8111", ":8001"));
  }

  return Array.from(new Set(candidates));
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<AssistantRequest>;

    if (!body.labId || !body.labTitle || !Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: "Missing required assistant payload" },
        { status: 400 },
      );
    }

    const assistantServiceUrl = process.env.LAB_ASSISTANT_SERVICE_URL;

    if (!assistantServiceUrl) {
      return NextResponse.json(
        {
          error:
            "LAB_ASSISTANT_SERVICE_URL is not configured. Set it in .env.local and restart Next.js.",
        },
        { status: 500 },
      );
    }

    const candidates = buildAssistantUrlCandidates(assistantServiceUrl);
    let response: Response | null = null;
    let lastConnectionError: unknown;

    for (const candidate of candidates) {
      try {
        response = await fetch(`${candidate}/assist`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            labId: body.labId,
            labTitle: body.labTitle,
            objectives: body.objectives || [],
            questionTitles: body.questionTitles || [],
            questions: body.questions || [],
            answers: body.answers || [],
            messages: body.messages,
          }),
          cache: "no-store",
        });

        break;
      } catch (fetchError) {
        lastConnectionError = fetchError;
      }
    }

    if (!response) {
      throw new Error(
        `Could not connect to assistant service. Tried: ${candidates.join(", ")}. Last error: ${
          lastConnectionError instanceof Error
            ? lastConnectionError.message
            : String(lastConnectionError)
        }`,
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          error: `Assistant service returned ${response.status}: ${errorText}`,
        },
        { status: 502 },
      );
    }

    const data = (await response.json()) as AssistantServiceResponse;
    return NextResponse.json({
      reply: data.reply || FALLBACK_REPLY,
      controlAction: data.controlAction ?? null,
      controlApplied: data.controlApplied ?? false,
      controlError: data.controlError ?? null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? `Assistant route failed while connecting to ${process.env.LAB_ASSISTANT_SERVICE_URL}: ${error.message}`
            : "Assistant route failed",
      },
      { status: 500 },
    );
  }
}
