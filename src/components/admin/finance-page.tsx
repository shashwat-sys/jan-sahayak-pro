"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InputField, SelectField } from "@/components/ui/field";
import { createFinanceTransactionAction } from "@/lib/actions/finance";
import { EXPENSE_CATEGORIES, GRANT_CATEGORIES } from "@/lib/domain/constants";
import type { FinanceTransactionRecord } from "@/lib/domain/types";
import { buildFinanceSummary } from "@/lib/server/analytics";
import { formatDisplayDate } from "@/lib/utils/date";

type FinancePageProps = {
  finance: FinanceTransactionRecord[];
};

type FinanceFormState = {
  date: string;
  type: "grant" | "expense";
  amount: string;
  category: string;
  project: string;
  description: string;
  approvedBy: string;
};

export function FinancePage({ finance }: FinancePageProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "grant" | "expense">("all");
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<FinanceFormState>({
    date: new Date().toISOString().slice(0, 10),
    type: "expense" as const,
    amount: "",
    category: "Travel & Boarding",
    project: "Jan Nyaya Abhiyan",
    description: "",
    approvedBy: "Shashwat",
  });

  const filtered = filter === "all" ? finance : finance.filter((entry) => entry.type === filter);
  const summary = buildFinanceSummary(finance);
  const byProject = Array.from(new Set(finance.map((entry) => entry.project)));
  const maxCategoryAmount = Math.max(...Object.values(summary.expenseByCategory), 1);

  return (
    <div className="page-stack">
      <PageHeader
        kicker="Finance"
        title="Grant receipts, utilisation, and category rollups."
        copy="Keep a clear view of incoming grants, expenditure pressure, and project-level burn across the programme."
        actions={<Button onClick={() => setShowForm((current) => !current)}>{showForm ? "Close Form" : "Add Entry"}</Button>}
      />

      <div className="grid cols-3">
        <Card compact>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div>
              <div className="stat-value">₹{summary.totalGrants.toLocaleString("en-IN")}</div>
              <div className="stat-label">Total Grants</div>
            </div>
          </div>
        </Card>
        <Card compact>
          <div className="stat-card">
            <div className="stat-icon">💸</div>
            <div>
              <div className="stat-value">₹{summary.totalExpenses.toLocaleString("en-IN")}</div>
              <div className="stat-label">Total Expenses</div>
            </div>
          </div>
        </Card>
        <Card compact>
          <div className="stat-card">
            <div className="stat-icon">⚖️</div>
            <div>
              <div className="stat-value">₹{summary.balance.toLocaleString("en-IN")}</div>
              <div className="stat-label">Balance</div>
            </div>
          </div>
        </Card>
      </div>

      {showForm ? (
        <Card>
          <span className="section-kicker">New Transaction</span>
          <div className="form-grid">
            <div className="grid cols-2">
              <SelectField
                label="Type"
                value={form.type}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    type: event.target.value as typeof form.type,
                    category: event.target.value === "grant" ? "Core Grant" : "Travel & Boarding",
                  }))
                }
                options={[
                  { label: "Grant / Donation", value: "grant" },
                  { label: "Expense", value: "expense" },
                ]}
              />
              <InputField
                label="Date"
                type="date"
                value={form.date}
                onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
              />
            </div>
            <div className="grid cols-2">
              <InputField
                label="Amount"
                type="number"
                value={form.amount}
                onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))}
              />
              <SelectField
                label="Category"
                value={form.category}
                onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                options={form.type === "grant" ? [...GRANT_CATEGORIES] : [...EXPENSE_CATEGORIES]}
              />
            </div>
            <InputField
              label="Description"
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            />
            <div className="grid cols-2">
              <InputField
                label="Project"
                value={form.project}
                onChange={(event) => setForm((current) => ({ ...current, project: event.target.value }))}
              />
              <InputField
                label="Approved By"
                value={form.approvedBy}
                onChange={(event) => setForm((current) => ({ ...current, approvedBy: event.target.value }))}
              />
            </div>
            {message ? <div className="support-text" style={{ color: "var(--accent)" }}>{message}</div> : null}
            <div className="button-row">
              <Button
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    const result = await createFinanceTransactionAction({
                      ...form,
                      amount: Number(form.amount),
                    });
                    setMessage(result.ok ? "Finance entry saved." : result.error);
                    if (result.ok) {
                      setShowForm(false);
                      setForm({
                        date: new Date().toISOString().slice(0, 10),
                        type: "expense",
                        amount: "",
                        category: "Travel & Boarding",
                        project: "Jan Nyaya Abhiyan",
                        description: "",
                        approvedBy: "Shashwat",
                      });
                      router.refresh();
                    }
                  })
                }
              >
                Save Entry
              </Button>
            </div>
          </div>
        </Card>
      ) : null}

      <div className="button-row">
        {["all", "grant", "expense"].map((type) => (
          <Button
            key={type}
            size="small"
            tone={filter === type ? "primary" : "ghost"}
            onClick={() => setFilter(type as typeof filter)}
          >
            {type === "all" ? "All" : type === "grant" ? "Grants" : "Expenses"}
          </Button>
        ))}
      </div>

      <div className="grid cols-2">
        <Card>
          <span className="section-kicker">Ledger</span>
          <div className="stack">
            {filtered.map((entry) => (
              <div className="table-row" key={entry.id}>
                <div>
                  <div>{entry.description}</div>
                  <div className="list-meta">
                    {entry.category} · {entry.project} · {formatDisplayDate(entry.date)} ·{" "}
                    {entry.approvedBy}
                  </div>
                </div>
                <Badge tone={entry.type === "grant" ? "green" : "red"}>
                  {entry.type === "grant" ? "+" : "-"}₹{entry.amount.toLocaleString("en-IN")}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <div className="stack">
          <Card>
            <span className="section-kicker">Expenses by Category</span>
            <div className="metric-rail">
              {Object.entries(summary.expenseByCategory).map(([category, amount]) => (
                <div key={category}>
                  <div className="list-row">
                    <div>{category}</div>
                    <div className="list-meta">₹{amount.toLocaleString("en-IN")}</div>
                  </div>
                  <div className="metric-bar" style={{ marginTop: 6 }}>
                    <span style={{ width: `${(amount / maxCategoryAmount) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <span className="section-kicker">By Project</span>
            <div className="stack">
              {byProject.map((project) => {
                const grants = finance
                  .filter((entry) => entry.project === project && entry.type === "grant")
                  .reduce((sum, entry) => sum + entry.amount, 0);
                const expenses = finance
                  .filter((entry) => entry.project === project && entry.type === "expense")
                  .reduce((sum, entry) => sum + entry.amount, 0);

                return (
                  <div className="list-card" key={project}>
                    <div>{project}</div>
                    <div className="list-meta">
                      Grants ₹{grants.toLocaleString("en-IN")} · Expenses ₹
                      {expenses.toLocaleString("en-IN")}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
