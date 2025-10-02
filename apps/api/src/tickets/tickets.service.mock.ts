import { Injectable } from '@nestjs/common';

export interface Ticket {
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
  attachments: string[];
  slaDeadline: string;
  responseTime: number | null; // minutes
  resolutionTime: number | null; // hours
  satisfactionScore: number | null; // 1-5
  estimatedEffort: number | null; // hours
  actualEffort: number | null; // hours
  isEscalated: boolean;
  escalationReason: string | null;
  lastUpdatedBy: string;
  notes: string[];
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  closedAt: string | null;
}

@Injectable()
export class MockTicketsService {
  private tickets: Ticket[] = [
    {
      id: '1',
      title: 'Login Issue with Multi-Factor Authentication',
      description: 'User unable to complete 2FA login process. Error message appears after entering verification code.',
      status: 'in_progress',
      priority: 'high',
      category: 'technical',
      assignedToId: '2',
      assignedToName: 'John Doe',
      assignedTeamId: '1',
      assignedTeamName: 'Technical Support',
      customerId: 'cust-001',
      customerEmail: 'alex.smith@techcorp.com',
      customerName: 'Alex Smith',
      country: 'US',
      tags: ['authentication', '2fa', 'login'],
      attachments: ['screenshot-error.png'],
      slaDeadline: '2024-10-02T14:00:00Z',
      responseTime: 25,
      resolutionTime: null,
      satisfactionScore: null,
      estimatedEffort: 2,
      actualEffort: 1.5,
      isEscalated: false,
      escalationReason: null,
      lastUpdatedBy: 'John Doe',
      notes: ['Initial investigation completed', 'Reproduced issue in test environment'],
      createdAt: '2024-10-01T10:00:00Z',
      updatedAt: '2024-10-01T16:30:00Z',
      resolvedAt: null,
      closedAt: null
    },
    {
      id: '2',
      title: 'Payment Processing Error',
      description: 'Customer experiencing payment gateway timeout during checkout process.',
      status: 'open',
      priority: 'medium',
      category: 'billing',
      assignedToId: '3',
      assignedToName: 'Mike Johnson',
      assignedTeamId: '3',
      assignedTeamName: 'Business Development',
      customerId: 'cust-002',
      customerEmail: 'billing@globaltech.com',
      customerName: 'Sarah Johnson',
      country: 'CA',
      tags: ['payment', 'gateway', 'timeout'],
      attachments: ['payment-log.txt'],
      slaDeadline: '2024-10-03T09:00:00Z',
      responseTime: 45,
      resolutionTime: null,
      satisfactionScore: null,
      estimatedEffort: 3,
      actualEffort: null,
      isEscalated: false,
      escalationReason: null,
      lastUpdatedBy: 'Mike Johnson',
      notes: ['Payment gateway logs reviewed'],
      createdAt: '2024-10-01T09:00:00Z',
      updatedAt: '2024-10-01T13:00:00Z',
      resolvedAt: null,
      closedAt: null
    },
    {
      id: '3',
      title: 'Feature Request: Dark Mode Support',
      description: 'Customer requesting dark mode theme option for the main application interface.',
      status: 'pending',
      priority: 'low',
      category: 'feature_request',
      assignedToId: '4',
      assignedToName: 'Sarah Wilson',
      assignedTeamId: '2',
      assignedTeamName: 'Product Development',
      customerId: 'cust-003',
      customerEmail: 'design@creativestudio.com',
      customerName: 'Emma Davis',
      country: 'UK',
      tags: ['ui', 'theme', 'enhancement'],
      attachments: ['mockup-dark-theme.png'],
      slaDeadline: '2024-10-15T17:00:00Z',
      responseTime: 120,
      resolutionTime: null,
      satisfactionScore: null,
      estimatedEffort: 16,
      actualEffort: null,
      isEscalated: false,
      escalationReason: null,
      lastUpdatedBy: 'Sarah Wilson',
      notes: ['Added to product roadmap', 'Waiting for design approval'],
      createdAt: '2024-09-28T14:00:00Z',
      updatedAt: '2024-09-30T11:20:00Z',
      resolvedAt: null,
      closedAt: null
    },
    {
      id: '4',
      title: 'Database Connection Timeout',
      description: 'Critical system issue causing database connection timeouts affecting multiple users.',
      status: 'resolved',
      priority: 'critical',
      category: 'bug_report',
      assignedToId: '4',
      assignedToName: 'Sarah Wilson',
      assignedTeamId: '2',
      assignedTeamName: 'Product Development',
      customerId: 'internal',
      customerEmail: 'ops@apace.local',
      customerName: 'Operations Team',
      country: 'US',
      tags: ['database', 'performance', 'critical'],
      attachments: ['db-logs.zip', 'performance-analysis.pdf'],
      slaDeadline: '2024-09-25T20:00:00Z',
      responseTime: 15,
      resolutionTime: 6,
      satisfactionScore: 5,
      estimatedEffort: 8,
      actualEffort: 6,
      isEscalated: true,
      escalationReason: 'Critical system impact',
      lastUpdatedBy: 'Sarah Wilson',
      notes: ['Escalated to senior engineer', 'Database connection pool optimized', 'Issue resolved'],
      createdAt: '2024-09-25T14:00:00Z',
      updatedAt: '2024-09-25T20:00:00Z',
      resolvedAt: '2024-09-25T20:00:00Z',
      closedAt: '2024-09-26T09:00:00Z'
    },
    {
      id: '5',
      title: 'Account Access Request',
      description: 'New employee needs access to company portal and training materials.',
      status: 'closed',
      priority: 'medium',
      category: 'general',
      assignedToId: '2',
      assignedToName: 'John Doe',
      assignedTeamId: '1',
      assignedTeamName: 'Technical Support',
      customerId: 'emp-001',
      customerEmail: 'jennifer.brown@company.com',
      customerName: 'Jennifer Brown',
      country: 'AU',
      tags: ['access', 'onboarding', 'portal'],
      attachments: ['employee-form.pdf'],
      slaDeadline: '2024-09-20T17:00:00Z',
      responseTime: 30,
      resolutionTime: 2,
      satisfactionScore: 4,
      estimatedEffort: 1,
      actualEffort: 1,
      isEscalated: false,
      escalationReason: null,
      lastUpdatedBy: 'John Doe',
      notes: ['Account created', 'Training materials sent', 'Access confirmed'],
      createdAt: '2024-09-20T09:00:00Z',
      updatedAt: '2024-09-20T17:00:00Z',
      resolvedAt: '2024-09-20T11:00:00Z',
      closedAt: '2024-09-20T17:00:00Z'
    }
  ];

