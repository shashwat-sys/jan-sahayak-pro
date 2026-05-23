import Foundation
import Observation

@MainActor
@Observable
final class WorkspaceStore {
    var cases: [CaseRecord]
    var activities: [ActivityRecord]
    var financeEntries: [FinanceEntry]
    var reportDrafts: [ReportDraft]
    var activityPlans: [ActivityPlan]
    var team: [TeamMember]

    init(snapshot: WorkspaceSnapshot = WorkspaceFixtures.initialSnapshot) {
        self.cases = snapshot.cases
        self.activities = snapshot.activities
        self.financeEntries = snapshot.financeEntries
        self.reportDrafts = snapshot.reportDrafts
        self.activityPlans = snapshot.activityPlans
        self.team = snapshot.team
        loadFromDisk()
    }

    var activeCases: [CaseRecord] {
        cases.filter { $0.status == .active }
    }

    var upcomingHearings: [(caseRecord: CaseRecord, hearing: CaseHearing)] {
        let now = Date()
        let horizon = Calendar.current.date(byAdding: .day, value: 7, to: now) ?? now

        return cases.flatMap { caseRecord in
            caseRecord.hearings.compactMap { hearing in
                guard let nextDate = hearing.nextDate, nextDate >= now, nextDate <= horizon else {
                    return nil
                }
                return (caseRecord, hearing)
            }
        }
        .sorted { ($0.hearing.nextDate ?? .distantFuture) < ($1.hearing.nextDate ?? .distantFuture) }
    }

    var overdueCases: [CaseRecord] {
        let calendar = Calendar.current
        return cases.filter {
            $0.status == .active &&
            calendar.dateComponents([.day], from: $0.updatedAt, to: .now).day ?? 0 > 7
        }
    }

    var totalGrants: Decimal {
        financeEntries
            .filter { $0.type == .grant }
            .reduce(0) { $0 + $1.amount }
    }

    var totalExpenses: Decimal {
        financeEntries
            .filter { $0.type == .expense }
            .reduce(0) { $0 + $1.amount }
    }

    func addCase(_ caseRecord: CaseRecord) {
        cases.insert(caseRecord, at: 0)
        persist()
    }

    func updateCase(_ caseRecord: CaseRecord) {
        guard let index = cases.firstIndex(where: { $0.id == caseRecord.id }) else { return }
        cases[index] = caseRecord
        cases[index].updatedAt = Date()
        persist()
    }

    func appendAttachments(_ attachments: [AttachmentRecord], to caseID: UUID) {
        guard let index = cases.firstIndex(where: { $0.id == caseID }) else { return }
        cases[index].attachments.append(contentsOf: attachments)
        cases[index].updatedAt = Date()
        persist()
    }

    func addNote(caseID: UUID, action: String, notes: String, author: String) {
        guard let index = cases.firstIndex(where: { $0.id == caseID }) else { return }
        cases[index].notes.insert(CaseNote(action: action, notes: notes, author: author), at: 0)
        cases[index].updatedAt = Date()
        persist()
    }

    func addHearing(caseID: UUID, hearing: CaseHearing) {
        guard let index = cases.firstIndex(where: { $0.id == caseID }) else { return }
        cases[index].hearings.insert(hearing, at: 0)
        cases[index].updatedAt = Date()
        persist()
    }

    func addActivity(_ activity: ActivityRecord) {
        activities.insert(activity, at: 0)
        persist()
    }

    func saveActivityPlan(_ plan: ActivityPlan, createPlannedActivity: Bool) {
        activityPlans.insert(plan, at: 0)

        if createPlannedActivity,
           activities.contains(where: { $0.title == plan.title && Calendar.current.isDate($0.date, inSameDayAs: plan.date) }) == false {
            activities.insert(
                ActivityRecord(
                    type: plan.type,
                    title: plan.title,
                    location: plan.location,
                    district: plan.district,
                    date: plan.date,
                    coordinator: plan.coordinator,
                    conductedBy: [plan.coordinator],
                    beneficiaries: 0,
                    casesIdentified: 0,
                    casesReferred: 0,
                    summary: "Planned through Activity Pipeline.",
                    status: .planned,
                    followUp: "",
                    attachments: []
                ),
                at: 0
            )
        }

        persist()
    }

    func saveReportDraft(_ draft: ReportDraft) {
        reportDrafts.insert(draft, at: 0)
        persist()
    }

    func addFinanceEntry(_ entry: FinanceEntry) {
        financeEntries.insert(entry, at: 0)
        persist()
    }

    func resetDemoData() {
        let snapshot = WorkspaceFixtures.initialSnapshot
        cases = snapshot.cases
        activities = snapshot.activities
        financeEntries = snapshot.financeEntries
        reportDrafts = snapshot.reportDrafts
        activityPlans = snapshot.activityPlans
        team = snapshot.team
        persist()
    }

    private func persist() {
        let snapshot = WorkspaceSnapshot(
            cases: cases,
            activities: activities,
            financeEntries: financeEntries,
            reportDrafts: reportDrafts,
            activityPlans: activityPlans,
            team: team
        )

        do {
            let data = try JSONEncoder.workspaceEncoder.encode(snapshot)
            try data.write(to: Self.storageURL(), options: .atomic)
        } catch {
            assertionFailure("Failed to persist workspace snapshot: \(error)")
        }
    }

    private func loadFromDisk() {
        let url = Self.storageURL()
        guard FileManager.default.fileExists(atPath: url.path()) else { return }

        do {
            let data = try Data(contentsOf: url)
            let snapshot = try JSONDecoder.workspaceDecoder.decode(WorkspaceSnapshot.self, from: data)
            cases = snapshot.cases
            activities = snapshot.activities
            financeEntries = snapshot.financeEntries
            reportDrafts = snapshot.reportDrafts
            activityPlans = snapshot.activityPlans
            team = snapshot.team
        } catch {
            assertionFailure("Failed to load workspace snapshot: \(error)")
        }
    }

    private static func storageURL() -> URL {
        let base = try? FileManager.default.url(
            for: .applicationSupportDirectory,
            in: .userDomainMask,
            appropriateFor: nil,
            create: true
        )
        let folder = (base ?? URL(fileURLWithPath: NSTemporaryDirectory()))
            .appendingPathComponent("JanSahayakPro", isDirectory: true)

        if !FileManager.default.fileExists(atPath: folder.path()) {
            try? FileManager.default.createDirectory(at: folder, withIntermediateDirectories: true)
        }

        return folder.appendingPathComponent("workspace.json")
    }
}

private extension JSONEncoder {
    static let workspaceEncoder: JSONEncoder = {
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
        return encoder
    }()
}

private extension JSONDecoder {
    static let workspaceDecoder: JSONDecoder = {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        return decoder
    }()
}
