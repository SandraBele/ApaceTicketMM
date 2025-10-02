import axios from 'axios';

// Configure axios base URL for the backend API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
};

// Users API
export const usersAPI = {
  getUsers: (params?: any) => api.get('/users', { params }),
  getUser: (id: string) => api.get(`/users/${id}`),
  createUser: (userData: any) => api.post('/users', userData),
  updateUser: (id: string, userData: any) => api.patch(`/users/${id}`, userData),
  deleteUser: (id: string) => api.delete(`/users/${id}`),
  getUserStats: () => api.get('/users/stats'),
  getUserStatistics: () => api.get('/users/statistics'),
  batchOperation: (operation: any) => api.post('/users/batch-operation', operation),
  generatePassword: () => api.post('/users/generate-password'),
  getUsersByTeam: (teamId: string) => api.get(`/users/by-team/${teamId}`),
  getUsersByRole: (role: string) => api.get(`/users/by-role/${role}`),
  getUsersByCountry: (country: string) => api.get(`/users/by-country/${country}`),
  deactivateUser: (id: string) => api.patch(`/users/${id}/deactivate`),
  reactivateUser: (id: string) => api.patch(`/users/${id}/reactivate`),
  lockUser: (id: string) => api.patch(`/users/${id}/lock`),
  unlockUser: (id: string) => api.patch(`/users/${id}/unlock`),
  resetPassword: (id: string, newPassword: string) =>
    api.patch(`/users/${id}/reset-password`, { newPassword }),
  assignToTeam: (id: string, teamId: string) =>
    api.patch(`/users/${id}/assign-team`, { teamId }),
  removeFromTeam: (id: string) => api.patch(`/users/${id}/remove-team`),
};

// Audit Logs API
export const auditLogsAPI = {
  getLogs: (params?: any) => api.get('/audit-logs', { params }),
  createLog: (logData: any) => api.post('/audit-logs', logData),
};

// Real API services connected to backend
export const teamsAPI = {
  getTeams: () => api.get('/teams'),
  getTeam: (id: string) => api.get(`/teams/${id}`),
  createTeam: (teamData: any) => api.post('/teams', teamData),
  updateTeam: (id: string, teamData: any) => api.patch(`/teams/${id}`, teamData),
  deleteTeam: (id: string) => api.delete(`/teams/${id}`),
  addMember: (teamId: string, userId: string) => api.patch(`/teams/${teamId}/add-member`, { userId }),
  removeMember: (teamId: string, userId: string) => api.patch(`/teams/${teamId}/remove-member`, { userId }),
  updateKPITargets: (teamId: string, kpiTargets: any) => api.patch(`/teams/${teamId}/kpi-targets`, kpiTargets),
  updateSLADefaults: (teamId: string, slaDefaults: any) => api.patch(`/teams/${teamId}/sla-defaults`, slaDefaults),
  getTeamStats: () => api.get('/teams/stats'),
};

export const ticketsAPI = {
  getTickets: (params?: any) => api.get('/tickets', { params }),
  getTicket: (id: string) => api.get(`/tickets/${id}`),
  createTicket: (ticketData: any) => api.post('/tickets', ticketData),
  updateTicket: (id: string, ticketData: any) => api.patch(`/tickets/${id}`, ticketData),
  deleteTicket: (id: string) => api.delete(`/tickets/${id}`),
  bulkUpdate: (operation: any) => api.post('/tickets/bulk-update', operation),
  assignTicket: (ticketId: string, assignmentData: any) => api.patch(`/tickets/${ticketId}/assign`, assignmentData),
  escalateTicket: (ticketId: string, reason: string) => api.patch(`/tickets/${ticketId}/escalate`, { reason }),
  addNote: (ticketId: string, note: string) => api.post(`/tickets/${ticketId}/notes`, { note }),
  getTicketStats: () => api.get('/tickets/stats'),
};

export const reportsAPI = {
  getReports: () => api.get('/reports'),
  getReport: (id: string) => api.get(`/reports/${id}`),
  getTemplates: () => api.get('/reports/templates'),
  generateReport: (reportData: any) => api.post('/reports/generate', reportData),
  exportReport: (reportId: string, format: string) => api.post(`/reports/${reportId}/export`, { format }),
  deleteReport: (id: string) => api.delete(`/reports/${id}`),
};

