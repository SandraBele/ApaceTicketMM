import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Inject, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Invoice, Payment, FinancialStats } from './financial.service.mock';

interface IFinancialService {
  findAllInvoices(filters?: any): Promise<Invoice[]>;
  findOneInvoice(id: string): Promise<Invoice | undefined>;
  createInvoice(invoiceData: Partial<Invoice>): Promise<Invoice>;
  updateInvoice(id: string, updateData: Partial<Invoice>): Promise<Invoice | undefined>;
  updateInvoiceStatus(id: string, status: Invoice['status'], paymentData?: any): Promise<Invoice | undefined>;
  deleteInvoice(id: string): Promise<boolean>;
  getFinancialStats(): Promise<FinancialStats>;
  getPayments(invoiceId?: string): Promise<Payment[]>;
}

@Controller('financial')
@UseGuards(JwtAuthGuard)
export class FinancialController {
  constructor(
    @Inject('FinancialService') private readonly financialService: IFinancialService,
  ) {}

  @Get('invoices')
  async findAllInvoices(@Query() query: any) {
    return await this.financialService.findAllInvoices(query);
  }

  @Get('stats')
  async getStats() {
    return await this.financialService.getFinancialStats();
  }

  @Get('payments')
  async getPayments(@Query('invoiceId') invoiceId?: string) {
    return await this.financialService.getPayments(invoiceId);
  }

  @Get('invoices/:id')
  async findOneInvoice(@Param('id') id: string) {
    const invoice = await this.financialService.findOneInvoice(id);
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    return invoice;
  }

  @Post('invoices')
  async createInvoice(@Body() createInvoiceDto: any) {
    return await this.financialService.createInvoice(createInvoiceDto);
  }

  @Patch('invoices/:id')
  async updateInvoice(@Param('id') id: string, @Body() updateInvoiceDto: any) {
    const invoice = await this.financialService.updateInvoice(id, updateInvoiceDto);
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    return invoice;
  }

  @Patch('invoices/:id/status')
  async updateInvoiceStatus(@Param('id') id: string, @Body() statusData: any) {
    const invoice = await this.financialService.updateInvoiceStatus(
      id, 
      statusData.status, 
      statusData.paymentData
    );
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    return invoice;
  }

  @Delete('invoices/:id')
  async deleteInvoice(@Param('id') id: string) {
    const success = await this.financialService.deleteInvoice(id);
    if (!success) {
      throw new Error('Invoice not found');
    }
    return { message: 'Invoice deleted successfully' };
  }
}