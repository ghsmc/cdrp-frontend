'use client';

import React from 'react';
import { 
  Bell, 
  X, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Clock,
  MapPin,
  Users
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

export interface Notification {
  id: string;
  type: 'emergency' | 'success' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  metadata?: {
    requestId?: string;
    severity?: string;
    location?: string;
    affectedPeople?: number;
  };
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onNotificationClick: (notification: Notification) => void;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'emergency':
      return AlertTriangle;
    case 'success':
      return CheckCircle;
    case 'warning':
      return Clock;
    default:
      return Info;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'emergency':
      return 'text-white bg-red-500 border border-red-400';
    case 'success':
      return 'text-white bg-green-500 border border-green-400';
    case 'warning':
      return 'text-black bg-yellow-500 border border-yellow-400';
    default:
      return 'text-white bg-blue-500 border border-blue-400';
  }
};

export function NotificationCenter({ 
  isOpen, 
  onClose, 
  notifications, 
  onMarkAsRead,
  onMarkAllAsRead,
  onNotificationClick 
}: NotificationCenterProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-xs glass-ultra border-l border-white/10 shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-white/10">
            <div className="flex items-center gap-1.5">
              <Bell className="h-3.5 w-3.5 text-foreground" />
              <h2 className="text-sm font-medium text-foreground">Alerts</h2>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-1 py-0.5 rounded-full min-w-[1rem] text-center font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/[0.05] rounded-md transition-colors"
            >
              <X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
            </button>
          </div>

          {/* Controls */}
          {unreadCount > 0 && (
            <div className="p-2 border-b border-white/10">
              <button
                onClick={onMarkAllAsRead}
                className="text-[10px] text-primary hover:text-primary/80 transition-colors"
              >
                Mark all as read
              </button>
            </div>
          )}

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Bell className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-lg font-medium text-foreground">No notifications</p>
                <p className="text-sm">You&apos;re all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {notifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.type);
                  const iconColor = getNotificationColor(notification.type);
                  
                  return (
                    <div
                      key={notification.id}
                      onClick={() => onNotificationClick(notification)}
                      className={`p-2 cursor-pointer hover:bg-white/[0.02] transition-colors ${
                        !notification.read ? 'bg-white/[0.02] border-l border-primary/50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div className={`p-1 rounded-md ${iconColor}`}>
                          <Icon className="h-3 w-3" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h3 className={`text-[11px] font-medium leading-tight ${
                              !notification.read ? 'text-foreground' : 'text-muted-foreground'
                            }`}>
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <div className="w-1 h-1 bg-primary rounded-full mt-1 ml-1 flex-shrink-0" />
                            )}
                          </div>
                          
                          <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2 leading-tight">
                            {notification.message}
                          </p>
                          
                          {/* Metadata */}
                          {notification.metadata && (
                            <div className="flex items-center gap-2 mt-1 text-[9px] text-muted-foreground">
                              {notification.metadata.location && (
                                <div className="flex items-center gap-0.5">
                                  <MapPin className="h-2 w-2" />
                                  <span className="truncate max-w-[3rem]">{notification.metadata.location}</span>
                                </div>
                              )}
                              {notification.metadata.affectedPeople && (
                                <div className="flex items-center gap-0.5">
                                  <Users className="h-2 w-2" />
                                  {notification.metadata.affectedPeople}
                                </div>
                              )}
                              {notification.metadata.severity && (
                                <span className={`px-1 py-0.5 rounded text-[8px] font-bold ${
                                  notification.metadata.severity === 'critical' ? 'bg-red-600 text-white' :
                                  notification.metadata.severity === 'high' ? 'bg-orange-600 text-white' :
                                  notification.metadata.severity === 'medium' ? 'bg-yellow-600 text-white' :
                                  'bg-green-600 text-white'
                                }`}>
                                  {notification.metadata.severity.charAt(0).toUpperCase() + notification.metadata.severity.slice(1)}
                                </span>
                              )}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-[9px] text-muted-foreground/60">
                              {formatRelativeTime(notification.timestamp)}
                            </p>
                            
                            {!notification.read && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onMarkAsRead(notification.id);
                                }}
                                className="text-[9px] text-primary hover:text-primary/80 transition-colors"
                              >
                                ✓
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}