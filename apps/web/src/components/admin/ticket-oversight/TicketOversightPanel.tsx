'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Eye, Edit, MoreVertical, Users, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import TicketFilters from './TicketFilters';
import TicketBulkActions from './TicketBulkActions';
import TicketDetails from './TicketDetails';

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
  responseTime?: number; // hours
  resolutionTime?: number; // hours
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

export default function TicketOversightPanel() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'updatedAt' | 'priority' | 'slaStatus'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
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

  // Mock data for development
  useEffect(() => {
    const mockTickets: Ticket[] = [
      {
        id: '1',
        title: 'Database connection timeout issues',
        description: 'Users experiencing intermittent connection timeouts when accessing the application',
        status: 'in_progress',
        priority: 'high',
        country: 'United States',
        assignedTo: {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@apace.local'
        },
        team: {
          id: '1',
          name: 'Technical Support'
        },
        createdAt: '2024-12-01T10:30:00Z',
        updatedAt: '2024-12-01T14:20:00Z',
        responseTime: 0.5,
        slaStatus: 'on_track',
        tags: ['database', 'performance', 'urgent']
      },
      {
        id: '2',
        title: 'Feature request: Advanced reporting',
        description: 'Client requesting advanced analytics and custom report generation features',
        status: 'open',
        priority: 'medium',
        country: 'United Kingdom',
        team: {
          id: '3',
          name: 'Product Development'
        },
        createdAt: '2024-11-28T09:15:00Z',
        updatedAt: '2024-11-28T09:15:00Z',
        slaStatus: 'at_risk',
        tags: ['feature-request', 'reporting', 'analytics']
      },
      {
        id: '3',
        title: 'Payment gateway integration error',
        description: 'Transactions failing with error code 500 on checkout page',
        status: 'resolved',
        priority: 'urgent',
        country: 'Germany',
        assignedTo: {
          id: '3',
          name: 'Bob Wilson',
          email: 'bob.wilson@apace.local'
        },
        team: {
          id: '3',
          name: 'Product Development'
        },
        createdAt: '2024-11-25T14:45:00Z',
        updatedAt: '2024-11-26T10:30:00Z',
        responseTime: 0.25,
        resolutionTime: 19.75,
        slaStatus: 'on_track',
        tags: ['payment', 'integration', 'critical']
      },
      {
        id: '4',
        title: 'User account locked after password reset',
        description: 'Multiple users reporting account lockouts following password reset attempts',
        status: 'open',
        priority: 'high',
        country: 'France',
        team: {
          id: '1',
          name: 'Technical Support'
        },
        createdAt: '2024-12-02T08:00:00Z',
        updatedAt: '2024-12-02T08:00:00Z',
        slaStatus: 'breached',
        tags: ['authentication', 'security', 'account']
      },
      {
        id: '5',
        title: 'Mobile app crashes on startup',
        description: 'iOS app version 2.1.0 crashing on launch for devices running iOS 16+',
        status: 'in_progress',
        priority: 'urgent',
        country: 'Canada',
        assignedTo: {
          id: '3',
          name: 'Bob Wilson',
          email: 'bob.wilson@apace.local'
        },
        team: {
          id: '3',
          name: 'Product Development'
        },
        createdAt: '2024-11-30T16:20:00Z',
        updatedAt: '2024-12-01T11:45:00Z',
        responseTime: 2.5,
        slaStatus: 'at_risk',
        tags: ['mobile', 'ios', 'crash', 'urgent']
      }
    ];

    setTimeout(() => {
      setTickets(mockTickets);
      setFilteredTickets(mockTickets);
      setLoading(false);
    }, 500);
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = tickets;

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(ticket => 
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply filters
    if (filters.status.length > 0) {
      filtered = filtered.filter(ticket => filters.status.includes(ticket.status));
    }
    if (filters.priority.length > 0) {
      filtered = filtered.filter(ticket => filters.priority.includes(ticket.priority));
    }
    if (filters.country.length > 0) {
      filtered = filtered.filter(ticket => filters.country.includes(ticket.country));
    }
    if (filters.team.length > 0) {
      filtered = filtered.filter(ticket => ticket.team && filters.team.includes(ticket.team.id));
    }
    if (filters.assignee.length > 0) {
      filtered = filtered.filter(ticket => ticket.assignedTo && filters.assignee.includes(ticket.assignedTo.id));
    }
    if (filters.slaStatus.length > 0) {
      filtered = filtered.filter(ticket => filters.slaStatus.includes(ticket.slaStatus));
    }

    // Apply date range filter
    if (filters.dateRange.start) {
      filtered = filtered.filter(ticket => new Date(ticket.createdAt) >= new Date(filters.dateRange.start));
    }
    if (filters.dateRange.end) {
      filtered = filtered.filter(ticket => new Date(ticket.createdAt) <= new Date(filters.dateRange.end));
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];

      if (sortBy === 'priority') {
        const priorityOrder = { 'low': 1, 'medium': 2, 'high': 3, 'urgent': 4 };
        aValue = priorityOrder[a.priority];
        bValue = priorityOrder[b.priority];
      } else if (sortBy === 'slaStatus') {
        const slaOrder = { 'on_track': 1, 'at_risk': 2, 'breached': 3 };
        aValue = slaOrder[a.slaStatus];
        bValue = slaOrder[b.slaStatus];
      } else if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredTickets(filtered);
  }, [tickets, searchTerm, filters, sortBy, sortOrder]);

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleSelectTicket = (ticketId: string) => {
    setSelectedTickets(prev => 
      prev.includes(ticketId)
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTickets.length === filteredTickets.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(filteredTickets.map(ticket => ticket.id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSLAStatusIcon = (slaStatus: string) => {
    switch (slaStatus) {
      case 'on_track': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'at_risk': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'breached': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ticket Oversight</h2>
          <p className="text-gray-600 mb-4">
            Monitor and manage all support tickets with advanced filtering and bulk operations.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tickets</p>
              <p className="text-2xl font-bold text-gray-900">{tickets.length}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open Tickets</p>
              <p className="text-2xl font-bold text-gray-900">
                {tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
              <Clock className="h-4 w-4 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">SLA Breached</p>
              <p className="text-2xl font-bold text-gray-900">
                {tickets.filter(t => t.slaStatus === 'breached').length}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Response</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(tickets.filter(t => t.responseTime).reduce((sum, t) => sum + (t.responseTime || 0), 0) / tickets.filter(t => t.responseTime).length || 0)}h
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search tickets by title, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-md transition-colors ${
              showFilters
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <TicketFilters
              filters={filters}
              onFiltersChange={setFilters}
              tickets={tickets}
            />
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedTickets.length > 0 && (
        <TicketBulkActions
          selectedTickets={selectedTickets}
          onClearSelection={() => setSelectedTickets([])}
          onBulkUpdate={(updates) => {
            // Handle bulk updates
            console.log('Bulk update:', updates);
            setSelectedTickets([]);
          }}
        />
      )}

      {/* Tickets Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Tickets ({filteredTickets.length})
            </h3>
            <div className="text-sm text-gray-500">
              {selectedTickets.length > 0 && `${selectedTickets.length} selected`}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedTickets.length === filteredTickets.length && filteredTickets.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center gap-1">
                    Ticket
                    {sortBy === 'createdAt' && (
                      <span className="text-blue-600">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('priority')}
                >
                  <div className="flex items-center gap-1">
                    Priority
                    {sortBy === 'priority' && (
                      <span className="text-blue-600">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Country
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('slaStatus')}
                >
                  <div className="flex items-center gap-1">
                    SLA Status
                    {sortBy === 'slaStatus' && (
                      <span className="text-blue-600">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('updatedAt')}
                >
                  <div className="flex items-center gap-1">
                    Last Updated
                    {sortBy === 'updatedAt' && (
                      <span className="text-blue-600">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className={`hover:bg-gray-50 ${selectedTickets.includes(ticket.id) ? 'bg-blue-50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedTickets.includes(ticket.id)}
                      onChange={() => handleSelectTicket(ticket.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {ticket.title}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        #{ticket.id} • {ticket.team?.name || 'Unassigned'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {ticket.assignedTo ? (
                      <div className="text-sm text-gray-900">
                        {ticket.assignedTo.name}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ticket.country}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {getSLAStatusIcon(ticket.slaStatus)}
                      <span className="text-sm text-gray-900 capitalize">
                        {ticket.slaStatus.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(ticket.updatedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50"
                        title="Edit Ticket"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50"
                        title="More Actions"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTickets.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : f)
                ? 'Try adjusting your search or filters.'
                : 'No tickets available.'}
            </p>
          </div>
        )}
      </div>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <TicketDetails
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onUpdate={(updatedTicket) => {
            setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
            setSelectedTicket(null);
          }}
        />
      )}
    </div>
  );
}