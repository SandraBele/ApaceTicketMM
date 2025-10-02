import React, { useState } from 'react';
import UserManagement from './admin/UserManagement';
import TeamManagement from './admin/TeamManagement';
import TicketOversight from './admin/TicketOversight';
import SystemConfig from './admin/SystemConfig';
import AuditLogs from './admin/AuditLogs';
import Reports from './admin/Reports';
import styles from '../../styles/AdminDashboard.module.css';

interface AdminDashboardProps {
  // Enhanced admin dashboard with full ERP functionality
}

type AdminTab = 'overview' | 'users' | 'teams' | 'tickets' | 'reports' | 'audit' | 'config';

const AdminDashboard: React.FC<AdminDashboardProps> = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const tabs = [
    { id: 'overview' as AdminTab, label: 'Overview', icon: '📊' },
    { id: 'users' as AdminTab, label: 'User Management', icon: '👥' },
    { id: 'teams' as AdminTab, label: 'Team Management', icon: '🏢' },
    { id: 'tickets' as AdminTab, label: 'Ticket Oversight', icon: '🎫' },
    { id: 'reports' as AdminTab, label: 'Reports & Analytics', icon: '📈' },
    { id: 'audit' as AdminTab, label: 'Audit Logs', icon: '🔍' },
    { id: 'config' as AdminTab, label: 'System Config', icon: '⚙️' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'users':
        return <UserManagement />;
      case 'teams':
        return <TeamManagement />;
      case 'tickets':
        return <TicketOversight />;
      case 'reports':
        return <Reports />;
      case 'audit':
        return <AuditLogs />;
      case 'config':
        return <SystemConfig />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className={styles.adminDashboard}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Admin Control Center</h2>
        </div>
        <nav className={styles.navigation}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.navButton} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={styles.navIcon}>{tab.icon}</span>
              <span className={styles.navLabel}>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
      
      <div className={styles.mainContent}>
        <div className={styles.contentHeader}>
          <h1 className={styles.pageTitle}>
            {tabs.find(tab => tab.id === activeTab)?.label || 'Overview'}
          </h1>
        </div>
        
        <div className={styles.contentBody}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab: React.FC = () => {
  return (
    <div className={styles.overview}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statContent}>
            <h3>Total Users</h3>
            <p className={styles.statNumber}>156</p>
            <span className={styles.statChange}>+12 this month</span>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🎫</div>
          <div className={styles.statContent}>
            <h3>Active Tickets</h3>
            <p className={styles.statNumber}>89</p>
            <span className={styles.statChange}>-5 since yesterday</span>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🏢</div>
          <div className={styles.statContent}>
            <h3>Teams</h3>
            <p className={styles.statNumber}>12</p>
            <span className={styles.statChange}>+2 this quarter</span>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⚠️</div>
          <div className={styles.statContent}>
            <h3>SLA Breaches</h3>
            <p className={styles.statNumber}>3</p>
            <span className={styles.statChange}>-1 from last week</span>
          </div>
        </div>
      </div>
      
      <div className={styles.quickActions}>
        <h3>Quick Actions</h3>
        <div className={styles.actionButtons}>
          <button className={styles.actionButton}>
            <span>➕</span>
            Create User
          </button>
          <button className={styles.actionButton}>
            <span>📊</span>
            Generate Report
          </button>
          <button className={styles.actionButton}>
            <span>🔄</span>
            System Backup
          </button>
          <button className={styles.actionButton}>
            <span>📧</span>
            Send Notification
          </button>
        </div>
      </div>
      
      <div className={styles.recentActivity}>
        <h3>Recent Activity</h3>
        <div className={styles.activityList}>
          <div className={styles.activityItem}>
            <div className={styles.activityIcon}>👤</div>
            <div className={styles.activityContent}>
              <p><strong>New user created:</strong> john.doe@company.com</p>
              <span className={styles.activityTime}>2 hours ago</span>
            </div>
          </div>
          <div className={styles.activityItem}>
            <div className={styles.activityIcon}>🎫</div>
            <div className={styles.activityContent}>
              <p><strong>Ticket resolved:</strong> Payment gateway issue</p>
              <span className={styles.activityTime}>4 hours ago</span>
            </div>
          </div>
          <div className={styles.activityItem}>
            <div className={styles.activityIcon}>⚠️</div>
            <div className={styles.activityContent}>
              <p><strong>SLA breach:</strong> Server maintenance ticket</p>
              <span className={styles.activityTime}>6 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
