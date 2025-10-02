'use client';

import { useState, useEffect } from 'react';
import { Mail, Send, Users, Bell, Settings, Eye, Edit, Trash2, Plus } from 'lucide-react';
import EmailComposer from './EmailComposer';
import NotificationSettings from './NotificationSettings';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'welcome' | 'sla_breach' | 'invoice_overdue' | 'custom';
  isActive: boolean;
  createdAt: string;
  lastUsed?: string;
}

interface NotificationRule {
  id: string;
  name: string;
  trigger: 'sla_breach' | 'ticket_created' | 'invoice_overdue' | 'user_inactive';
  recipients: string[];
  isActive: boolean;
  frequency: 'immediate' | 'hourly' | 'daily';
}

export default function EmailNotificationPanel() {
  const [activeTab, setActiveTab] = useState<'composer' | 'templates' | 'notifications' | 'settings'>('composer');
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [notifications, setNotifications] = useState<NotificationRule[]>([]);
  const [showComposer, setShowComposer] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data
  useEffect(() => {
    const mockTemplates: EmailTemplate[] = [
      {
        id: '1',
        name: 'Welcome Email',
        subject: 'Welcome to ApaceTicket - Your Account is Ready',
        content: 'Welcome to ApaceTicket! Your account has been created successfully...',
        type: 'welcome',
        isActive: true,
        createdAt: '2024-11-15T10:00:00Z',
        lastUsed: '2024-12-01T14:30:00Z'
      },
      {
        id: '2',
        name: 'SLA Breach Alert',
        subject: 'URGENT: SLA Breach Alert for Ticket #{ticketId}',
        content: 'A ticket has breached its SLA requirements and requires immediate attention...',
        type: 'sla_breach',
        isActive: true,
        createdAt: '2024-11-10T09:15:00Z',
        lastUsed: '2024-12-02T08:45:00Z'
      },
      {
        id: '3',
        name: 'Overdue Invoice Notice',
        subject: 'Payment Reminder: Invoice #{invoiceNumber} is Now Overdue',
        content: 'This is a friendly reminder that your invoice is now overdue...',
        type: 'invoice_overdue',
        isActive: true,
        createdAt: '2024-11-20T16:45:00Z',
        lastUsed: '2024-11-30T11:20:00Z'
      }
    ];

    const mockNotifications: NotificationRule[] = [
      {
        id: '1',
        name: 'SLA Breach Alerts',
        trigger: 'sla_breach',
        recipients: ['admin@apace.local', 'management@apace.local'],
        isActive: true,
        frequency: 'immediate'
      },
      {
        id: '2',
        name: 'Daily Ticket Summary',
        trigger: 'ticket_created',
        recipients: ['support@apace.local', 'management@apace.local'],
        isActive: true,
        frequency: 'daily'
      },
      {
        id: '3',
        name: 'Invoice Overdue Notifications',
        trigger: 'invoice_overdue',
        recipients: ['billing@apace.local', 'business@apace.local'],
        isActive: false,
        frequency: 'immediate'
      }
    ];

    setTimeout(() => {
      setTemplates(mockTemplates);
      setNotifications(mockNotifications);
      setLoading(false);
    }, 500);
  }, []);

  const handleSendEmail = async (emailData: any) => {
    console.log('Sending email:', emailData);
    // In real implementation, this would call the backend API
  };

  const handleTemplateAction = (action: 'edit' | 'delete' | 'duplicate', template: EmailTemplate) => {
    switch (action) {
      case 'edit':
        setSelectedTemplate(template);
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this template?')) {
          setTemplates(templates.filter(t => t.id !== template.id));
        }
        break;
      case 'duplicate':
        const newTemplate = {
          ...template,
          id: (templates.length + 1).toString(),
          name: `${template.name} (Copy)`,
          createdAt: new Date().toISOString(),
          lastUsed: undefined
        };
        setTemplates([...templates, newTemplate]);
        break;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'welcome': return 'bg-green-100 text-green-800';
      case 'sla_breach': return 'bg-red-100 text-red-800';
      case 'invoice_overdue': return 'bg-yellow-100 text-yellow-800';
      case 'custom': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTriggerColor = (trigger: string) => {
    switch (trigger) {
      case 'sla_breach': return 'bg-red-100 text-red-800';
      case 'ticket_created': return 'bg-blue-100 text-blue-800';
      case 'invoice_overdue': return 'bg-yellow-100 text-yellow-800';
      case 'user_inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'composer', label: 'Email Composer', icon: Mail },
    { id: 'templates', label: 'Templates', icon: Edit },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Email & Notifications</h2>
          <p className="text-gray-600 mb-4">
            Manage email communications, templates, and automated notification settings.
          </p>
        </div>
        <button
          onClick={() => setShowComposer(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Send className="h-4 w-4" />
          Compose Email
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Email Templates</p>
              <p className="text-2xl font-bold text-gray-900">{templates.length}</p>
            </div>
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Notifications</p>
              <p className="text-2xl font-bold text-gray-900">
                {notifications.filter(n => n.isActive).length}
              </p>
            </div>
            <Bell className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Emails Sent Today</p>
              <p className="text-2xl font-bold text-gray-900">47</p>
            </div>
            <Send className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Delivery Rate</p>
              <p className="text-2xl font-bold text-gray-900">98.5%</p>
            </div>
            <Users className="h-8 w-8 text-orange-600" />
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
          {/* Email Composer Tab */}
          {activeTab === 'composer' && (
            <div className="space-y-6">
              <div className="text-center py-8">
                <Mail className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Email Composer</h3>
                <p className="mt-1 text-sm text-gray-500 mb-4">
                  Send emails to users, teams, or custom recipient lists.
                </p>
                <button
                  onClick={() => setShowComposer(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Send className="h-4 w-4" />
                  Compose New Email
                </button>
              </div>
              
              {/* Recent Emails */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Recent Emails</h4>
                <div className="space-y-3">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium text-gray-900">Monthly Performance Summary</h5>
                        <p className="text-sm text-gray-500">Sent to: All Team Leads</p>
                        <p className="text-sm text-gray-500">Dec 1, 2024 at 2:30 PM</p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Delivered</span>
                    </div>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium text-gray-900">SLA Breach Alert</h5>
                        <p className="text-sm text-gray-500">Sent to: Technical Support Team</p>
                        <p className="text-sm text-gray-500">Dec 2, 2024 at 8:45 AM</p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Delivered</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Email Templates</h3>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Create Template
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {templates.map((template) => (
                  <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{template.name}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(template.type)}`}>
                            {template.type.replace('_', ' ')}
                          </span>
                          {template.isActive ? (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Inactive</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">Subject: {template.subject}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Created {new Date(template.createdAt).toLocaleDateString()}
                          {template.lastUsed && ` • Last used ${new Date(template.lastUsed).toLocaleDateString()}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => console.log('Preview template:', template.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded"
                          title="Preview"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleTemplateAction('edit', template)}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleTemplateAction('duplicate', template)}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded"
                          title="Duplicate"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleTemplateAction('delete', template)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      {template.content.substring(0, 150)}...
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Notification Rules</h3>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                  <Plus className="h-4 w-4" />
                  Create Rule
                </button>
              </div>
              
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-gray-900">{notification.name}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${getTriggerColor(notification.trigger)}`}>
                            {notification.trigger.replace('_', ' ')}
                          </span>
                          {notification.isActive ? (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Inactive</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">Recipients: {notification.recipients.join(', ')}</p>
                        <p className="text-sm text-gray-500">Frequency: {notification.frequency}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 rounded">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <NotificationSettings />
          )}
        </div>
      </div>

      {/* Email Composer Modal */}
      {showComposer && (
        <EmailComposer
          onSend={handleSendEmail}
          onClose={() => setShowComposer(false)}
          templates={templates}
        />
      )}
    </div>
  );
}