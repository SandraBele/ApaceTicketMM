'use client';

import { useState } from 'react';
import { X, Users, Edit, Trash2, ArrowRight } from 'lucide-react';

interface BulkActionUpdate {
  status?: string;
  priority?: string;
  assignedTo?: string;
  team?: string;
}

interface TicketBulkActionsProps {
  selectedTickets: string[];
  onClearSelection: () => void;
  onBulkUpdate: (updates: BulkActionUpdate) => void;
}

export default function TicketBulkActions({ selectedTickets, onClearSelection, onBulkUpdate }: TicketBulkActionsProps) {
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [bulkUpdates, setBulkUpdates] = useState<BulkActionUpdate>({});
  const [loading, setLoading] = useState(false);

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

  // Mock teams and users - in real app, these would come from props or API
  const teams = [
    { id: '1', name: 'Technical Support' },
    { id: '2', name: 'Business Development' },
    { id: '3', name: 'Product Development' }
  ];

  const users = [
    { id: '1', name: 'John Doe', email: 'john.doe@apace.local' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@apace.local' },
    { id: '3', name: 'Bob Wilson', email: 'bob.wilson@apace.local' },
    { id: '4', name: 'Alice Brown', email: 'alice.brown@apace.local' }
  ];

  const handleQuickAction = async (action: string) => {
    setLoading(true);
    let updates: BulkActionUpdate = {};

    switch (action) {
      case 'assign_to_support':
        updates = { team: '1' }; // Technical Support team
        break;
      case 'mark_in_progress':
        updates = { status: 'in_progress' };
        break;
      case 'mark_resolved':
        updates = { status: 'resolved' };
        break;
      case 'set_high_priority':
        updates = { priority: 'high' };
        break;
      default:
        break;
    }

    try {
      await onBulkUpdate(updates);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkSubmit = async () => {
    if (Object.keys(bulkUpdates).length === 0) {
      return;
    }

    setLoading(true);
    try {
      await onBulkUpdate(bulkUpdates);
      setBulkUpdates({});
      setShowBulkForm(false);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedTickets.length} tickets? This action cannot be undone.`)) {
      setLoading(true);
      try {
        // Handle bulk delete
        console.log('Bulk delete tickets:', selectedTickets);
        onClearSelection();
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-white border border-blue-200 rounded-lg shadow-md">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">
                {selectedTickets.length} ticket{selectedTickets.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            <button
              onClick={onClearSelection}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Clear selection"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuickAction('mark_in_progress')}
                disabled={loading}
                className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors disabled:opacity-50"
              >
                Mark In Progress
              </button>
              <button
                onClick={() => handleQuickAction('mark_resolved')}
                disabled={loading}
                className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors disabled:opacity-50"
              >
                Mark Resolved
              </button>
              <button
                onClick={() => handleQuickAction('assign_to_support')}
                disabled={loading}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors disabled:opacity-50"
              >
                Assign to Support
              </button>
            </div>

            <div className="border-l border-gray-300 pl-2 ml-2 flex items-center gap-2">
              <button
                onClick={() => setShowBulkForm(!showBulkForm)}
                className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Edit className="h-4 w-4" />
                Bulk Edit
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={loading}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-red-100 text-red-800 border border-red-200 rounded-md hover:bg-red-200 transition-colors disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Edit Form */}
        {showBulkForm && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={bulkUpdates.status || ''}
                  onChange={(e) => setBulkUpdates({ ...bulkUpdates, status: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">No change</option>
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={bulkUpdates.priority || ''}
                  onChange={(e) => setBulkUpdates({ ...bulkUpdates, priority: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">No change</option>
                  {priorityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Team */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
                <select
                  value={bulkUpdates.team || ''}
                  onChange={(e) => setBulkUpdates({ ...bulkUpdates, team: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">No change</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assignee */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                <select
                  value={bulkUpdates.assignedTo || ''}
                  onChange={(e) => setBulkUpdates({ ...bulkUpdates, assignedTo: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">No change</option>
                  <option value="unassign">Unassign</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setShowBulkForm(false);
                  setBulkUpdates({});
                }}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkSubmit}
                disabled={loading || Object.keys(bulkUpdates).length === 0}
                className="flex items-center gap-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
                Apply Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}