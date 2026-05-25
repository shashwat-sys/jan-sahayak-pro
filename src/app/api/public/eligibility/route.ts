import { NextResponse } from "next/server";

import { evaluatePublicEligibility } from "@/lib/server/public-assist";
import { publicEligibilityProfileSchema } from "@/lib/server/validators";

export async function POST(request: Request) {
  try {
    const payload = publicEligibilityProfileSchema.parse(await request.json());
    const result = await evaluatePublicEligibility(payload);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to check eligibility.",
      },
      { status: 400 },
    );
  }
}