  async findAll(filters?: any): Promise<Ticket[]> {
    let filteredTickets = [...this.tickets];

    if (filters) {
      if (filters.status) {
        filteredTickets = filteredTickets.filter(ticket => ticket.status === filters.status);
      }
      if (filters.priority) {
        filteredTickets = filteredTickets.filter(ticket => ticket.priority === filters.priority);
      }
      if (filters.assignedTeamId) {
        filteredTickets = filteredTickets.filter(ticket => ticket.assignedTeamId === filters.assignedTeamId);
      }
      if (filters.assignedToId) {
        filteredTickets = filteredTickets.filter(ticket => ticket.assignedToId === filters.assignedToId);
      }
      if (filters.country) {
        filteredTickets = filteredTickets.filter(ticket => ticket.country === filters.country);
      }
      if (filters.category) {
        filteredTickets = filteredTickets.filter(ticket => ticket.category === filters.category);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredTickets = filteredTickets.filter(ticket => 
          ticket.title.toLowerCase().includes(searchLower) ||
          ticket.description.toLowerCase().includes(searchLower) ||
          ticket.customerEmail.toLowerCase().includes(searchLower)
        );
      }
    }

    return filteredTickets;
  }

  async findOne(id: string): Promise<Ticket | undefined> {
    return this.tickets.find(ticket => ticket.id === id);
  }

