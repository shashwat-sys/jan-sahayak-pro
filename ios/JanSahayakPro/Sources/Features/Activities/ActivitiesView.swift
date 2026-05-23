import SwiftUI

struct ActivitiesView: View {
    @Environment(WorkspaceStore.self) private var store
    @State private var showingComposer = false

    var body: some View {
        List {
            if store.activities.isEmpty {
                EmptyStateView(
                    title: "No activities yet",
                    copy: "Save a planned activity from the pipeline or add one manually."
                )
                .listRowBackground(Color.clear)
            } else {
                ForEach(store.activities.sorted(by: { $0.date > $1.date })) { activity in
                    VStack(alignment: .leading, spacing: 8) {
                        HStack {
                            Text(activity.title)
                                .font(.headline)
                            Spacer()
                            TagChip(
                                text: activity.status.label,
                                tint: activity.status == .completed ? ProPalette.green : ProPalette.accent
                            )
                        }
                        Text("\(activity.type) • \(activity.location), \(activity.district)")
                            .font(.subheadline)
                            .foregroundStyle(ProPalette.dim)
                        Text("Coordinator: \(activity.coordinator) • \(formatDate(activity.date))")
                            .font(.caption)
                            .foregroundStyle(ProPalette.accent)
                        if !activity.summary.isEmpty {
                            Text(activity.summary)
                                .font(.caption)
                                .foregroundStyle(ProPalette.text)
                        }
                    }
                    .padding(.vertical, 8)
                    .listRowBackground(ProPalette.card)
                }
            }
        }
        .scrollContentBackground(.hidden)
        .background(ProPalette.background)
        .navigationTitle("Activities")
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button {
                    showingComposer = true
                } label: {
                    Label("Add Activity", systemImage: "plus")
                }
            }
        }
        .sheet(isPresented: $showingComposer) {
            NavigationStack {
                ActivityComposerView()
            }
        }
    }
}

private struct ActivityComposerView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(WorkspaceStore.self) private var store

    @State private var type = CaseCatalog.activityTypes.first ?? "Legal Aid Camp"
    @State private var title = ""
    @State private var location = ""
    @State private var district = "Purnia"
    @State private var date = Date()
    @State private var coordinator = "Shashwat"
    @State private var beneficiaries = ""
    @State private var casesIdentified = ""
    @State private var casesReferred = ""
    @State private var summary = ""
    @State private var followUp = ""
    @State private var status: ActivityStatus = .planned

    var body: some View {
        Form {
            Picker("Activity Type", selection: $type) {
                ForEach(CaseCatalog.activityTypes, id: \.self) { value in
                    Text(value).tag(value)
                }
            }
            TextField("Title", text: $title)
            TextField("Location", text: $location)
            Picker("District", selection: $district) {
                ForEach(CaseCatalog.biharDistricts, id: \.self) { value in
                    Text(value).tag(value)
                }
            }
            DatePicker("Date", selection: $date, displayedComponents: .date)
            TextField("Coordinator", text: $coordinator)
            TextField("Beneficiaries", text: $beneficiaries)
                .keyboardType(.numberPad)
            TextField("Cases Identified", text: $casesIdentified)
                .keyboardType(.numberPad)
            TextField("Cases Referred", text: $casesReferred)
                .keyboardType(.numberPad)
            Picker("Status", selection: $status) {
                ForEach(ActivityStatus.allCases) { value in
                    Text(value.label).tag(value)
                }
            }
            TextField("Summary", text: $summary, axis: .vertical)
                .lineLimit(3...5)
            TextField("Follow-up", text: $followUp, axis: .vertical)
                .lineLimit(2...4)
        }
        .navigationTitle("Add Activity")
        .toolbar {
            ToolbarItem(placement: .topBarLeading) {
                Button("Cancel") { dismiss() }
            }
            ToolbarItem(placement: .topBarTrailing) {
                Button("Save") {
                    let activity = ActivityRecord(
                        type: type,
                        title: title,
                        location: location,
                        district: district,
                        date: date,
                        coordinator: coordinator,
                        conductedBy: [coordinator],
                        beneficiaries: Int(beneficiaries) ?? 0,
                        casesIdentified: Int(casesIdentified) ?? 0,
                        casesReferred: Int(casesReferred) ?? 0,
                        summary: summary,
                        status: status,
                        followUp: followUp,
                        attachments: []
                    )
                    store.addActivity(activity)
                    dismiss()
                }
                .disabled(title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty || location.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
            }
        }
    }
}
