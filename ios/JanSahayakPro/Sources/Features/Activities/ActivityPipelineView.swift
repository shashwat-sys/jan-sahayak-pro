import SwiftUI

struct ActivityPipelineView: View {
    @Environment(WorkspaceStore.self) private var store

    @State private var activityType = CaseCatalog.activityTypes.first ?? "Legal Aid Camp"
    @State private var title = ""
    @State private var location = ""
    @State private var district = "Purnia"
    @State private var date = Date()
    @State private var coordinator = "Shashwat"
    @State private var objectives = ""
    @State private var issues = ""
    @State private var targetAudience = ""
    @State private var expectedParticipants = ""
    @State private var budget = ""
    @State private var conceptNote = ""
    @State private var agenda = ""
    @State private var reportTemplate = ""
    @State private var socialCopy = ""
    @State private var actionPoints = ""
    @State private var checklist: [ActivityChecklistItem] = []
    @State private var saveMessage = ""

    private var isReady: Bool {
        !title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty &&
        !location.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 18) {
                ProCard {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Activity Planning Pipeline")
                            .font(.largeTitle.bold())
                            .foregroundStyle(ProPalette.text)
                        Text("Create a district activity brief, operational checklist, reporting format, and follow-up pack in one native flow.")
                            .font(.subheadline)
                            .foregroundStyle(ProPalette.dim)
                    }
                }

                ProCard(title: "Setup") {
                    Picker("Activity Type", selection: $activityType) {
                        ForEach(CaseCatalog.activityTypes, id: \.self) { value in
                            Text(value).tag(value)
                        }
                    }

                    TextField("Activity Title", text: $title)
                        .textFieldStyle(.roundedBorder)
                    TextField("Location / Venue", text: $location)
                        .textFieldStyle(.roundedBorder)

                    Picker("District", selection: $district) {
                        ForEach(CaseCatalog.biharDistricts, id: \.self) { value in
                            Text(value).tag(value)
                        }
                    }

                    DatePicker("Activity Date", selection: $date, displayedComponents: .date)
                    TextField("Coordinator", text: $coordinator)
                        .textFieldStyle(.roundedBorder)
                    TextField("Budget (INR)", text: $budget)
                        .textFieldStyle(.roundedBorder)
                        .keyboardType(.numberPad)
                    TextField("Objectives", text: $objectives, axis: .vertical)
                        .textFieldStyle(.roundedBorder)
                        .lineLimit(3...5)
                    TextField("Key Issues", text: $issues, axis: .vertical)
                        .textFieldStyle(.roundedBorder)
                        .lineLimit(3...5)
                    TextField("Target Audience", text: $targetAudience)
                        .textFieldStyle(.roundedBorder)
                    TextField("Expected Participants", text: $expectedParticipants)
                        .textFieldStyle(.roundedBorder)
                }

                ProCard(title: "Generate") {
                    VStack(alignment: .leading, spacing: 12) {
                        Button("Generate Activity Pack") {
                            generatePack()
                        }
                        .buttonStyle(.borderedProminent)
                        .tint(ProPalette.accent)
                        .disabled(!isReady)

                        if !saveMessage.isEmpty {
                            Text(saveMessage)
                                .font(.caption)
                                .foregroundStyle(saveMessage.contains("saved") ? ProPalette.green : ProPalette.red)
                        }
                    }
                }

                GeneratedTextCard(title: "Concept Note", text: conceptNote)
                GeneratedTextCard(title: "Agenda", text: agenda)

                ProCard(title: "Checklist") {
                    if checklist.isEmpty {
                        EmptyStateView(title: "No checklist yet", copy: "Generate the activity pack to create a district-ready to-do list.")
                    } else {
                        ForEach(checklist) { item in
                            VStack(alignment: .leading, spacing: 4) {
                                Text(item.task)
                                    .font(.headline)
                                    .foregroundStyle(ProPalette.text)
                                Text("\(item.category) • \(item.assignee) • \(formatDate(item.deadline))")
                                    .font(.caption)
                                    .foregroundStyle(ProPalette.dim)
                            }
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .padding(12)
                            .background(RoundedRectangle(cornerRadius: 14).fill(ProPalette.surface))
                        }
                    }
                }

                GeneratedTextCard(title: "Report Template", text: reportTemplate)
                GeneratedTextCard(title: "Social Copy", text: socialCopy)
                GeneratedTextCard(title: "Action Points", text: actionPoints)

                Button("Save to Activities") {
                    savePlan()
                }
                .buttonStyle(.borderedProminent)
                .tint(ProPalette.green)
                .disabled(!isReady || conceptNote.isEmpty)
            }
            .padding()
        }
        .navigationTitle("Activity Pipeline")
        .proScreenBackground()
    }

    private func generatePack() {
        conceptNote = ActivityPipelineEngine.conceptNote(
            title: title,
            type: activityType,
            district: district,
            location: location,
            date: date,
            coordinator: coordinator,
            objectives: objectives,
            issues: issues,
            targetAudience: targetAudience,
            expectedParticipants: expectedParticipants,
            budget: budget
        )
        agenda = ActivityPipelineEngine.agenda(title: title, type: activityType, location: location)
        checklist = ActivityPipelineEngine.checklist(
            date: date,
            coordinator: coordinator,
            socialLead: store.team.dropFirst(1).first?.name ?? coordinator
        )
        reportTemplate = ActivityPipelineEngine.reportTemplate(title: title, district: district)
        socialCopy = ActivityPipelineEngine.socialCopy(title: title, district: district, date: date)
        actionPoints = ActivityPipelineEngine.actionPoints(title: title, coordinator: coordinator)
        saveMessage = ""
    }

    private func savePlan() {
        guard isReady else {
            saveMessage = "Add an activity title and location before saving."
            return
        }

        let plan = ActivityPlan(
            title: title,
            type: activityType,
            district: district,
            location: location,
            date: date,
            coordinator: coordinator,
            objectives: objectives,
            conceptNote: conceptNote,
            agenda: agenda,
            checklist: checklist,
            reportTemplate: reportTemplate,
            socialCopy: socialCopy,
            actionPoints: actionPoints
        )

        store.saveActivityPlan(plan, createPlannedActivity: true)
        saveMessage = "Activity plan saved to the archive and Activities tab."
    }
}

