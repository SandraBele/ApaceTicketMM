'use client';

import { useState, useEffect } from 'react';
import { X, Users, Clock, Globe } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  kpiTargets: {
    ticketsPerMonth: number;
    responseTimeHours: number;
    resolutionRate: number;
  };
  timezone: string;
  workingHours: {
    start: string;
    end: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  teamId?: string;
}

interface TeamFormProps {
  team?: Team | null;
  users: User[];
  onSave: (teamData: Partial<Team>) => void;
  onCancel: () => void;
}

const timezones = [
  { value: 'UTC-12', label: 'UTC-12:00 (Baker Island)' },
  { value: 'UTC-11', label: 'UTC-11:00 (American Samoa)' },
  { value: 'UTC-10', label: 'UTC-10:00 (Hawaii)' },
  { value: 'UTC-9', label: 'UTC-09:00 (Alaska)' },
  { value: 'UTC-8', label: 'UTC-08:00 (Pacific Time)' },
  { value: 'UTC-7', label: 'UTC-07:00 (Mountain Time)' },
  { value: 'UTC-6', label: 'UTC-06:00 (Central Time)' },
  { value: 'UTC-5', label: 'UTC-05:00 (Eastern Time)' },
  { value: 'UTC-4', label: 'UTC-04:00 (Atlantic Time)' },
  { value: 'UTC-3', label: 'UTC-03:00 (Brazil)' },
  { value: 'UTC-2', label: 'UTC-02:00 (Mid-Atlantic)' },
  { value: 'UTC-1', label: 'UTC-01:00 (Azores)' },
  { value: 'UTC+0', label: 'UTC+00:00 (GMT/London)' },
  { value: 'UTC+1', label: 'UTC+01:00 (Central Europe)' },
  { value: 'UTC+2', label: 'UTC+02:00 (Eastern Europe)' },
  { value: 'UTC+3', label: 'UTC+03:00 (Moscow)' },
  { value: 'UTC+4', label: 'UTC+04:00 (Dubai)' },
  { value: 'UTC+5', label: 'UTC+05:00 (Pakistan)' },
  { value: 'UTC+5:30', label: 'UTC+05:30 (India)' },
  { value: 'UTC+6', label: 'UTC+06:00 (Bangladesh)' },
  { value: 'UTC+7', label: 'UTC+07:00 (Thailand)' },
  { value: 'UTC+8', label: 'UTC+08:00 (China/Singapore)' },
  { value: 'UTC+9', label: 'UTC+09:00 (Japan/Korea)' },
  { value: 'UTC+10', label: 'UTC+10:00 (Australia East)' },
  { value: 'UTC+11', label: 'UTC+11:00 (Solomon Islands)' },
  { value: 'UTC+12', label: 'UTC+12:00 (New Zealand)' }
];

export default function TeamForm({ team, users, onSave, onCancel }: TeamFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    timezone: 'UTC+0',
    workingHours: {
      start: '09:00',
      end: '17:00'
    },
    kpiTargets: {
      ticketsPerMonth: 100,
      responseTimeHours: 2,
      resolutionRate: 95
    }
  });
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name,
        description: team.description || '',
        timezone: team.timezone,
        workingHours: team.workingHours,
        kpiTargets: team.kpiTargets
      });
      // Get current team members
      const currentMembers = users.filter(user => user.teamId === team.id).map(user => user.id);
      setSelectedMembers(currentMembers);
    }
  }, [team, users]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Team name is required';
    }

    if (formData.kpiTargets.ticketsPerMonth < 1) {
      newErrors.ticketsPerMonth = 'Tickets per month must be at least 1';
    }

    if (formData.kpiTargets.responseTimeHours < 0.1) {
      newErrors.responseTimeHours = 'Response time must be at least 0.1 hours';
    }

    if (formData.kpiTargets.resolutionRate < 1 || formData.kpiTargets.resolutionRate > 100) {
      newErrors.resolutionRate = 'Resolution rate must be between 1 and 100';
    }

    const startTime = new Date(`2000-01-01T${formData.workingHours.start}:00`);
    const endTime = new Date(`2000-01-01T${formData.workingHours.end}:00`);
    if (startTime >= endTime) {
      newErrors.workingHours = 'End time must be after start time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const teamData = {
        ...formData,
        memberCount: selectedMembers.length
      };

      await onSave(teamData);
    } catch (error) {
      setErrors({ submit: 'Failed to save team. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleMemberToggle = (userId: string) => {
    setSelectedMembers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {team ? 'Edit Team' : 'Create New Team'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Basic Information
            </h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Team Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter team name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter team description"
              />
            </div>
          </div>

          {/* Working Hours & Timezone */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Working Hours & Timezone
            </h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timezone
              </label>
              <select
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {timezones.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={formData.workingHours.start}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    workingHours: { ...formData.workingHours, start: e.target.value }
                  })}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.workingHours ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={formData.workingHours.end}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    workingHours: { ...formData.workingHours, end: e.target.value }
                  })}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.workingHours ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
            </div>
            {errors.workingHours && <p className="text-sm text-red-600">{errors.workingHours}</p>}
          </div>

          {/* KPI Targets */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              KPI Targets
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tickets per Month
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.kpiTargets.ticketsPerMonth}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    kpiTargets: { 
                      ...formData.kpiTargets, 
                      ticketsPerMonth: parseInt(e.target.value) || 0
                    }
                  })}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.ticketsPerMonth ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.ticketsPerMonth && <p className="mt-1 text-sm text-red-600">{errors.ticketsPerMonth}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Response Time (hours)
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={formData.kpiTargets.responseTimeHours}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    kpiTargets: { 
                      ...formData.kpiTargets, 
                      responseTimeHours: parseFloat(e.target.value) || 0
                    }
                  })}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.responseTimeHours ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.responseTimeHours && <p className="mt-1 text-sm text-red-600">{errors.responseTimeHours}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resolution Rate (%)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.kpiTargets.resolutionRate}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    kpiTargets: { 
                      ...formData.kpiTargets, 
                      resolutionRate: parseInt(e.target.value) || 0
                    }
                  })}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.resolutionRate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.resolutionRate && <p className="mt-1 text-sm text-red-600">{errors.resolutionRate}</p>}
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900">
              Team Members ({selectedMembers.length} selected)
            </h4>
            
            <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md">
              {users.length > 0 ? (
                users.map((user) => (
                  <label key={user.id} className="flex items-center p-3 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(user.id)}
                      onChange={() => handleMemberToggle(user.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.email} • {user.role}
                      </div>
                    </div>
                  </label>
                ))
              ) : (
                <div className="p-3 text-sm text-gray-500 text-center">
                  No available users to assign
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.submit}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md text-sm font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (team ? 'Update Team' : 'Create Team')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}