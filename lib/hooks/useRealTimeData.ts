'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api/client';
import { toast } from 'react-hot-toast';

interface DashboardStats {
  status_counts: Record<string, number>;
  severity_counts: Record<string, number>;
  recent_requests: Record<string, unknown>[];
  region_counts: Record<string, number>;
  total_requests: number;
  total_affected_people: number;
}

interface ExternalDataSource {
  name: string;
  status: 'active' | 'inactive' | 'error';
  last_updated: string;
  records_count: number;
  description: string;
}

export function useRealTimeData() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [requests, setRequests] = useState<Record<string, unknown>[]>([]);
  const [externalSources, setExternalSources] = useState<ExternalDataSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchDashboardStats = useCallback(async () => {
    try {
      const stats = await apiClient.getDashboardStats();
      setDashboardStats(stats);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      toast.error('Failed to load dashboard statistics');
    }
  }, []);

  const fetchRequests = useCallback(async (params?: Record<string, unknown>) => {
    try {
      const response = await apiClient.getRequests(params);
      setRequests(response.requests || []);
      return response;
    } catch (error) {
      console.error('Failed to fetch requests:', error);
      toast.error('Failed to load emergency requests');
      return { requests: [] };
    }
  }, []);

  const fetchExternalSources = useCallback(async () => {
    try {
      const sources = await apiClient.getExternalDataSources();
      setExternalSources(sources.sources || []);
    } catch (error) {
      console.error('Failed to fetch external sources:', error);
    }
  }, []);

  const importEarthquakeData = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await apiClient.importEarthquakeData();
      toast.success(`Imported ${result.imported_count || 0} earthquake records`);
      
      // Refresh dashboard stats and requests
      await Promise.all([
        fetchDashboardStats(),
        fetchRequests(),
        fetchExternalSources()
      ]);
      
      return result;
    } catch (error) {
      console.error('Failed to import earthquake data:', error);
      toast.error('Failed to import earthquake data');
    } finally {
      setIsLoading(false);
    }
  }, [fetchDashboardStats, fetchRequests, fetchExternalSources]);

  const importWeatherAlerts = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await apiClient.importWeatherAlerts();
      toast.success(`Imported ${result.imported_count || 0} weather alerts`);
      
      // Refresh dashboard stats and requests
      await Promise.all([
        fetchDashboardStats(),
        fetchRequests(),
        fetchExternalSources()
      ]);
      
      return result;
    } catch (error) {
      console.error('Failed to import weather alerts:', error);
      toast.error('Failed to import weather alerts');
    } finally {
      setIsLoading(false);
    }
  }, [fetchDashboardStats, fetchRequests, fetchExternalSources]);

  const importAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await apiClient.importAllExternalData();
      toast.success(`Imported data from all external sources`);
      
      // Refresh all data
      await Promise.all([
        fetchDashboardStats(),
        fetchRequests(),
        fetchExternalSources()
      ]);
      
      return result;
    } catch (error) {
      console.error('Failed to import all external data:', error);
      toast.error('Failed to import external data');
    } finally {
      setIsLoading(false);
    }
  }, [fetchDashboardStats, fetchRequests, fetchExternalSources]);

  const refreshAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchDashboardStats(),
        fetchRequests(),
        fetchExternalSources()
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [fetchDashboardStats, fetchRequests, fetchExternalSources]);

  // Initial data load
  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshAllData();
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshAllData]);

  return {
    // Data
    dashboardStats,
    requests,
    externalSources,
    isLoading,
    lastUpdated,
    
    // Actions
    fetchDashboardStats,
    fetchRequests,
    fetchExternalSources,
    importEarthquakeData,
    importWeatherAlerts,
    importAllData,
    refreshAllData,
  };
}