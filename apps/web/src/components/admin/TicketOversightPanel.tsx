import React, { useState, useEffect } from 'react';
import { ticketsAPI, teamsAPI, usersAPI } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import styles from '../../styles/TicketOversightPanel.module.css';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'technical' | 'billing' | 'feature_request' | 'bug_report' | 'general';
  assignedToId: string | null;
  assignedToName: string | null;
  assignedTeamId: string | null;
  assignedTeamName: string | null;
  customerId: string;
  customerEmail: string;
  customerName: string;
  country: string;
  tags: string[];
  slaDeadline: string;
  isEscalated: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TicketOversightPanelProps {
  onStatsUpdate?: () => void;
}

const TicketOversightPanel: React.FC<TicketOversightPanelProps> = ({ onStatsUpdate }) => {
  const { user: currentUser } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    assignedTeamId: '',
    assignedToId: '',
    country: '',
    category: '',
    search: '',
    isEscalated: '',
    dateFrom: '',
    dateTo: ''
  });
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [teams, setTeams] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [ticketStats, setTicketStats] = useState<any>(null);
  
  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tickets, filters]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [ticketsResponse, teamsResponse, usersResponse, statsResponse] = await Promise.all([
        ticketsAPI.getTickets(),
        teamsAPI.getTeams(),
        usersAPI.getUsers(),
        ticketsAPI.getTicketStats()
      ]);
      
      setTickets(ticketsResponse.data);
      setTeams(teamsResponse.data);
      setUsers(usersResponse.data);
      setTicketStats(statsResponse.data);
    } catch (error: any) {
      console.error('Error fetching initial data:', error);
      setError(error.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tickets];

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        switch (key) {
          case 'search':
            const searchLower = value.toLowerCase();
            filtered = filtered.filter(ticket => 
              ticket.title.toLowerCase().includes(searchLower) ||
              ticket.description.toLowerCase().includes(searchLower) ||
              ticket.customerEmail.toLowerCase().includes(searchLower) ||
              ticket.customerName.toLowerCase().includes(searchLower)
            );
            break;
          case 'isEscalated':
            filtered = filtered.filter(ticket => 
              ticket.isEscalated === (value === 'true')
            );
            break;
          case 'dateFrom':
            filtered = filtered.filter(ticket => 
              new Date(ticket.createdAt) >= new Date(value)
            );
            break;
          case 'dateTo':
            filtered = filtered.filter(ticket => 
              new Date(ticket.createdAt) <= new Date(value)
            );
            break;
          default:
            filtered = filtered.filter(ticket => 
              (ticket as any)[key] === value
            );
        }
      }
    });

    setFilteredTickets(filtered);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      priority: '',
      assignedTeamId: '',
      assignedToId: '',
      country: '',
      category: '',
      search: '',
      isEscalated: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  const handleTicketSelect = (ticketId: string, selected: boolean) => {
    if (selected) {
      setSelectedTickets(prev => [...prev, ticketId]);
    } else {
      setSelectedTickets(prev => prev.filter(id => id !== ticketId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedTickets(filteredTickets.map(ticket => ticket.id));
    } else {
      setSelectedTickets([]);
    }
  };

  const handleBulkAction = async (action: string, value?: any) => {
    try {
      setError(null);
      
      await ticketsAPI.bulkUpdate({
        ticketIds: selectedTickets,
        updateData: {
          [action]: value || true
        }
      });
      
      await fetchInitialData();
      onStatsUpdate?.();
      setSelectedTickets([]);
      setShowBulkActions(false);
    } catch (error: any) {
      console.error('Error performing bulk action:', error);
      setError(error.response?.data?.message || 'Failed to perform bulk action');
    }
  };

  const handleAssignTicket = async (ticketId: string, assignmentData: any) => {
    try {
      setError(null);
      await ticketsAPI.assignTicket(ticketId, assignmentData);
      await fetchInitialData();
      onStatsUpdate?.();
    } catch (error: any) {
      console.error('Error assigning ticket:', error);
      setError(error.response?.data?.message || 'Failed to assign ticket');
    }
  };

  const handleEscalateTicket = async (ticketId: string, reason: string) => {
    try {
      setError(null);
      await ticketsAPI.escalateTicket(ticketId, reason);
      await fetchInitialData();
      onStatsUpdate?.();
    } catch (error: any) {
      console.error('Error escalating ticket:', error);
      setError(error.response?.data?.message || 'Failed to escalate ticket');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return '#ef4444';
      case 'in_progress': return '#f59e0b';
      case 'pending': return '#8b5cf6';
      case 'resolved': return '#10b981';
      case 'closed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const isOverdue = (slaDeadline: string, status: string) => {
    return new Date(slaDeadline) < new Date() && !['resolved', 'closed'].includes(status);
  };

  return (
    <div className={styles.ticketOversightPanel}>
      <div className={styles.panelHeader}>
        <div className={styles.headerLeft}>
          <h2>Ticket Oversight Dashboard</h2>
          <p>Advanced ticket management with filtering and bulk operations</p>
        </div>
        <div className={styles.headerRight}>
          {selectedTickets.length > 0 && (
            <button 
              className={styles.bulkActionsButton}
              onClick={() => setShowBulkActions(!showBulkActions)}
            >
              Bulk Actions ({selectedTickets.length})
            </button>
          )}
          <button className={styles.refreshButton} onClick={fetchInitialData}>
            Refresh
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className={styles.errorMessage}>
          <span>{error}</span>
          <button onClick={() => setError(null)} className={styles.dismissError}>
            ×
          </button>
        </div>
      )}

      {/* Stats Overview */}
      {ticketStats && (
        <div className={styles.statsOverview}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{ticketStats.totalTickets}</div>
            <div className={styles.statLabel}>Total Tickets</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{ticketStats.openTickets}</div>
            <div className={styles.statLabel}>Open Tickets</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{ticketStats.overdueTickets}</div>
            <div className={styles.statLabel}>Overdue</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{ticketStats.criticalTickets}</div>
            <div className={styles.statLabel}>Critical</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{ticketStats.slaCompliance}%</div>
            <div className={styles.statLabel}>SLA Compliance</div>
          </div>
        </div>
      )}

      {/* Advanced Filters */}
      <div className={styles.filtersSection}>
        <div className={styles.filtersGrid}>
          <div className={styles.filterGroup}>
            <label>Status</label>
            <select 
              value={filters.status} 
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <label>Priority</label>
            <select 
              value={filters.priority} 
              onChange={(e) => handleFilterChange('priority', e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <label>Team</label>
            <select 
              value={filters.assignedTeamId} 
              onChange={(e) => handleFilterChange('assignedTeamId', e.target.value)}
            >
              <option value="">All Teams</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <label>Category</label>
            <select 
              value={filters.category} 
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="technical">Technical</option>
              <option value="billing">Billing</option>
              <option value="feature_request">Feature Request</option>
              <option value="bug_report">Bug Report</option>
              <option value="general">General</option>
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <label>Country</label>
            <select 
              value={filters.country} 
              onChange={(e) => handleFilterChange('country', e.target.value)}
            >
              <option value="">All Countries</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="UK">United Kingdom</option>
              <option value="AU">Australia</option>
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <label>Escalated</label>
            <select 
              value={filters.isEscalated} 
              onChange={(e) => handleFilterChange('isEscalated', e.target.value)}
            >
              <option value="">All Tickets</option>
              <option value="true">Escalated Only</option>
              <option value="false">Not Escalated</option>
            </select>
          </div>
        </div>
        
        <div className={styles.searchAndDateFilters}>
          <div className={styles.searchGroup}>
            <input 
              type="text"
              placeholder="Search tickets..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.dateGroup}>
            <label>From Date</label>
            <input 
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            />
          </div>
          
          <div className={styles.dateGroup}>
            <label>To Date</label>
            <input 
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            />
          </div>
          
          <button className={styles.clearFiltersButton} onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      </div>

      {/* Bulk Actions Panel */}
      {showBulkActions && selectedTickets.length > 0 && (
        <div className={styles.bulkActionsPanel}>
          <div className={styles.bulkActionsHeader}>
            <h4>{selectedTickets.length} tickets selected</h4>
            <button onClick={() => setShowBulkActions(false)}>×</button>
          </div>
          <div className={styles.bulkActionButtons}>
            <button onClick={() => handleBulkAction('status', 'in_progress')}>
              Mark In Progress
            </button>
            <button onClick={() => handleBulkAction('status', 'resolved')}>
              Mark Resolved
            </button>
            <button onClick={() => handleBulkAction('priority', 'high')}>
              Set High Priority
            </button>
            <button onClick={() => handleBulkAction('isEscalated', true)}>
              Escalate All
            </button>
          </div>
        </div>
      )}

      {/* Tickets Table */}
      <div className={styles.ticketsSection}>
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading tickets...</p>
          </div>
        ) : (
          <div className={styles.ticketsTable}>
            <div className={styles.tableHeader}>
              <div className={styles.headerCell}>
                <input
                  type="checkbox"
                  checked={selectedTickets.length === filteredTickets.length && filteredTickets.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </div>
              <div className={styles.headerCell}>Ticket</div>
              <div className={styles.headerCell}>Status</div>
              <div className={styles.headerCell}>Priority</div>
              <div className={styles.headerCell}>Assigned To</div>
              <div className={styles.headerCell}>Customer</div>
              <div className={styles.headerCell}>SLA</div>
              <div className={styles.headerCell}>Actions</div>
            </div>
            
            <div className={styles.tableBody}>
              {filteredTickets.map(ticket => (
                <div key={ticket.id} className={styles.tableRow}>
                  <div className={styles.tableCell}>
                    <input
                      type="checkbox"
                      checked={selectedTickets.includes(ticket.id)}
                      onChange={(e) => handleTicketSelect(ticket.id, e.target.checked)}
                    />
                  </div>
                  
                  <div className={styles.tableCell}>
                    <div className={styles.ticketInfo}>
                      <div className={styles.ticketTitle}>#{ticket.id} {ticket.title}</div>
                      <div className={styles.ticketMeta}>
                        <span className={styles.category}>{ticket.category}</span>
                        {ticket.isEscalated && <span className={styles.escalated}>ESCALATED</span>}
                        <span className={styles.country}>{ticket.country}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.tableCell}>
                    <span 
                      className={styles.statusBadge}
                      style={{ backgroundColor: getStatusColor(ticket.status) }}
                    >
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className={styles.tableCell}>
                    <span 
                      className={styles.priorityBadge}
                      style={{ backgroundColor: getPriorityColor(ticket.priority) }}
                    >
                      {ticket.priority}
                    </span>
                  </div>
                  
                  <div className={styles.tableCell}>
                    <div className={styles.assignmentInfo}>
                      <div>{ticket.assignedToName || 'Unassigned'}</div>
                      <div className={styles.teamName}>{ticket.assignedTeamName}</div>
                    </div>
                  </div>
                  
                  <div className={styles.tableCell}>
                    <div className={styles.customerInfo}>
                      <div>{ticket.customerName}</div>
                      <div className={styles.customerEmail}>{ticket.customerEmail}</div>
                    </div>
                  </div>
                  
                  <div className={styles.tableCell}>
                    <div className={styles.slaInfo}>
                      <div className={`${styles.slaStatus} ${isOverdue(ticket.slaDeadline, ticket.status) ? styles.overdue : ''}`}>
                        {isOverdue(ticket.slaDeadline, ticket.status) ? 'OVERDUE' : 'On Time'}
                      </div>
                      <div className={styles.slaDeadline}>
                        {new Date(ticket.slaDeadline).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.tableCell}>
                    <div className={styles.ticketActions}>
                      <button 
                        className={styles.actionButton}
                        onClick={() => {
                          // Handle assignment
                          const assigneeId = prompt('Enter user ID to assign:');
                          if (assigneeId) {
                            const user = users.find(u => u.id === assigneeId);
                            if (user) {
                              handleAssignTicket(ticket.id, {
                                assigneeId: user.id,
                                assigneeName: `${user.firstName} ${user.lastName}`
                              });
                            }
                          }
                        }}
                      >
                        Assign
                      </button>
                      <button 
                        className={styles.actionButton}
                        onClick={() => {
                          const reason = prompt('Escalation reason:');
                          if (reason) {
                            handleEscalateTicket(ticket.id, reason);
                          }
                        }}
                      >
                        Escalate
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className={styles.tableFooter}>
          <div className={styles.resultsInfo}>
            Showing {filteredTickets.length} of {tickets.length} tickets
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketOversightPanel;