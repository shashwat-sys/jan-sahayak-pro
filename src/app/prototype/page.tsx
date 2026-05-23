import type { Metadata } from "next";

import { PrototypePresentation } from "@/components/prototype/prototype-presentation";
import {
  DEMO_ACTIVITIES,
  DEMO_CASES,
  DEMO_FINANCE_TRANSACTIONS,
  DEMO_TEAM_MEMBERS,
} from "@/lib/domain/demo-data";

export const metadata: Metadata = {
  title: "Jan Sahayak Prototype",
  description:
    "Presentation-friendly prototype for Jan Sahayak and Jan Sahayak Pro across public, operations, and iOS surfaces.",
};

type PrototypePageProps = {
  searchParams: Promise<{ scene?: string }>;
};

function formatLakhs(value: number) {
  return `Rs ${(value / 100_000).toFixed(value >= 1_000_000 ? 1 : 2)}L`;
}

export default async function PrototypePage({ searchParams }: PrototypePageProps) {
  const { scene } = await searchParams;
  const totalGrants = DEMO_FINANCE_TRANSACTIONS.filter((entry) => entry.type === "grant").reduce(
    (sum, entry) => sum + entry.amount,
    0,
  );
  const totalExpenses = DEMO_FINANCE_TRANSACTIONS.filter(
    (entry) => entry.type === "expense",
  ).reduce((sum, entry) => sum + entry.amount, 0);
  const districtFellows = DEMO_TEAM_MEMBERS.filter((member) => member.type === "fellow");

  const summary = {
    activeCases: DEMO_CASES.filter((caseRecord) => caseRecord.status === "active").length,
    highPriorityCases: DEMO_CASES.filter((caseRecord) => caseRecord.priority === "high").length,
    totalActivities: DEMO_ACTIVITIES.length,
    beneficiariesReached: DEMO_ACTIVITIES.reduce(
      (sum, activity) => sum + activity.beneficiaries,
      0,
    ),
    totalGrantsLabel: formatLakhs(totalGrants),
    totalExpensesLabel: `Rs ${(totalExpenses / 1_000).toFixed(1)}K`,
    districtCoverage: new Set(districtFellows.map((member) => member.dist)).size,
    teamSize: DEMO_TEAM_MEMBERS.length,
  };

  return (
    <PrototypePresentation
      generatedOn={new Intl.DateTimeFormat("en-IN", {
        dateStyle: "long",
        timeStyle: "short",
        timeZone: "Asia/Kolkata",
      }).format(new Date())}
      initialSceneId={scene}
      summary={summary}
    />
  );
}
