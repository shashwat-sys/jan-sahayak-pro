import { NextResponse } from "next/server";

import { triagePublicIssue } from "@/lib/server/public-triage";
import { publicIssueRequestSchema } from "@/lib/server/validators";

export async function POST(request: Request) {
  try {
    const payload = publicIssueRequestSchema.parse(await request.json());
    const triage = await triagePublicIssue(payload);

    return NextResponse.json(triage);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to process help request.",
      },
      { status: 400 },
    );
  }
}
