// API Service Configuration
// Configure this file to point to your backend server

// Default API URL - change this to your backend server URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  headers?: Record<string, string>;
}

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    // Try to restore token from localStorage
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { method = 'GET', body, headers = {} } = config;

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    if (this.token) {
      requestHeaders['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      const errorMessage = error.error || error.message || error.details || 'Request failed';
      const apiError = new Error(errorMessage) as Error & { status?: number };
      apiError.status = response.status;
      throw apiError;
    }

    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<{ success: boolean; user: unknown; token: string }>('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  }

  async register(email: string, password: string, name?: string) {
    return this.request<{ success: boolean; user: unknown; token: string }>('/auth/register', {
      method: 'POST',
      body: { email, password, name },
    });
  }

  async logout() {
    // Clear token locally, backend doesn't need to do anything for JWT
    this.setToken(null);
    return Promise.resolve();
  }

  async getCurrentUser() {
    return this.request<{ success: boolean; user: unknown }>('/auth/me');
  }

  // Profile endpoints
  async getProfile() {
    return this.request<{ success: boolean; profile: unknown | null }>('/profiles/me');
  }

  async getAllProfiles() {
    return this.request<{ success: boolean; profiles: unknown[] }>('/profiles/all');
  }

  async createProfile(data: { fullName: string; birthDate: string; birthTime?: string; birthPlace?: string; setAsActive?: boolean }) {
    return this.request<{ success: boolean; profile: unknown }>('/profiles/me', {
      method: 'POST',
      body: data,
    });
  }

  async updateProfile(profileId: string, data: { fullName: string; birthDate: string; birthTime?: string; birthPlace?: string }) {
    return this.request<{ success: boolean; profile: unknown }>(`/profiles/${profileId}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteProfile(profileId?: string) {
    const endpoint = profileId ? `/profiles/${profileId}` : '/profiles/me';
    return this.request<{ success: boolean; message: string }>(endpoint, { method: 'DELETE' });
  }

  async setActiveProfile(profileId: string) {
    return this.request<{ success: boolean; profile: unknown }>(`/profiles/${profileId}/activate`, {
      method: 'POST',
    });
  }

  // Predictions endpoints
  async getDailyPrediction(birthDate: string) {
    return this.request<{ prediction: unknown }>(`/predictions/daily?birthDate=${birthDate}`);
  }

  async getMonthlyPrediction(birthDate: string, month: number, year: number) {
    return this.request<{ prediction: unknown }>(`/predictions/monthly?birthDate=${birthDate}&month=${month}&year=${year}`);
  }

  // Journal endpoints
  async createJournalEntry(data: {
    entryType: 'journal' | 'prediction';
    title: string;
    content?: string;
    date?: string;
    numerologyData?: Record<string, unknown>;
    tags?: string[];
    mood?: string;
  }) {
    return this.request<{ success: boolean; entry: unknown }>('/journal/entry', {
      method: 'POST',
      body: data,
    });
  }

  async getJournalEntries(filters?: {
    entryType?: 'journal' | 'prediction';
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }) {
    const params = new URLSearchParams();
    if (filters?.entryType) params.append('entryType', filters.entryType);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const query = params.toString();
    return this.request<{ success: boolean; entries: unknown[]; total: number }>(
      `/journal/entries${query ? `?${query}` : ''}`
    );
  }

  async updateJournalEntry(entryId: string, data: {
    title?: string;
    content?: string;
    date?: string;
    numerologyData?: Record<string, unknown>;
    tags?: string[];
    mood?: string;
  }) {
    return this.request<{ success: boolean; entry: unknown }>(`/journal/entry/${entryId}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteJournalEntry(entryId: string) {
    return this.request<{ success: boolean; message: string }>(`/journal/entry/${entryId}`, {
      method: 'DELETE',
    });
  }

  async getJournalStatistics(filters?: { startDate?: string; endDate?: string }) {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const query = params.toString();
    return this.request<{ success: boolean; statistics: unknown }>(
      `/journal/statistics${query ? `?${query}` : ''}`
    );
  }

  // Subscription endpoints
  async getSubscriptionPlans() {
    return this.request<{ success: boolean; plans: unknown[] }>('/subscriptions/plans');
  }

  async getSubscriptionStatus() {
    return this.request<{ success: boolean; subscription: unknown | null; plan: unknown; isPremium: boolean }>('/subscriptions/status');
  }

  async createSubscription(data: { planId: number; billingPeriod?: 'monthly' | 'yearly' }) {
    return this.request<{ success: boolean; subscription: unknown }>('/subscriptions/create', {
      method: 'POST',
      body: data,
    });
  }

  async cancelSubscription() {
    return this.request<{ success: boolean; message: string; subscription: unknown }>('/subscriptions/cancel', {
      method: 'POST',
    });
  }

  async checkSubscription() {
    return this.request<{ success: boolean; isPremium: boolean; planName: string; status: string; endDate?: string }>('/subscriptions/check');
  }
}

export const api = new ApiService(API_BASE_URL);
export default api;