private enum ActivityPipelineEngine {
    static func conceptNote(
        title: String,
        type: String,
        district: String,
        location: String,
        date: Date,
        coordinator: String,
        objectives: String,
        issues: String,
        targetAudience: String,
        expectedParticipants: String,
        budget: String
    ) -> String {
        """
        TITLE: \(title)

        Activity type: \(type)
        Date: \(formatDate(date))
        Location: \(location), \(district)
        Coordinator: \(coordinator)
        Expected participants: \(expectedParticipants)
        Indicative budget: ₹\(budget.isEmpty ? "TBD" : budget)

        Background:
        This activity is designed as a Jan Nyaya Abhiyan field intervention grounded in district-level access to justice concerns in Bihar. It should combine legal literacy, case identification, and collective problem-solving.

        Objectives:
        \(objectives.isEmpty ? "1. Surface urgent legal and welfare concerns.\n2. Build district-level legal awareness.\n3. Identify cases for immediate follow-up." : objectives)

        Key issues to foreground:
        \(issues.isEmpty ? "Police inaction, social welfare denial, land rights, caste atrocity response, and women's protection concerns." : issues)

        Target audience:
        \(targetAudience.isEmpty ? "Survivors, PLVs, local lawyers, village leaders, and district stakeholders." : targetAudience)

        Expected outcome:
        A well-documented district activity that produces referrals, rights awareness, follow-up action points, and a strong reporting trail.
        """
    }

    static func agenda(title: String, type: String, location: String) -> String {
        """
        10:00 AM | Arrival and registration | Team desk and participant sign-in
        10:30 AM | Opening context | Introduce \(title) and explain why this \(type.lowercased()) matters in \(location)
        11:00 AM | Rights session | Core legal rights, case pathways, and scheme entitlements
        12:00 PM | Testimony and issue-mapping circle | Participants share district problems and priorities
        01:00 PM | Break
        01:30 PM | Case help desk | Intake, document scan, and referral planning
        02:30 PM | Government interface segment | Escalation routes, helplines, district offices, and court pathways
        03:15 PM | Action planning | Assign follow-up tasks and district contacts
        04:00 PM | Closing and commitments | Summarise commitments, next steps, and reporting expectations
        """
    }

    static func checklist(date: Date, coordinator: String, socialLead: String) -> [ActivityChecklistItem] {
        let calendar = Calendar.current
        let oneWeekBefore = calendar.date(byAdding: .day, value: -7, to: date) ?? date
        let threeDaysBefore = calendar.date(byAdding: .day, value: -3, to: date) ?? date

        return [
            ActivityChecklistItem(task: "Confirm venue and district logistics", category: "Venue", assignee: coordinator, deadline: oneWeekBefore, priority: .high, notes: "Check seating, electricity, water, and sign-in desk."),
            ActivityChecklistItem(task: "Prepare mobilisation calls and participant list", category: "Outreach", assignee: coordinator, deadline: threeDaysBefore, priority: .high, notes: "Prioritise PLVs, survivors, and district contacts."),
            ActivityChecklistItem(task: "Draft and circulate social media and WhatsApp invite", category: "Communications", assignee: socialLead, deadline: threeDaysBefore, priority: .medium, notes: "Use district-specific language."),
            ActivityChecklistItem(task: "Print attendance sheets and case intake forms", category: "Documentation", assignee: coordinator, deadline: threeDaysBefore, priority: .medium, notes: "Keep hard copies and one backup set."),
            ActivityChecklistItem(task: "Prepare post-activity report and follow-up tracker", category: "Reporting", assignee: coordinator, deadline: date, priority: .medium, notes: "Document cases, commitments, and escalation points."),
        ]
    }

    static func reportTemplate(title: String, district: String) -> String {
        """
        Activity report: \(title)

        1. Basic details
        - District: \(district)
        - Date:
        - Venue:
        - Coordinator:

        2. Participants and attendance
        - Total attendees:
        - Women:
        - PLVs:
        - Lawyers / officials:

        3. Session summary
        - Opening context
        - Legal rights discussion
        - Issue mapping
        - Case intake and referral support

        4. Cases and issues identified
        - Number of matters surfaced
        - Immediate referrals made
        - Welfare grievances noted

        5. Action points and follow-up
        - Responsible person
        - Deadline
        - Escalation route
        """
    }

    static func socialCopy(title: String, district: String, date: Date) -> String {
        """
        WhatsApp update:
        Jan Nyaya Abhiyan is organising \(title) in \(district) on \(formatDate(date)). The activity will focus on legal rights, district problem-solving, and direct case support.

        Post-activity caption:
        \(title) brought together community members, PLVs, and legal workers in \(district) to surface urgent justice concerns and build concrete follow-up pathways.
        """
    }

    static func actionPoints(title: String, coordinator: String) -> String {
        """
        Immediate follow-up for \(title):
        1. Compile all surfaced cases into the district tracker.
        2. Assign legal and welfare follow-up owners within 24 hours.
        3. Send thank-you and next-step communication to participants.
        4. Share a district summary with programme leadership.

        Lead coordinator: \(coordinator)
        """
    }
}
