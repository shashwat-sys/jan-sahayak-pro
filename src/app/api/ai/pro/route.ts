import { NextResponse } from "next/server";
import { z } from "zod";

import { getAdminSession } from "@/lib/server/auth";
import { isAnthropicConfigured } from "@/lib/server/env";

const ALLOWED_MCP_URLS = new Set([
  "https://gmail.mcp.claude.com/mcp",
  "https://gcal.mcp.claude.com/mcp",
]);

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1),
});

const mcpServerSchema = z.object({
  type: z.literal("url"),
  url: z.string().url(),
  name: z.string().trim().min(1),
});

const proAiRequestSchema = z
  .object({
    prompt: z.string().trim().min(1).optional(),
    system: z.string().trim().min(1).optional(),
    messages: z.array(messageSchema).min(1).optional(),
    maxTokens: z.number().int().min(64).max(4096).optional(),
    mcpServers: z.array(mcpServerSchema).max(2).optional(),
  })
  .refine((value) => Boolean(value.prompt || value.messages?.length), {
    message: "Either prompt or messages is required.",
  });

function extractErrorMessage(payload: unknown) {
  if (
    payload &&
    typeof payload === "object" &&
    "error" in payload &&
    payload.error &&
    typeof payload.error === "object" &&
    "message" in payload.error &&
    typeof payload.error.message === "string"
  ) {
    return payload.error.message;
  }

  return "Anthropic request failed.";
}

export async function POST(request: Request) {
  const authState = await getAdminSession();
  if (authState.type !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAnthropicConfigured()) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured for Jan Sahayak Pro." },
      { status: 400 },
    );
  }

  try {
    const payload = proAiRequestSchema.parse(await request.json());
    const messages =
      payload.messages ?? [{ role: "user" as const, content: payload.prompt ?? "" }];
    const mcpServers =
      payload.mcpServers?.filter((server) => ALLOWED_MCP_URLS.has(server.url)) ?? [];

    const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: payload.maxTokens ?? 1000,
        system: payload.system,
        messages,
        ...(mcpServers.length > 0 ? { mcp_servers: mcpServers } : {}),
      }),
    });

    const responsePayload = await anthropicResponse.json();
    if (!anthropicResponse.ok) {
      return NextResponse.json(
        { error: extractErrorMessage(responsePayload) },
        { status: anthropicResponse.status },
      );
    }

    const text = Array.isArray(responsePayload?.content)
      ? responsePayload.content
          .filter((block: { type?: string; text?: string }) => block.type === "text")
          .map((block: { text?: string }) => block.text ?? "")
          .join("")
      : "";

    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to process Pro AI request.",
      },
      { status: 400 },
    );
  }
}
