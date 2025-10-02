'use client';

import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, CreditCard, FileText, AlertCircle, Download, Filter, Calendar } from 'lucide-react';
import InvoiceList from './InvoiceList';
import FinancialChart from './FinancialChart';
import InvoiceForm from './InvoiceForm';

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  dueDate: string;
  issueDate: string;
  country: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  paymentMethod?: string;
  paidAt?: string;
  createdBy: string;
}

interface FinancialMetrics {
  totalRevenue: number;
  totalOutstanding: number;
  totalOverdue: number;
  averageInvoiceValue: number;
  paymentRate: number;
  monthlyGrowth: number;
}

export default function InvoiceFinancePanel() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [metrics, setMetrics] = useState<FinancialMetrics>({
    totalRevenue: 0,
    totalOutstanding: 0,
    totalOverdue: 0,
    averageInvoiceValue: 0,
    paymentRate: 0,
    monthlyGrowth: 0
  });
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'analytics'>('overview');
  const [loading, setLoading] = useState(true);

  // Mock data
  useEffect(() => {
    const mockInvoices: Invoice[] = [
      {
        id: '1',
        invoiceNumber: 'INV-2024-001',
        clientName: 'TechCorp Solutions',
        clientEmail: 'billing@techcorp.com',
        amount: 15000,
        currency: 'USD',
        status: 'paid',
        dueDate: '2024-11-30',
        issueDate: '2024-11-01',
        country: 'United States',
        items: [
          { description: 'Premium Support Package', quantity: 1, unitPrice: 15000, total: 15000 }
        ],
        paymentMethod: 'Bank Transfer',
        paidAt: '2024-11-28T10:30:00Z',
        createdBy: 'jane.smith@apace.local'
      },
      {
        id: '2',
        invoiceNumber: 'INV-2024-002',
        clientName: 'Global Enterprises Ltd',
        clientEmail: 'accounts@globalent.co.uk',
        amount: 8500,
        currency: 'USD',
        status: 'pending',
        dueDate: '2024-12-15',
        issueDate: '2024-11-15',
        country: 'United Kingdom',
        items: [
          { description: 'Technical Consulting', quantity: 40, unitPrice: 150, total: 6000 },
          { description: 'Setup Fee', quantity: 1, unitPrice: 2500, total: 2500 }
        ],
        createdBy: 'bob.wilson@apace.local'
      },
      {
        id: '3',
        invoiceNumber: 'INV-2024-003',
        clientName: 'Deutsche Tech GmbH',
        clientEmail: 'finance@deutschetech.de',
        amount: 12000,
        currency: 'EUR',
        status: 'overdue',
        dueDate: '2024-11-20',
        issueDate: '2024-10-20',
        country: 'Germany',
        items: [
          { description: 'Annual License', quantity: 1, unitPrice: 10000, total: 10000 },
          { description: 'Training Package', quantity: 1, unitPrice: 2000, total: 2000 }
        ],
        createdBy: 'jane.smith@apace.local'
      },
      {
        id: '4',
        invoiceNumber: 'INV-2024-004',
        clientName: 'Innovation Labs Inc',
        clientEmail: 'billing@innovationlabs.ca',
        amount: 5500,
        currency: 'CAD',
        status: 'pending',
        dueDate: '2024-12-10',
        issueDate: '2024-11-10',
        country: 'Canada',
        items: [
          { description: 'Custom Development', quantity: 25, unitPrice: 220, total: 5500 }
        ],
        createdBy: 'alice.brown@apace.local'
      }
    ];

    const mockMetrics: FinancialMetrics = {
      totalRevenue: 41000,
      totalOutstanding: 26000,
      totalOverdue: 12000,
      averageInvoiceValue: 10250,
      paymentRate: 85,
      monthlyGrowth: 12.5
    };

    setTimeout(() => {
      setInvoices(mockInvoices);
      setMetrics(mockMetrics);
      setLoading(false);
    }, 500);
  }, []);

  const handleInvoiceAction = async (action: 'markPaid' | 'markOverdue' | 'sendReminder' | 'cancel', invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (!invoice) return;

    switch (action) {
      case 'markPaid':
        setInvoices(invoices.map(inv => 
          inv.id === invoiceId 
            ? { ...inv, status: 'paid' as const, paidAt: new Date().toISOString() }
            : inv
        ));
        break;
      case 'markOverdue':
        setInvoices(invoices.map(inv => 
          inv.id === invoiceId 
            ? { ...inv, status: 'overdue' as const }
            : inv
        ));
        break;
      case 'sendReminder':
        console.log('Sending payment reminder for invoice:', invoiceId);
        break;
      case 'cancel':
        if (window.confirm('Are you sure you want to cancel this invoice?')) {
          setInvoices(invoices.map(inv => 
            inv.id === invoiceId 
              ? { ...inv, status: 'cancelled' as const }
              : inv
          ));
        }
        break;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: DollarSign },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invoice & Finance Oversight</h2>
          <p className="text-gray-600 mb-4">
            Manage invoices, track payments, and monitor financial performance across all regions.
          </p>
        </div>
        <button
          onClick={() => setShowInvoiceForm(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <FileText className="h-4 w-4" />
          Create Invoice
        </button>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalRevenue)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Outstanding</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalOutstanding)}</p>
            </div>
            <CreditCard className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalOverdue)}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Invoice</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.averageInvoiceValue)}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Payment Rate</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.paymentRate}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Growth</p>
              <p className="text-2xl font-bold text-gray-900">+{metrics.monthlyGrowth}%</p>
            </div>
            <Calendar className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Recent Invoices */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Invoices</h3>
                <div className="space-y-3">
                  {invoices.slice(0, 5).map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{invoice.invoiceNumber}</div>
                          <div className="text-sm text-gray-500">{invoice.clientName} • {invoice.country}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">{formatCurrency(invoice.amount, invoice.currency)}</div>
                        <div className="text-sm text-gray-500">Due {new Date(invoice.dueDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Financial Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                  <h4 className="font-medium text-green-900 mb-4">Payment Status Overview</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-green-700">Paid Invoices</span>
                      <span className="font-medium text-green-900">
                        {invoices.filter(inv => inv.status === 'paid').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-yellow-700">Pending Invoices</span>
                      <span className="font-medium text-yellow-900">
                        {invoices.filter(inv => inv.status === 'pending').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-red-700">Overdue Invoices</span>
                      <span className="font-medium text-red-900">
                        {invoices.filter(inv => inv.status === 'overdue').length}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-medium text-blue-900 mb-4">Revenue by Region</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700">United States</span>
                      <span className="font-medium text-blue-900">$15,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700">Europe</span>
                      <span className="font-medium text-blue-900">$20,500</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700">Canada</span>
                      <span className="font-medium text-blue-900">$5,500</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Invoices Tab */}
          {activeTab === 'invoices' && (
            <InvoiceList
              invoices={invoices}
              onInvoiceAction={handleInvoiceAction}
              onViewInvoice={setSelectedInvoice}
            />
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <FinancialChart
              invoices={invoices}
              metrics={metrics}
            />
          )}
        </div>
      </div>

      {/* Invoice Form Modal */}
      {showInvoiceForm && (
        <InvoiceForm
          onSave={(invoiceData) => {
            const newInvoice: Invoice = {
              id: (invoices.length + 1).toString(),
              invoiceNumber: `INV-2024-${String(invoices.length + 1).padStart(3, '0')}`,
              ...invoiceData,
              status: 'pending',
              issueDate: new Date().toISOString().split('T')[0],
              createdBy: 'admin@apace.local'
            };
            setInvoices([...invoices, newInvoice]);
            setShowInvoiceForm(false);
          }}
          onCancel={() => setShowInvoiceForm(false)}
        />
      )}

      {/* Invoice Details Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white mb-10">
            {/* Invoice details would go here */}
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Invoice Details</h3>
              <p className="mt-1 text-sm text-gray-500">Detailed invoice view would be displayed here.</p>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}