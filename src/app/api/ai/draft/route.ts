import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/server/auth";
import { generateLegalDraft } from "@/lib/server/ai";
import { drafterRequestSchema } from "@/lib/server/validators";

export async function POST(request: Request) {
  const authState = await getAdminSession();
  if (authState.type !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = drafterRequestSchema.parse(await request.json());
    const text = await generateLegalDraft({
      docType: payload.docType,
      directions: payload.directions,
      caseRecord: payload.caseRecord,
    });

    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Draft generation failed." },
      { status: 400 },
    );
  }
}