  async create(ticketData: Partial<Ticket>): Promise<Ticket> {
    const newTicket: Ticket = {
      id: (this.tickets.length + 1).toString(),
      title: ticketData.title || '',
      description: ticketData.description || '',
      status: ticketData.status || 'open',
      priority: ticketData.priority || 'medium',
      category: ticketData.category || 'general',
      assignedToId: ticketData.assignedToId || null,
      assignedToName: ticketData.assignedToName || null,
      assignedTeamId: ticketData.assignedTeamId || null,
      assignedTeamName: ticketData.assignedTeamName || null,
      customerId: ticketData.customerId || '',
      customerEmail: ticketData.customerEmail || '',
      customerName: ticketData.customerName || '',
      country: ticketData.country || '',
      tags: ticketData.tags || [],
      attachments: ticketData.attachments || [],
      slaDeadline: ticketData.slaDeadline || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      responseTime: null,
      resolutionTime: null,
      satisfactionScore: null,
      estimatedEffort: ticketData.estimatedEffort || null,
      actualEffort: null,
      isEscalated: false,
      escalationReason: null,
      lastUpdatedBy: ticketData.lastUpdatedBy || 'System',
      notes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      resolvedAt: null,
      closedAt: null
    };

    this.tickets.push(newTicket);
    return newTicket;
  }

  async update(id: string, updateData: Partial<Ticket>): Promise<Ticket | undefined> {
    const ticketIndex = this.tickets.findIndex(ticket => ticket.id === id);
    if (ticketIndex === -1) {
      return undefined;
    }

    const updatedTicket = {
      ...this.tickets[ticketIndex],
      ...updateData,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };

    // Handle status changes
    if (updateData.status === 'resolved' && this.tickets[ticketIndex].status !== 'resolved') {
      updatedTicket.resolvedAt = new Date().toISOString();
    }
    if (updateData.status === 'closed' && this.tickets[ticketIndex].status !== 'closed') {
      updatedTicket.closedAt = new Date().toISOString();
    }

    this.tickets[ticketIndex] = updatedTicket;
    return updatedTicket;
  }

  async delete(id: string): Promise<boolean> {
    const ticketIndex = this.tickets.findIndex(ticket => ticket.id === id);
    if (ticketIndex === -1) {
      return false;
    }

    this.tickets.splice(ticketIndex, 1);
    return true;
  }

  async bulkUpdate(ticketIds: string[], updateData: Partial<Ticket>): Promise<Ticket[]> {
    const updatedTickets: Ticket[] = [];
    
    for (const id of ticketIds) {
      const updated = await this.update(id, updateData);
      if (updated) {
        updatedTickets.push(updated);
      }
    }
    
    return updatedTickets;
  }

  async assign(ticketId: string, assigneeId: string, assigneeName: string, teamId?: string, teamName?: string): Promise<Ticket | undefined> {
    return await this.update(ticketId, {
      assignedToId: assigneeId,
      assignedToName: assigneeName,
      assignedTeamId: teamId || null,
      assignedTeamName: teamName || null
    });
  }

  async escalate(ticketId: string, reason: string): Promise<Ticket | undefined> {
    return await this.update(ticketId, {
      isEscalated: true,
      escalationReason: reason,
      priority: 'high' // Auto-escalate priority
    });
  }

  async addNote(ticketId: string, note: string): Promise<Ticket | undefined> {
    const ticket = await this.findOne(ticketId);
    if (!ticket) {
      return undefined;
    }

    ticket.notes.push(note);
    ticket.updatedAt = new Date().toISOString();
    
    return ticket;
  }

  async getTicketStats(): Promise<any> {
    const totalTickets = this.tickets.length;
    const openTickets = this.tickets.filter(t => ['open', 'in_progress', 'pending'].includes(t.status)).length;
    const resolvedTickets = this.tickets.filter(t => t.status === 'resolved').length;
    const overdueTickets = this.tickets.filter(t => new Date(t.slaDeadline) < new Date() && !['resolved', 'closed'].includes(t.status)).length;
    const criticalTickets = this.tickets.filter(t => t.priority === 'critical' && !['resolved', 'closed'].includes(t.status)).length;
    
    const avgSatisfaction = this.tickets
      .filter(t => t.satisfactionScore !== null)
      .reduce((sum, t) => sum + (t.satisfactionScore || 0), 0) / this.tickets.filter(t => t.satisfactionScore !== null).length || 0;

    return {
      totalTickets,
      openTickets,
      resolvedTickets,
      overdueTickets,
      criticalTickets,
      avgSatisfactionScore: Math.round(avgSatisfaction * 10) / 10,
      slaCompliance: Math.round(((totalTickets - overdueTickets) / totalTickets) * 100)
    };
  }
}