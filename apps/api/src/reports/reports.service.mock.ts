import { Injectable } from '@nestjs/common';

export interface Report {
  id: string;
  name: string;
  type: 'user_performance' | 'team_performance' | 'ticket_analysis' | 'sla_compliance' | 'financial_summary' | 'satisfaction_trends';
  description: string;
  period: string; // e.g., "September 2024", "Q3 2024"
  parameters: any;
  data: any;
  generatedAt: string;
  generatedBy: string;
  format: 'json' | 'csv' | 'pdf';
  downloadUrl?: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  type: string;
  parameters: string[];
  description: string;
}

@Injectable()
export class MockReportsService {
  private reports: Report[] = [
    {
      id: '1',
      name: 'Monthly User Performance - September 2024',
      type: 'user_performance',
      description: 'Comprehensive analysis of user ticket resolution performance',
      period: 'September 2024',
      parameters: {
        month: 9,
        year: 2024,
        includeInactive: false
      },
      data: {
        totalUsers: 5,
        activeUsers: 5,
        metrics: [
          {
            userId: '2',
            userName: 'John Doe',
            ticketsResolved: 23,
            avgResolutionTime: 18.5,
            satisfactionScore: 4.2,
            slaCompliance: 94.2
          },
          {
            userId: '3',
            userName: 'Mike Johnson',
            ticketsResolved: 19,
            avgResolutionTime: 10.2,
            satisfactionScore: 4.6,
            slaCompliance: 96.8
          },
          {
            userId: '4',
            userName: 'Sarah Wilson',
            ticketsResolved: 12,
            avgResolutionTime: 36.8,
            satisfactionScore: 4.1,
            slaCompliance: 88.6
          }
        ]
      },
      generatedAt: '2024-10-01T09:00:00Z',
      generatedBy: 'Admin User',
      format: 'json'
    },
    {
      id: '2',
      name: 'Team Performance Report - Q3 2024',
      type: 'team_performance',
      description: 'Quarterly team performance analysis and KPI tracking',
      period: 'Q3 2024',
      parameters: {
        quarter: 3,
        year: 2024
      },
      data: {
        totalTeams: 3,
        metrics: [
          {
            teamId: '1',
            teamName: 'Technical Support',
            ticketsResolved: 87,
            avgResolutionTime: 18.5,
            slaCompliance: 94.2,
            memberCount: 2,
            targetAchievement: 87
          },
          {
            teamId: '2',
            teamName: 'Product Development',
            ticketsResolved: 42,
            avgResolutionTime: 36.8,
            slaCompliance: 88.6,
            memberCount: 1,
            targetAchievement: 84
          },
          {
            teamId: '3',
            teamName: 'Business Development',
            ticketsResolved: 68,
            avgResolutionTime: 10.2,
            slaCompliance: 96.8,
            memberCount: 1,
            targetAchievement: 90.7
          }
        ]
      },
      generatedAt: '2024-10-01T10:30:00Z',
      generatedBy: 'System',
      format: 'json'
    },
    {
      id: '3',
      name: 'SLA Compliance Analysis - September 2024',
      type: 'sla_compliance',
      description: 'Detailed SLA performance and breach analysis',
      period: 'September 2024',
      parameters: {
        month: 9,
        year: 2024,
        includeClosed: true
      },
      data: {
        overallCompliance: 93.2,
        totalTickets: 197,
        breachedTickets: 13,
        byPriority: {
          critical: { compliance: 100, total: 3, breached: 0 },
          high: { compliance: 89.5, total: 19, breached: 2 },
          medium: { compliance: 92.8, total: 125, breached: 9 },
          low: { compliance: 96.0, total: 50, breached: 2 }
        },
        byTeam: [
          { teamName: 'Technical Support', compliance: 94.2 },
          { teamName: 'Product Development', compliance: 88.6 },
          { teamName: 'Business Development', compliance: 96.8 }
        ]
      },
      generatedAt: '2024-10-01T08:15:00Z',
      generatedBy: 'Admin User',
      format: 'json'
    }
  ];

  private templates: ReportTemplate[] = [
    {
      id: '1',
      name: 'User Performance Report',
      type: 'user_performance',
      parameters: ['period', 'includeInactive', 'teamFilter'],
      description: 'Individual user performance metrics and analytics'
    },
    {
      id: '2',
      name: 'Team Performance Report',
      type: 'team_performance',
      parameters: ['period', 'includeKPIs', 'comparisonPeriod'],
      description: 'Team-based performance analysis and KPI tracking'
    },
    {
      id: '3',
      name: 'SLA Compliance Report',
      type: 'sla_compliance',
      parameters: ['period', 'priorityFilter', 'teamFilter'],
      description: 'SLA performance and compliance analysis'
    },
    {
      id: '4',
      name: 'Customer Satisfaction Report',
      type: 'satisfaction_trends',
      parameters: ['period', 'countryFilter', 'categoryFilter'],
      description: 'Customer satisfaction trends and feedback analysis'
    },
    {
      id: '5',
      name: 'Financial Summary Report',
      type: 'financial_summary',
      parameters: ['period', 'countryFilter', 'currencyFilter'],
      description: 'Financial performance and revenue analysis'
    }
  ];

