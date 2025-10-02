import { Injectable } from '@nestjs/common';

export interface Notification {
  id: string;
  type: 'sla_breach' | 'new_ticket' | 'ticket_assigned' | 'ticket_resolved' | 'system_alert' | 'user_activity' | 'performance_alert';
  title: string;
  message: string;
  recipient: string;
  recipientType: 'user' | 'team' | 'all';
  priority: 'low' | 'medium' | 'high' | 'critical';
  isRead: boolean;
  actionRequired: boolean;
  actionUrl?: string;
  metadata: any;
  createdAt: string;
  readAt?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'notification' | 'welcome' | 'reminder' | 'alert';
  variables: string[];
  isActive: boolean;
}

export interface BulkEmailJob {
  id: string;
  subject: string;
  body: string;
  recipients: string[];
  status: 'pending' | 'sending' | 'completed' | 'failed';
  sentCount: number;
  failedCount: number;
  createdAt: string;
  completedAt?: string;
}

@Injectable()
export class MockNotificationsService {
  private notifications: Notification[] = [
    {
      id: '1',
      type: 'sla_breach',
      title: 'SLA Breach Alert',
      message: 'Ticket #1 "Login Issue with Multi-Factor Authentication" has exceeded SLA deadline',
      recipient: 'admin',
      recipientType: 'user',
      priority: 'critical',
      isRead: false,
      actionRequired: true,
      actionUrl: '/tickets/1',
      metadata: {
        ticketId: '1',
        deadline: '2024-10-02T14:00:00Z',
        breachTime: '2024-10-02T15:30:00Z'
      },
      createdAt: '2024-10-02T15:30:00Z'
    },
    {
      id: '2',
      type: 'new_ticket',
      title: 'New High Priority Ticket',
      message: 'A new high priority ticket has been created: "Payment Processing Error"',
      recipient: 'technical_support',
      recipientType: 'team',
      priority: 'high',
      isRead: false,
      actionRequired: true,
      actionUrl: '/tickets/2',
      metadata: {
        ticketId: '2',
        priority: 'high',
        category: 'billing'
      },
      createdAt: '2024-10-01T13:00:00Z'
    },
    {
      id: '3',
      type: 'ticket_assigned',
      title: 'Ticket Assigned',
      message: 'You have been assigned ticket #3: "Feature Request: Dark Mode Support"',
      recipient: '4',
      recipientType: 'user',
      priority: 'medium',
      isRead: true,
      actionRequired: false,
      actionUrl: '/tickets/3',
      metadata: {
        ticketId: '3',
        assignedBy: 'admin'
      },
      createdAt: '2024-09-30T11:20:00Z',
      readAt: '2024-09-30T14:45:00Z'
    },
    {
      id: '4',
      type: 'performance_alert',
      title: 'Team Performance Alert',
      message: 'Technical Support team SLA compliance has dropped below 95% threshold',
      recipient: 'management',
      recipientType: 'team',
      priority: 'medium',
      isRead: false,
      actionRequired: true,
      actionUrl: '/reports/team-performance',
      metadata: {
        teamId: '1',
        currentCompliance: 94.2,
        threshold: 95.0
      },
      createdAt: '2024-10-01T09:00:00Z'
    },
    {
      id: '5',
      type: 'system_alert',
      title: 'System Maintenance Scheduled',
      message: 'Scheduled maintenance window: October 5, 2024 2:00 AM - 4:00 AM UTC',
      recipient: 'all',
      recipientType: 'all',
      priority: 'low',
      isRead: false,
      actionRequired: false,
      metadata: {
        maintenanceStart: '2024-10-05T02:00:00Z',
        maintenanceEnd: '2024-10-05T04:00:00Z'
      },
      createdAt: '2024-10-01T08:00:00Z'
    }
  ];

  private emailTemplates: EmailTemplate[] = [
    {
      id: '1',
      name: 'SLA Breach Alert',
      subject: 'URGENT: SLA Breach - Ticket #{ticketId}',
      body: 'Dear {recipientName},\n\nThis is an urgent notification that ticket #{ticketId} "{ticketTitle}" has exceeded its SLA deadline.\n\nDeadline: {deadline}\nCurrent Status: {status}\n\nPlease take immediate action to resolve this issue.\n\nBest regards,\nApaceTicket System',
      type: 'alert',
      variables: ['recipientName', 'ticketId', 'ticketTitle', 'deadline', 'status'],
      isActive: true
    },
    {
      id: '2',
      name: 'Welcome New User',
      subject: 'Welcome to ApaceTicket - {companyName}',
      body: 'Hello {userName},\n\nWelcome to ApaceTicket! Your account has been successfully created.\n\nLogin Details:\nEmail: {userEmail}\nTemporary Password: {tempPassword}\n\nPlease log in and change your password immediately.\n\nFor support, contact your administrator.\n\nBest regards,\nApaceTicket Team',
      type: 'welcome',
      variables: ['userName', 'userEmail', 'tempPassword', 'companyName'],
      isActive: true
    },
    {
      id: '3',
      name: 'Ticket Assignment Notification',
      subject: 'Ticket Assigned: #{ticketId} - {ticketTitle}',
      body: 'Hi {assigneeName},\n\nYou have been assigned a new ticket:\n\nTicket ID: #{ticketId}\nTitle: {ticketTitle}\nPriority: {priority}\nCustomer: {customerName}\nDeadline: {deadline}\n\nPlease review and begin working on this ticket.\n\nView ticket: {ticketUrl}\n\nBest regards,\nApaceTicket System',
      type: 'notification',
      variables: ['assigneeName', 'ticketId', 'ticketTitle', 'priority', 'customerName', 'deadline', 'ticketUrl'],
      isActive: true
    }
  ];

