'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Shield,
  Edit,
  Camera,
  Save
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatDate } from '@/lib/utils';

const mockUser = {
  id: '1',
  email: 'user@example.com',
  name: 'John Doe',
  role: 'field_agent' as const,
  region_id: '1',
  created_at: '2024-01-01',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  department: 'Emergency Response Unit',
  bio: 'Experienced field agent specializing in disaster response and coordination. 10+ years of experience in emergency management.',
  avatar: null as string | null
};

const regions = [
  { id: '1', name: 'Northeast' },
  { id: '2', name: 'Southeast' },
  { id: '3', name: 'Central' },
  { id: '4', name: 'West Coast' },
];

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: mockUser.name,
    email: mockUser.email,
    phone: mockUser.phone,
    location: mockUser.location,
    department: mockUser.department,
    bio: mockUser.bio,
    region_id: mockUser.region_id
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const handleCancel = () => {
    setFormData({
      name: mockUser.name,
      email: mockUser.email,
      phone: mockUser.phone,
      location: mockUser.location,
      department: mockUser.department,
      bio: mockUser.bio,
      region_id: mockUser.region_id
    });
    setIsEditing(false);
  };

  const getRoleBadgeStyles = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
      case 'regional_coordinator':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'field_agent':
        return 'bg-green-500/20 text-green-400 border border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'regional_coordinator':
        return 'Regional Coordinator';
      case 'field_agent':
        return 'Field Agent';
      default:
        return 'Viewer';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none"></div>
      
      <Header user={mockUser} />
      
      <div className="md:ml-52 px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Profile</h1>
              <p className="text-muted-foreground">Manage your personal information</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground glass border border-white/10 rounded-lg hover:bg-white/[0.05] transition-all"
              >
                <Edit className="h-4 w-4" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="glass rounded-xl border border-white/5 p-6 text-center">
              {/* Avatar */}
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-4xl font-bold text-primary mx-auto">
                  {formData.name.charAt(0).toUpperCase()}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-white hover:bg-primary/90 transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <h2 className="text-xl font-semibold text-foreground mb-2">{formData.name}</h2>
              <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getRoleBadgeStyles(mockUser.role)}`}>
                {getRoleLabel(mockUser.role)}
              </span>
              
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{formData.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{formData.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{formData.location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {formatDate(mockUser.created_at)}</span>
                </div>
              </div>
            </div>

            {/* Activity Stats */}
            <div className="glass rounded-xl border border-white/5 p-6 mt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Activity Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Requests Handled</span>
                  <span className="font-medium text-foreground">127</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Response Time</span>
                  <span className="font-medium text-foreground">2.4h avg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Success Rate</span>
                  <span className="font-medium text-green-400">94%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="glass rounded-xl border border-white/5 p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                    className="w-full glass border border-white/10 rounded-lg px-3 py-2 text-foreground bg-transparent placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50 disabled:opacity-60"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                    className="w-full glass border border-white/10 rounded-lg px-3 py-2 text-foreground bg-transparent placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50 disabled:opacity-60"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                    className="w-full glass border border-white/10 rounded-lg px-3 py-2 text-foreground bg-transparent placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50 disabled:opacity-60"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    disabled={!isEditing}
                    className="w-full glass border border-white/10 rounded-lg px-3 py-2 text-foreground bg-transparent placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50 disabled:opacity-60"
                  />
                </div>
              </div>
            </div>

            {/* Work Information */}
            <div className="glass rounded-xl border border-white/5 p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Work Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    disabled={!isEditing}
                    className="w-full glass border border-white/10 rounded-lg px-3 py-2 text-foreground bg-transparent placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50 disabled:opacity-60"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Region
                  </label>
                  <select
                    value={formData.region_id}
                    onChange={(e) => setFormData({ ...formData, region_id: e.target.value })}
                    disabled={!isEditing}
                    className="w-full glass border border-white/10 rounded-lg px-3 py-2 text-foreground bg-transparent focus:ring-2 focus:ring-primary/50 focus:border-primary/50 disabled:opacity-60"
                  >
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>{region.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full glass border border-white/10 rounded-lg px-3 py-2 text-foreground bg-transparent placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50 disabled:opacity-60"
                />
              </div>
            </div>

            {/* Security */}
            <div className="glass rounded-xl border border-white/5 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Security</h3>
              </div>
              
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 glass border border-white/10 rounded-lg hover:bg-white/[0.05] transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground">Change Password</span>
                    <span className="text-xs text-muted-foreground">Last changed 30 days ago</span>
                  </div>
                </button>
                
                <button className="w-full text-left px-4 py-3 glass border border-white/10 rounded-lg hover:bg-white/[0.05] transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground">Two-Factor Authentication</span>
                    <span className="text-xs text-green-400">Enabled</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}