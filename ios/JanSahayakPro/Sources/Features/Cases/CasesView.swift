import SwiftUI
import UniformTypeIdentifiers

struct CasesView: View {
    @Environment(WorkspaceStore.self) private var store

    @State private var searchText = ""
    @State private var selectedStatus: CaseStatus?
    @State private var showingComposer = false

    private var filteredCases: [CaseRecord] {
        store.cases.filter { record in
            let matchesStatus = selectedStatus.map { record.status == $0 } ?? true
            let query = searchText.trimmingCharacters(in: .whitespacesAndNewlines)
            let matchesQuery =
                query.isEmpty ||
                record.title.localizedCaseInsensitiveContains(query) ||
                record.client.localizedCaseInsensitiveContains(query) ||
                record.type.localizedCaseInsensitiveContains(query) ||
                record.court.localizedCaseInsensitiveContains(query)

            return matchesStatus && matchesQuery
        }
    }

    var body: some View {
        List {
            Section {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 10) {
                        FilterChip(
                            title: "All",
                            isSelected: selectedStatus == nil,
                            action: { selectedStatus = nil }
                        )

                        ForEach(CaseStatus.allCases) { status in
                            FilterChip(
                                title: status.label,
                                isSelected: selectedStatus == status,
                                action: { selectedStatus = status }
                            )
                        }
                    }
                    .padding(.vertical, 4)
                }
                .listRowBackground(Color.clear)
            }

            if filteredCases.isEmpty {
                Section {
                    EmptyStateView(
                        title: "No cases found",
                        copy: "Register a case or change the filter to see saved matters."
                    )
                    .listRowBackground(Color.clear)
                }
            } else {
                Section {
                    ForEach(filteredCases) { caseRecord in
                        NavigationLink {
                            CaseDetailView(caseRecord: caseRecord)
                        } label: {
                            VStack(alignment: .leading, spacing: 8) {
                                Text(caseRecord.title)
                                    .font(.headline)
                                HStack {
                                    Text(caseRecord.client)
                                    Spacer()
                                    Text(caseRecord.priority.label)
                                        .foregroundStyle(caseRecord.priority == .high ? ProPalette.red : ProPalette.accent)
                                }
                                .font(.subheadline)
                                Text("\(caseRecord.court) • \(caseRecord.type)")
                                    .font(.caption)
                                    .foregroundStyle(ProPalette.dim)
                            }
                            .padding(.vertical, 6)
                        }
                    }
                }
            }
        }
        .scrollContentBackground(.hidden)
        .background(ProPalette.background)
        .navigationTitle("Cases")
        .searchable(text: $searchText, prompt: "Search by client, title, court, or type")
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button {
                    showingComposer = true
                } label: {
                    Label("Register Case", systemImage: "plus")
                }
            }
        }
        .sheet(isPresented: $showingComposer) {
            NavigationStack {
                CaseComposerView()
            }
        }
    }
}

