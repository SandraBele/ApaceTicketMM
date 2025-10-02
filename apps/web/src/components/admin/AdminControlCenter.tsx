import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { UserManagementPanel } from './user-management/UserManagementPanel';
import { TeamKPIDashboard } from './teams/TeamKPIDashboard';
import { TicketOversightPanel } from './ticket-oversight/TicketOversightPanel';
import { ReportingAnalyticsDashboard } from './reporting-analytics/ReportingAnalyticsDashboard';
import { CommunicationCenter } from './communications/CommunicationCenter';
import { FinancialDashboard } from './financial/FinancialDashboard';
import { SystemAdminPanel } from './system/SystemAdminPanel';

interface DashboardStats {
  users: { total: number; active: number; locked: number };
  tickets: { total: number; open: number; overdue: number };
  teams: { total: number };
  financial: { revenue: number; expenses: number };
  notifications: { unread: number };
  system: { uptime: string; status: string };
}

const AdminControlCenter: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [stats, setStats] = useState<DashboardStats>({
    users: { total: 0, active: 0, locked: 0 },
    tickets: { total: 0, open: 0, overdue: 0 },
    teams: { total: 0 },
    financial: { revenue: 0, expenses: 0 },
    notifications: { unread: 0 },
    system: { uptime: '99.9%', status: 'healthy' }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const [usersStats, ticketsStats, teamsStats, financialStats, notificationStats, systemStats] = await Promise.all([
        api.getUsersStatistics(),
        api.getTicketsStats(),
        api.getTeams(),
        api.getFinancialOverview('month'),
        api.getNotifications(),
        api.getSystemStats()
      ]);

      setStats({
        users: {
          total: usersStats.total,
          active: usersStats.active,
          locked: usersStats.locked
        },
        tickets: {
          total: ticketsStats.totalTickets,
          open: ticketsStats.openTickets,
          overdue: ticketsStats.overdueTickets || 0
        },
        teams: {
          total: teamsStats.length
        },
        financial: {
          revenue: financialStats.totalRevenue,
          expenses: financialStats.totalExpenses
        },
        notifications: {
          unread: notificationStats.filter((n: any) => !n.read).length
        },
        system: {
          uptime: systemStats.uptime,
          status: systemStats.overallStatus
        }
      });
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'users', label: 'User Management', icon: '👥', description: 'Manage users, roles, and permissions' },
    { id: 'teams', label: 'Teams & KPIs', icon: '🏢', description: 'Team management and performance tracking' },
    { id: 'tickets', label: 'Ticket Oversight', icon: '🎫', description: 'Support ticket management and tracking' },
    { id: 'reports', label: 'Analytics & Reports', icon: '📊', description: 'Business intelligence and reporting' },
    { id: 'communications', label: 'Communications', icon: '📢', description: 'Notifications and announcements' },
    { id: 'financial', label: 'Financial Management', icon: '💰', description: 'Revenue, expenses, and budgets' },
    { id: 'system', label: 'System Administration', icon: '⚙️', description: 'System configuration and maintenance' }
  ];

  const renderActivePanel = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagementPanel className="min-h-screen" />;
      case 'teams':
        return <TeamKPIDashboard className="min-h-screen" />;
      case 'tickets':
        return <TicketOversightPanel className="min-h-screen" />;
      case 'reports':
        return <ReportingAnalyticsDashboard className="min-h-screen" />;
      case 'communications':
        return <CommunicationCenter className="min-h-screen" />;
      case 'financial':
        return <FinancialDashboard className="min-h-screen" />;
      case 'system':
        return <SystemAdminPanel className="min-h-screen" />;
      default:
        return <UserManagementPanel className="min-h-screen" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Admin Control Center...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.862-.833-2.632 0L4.182 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-gray-900 font-medium mb-2">{error}</p>
          <button 
            onClick={fetchDashboardStats}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Control Center</h1>
                <p className="text-gray-600 mt-1">Comprehensive ERP Management System</p>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={fetchDashboardStats}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Refresh
                </button>
                <div className="text-right text-sm text-gray-500">
                  <p>Welcome back, {user?.name || 'Admin'}</p>
                  <p>{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-600">Users</h3>
                <div className="text-2xl font-bold text-gray-900">{stats.users.total}</div>
                <p className="text-sm text-gray-500">
                  {stats.users.active} active, {stats.users.locked} locked
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🎫</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-600">Tickets</h3>
                <div className="text-2xl font-bold text-gray-900">{stats.tickets.total}</div>
                <p className="text-sm text-gray-500">
                  {stats.tickets.open} open, {stats.tickets.overdue} overdue
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-600">Revenue</h3>
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(stats.financial.revenue)}</div>
                <p className="text-sm text-gray-500">
                  {formatCurrency(stats.financial.expenses)} expenses
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📈</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-600">System</h3>
                <div className="text-2xl font-bold text-gray-900">{stats.system.uptime}</div>
                <div className="flex items-center mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    getStatusColor(stats.system.status)
                  }`}>
                    {stats.system.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <div className="text-left">
                    <div className="font-medium">{tab.label}</div>
                    <div className="text-xs text-gray-400">{tab.description}</div>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Active Panel Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {renderActivePanel()}
        </div>
      </div>
    </div>
  );
};

export default AdminControlCenter;