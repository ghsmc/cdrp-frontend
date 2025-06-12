'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { LiveDataDashboard } from '@/components/dashboard/LiveDataDashboard';
import { useRealTimeData } from '@/lib/hooks/useRealTimeData';
import { 
  AlertTriangle, 
  MapPin, 
  BarChart3, 
  Activity,
  Zap,
  Shield,
  Users,
  Clock,
  TrendingUp,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  Globe,
  Radio,
  Heart
} from 'lucide-react';

const mockUser = {
  id: '1',
  email: 'responder@example.com',
  name: 'Sarah Chen',
  role: 'field_agent' as const,
  region_id: '1',
  created_at: '2024-01-01',
};

// Dynamic stats based on real data
const getStats = (dashboardStats: any) => {
  if (!dashboardStats) {
    return [
      { label: 'Active Emergencies', value: '...', change: '', trend: 'up', icon: AlertTriangle },
      { label: 'Critical Alerts', value: '...', change: '', trend: 'down', icon: Clock },
      { label: 'Total Requests', value: '...', change: '', trend: 'up', icon: Users },
      { label: 'People Affected', value: '...', change: '', trend: 'up', icon: Heart },
    ];
  }

  const activeEmergencies = (dashboardStats.status_counts?.pending || 0) + 
                          (dashboardStats.status_counts?.approved || 0) + 
                          (dashboardStats.status_counts?.in_progress || 0);
  
  const criticalCount = dashboardStats.severity_counts?.critical || 0;
  const totalRequests = dashboardStats.total_requests || 0;
  const totalAffected = dashboardStats.total_affected_people || 0;

  return [
    { 
      label: 'Active Emergencies', 
      value: activeEmergencies.toString(), 
      change: '+12%', 
      trend: 'up', 
      icon: AlertTriangle 
    },
    { 
      label: 'Critical Alerts', 
      value: criticalCount.toString(), 
      change: '-25%', 
      trend: 'down', 
      icon: Clock 
    },
    { 
      label: 'Total Requests', 
      value: totalRequests.toString(), 
      change: '+8%', 
      trend: 'up', 
      icon: Users 
    },
    { 
      label: 'People Affected', 
      value: totalAffected > 1000 ? `${(totalAffected/1000).toFixed(1)}K` : totalAffected.toString(), 
      change: '+35%', 
      trend: 'up', 
      icon: Heart 
    },
  ];
};

const criticalAlerts = [
  {
    id: 1,
    type: 'Medical Emergency',
    location: 'San Juan, PR',
    severity: 'critical',
    time: '2 min ago',
    responders: 3,
  },
  {
    id: 2,
    type: 'Flood Response',
    location: 'Miami, FL',
    severity: 'high',
    time: '15 min ago',
    responders: 8,
  },
  {
    id: 3,
    type: 'Search & Rescue',
    location: 'Houston, TX',
    severity: 'medium',
    time: '1 hour ago',
    responders: 5,
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('overview');
  const [time, setTime] = useState(new Date());
  
  // Real-time data integration
  const {
    dashboardStats,
    requests,
    externalSources,
    isLoading,
    lastUpdated,
    importAllData,
    refreshAllData
  } = useRealTimeData();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
      
      <Header user={mockUser} />
      
      {/* Hero Section */}
      <div className="md:ml-52 pt-20 md:pt-8 pb-8 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            {/* Hero Logo and Title */}
            <div className="flex flex-col items-center mb-3">
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-4">
                <div className="relative">
                  <img 
                    src="/cdrp-logo.png" 
                    alt="CDRP - Crisis Data Response Platform"
                    className="w-32 h-32 md:w-48 md:h-48 rounded-2xl md:rounded-3xl shadow-2xl"
                  />
                </div>
                
                <div className="text-center md:text-left">
                  <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-2 font-inter">
                    <span className="text-gradient">CDRP</span>
                  </h1>
                  <h2 className="text-xs md:text-sm lg:text-base font-mono font-semibold text-white/60 tracking-[0.15em] md:tracking-[0.2em] uppercase">
                    CRISIS DATA RESPONSE PLATFORM
                  </h2>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Live Data Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <LiveDataDashboard />
          </motion.div>

          {/* Data Sources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 md:mt-12"
          >
            <div className="glass rounded-2xl border border-white/5 p-4 md:p-8">
              <div className="text-center mb-6 md:mb-8">
                <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">
                  Powered by Real-Time Data
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Integrating multiple data sources for comprehensive emergency response
                </p>
                <Link 
                  href="/data-sources"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  View All Data Sources <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 items-center justify-items-center">
                {/* NASA */}
                <div className="group text-center">
                  <div className="w-12 h-12 mx-auto mb-2 glass border border-white/10 rounded-xl flex items-center justify-center group-hover:border-blue-400/50 transition-all">
                    <Radio className="h-6 w-6 text-white/60 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <p className="text-xs text-muted-foreground opacity-70">NASA Satellite</p>
                </div>

                {/* USGS */}
                <div className="group text-center">
                  <div className="w-12 h-12 mx-auto mb-2 glass border border-white/10 rounded-xl flex items-center justify-center group-hover:border-orange-400/50 transition-all">
                    <Globe className="h-6 w-6 text-white/60 group-hover:text-orange-400 transition-colors" />
                  </div>
                  <p className="text-xs text-muted-foreground opacity-70">USGS Earthquakes</p>
                </div>

                {/* NOAA */}
                <div className="group text-center">
                  <div className="w-12 h-12 mx-auto mb-2 glass border border-white/10 rounded-xl flex items-center justify-center group-hover:border-green-400/50 transition-all">
                    <Activity className="h-6 w-6 text-white/60 group-hover:text-green-400 transition-colors" />
                  </div>
                  <p className="text-xs text-muted-foreground opacity-70">NOAA Weather</p>
                </div>

                {/* NWS */}
                <div className="group text-center">
                  <div className="w-12 h-12 mx-auto mb-2 glass border border-white/10 rounded-xl flex items-center justify-center group-hover:border-sky-400/50 transition-all">
                    <Zap className="h-6 w-6 text-white/60 group-hover:text-sky-400 transition-colors" />
                  </div>
                  <p className="text-xs text-muted-foreground opacity-70">Weather Service</p>
                </div>

                {/* CDC */}
                <div className="group text-center">
                  <div className="w-12 h-12 mx-auto mb-2 glass border border-white/10 rounded-xl flex items-center justify-center group-hover:border-purple-400/50 transition-all">
                    <Heart className="h-6 w-6 text-white/60 group-hover:text-purple-400 transition-colors" />
                  </div>
                  <p className="text-xs text-muted-foreground opacity-70">CDC Health</p>
                </div>

                {/* FEMA */}
                <div className="group text-center">
                  <div className="w-12 h-12 mx-auto mb-2 glass border border-white/10 rounded-xl flex items-center justify-center group-hover:border-red-400/50 transition-all">
                    <Shield className="h-6 w-6 text-white/60 group-hover:text-red-400 transition-colors" />
                  </div>
                  <p className="text-xs text-muted-foreground opacity-70">FEMA Emergency</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}