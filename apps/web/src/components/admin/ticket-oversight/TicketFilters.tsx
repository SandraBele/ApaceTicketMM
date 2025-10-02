'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  country: string;
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  };
  team?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  responseTime?: number;
  resolutionTime?: number;
  slaStatus: 'on_track' | 'at_risk' | 'breached';
  tags: string[];
}

interface FilterState {
  status: string[];
  priority: string[];
  country: string[];
  team: string[];
  assignee: string[];
  slaStatus: string[];
  dateRange: {
    start: string;
    end: string;
  };
}

interface TicketFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  tickets: Ticket[];
}

export default function TicketFilters({ filters, onFiltersChange, tickets }: TicketFiltersProps) {
  const statusOptions = [
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const slaStatusOptions = [
    { value: 'on_track', label: 'On Track' },
    { value: 'at_risk', label: 'At Risk' },
    { value: 'breached', label: 'Breached' }
  ];

  // Extract unique values from tickets
  const countries = Array.from(new Set(tickets.map(t => t.country))).sort();
  const teams = Array.from(new Set(tickets.filter(t => t.team).map(t => t.team!)));
  const assignees = Array.from(new Set(tickets.filter(t => t.assignedTo).map(t => t.assignedTo!)));

  const handleMultiSelectChange = (field: keyof FilterState, value: string) => {
    if (field === 'dateRange') return; // Handle separately
    
    const currentValues = filters[field] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFiltersChange({
      ...filters,
      [field]: newValues
    });
  };

  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: value
      }
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      status: [],
      priority: [],
      country: [],
      team: [],
      assignee: [],
      slaStatus: [],
      dateRange: {
        start: '',
        end: ''
      }
    });
  };

  const hasActiveFilters = (
    filters.status.length > 0 ||
    filters.priority.length > 0 ||
    filters.country.length > 0 ||
    filters.team.length > 0 ||
    filters.assignee.length > 0 ||
    filters.slaStatus.length > 0 ||
    filters.dateRange.start ||
    filters.dateRange.end
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-md font-medium text-gray-900">Filter Options</h4>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear All Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {statusOptions.map(option => (
              <label key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.status.includes(option.value)}
                  onChange={() => handleMultiSelectChange('status', option.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {priorityOptions.map(option => (
              <label key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.priority.includes(option.value)}
                  onChange={() => handleMultiSelectChange('priority', option.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* SLA Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SLA Status</label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {slaStatusOptions.map(option => (
              <label key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.slaStatus.includes(option.value)}
                  onChange={() => handleMultiSelectChange('slaStatus', option.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Country Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {countries.map(country => (
              <label key={country} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.country.includes(country)}
                  onChange={() => handleMultiSelectChange('country', country)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{country}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Team Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Team</label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {teams.map(team => (
              <label key={team.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.team.includes(team.id)}
                  onChange={() => handleMultiSelectChange('team', team.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{team.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Assignee Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {assignees.map(assignee => (
              <label key={assignee.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.assignee.includes(assignee.id)}
                  onChange={() => handleMultiSelectChange('assignee', assignee.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{assignee.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
          <div className="space-y-2">
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => handleDateRangeChange('start', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Start date"
            />
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => handleDateRangeChange('end', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="End date"
            />
          </div>
        </div>

        {/* Quick Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Quick Filters</label>
          <div className="space-y-2">
            <button
              onClick={() => handleMultiSelectChange('slaStatus', 'breached')}
              className="w-full text-left px-3 py-2 text-sm border border-red-300 rounded-md text-red-700 hover:bg-red-50 transition-colors"
            >
              SLA Breached
            </button>
            <button
              onClick={() => {
                handleMultiSelectChange('priority', 'urgent');
                handleMultiSelectChange('priority', 'high');
              }}
              className="w-full text-left px-3 py-2 text-sm border border-orange-300 rounded-md text-orange-700 hover:bg-orange-50 transition-colors"
            >
              High Priority
            </button>
            <button
              onClick={() => {
                handleMultiSelectChange('status', 'open');
                handleMultiSelectChange('status', 'in_progress');
              }}
              className="w-full text-left px-3 py-2 text-sm border border-blue-300 rounded-md text-blue-700 hover:bg-blue-50 transition-colors"
            >
              Active Tickets
            </button>
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h5 className="text-sm font-medium text-blue-900 mb-2">Active Filters:</h5>
          <div className="flex flex-wrap gap-2">
            {filters.status.map(status => (
              <span key={`status-${status}`} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Status: {status}
                <button
                  onClick={() => handleMultiSelectChange('status', status)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {filters.priority.map(priority => (
              <span key={`priority-${priority}`} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Priority: {priority}
                <button
                  onClick={() => handleMultiSelectChange('priority', priority)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {filters.slaStatus.map(sla => (
              <span key={`sla-${sla}`} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                SLA: {sla.replace('_', ' ')}
                <button
                  onClick={() => handleMultiSelectChange('slaStatus', sla)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {filters.country.map(country => (
              <span key={`country-${country}`} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Country: {country}
                <button
                  onClick={() => handleMultiSelectChange('country', country)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {filters.team.map(teamId => {
              const team = teams.find(t => t.id === teamId);
              return (
                <span key={`team-${teamId}`} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Team: {team?.name}
                  <button
                    onClick={() => handleMultiSelectChange('team', teamId)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              );
            })}
            {filters.assignee.map(assigneeId => {
              const assignee = assignees.find(a => a.id === assigneeId);
              return (
                <span key={`assignee-${assigneeId}`} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Assignee: {assignee?.name}
                  <button
                    onClick={() => handleMultiSelectChange('assignee', assigneeId)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              );
            })}
            {(filters.dateRange.start || filters.dateRange.end) && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Date: {filters.dateRange.start} - {filters.dateRange.end}
                <button
                  onClick={() => handleDateRangeChange('start', '')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}