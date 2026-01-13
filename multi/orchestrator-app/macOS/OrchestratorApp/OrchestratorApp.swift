//
//  OrchestratorApp.swift
//  OrchestratorApp
//
//  macOS Native App for Multi-Agent Orchestrator
//

import SwiftUI

@main
struct OrchestratorApp: App {
    @StateObject private var appState = AppState()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(appState)
        }
        .commands {
            CommandGroup(replacing: .newItem) {
                Button("New Task") {
                    appState.showNewTaskSheet = true
                }
                .keyboardShortcut("n", modifiers: .command)
            }
        }
        
        Settings {
            SettingsView()
                .environmentObject(appState)
        }
    }
}