private struct CaseComposerView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(WorkspaceStore.self) private var store

    @State private var title = ""
    @State private var client = ""
    @State private var respondent = ""
    @State private var court = "Patna High Court"
    @State private var caseType = CaseCatalog.defaultCaseType(for: "Patna High Court")
    @State private var district = "Patna"
    @State private var caseNumber = ""
    @State private var firNumber = ""
    @State private var sections = ""
    @State private var policeStation = ""
    @State private var advocate = "Shashwat"
    @State private var fieldWorker = ""
    @State private var priority: CasePriority = .medium
    @State private var facts = ""
    @State private var grounds = ""
    @State private var relief = ""
    @State private var documents = ""
    @State private var importedAttachments: [AttachmentRecord] = []
    @State private var showingImporter = false
    @State private var errorMessage: String?

    private var teamNames: [String] {
        store.team.map(\.name)
    }

    var body: some View {
        Form {
            Section("Case Particulars") {
                TextField("Case title", text: $title)
                TextField("Client / petitioner", text: $client)
                TextField("Respondent", text: $respondent)

                Picker("Court", selection: $court) {
                    ForEach(CaseCatalog.courtOptions, id: \.self) { option in
                        Text(option).tag(option)
                    }
                }
                .onChange(of: court) { _, newCourt in
                    caseType = CaseCatalog.defaultCaseType(for: newCourt)
                }

                Picker("Case type", selection: $caseType) {
                    ForEach(CaseCatalog.caseTypes(for: court), id: \.self) { option in
                        Text(option).tag(option)
                    }
                }

                Text(CaseCatalog.source(for: court))
                    .font(.caption)
                    .foregroundStyle(ProPalette.dim)

                Picker("District", selection: $district) {
                    ForEach(CaseCatalog.biharDistricts, id: \.self) { value in
                        Text(value).tag(value)
                    }
                }

                TextField("Case number", text: $caseNumber)
                TextField("FIR number", text: $firNumber)
                TextField("Sections / Articles", text: $sections)
                TextField("Police station", text: $policeStation)
                Picker("Priority", selection: $priority) {
                    ForEach(CasePriority.allCases) { level in
                        Text(level.label).tag(level)
                    }
                }
            }

            Section("Team") {
                Picker("Advocate", selection: $advocate) {
                    ForEach(teamNames, id: \.self) { value in
                        Text(value).tag(value)
                    }
                }

                TextField("Field worker / fellow", text: $fieldWorker)
            }

            Section("Legal Substance") {
                TextField("Facts", text: $facts, axis: .vertical)
                    .lineLimit(3...6)
                TextField("Grounds", text: $grounds, axis: .vertical)
                    .lineLimit(3...6)
                TextField("Relief sought", text: $relief, axis: .vertical)
                    .lineLimit(2...4)
                TextField("Document names separated by commas", text: $documents, axis: .vertical)
                    .lineLimit(2...4)
            }

            Section("Upload Case Files") {
                Button("Import Documents") {
                    showingImporter = true
                }

                if importedAttachments.isEmpty {
                    Text("No supporting files selected yet.")
                        .font(.caption)
                        .foregroundStyle(ProPalette.dim)
                } else {
                    ForEach(importedAttachments) { attachment in
                        AttachmentRow(attachment: attachment)
                            .listRowInsets(.init())
                            .listRowBackground(Color.clear)
                    }
                }
            }

            if let errorMessage {
                Section {
                    Text(errorMessage)
                        .foregroundStyle(ProPalette.red)
                }
            }
        }
        .scrollContentBackground(.hidden)
        .background(ProPalette.background)
        .navigationTitle("Register Case")
        .toolbar {
            ToolbarItem(placement: .topBarLeading) {
                Button("Cancel") {
                    dismiss()
                }
            }

            ToolbarItem(placement: .topBarTrailing) {
                Button("Save") {
                    saveCase()
                }
                .disabled(title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty || client.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
            }
        }
        .fileImporter(
            isPresented: $showingImporter,
            allowedContentTypes: [.data, .pdf, .image, .plainText],
            allowsMultipleSelection: true
        ) { result in
            do {
                let urls = try result.get()
                importedAttachments.append(contentsOf: try DocumentVault.importFiles(from: urls))
            } catch {
                errorMessage = error.localizedDescription
            }
        }
    }

    private func saveCase() {
        let documentNames = documents
            .split(separator: ",")
            .map { $0.trimmingCharacters(in: .whitespacesAndNewlines) }
            .filter { !$0.isEmpty }

        let record = CaseRecord(
            title: title,
            client: client,
            respondent: respondent,
            court: court,
            caseNo: caseNumber,
            firNo: firNumber,
            section: sections,
            policeStation: policeStation,
            type: caseType,
            district: district,
            advocate: advocate,
            fieldWorker: fieldWorker,
            status: .active,
            priority: priority,
            facts: facts,
            grounds: grounds,
            relief: relief,
            documents: documentNames,
            notes: [],
            hearings: [],
            attachments: importedAttachments
        )

        store.addCase(record)
        dismiss()
    }
}

private struct CaseDetailView: View {
    @Environment(WorkspaceStore.self) private var store

    let caseRecord: CaseRecord

