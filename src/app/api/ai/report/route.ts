import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/server/auth";
import { generateProgrammeReport } from "@/lib/server/ai";
import { reportRequestSchema } from "@/lib/server/validators";

export async function POST(request: Request) {
  const authState = await getAdminSession();
  if (authState.type !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = reportRequestSchema.parse(await request.json());
    const text = await generateProgrammeReport({
      type: payload.type,
      period: payload.period,
      cases: payload.context.cases,
      activities: payload.context.activities,
      team: payload.context.team,
      financeEntries: [
        { type: "grant", amount: payload.context.finance.totalGrants, description: "Grant total" },
        {
          type: "expense",
          amount: payload.context.finance.totalExpenses,
          description: "Expense total",
        },
      ],
      beneficiaries: payload.context.finance.beneficiaries,
    });
    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Report generation failed." },
      { status: 400 },
    );
  }
}
