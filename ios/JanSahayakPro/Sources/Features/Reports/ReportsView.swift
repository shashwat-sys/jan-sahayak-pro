import SwiftUI
import UniformTypeIdentifiers

struct ReportsView: View {
    @Environment(WorkspaceStore.self) private var store

    @State private var reportType: ReportType = .donor
    @State private var period = "\(Formatters.month.string(from: .now))"
    @State private var notes = ""
    @State private var attachments: [AttachmentRecord] = []
    @State private var output = ""
    @State private var showingImporter = false
    @State private var importError: String?

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 18) {
                ProCard {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Reports")
                            .font(.largeTitle.bold())
                            .foregroundStyle(ProPalette.text)
                        Text("Build donor-ready or internal programme reports using live workspace data and uploaded reference documents.")
                            .font(.subheadline)
                            .foregroundStyle(ProPalette.dim)
                    }
                }

                ProCard(title: "Compose") {
                    Picker("Report Type", selection: $reportType) {
                        ForEach(ReportType.allCases) { value in
                            Text(value.label).tag(value)
                        }
                    }

                    TextField("Reporting Period", text: $period)
                        .textFieldStyle(.roundedBorder)

                    TextField("Notes about uploaded material", text: $notes, axis: .vertical)
                        .textFieldStyle(.roundedBorder)
                        .lineLimit(3...5)

                    Button("Upload Reports / Documents") {
                        showingImporter = true
                    }
                    .buttonStyle(.bordered)

                    if let importError {
                        Text(importError)
                            .font(.caption)
                            .foregroundStyle(ProPalette.red)
                    }

                    ForEach(attachments) { attachment in
                        AttachmentRow(attachment: attachment)
                    }

                    Button("Generate Report") {
                        generateReport()
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(ProPalette.accent)

                    if !output.isEmpty {
                        Button("Save Draft") {
                            let draft = ReportDraft(
                                reportType: reportType,
                                period: period,
                                notes: notes,
                                attachments: attachments,
                                output: output
                            )
                            store.saveReportDraft(draft)
                        }
                        .buttonStyle(.bordered)
                    }
                }

                GeneratedTextCard(title: "Output", text: output)

                ProCard(title: "Saved Drafts") {
                    if store.reportDrafts.isEmpty {
                        EmptyStateView(title: "No saved reports", copy: "Generate and save a draft to keep it inside the app.")
                    } else {
                        ForEach(store.reportDrafts.prefix(6)) { draft in
                            VStack(alignment: .leading, spacing: 4) {
                                Text(draft.reportType.label)
                                    .font(.headline)
                                    .foregroundStyle(ProPalette.text)
                                Text(draft.period)
                                    .font(.subheadline)
                                    .foregroundStyle(ProPalette.dim)
                                Text("Attachments: \(draft.attachments.count)")
                                    .font(.caption)
                                    .foregroundStyle(ProPalette.accent)
                            }
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .padding(12)
                            .background(RoundedRectangle(cornerRadius: 14).fill(ProPalette.surface))
                        }
                    }
                }
            }
            .padding()
        }
        .navigationTitle("Reports")
        .proScreenBackground()
        .fileImporter(
            isPresented: $showingImporter,
            allowedContentTypes: [.data, .pdf, .image, .plainText],
            allowsMultipleSelection: true
        ) { result in
            do {
                let urls = try result.get()
                attachments.append(contentsOf: try DocumentVault.importFiles(from: urls))
            } catch {
                importError = error.localizedDescription
            }
        }
    }

    private func generateReport() {
        let caseLines = store.cases.map { "- \($0.title) | \($0.court) | \($0.type) | \($0.status.label)" }
        let activityLines = store.activities.map { "- \($0.title) | \($0.type) | \(formatDate($0.date)) | beneficiaries: \($0.beneficiaries)" }
        let attachmentLines = attachments.map { "- \($0.fileName) (\($0.fileSizeLabel))" }

        output = ReportComposer.compose(
            type: reportType,
            period: period,
            cases: caseLines,
            activities: activityLines,
            team: store.team.map { "\($0.name) (\($0.role))" },
            totalGrants: store.totalGrants,
            totalExpenses: store.totalExpenses,
            notes: notes,
            attachments: attachmentLines
        )
    }
}

private enum ReportComposer {
    static func compose(
        type: ReportType,
        period: String,
        cases: [String],
        activities: [String],
        team: [String],
        totalGrants: Decimal,
        totalExpenses: Decimal,
        notes: String,
        attachments: [String]
    ) -> String {
        let heading: String
        switch type {
        case .donor:
            heading = "Donor Progress Report"
        case .appi:
            heading = "APPI Annual Report"
        case .internalBrief:
            heading = "Internal Status Brief"
        }

        return """
        \(heading)
        Period: \(period)

        1. Programme overview
        Jan Sahayak Pro summarises litigation, district activities, finance, and follow-up from Jan Nyaya Abhiyan for the selected period.

        2. Case docket
        \(cases.isEmpty ? "- No cases logged." : cases.joined(separator: "\n"))

        3. Activities
        \(activities.isEmpty ? "- No activities logged." : activities.joined(separator: "\n"))

        4. Team
        \(team.joined(separator: "\n"))

        5. Finance snapshot
        - Total grants: \(formatCurrency(totalGrants))
        - Total expenses: \(formatCurrency(totalExpenses))
        - Balance: \(formatCurrency(totalGrants - totalExpenses))

        6. Supporting material
        \(attachments.isEmpty ? "- No uploaded supporting files." : attachments.joined(separator: "\n"))

        7. Notes
        \(notes.isEmpty ? "No additional notes were entered." : notes)
        """
    }
}
