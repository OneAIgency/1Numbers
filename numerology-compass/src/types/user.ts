// User types for the numerology application
// These types are designed to work with any backend implementation

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  fullName: string;
  birthDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface NumerologyProfile {
  id: string;
  userId: string;
  fullName: string;
  birthDate: Date;
  lifePath: number;
  destiny: number;
  soulUrge: number;
  personality: number;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name?: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}
