/**
 * Azure OpenAI REST client — thin wrapper around fetch.
 * No SDK dependency required.
 */

const AZURE_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT ?? "";
const AZURE_KEY = process.env.AZURE_OPENAI_API_KEY ?? "";
const AZURE_DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT ?? "gpt-5.1";
const AZURE_API_VERSION = "2025-03-01-preview";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface AzureCompletionOptions {
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  responseFormat?: { type: "json_object" | "text" };
}

interface AzureChatChoice {
  index: number;
  message: { role: string; content: string };
  finish_reason: string;
}

interface AzureChatResponse {
  id: string;
  choices: AzureChatChoice[];
  usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
}

function buildUrl(): string {
  const base = AZURE_ENDPOINT.replace(/\/+$/, "");
  return `${base}/openai/deployments/${AZURE_DEPLOYMENT}/chat/completions?api-version=${AZURE_API_VERSION}`;
}

export async function azureChat(opts: AzureCompletionOptions): Promise<string> {
  const url = buildUrl();

  const body: Record<string, unknown> = {
    messages: opts.messages,
    temperature: opts.temperature ?? 0.3,
    max_completion_tokens: opts.maxTokens ?? 4096,
  };

  if (opts.responseFormat) {
    body.response_format = opts.responseFormat;
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": AZURE_KEY,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "unknown error");
    throw new Error(`Azure OpenAI error ${res.status}: ${errText}`);
  }

  const data = (await res.json()) as AzureChatResponse;
  return data.choices[0]?.message?.content ?? "";
}

export async function azureChatStream(
  opts: AzureCompletionOptions
): Promise<ReadableStream<Uint8Array>> {
  const url = buildUrl();

  const body: Record<string, unknown> = {
    messages: opts.messages,
    temperature: opts.temperature ?? 0.3,
    max_completion_tokens: opts.maxTokens ?? 4096,
    stream: true,
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": AZURE_KEY,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "unknown error");
    throw new Error(`Azure OpenAI error ${res.status}: ${errText}`);
  }

  if (!res.body) throw new Error("No response body for stream");

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const reader = res.body.getReader();

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.close();
        return;
      }
      const text = decoder.decode(value, { stream: true });
      const lines = text.split("\n").filter((l) => l.startsWith("data: "));
      for (const line of lines) {
        const payload = line.slice(6).trim();
        if (payload === "[DONE]") {
          controller.close();
          return;
        }
        try {
          const parsed = JSON.parse(payload) as {
            choices: { delta: { content?: string } }[];
          };
          const content = parsed.choices[0]?.delta?.content;
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        } catch {
          // skip unparseable chunks
        }
      }
    },
  });
}

export { type ChatMessage, type AzureCompletionOptions };
