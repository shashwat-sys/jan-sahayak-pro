import { NextResponse } from "next/server";

import { draftPublicComplaint } from "@/lib/server/public-assist";
import { publicComplaintAssistRequestSchema } from "@/lib/server/validators";

export async function POST(request: Request) {
  try {
    const payload = publicComplaintAssistRequestSchema.parse(await request.json());
    const result = await draftPublicComplaint(payload);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to draft complaint.",
      },
      { status: 400 },
    );
  }
}
