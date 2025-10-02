'use client';

import { useState } from 'react';
import { X, Send, Users, FileText } from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: string;
}

interface EmailComposerProps {
  onSend: (emailData: any) => void;
  onClose: () => void;
  templates: EmailTemplate[];
}

export default function EmailComposer({ onSend, onClose, templates }: EmailComposerProps) {
  const [emailData, setEmailData] = useState({
    recipients: '',
    recipientType: 'custom', // 'custom', 'all_users', 'team', 'role'
    subject: '',
    content: '',
    templateId: '',
    sendImmediately: true,
    scheduleDate: '',
    scheduleTime: ''
  });
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const recipientOptions = [
    { value: 'custom', label: 'Custom Recipients' },
    { value: 'all_users', label: 'All Users' },
    { value: 'all_teams', label: 'All Team Members' },
    { value: 'admins', label: 'Administrators' },
    { value: 'tech_support', label: 'Technical Support' },
    { value: 'business_dev', label: 'Business Development' },
    { value: 'management', label: 'Management' },
    { value: 'product_dev', label: 'Product Development' }
  ];

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setEmailData({
        ...emailData,
        templateId,
        subject: template.subject,
        content: template.content
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (emailData.recipientType === 'custom' && !emailData.recipients.trim()) {
      newErrors.recipients = 'Recipients are required';
    }
    
    if (!emailData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!emailData.content.trim()) {
      newErrors.content = 'Email content is required';
    }
    
    if (!emailData.sendImmediately) {
      if (!emailData.scheduleDate) {
        newErrors.scheduleDate = 'Schedule date is required';
      }
      if (!emailData.scheduleTime) {
        newErrors.scheduleTime = 'Schedule time is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSend = async () => {
    if (!validateForm()) {
      return;
    }

    setSending(true);
    try {
      await onSend(emailData);
      onClose();
    } catch (error) {
      setErrors({ submit: 'Failed to send email. Please try again.' });
    } finally {
      setSending(false);
    }
  };

  const getRecipientCount = () => {
    switch (emailData.recipientType) {
      case 'all_users': return '~1,247 users';
      case 'all_teams': return '~89 team members';
      case 'admins': return '~5 administrators';
      case 'tech_support': return '~23 support agents';
      case 'business_dev': return '~15 business developers';
      case 'management': return '~8 managers';
      case 'product_dev': return '~32 developers';
      case 'custom': {
        const count = emailData.recipients.split(',').filter(email => email.trim()).length;
        return count > 0 ? `${count} recipient${count !== 1 ? 's' : ''}` : '0 recipients';
      }
      default: return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white mb-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Compose Email</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Email Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Template Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Use Template (Optional)
              </label>
              <select
                value={emailData.templateId}
                onChange={(e) => handleTemplateSelect(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a template...</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Recipients */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipients
              </label>
              <div className="space-y-3">
                <select
                  value={emailData.recipientType}
                  onChange={(e) => setEmailData({ ...emailData, recipientType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {recipientOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                
                {emailData.recipientType === 'custom' && (
                  <textarea
                    value={emailData.recipients}
                    onChange={(e) => setEmailData({ ...emailData, recipients: e.target.value })}
                    placeholder="Enter email addresses separated by commas"
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.recipients ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                )}
                
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Users className="h-4 w-4" />
                  <span>{getRecipientCount()}</span>
                </div>
              </div>
              {errors.recipients && <p className="mt-1 text-sm text-red-600">{errors.recipients}</p>}
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                placeholder="Enter email subject"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.subject ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Content
              </label>
              <textarea
                value={emailData.content}
                onChange={(e) => setEmailData({ ...emailData, content: e.target.value })}
                placeholder="Enter your email message..."
                rows={12}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.content ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
            </div>

            {/* Scheduling */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Options
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="delivery"
                    checked={emailData.sendImmediately}
                    onChange={() => setEmailData({ ...emailData, sendImmediately: true })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Send immediately</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="delivery"
                    checked={!emailData.sendImmediately}
                    onChange={() => setEmailData({ ...emailData, sendImmediately: false })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Schedule for later</span>
                </label>
                
                {!emailData.sendImmediately && (
                  <div className="ml-6 grid grid-cols-2 gap-3">
                    <div>
                      <input
                        type="date"
                        value={emailData.scheduleDate}
                        onChange={(e) => setEmailData({ ...emailData, scheduleDate: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                          errors.scheduleDate ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.scheduleDate && <p className="mt-1 text-xs text-red-600">{errors.scheduleDate}</p>}
                    </div>
                    <div>
                      <input
                        type="time"
                        value={emailData.scheduleTime}
                        onChange={(e) => setEmailData({ ...emailData, scheduleTime: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                          errors.scheduleTime ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.scheduleTime && <p className="mt-1 text-xs text-red-600">{errors.scheduleTime}</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Email Preview
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">To:</span>
                  <span className="ml-2 text-gray-600">{getRecipientCount()}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Subject:</span>
                  <span className="ml-2 text-gray-600">{emailData.subject || '(No subject)'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Content:</span>
                  <div className="mt-1 p-2 bg-white rounded border text-xs text-gray-600 max-h-32 overflow-y-auto">
                    {emailData.content || '(No content)'}
                  </div>
                </div>
              </div>
            </div>

            {/* Variables Help */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Available Variables</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <div><code>{'{firstName}'}</code> - User's first name</div>
                <div><code>{'{lastName}'}</code> - User's last name</div>
                <div><code>{'{email}'}</code> - User's email</div>
                <div><code>{'{role}'}</code> - User's role</div>
                <div><code>{'{teamName}'}</code> - User's team</div>
                <div><code>{'{ticketId}'}</code> - Ticket ID</div>
                <div><code>{'{invoiceNumber}'}</code> - Invoice number</div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {errors.submit && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {errors.submit}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sending}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md text-sm font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
            {sending ? 'Sending...' : (emailData.sendImmediately ? 'Send Now' : 'Schedule Email')}
          </button>
        </div>
      </div>
    </div>
  );
}