export const notificationsAPI = {
  getNotifications: (params?: any) => api.get('/notifications', { params }),
  getNotification: (id: string) => api.get(`/notifications/${id}`),
  createNotification: (notificationData: any) => api.post('/notifications', notificationData),
  markAsRead: (id: string, userId: string) => api.patch(`/notifications/${id}/read`, { userId }),
  markAllAsRead: (userId: string) => api.patch('/notifications/mark-all-read', { userId }),
  deleteNotification: (id: string) => api.delete(`/notifications/${id}`),
  getEmailTemplates: () => api.get('/notifications/email-templates'),
  createEmailTemplate: (templateData: any) => api.post('/notifications/email-templates', templateData),
  sendBulkEmail: (emailData: any) => api.post('/notifications/send-bulk-email', emailData),
  getBulkEmailJobs: () => api.get('/notifications/bulk-email-jobs'),
  getNotificationStats: (userId?: string) => api.get('/notifications/stats', { params: { userId } }),
};

export const financialAPI = {
  getInvoices: (params?: any) => api.get('/financial/invoices', { params }),
  getInvoice: (id: string) => api.get(`/financial/invoices/${id}`),
  createInvoice: (invoiceData: any) => api.post('/financial/invoices', invoiceData),
  updateInvoice: (id: string, invoiceData: any) => api.patch(`/financial/invoices/${id}`, invoiceData),
  updateInvoiceStatus: (id: string, statusData: any) => api.patch(`/financial/invoices/${id}/status`, statusData),
  deleteInvoice: (id: string) => api.delete(`/financial/invoices/${id}`),
  getFinancialStats: () => api.get('/financial/stats'),
  getPayments: (invoiceId?: string) => api.get('/financial/payments', { params: { invoiceId } }),
};

export const systemConfigAPI = {
  getConfigs: (params?: any) => api.get('/system-config/configs', { params }),
  getConfig: (key: string) => api.get(`/system-config/configs/${key}`),
  updateConfig: (key: string, value: any, updatedBy: string) => api.patch(`/system-config/configs/${key}`, { value, updatedBy }),
  createConfig: (configData: any) => api.post('/system-config/configs', configData),
  deleteConfig: (key: string) => api.delete(`/system-config/configs/${key}`),
  getConfigCategories: () => api.get('/system-config/configs/categories'),
  getSystemHealth: () => api.get('/system-config/health'),
  getBackups: () => api.get('/system-config/backups'),
  createBackup: (type: 'automatic' | 'manual' = 'manual') => api.post('/system-config/backups', { type }),
  deleteBackup: (id: string) => api.delete(`/system-config/backups/${id}`),
};

// Mock Data
const mockTeams = [
  {
    id: '1',
    name: 'Technical Support',
    description: 'Customer technical support team',
    members: ['2'],
    lead: 'John Doe',
    kpiTargets: {
      monthlyTickets: 100,
      resolutionTime: 24,
      satisfactionScore: 4.5
    },
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Product Development',
    description: 'Software development and engineering team',
    members: [],
    lead: 'Jane Smith',
    kpiTargets: {
      monthlyTickets: 50,
      resolutionTime: 48,
      satisfactionScore: 4.0
    },
    createdAt: '2024-01-01T00:00:00Z'
  }
];

const mockTickets = [
  {
    id: '1',
    title: 'Login Issue with Multi-Factor Authentication',
    description: 'User unable to complete 2FA login process',
    status: 'open',
    priority: 'high',
    assignedTo: '2',
    assignedTeam: '1',
    customer: 'customer@example.com',
    country: 'United States',
    createdAt: '2024-10-01T10:00:00Z',
    updatedAt: '2024-10-01T14:30:00Z',
    slaDeadline: '2024-10-02T10:00:00Z'
  },
  {
    id: '2',
    title: 'Payment Processing Error',
    description: 'Customer experiencing payment gateway timeout',
    status: 'in_progress',
    priority: 'medium',
    assignedTo: '2',
    assignedTeam: '1',
    customer: 'billing@company.com',
    country: 'Canada',
    createdAt: '2024-10-01T09:00:00Z',
    updatedAt: '2024-10-01T13:00:00Z',
    slaDeadline: '2024-10-03T09:00:00Z'
  }
];

