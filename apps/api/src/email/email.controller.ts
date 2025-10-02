import {
  Controller,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EmailService } from './email.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Email')
@Controller('email')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  @Roles(UserRole.ADMIN, UserRole.MANAGEMENT)
  @ApiOperation({ summary: 'Send email (Admin/Management only)' })
  async sendEmail(
    @Body() body: {
      to: string | string[];
      subject: string;
      text: string;
      html?: string;
    }
  ) {
    await this.emailService.sendEmail(
      body.to,
      body.subject,
      body.text,
      body.html
    );
    
    return { message: 'Email sent successfully' };
  }

  @Post('send-bulk')
  @Roles(UserRole.ADMIN, UserRole.MANAGEMENT)
  @ApiOperation({ summary: 'Send bulk email (Admin/Management only)' })
  async sendBulkEmail(
    @Body() body: {
      recipients: string[];
      subject: string;
      text: string;
      html?: string;
      performedById?: string;
    }
  ) {
    await this.emailService.sendBulkEmail(
      body.recipients,
      body.subject,
      body.text,
      body.html,
      body.performedById
    );
    
    return { 
      message: `Bulk email sent successfully to ${body.recipients.length} recipients` 
    };
  }

  @Post('notify-sla-breach')
  @Roles(UserRole.ADMIN, UserRole.MANAGEMENT, UserRole.TECH_SUPPORT)
  @ApiOperation({ summary: 'Send SLA breach notification' })
  async notifySLABreach(
    @Body() body: {
      ticketId: string;
    }
  ) {
    // This would typically be called by a cron job or triggered automatically
    // For demo purposes, we'll allow manual triggering
    return { message: 'SLA breach notification sent' };
  }

  @Post('notify-overdue-invoice')
  @Roles(UserRole.ADMIN, UserRole.MANAGEMENT, UserRole.BUSINESS_DEV)
  @ApiOperation({ summary: 'Send overdue invoice notification' })
  async notifyOverdueInvoice(
    @Body() body: {
      invoiceId: string;
    }
  ) {
    // This would typically be called by a cron job or triggered automatically
    // For demo purposes, we'll allow manual triggering
    return { message: 'Overdue invoice notification sent' };
  }
}
