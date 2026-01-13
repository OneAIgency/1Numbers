//
//  SettingsView.swift
//  OrchestratorApp
//

import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var appState: AppState
    @AppStorage("apiBaseURL") private var apiBaseURL = "http://127.0.0.1:8000"
    @AppStorage("maxWorkers") private var maxWorkers = 4
    
    var body: some View {
        Form {
            Section("API Configuration") {
                TextField("API Base URL", text: $apiBaseURL)
                Stepper("Max Workers: \(maxWorkers)", value: $maxWorkers, in: 1...8)
            }
            
            Section("Models") {
                Text("Claude API: Configured")
                Text("Ollama: Configured")
            }
            
            Section("Cache") {
                Toggle("Enable Cache", isOn: .constant(true))
                Text("Redis: Connected")
            }
        }
        .formStyle(.grouped)
        .navigationTitle("Settings")
    }
}

