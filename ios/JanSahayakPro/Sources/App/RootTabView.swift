import SwiftUI

struct RootTabView: View {
    var body: some View {
        TabView {
            NavigationStack {
                DashboardView()
            }
            .tabItem {
                Label("Dashboard", systemImage: "chart.bar.fill")
            }

            NavigationStack {
                CasesView()
            }
            .tabItem {
                Label("Cases", systemImage: "briefcase.fill")
            }

            NavigationStack {
                ActivitiesView()
            }
            .tabItem {
                Label("Activities", systemImage: "figure.2.and.child.holdinghands")
            }

            NavigationStack {
                ActivityPipelineView()
            }
            .tabItem {
                Label("Pipeline", systemImage: "sparkles.rectangle.stack")
            }

            NavigationStack {
                ReportsView()
            }
            .tabItem {
                Label("Reports", systemImage: "doc.text.fill")
            }

            NavigationStack {
                FinanceView()
            }
            .tabItem {
                Label("Finance", systemImage: "indianrupeesign.circle.fill")
            }
        }
    }
}