  private bulkEmailJobs: BulkEmailJob[] = [
    {
      id: '1',
      subject: 'Monthly Performance Update',
      body: 'This is a monthly update on team performance and system metrics.',
      recipients: ['admin@apace.local', 'support@apace.local', 'dev@apace.local'],
      status: 'completed',
      sentCount: 3,
      failedCount: 0,
      createdAt: '2024-10-01T10:00:00Z',
      completedAt: '2024-10-01T10:05:00Z'
    }
  ];

  async findAll(filters?: any): Promise<Notification[]> {
    let filteredNotifications = [...this.notifications];

    if (filters) {
      if (filters.recipient) {
        filteredNotifications = filteredNotifications.filter(n => 
          n.recipient === filters.recipient || n.recipientType === 'all'
        );
      }
      if (filters.type) {
        filteredNotifications = filteredNotifications.filter(n => n.type === filters.type);
      }
      if (filters.isRead !== undefined) {
        filteredNotifications = filteredNotifications.filter(n => n.isRead === filters.isRead);
      }
      if (filters.priority) {
        filteredNotifications = filteredNotifications.filter(n => n.priority === filters.priority);
      }
    }

    return filteredNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async findOne(id: string): Promise<Notification | undefined> {
    return this.notifications.find(notification => notification.id === id);
  }

  async create(notificationData: Partial<Notification>): Promise<Notification> {
    const newNotification: Notification = {
      id: (this.notifications.length + 1).toString(),
      type: notificationData.type || 'system_alert',
      title: notificationData.title || '',
      message: notificationData.message || '',
      recipient: notificationData.recipient || 'all',
      recipientType: notificationData.recipientType || 'all',
      priority: notificationData.priority || 'medium',
      isRead: false,
      actionRequired: notificationData.actionRequired || false,
      actionUrl: notificationData.actionUrl,
      metadata: notificationData.metadata || {},
      createdAt: new Date().toISOString()
    };

    this.notifications.push(newNotification);
    return newNotification;
  }

  async markAsRead(id: string, userId: string): Promise<Notification | undefined> {
    const notification = this.notifications.find(n => n.id === id);
    if (!notification) {
      return undefined;
    }

    notification.isRead = true;
    notification.readAt = new Date().toISOString();
    return notification;
  }

  async markAllAsRead(userId: string): Promise<number> {
    let count = 0;
    this.notifications.forEach(notification => {
      if (!notification.isRead && (notification.recipient === userId || notification.recipientType === 'all')) {
        notification.isRead = true;
        notification.readAt = new Date().toISOString();
        count++;
      }
    });
    return count;
  }

  async delete(id: string): Promise<boolean> {
    const notificationIndex = this.notifications.findIndex(n => n.id === id);
    if (notificationIndex === -1) {
      return false;
    }

    this.notifications.splice(notificationIndex, 1);
    return true;
  }

  async getEmailTemplates(): Promise<EmailTemplate[]> {
    return this.emailTemplates.filter(template => template.isActive);
  }

  async createEmailTemplate(templateData: Partial<EmailTemplate>): Promise<EmailTemplate> {
    const newTemplate: EmailTemplate = {
      id: (this.emailTemplates.length + 1).toString(),
      name: templateData.name || '',
      subject: templateData.subject || '',
      body: templateData.body || '',
      type: templateData.type || 'notification',
      variables: templateData.variables || [],
      isActive: templateData.isActive !== undefined ? templateData.isActive : true
    };

    this.emailTemplates.push(newTemplate);
    return newTemplate;
  }

  async sendBulkEmail(emailData: { subject: string; body: string; recipients: string[] }): Promise<BulkEmailJob> {
    const newJob: BulkEmailJob = {
      id: (this.bulkEmailJobs.length + 1).toString(),
      subject: emailData.subject,
      body: emailData.body,
      recipients: emailData.recipients,
      status: 'pending',
      sentCount: 0,
      failedCount: 0,
      createdAt: new Date().toISOString()
    };

    this.bulkEmailJobs.push(newJob);

    // Simulate email sending process
    setTimeout(() => {
      newJob.status = 'completed';
      newJob.sentCount = newJob.recipients.length;
      newJob.completedAt = new Date().toISOString();
    }, 2000);

    return newJob;
  }

  async getBulkEmailJobs(): Promise<BulkEmailJob[]> {
    return this.bulkEmailJobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getNotificationStats(userId?: string): Promise<any> {
    const userNotifications = userId 
      ? this.notifications.filter(n => n.recipient === userId || n.recipientType === 'all')
      : this.notifications;

    const unreadCount = userNotifications.filter(n => !n.isRead).length;
    const criticalCount = userNotifications.filter(n => n.priority === 'critical' && !n.isRead).length;
    const actionRequiredCount = userNotifications.filter(n => n.actionRequired && !n.isRead).length;

    return {
      totalNotifications: userNotifications.length,
      unreadCount,
      criticalCount,
      actionRequiredCount
    };
  }
}