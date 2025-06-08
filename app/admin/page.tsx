'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { User } from '@/types';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  Eye,
  CheckCircle,
  XCircle,
  Activity,
  Calendar,
  Mail,
  Building
} from 'lucide-react';
import { formatRelativeTime, formatDate } from '@/lib/utils';
import { toast } from 'react-hot-toast';

const mockAdmin = {
  id: '1',
  email: 'admin@cdrp.com',
  name: 'Admin User',
  role: 'admin' as const,
  region_id: undefined,
  created_at: '2024-01-01',
};

const mockUsers: User[] = [
  {
    id: '1',
    email: 'maria.rodriguez@puertorico-emergency.gov',
    name: 'Maria Rodriguez',
    role: 'field_agent',
    region_id: '1',
    created_at: '2024-01-01T10:00:00Z'
  },
  {
    id: '2',
    email: 'carlos.santos@fema.gov',
    name: 'Carlos Santos',
    role: 'regional_coordinator',
    region_id: '1',
    created_at: '2024-01-02T10:00:00Z'
  },
  {
    id: '3',
    email: 'jennifer.chen@redcross.org',
    name: 'Jennifer Chen',
    role: 'field_agent',
    region_id: '2',
    created_at: '2024-01-03T10:00:00Z'
  },
  {
    id: '4',
    email: 'michael.johnson@emergency.gov',
    name: 'Michael Johnson',
    role: 'regional_coordinator',
    region_id: '3',
    created_at: '2024-01-04T10:00:00Z'
  },
  {
    id: '5',
    email: 'sarah.wilson@hospital.org',
    name: 'Sarah Wilson',
    role: 'viewer',
    region_id: '2',
    created_at: '2024-01-05T10:00:00Z'
  }
];

const regions = [
  { id: '1', name: 'Northeast' },
  { id: '2', name: 'Southeast' },
  { id: '3', name: 'Central' },
  { id: '4', name: 'West Coast' },
  { id: '5', name: 'International' }
];

const roleLabels = {
  admin: 'Administrator',
  regional_coordinator: 'Regional Coordinator',
  field_agent: 'Field Agent',
  viewer: 'Viewer'
};

const roleColors = {
  admin: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
  regional_coordinator: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  field_agent: 'bg-green-500/20 text-green-400 border border-green-500/30',
  viewer: 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
};

interface UserTableProps {
  users: User[];
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onViewUser: (user: User) => void;
}

function UserTable({ users, onEditUser, onDeleteUser, onViewUser }: UserTableProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleAllUsers = () => {
    setSelectedUsers(prev => 
      prev.length === users.length ? [] : users.map(u => u.id)
    );
  };

  const getRegionName = (regionId: string | null | undefined) => {
    if (!regionId) return 'All Regions';
    return regions.find(r => r.id === regionId)?.name || 'Unknown';
  };

  return (
    <div className="glass rounded-xl border border-white/5 overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-foreground">Users</h3>
          {selectedUsers.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {selectedUsers.length} selected
              </span>
              <button className="px-3 py-1 text-sm text-primary hover:text-primary/80 transition-colors">
                Delete Selected
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="w-4 px-6 py-3">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === users.length}
                  onChange={toggleAllUsers}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Region
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleUserSelection(user.id)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-sm font-medium text-primary">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-foreground">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${roleColors[user.role]}`}>
                    {roleLabels[user.role]}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {getRegionName(user.region_id)}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {formatDate(user.created_at)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewUser(user)}
                      className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                      title="View User"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEditUser(user)}
                      className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                      title="Edit User"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteUser(user)}
                      className="p-1 text-muted-foreground hover:text-primary transition-colors"
                      title="Delete User"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [loading, setLoading] = useState(false);

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = users;

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply role filter
    if (roleFilter) {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Apply region filter
    if (regionFilter) {
      filtered = filtered.filter(user => user.region_id === regionFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, regionFilter]);

  const handleDeleteUser = async (user: User) => {
    if (!confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsers(prev => prev.filter(u => u.id !== user.id));
      toast.success(`${user.name} has been deleted`);
    } catch (error) {
      toast.error('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setRoleFilter('');
    setRegionFilter('');
  };

  const hasActiveFilters = searchTerm || roleFilter || regionFilter;

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none"></div>
      
      <Header user={mockAdmin} />
      
      <div className="md:ml-52 px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">User Management</h1>
              <p className="text-muted-foreground">Manage user accounts and permissions</p>
            </div>
          </div>
          
          <Link
            href="/admin/users/new"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25"
          >
            <UserPlus className="h-4 w-4" />
            Add User
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="glass rounded-xl p-6 border border-white/5 card-hover">
            <div className="text-sm text-muted-foreground">Total Users</div>
            <div className="text-3xl font-bold text-foreground">{filteredUsers.length}</div>
          </div>
          <div className="glass rounded-xl p-6 border border-white/5 card-hover">
            <div className="text-sm text-muted-foreground">Admins</div>
            <div className="text-3xl font-bold text-purple-400">
              {filteredUsers.filter(u => u.role === 'admin').length}
            </div>
          </div>
          <div className="glass rounded-xl p-6 border border-white/5 card-hover">
            <div className="text-sm text-muted-foreground">Coordinators</div>
            <div className="text-3xl font-bold text-blue-400">
              {filteredUsers.filter(u => u.role === 'regional_coordinator').length}
            </div>
          </div>
          <div className="glass rounded-xl p-6 border border-white/5 card-hover">
            <div className="text-sm text-muted-foreground">Field Agents</div>
            <div className="text-3xl font-bold text-green-400">
              {filteredUsers.filter(u => u.role === 'field_agent').length}
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="glass rounded-xl border border-white/5 p-6 mb-8">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 glass border border-white/10 rounded-lg text-foreground bg-transparent placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="glass border border-white/10 rounded-lg px-3 py-2 text-foreground bg-transparent focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
            >
              <option value="">All Roles</option>
              {Object.entries(roleLabels).map(([role, label]) => (
                <option key={role} value={role}>{label}</option>
              ))}
            </select>

            {/* Region Filter */}
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="glass border border-white/10 rounded-lg px-3 py-2 text-foreground bg-transparent focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
            >
              <option value="">All Regions</option>
              {regions.map((region) => (
                <option key={region.id} value={region.id}>{region.name}</option>
              ))}
            </select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Users Table */}
        <UserTable
          users={filteredUsers}
          onEditUser={(user) => window.open(`/admin/users/${user.id}/edit`, '_blank')}
          onDeleteUser={handleDeleteUser}
          onViewUser={(user) => window.open(`/admin/users/${user.id}`, '_blank')}
        />

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No users found</h3>
            <p className="text-muted-foreground mb-4">
              {hasActiveFilters 
                ? 'Try adjusting your search criteria or filters.'
                : 'No users have been added to the system yet.'
              }
            </p>
            {!hasActiveFilters && (
              <Link
                href="/admin/users/new"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25"
              >
                <UserPlus className="h-4 w-4" />
                Add First User
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}