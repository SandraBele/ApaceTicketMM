'use client';

import { useState, useEffect } from 'react';
import { Shield, Settings, Monitor, AlertTriangle, Lock, Key, Activity, Database } from 'lucide-react';
import AuditLogs from './AuditLogs';
import SecuritySettings from './SecuritySettings';
import SystemConfig from './SystemConfig';
import BackupStatus from './BackupStatus';

interface SystemMetrics {
  uptime: string;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  activeUsers: number;
  totalSessions: number;
  lastBackup: string;
  securityAlerts: number;
}

interface SecurityAlert {
  id: string;
  type: 'login_failure' | 'suspicious_activity' | 'permission_escalation' | 'data_breach';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  source: string;
  resolved: boolean;
}

export default function SystemSecurityPanel() {
  const [activeTab, setActiveTab] = useState<'overview' | 'audit' | 'security' | 'config' | 'backup'>('overview');
  const [metrics, setMetrics] = useState<SystemMetrics>({
    uptime: '0d 0h 0m',
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
    activeUsers: 0,
    totalSessions: 0,
    lastBackup: '',
    securityAlerts: 0
  });
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data
  useEffect(() => {
    const mockMetrics: SystemMetrics = {
      uptime: '15d 8h 23m',
      cpuUsage: 34,
      memoryUsage: 67,
      diskUsage: 45,
      activeUsers: 89,
      totalSessions: 247,
      lastBackup: '2024-12-02T02:30:00Z',
      securityAlerts: 3
    };

    const mockAlerts: SecurityAlert[] = [
      {
        id: '1',
        type: 'login_failure',
        severity: 'medium',
        message: 'Multiple failed login attempts detected from IP 192.168.1.100',
        timestamp: '2024-12-02T10:15:00Z',
        source: '192.168.1.100',
        resolved: false
      },
      {
        id: '2',
        type: 'suspicious_activity',
        severity: 'high',
        message: 'Unusual API access pattern detected for user john.doe@apace.local',
        timestamp: '2024-12-02T09:30:00Z',
        source: 'API Gateway',
        resolved: false
      },
      {
        id: '3',
        type: 'permission_escalation',
        severity: 'critical',
        message: 'Unauthorized attempt to access admin panel',
        timestamp: '2024-12-01T16:45:00Z',
        source: 'Web Application',
        resolved: true
      }
    ];

    setTimeout(() => {
      setMetrics(mockMetrics);
      setSecurityAlerts(mockAlerts);
      setLoading(false);
    }, 500);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        cpuUsage: Math.max(10, Math.min(90, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(30, Math.min(95, prev.memoryUsage + (Math.random() - 0.5) * 5)),
        activeUsers: Math.max(50, Math.min(150, prev.activeUsers + Math.floor((Math.random() - 0.5) * 10)))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'login_failure': return <Key className="h-4 w-4" />;
      case 'suspicious_activity': return <AlertTriangle className="h-4 w-4" />;
      case 'permission_escalation': return <Shield className="h-4 w-4" />;
      case 'data_breach': return <Lock className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getUsageColor = (usage: number) => {
    if (usage < 50) return 'bg-green-500';
    if (usage < 75) return 'bg-yellow-500';
    if (usage < 90) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'System Overview', icon: Monitor },
    { id: 'audit', label: 'Audit Logs', icon: Activity },
    { id: 'security', label: 'Security Settings', icon: Shield },
    { id: 'config', label: 'System Config', icon: Settings },
    { id: 'backup', label: 'Backup Status', icon: Database }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">System & Security</h2>
          <p className="text-gray-600 mb-4">
            Monitor system health, manage security settings, and configure system-wide options.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            metrics.securityAlerts > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}>
            {metrics.securityAlerts > 0 ? `${metrics.securityAlerts} Security Alerts` : 'All Systems Secure'}
          </div>
        </div>
      </div>

      {/* System Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">System Uptime</h3>
            <Monitor className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.uptime}</p>
          <p className="text-sm text-green-600 mt-1">System running normally</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">CPU Usage</h3>
            <Activity className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.cpuUsage.toFixed(1)}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className={`h-2 rounded-full ${getUsageColor(metrics.cpuUsage)} transition-all duration-300`}
              style={{ width: `${metrics.cpuUsage}%` }}
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Memory Usage</h3>
            <Database className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.memoryUsage.toFixed(1)}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className={`h-2 rounded-full ${getUsageColor(metrics.memoryUsage)} transition-all duration-300`}
              style={{ width: `${metrics.memoryUsage}%` }}
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Active Users</h3>
            <Shield className="h-5 w-5 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.activeUsers}</p>
          <p className="text-sm text-gray-500 mt-1">{metrics.totalSessions} total sessions</p>
        </div>
      </div>

      {/* Security Alerts */}
      {securityAlerts.filter(alert => !alert.resolved).length > 0 && (
        <div className="bg-white rounded-lg shadow-md border border-red-200">
          <div className="px-6 py-4 border-b border-red-200 bg-red-50">
            <h3 className="text-lg font-semibold text-red-900 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Active Security Alerts
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {securityAlerts.filter(alert => !alert.resolved).map((alert) => (
                <div key={alert.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                    {getAlertIcon(alert.type)}
                    {alert.severity}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Source: {alert.source} • {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                    Resolve
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
          {/* System Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Performance Status</h4>
                  <div className="space-y-2 text-sm text-blue-800">
                    <div className="flex justify-between">
                      <span>CPU:</span>
                      <span className={metrics.cpuUsage > 80 ? 'text-red-600 font-medium' : ''}>
                        {metrics.cpuUsage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Memory:</span>
                      <span className={metrics.memoryUsage > 85 ? 'text-red-600 font-medium' : ''}>
                        {metrics.memoryUsage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Disk:</span>
                      <span>{metrics.diskUsage}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2">Security Status</h4>
                  <div className="space-y-2 text-sm text-green-800">
                    <div className="flex justify-between">
                      <span>Active Threats:</span>
                      <span className={metrics.securityAlerts > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
                        {metrics.securityAlerts}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Scan:</span>
                      <span>2 hours ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Firewall:</span>
                      <span className="text-green-600">Active</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-medium text-purple-900 mb-2">Backup Status</h4>
                  <div className="space-y-2 text-sm text-purple-800">
                    <div className="flex justify-between">
                      <span>Last Backup:</span>
                      <span>{new Date(metrics.lastBackup).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="text-green-600">Healthy</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Next Backup:</span>
                      <span>Tonight 2:00 AM</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Recent Activity */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Recent System Activity</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                    <Activity className="h-4 w-4 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Database backup completed successfully</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Security scan completed - no threats detected</p>
                      <p className="text-xs text-gray-500">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                    <Settings className="h-4 w-4 text-purple-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">System configuration updated by admin</p>
                      <p className="text-xs text-gray-500">6 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Audit Logs Tab */}
          {activeTab === 'audit' && <AuditLogs />}

          {/* Security Settings Tab */}
          {activeTab === 'security' && <SecuritySettings />}

          {/* System Config Tab */}
          {activeTab === 'config' && <SystemConfig />}

          {/* Backup Status Tab */}
          {activeTab === 'backup' && <BackupStatus lastBackup={metrics.lastBackup} />}
        </div>
      </div>
    </div>
  );
}