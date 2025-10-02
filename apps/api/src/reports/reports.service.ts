import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Ticket } from '../tickets/entities/ticket.entity';
import { KPI } from '../kpis/entities/kpi.entity';
import { Invoice } from '../invoices/entities/invoice.entity';
import { Opportunity } from '../opportunities/entities/opportunity.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
    @InjectRepository(KPI)
    private kpiRepository: Repository<KPI>,
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(Opportunity)
    private opportunityRepository: Repository<Opportunity>,
  ) {}

  async generateUserReport(format: 'csv' | 'json' = 'csv'): Promise<string> {
    const users = await this.usersRepository.find({
      relations: ['team'],
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive', 'country', 'teamId', 'isLocked', 'lastLoginAt', 'createdAt'],
    });

    if (format === 'csv') {
      return this.generateCSV(users, [
        { key: 'id', label: 'ID' },
        { key: 'email', label: 'Email' },
        { key: 'firstName', label: 'First Name' },
        { key: 'lastName', label: 'Last Name' },
        { key: 'role', label: 'Role' },
        { key: 'isActive', label: 'Active' },
        { key: 'isLocked', label: 'Locked' },
        { key: 'country', label: 'Country' },
        { key: 'team.name', label: 'Team' },
        { key: 'lastLoginAt', label: 'Last Login' },
        { key: 'createdAt', label: 'Created At' },
      ]);
    }

    return JSON.stringify(users, null, 2);
  }

  async generateTicketReport(
    filters?: any,
    format: 'csv' | 'json' = 'csv'
  ): Promise<string> {
    let queryBuilder = this.ticketsRepository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.createdBy', 'createdBy')
      .leftJoinAndSelect('ticket.assignedTo', 'assignedTo')
      .leftJoinAndSelect('assignedTo.team', 'assignedToTeam')
      .leftJoinAndSelect('createdBy.team', 'createdByTeam');

    if (filters?.startDate) {
      queryBuilder.andWhere('ticket.createdAt >= :startDate', { startDate: new Date(filters.startDate) });
    }
    if (filters?.endDate) {
      queryBuilder.andWhere('ticket.createdAt <= :endDate', { endDate: new Date(filters.endDate) });
    }
    if (filters?.status) {
      queryBuilder.andWhere('ticket.status = :status', { status: filters.status });
    }
    if (filters?.teamId) {
      queryBuilder.andWhere(
        '(assignedToTeam.id = :teamId OR createdByTeam.id = :teamId)',
        { teamId: filters.teamId }
      );
    }

    const tickets = await queryBuilder.getMany();

    if (format === 'csv') {
      return this.generateCSV(tickets, [
        { key: 'id', label: 'ID' },
        { key: 'title', label: 'Title' },
        { key: 'description', label: 'Description' },
        { key: 'status', label: 'Status' },
        { key: 'priority', label: 'Priority' },
        { key: 'category', label: 'Category' },
        { key: 'createdBy.email', label: 'Created By' },
        { key: 'assignedTo.email', label: 'Assigned To' },
        { key: 'createdAt', label: 'Created At' },
        { key: 'resolvedAt', label: 'Resolved At' },
        { key: 'slaMinutes', label: 'SLA Minutes' },
      ]);
    }

    return JSON.stringify(tickets, null, 2);
  }

  async generateKPIReport(
    month?: string,
    format: 'csv' | 'json' = 'csv'
  ): Promise<string> {
    let queryBuilder = this.kpiRepository
      .createQueryBuilder('kpi')
      .leftJoinAndSelect('kpi.user', 'user')
      .leftJoinAndSelect('user.team', 'team');

    if (month) {
      queryBuilder.andWhere('kpi.month = :month', { month });
    }

    const kpis = await queryBuilder.getMany();

    if (format === 'csv') {
      return this.generateCSV(kpis, [
        { key: 'id', label: 'ID' },
        { key: 'user.email', label: 'User Email' },
        { key: 'user.firstName', label: 'First Name' },
        { key: 'user.lastName', label: 'Last Name' },
        { key: 'user.team.name', label: 'Team' },
        { key: 'month', label: 'Month' },
        { key: 'ticketsResolved', label: 'Tickets Resolved' },
        { key: 'ticketsCreated', label: 'Tickets Created' },
        { key: 'avgResolutionTimeHours', label: 'Avg Resolution Time (Hours)' },
        { key: 'opportunitiesCreated', label: 'Opportunities Created' },
        { key: 'opportunityValue', label: 'Opportunity Value' },
      ]);
    }

    return JSON.stringify(kpis, null, 2);
  }

  async generateMonthlyReport(
    month: string,
    year: string,
    teamId?: string
  ): Promise<any> {
    const monthKey = `${year}-${month.padStart(2, '0')}`;
    
    // Get KPIs for the month
    let kpiQuery = this.kpiRepository
      .createQueryBuilder('kpi')
      .leftJoinAndSelect('kpi.user', 'user')
      .leftJoinAndSelect('user.team', 'team')
      .where('kpi.month = :month', { month: monthKey });

    if (teamId) {
      kpiQuery.andWhere('user.teamId = :teamId', { teamId });
    }

    const kpis = await kpiQuery.getMany();

    // Get tickets for the month
    const startDate = new Date(`${year}-${month.padStart(2, '0')}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

    let ticketQuery = this.ticketsRepository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.assignedTo', 'assignedTo')
      .leftJoinAndSelect('assignedTo.team', 'team')
      .where('ticket.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate });

    if (teamId) {
      ticketQuery.andWhere('team.id = :teamId', { teamId });
    }

    const tickets = await ticketQuery.getMany();

    // Calculate summary statistics
    const totalTickets = tickets.length;
    const resolvedTickets = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;
    const avgResolutionTime = this.calculateAverageResolutionTime(tickets);
    const slaBreaches = tickets.filter(t => this.isSLABreached(t)).length;

    return {
      month: monthKey,
      teamId,
      summary: {
        totalTickets,
        resolvedTickets,
        resolutionRate: totalTickets > 0 ? (resolvedTickets / totalTickets) * 100 : 0,
        avgResolutionTime,
        slaBreaches,
        slaCompliance: totalTickets > 0 ? ((totalTickets - slaBreaches) / totalTickets) * 100 : 100,
      },
      kpis,
      tickets: tickets.slice(0, 100), // Limit for performance
    };
  }

  private generateCSV(data: any[], columns: { key: string; label: string }[]): string {
    const headers = columns.map(col => col.label).join(',');
    const rows = data.map(item => {
      return columns.map(col => {
        const value = this.getNestedValue(item, col.key);
        // Escape CSV values
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',');
    });

    return [headers, ...rows].join('\n');
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  }

  private calculateAverageResolutionTime(tickets: any[]): number {
    const resolvedTickets = tickets.filter(t => t.resolvedAt && t.createdAt);
    if (resolvedTickets.length === 0) return 0;

    const totalTime = resolvedTickets.reduce((sum, ticket) => {
      const resolutionTime = new Date(ticket.resolvedAt).getTime() - new Date(ticket.createdAt).getTime();
      return sum + resolutionTime;
    }, 0);

    return totalTime / resolvedTickets.length / (1000 * 60 * 60); // Convert to hours
  }

  private isSLABreached(ticket: any): boolean {
    if (ticket.status === 'resolved' || ticket.status === 'closed') {
      if (!ticket.resolvedAt) return false;
      const resolutionTime = new Date(ticket.resolvedAt).getTime() - new Date(ticket.createdAt).getTime();
      return resolutionTime > (ticket.slaMinutes * 60 * 1000);
    }
    
    const now = new Date();
    const elapsedTime = now.getTime() - new Date(ticket.createdAt).getTime();
    return elapsedTime > (ticket.slaMinutes * 60 * 1000);
  }

  async generateInvoiceReport(
    filters?: any,
    format: 'csv' | 'json' = 'csv'
  ): Promise<string> {
    let queryBuilder = this.invoiceRepository
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.createdBy', 'createdBy')
      .leftJoinAndSelect('invoice.ticket', 'ticket');

    if (filters?.status) {
      queryBuilder.andWhere('invoice.status = :status', { status: filters.status });
    }
    if (filters?.startDate) {
      queryBuilder.andWhere('invoice.createdAt >= :startDate', { startDate: new Date(filters.startDate) });
    }
    if (filters?.endDate) {
      queryBuilder.andWhere('invoice.createdAt <= :endDate', { endDate: new Date(filters.endDate) });
    }

    const invoices = await queryBuilder.getMany();

    if (format === 'csv') {
      return this.generateCSV(invoices, [
        { key: 'id', label: 'ID' },
        { key: 'invoiceNumber', label: 'Invoice Number' },
        { key: 'clientName', label: 'Client Name' },
        { key: 'clientEmail', label: 'Client Email' },
        { key: 'amount', label: 'Amount' },
        { key: 'status', label: 'Status' },
        { key: 'createdBy.email', label: 'Created By' },
        { key: 'dueDate', label: 'Due Date' },
        { key: 'paidDate', label: 'Paid Date' },
        { key: 'createdAt', label: 'Created At' },
      ]);
    }

    return JSON.stringify(invoices, null, 2);
  }
}
