import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { Ticket } from '../tickets/entities/ticket.entity';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { AuditAction } from '../audit-logs/entities/audit-log.entity';
import * as nodemailer from 'nodemailer';

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
    private auditLogsService: AuditLogsService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'mailhog',
      port: parseInt(process.env.SMTP_PORT) || 1025,
      secure: false, // true for 465, false for other ports
      auth: process.env.SMTP_AUTH_USER ? {
        user: process.env.SMTP_AUTH_USER,
        pass: process.env.SMTP_AUTH_PASS,
      } : undefined,
    });
  }

  async sendEmail(
    to: string | string[],
    subject: string,
    text: string,
    html?: string,
    from?: string
  ): Promise<void> {
    try {
      const recipients = Array.isArray(to) ? to : [to];
      
      await this.transporter.sendMail({
        from: from || process.env.FROM_EMAIL || 'noreply@apaceticket.com',
        to: recipients.join(', '),
        subject,
        text,
        html: html || text,
      });

      // Log email sending
      await this.auditLogsService.logAction(
        AuditAction.EMAIL_SENT,
        undefined, // No specific performer for system emails
        undefined,
        'email',
        undefined,
        `Email sent to: ${recipients.join(', ')} - Subject: ${subject}`,
      );
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  async sendBulkEmail(
    recipients: string[],
    subject: string,
    text: string,
    html?: string,
    performedById?: string
  ): Promise<void> {
    const batchSize = 50; // Send in batches to avoid overwhelming the server
    
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      await this.sendEmail(batch, subject, text, html);
    }

    // Log bulk email action
    await this.auditLogsService.logAction(
      AuditAction.EMAIL_SENT,
      performedById,
      undefined,
      'bulk_email',
      undefined,
      `Bulk email sent to ${recipients.length} recipients - Subject: ${subject}`,
    );
  }

  async sendSLABreachNotification(ticket: Ticket): Promise<void> {
    const template = this.getSLABreachTemplate(ticket);
    
    // Send to assigned user
    if (ticket.assignedTo) {
      await this.sendEmail(
        ticket.assignedTo.email,
        template.subject,
        template.text,
        template.html
      );
    }

    // Send to admins and management
    const adminUsers = await this.usersRepository.find({
      where: [{ role: UserRole.ADMIN }, { role: UserRole.MANAGEMENT }],
      select: ['email'],
    });

    if (adminUsers.length > 0) {
      await this.sendBulkEmail(
        adminUsers.map(user => user.email),
        template.subject,
        template.text,
        template.html
      );
    }
  }

  async sendOverdueInvoiceNotification(invoice: any): Promise<void> {
    const template = this.getOverdueInvoiceTemplate(invoice);
    
    // Send to client
    await this.sendEmail(
      invoice.clientEmail,
      template.subject,
      template.text,
      template.html
    );

    // Send copy to invoice creator and business dev team
    const businessDevUsers = await this.usersRepository.find({
      where: { role: UserRole.BUSINESS_DEV },
      select: ['email'],
    });

    if (businessDevUsers.length > 0) {
      await this.sendBulkEmail(
        businessDevUsers.map(user => user.email),
        `[Copy] ${template.subject}`,
        template.text,
        template.html
      );
    }
  }

  async sendUserStatusChangeNotification(
    user: User,
    action: 'created' | 'activated' | 'deactivated' | 'locked' | 'unlocked',
    performedBy?: string
  ): Promise<void> {
    const template = this.getUserStatusChangeTemplate(user, action, performedBy);
    
    // Send to the user (except for locked accounts)
    if (action !== 'locked') {
      await this.sendEmail(
        user.email,
        template.subject,
        template.text,
        template.html
      );
    }

    // Send notification to admins
    const adminUsers = await this.usersRepository.find({
      where: { role: UserRole.ADMIN },
      select: ['email'],
    });

    if (adminUsers.length > 0) {
      await this.sendBulkEmail(
        adminUsers.map(admin => admin.email),
        `[Admin Alert] ${template.subject}`,
        template.text,
        template.html
      );
    }
  }

  async sendPasswordResetNotification(user: User, temporaryPassword?: string): Promise<void> {
    const template = this.getPasswordResetTemplate(user, temporaryPassword);
    
    await this.sendEmail(
      user.email,
      template.subject,
      template.text,
      template.html
    );
  }

  async sendWelcomeEmail(user: User, temporaryPassword?: string): Promise<void> {
    const template = this.getWelcomeTemplate(user, temporaryPassword);
    
    await this.sendEmail(
      user.email,
      template.subject,
      template.text,
      template.html
    );
  }

  private getSLABreachTemplate(ticket: Ticket): EmailTemplate {
    const subject = `SLA Breach Alert: ${ticket.title}`;
    const text = `
SLA Breach Alert

Ticket: ${ticket.title}
ID: ${ticket.id}
Priority: ${ticket.priority}
Created: ${ticket.createdAt}
SLA Minutes: ${ticket.slaMinutes}

This ticket has breached its SLA requirement. Please take immediate action.

Login to ApaceTicket to view details and take action.
`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
          <h1>⚠️ SLA Breach Alert</h1>
        </div>
        <div style="padding: 20px; background: #f8f9fa;">
          <h2>Ticket Details</h2>
          <p><strong>Title:</strong> ${ticket.title}</p>
          <p><strong>ID:</strong> ${ticket.id}</p>
          <p><strong>Priority:</strong> <span style="text-transform: uppercase; background: #ef4444; color: white; padding: 2px 8px; border-radius: 4px;">${ticket.priority}</span></p>
          <p><strong>Created:</strong> ${ticket.createdAt}</p>
          <p><strong>SLA Requirement:</strong> ${ticket.slaMinutes} minutes</p>
          
          <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #dc2626;"><strong>This ticket has breached its SLA requirement. Please take immediate action.</strong></p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/tickets/${ticket.id}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">View Ticket</a>
          </div>
        </div>
      </div>
    `;
    
    return { subject, text, html };
  }

  private getOverdueInvoiceTemplate(invoice: any): EmailTemplate {
    const subject = `Overdue Invoice: ${invoice.invoiceNumber}`;
    const text = `
Overdue Invoice Notice

Invoice Number: ${invoice.invoiceNumber}
Amount: $${invoice.amount}
Due Date: ${invoice.dueDate}
Client: ${invoice.clientName}

This invoice is now overdue. Please process payment at your earliest convenience.

If you have any questions, please contact our billing department.
`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); color: white; padding: 20px; text-align: center;">
          <h1>💰 Overdue Invoice Notice</h1>
        </div>
        <div style="padding: 20px; background: #f8f9fa;">
          <h2>Invoice Details</h2>
          <p><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
          <p><strong>Amount:</strong> <span style="font-size: 1.2em; color: #059669;">$${invoice.amount}</span></p>
          <p><strong>Due Date:</strong> ${invoice.dueDate}</p>
          <p><strong>Client:</strong> ${invoice.clientName}</p>
          
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e;"><strong>This invoice is now overdue. Please process payment at your earliest convenience.</strong></p>
          </div>
          
          <p>If you have any questions about this invoice, please contact our billing department.</p>
        </div>
      </div>
    `;
    
    return { subject, text, html };
  }

  private getUserStatusChangeTemplate(user: User, action: string, performedBy?: string): EmailTemplate {
    const actionText = {
      'created': 'Account Created',
      'activated': 'Account Activated',
      'deactivated': 'Account Deactivated',
      'locked': 'Account Locked',
      'unlocked': 'Account Unlocked',
    }[action] || 'Account Updated';

    const subject = `${actionText}: ${user.firstName} ${user.lastName}`;
    const text = `
${actionText}

User: ${user.firstName} ${user.lastName}
Email: ${user.email}
Role: ${user.role}
Action: ${actionText}
Performed by: ${performedBy || 'System'}
Time: ${new Date().toISOString()}
`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
          <h1>👤 ${actionText}</h1>
        </div>
        <div style="padding: 20px; background: #f8f9fa;">
          <h2>User Details</h2>
          <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Role:</strong> <span style="text-transform: uppercase; background: #3b82f6; color: white; padding: 2px 8px; border-radius: 4px;">${user.role}</span></p>
          <p><strong>Action:</strong> ${actionText}</p>
          <p><strong>Performed by:</strong> ${performedBy || 'System'}</p>
          <p><strong>Time:</strong> ${new Date().toISOString()}</p>
        </div>
      </div>
    `;
    
    return { subject, text, html };
  }

  private getPasswordResetTemplate(user: User, temporaryPassword?: string): EmailTemplate {
    const subject = 'Password Reset - ApaceTicket';
    const text = `
Password Reset

Hello ${user.firstName},

Your password has been reset by an administrator.
${temporaryPassword ? `\nYour temporary password is: ${temporaryPassword}` : ''}

Please login and change your password immediately for security purposes.

Login at: ${process.env.FRONTEND_URL}/login
`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
          <h1>🔐 Password Reset</h1>
        </div>
        <div style="padding: 20px; background: #f8f9fa;">
          <p>Hello ${user.firstName},</p>
          <p>Your password has been reset by an administrator.</p>
          ${temporaryPassword ? `<div style="background: #e0e7ff; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0;"><p style="margin: 0;"><strong>Temporary Password:</strong> <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px;">${temporaryPassword}</code></p></div>` : ''}
          <p>Please login and change your password immediately for security purposes.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/login" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Login Now</a>
          </div>
        </div>
      </div>
    `;
    
    return { subject, text, html };
  }

  private getWelcomeTemplate(user: User, temporaryPassword?: string): EmailTemplate {
    const subject = 'Welcome to ApaceTicket!';
    const text = `
Welcome to ApaceTicket!

Hello ${user.firstName},

Your account has been created successfully.

Email: ${user.email}
Role: ${user.role}
${temporaryPassword ? `Temporary Password: ${temporaryPassword}` : ''}

Please login and complete your profile setup.

Login at: ${process.env.FRONTEND_URL}/login
`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
          <h1>🎉 Welcome to ApaceTicket!</h1>
        </div>
        <div style="padding: 20px; background: #f8f9fa;">
          <p>Hello ${user.firstName},</p>
          <p>Your account has been created successfully. Welcome to the team!</p>
          
          <h3>Account Details</h3>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Role:</strong> <span style="text-transform: uppercase; background: #10b981; color: white; padding: 2px 8px; border-radius: 4px;">${user.role}</span></p>
          ${temporaryPassword ? `<p><strong>Temporary Password:</strong> <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px;">${temporaryPassword}</code></p>` : ''}
          
          <p>Please login and complete your profile setup.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/login" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Get Started</a>
          </div>
        </div>
      </div>
    `;
    
    return { subject, text, html };
  }
}
