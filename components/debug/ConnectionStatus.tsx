'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';
import { CheckCircle, XCircle, AlertCircle, Wifi, WifiOff } from 'lucide-react';

export function ConnectionStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected' | 'error'>('checking');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [backendInfo, setBackendInfo] = useState<any>(null);

  const checkConnection = async () => {
    setStatus('checking');
    try {
      // Test basic connectivity first
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'}/health`);
      
      if (response.ok) {
        const data = await response.json();
        setBackendInfo(data);
        setStatus('connected');
      } else {
        setStatus('disconnected');
      }
    } catch (error) {
      console.error('Connection check failed:', error);
      setStatus('error');
    }
    setLastCheck(new Date());
  };

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'disconnected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'error':
        return <WifiOff className="h-4 w-4 text-red-500" />;
      case 'checking':
        return <AlertCircle className="h-4 w-4 text-yellow-500 animate-pulse" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Backend Connected';
      case 'disconnected':
        return 'Backend Disconnected';
      case 'error':
        return 'Connection Error';
      case 'checking':
        return 'Checking...';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'border-green-500/30 bg-green-500/10';
      case 'disconnected':
        return 'border-red-500/30 bg-red-500/10';
      case 'error':
        return 'border-red-500/30 bg-red-500/10';
      case 'checking':
        return 'border-yellow-500/30 bg-yellow-500/10';
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 glass rounded-xl border p-3 ${getStatusColor()} backdrop-blur-xl`}>
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <div className="text-xs">
          <div className="font-medium text-foreground">{getStatusText()}</div>
          {lastCheck && (
            <div className="text-muted-foreground text-[10px]">
              Last check: {lastCheck.toLocaleTimeString()}
            </div>
          )}
        </div>
        <button
          onClick={checkConnection}
          className="ml-2 p-1 hover:bg-white/[0.05] rounded transition-colors"
          title="Refresh connection status"
        >
          <Wifi className="h-3 w-3 text-muted-foreground hover:text-foreground" />
        </button>
      </div>
      
      {backendInfo && status === 'connected' && (
        <div className="mt-2 pt-2 border-t border-white/10">
          <div className="text-[10px] text-muted-foreground">
            Status: {backendInfo.status}
          </div>
          <div className="text-[10px] text-muted-foreground">
            API: {process.env.NEXT_PUBLIC_API_URL}
          </div>
        </div>
      )}
    </div>
  );
}