import { NextResponse } from "next/server";

import { saveMonthlySummaryAction } from "@/lib/actions/monthly-reports";
import { getAdminSession } from "@/lib/server/auth";
import { generateMonthlySummary } from "@/lib/server/ai";
import { summaryRequestSchema } from "@/lib/server/validators";

export async function POST(request: Request) {
  const authState = await getAdminSession();
  if (authState.type !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = summaryRequestSchema.parse(await request.json());
    const text = await generateMonthlySummary(payload);
    await saveMonthlySummaryAction(
      payload.member,
      payload.month,
      text,
      payload.data,
      payload.type,
    );
    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Summary generation failed." },
      { status: 400 },
    );
  }
}
