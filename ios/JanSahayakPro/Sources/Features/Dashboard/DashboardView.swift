import SwiftUI

struct DashboardView: View {
    @Environment(WorkspaceStore.self) private var store

    private var currentMonthActivities: [ActivityRecord] {
        let month = Calendar.current.component(.month, from: .now)
        let year = Calendar.current.component(.year, from: .now)
        return store.activities.filter {
            Calendar.current.component(.month, from: $0.date) == month &&
            Calendar.current.component(.year, from: $0.date) == year
        }
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 18) {
                ProCard {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Jan Sahayak Pro")
                            .font(.largeTitle.bold())
                            .foregroundStyle(ProPalette.text)
                        Text("Native iOS command view for Jan Nyaya Abhiyan litigation, activities, reports, and district operations.")
                            .font(.subheadline)
                            .foregroundStyle(ProPalette.dim)
                        HStack(spacing: 10) {
                            TagChip(text: "\(store.overdueCases.count) overdue matters", tint: store.overdueCases.isEmpty ? ProPalette.green : ProPalette.red)
                            TagChip(text: "\(store.upcomingHearings.count) hearings this week", tint: ProPalette.accent)
                        }
                    }
                }

                LazyVGrid(columns: [GridItem(.adaptive(minimum: 160), spacing: 14)], spacing: 14) {
                    StatTile(
                        title: "Active Cases",
                        value: "\(store.activeCases.count)",
                        icon: "scalemass.fill",
                        tint: ProPalette.blue
                    )
                    StatTile(
                        title: "Activities This Month",
                        value: "\(currentMonthActivities.count)",
                        icon: "calendar.badge.clock",
                        tint: ProPalette.green
                    )
                    StatTile(
                        title: "Total Grants",
                        value: formatCurrency(store.totalGrants),
                        icon: "arrow.down.circle.fill",
                        tint: ProPalette.green
                    )
                    StatTile(
                        title: "Total Expenses",
                        value: formatCurrency(store.totalExpenses),
                        icon: "arrow.up.circle.fill",
                        tint: ProPalette.red
                    )
                }

                ProCard(title: "Hearings This Week") {
                    let upcomingHearings = store.upcomingHearings

                    if upcomingHearings.isEmpty {
                        EmptyStateView(
                            title: "No hearings due soon",
                            copy: "Upcoming hearings within the next seven days will surface here."
                        )
                    } else {
                        VStack(spacing: 12) {
                            ForEach(Array(upcomingHearings.indices), id: \.self) { index in
                                let item = upcomingHearings[index]
                                VStack(alignment: .leading, spacing: 6) {
                                    Text(item.caseRecord.client)
                                        .font(.headline)
                                        .foregroundStyle(ProPalette.text)
                                    Text("\(item.hearing.court) • \(formatDate(item.hearing.nextDate ?? item.hearing.date))")
                                        .font(.subheadline)
                                        .foregroundStyle(ProPalette.dim)
                                    if !item.hearing.purpose.isEmpty {
                                        Text(item.hearing.purpose)
                                            .font(.caption)
                                            .foregroundStyle(ProPalette.accent)
                                    }
                                }
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .padding(14)
                                .background(
                                    RoundedRectangle(cornerRadius: 16, style: .continuous)
                                        .fill(ProPalette.surface)
                                )
                            }
                        }
                    }
                }

                ProCard(title: "Upcoming Activities") {
                    let futureActivities = store.activities
                        .filter { $0.date >= Calendar.current.startOfDay(for: .now) }
                        .sorted { $0.date < $1.date }

                    if futureActivities.isEmpty {
                        EmptyStateView(
                            title: "No planned activities",
                            copy: "Use the Activities or Pipeline tabs to add a district camp, training, or consultation."
                        )
                    } else {
                        VStack(spacing: 12) {
                            ForEach(futureActivities.prefix(4)) { activity in
                                HStack(alignment: .top) {
                                    VStack(alignment: .leading, spacing: 4) {
                                        Text(activity.title)
                                            .font(.headline)
                                            .foregroundStyle(ProPalette.text)
                                        Text("\(activity.type) • \(activity.location), \(activity.district)")
                                            .font(.subheadline)
                                            .foregroundStyle(ProPalette.dim)
                                        Text("Coordinator: \(activity.coordinator)")
                                            .font(.caption)
                                            .foregroundStyle(ProPalette.accent)
                                    }
                                    Spacer()
                                    Text(formatDate(activity.date))
                                        .font(.caption.weight(.semibold))
                                        .foregroundStyle(ProPalette.text)
                                }
                                .padding(14)
                                .background(
                                    RoundedRectangle(cornerRadius: 16, style: .continuous)
                                        .fill(ProPalette.surface)
                                )
                            }
                        }
                    }
                }

                ProCard(title: "Core Team") {
                    VStack(spacing: 10) {
                        ForEach(store.team.prefix(5)) { member in
                            HStack {
                                VStack(alignment: .leading, spacing: 4) {
                                    Text(member.name)
                                        .font(.subheadline.weight(.semibold))
                                        .foregroundStyle(ProPalette.text)
                                    Text("\(member.role) • \(member.district)")
                                        .font(.caption)
                                        .foregroundStyle(ProPalette.dim)
                                }
                                Spacer()
                                TagChip(text: member.district, tint: ProPalette.purple)
                            }
                            .padding(12)
                            .background(
                                RoundedRectangle(cornerRadius: 14, style: .continuous)
                                    .fill(ProPalette.surface)
                            )
                        }
                    }
                }
            }
            .padding()
        }
        .navigationTitle("Dashboard")
        .proScreenBackground()
    }
}
