'use client';

import { useState } from 'react';
import { Settings, Bell, Mail, Clock, Users } from 'lucide-react';

export default function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: {
      slaBreaches: true,
      newTickets: false,
      overdueInvoices: true,
      userActivity: false,
      systemUpdates: true
    },
    emailFrequency: {
      immediate: ['slaBreaches', 'systemUpdates'],
      hourly: ['newTickets'],
      daily: ['overdueInvoices'],
      weekly: ['userActivity']
    },
    smtpSettings: {
      host: 'localhost',
      port: '1025',
      username: '',
      password: '',
      fromEmail: 'noreply@apace.local',
      fromName: 'ApaceTicket System'
    },
    globalSettings: {
      enableEmailDelivery: true,
      enableScheduling: true,
      maxRecipientsPerEmail: 100,
      dailyEmailLimit: 1000,
      enableDeliveryTracking: true
    }
  });
  const [activeSection, setActiveSection] = useState<'notifications' | 'smtp' | 'global'>('notifications');
  const [saving, setSaving] = useState(false);

  const handleSettingChange = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Settings saved:', settings);
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { id: 'notifications', label: 'Notification Preferences', icon: Bell },
    { id: 'smtp', label: 'SMTP Configuration', icon: Mail },
    { id: 'global', label: 'Global Settings', icon: Settings }
  ];

  return (
    <div className="space-y-6">
      {/* Section Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as any)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {section.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Notification Preferences */}
      {activeSection === 'notifications' && (
        <div className="space-y-6">
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Email Notification Types</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h5 className="font-medium text-gray-900">SLA Breach Alerts</h5>
                  <p className="text-sm text-gray-500">Get notified immediately when tickets breach SLA requirements</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications.slaBreaches}
                    onChange={(e) => handleSettingChange('emailNotifications', 'slaBreaches', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h5 className="font-medium text-gray-900">New Ticket Notifications</h5>
                  <p className="text-sm text-gray-500">Receive notifications when new tickets are created</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications.newTickets}
                    onChange={(e) => handleSettingChange('emailNotifications', 'newTickets', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h5 className="font-medium text-gray-900">Overdue Invoice Alerts</h5>
                  <p className="text-sm text-gray-500">Notifications for overdue payment reminders</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications.overdueInvoices}
                    onChange={(e) => handleSettingChange('emailNotifications', 'overdueInvoices', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h5 className="font-medium text-gray-900">User Activity Summaries</h5>
                  <p className="text-sm text-gray-500">Weekly summaries of user login and activity patterns</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications.userActivity}
                    onChange={(e) => handleSettingChange('emailNotifications', 'userActivity', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h5 className="font-medium text-gray-900">System Updates</h5>
                  <p className="text-sm text-gray-500">Important system maintenance and update notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications.systemUpdates}
                    onChange={(e) => handleSettingChange('emailNotifications', 'systemUpdates', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Notification Frequency</h4>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="font-medium text-blue-900 mb-2">Current Configuration</h5>
              <div className="text-sm text-blue-800 space-y-1">
                <div><strong>Immediate:</strong> SLA Breaches, System Updates</div>
                <div><strong>Hourly:</strong> New Tickets</div>
                <div><strong>Daily:</strong> Overdue Invoices</div>
                <div><strong>Weekly:</strong> User Activity Summaries</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SMTP Configuration */}
      {activeSection === 'smtp' && (
        <div className="space-y-6">
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">SMTP Server Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
                <input
                  type="text"
                  value={settings.smtpSettings.host}
                  onChange={(e) => handleSettingChange('smtpSettings', 'host', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="smtp.example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
                <input
                  type="number"
                  value={settings.smtpSettings.port}
                  onChange={(e) => handleSettingChange('smtpSettings', 'port', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="587"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={settings.smtpSettings.username}
                  onChange={(e) => handleSettingChange('smtpSettings', 'username', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your-email@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={settings.smtpSettings.password}
                  onChange={(e) => handleSettingChange('smtpSettings', 'password', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Email</label>
                <input
                  type="email"
                  value={settings.smtpSettings.fromEmail}
                  onChange={(e) => handleSettingChange('smtpSettings', 'fromEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="noreply@yourcompany.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Name</label>
                <input
                  type="text"
                  value={settings.smtpSettings.fromName}
                  onChange={(e) => handleSettingChange('smtpSettings', 'fromName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your Company Name"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h5 className="font-medium text-yellow-900 mb-2">Development Settings</h5>
            <p className="text-sm text-yellow-800">
              Currently using MailHog for development. In production, configure your actual SMTP provider 
              (e.g., SendGrid, AWS SES, Mailgun) for reliable email delivery.
            </p>
          </div>
          
          <div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Test Email Connection
            </button>
          </div>
        </div>
      )}

      {/* Global Settings */}
      {activeSection === 'global' && (
        <div className="space-y-6">
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">System-wide Email Settings</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h5 className="font-medium text-gray-900">Enable Email Delivery</h5>
                  <p className="text-sm text-gray-500">Master switch for all email functionality</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.globalSettings.enableEmailDelivery}
                    onChange={(e) => handleSettingChange('globalSettings', 'enableEmailDelivery', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h5 className="font-medium text-gray-900">Enable Email Scheduling</h5>
                  <p className="text-sm text-gray-500">Allow users to schedule emails for future delivery</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.globalSettings.enableScheduling}
                    onChange={(e) => handleSettingChange('globalSettings', 'enableScheduling', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h5 className="font-medium text-gray-900">Enable Delivery Tracking</h5>
                  <p className="text-sm text-gray-500">Track email delivery status and engagement metrics</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.globalSettings.enableDeliveryTracking}
                    onChange={(e) => handleSettingChange('globalSettings', 'enableDeliveryTracking', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Rate Limiting</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Recipients per Email</label>
                <input
                  type="number"
                  value={settings.globalSettings.maxRecipientsPerEmail}
                  onChange={(e) => handleSettingChange('globalSettings', 'maxRecipientsPerEmail', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                  max="1000"
                />
                <p className="text-xs text-gray-500 mt-1">Prevent abuse by limiting bulk email size</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Daily Email Limit</label>
                <input
                  type="number"
                  value={settings.globalSettings.dailyEmailLimit}
                  onChange={(e) => handleSettingChange('globalSettings', 'dailyEmailLimit', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  min="10"
                  max="10000"
                />
                <p className="text-xs text-gray-500 mt-1">Total emails that can be sent per day</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Settings className="h-4 w-4" />
          )}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}