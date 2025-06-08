import axios, { AxiosInstance, AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling and token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as typeof error.config & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              const response = await this.client.post('/auth/refresh', {
                refresh_token: refreshToken,
              });
              
              localStorage.setItem('access_token', response.data.access_token);
              
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
              }
              
              return this.client(originalRequest);
            }
          } catch (_refreshError) {
            // Refresh failed, redirect to login
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
          }
        }

        // Show error toast for non-auth errors
        if (error.response?.status !== 401) {
          const errorMessage = (error.response?.data as { message?: string })?.message || 'An error occurred';
          toast.error(errorMessage);
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);
    return response.data;
  }

  async logout() {
    try {
      await this.client.post('/auth/logout');
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  async getProfile() {
    const response = await this.client.get('/auth/profile');
    return response.data;
  }

  // Emergency requests endpoints
  async getRequests(params?: Record<string, unknown>) {
    const response = await this.client.get('/requests', { params });
    return response.data;
  }

  async getRequest(id: string) {
    const response = await this.client.get(`/requests/${id}`);
    return response.data;
  }

  async createRequest(data: Record<string, unknown>) {
    const response = await this.client.post('/requests', data);
    return response.data;
  }

  async updateRequest(id: string, data: Record<string, unknown>) {
    const response = await this.client.put(`/requests/${id}`, data);
    return response.data;
  }

  async deleteRequest(id: string) {
    const response = await this.client.delete(`/requests/${id}`);
    return response.data;
  }

  // Dashboard analytics
  async getDashboardStats() {
    const response = await this.client.get('/analytics/dashboard');
    return response.data;
  }

  // Regions
  async getRegions() {
    const response = await this.client.get('/regions');
    return response.data;
  }

  // Disaster types
  async getDisasterTypes() {
    const response = await this.client.get('/disaster-types');
    return response.data;
  }

  // Users (admin only)
  async getUsers() {
    const response = await this.client.get('/users');
    return response.data;
  }

  // Audit logs (admin only)
  async getAuditLogs(params?: Record<string, unknown>) {
    const response = await this.client.get('/audit-logs', { params });
    return response.data;
  }

  // External Data Integration endpoints
  async importEarthquakeData() {
    const response = await this.client.post('/data/import/earthquakes');
    return response.data;
  }

  async importWeatherAlerts() {
    const response = await this.client.post('/data/import/weather-alerts');
    return response.data;
  }

  async importAllExternalData() {
    const response = await this.client.post('/data/import/all');
    return response.data;
  }

  async getExternalDataSources() {
    const response = await this.client.get('/data/sources');
    return response.data;
  }

  // Health check
  async checkHealth() {
    const response = await this.client.get('/health');
    return response.data;
  }
}

export const apiClient = new ApiClient();