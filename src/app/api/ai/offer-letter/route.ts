import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/server/auth";
import { generateOfferLetter } from "@/lib/server/ai";
import { offerLetterRequestSchema } from "@/lib/server/validators";

export async function POST(request: Request) {
  const authState = await getAdminSession();
  if (authState.type !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = offerLetterRequestSchema.parse(await request.json());
    const text = await generateOfferLetter(payload.teamMember);
    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Offer letter generation failed." },
      { status: 400 },
    );
  }
}
