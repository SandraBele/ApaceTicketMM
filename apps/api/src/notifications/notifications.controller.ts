import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Inject, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Notification, EmailTemplate, BulkEmailJob } from './notifications.service.mock';

interface INotificationsService {
  findAll(filters?: any): Promise<Notification[]>;
  findOne(id: string): Promise<Notification | undefined>;
  create(notificationData: Partial<Notification>): Promise<Notification>;
  markAsRead(id: string, userId: string): Promise<Notification | undefined>;
  markAllAsRead(userId: string): Promise<number>;
  delete(id: string): Promise<boolean>;
  getEmailTemplates(): Promise<EmailTemplate[]>;
  createEmailTemplate(templateData: Partial<EmailTemplate>): Promise<EmailTemplate>;
  sendBulkEmail(emailData: { subject: string; body: string; recipients: string[] }): Promise<BulkEmailJob>;
  getBulkEmailJobs(): Promise<BulkEmailJob[]>;
  getNotificationStats(userId?: string): Promise<any>;
}

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(
    @Inject('NotificationsService') private readonly notificationsService: INotificationsService,
  ) {}

  @Get()
  async findAll(@Query() query: any) {
    return await this.notificationsService.findAll(query);
  }

  @Get('stats')
  async getStats(@Query('userId') userId?: string) {
    return await this.notificationsService.getNotificationStats(userId);
  }

  @Get('email-templates')
  async getEmailTemplates() {
    return await this.notificationsService.getEmailTemplates();
  }

  @Get('bulk-email-jobs')
  async getBulkEmailJobs() {
    return await this.notificationsService.getBulkEmailJobs();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const notification = await this.notificationsService.findOne(id);
    if (!notification) {
      throw new Error('Notification not found');
    }
    return notification;
  }

  @Post()
  async create(@Body() createNotificationDto: any) {
    return await this.notificationsService.create(createNotificationDto);
  }

  @Post('email-templates')
  async createEmailTemplate(@Body() createTemplateDto: any) {
    return await this.notificationsService.createEmailTemplate(createTemplateDto);
  }

  @Post('send-bulk-email')
  async sendBulkEmail(@Body() emailData: any) {
    return await this.notificationsService.sendBulkEmail(emailData);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Body('userId') userId: string) {
    const notification = await this.notificationsService.markAsRead(id, userId);
    if (!notification) {
      throw new Error('Notification not found');
    }
    return notification;
  }

  @Patch('mark-all-read')
  async markAllAsRead(@Body('userId') userId: string) {
    const count = await this.notificationsService.markAllAsRead(userId);
    return { message: `${count} notifications marked as read` };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const success = await this.notificationsService.delete(id);
    if (!success) {
      throw new Error('Notification not found');
    }
    return { message: 'Notification deleted successfully' };
  }
}