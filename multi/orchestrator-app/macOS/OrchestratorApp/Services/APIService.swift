//
//  APIService.swift
//  OrchestratorApp
//

import Foundation

class APIService {
    private let baseURL = "http://127.0.0.1:8000/api"
    
    func getTasks() async throws -> [Task] {
        let url = URL(string: "\(baseURL)/tasks")!
        let (data, _) = try await URLSession.shared.data(from: url)
        return try JSONDecoder().decode([Task].self, from: data)
    }
    
    func createTask(description: String, projectId: String?) async throws -> Task {
        var request = URLRequest(url: URL(string: "\(baseURL)/tasks")!)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let body: [String: Any] = [
            "description": description,
            "project_id": projectId as Any
        ]
        request.httpBody = try JSONSerialization.data(withJSONObject: body)
        
        let (data, _) = try await URLSession.shared.data(for: request)
        return try JSONDecoder().decode(Task.self, from: data)
    }
    
    func getProjects() async throws -> [Project] {
        let url = URL(string: "\(baseURL)/projects")!
        let (data, _) = try await URLSession.shared.data(from: url)
        let projectNames = try JSONDecoder().decode([String].self, from: data)
        return projectNames.map { Project(id: $0, name: $0) }
    }
    
    func getSystemStats() async throws -> SystemStats {
        let url = URL(string: "\(baseURL)/monitoring/stats/system")!
        let (data, _) = try await URLSession.shared.data(from: url)
        return try JSONDecoder().decode(SystemStats.self, from: data)
    }
}