const mockReports = [
  {
    id: '1',
    name: 'Monthly User Performance',
    type: 'user_performance',
    period: 'September 2024',
    generatedAt: '2024-10-01T00:00:00Z',
    metrics: {
      totalTickets: 156,
      resolvedTickets: 142,
      avgResolutionTime: 18.5,
      satisfactionScore: 4.2
    }
  }
];

const mockNotifications = [
  {
    id: '1',
    type: 'sla_breach',
    title: 'SLA Breach Alert',
    message: 'Ticket #1234 has exceeded SLA deadline',
    timestamp: '2024-10-01T15:30:00Z',
    read: false
  },
  {
    id: '2',
    type: 'new_user',
    title: 'New User Registration',
    message: 'New user account created: john.doe@company.com',
    timestamp: '2024-10-01T14:00:00Z',
    read: true
  }
];

const mockInvoices = [
  {
    id: '1',
    number: 'INV-2024-001',
    customer: 'Acme Corporation',
    amount: 2500.00,
    currency: 'USD',
    status: 'paid',
    dueDate: '2024-09-30T00:00:00Z',
    paidDate: '2024-09-28T00:00:00Z',
    country: 'United States'
  },
  {
    id: '2',
    number: 'INV-2024-002',
    customer: 'Global Tech Solutions',
    amount: 1800.00,
    currency: 'USD',
    status: 'overdue',
    dueDate: '2024-09-15T00:00:00Z',
    country: 'Canada'
  }
];

// Centralized API object with all methods
export const api = {
  // Authentication
  login: (email: string, password: string) => authAPI.login(email, password),
  logout: () => authAPI.logout(),

  // Users
  getUsers: (params?: any) => usersAPI.getUsers(params),
  getUser: (id: string) => usersAPI.getUser(id),
  createUser: (userData: any) => usersAPI.createUser(userData),
  updateUser: (id: string, userData: any) => usersAPI.updateUser(id, userData),
  deleteUser: (id: string) => usersAPI.deleteUser(id),
  getUsersStatistics: () => usersAPI.getUserStatistics(),
  batchUserOperation: (operation: any) => usersAPI.batchOperation(operation),

  // Teams
  getTeams: () => teamsAPI.getTeams(),
  getTeam: (id: string) => teamsAPI.getTeam(id),
  createTeam: (teamData: any) => teamsAPI.createTeam(teamData),
  updateTeam: (id: string, teamData: any) => teamsAPI.updateTeam(id, teamData),
  deleteTeam: (id: string) => teamsAPI.deleteTeam(id),

  // Tickets
  getTickets: (params?: any) => ticketsAPI.getTickets(params),
  getTicketsStats: () => ticketsAPI.getTicketStats(),
  createTicket: (ticketData: any) => ticketsAPI.createTicket(ticketData),
  updateTicket: (id: string, ticketData: any) => ticketsAPI.updateTicket(id, ticketData),
  bulkUpdateTickets: (operation: any) => ticketsAPI.bulkUpdate(operation),

  // Reports
  getReports: () => reportsAPI.getReports(),
  generateReport: (reportData: any) => reportsAPI.generateReport(reportData),
  exportReport: (reportId: string, format: string) => reportsAPI.exportReport(reportId, format),

  // Notifications
  getNotifications: () => notificationsAPI.getNotifications(),
  markNotificationRead: (id: string) => notificationsAPI.markAsRead(id, 'current-user'),
  sendAnnouncement: (announcementData: any) => notificationsAPI.createNotification(announcementData),

  // Financial
  getFinancialOverview: (period: string) => financialAPI.getFinancialStats(),
  getTransactions: (params?: any) => api.get('/financial/transactions', { params }),
  createTransaction: (transactionData: any) => api.post('/financial/transactions', transactionData),

  // System Administration
  getSystemConfig: () => systemConfigAPI.getConfigs(),
  updateSystemConfig: (config: any) => api.patch('/system-config', config),
  getSystemStats: () => systemConfigAPI.getSystemHealth(),

  // KPIs
  getKPIs: () => api.get('/kpis'),
  createKPI: (kpiData: any) => api.post('/kpis', kpiData),
  updateKPI: (id: string, kpiData: any) => api.patch(`/kpis/${id}`, kpiData),

  // Analytics
  getAnalyticsData: (period?: string) => api.get('/analytics', { params: { period } }),
  getDashboardMetrics: () => api.get('/analytics/dashboard'),

  // Audit Logs
  getAuditLogs: (params?: any) => auditLogsAPI.getLogs(params),
};