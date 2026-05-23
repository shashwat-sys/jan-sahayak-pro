import SwiftUI

struct FinanceView: View {
    @Environment(WorkspaceStore.self) private var store
    @State private var selectedType: FinanceEntryType?
    @State private var showingComposer = false

    private var filteredEntries: [FinanceEntry] {
        store.financeEntries.filter { entry in
            selectedType.map { entry.type == $0 } ?? true
        }
    }

    var body: some View {
        List {
            Section {
                HStack(spacing: 10) {
                    FilterChip(title: "All", isSelected: selectedType == nil) {
                        selectedType = nil
                    }
                    FilterChip(title: "Grants", isSelected: selectedType == .grant) {
                        selectedType = .grant
                    }
                    FilterChip(title: "Expenses", isSelected: selectedType == .expense) {
                        selectedType = .expense
                    }
                }
                .listRowBackground(Color.clear)
            }

            Section {
                VStack(alignment: .leading, spacing: 6) {
                    Text("Grant total: \(formatCurrency(store.totalGrants))")
                    Text("Expense total: \(formatCurrency(store.totalExpenses))")
                    Text("Balance: \(formatCurrency(store.totalGrants - store.totalExpenses))")
                }
                .foregroundStyle(ProPalette.text)
                .padding(.vertical, 6)
                .listRowBackground(ProPalette.card)
            }

            Section {
                ForEach(filteredEntries) { entry in
                    HStack {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(entry.description)
                                .font(.headline)
                            Text("\(entry.category) • \(entry.project)")
                                .font(.caption)
                                .foregroundStyle(ProPalette.dim)
                            Text(formatDate(entry.date))
                                .font(.caption)
                                .foregroundStyle(ProPalette.accent)
                        }
                        Spacer()
                        Text(formatCurrency(entry.amount))
                            .foregroundStyle(entry.type == .grant ? ProPalette.green : ProPalette.red)
                            .font(.headline)
                    }
                    .padding(.vertical, 6)
                    .listRowBackground(ProPalette.card)
                }
            }
        }
        .scrollContentBackground(.hidden)
        .background(ProPalette.background)
        .navigationTitle("Finance")
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button {
                    showingComposer = true
                } label: {
                    Label("Add Entry", systemImage: "plus")
                }
            }
        }
        .sheet(isPresented: $showingComposer) {
            NavigationStack {
                FinanceComposerView()
            }
        }
    }
}

private struct FinanceComposerView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(WorkspaceStore.self) private var store

    @State private var date = Date()
    @State private var type: FinanceEntryType = .expense
    @State private var category = "Camp/Training Expenses"
    @State private var amount = ""
    @State private var project = "Jan Nyaya Abhiyan"
    @State private var description = ""
    @State private var approvedBy = "Shashwat"

    private let expenseCategories = [
        "Camp/Training Expenses",
        "Travel",
        "Honorarium",
        "Case Filing",
        "Printing",
        "Office",
        "Other",
    ]

    private let grantCategories = [
        "Core Grant",
        "Addendum",
        "Donation",
    ]

    var body: some View {
        Form {
            DatePicker("Date", selection: $date, displayedComponents: .date)
            Picker("Type", selection: $type) {
                ForEach(FinanceEntryType.allCases) { value in
                    Text(value.label).tag(value)
                }
            }
            .onChange(of: type) { _, newValue in
                category = newValue == .grant ? grantCategories[0] : expenseCategories[0]
            }

            Picker("Category", selection: $category) {
                ForEach(type == .grant ? grantCategories : expenseCategories, id: \.self) { value in
                    Text(value).tag(value)
                }
            }

            TextField("Amount", text: $amount)
                .keyboardType(.numberPad)
            TextField("Project", text: $project)
            TextField("Description", text: $description, axis: .vertical)
                .lineLimit(2...4)
            TextField("Approved By", text: $approvedBy)
        }
        .navigationTitle("Add Finance Entry")
        .toolbar {
            ToolbarItem(placement: .topBarLeading) {
                Button("Cancel") { dismiss() }
            }
            ToolbarItem(placement: .topBarTrailing) {
                Button("Save") {
                    let decimal = Decimal(string: amount) ?? 0
                    store.addFinanceEntry(
                        FinanceEntry(
                            date: date,
                            type: type,
                            category: category,
                            amount: decimal,
                            project: project,
                            description: description,
                            approvedBy: approvedBy
                        )
                    )
                    dismiss()
                }
                .disabled(description.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty || (Decimal(string: amount) ?? 0) <= 0)
            }
        }
    }
}
