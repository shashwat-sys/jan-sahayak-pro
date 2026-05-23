import Foundation

enum WorkspaceFixtures {
    static let team: [TeamMember] = [
        TeamMember(name: "Shashwat", role: "Director, Litigation", district: "Patna", email: "sshashwat8@gmail.com"),
        TeamMember(name: "Shourya Roy", role: "Executive Director", district: "Patna", email: "shourya@janman.org"),
        TeamMember(name: "Roshin Jacob", role: "Fellowship Coordinator", district: "Patna", email: "roshin@janman.org"),
        TeamMember(name: "Sachina", role: "District Legal Fellow", district: "Patna", email: "sachina@janman.org"),
        TeamMember(name: "Nawaz Hassan", role: "District Legal Fellow", district: "Araria", email: "nawaz@janman.org"),
        TeamMember(name: "Tausif Raza", role: "District Legal Fellow", district: "Katihar", email: "tausif@janman.org"),
    ]

    static let initialSnapshot = WorkspaceSnapshot(
        cases: [
            CaseRecord(
                title: "Rukmani Devi v. State of Bihar",
                client: "Rukmani Devi",
                respondent: "State of Bihar",
                court: "Patna High Court",
                caseNo: "CWJC 4521/2025",
                firNo: "123/2024",
                section: "Article 226 / PWDVA 2005",
                policeStation: "Kotwali Patna",
                type: "Civil Writ Jurisdiction Case[CWJC]",
                district: "Patna",
                advocate: "Shashwat",
                fieldWorker: "Sachina",
                status: .active,
                priority: .high,
                facts: "Client was denied protection and shelter support after domestic violence.",
                grounds: "Violation of Articles 14 and 21, denial of statutory protection under PWDVA 2005.",
                relief: "Immediate protection, shelter, and police compliance directions.",
                documents: ["Writ Petition", "Protection Officer complaint", "Medical papers"],
                notes: [
                    CaseNote(action: "Filed writ petition", notes: "Urgent listing requested.", author: "Shashwat"),
                ],
                hearings: [
                    CaseHearing(
                        date: Calendar.current.date(byAdding: .day, value: -3, to: .now) ?? .now,
                        court: "Patna High Court",
                        purpose: "Urgent mentioning",
                        outcome: "Notice issued",
                        nextDate: Calendar.current.date(byAdding: .day, value: 4, to: .now),
                        by: "Shashwat"
                    ),
                ],
                attachments: []
            ),
            CaseRecord(
                title: "Ramkali Paswan v. State of Bihar",
                client: "Ramkali Paswan",
                respondent: "State of Bihar",
                court: "District Court, Purnia",
                caseNo: "TS 88/2025",
                firNo: "",
                section: "SC/ST Act / Land restoration",
                policeStation: "Kasba",
                type: "Title Suit",
                district: "Purnia",
                advocate: "Nawaz Hassan",
                fieldWorker: "Nagmani",
                status: .active,
                priority: .medium,
                facts: "Land possession dispute involving caste-based dispossession.",
                grounds: "Land rights, SC/ST Act atrocity implications, possession and revenue record correction.",
                relief: "Restoration of possession and restraint against interference.",
                documents: ["Plaint", "Khatiyan copy"],
                notes: [],
                hearings: [],
                attachments: []
            ),
        ],
        activities: [
            ActivityRecord(
                type: "Legal Aid Camp",
                title: "Legal Aid Camp — Ramchak Bariya",
                location: "Ramchak Bariya, Purnia",
                district: "Purnia",
                date: Calendar.current.date(byAdding: .day, value: -10, to: .now) ?? .now,
                coordinator: "Sachina",
                conductedBy: ["Sachina", "Nagmani"],
                beneficiaries: 34,
                casesIdentified: 6,
                casesReferred: 2,
                summary: "Issues included land rights, domestic violence, and wage denial.",
                status: .completed,
                followUp: "File representations in three wage cases and two DV matters.",
                attachments: []
            ),
            ActivityRecord(
                type: "PLV Training",
                title: "PLV Training — Batch 3",
                location: "Janman Office, Purnia",
                district: "Purnia",
                date: Calendar.current.date(byAdding: .day, value: 6, to: .now) ?? .now,
                coordinator: "Roshin Jacob",
                conductedBy: ["Roshin Jacob", "Shashwat"],
                beneficiaries: 18,
                casesIdentified: 0,
                casesReferred: 0,
                summary: "Training plan for FIR drafting, SC/ST Act, and court process.",
                status: .planned,
                followUp: "Prepare attendance sheet and community mobilisation calls.",
                attachments: []
            ),
        ],
        financeEntries: [
            FinanceEntry(
                date: Calendar.current.date(byAdding: .day, value: -15, to: .now) ?? .now,
                type: .grant,
                category: "Core Grant",
                amount: 1_500_000,
                project: "Jan Nyaya Abhiyan",
                description: "APPI tranche received",
                approvedBy: "Shourya Roy"
            ),
            FinanceEntry(
                date: Calendar.current.date(byAdding: .day, value: -4, to: .now) ?? .now,
                type: .expense,
                category: "Camp/Training Expenses",
                amount: 24_500,
                project: "Jan Nyaya Abhiyan",
                description: "District legal aid camp materials and travel",
                approvedBy: "Shashwat"
            ),
        ],
        reportDrafts: [],
        activityPlans: [],
        team: team
    )
}
