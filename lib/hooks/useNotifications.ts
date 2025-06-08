'use client';

import { useState, useEffect, useCallback } from 'react';
import { Notification } from '@/components/notifications/NotificationCenter';

export interface NotificationPreferences {
  enableAudio: boolean;
  enableEmergencyAudio: boolean;
  enableWarningAudio: boolean;
  audioVolume: number;
  showEmergencyNotifications: boolean;
  showSuccessNotifications: boolean;
  showWarningNotifications: boolean;
  showInfoNotifications: boolean;
  notificationFrequency: 'low' | 'medium' | 'high'; // low: 5-8min, medium: 2-3min, high: 30s-1min
}

// Mock WebSocket implementation for real-time notifications
class MockWebSocket {
  private listeners: { [key: string]: ((...args: unknown[]) => void)[] } = {};
  private intervalId: NodeJS.Timeout | null = null;
  private frequency: 'low' | 'medium' | 'high' = 'medium';

  constructor(url: string, frequency: 'low' | 'medium' | 'high' = 'medium') {
    this.frequency = frequency;
    // Simulate connection
    setTimeout(() => {
      this.emit('open', {});
      this.startMockNotifications();
    }, 1000);
  }

  addEventListener(event: string, listener: (...args: unknown[]) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  }

  removeEventListener(event: string, listener: (...args: unknown[]) => void) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(l => l !== listener);
    }
  }

  emit(event: string, data: unknown) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(listener => listener(data));
    }
  }

  close() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private startMockNotifications() {
    const scheduleNext = () => {
      // Determine delay based on frequency preference
      let delay: number;
      switch (this.frequency) {
        case 'low':
          delay = Math.random() * 180000 + 300000; // 5-8 minutes
          break;
        case 'high':
          delay = Math.random() * 30000 + 30000; // 30s-1min
          break;
        case 'medium':
        default:
          delay = Math.random() * 60000 + 120000; // 2-3 minutes
          break;
      }
      setTimeout(() => {
        const mockNotifications = [
          {
            type: 'emergency',
            title: 'New Critical Emergency Request',
            message: 'Medical supplies urgently needed in downtown area',
            metadata: {
              requestId: 'req-' + Date.now(),
              severity: 'critical',
              location: 'Downtown Medical Center',
              affectedPeople: 25
            }
          },
          {
            type: 'success',
            title: 'Emergency Request Completed',
            message: 'Water purification request has been successfully resolved',
            metadata: {
              requestId: 'req-' + (Date.now() - 1000),
              severity: 'high',
              location: 'North District',
              affectedPeople: 150
            }
          },
          {
            type: 'warning',
            title: 'Resource Shortage Alert',
            message: 'Medical supplies running low in western region',
            metadata: {
              location: 'Western District',
              severity: 'medium'
            }
          },
          {
            type: 'info',
            title: 'Status Update',
            message: 'Emergency coordinator has been assigned to your request',
            metadata: {
              requestId: 'req-' + (Date.now() - 2000)
            }
          }
        ];

        const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
        
        this.emit('message', {
          data: JSON.stringify({
            type: 'notification',
            notification: {
              id: 'notif-' + Date.now(),
              ...randomNotification,
              timestamp: new Date().toISOString(),
              read: false
            }
          })
        });
        
        scheduleNext(); // Schedule the next notification
      }, delay);
    };
    
    scheduleNext(); // Start the cycle
  }
}