    @State private var showingNoteComposer = false
    @State private var showingHearingComposer = false
    @State private var showingImporter = false
    @State private var importError: String?

    private var currentCase: CaseRecord {
        store.cases.first(where: { $0.id == caseRecord.id }) ?? caseRecord
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 18) {
                ProCard {
                    VStack(alignment: .leading, spacing: 10) {
                        Text(currentCase.title)
                            .font(.title3.bold())
                            .foregroundStyle(ProPalette.text)
                        HStack {
                            TagChip(text: currentCase.priority.label, tint: currentCase.priority == .high ? ProPalette.red : ProPalette.accent)
                            TagChip(text: currentCase.status.label, tint: currentCase.status == .active ? ProPalette.green : ProPalette.dim)
                        }
                        Text("\(currentCase.client) v. \(currentCase.respondent)")
                            .foregroundStyle(ProPalette.text)
                        Text("\(currentCase.court) • \(currentCase.type)")
                            .font(.subheadline)
                            .foregroundStyle(ProPalette.dim)
                    }
                }

                ProCard(title: "Substance") {
                    DetailLine(label: "Case No.", value: currentCase.caseNo)
                    DetailLine(label: "FIR No.", value: currentCase.firNo)
                    DetailLine(label: "Sections", value: currentCase.section)
                    DetailLine(label: "Police Station", value: currentCase.policeStation)
                    DetailLine(label: "Advocate", value: currentCase.advocate)
                    DetailLine(label: "Field Worker", value: currentCase.fieldWorker)
                    DetailLine(label: "Facts", value: currentCase.facts)
                    DetailLine(label: "Grounds", value: currentCase.grounds)
                    DetailLine(label: "Relief", value: currentCase.relief)
                }

                ProCard(title: "Hearings") {
                    if currentCase.hearings.isEmpty {
                        EmptyStateView(title: "No hearings yet", copy: "Add hearing dates and outcomes to track the matter.")
                    } else {
                        ForEach(currentCase.hearings) { hearing in
                            VStack(alignment: .leading, spacing: 4) {
                                Text(formatDate(hearing.date))
                                    .font(.headline)
                                    .foregroundStyle(ProPalette.text)
                                Text(hearing.court)
                                    .font(.subheadline)
                                    .foregroundStyle(ProPalette.dim)
                                if !hearing.purpose.isEmpty {
                                    Text("Purpose: \(hearing.purpose)")
                                        .font(.caption)
                                        .foregroundStyle(ProPalette.text)
                                }
                                if !hearing.outcome.isEmpty {
                                    Text("Outcome: \(hearing.outcome)")
                                        .font(.caption)
                                        .foregroundStyle(ProPalette.accent)
                                }
                                if let nextDate = hearing.nextDate {
                                    Text("Next date: \(formatDate(nextDate))")
                                        .font(.caption)
                                        .foregroundStyle(ProPalette.green)
                                }
                            }
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .padding(12)
                            .background(RoundedRectangle(cornerRadius: 14).fill(ProPalette.surface))
                        }
                    }
                }

                ProCard(title: "Notes") {
                    if currentCase.notes.isEmpty {
                        EmptyStateView(title: "No diary entries", copy: "Add action notes as the matter moves.")
                    } else {
                        ForEach(currentCase.notes) { note in
                            VStack(alignment: .leading, spacing: 4) {
                                Text(note.action)
                                    .font(.headline)
                                    .foregroundStyle(ProPalette.text)
                                Text(note.notes)
                                    .font(.subheadline)
                                    .foregroundStyle(ProPalette.dim)
                                Text("\(note.author) • \(formatDate(note.createdAt))")
                                    .font(.caption)
                                    .foregroundStyle(ProPalette.accent)
                            }
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .padding(12)
                            .background(RoundedRectangle(cornerRadius: 14).fill(ProPalette.surface))
                        }
                    }
                }

                ProCard(title: "Attachments") {
                    if currentCase.attachments.isEmpty {
                        EmptyStateView(title: "No uploaded files", copy: "Import FIRs, orders, affidavits, or supporting documents.")
                    } else {
                        ForEach(currentCase.attachments) { attachment in
                            AttachmentRow(attachment: attachment)
                        }
                    }

                    if let importError {
                        Text(importError)
                            .font(.caption)
                            .foregroundStyle(ProPalette.red)
                    }
                }
            }
            .padding()
        }
        .navigationTitle(currentCase.client)
        .toolbar {
            ToolbarItemGroup(placement: .topBarTrailing) {
                Button("Note") { showingNoteComposer = true }
                Button("Hearing") { showingHearingComposer = true }
                Button("File") { showingImporter = true }
            }
        }
        .sheet(isPresented: $showingNoteComposer) {
            NavigationStack {
                CaseNoteComposerView(caseID: currentCase.id)
            }
        }
        .sheet(isPresented: $showingHearingComposer) {
            NavigationStack {
                HearingComposerView(caseID: currentCase.id, defaultCourt: currentCase.court)
            }
        }
        .fileImporter(
            isPresented: $showingImporter,
            allowedContentTypes: [.data, .pdf, .image, .plainText],
            allowsMultipleSelection: true
        ) { result in
            do {
                let urls = try result.get()
                let attachments = try DocumentVault.importFiles(from: urls)
                store.appendAttachments(attachments, to: currentCase.id)
            } catch {
                importError = error.localizedDescription
            }
        }
        .proScreenBackground()
    }
}

