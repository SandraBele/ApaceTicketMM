import { Controller, Get, Post, Delete, Body, Param, Query, Inject, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Report, ReportTemplate } from './reports.service.mock';

interface IReportsService {
  findAll(): Promise<Report[]>;
  findOne(id: string): Promise<Report | undefined>;
  getTemplates(): Promise<ReportTemplate[]>;
  generateReport(type: string, parameters: any, generatedBy: string): Promise<Report>;
  exportReport(reportId: string, format: 'csv' | 'pdf' | 'json'): Promise<{ downloadUrl: string }>;
  deleteReport(id: string): Promise<boolean>;
}

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(
    @Inject('ReportsService') private readonly reportsService: IReportsService,
  ) {}

  @Get()
  async findAll() {
    return await this.reportsService.findAll();
  }

  @Get('templates')
  async getTemplates() {
    return await this.reportsService.getTemplates();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const report = await this.reportsService.findOne(id);
    if (!report) {
      throw new Error('Report not found');
    }
    return report;
  }

  @Post('generate')
  async generateReport(@Body() generateReportDto: any) {
    return await this.reportsService.generateReport(
      generateReportDto.type,
      generateReportDto.parameters,
      generateReportDto.generatedBy || 'System'
    );
  }

  @Post(':id/export')
  async exportReport(@Param('id') reportId: string, @Body('format') format: 'csv' | 'pdf' | 'json') {
    return await this.reportsService.exportReport(reportId, format);
  }

  @Delete(':id')
  async deleteReport(@Param('id') id: string) {
    const success = await this.reportsService.deleteReport(id);
    if (!success) {
      throw new Error('Report not found');
    }
    return { message: 'Report deleted successfully' };
  }
}