import { NextResponse } from "next/server";

import { generateGroundedLegalKnowledge } from "@/lib/server/ai";
import { getAdminSession } from "@/lib/server/auth";
import { getLegalSources } from "@/lib/server/data";
import { selectLegalSources } from "@/lib/server/legal-knowledge";
import { knowledgeRequestSchema } from "@/lib/server/validators";

export async function POST(request: Request) {
  const authState = await getAdminSession();
  if (authState.type !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = knowledgeRequestSchema.parse(await request.json());
    const availableSources = await getLegalSources();
    const caseContext = payload.caseRecord
      ? [payload.caseRecord.title, payload.caseRecord.facts, payload.caseRecord.grounds]
          .filter(Boolean)
          .join(" ")
      : null;
    const sources = selectLegalSources(availableSources, {
      audience: payload.audience,
      request: payload.request,
      caseContext,
      limit: 5,
    });

    if (sources.length === 0) {
      return NextResponse.json(
        {
          error:
            "No grounded legal sources matched this request. Try naming the legal issue, scheme, or statute more directly.",
        },
        { status: 400 },
      );
    }

    const text = await generateGroundedLegalKnowledge({
      mode: payload.mode,
      audience: payload.audience,
      request: payload.request,
      caseRecord: payload.caseRecord,
      sources,
    });

    return NextResponse.json({ text, sources });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Grounded legal generation failed.",
      },
      { status: 400 },
    );
  }
}
