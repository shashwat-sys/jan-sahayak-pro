import Foundation

enum CasePriority: String, Codable, CaseIterable, Identifiable {
    case high
    case medium
    case low

    var id: String { rawValue }
    var label: String { rawValue.capitalized }
}

enum CaseStatus: String, Codable, CaseIterable, Identifiable {
    case active
    case completed
    case onHold = "on_hold"

    var id: String { rawValue }

    var label: String {
        switch self {
        case .active: "Active"
        case .completed: "Completed"
        case .onHold: "On Hold"
        }
    }
}

enum ActivityStatus: String, Codable, CaseIterable, Identifiable {
    case planned
    case completed
    case followUp = "follow_up"

    var id: String { rawValue }

    var label: String {
        switch self {
        case .planned: "Planned"
        case .completed: "Completed"
        case .followUp: "Follow-up"
        }
    }
}

enum FinanceEntryType: String, Codable, CaseIterable, Identifiable {
    case grant
    case expense

    var id: String { rawValue }

    var label: String {
        switch self {
        case .grant: "Grant"
        case .expense: "Expense"
        }
    }
}

enum ReportType: String, Codable, CaseIterable, Identifiable {
    case donor
    case appi
    case internalBrief = "internal_brief"

    var id: String { rawValue }

    var label: String {
        switch self {
        case .donor: "Donor Progress Report"
        case .appi: "APPI Annual Report"
        case .internalBrief: "Internal Status Brief"
        }
    }
}

struct AttachmentRecord: Identifiable, Codable, Hashable {
    var id: UUID = UUID()
    var fileName: String
    var storedFileName: String?
    var sizeInBytes: Int
    var importedAt: Date = Date()

    var fileSizeLabel: String {
        ByteCountFormatter.string(fromByteCount: Int64(sizeInBytes), countStyle: .file)
    }
}

struct CaseNote: Identifiable, Codable, Hashable {
    var id: UUID = UUID()
    var action: String
    var notes: String
    var author: String
    var createdAt: Date = Date()
}

struct CaseHearing: Identifiable, Codable, Hashable {
    var id: UUID = UUID()
    var date: Date
    var court: String
    var purpose: String
    var outcome: String
    var nextDate: Date?
    var by: String
}

struct CaseRecord: Identifiable, Codable, Hashable {
    var id: UUID = UUID()
    var title: String
    var client: String
    var respondent: String
    var court: String
    var caseNo: String
    var firNo: String
    var section: String
    var policeStation: String
    var type: String
    var district: String
    var advocate: String
    var fieldWorker: String
    var status: CaseStatus
    var priority: CasePriority
    var facts: String
    var grounds: String
    var relief: String
    var documents: [String]
    var notes: [CaseNote]
    var hearings: [CaseHearing]
    var attachments: [AttachmentRecord]
    var createdAt: Date = Date()
    var updatedAt: Date = Date()
}

struct ActivityRecord: Identifiable, Codable, Hashable {
    var id: UUID = UUID()
    var type: String
    var title: String
    var location: String
    var district: String
    var date: Date
    var coordinator: String
    var conductedBy: [String]
    var beneficiaries: Int
    var casesIdentified: Int
    var casesReferred: Int
    var summary: String
    var status: ActivityStatus
    var followUp: String
    var attachments: [AttachmentRecord]
}

struct ActivityChecklistItem: Identifiable, Codable, Hashable {
    var id: UUID = UUID()
    var task: String
    var category: String
    var assignee: String
    var deadline: Date
    var priority: CasePriority
    var notes: String
    var isDone: Bool = false
}

struct ActivityPlan: Identifiable, Codable, Hashable {
    var id: UUID = UUID()
    var title: String
    var type: String
    var district: String
    var location: String
    var date: Date
    var coordinator: String
    var objectives: String
    var conceptNote: String
    var agenda: String
    var checklist: [ActivityChecklistItem]
    var reportTemplate: String
    var socialCopy: String
    var actionPoints: String
    var createdAt: Date = Date()
}

struct FinanceEntry: Identifiable, Codable, Hashable {
    var id: UUID = UUID()
    var date: Date
    var type: FinanceEntryType
    var category: String
    var amount: Decimal
    var project: String
    var description: String
    var approvedBy: String
}

struct ReportDraft: Identifiable, Codable, Hashable {
    var id: UUID = UUID()
    var reportType: ReportType
    var period: String
    var notes: String
    var attachments: [AttachmentRecord]
    var output: String
    var createdAt: Date = Date()
}

struct TeamMember: Identifiable, Codable, Hashable {
    var id: UUID = UUID()
    var name: String
    var role: String
    var district: String
    var email: String
}

struct WorkspaceSnapshot: Codable {
    var cases: [CaseRecord]
    var activities: [ActivityRecord]
    var financeEntries: [FinanceEntry]
    var reportDrafts: [ReportDraft]
    var activityPlans: [ActivityPlan]
    var team: [TeamMember]
}