private struct DetailLine: View {
    let label: String
    let value: String

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(label)
                .font(.caption.bold())
                .foregroundStyle(ProPalette.accent)
            Text(value.isEmpty ? "—" : value)
                .font(.subheadline)
                .foregroundStyle(ProPalette.text)
        }
    }
}

private struct CaseNoteComposerView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(WorkspaceStore.self) private var store

    let caseID: UUID

    @State private var action = ""
    @State private var notes = ""
    @State private var author = "Shashwat"

    var body: some View {
        Form {
            TextField("Action", text: $action)
            TextField("Notes", text: $notes, axis: .vertical)
                .lineLimit(3...5)
            TextField("By", text: $author)
        }
        .navigationTitle("Add Note")
        .toolbar {
            ToolbarItem(placement: .topBarLeading) {
                Button("Cancel") { dismiss() }
            }
            ToolbarItem(placement: .topBarTrailing) {
                Button("Save") {
                    store.addNote(caseID: caseID, action: action, notes: notes, author: author)
                    dismiss()
                }
                .disabled(action.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
            }
        }
    }
}

private struct HearingComposerView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(WorkspaceStore.self) private var store

    let caseID: UUID
    let defaultCourt: String

    @State private var date = Date()
    @State private var court = ""
    @State private var purpose = ""
    @State private var outcome = ""
    @State private var nextDate = Date()
    @State private var hasNextDate = true
    @State private var by = "Shashwat"

    init(caseID: UUID, defaultCourt: String) {
        self.caseID = caseID
        self.defaultCourt = defaultCourt
        _court = State(initialValue: defaultCourt)
    }

    var body: some View {
        Form {
            DatePicker("Hearing Date", selection: $date, displayedComponents: .date)
            TextField("Court", text: $court)
            TextField("Purpose", text: $purpose)
            TextField("Outcome", text: $outcome)
            Toggle("Add next date", isOn: $hasNextDate)
            if hasNextDate {
                DatePicker("Next Date", selection: $nextDate, displayedComponents: .date)
            }
            TextField("By", text: $by)
        }
        .navigationTitle("Add Hearing")
        .toolbar {
            ToolbarItem(placement: .topBarLeading) {
                Button("Cancel") { dismiss() }
            }
            ToolbarItem(placement: .topBarTrailing) {
                Button("Save") {
                    let hearing = CaseHearing(
                        date: date,
                        court: court,
                        purpose: purpose,
                        outcome: outcome,
                        nextDate: hasNextDate ? nextDate : nil,
                        by: by
                    )
                    store.addHearing(caseID: caseID, hearing: hearing)
                    dismiss()
                }
            }
        }
    }
}
