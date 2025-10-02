import { Injectable } from '@nestjs/common';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  companyName: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  paymentMethod?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  currency: string;
  method: 'credit_card' | 'bank_transfer' | 'paypal' | 'check' | 'cash';
  transactionId?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  processedAt: string;
  notes?: string;
}

export interface FinancialStats {
  totalRevenue: number;
  monthlyRevenue: number;
  pendingPayments: number;
  overdueInvoices: number;
  paidInvoices: number;
  averagePaymentTime: number; // days
  paymentSuccessRate: number; // percentage
  revenueByCountry: { country: string; amount: number }[];
  revenueByMonth: { month: string; amount: number }[];
}

@Injectable()
export class MockFinancialService {
  private invoices: Invoice[] = [
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      customerId: 'cust-001',
      customerName: 'Alex Smith',
      customerEmail: 'alex.smith@techcorp.com',
      companyName: 'TechCorp Solutions',
      billingAddress: {
        street: '123 Business Ave',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'US'
      },
      items: [
        {
          description: 'ApaceTicket Pro License - Annual',
          quantity: 5,
          unitPrice: 299.99,
          total: 1499.95
        },
        {
          description: 'Premium Support Package',
          quantity: 1,
          unitPrice: 500.00,
          total: 500.00
        }
      ],
      subtotal: 1999.95,
      taxRate: 8.25,
      taxAmount: 164.996,
      total: 2164.95,
      currency: 'USD',
      status: 'paid',
      issueDate: '2024-09-01T00:00:00Z',
      dueDate: '2024-09-30T00:00:00Z',
      paidDate: '2024-09-28T14:30:00Z',
      paymentMethod: 'credit_card',
      notes: 'Annual renewal - Thank you for your business!',
      createdAt: '2024-09-01T09:00:00Z',
      updatedAt: '2024-09-28T14:30:00Z'
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-002',
      customerId: 'cust-002',
      customerName: 'Sarah Johnson',
      customerEmail: 'billing@globaltech.com',
      companyName: 'Global Tech Ltd',
      billingAddress: {
        street: '456 Enterprise Blvd',
        city: 'Toronto',
        state: 'ON',
        postalCode: 'M5V 3A8',
        country: 'CA'
      },
      items: [
        {
          description: 'ApaceTicket Starter License - Monthly',
          quantity: 10,
          unitPrice: 29.99,
          total: 299.90
        }
      ],
      subtotal: 299.90,
      taxRate: 13.00,
      taxAmount: 38.99,
      total: 338.89,
      currency: 'CAD',
      status: 'overdue',
      issueDate: '2024-09-15T00:00:00Z',
      dueDate: '2024-09-30T00:00:00Z',
      notes: 'Monthly subscription - Payment overdue',
      createdAt: '2024-09-15T10:00:00Z',
      updatedAt: '2024-10-01T08:00:00Z'
    },
    {
      id: '3',
      invoiceNumber: 'INV-2024-003',
      customerId: 'cust-003',
      customerName: 'Emma Davis',
      customerEmail: 'finance@creativestudio.com',
      companyName: 'Creative Studio UK',
      billingAddress: {
        street: '789 Design Street',
        city: 'London',
        state: '',
        postalCode: 'SW1A 1AA',
        country: 'UK'
      },
      items: [
        {
          description: 'ApaceTicket Enterprise License - Annual',
          quantity: 3,
          unitPrice: 599.99,
          total: 1799.97
        },
        {
          description: 'Custom Integration Services',
          quantity: 20,
          unitPrice: 125.00,
          total: 2500.00
        }
      ],
      subtotal: 4299.97,
      taxRate: 20.00,
      taxAmount: 859.99,
      total: 5159.96,
      currency: 'GBP',
      status: 'sent',
      issueDate: '2024-10-01T00:00:00Z',
      dueDate: '2024-10-31T00:00:00Z',
      notes: 'Enterprise package with custom integrations',
      createdAt: '2024-10-01T11:00:00Z',
      updatedAt: '2024-10-01T11:00:00Z'
    },
    {
      id: '4',
      invoiceNumber: 'INV-2024-004',
      customerId: 'cust-004',
      customerName: 'Michael Chen',
      customerEmail: 'accounts@australiatech.com.au',
      companyName: 'Australia Tech Pty Ltd',
      billingAddress: {
        street: '321 Innovation Drive',
        city: 'Sydney',
        state: 'NSW',
        postalCode: '2000',
        country: 'AU'
      },
      items: [
        {
          description: 'ApaceTicket Pro License - Quarterly',
          quantity: 8,
          unitPrice: 89.99,
          total: 719.92
        }
      ],
      subtotal: 719.92,
      taxRate: 10.00,
      taxAmount: 71.99,
      total: 791.91,
      currency: 'AUD',
      status: 'paid',
      issueDate: '2024-09-20T00:00:00Z',
      dueDate: '2024-10-20T00:00:00Z',
      paidDate: '2024-09-25T09:15:00Z',
      paymentMethod: 'bank_transfer',
      notes: 'Quarterly payment - Early payment discount applied',
      createdAt: '2024-09-20T14:00:00Z',
      updatedAt: '2024-09-25T09:15:00Z'
    }
  ];

  private payments: Payment[] = [
    {
      id: '1',
      invoiceId: '1',
      amount: 2164.95,
      currency: 'USD',
      method: 'credit_card',
      transactionId: 'txn_1234567890',
      status: 'completed',
      processedAt: '2024-09-28T14:30:00Z',
      notes: 'Automatic payment via saved card'
    },
    {
      id: '2',
      invoiceId: '4',
      amount: 791.91,
      currency: 'AUD',
      method: 'bank_transfer',
      transactionId: 'wire_9876543210',
      status: 'completed',
      processedAt: '2024-09-25T09:15:00Z',
      notes: 'International wire transfer'
    }
  ];

  async findAllInvoices(filters?: any): Promise<Invoice[]> {
    let filteredInvoices = [...this.invoices];

    if (filters) {
      if (filters.status) {
        filteredInvoices = filteredInvoices.filter(invoice => invoice.status === filters.status);
      }
      if (filters.country) {
        filteredInvoices = filteredInvoices.filter(invoice => invoice.billingAddress.country === filters.country);
      }
      if (filters.currency) {
        filteredInvoices = filteredInvoices.filter(invoice => invoice.currency === filters.currency);
      }
      if (filters.dateFrom) {
        filteredInvoices = filteredInvoices.filter(invoice => invoice.issueDate >= filters.dateFrom);
      }
      if (filters.dateTo) {
        filteredInvoices = filteredInvoices.filter(invoice => invoice.issueDate <= filters.dateTo);
      }
    }

    return filteredInvoices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async findOneInvoice(id: string): Promise<Invoice | undefined> {
    return this.invoices.find(invoice => invoice.id === id);
  }

  async createInvoice(invoiceData: Partial<Invoice>): Promise<Invoice> {
    const newInvoice: Invoice = {
      id: (this.invoices.length + 1).toString(),
      invoiceNumber: invoiceData.invoiceNumber || `INV-2024-${String(this.invoices.length + 1).padStart(3, '0')}`,
      customerId: invoiceData.customerId || '',
      customerName: invoiceData.customerName || '',
      customerEmail: invoiceData.customerEmail || '',
      companyName: invoiceData.companyName || '',
      billingAddress: invoiceData.billingAddress || {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
      },
      items: invoiceData.items || [],
      subtotal: invoiceData.subtotal || 0,
      taxRate: invoiceData.taxRate || 0,
      taxAmount: invoiceData.taxAmount || 0,
      total: invoiceData.total || 0,
      currency: invoiceData.currency || 'USD',
      status: invoiceData.status || 'draft',
      issueDate: invoiceData.issueDate || new Date().toISOString(),
      dueDate: invoiceData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      notes: invoiceData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.invoices.push(newInvoice);
    return newInvoice;
  }

  async updateInvoice(id: string, updateData: Partial<Invoice>): Promise<Invoice | undefined> {
    const invoiceIndex = this.invoices.findIndex(invoice => invoice.id === id);
    if (invoiceIndex === -1) {
      return undefined;
    }

    const updatedInvoice = {
      ...this.invoices[invoiceIndex],
      ...updateData,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };

    this.invoices[invoiceIndex] = updatedInvoice;
    return updatedInvoice;
  }

  async updateInvoiceStatus(id: string, status: Invoice['status'], paymentData?: any): Promise<Invoice | undefined> {
    const invoice = await this.updateInvoice(id, { status });
    
    if (invoice && status === 'paid' && paymentData) {
      invoice.paidDate = new Date().toISOString();
      invoice.paymentMethod = paymentData.method;
      
      // Create payment record
      const payment: Payment = {
        id: (this.payments.length + 1).toString(),
        invoiceId: id,
        amount: invoice.total,
        currency: invoice.currency,
        method: paymentData.method,
        transactionId: paymentData.transactionId,
        status: 'completed',
        processedAt: new Date().toISOString(),
        notes: paymentData.notes
      };
      
      this.payments.push(payment);
    }
    
    return invoice;
  }

  async deleteInvoice(id: string): Promise<boolean> {
    const invoiceIndex = this.invoices.findIndex(invoice => invoice.id === id);
    if (invoiceIndex === -1) {
      return false;
    }

    this.invoices.splice(invoiceIndex, 1);
    return true;
  }

  async getFinancialStats(): Promise<FinancialStats> {
    const totalRevenue = this.invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => {
        // Convert all to USD for simplification
        const rate = inv.currency === 'USD' ? 1 : inv.currency === 'CAD' ? 0.74 : inv.currency === 'GBP' ? 1.26 : inv.currency === 'AUD' ? 0.67 : 1;
        return sum + (inv.total * rate);
      }, 0);

    const currentMonth = new Date().getMonth();
    const monthlyRevenue = this.invoices
      .filter(inv => inv.status === 'paid' && new Date(inv.paidDate!).getMonth() === currentMonth)
      .reduce((sum, inv) => {
        const rate = inv.currency === 'USD' ? 1 : inv.currency === 'CAD' ? 0.74 : inv.currency === 'GBP' ? 1.26 : inv.currency === 'AUD' ? 0.67 : 1;
        return sum + (inv.total * rate);
      }, 0);

    const pendingPayments = this.invoices
      .filter(inv => ['sent', 'overdue'].includes(inv.status))
      .reduce((sum, inv) => {
        const rate = inv.currency === 'USD' ? 1 : inv.currency === 'CAD' ? 0.74 : inv.currency === 'GBP' ? 1.26 : inv.currency === 'AUD' ? 0.67 : 1;
        return sum + (inv.total * rate);
      }, 0);

    const overdueInvoices = this.invoices.filter(inv => inv.status === 'overdue').length;
    const paidInvoices = this.invoices.filter(inv => inv.status === 'paid').length;

    const paidInvoicesWithDates = this.invoices.filter(inv => inv.status === 'paid' && inv.paidDate);
    const averagePaymentTime = paidInvoicesWithDates.length > 0 
      ? paidInvoicesWithDates.reduce((sum, inv) => {
          const issued = new Date(inv.issueDate).getTime();
          const paid = new Date(inv.paidDate!).getTime();
          return sum + ((paid - issued) / (1000 * 60 * 60 * 24));
        }, 0) / paidInvoicesWithDates.length
      : 0;

    const paymentSuccessRate = this.invoices.length > 0 
      ? (paidInvoices / this.invoices.length) * 100 
      : 0;

    const revenueByCountry = this.invoices
      .filter(inv => inv.status === 'paid')
      .reduce((acc, inv) => {
        const country = inv.billingAddress.country;
        const rate = inv.currency === 'USD' ? 1 : inv.currency === 'CAD' ? 0.74 : inv.currency === 'GBP' ? 1.26 : inv.currency === 'AUD' ? 0.67 : 1;
        const existing = acc.find(item => item.country === country);
        if (existing) {
          existing.amount += inv.total * rate;
        } else {
          acc.push({ country, amount: inv.total * rate });
        }
        return acc;
      }, [] as { country: string; amount: number }[]);

    const revenueByMonth = [
      { month: 'Jan', amount: 0 },
      { month: 'Feb', amount: 0 },
      { month: 'Mar', amount: 0 },
      { month: 'Apr', amount: 0 },
      { month: 'May', amount: 0 },
      { month: 'Jun', amount: 0 },
      { month: 'Jul', amount: 0 },
      { month: 'Aug', amount: 0 },
      { month: 'Sep', amount: 2164.95 },
      { month: 'Oct', amount: 791.91 },
      { month: 'Nov', amount: 0 },
      { month: 'Dec', amount: 0 }
    ];

    return {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
      pendingPayments: Math.round(pendingPayments * 100) / 100,
      overdueInvoices,
      paidInvoices,
      averagePaymentTime: Math.round(averagePaymentTime * 10) / 10,
      paymentSuccessRate: Math.round(paymentSuccessRate * 10) / 10,
      revenueByCountry,
      revenueByMonth
    };
  }

  async getPayments(invoiceId?: string): Promise<Payment[]> {
    if (invoiceId) {
      return this.payments.filter(payment => payment.invoiceId === invoiceId);
    }
    return this.payments;
  }
}