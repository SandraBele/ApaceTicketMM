// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  country: string;
  teamId?: string | null;
  team?: Team | null;
  isLocked: boolean;
  failedLoginAttempts: number;
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  fullName?: string;
}

export enum UserRole {
  ADMIN = 'admin',
  TECH_SUPPORT = 'tech_support',
  BUSINESS_DEV = 'business_dev',
  MANAGEMENT = 'management',
  PRODUCT_DEV = 'product_dev',
}

// Team Types
export interface Team {
  id: string;
  name: string;
  description: string;
  members: string[];
  lead: string;
  kpiTargets: KPITargets;
  createdAt: string;
  updatedAt?: string;
  // Extended properties for admin components
  department?: string;
  teamLead?: string;
  memberCount?: number;
  performance?: number;
  status?: 'active' | 'inactive';
}

export interface KPITargets {
  monthlyTickets: number;
  resolutionTime: number; // hours
  satisfactionScore: number; // 1-5 scale
}

// Ticket Types
export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignedTo?: string;
  assignedTeam?: string;
  customer: string;
  country: string;
  createdAt: string;
  updatedAt: string;
  slaDeadline: string;
}

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  PENDING = 'pending',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

// Report Types
export interface Report {
  id: string;
  name: string;
  type: ReportType;
  period: string;
  generatedAt: string;
  metrics: any;
}

export enum ReportType {
  USER_PERFORMANCE = 'user_performance',
  TEAM_PERFORMANCE = 'team_performance',
  TICKET_ANALYTICS = 'ticket_analytics',
  FINANCIAL_SUMMARY = 'financial_summary'
}

// Notification Types
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  // Extended properties for admin components
  priority?: 'low' | 'medium' | 'high';
  targetAudience?: 'all' | 'admins' | 'managers' | 'staff';
  createdAt?: string;
}

export enum NotificationType {
  SLA_BREACH = 'sla_breach',
  NEW_USER = 'new_user',
  TICKET_ASSIGNED = 'ticket_assigned',
  SYSTEM_ALERT = 'system_alert'
}

// Invoice Types
export interface Invoice {
  id: string;
  number: string;
  customer: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  dueDate: string;
  paidDate?: string;
  country: string;
}

export enum InvoiceStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled'
}

// Audit Log Types
export interface AuditLog {
  id: string;
  action: string;
  performedById: string;
  targetUserId?: string;
  entityType: string;
  entityId: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Form Types
export interface CreateUserForm {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: UserRole;
  country: string;
  teamId?: string;
}

export interface UpdateUserForm {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  country?: string;
  teamId?: string;
  isActive?: boolean;
  isLocked?: boolean;
}

export interface CreateTeamForm {
  name: string;
  description: string;
  lead: string;
  kpiTargets: KPITargets;
}

export interface BulkUserOperation {
  userIds: string[];
  action: 'activate' | 'deactivate' | 'lock' | 'unlock' | 'assignTeam' | 'removeTeam' | 'changeRole';
  value?: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalTickets: number;
  openTickets: number;
  totalTeams: number;
  slaBreaches: number;
}

// Financial Stats
export interface FinancialStats {
  totalRevenue: number;
  pendingPayments: number;
  overdueInvoices: number;
  paymentRate: number;
  averagePaymentTime: number;
}

// Extended Admin Types for New Components

// Financial Management Types
export interface FinancialData {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  revenueGrowth: number;
  expenseGrowth: number;
  profitMargin: number;
  expenseBreakdown: ExpenseCategory[];
}

export interface ExpenseCategory {
  name: string;
  amount: number;
  percentage: number;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
}

// Team and KPI Management Types
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  performance: number;
  joinedAt: string;
}

export interface KPI {
  id: string;
  name: string;
  category: string;
  currentValue: number;
  targetValue: number;
  progress: number;
  status: 'on-track' | 'at-risk' | 'behind' | 'completed';
  unit: string;
  lastUpdated: string;
}

// Extended Team interface
export interface ExtendedTeam extends Team {
  department: string;
  teamLead: string;
  memberCount: number;
  performance: number;
  status: 'active' | 'inactive';
}

// System Administration Types
export interface SystemConfig {
  siteName: string;
  adminEmail: string;
  sessionTimeout: number;
  maxUploadSize: number;
  maintenanceMode: boolean;
  debugMode: boolean;
  allowRegistration: boolean;
  emailVerificationRequired: boolean;
}

export interface SystemStats {
  overallStatus: 'healthy' | 'warning' | 'critical';
  uptime: string;
  version: string;
  environment: 'production' | 'staging' | 'development';
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  services: ServiceStatus[];
  recentActivity: SystemActivity[];
}

export interface ServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  uptime: string;
  responseTime: number;
}

export interface SystemActivity {
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  user?: string;
}

export interface BackupInfo {
  id: string;
  type: 'full' | 'incremental';
  size: number;
  createdAt: string;
  status: 'completed' | 'in-progress' | 'failed';
}

// Communication and Notification Types
export interface ExtendedNotification extends Notification {
  priority: 'low' | 'medium' | 'high';
  targetAudience: 'all' | 'admins' | 'managers' | 'staff';
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  targetAudience: 'all' | 'admins' | 'managers' | 'staff';
  createdBy: string;
  createdAt: string;
  expiresAt?: string;
  isActive: boolean;
}

// Reporting and Analytics Types
export interface AnalyticsData {
  period: string;
  metrics: {
    userGrowth: number;
    ticketVolume: number;
    resolutionRate: number;
    customerSatisfaction: number;
    teamProductivity: number;
  };
  trends: {
    userRegistrations: DataPoint[];
    ticketCreation: DataPoint[];
    revenueGrowth: DataPoint[];
  };
}

export interface DataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface ReportConfig {
  id: string;
  name: string;
  type: 'scheduled' | 'on-demand';
  frequency?: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  parameters: Record<string, any>;
  lastGenerated?: string;
  nextScheduled?: string;
}

// Extended Ticket Types
export interface TicketMetrics {
  totalTickets: number;
  openTickets: number;
  closedTickets: number;
  overdueTickets: number;
  averageResolutionTime: number;
  customerSatisfactionScore: number;
  slaCompliance: number;
}

export interface TicketFilter {
  status?: TicketStatus[];
  priority?: TicketPriority[];
  assignedTo?: string[];
  country?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

// API Extended Types
export interface UsersStatistics {
  total: number;
  active: number;
  locked: number;
  byRole: Record<UserRole, number>;
  byCountry: Record<string, number>;
  recentRegistrations: number;
}

export interface TicketsStatistics {
  totalTickets: number;
  openTickets: number;
  closedTickets: number;
  overdueTickets: number;
  averageResolutionTime: number;
  slaBreaches: number;
  byPriority: Record<TicketPriority, number>;
  byStatus: Record<TicketStatus, number>;
}

// Form Types for New Components
export interface CreateAnnouncementForm {
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  targetAudience: 'all' | 'admins' | 'managers' | 'staff';
  expiresAt?: string;
}

export interface CreateTransactionForm {
  description: string;
  category: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  date: string;
}

export interface CreateKPIForm {
  name: string;
  category: string;
  targetValue: number;
  unit: string;
  description?: string;
}