//
//  ContentView.swift
//  OrchestratorApp
//

import SwiftUI

struct ContentView: View {
    @EnvironmentObject var appState: AppState
    
    var body: some View {
        NavigationSplitView {
            SidebarView()
        } detail: {
            MainView()
        }
    }
}

struct SidebarView: View {
    @EnvironmentObject var appState: AppState
    
    var body: some View {
        List(selection: $appState.selectedView) {
            Section("Main") {
                Label("Tasks", systemImage: "list.bullet")
                    .tag(ViewType.tasks)
                Label("Monitoring", systemImage: "chart.bar")
                    .tag(ViewType.monitoring)
            }
            
            Section("Projects") {
                ForEach(appState.projects) { project in
                    Label(project.name, systemImage: "folder")
                        .tag(ViewType.project(project.id))
                }
            }
            
            Section("Settings") {
                Label("Settings", systemImage: "gearshape")
                    .tag(ViewType.settings)
            }
        }
        .navigationTitle("Orchestrator")
    }
}

struct MainView: View {
    @EnvironmentObject var appState: AppState
    
    var body: some View {
        Group {
            switch appState.selectedView {
            case .tasks:
                TaskListView()
            case .monitoring:
                MonitoringView()
            case .project(let id):
                ProjectView(projectId: id)
            case .settings:
                SettingsView()
            }
        }
        .frame(minWidth: 800, minHeight: 600)
    }
}

enum ViewType: Hashable {
    case tasks
    case monitoring
    case project(String)
    case settings
}

