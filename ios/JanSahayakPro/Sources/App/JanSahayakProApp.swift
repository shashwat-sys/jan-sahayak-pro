import SwiftUI

@main
struct JanSahayakProApp: App {
    @State private var store = WorkspaceStore()

    var body: some Scene {
        WindowGroup {
            RootTabView()
                .environment(store)
                .preferredColorScheme(.dark)
        }
    }
}
