'use client';

import { useState } from 'react';
import { X, User, Calendar, Clock, Tag, AlertCircle, CheckCircle, Edit, MessageSquare } from 'lucide-react';

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

interface TicketDetailsProps {
  ticket: Ticket;
  onClose: () => void;
  onUpdate: (updatedTicket: Ticket) => void;
}

export default function TicketDetails({ ticket, onClose, onUpdate }: TicketDetailsProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'history' | 'comments'>('details');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: ticket.title,
    description: ticket.description,
    status: ticket.status,
    priority: ticket.priority
  });
  const [loading, setLoading] = useState(false);

  // Mock data for ticket history and comments
  const ticketHistory = [
    {
      id: '1',
      action: 'Ticket created',
      user: 'System',
      timestamp: ticket.createdAt,
      details: 'Ticket was created by customer'
    },
    {
      id: '2',
      action: 'Status changed',
      user: 'John Doe',
      timestamp: '2024-12-01T11:00:00Z',
      details: 'Status changed from "open" to "in_progress"'
    },
    {
      id: '3',
      action: 'Assigned',
      user: 'John Doe',
      timestamp: '2024-12-01T11:05:00Z',
      details: 'Ticket assigned to John Doe'
    }
  ];

  const ticketComments = [
    {
      id: '1',
      user: 'John Doe',
      content: 'Initial investigation shows this might be related to recent database changes. Looking into it.',
      timestamp: '2024-12-01T11:30:00Z',
      isInternal: false
    },
    {
      id: '2',
      user: 'Alice Brown',
      content: 'Customer has been notified about the ongoing investigation.',
      timestamp: '2024-12-01T12:15:00Z',
      isInternal: true
    }
  ];

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSLAStatusIcon = (slaStatus: string) => {
    switch (slaStatus) {
      case 'on_track': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'at_risk': return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'breached': return <AlertCircle className="h-5 w-5 text-red-600" />;
      default: return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (hours: number) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)} minutes`;
    } else if (hours < 24) {
      return `${hours} hours`;
    } else {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days} day${days !== 1 ? 's' : ''} ${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`;
    }
  };

  const handleSaveEdit = async () => {
    setLoading(true);
    try {
      const updatedTicket = {
        ...ticket,
        ...editData,
        updatedAt: new Date().toISOString()
      };
      await onUpdate(updatedTicket);
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'details', label: 'Details', icon: User },
    { id: 'history', label: 'History', icon: Calendar },
    { id: 'comments', label: 'Comments', icon: MessageSquare }
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white mb-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                className="text-xl font-semibold text-gray-900 w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <h3 className="text-xl font-semibold text-gray-900">{ticket.title}</h3>
            )}
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span>Ticket #{ticket.id}</span>
              <span>•</span>
              <span>Created {formatDate(ticket.createdAt)}</span>
              <span>•</span>
              <span>Updated {formatDate(ticket.updatedAt)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Edit className="h-4 w-4" />
                Edit
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={loading}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Status and Priority */}
        <div className="flex items-center gap-4 mb-6">
          {isEditing ? (
            <>
              <select
                value={editData.status}
                onChange={(e) => setEditData({ ...editData, status: e.target.value as Ticket['status'] })}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <select
                value={editData.priority}
                onChange={(e) => setEditData({ ...editData, priority: e.target.value as Ticket['priority'] })}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </>
          ) : (
            <>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold border rounded-full ${getStatusColor(ticket.status)}`}>
                {ticket.status.replace('_', ' ')}
              </span>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold border rounded-full ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority} priority
              </span>
              <div className="flex items-center gap-1">
                {getSLAStatusIcon(ticket.slaStatus)}
                <span className="text-sm font-medium capitalize">
                  SLA {ticket.slaStatus.replace('_', ' ')}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Main Details */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Description</h4>
                  {isEditing ? (
                    <textarea
                      value={editData.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
                  )}
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {ticket.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                        <Tag className="h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Assignment</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Assigned To</label>
                      <p className="text-sm text-gray-900">
                        {ticket.assignedTo ? ticket.assignedTo.name : 'Unassigned'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Team</label>
                      <p className="text-sm text-gray-900">
                        {ticket.team ? ticket.team.name : 'No team assigned'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Country</label>
                      <p className="text-sm text-gray-900">{ticket.country}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Timing</h4>
                  <div className="space-y-3">
                    {ticket.responseTime && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Response Time</label>
                        <p className="text-sm text-gray-900">{formatDuration(ticket.responseTime)}</p>
                      </div>
                    )}
                    {ticket.resolutionTime && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Resolution Time</label>
                        <p className="text-sm text-gray-900">{formatDuration(ticket.resolutionTime)}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-gray-700">SLA Status</label>
                      <div className="flex items-center gap-2 mt-1">
                        {getSLAStatusIcon(ticket.slaStatus)}
                        <span className="text-sm text-gray-900 capitalize">
                          {ticket.slaStatus.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Activity History</h4>
              <div className="space-y-4">
                {ticketHistory.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{entry.action}</p>
                        <span className="text-xs text-gray-500">{formatDate(entry.timestamp)}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{entry.details}</p>
                      <p className="text-xs text-gray-500 mt-1">by {entry.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Comments & Notes</h4>
              <div className="space-y-4">
                {ticketComments.map((comment) => (
                  <div key={comment.id} className={`p-4 rounded-lg ${
                    comment.isInternal ? 'bg-yellow-50 border border-yellow-200' : 'bg-blue-50 border border-blue-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{comment.user}</span>
                        {comment.isInternal && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            Internal
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{formatDate(comment.timestamp)}</span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                ))}
                
                {/* Add Comment Form */}
                <div className="mt-6 p-4 border border-gray-200 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Add Comment</h5>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add a comment or note..."
                  />
                  <div className="flex items-center justify-between mt-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Internal note</span>
                    </label>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors">
                      Add Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}