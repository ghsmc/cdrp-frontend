'use client';

import Link from 'next/link';
import { 
  AlertTriangle, 
  MapPin, 
  BarChart3, 
  Users, 
  Shield, 
  Clock,
  CheckCircle,
  ArrowRight,
  Heart,
  Globe,
  Zap,
  FileText
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const features = [
  {
    name: 'Real-time Emergency Tracking',
    description: 'Track and manage emergency medical requests in real-time with severity levels and status updates.',
    icon: AlertTriangle,
    color: 'bg-red-100 text-red-600',
  },
  {
    name: 'Heat Map Visualization',
    description: 'Visualize crisis severity across regions with interactive heat maps for better situational awareness.',
    icon: MapPin,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    name: 'Multi-level Access Control',
    description: 'Role-based access for first responders, coordinators, and administrators with appropriate permissions.',
    icon: Shield,
    color: 'bg-green-100 text-green-600',
  },
  {
    name: 'Predictive Analytics',
    description: 'Analyze historical data to predict resource needs and pre-position supplies before disasters.',
    icon: BarChart3,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    name: 'Collaborative Response',
    description: 'Enable coordination between local responders and overseeing organizations for efficient triage.',
    icon: Users,
    color: 'bg-indigo-100 text-indigo-600',
  },
  {
    name: 'After Action Analysis',
    description: 'Comprehensive data repository for post-disaster analysis and continuous improvement.',
    icon: CheckCircle,
    color: 'bg-yellow-100 text-yellow-600',
  },
];

const stats = [
  { label: 'Active Regions', value: '24', icon: Globe },
  { label: 'Requests Processed', value: '10,000+', icon: FileText },
  { label: 'Response Time', value: '< 2 hours', icon: Clock },
  { label: 'Organizations', value: '150+', icon: Users },
];

const team = [
  {
    name: 'Crisis Response Team',
    role: 'Platform Development',
    description: 'Dedicated to building tools that save lives during emergencies.',
    icon: Heart
  },
  {
    name: 'Emergency Management',
    role: 'Domain Expertise', 
    description: 'Real-world experience from Hurricane Maria and COVID-19 response.',
    icon: Shield
  },
  {
    name: 'Technology Partners',
    role: 'Infrastructure',
    description: 'Reliable, scalable technology built for critical situations.',
    icon: Zap
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-red-600 p-4 rounded-lg">
                  <AlertTriangle className="h-12 w-12 text-white" />
                </div>
                <span className="text-4xl font-bold text-gray-900">CDRP</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Crisis Data Response Platform
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl leading-8 text-gray-600">
              Born from real-world disaster response experience during Hurricane Maria and COVID-19 local response efforts in New Haven, 
              CDRP empowers first responders and emergency management teams to coordinate relief efforts through real-time data visualization 
              and collaborative response management.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our Mission
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              To bridge the critical gap between emergency medical requests and coordinated response efforts by providing 
              real-time situational awareness, efficient resource allocation, and data-driven decision making tools 
              for disaster relief operations.
            </p>
          </div>
        </div>
      </div>

      {/* Origin Story */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8">
              Built from Experience
            </h2>
            
            <div className="space-y-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Hurricane Maria Response</h3>
                <p className="text-gray-600">
                  During Hurricane Maria&apos;s devastating impact on Puerto Rico, emergency responders faced critical challenges 
                  in coordinating medical supply distribution and tracking urgent needs across affected regions. The lack of 
                  real-time visibility into request status and resource allocation led to delayed responses and inefficient 
                  resource distribution.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">COVID-19 Local Response</h3>
                <p className="text-gray-600">
                  Local disaster response efforts during COVID-19 in New Haven highlighted the need for better coordination 
                  between first responders, regional coordinators, and oversight organizations. The platform addresses these 
                  coordination challenges through role-based access controls and hierarchical data sharing.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Lessons Learned</h3>
                <p className="text-gray-600">
                  These experiences revealed the critical importance of situational awareness through heat map visualization, 
                  predictive resource allocation based on historical data, and secure, role-appropriate access to sensitive 
                  emergency information for effective after-action analysis and continuous improvement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              How CDRP Works
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              A streamlined workflow designed for critical emergency response scenarios
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 mb-6">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Emergency Request Submission
              </h3>
              <p className="text-gray-600">
                First responders submit emergency medical requests with detailed information including urgency levels, 
                affected population estimates, and specific resource requirements. Each request is geotagged and 
                timestamped for accurate tracking.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-6">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Coordination & Approval
              </h3>
              <p className="text-gray-600">
                Regional coordinators review and approve requests, aggregating data for heat map visualization. 
                The system provides real-time situational awareness to help prioritize resources and coordinate 
                response efforts across multiple incidents.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-6">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Analysis & Improvement
              </h3>
              <p className="text-gray-600">
                All response data is stored in a common repository for after-action analysis. Historical patterns 
                enable predictive resource allocation, helping organizations pre-position supplies and improve 
                response times for future disasters.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Platform Capabilities
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Comprehensive tools designed for effective disaster response coordination
            </p>
          </div>
          
          <div className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.name} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`rounded-lg p-2 ${feature.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{feature.name}</h3>
                  </div>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Making an Impact
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              CDRP is actively supporting emergency response efforts worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 text-red-600 mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Data Sources & Partners */}
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Powered by Trusted Data Sources
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              CDRP integrates real-time data from leading government agencies and research institutions 
              to provide comprehensive emergency response capabilities
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 items-center justify-items-center">
            {/* NASA */}
            <div className="group bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all">
              <img 
                src="https://img.logo.dev/nasa.gov?token=pk_VAZ6tvAVQHCDwKeaNRVyjQ"
                alt="NASA"
                className="h-12 mx-auto filter grayscale group-hover:grayscale-0 transition-all"
                onError={(e) => {
                  e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/e/e5/NASA_logo.svg';
                }}
              />
              <p className="text-xs text-center text-gray-600 mt-2">Satellite Data</p>
            </div>

            {/* USGS */}
            <div className="group bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all">
              <img 
                src="https://img.logo.dev/usgs.gov?token=pk_VAZ6tvAVQHCDwKeaNRVyjQ"
                alt="USGS"
                className="h-12 mx-auto filter grayscale group-hover:grayscale-0 transition-all"
                onError={(e) => {
                  e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/1/1c/USGS_logo_green.svg';
                }}
              />
              <p className="text-xs text-center text-gray-600 mt-2">Earthquake Data</p>
            </div>

            {/* NOAA */}
            <div className="group bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all">
              <img 
                src="https://img.logo.dev/noaa.gov?token=pk_VAZ6tvAVQHCDwKeaNRVyjQ"
                alt="NOAA"
                className="h-12 mx-auto filter grayscale group-hover:grayscale-0 transition-all"
                onError={(e) => {
                  e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/7/79/NOAA_logo.svg';
                }}
              />
              <p className="text-xs text-center text-gray-600 mt-2">Weather Data</p>
            </div>

            {/* National Weather Service */}
            <div className="group bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all">
              <img 
                src="https://img.logo.dev/weather.gov?token=pk_VAZ6tvAVQHCDwKeaNRVyjQ"
                alt="National Weather Service"
                className="h-12 mx-auto filter grayscale group-hover:grayscale-0 transition-all"
                onError={(e) => {
                  e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/6/65/US-NationalWeatherService-Logo.svg';
                }}
              />
              <p className="text-xs text-center text-gray-600 mt-2">Weather Forecasts</p>
            </div>

            {/* CDC */}
            <div className="group bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all">
              <img 
                src="https://img.logo.dev/cdc.gov?token=pk_VAZ6tvAVQHCDwKeaNRVyjQ"
                alt="CDC"
                className="h-12 mx-auto filter grayscale group-hover:grayscale-0 transition-all"
                onError={(e) => {
                  e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/8/87/US_CDC_logo.svg';
                }}
              />
              <p className="text-xs text-center text-gray-600 mt-2">Health Data</p>
            </div>

            {/* FEMA */}
            <div className="group bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all">
              <img 
                src="https://img.logo.dev/fema.gov?token=pk_VAZ6tvAVQHCDwKeaNRVyjQ"
                alt="FEMA"
                className="h-12 mx-auto filter grayscale group-hover:grayscale-0 transition-all"
                onError={(e) => {
                  e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/4/49/Seal_of_the_Federal_Emergency_Management_Agency.svg';
                }}
              />
              <p className="text-xs text-center text-gray-600 mt-2">Emergency Mgmt</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500 mb-4">
              Real-time data integration ensures CDRP provides the most current information for emergency response decisions
            </p>
            <Link 
              href="/data-sources"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Explore All Data Sources <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our Team
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Combining emergency response expertise with cutting-edge technology
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {team.map((member) => {
              const Icon = member.icon;
              return (
                <div key={member.name} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-sm font-medium text-red-600 mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-red-600">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Join the Emergency Response Network
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-red-100">
              Whether you&apos;re a first responder, emergency coordinator, or part of an oversight organization, 
              CDRP provides the tools you need to save lives and coordinate effective disaster relief.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/register"
                className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-50 transition-colors"
              >
                Request Access
              </Link>
              <Link
                href="/login"
                className="rounded-lg bg-red-700 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-800 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}