const defaultPreferences: NotificationPreferences = {
  enableAudio: true,
  enableEmergencyAudio: true,
  enableWarningAudio: false,
  audioVolume: 0.1,
  showEmergencyNotifications: true,
  showSuccessNotifications: true,
  showWarningNotifications: true,
  showInfoNotifications: true,
  notificationFrequency: 'medium'
};

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [, setWs] = useState<MockWebSocket | null>(null);
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);

  // Load preferences from localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem('notificationPreferences');
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences({ ...defaultPreferences, ...parsed });
      } catch (error) {
        console.warn('Failed to parse notification preferences:', error);
      }
    }
  }, []);

  // Save preferences to localStorage when they change
  const updatePreferences = useCallback((newPreferences: Partial<NotificationPreferences>) => {
    const updated = { ...preferences, ...newPreferences };
    setPreferences(updated);
    localStorage.setItem('notificationPreferences', JSON.stringify(updated));
  }, [preferences]);

  // Initialize WebSocket connection
  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000/ws';
    const websocket = new MockWebSocket(wsUrl, preferences.notificationFrequency);

    const handleOpen = () => {
      setIsConnected(true);
      console.log('Connected to notification service');
    };

    const handleMessage = (event: { data: string }) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'notification') {
          const notification = data.notification as Notification;
          
          // Check if this notification type should be shown based on preferences
          const shouldShow = (
            (notification.type === 'emergency' && preferences.showEmergencyNotifications) ||
            (notification.type === 'success' && preferences.showSuccessNotifications) ||
            (notification.type === 'warning' && preferences.showWarningNotifications) ||
            (notification.type === 'info' && preferences.showInfoNotifications)
          );
          
          if (!shouldShow) return;
          
          // Batch similar notifications
          setNotifications(prev => {
            // Check for similar notifications to batch (same type and location within 5 minutes)
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
            const similarNotifications = prev.filter(existing => 
              existing.type === notification.type &&
              existing.metadata?.location === notification.metadata?.location &&
              new Date(existing.timestamp) > fiveMinutesAgo
            );
            
            if (similarNotifications.length > 0) {
              // Update the most recent similar notification with batch info
              const batchedNotification = {
                ...notification,
                title: `${notification.title} (${similarNotifications.length + 1} alerts)`,
                message: `${notification.message} and ${similarNotifications.length} similar alert${similarNotifications.length > 1 ? 's' : ''}`
              };
              
              // Remove similar notifications and add the batched one
              const filteredPrev = prev.filter(existing => !similarNotifications.includes(existing));
              return [batchedNotification, ...filteredPrev];
            }
            
            // No similar notifications found, add as normal
            return [notification, ...prev];
          });
          
          // Play notification sound based on preferences
          if (preferences.enableAudio) {
            const shouldPlayAudio = (
              (notification.type === 'emergency' && preferences.enableEmergencyAudio && notification.metadata?.severity === 'critical') ||
              (notification.type === 'warning' && preferences.enableWarningAudio)
            );
            
            if (shouldPlayAudio) {
              playNotificationSound(preferences.audioVolume);
            }
          }
        }
      } catch (error) {
        console.error('Failed to parse notification:', error);
      }
    };

    const handleClose = () => {
      setIsConnected(false);
      console.log('Disconnected from notification service');
    };

    const handleError = (error: unknown) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    websocket.addEventListener('open', handleOpen);
    websocket.addEventListener('message', handleMessage);
    websocket.addEventListener('close', handleClose);
    websocket.addEventListener('error', handleError);

    setWs(websocket);

    // Load initial notifications
    loadInitialNotifications();

    return () => {
      websocket.close();
    };
  }, [
    preferences.notificationFrequency,
    preferences.enableAudio,
    preferences.enableEmergencyAudio,
    preferences.enableWarningAudio,
    preferences.audioVolume,
    preferences.showEmergencyNotifications,
    preferences.showSuccessNotifications,
    preferences.showWarningNotifications,
    preferences.showInfoNotifications
  ]);

  const loadInitialNotifications = async () => {
    // Simulate loading notifications from API
    const mockInitialNotifications: Notification[] = [
      {
        id: 'notif-1',
        type: 'emergency',
        title: 'Critical Medical Supply Request',
        message: 'Insulin shortage reported in Puerto Rico Zone 3',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        read: false,
        metadata: {
          requestId: 'req-1',
          severity: 'critical',
          location: 'San Juan, Puerto Rico',
          affectedPeople: 50
        }
      },
      {
        id: 'notif-2',
        type: 'success',
        title: 'Request Approved',
        message: 'Your water purification request has been approved',
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        read: false,
        metadata: {
          requestId: 'req-2',
          severity: 'high',
          location: 'New Orleans, Louisiana'
        }
      },
      {
        id: 'notif-3',
        type: 'info',
        title: 'System Maintenance',
        message: 'Scheduled maintenance completed successfully',
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        read: true
      }
    ];

    setNotifications(mockInitialNotifications);
  };

  const playNotificationSound = useCallback((volume: number = 0.1) => {
    try {
      // Create a softer, less aggressive notification sound
      const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Softer, more pleasant tone progression
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(700, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.2);
      
      // Much lower volume and softer decay
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.warn('Could not play notification sound:', error);
    }
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const getUnreadCount = useCallback(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  return {
    notifications,
    isConnected,
    unreadCount: getUnreadCount(),
    markAsRead,
    markAllAsRead,
    removeNotification,
    playNotificationSound,
    preferences,
    updatePreferences
  };
}