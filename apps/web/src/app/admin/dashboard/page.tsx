'use client';

import { useState } from 'react';
import { Users, Settings, Ticket, BarChart3, Mail, DollarSign, Shield, Home } from 'lucide-react';
import UserManagementPanel from '../../../components/admin/user-management/UserManagementPanel';
import TeamManagementPanel from '../../../components/admin/team-management/TeamManagementPanel';
import TicketOversightPanel from '../../../components/admin/ticket-oversight/TicketOversightPanel';

type AdminSection = 
  | 'overview'
  | 'user-management'
  | 'team-management'
  | 'ticket-oversight'
  | 'reporting'
  | 'notifications'
  | 'finance'
  | 'security';

interface SectionConfig {
  id: AdminSection;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  priority: 'high' | 'medium';
  implemented: boolean;
}

const sections: SectionConfig[] = [
  {
    id: 'overview',
    title: 'Admin Overview',
    description: 'Dashboard overview with key metrics and system status',
    icon: Home,
    priority: 'high',
    implemented: true
  },
  {
    id: 'user-management',
    title: 'User & Role Management',
    description: 'Manage users, roles, and permissions with advanced operations',
    icon: Users,
    priority: 'high',
    implemented: true
  },
  {
    id: 'team-management',
    title: 'Team & KPI Management',
    description: 'Configure teams, assign members, and set performance targets',
    icon: Settings,
    priority: 'high',
    implemented: true
  },
  {
    id: 'ticket-oversight',
    title: 'Ticket Oversight',
    description: 'Advanced ticket management with filtering and bulk operations',
    icon: Ticket,
    priority: 'high',
    implemented: true
  },
  {
    id: 'reporting',
    title: 'Reporting & Analytics',
    description: 'Generate reports, view analytics, and export data',
    icon: BarChart3,
    priority: 'medium',
    implemented: false
  },
  {
    id: 'notifications',
    title: 'Email & Notifications',
    description: 'Manage email communications and notification settings',
    icon: Mail,
    priority: 'medium',
    implemented: false
  },
  {
    id: 'finance',
    title: 'Invoice & Finance',
    description: 'Financial oversight, invoice management, and payment tracking',
    icon: DollarSign,
    priority: 'medium',
    implemented: false
  },
  {
    id: 'security',
    title: 'System & Security',
    description: 'System configuration, security controls, and audit logs',
    icon: Shield,
    priority: 'medium',
    implemented: false
  }
];

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'overview':
        return <AdminOverview />;
      case 'user-management':
        return <UserManagementPanel />;
      case 'team-management':
        return <TeamManagementPanel />;
      case 'ticket-oversight':
        return <TicketOversightPanel />;
      case 'reporting':
        return <ComingSoonPanel section={sections.find(s => s.id === activeSection)!} />;
      case 'notifications':
        return <ComingSoonPanel section={sections.find(s => s.id === activeSection)!} />;
      case 'finance':
        return <ComingSoonPanel section={sections.find(s => s.id === activeSection)!} />;
      case 'security':
        return <ComingSoonPanel section={sections.find(s => s.id === activeSection)!} />;
      default:
        return <AdminOverview />;
    }
  };

  const currentSection = sections.find(s => s.id === activeSection);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Control Center</h1>
              <p className="text-gray-600 mt-1">
                Comprehensive management interface for ApaceTicket ERP system
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                Active Section: <span className="font-medium text-gray-900">{currentSection?.title}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Admin Sections</h3>
                <p className="text-sm text-gray-600 mt-1">Navigate through admin features</p>
              </div>
              <nav className="p-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-blue-900'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className={`flex-shrink-0 mt-0.5 ${
                        isActive ? 'text-blue-600' : 'text-gray-400'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-medium truncate ${
                            isActive ? 'text-blue-900' : 'text-gray-900'
                          }`}>
                            {section.title}
                          </p>
                          <div className="flex gap-1">
                            {section.priority === 'high' && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                High
                              </span>
                            )}
                            {section.implemented ? (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Ready
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Coming
                              </span>
                            )}
                          </div>
                        </div>
                        <p className={`text-xs mt-1 ${
                          isActive ? 'text-blue-700' : 'text-gray-500'
                        }`}>
                          {section.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {renderSectionContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

// Admin Overview Component
function AdminOverview() {
  const stats = [
    {
      name: 'Total Users',
      value: '1,247',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users
    },
    {
      name: 'Active Tickets',
      value: '89',
      change: '-5%',
      changeType: 'negative' as const,
      icon: Ticket
    },
    {
      name: 'Teams',
      value: '12',
      change: '+2',
      changeType: 'positive' as const,
      icon: Settings
    },
    {
      name: 'SLA Breaches',
      value: '3',
      change: '-50%',
      changeType: 'positive' as const,
      icon: Shield
    }
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'user_created',
      message: 'New user account created for john.smith@company.com',
      timestamp: '2 minutes ago',
      icon: Users
    },
    {
      id: '2',
      type: 'ticket_resolved',
      message: 'High priority ticket #1234 resolved by Technical Support team',
      timestamp: '15 minutes ago',
      icon: Ticket
    },
    {
      id: '3',
      type: 'sla_breach',
      message: 'SLA breach detected for ticket #5678 - Response time exceeded',
      timestamp: '1 hour ago',
      icon: Shield
    },
    {
      id: '4',
      type: 'team_updated',
      message: 'KPI targets updated for Product Development team',
      timestamp: '2 hours ago',
      icon: Settings
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to the Admin Control Center
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your comprehensive dashboard for managing the ApaceTicket ERP system. 
            Monitor key metrics, manage users and teams, oversee support operations, 
            and maintain system security from this centralized interface.
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <p className="text-sm text-gray-600 mt-1">Latest system events and administrative actions</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Users className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Create User</span>
          </button>
          <button className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Settings className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Add Team</span>
          </button>
          <button className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <BarChart3 className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">View Reports</span>
          </button>
          <button className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Shield className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium">Security Logs</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Coming Soon Component
function ComingSoonPanel({ section }: { section: SectionConfig }) {
  const Icon = section.icon;
  
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center mb-6">
          <Icon className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{section.title}</h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {section.description}
        </p>
        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
          <span className="text-sm font-medium text-blue-900">
            Coming Soon - Phase {section.priority === 'high' ? '2-4' : '5-8'} Implementation
          </span>
        </div>
        <div className="mt-8 text-sm text-gray-500">
          <p>This feature is part of the ongoing ERP development roadmap.</p>
          <p className="mt-1">
            Priority: <span className="font-medium capitalize">{section.priority}</span>
          </p>
        </div>
      </div>
    </div>
  );
}