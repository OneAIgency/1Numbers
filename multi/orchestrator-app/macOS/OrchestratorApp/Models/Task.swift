//
//  Task.swift
//  OrchestratorApp
//

import Foundation

struct Task: Identifiable, Codable {
    let id: String
    let description: String
    let status: String
    let createdAt: String
    let phases: [Phase]
    let progress: Double
    
    enum CodingKeys: String, CodingKey {
        case id
        case description
        case status
        case createdAt = "created_at"
        case phases
        case progress
    }
}

struct Phase: Codable {
    let number: Int
    let name: String
    let parallel: Bool
    let tasks: [SubTask]
}

struct SubTask: Codable {
    let id: String
    let agent: String
    let description: String
}

struct Project: Identifiable {
    let id: String
    let name: String
}

struct SystemStats: Codable {
    let cpuUsage: Double
    let memoryUsage: Double
    let activeWorkers: Int
    let queuedTasks: Int
    let cacheHits: Int
    let cacheMisses: Int
    
    enum CodingKeys: String, CodingKey {
        case cpuUsage = "cpu_usage"
        case memoryUsage = "memory_usage"
        case activeWorkers = "active_workers"
        case queuedTasks = "queued_tasks"
        case cacheHits = "cache_hits"
        case cacheMisses = "cache_misses"
    }
    
    init(from dict: [String: Any]) {
        cpuUsage = dict["cpu_usage"] as? Double ?? 0
        memoryUsage = dict["memory_usage"] as? Double ?? 0
        activeWorkers = dict["active_workers"] as? Int ?? 0
        queuedTasks = dict["queued_tasks"] as? Int ?? 0
        cacheHits = dict["cache_hits"] as? Int ?? 0
        cacheMisses = dict["cache_misses"] as? Int ?? 0
    }
}

