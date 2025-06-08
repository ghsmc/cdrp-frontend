'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  X, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Clock,
  MapPin,
  ChevronDown,
  ChevronUp
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

interface NotificationPanelProps {
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
      return 'text-red-400';
    case 'success':
      return 'text-green-400';
    case 'warning':
      return 'text-yellow-400';
    default:
      return 'text-blue-400';
  }
};

export function NotificationPanel({ 
  notifications, 
  onMarkAsRead,
  onMarkAllAsRead,
  onNotificationClick 
}: NotificationPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Auto-show panel when new notifications arrive
  useEffect(() => {
    if (unreadCount > 0 && !isVisible) {
      setIsVisible(true);
    }
  }, [unreadCount, isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-20 right-6 z-50 w-80"
    >
      {/* Main Panel */}
      <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">Alerts</span>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                {unreadCount}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors px-2 py-1"
              >
                Clear all
              </button>
            )}
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-white/60" />
              ) : (
                <ChevronUp className="h-4 w-4 text-white/60" />
              )}
            </button>
            
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <X className="h-4 w-4 text-white/60" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center">
                    <Bell className="h-8 w-8 mx-auto text-white/30 mb-2" />
                    <p className="text-sm text-white/60">No alerts</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {notifications.slice(0, 5).map((notification) => {
                      const Icon = getNotificationIcon(notification.type);
                      const iconColor = getNotificationColor(notification.type);
                      
                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          onClick={() => onNotificationClick(notification)}
                          className={`p-3 cursor-pointer hover:bg-white/5 transition-colors ${
                            !notification.read ? 'bg-white/[0.02]' : ''
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <Icon className={`h-4 w-4 ${iconColor} mt-0.5 flex-shrink-0`} />
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <h4 className={`text-sm font-medium leading-tight ${
                                  !notification.read ? 'text-white' : 'text-white/70'
                                }`}>
                                  {notification.title}
                                </h4>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 flex-shrink-0" />
                                )}
                              </div>
                              
                              <p className="text-xs text-white/60 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              
                              {notification.metadata && (
                                <div className="flex items-center gap-3 mt-1.5 text-xs text-white/50">
                                  {notification.metadata.location && (
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      <span className="truncate max-w-[4rem]">{notification.metadata.location}</span>
                                    </div>
                                  )}
                                  {notification.metadata.severity && (
                                    <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${
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
                              
                              <div className="flex items-center justify-between mt-1.5">
                                <span className="text-xs text-white/40">
                                  {formatRelativeTime(notification.timestamp)}
                                </span>
                                
                                {!notification.read && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onMarkAsRead(notification.id);
                                    }}
                                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                  >
                                    ✓
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed Preview */}
        {!isExpanded && notifications.length > 0 && (
          <div className="p-3">
            {notifications.slice(0, 2).map((notification, index) => {
              const Icon = getNotificationIcon(notification.type);
              const iconColor = getNotificationColor(notification.type);
              
              return (
                <div
                  key={notification.id}
                  onClick={() => onNotificationClick(notification)}
                  className={`flex items-center gap-2 cursor-pointer hover:bg-white/5 rounded p-1 transition-colors ${
                    index > 0 ? 'mt-2' : ''
                  }`}
                >
                  <Icon className={`h-3 w-3 ${iconColor} flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white truncate">{notification.title}</p>
                    <p className="text-xs text-white/50 truncate">{notification.message}</p>
                  </div>
                  {!notification.read && (
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                  )}
                </div>
              );
            })}
            
            {notifications.length > 2 && (
              <div className="text-xs text-white/40 text-center mt-2">
                +{notifications.length - 2} more
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}