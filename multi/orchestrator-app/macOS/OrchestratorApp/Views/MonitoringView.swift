//
//  MonitoringView.swift
//  OrchestratorApp
//

import SwiftUI
import Charts

struct MonitoringView: View {
    @EnvironmentObject var appState: AppState
    
    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                // System Stats Cards
                HStack(spacing: 16) {
                    StatCard(
                        title: "CPU Usage",
                        value: "\(Int(appState.systemStats?.cpuUsage ?? 0))%",
                        color: .blue
                    )
                    
                    StatCard(
                        title: "Memory Usage",
                        value: "\(Int(appState.systemStats?.memoryUsage ?? 0))%",
                        color: .purple
                    )
                    
                    StatCard(
                        title: "Active Workers",
                        value: "\(appState.systemStats?.activeWorkers ?? 0)",
                        color: .green
                    )
                    
                    StatCard(
                        title: "Queued Tasks",
                        value: "\(appState.systemStats?.queuedTasks ?? 0)",
                        color: .orange
                    )
                }
                .padding()
                
                // Charts
                HStack(spacing: 16) {
                    TaskStatusChart(tasks: appState.tasks)
                    ResourceUsageChart(stats: appState.systemStats)
                }
                .padding()
            }
        }
        .navigationTitle("Monitoring")
    }
}

struct StatCard: View {
    let title: String
    let value: String
    let color: Color
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .font(.caption)
                .foregroundColor(.secondary)
            
            Text(value)
                .font(.title2)
                .fontWeight(.bold)
                .foregroundColor(color)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding()
        .background(Color(NSColor.controlBackgroundColor))
        .cornerRadius(8)
    }
}

struct TaskStatusChart: View {
    let tasks: [Task]
    
    var statusCounts: [String: Int] {
        Dictionary(grouping: tasks, by: { $0.status })
            .mapValues { $0.count }
    }
    
    var body: some View {
        VStack(alignment: .leading) {
            Text("Task Status")
                .font(.headline)
            
            Chart {
                ForEach(Array(statusCounts.keys), id: \.self) { status in
                    BarMark(
                        x: .value("Status", status),
                        y: .value("Count", statusCounts[status] ?? 0)
                    )
                    .foregroundStyle(colorForStatus(status))
                }
            }
            .frame(height: 200)
        }
        .padding()
        .background(Color(NSColor.controlBackgroundColor))
        .cornerRadius(8)
    }
    
    func colorForStatus(_ status: String) -> Color {
        switch status {
        case "completed": return .green
        case "running": return .blue
        case "failed": return .red
        default: return .gray
        }
    }
}

struct ResourceUsageChart: View {
    let stats: SystemStats?
    
    var body: some View {
        VStack(alignment: .leading) {
            Text("Resource Usage")
                .font(.headline)
            
            if let stats = stats {
                Chart {
                    BarMark(x: .value("CPU", stats.cpuUsage))
                        .foregroundStyle(.blue)
                    BarMark(x: .value("Memory", stats.memoryUsage))
                        .foregroundStyle(.purple)
                }
                .frame(height: 200)
            } else {
                Text("No data available")
                    .foregroundColor(.secondary)
                    .frame(height: 200)
            }
        }
        .padding()
        .background(Color(NSColor.controlBackgroundColor))
        .cornerRadius(8)
    }
}

