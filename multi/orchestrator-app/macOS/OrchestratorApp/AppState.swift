//
//  AppState.swift
//  OrchestratorApp
//

import SwiftUI
import Combine

class AppState: ObservableObject {
    @Published var selectedView: ViewType = .tasks
    @Published var tasks: [Task] = []
    @Published var projects: [Project] = []
    @Published var systemStats: SystemStats?
    @Published var showNewTaskSheet = false
    @Published var isConnected = false
    
    private let apiService = APIService()
    private let websocketService = WebSocketService()
    private var cancellables = Set<AnyCancellable>()
    
    init() {
        setupWebSocket()
        loadInitialData()
        startPolling()
    }
    
    private func setupWebSocket() {
        websocketService.onMessage = { [weak self] message in
            DispatchQueue.main.async {
                self?.handleWebSocketMessage(message)
            }
        }
        
        websocketService.connect()
    }
    
    private func loadInitialData() {
        Task {
            await loadTasks()
            await loadProjects()
            await loadSystemStats()
        }
    }
    
    private func startPolling() {
        Timer.publish(every: 5.0, on: .main, in: .common)
            .autoconnect()
            .sink { [weak self] _ in
                Task {
                    await self?.loadSystemStats()
                }
            }
            .store(in: &cancellables)
    }
    
    private func handleWebSocketMessage(_ message: [String: Any]) {
        guard let type = message["type"] as? String else { return }
        
        switch type {
        case "task_created":
            if let taskId = message["task_id"] as? String {
                Task { await loadTasks() }
            }
        case "task_updated":
            Task { await loadTasks() }
        case "system_stats":
            if let stats = message["stats"] as? [String: Any] {
                systemStats = SystemStats(from: stats)
            }
        default:
            break
        }
    }
    
    func loadTasks() async {
        do {
            tasks = try await apiService.getTasks()
        } catch {
            print("Error loading tasks: \(error)")
        }
    }
    
    func loadProjects() async {
        do {
            projects = try await apiService.getProjects()
        } catch {
            print("Error loading projects: \(error)")
        }
    }
    
    func loadSystemStats() async {
        do {
            systemStats = try await apiService.getSystemStats()
        } catch {
            print("Error loading stats: \(error)")
        }
    }
    
    func createTask(description: String, projectId: String?) async throws {
        let task = try await apiService.createTask(
            description: description,
            projectId: projectId
        )
        await loadTasks()
    }
}

