//
//  TaskListView.swift
//  OrchestratorApp
//

import SwiftUI

struct TaskListView: View {
    @EnvironmentObject var appState: AppState
    @State private var searchText = ""
    
    var filteredTasks: [Task] {
        if searchText.isEmpty {
            return appState.tasks
        }
        return appState.tasks.filter { task in
            task.description.localizedCaseInsensitiveContains(searchText)
        }
    }
    
    var body: some View {
        VStack {
            // Toolbar
            HStack {
                TextField("Search tasks...", text: $searchText)
                    .textFieldStyle(.roundedBorder)
                
                Spacer()
                
                Button(action: {
                    appState.showNewTaskSheet = true
                }) {
                    Label("New Task", systemImage: "plus")
                }
                .buttonStyle(.borderedProminent)
            }
            .padding()
            
            // Task List
            List(filteredTasks) { task in
                TaskRowView(task: task)
            }
            .listStyle(.sidebar)
        }
        .navigationTitle("Tasks")
        .sheet(isPresented: $appState.showNewTaskSheet) {
            NewTaskSheet()
                .environmentObject(appState)
        }
    }
}

struct TaskRowView: View {
    let task: Task
    
    var statusColor: Color {
        switch task.status {
        case "completed": return .green
        case "running": return .blue
        case "failed": return .red
        default: return .gray
        }
    }
    
    var body: some View {
        HStack {
            Circle()
                .fill(statusColor)
                .frame(width: 8, height: 8)
            
            VStack(alignment: .leading, spacing: 4) {
                Text(task.description)
                    .font(.headline)
                
                HStack {
                    Text(task.status.capitalized)
                        .font(.caption)
                        .foregroundColor(.secondary)
                    
                    if task.progress > 0 {
                        Text("\(Int(task.progress * 100))%")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }
            }
            
            Spacer()
            
            if task.status == "running" {
                ProgressView(value: task.progress)
                    .frame(width: 100)
            }
        }
        .padding(.vertical, 4)
    }
}

struct NewTaskSheet: View {
    @EnvironmentObject var appState: AppState
    @Environment(\.dismiss) var dismiss
    @State private var description = ""
    @State private var selectedProject: String?
    
    var body: some View {
        NavigationStack {
            Form {
                Section("Task Details") {
                    TextField("Task description", text: $description, axis: .vertical)
                        .lineLimit(3...10)
                }
                
                Section("Project") {
                    Picker("Project", selection: $selectedProject) {
                        Text("None").tag(nil as String?)
                        ForEach(appState.projects) { project in
                            Text(project.name).tag(project.id as String?)
                        }
                    }
                }
            }
            .formStyle(.grouped)
            .navigationTitle("New Task")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Create") {
                        Task {
                            try? await appState.createTask(
                                description: description,
                                projectId: selectedProject
                            )
                            dismiss()
                        }
                    }
                    .disabled(description.isEmpty)
                }
            }
        }
        .frame(width: 500, height: 400)
    }
}