  async findAll(): Promise<Report[]> {
    return this.reports;
  }

  async findOne(id: string): Promise<Report | undefined> {
    return this.reports.find(report => report.id === id);
  }

  async getTemplates(): Promise<ReportTemplate[]> {
    return this.templates;
  }

  async generateReport(type: string, parameters: any, generatedBy: string): Promise<Report> {
    const template = this.templates.find(t => t.type === type);
    if (!template) {
      throw new Error('Report template not found');
    }

    // Simulate report generation based on type
    let reportData: any = {};
    let reportName = '';
    
    switch (type) {
      case 'user_performance':
        reportName = `User Performance Report - ${parameters.period || 'Current Period'}`;
        reportData = this.generateUserPerformanceData(parameters);
        break;
      case 'team_performance':
        reportName = `Team Performance Report - ${parameters.period || 'Current Period'}`;
        reportData = this.generateTeamPerformanceData(parameters);
        break;
      case 'sla_compliance':
        reportName = `SLA Compliance Report - ${parameters.period || 'Current Period'}`;
        reportData = this.generateSLAComplianceData(parameters);
        break;
      case 'satisfaction_trends':
        reportName = `Customer Satisfaction Report - ${parameters.period || 'Current Period'}`;
        reportData = this.generateSatisfactionData(parameters);
        break;
      case 'financial_summary':
        reportName = `Financial Summary - ${parameters.period || 'Current Period'}`;
        reportData = this.generateFinancialData(parameters);
        break;
      default:
        reportData = { message: 'Report generated successfully' };
    }

    const newReport: Report = {
      id: (this.reports.length + 1).toString(),
      name: reportName,
      type: type as any,
      description: template.description,
      period: parameters.period || 'Current Period',
      parameters,
      data: reportData,
      generatedAt: new Date().toISOString(),
      generatedBy,
      format: parameters.format || 'json',
      downloadUrl: parameters.format === 'csv' ? `/reports/${this.reports.length + 1}.csv` : undefined
    };

    this.reports.push(newReport);
    return newReport;
  }

  async exportReport(reportId: string, format: 'csv' | 'pdf' | 'json'): Promise<{ downloadUrl: string }> {
    const report = await this.findOne(reportId);
    if (!report) {
      throw new Error('Report not found');
    }

    // Simulate file generation
    const downloadUrl = `/reports/${reportId}.${format}`;
    return { downloadUrl };
  }

  async deleteReport(id: string): Promise<boolean> {
    const reportIndex = this.reports.findIndex(report => report.id === id);
    if (reportIndex === -1) {
      return false;
    }

    this.reports.splice(reportIndex, 1);
    return true;
  }

  private generateUserPerformanceData(parameters: any): any {
    return {
      totalUsers: 5,
      activeUsers: 5,
      period: parameters.period,
      metrics: [
        {
          userId: '2',
          userName: 'John Doe',
          ticketsResolved: Math.floor(Math.random() * 30) + 10,
          avgResolutionTime: Math.round((Math.random() * 20 + 10) * 10) / 10,
          satisfactionScore: Math.round((Math.random() * 1 + 4) * 10) / 10,
          slaCompliance: Math.round((Math.random() * 10 + 85) * 10) / 10
        },
        {
          userId: '3',
          userName: 'Mike Johnson',
          ticketsResolved: Math.floor(Math.random() * 25) + 15,
          avgResolutionTime: Math.round((Math.random() * 15 + 8) * 10) / 10,
          satisfactionScore: Math.round((Math.random() * 0.8 + 4.2) * 10) / 10,
          slaCompliance: Math.round((Math.random() * 8 + 90) * 10) / 10
        }
      ]
    };
  }

  private generateTeamPerformanceData(parameters: any): any {
    return {
      totalTeams: 3,
      period: parameters.period,
      metrics: [
        {
          teamId: '1',
          teamName: 'Technical Support',
          ticketsResolved: Math.floor(Math.random() * 50) + 60,
          avgResolutionTime: Math.round((Math.random() * 15 + 15) * 10) / 10,
          slaCompliance: Math.round((Math.random() * 10 + 85) * 10) / 10,
          memberCount: 2
        }
      ]
    };
  }

  private generateSLAComplianceData(parameters: any): any {
    return {
      overallCompliance: Math.round((Math.random() * 10 + 85) * 10) / 10,
      totalTickets: Math.floor(Math.random() * 100) + 150,
      breachedTickets: Math.floor(Math.random() * 20) + 5,
      period: parameters.period
    };
  }

  private generateSatisfactionData(parameters: any): any {
    return {
      avgSatisfaction: Math.round((Math.random() * 1 + 4) * 10) / 10,
      totalResponses: Math.floor(Math.random() * 100) + 50,
      period: parameters.period,
      trends: [
        { week: 1, score: 4.2 },
        { week: 2, score: 4.3 },
        { week: 3, score: 4.1 },
        { week: 4, score: 4.4 }
      ]
    };
  }

  private generateFinancialData(parameters: any): any {
    return {
      totalRevenue: Math.floor(Math.random() * 50000) + 30000,
      pendingPayments: Math.floor(Math.random() * 10000) + 5000,
      overdueInvoices: Math.floor(Math.random() * 10) + 2,
      period: parameters.period
    };
  }
}