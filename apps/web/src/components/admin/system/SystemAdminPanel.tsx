import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { SystemConfig, SystemStats, BackupInfo } from '../../../types/admin';

interface SystemAdminPanelProps {
  className?: string;
}

export function SystemAdminPanel({ className = '' }: SystemAdminPanelProps) {
  const [systemConfig, setSystemConfig] = useState<SystemConfig | null>(null);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'security' | 'maintenance' | 'logs'>('overview');
  const [configChanges, setConfigChanges] = useState<Partial<SystemConfig>>({});

  useEffect(() => {
    loadSystemData();
  }, []);

  const loadSystemData = async () => {
    try {
      setLoading(true);
      const [config, stats] = await Promise.all([
        api.getSystemConfig(),
        api.getSystemStats()
      ]);
      setSystemConfig(config);
      setSystemStats(stats);
    } catch (err) {
      setError('Failed to load system data');
      console.error('Error loading system data:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateSystemConfig = async () => {
    if (!systemConfig || Object.keys(configChanges).length === 0) return;
    
    try {
      const updatedConfig = { ...systemConfig, ...configChanges };
      await api.updateSystemConfig(updatedConfig);
      setSystemConfig(updatedConfig);
      setConfigChanges({});
      alert('System configuration updated successfully');
    } catch (err) {
      console.error('Error updating system config:', err);
      alert('Failed to update system configuration');
    }
  };

  const handleConfigChange = (key: keyof SystemConfig, value: any) => {
    setConfigChanges(prev => ({ ...prev, [key]: value }));
  };

  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy':
      case 'online':
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'warning':
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
      case 'offline':
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="text-red-600 text-center">
          <p>{error}</p>
          <button 
            onClick={loadSystemData}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 ${className}`}>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-gray-900">System Administration</h2>
          <button 
            onClick={loadSystemData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
        <p className="text-gray-600">Monitor and manage system configuration, security, and maintenance</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'overview', label: 'System Overview' },
            { key: 'settings', label: 'Settings' },
            { key: 'security', label: 'Security' },
            { key: 'maintenance', label: 'Maintenance' },
            { key: 'logs', label: 'System Logs' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && systemStats && (
        <div className="space-y-6">
          {/* System Health Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">System Status</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  getStatusColor(systemStats.overallStatus)
                }`}>
                  {systemStats.overallStatus}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Uptime</span>
                  <span className="font-medium">{systemStats.uptime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Version</span>
                  <span className="font-medium">{systemStats.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Environment</span>
                  <span className="font-medium">{systemStats.environment}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Resource Usage</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">CPU Usage</span>
                    <span className="text-sm font-medium">{systemStats.cpuUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${systemStats.cpuUsage}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Memory</span>
                    <span className="text-sm font-medium">{systemStats.memoryUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${systemStats.memoryUsage}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Disk Space</span>
                    <span className="text-sm font-medium">{systemStats.diskUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-600 h-2 rounded-full" 
                      style={{ width: `${systemStats.diskUsage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Active Services</h3>
              <div className="space-y-2">
                {systemStats.services.map((service) => (
                  <div key={service.name} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{service.name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      getStatusColor(service.status)
                    }`}>
                      {service.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Recent System Activity</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {systemStats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 text-sm">
                    <span className="text-gray-500">{activity.timestamp}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      getStatusColor(activity.type)
                    }`}>
                      {activity.type}
                    </span>
                    <span className="text-gray-900">{activity.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && systemConfig && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">System Configuration</h3>
              <p className="text-sm text-gray-600 mt-1">Manage global system settings and preferences</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                  <input
                    type="text"
                    value={configChanges.siteName ?? systemConfig.siteName}
                    onChange={(e) => handleConfigChange('siteName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
                  <input
                    type="email"
                    value={configChanges.adminEmail ?? systemConfig.adminEmail}
                    onChange={(e) => handleConfigChange('adminEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                  <input
                    type="number"
                    value={configChanges.sessionTimeout ?? systemConfig.sessionTimeout}
                    onChange={(e) => handleConfigChange('sessionTimeout', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Upload Size (MB)</label>
                  <input
                    type="number"
                    value={configChanges.maxUploadSize ?? systemConfig.maxUploadSize}
                    onChange={(e) => handleConfigChange('maxUploadSize', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="maintenance-mode"
                    checked={configChanges.maintenanceMode ?? systemConfig.maintenanceMode}
                    onChange={(e) => handleConfigChange('maintenanceMode', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="maintenance-mode" className="ml-2 text-sm text-gray-700">
                    Enable Maintenance Mode
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="debug-mode"
                    checked={configChanges.debugMode ?? systemConfig.debugMode}
                    onChange={(e) => handleConfigChange('debugMode', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="debug-mode" className="ml-2 text-sm text-gray-700">
                    Enable Debug Mode
                  </label>
                </div>
              </div>

              {Object.keys(configChanges).length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex space-x-3">
                    <button
                      onClick={updateSystemConfig}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setConfigChanges({})}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Two-Factor Authentication</span>
                  <span className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs">Enabled</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">SSL Certificate</span>
                  <span className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs">Valid</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Firewall Status</span>
                  <span className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Intrusion Detection</span>
                  <span className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs">Monitoring</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Recent Security Events</h3>
              <div className="space-y-3">
                {[
                  { time: '2 hours ago', event: 'Failed login attempt blocked', severity: 'warning' },
                  { time: '1 day ago', event: 'SSL certificate renewed', severity: 'info' },
                  { time: '3 days ago', event: 'Security scan completed', severity: 'success' },
                  { time: '1 week ago', event: 'Password policy updated', severity: 'info' }
                ].map((event, index) => (
                  <div key={index} className="flex items-center space-x-3 text-sm">
                    <span className="text-gray-500">{event.time}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      getStatusColor(event.severity)
                    }`}>
                      {event.severity}
                    </span>
                    <span className="text-gray-900">{event.event}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Maintenance Tab */}
      {activeTab === 'maintenance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'System Backup', description: 'Create full system backup', action: 'Start Backup', color: 'blue' },
              { title: 'Database Cleanup', description: 'Clean up old data and logs', action: 'Run Cleanup', color: 'green' },
              { title: 'Cache Clear', description: 'Clear all system caches', action: 'Clear Cache', color: 'yellow' },
              { title: 'System Update', description: 'Check for system updates', action: 'Check Updates', color: 'purple' },
              { title: 'Health Check', description: 'Run comprehensive health check', action: 'Run Check', color: 'indigo' },
              { title: 'Performance Optimization', description: 'Optimize system performance', action: 'Optimize', color: 'pink' }
            ].map((task) => (
              <div key={task.title} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
                <p className="text-sm text-gray-500 mb-4">{task.description}</p>
                <button className={`w-full px-4 py-2 bg-${task.color}-600 text-white rounded hover:bg-${task.color}-700`}>
                  {task.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">System Logs</h3>
                <div className="flex space-x-2">
                  <select className="px-3 py-1 border border-gray-300 rounded text-sm">
                    <option value="all">All Logs</option>
                    <option value="error">Error Logs</option>
                    <option value="warning">Warning Logs</option>
                    <option value="info">Info Logs</option>
                  </select>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                    Export
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm h-64 overflow-y-auto">
                <div>[2025-10-02 05:02:21] INFO: System startup completed successfully</div>
                <div>[2025-10-02 05:01:45] INFO: Database connection established</div>
                <div>[2025-10-02 05:01:30] INFO: Loading system configuration</div>
                <div>[2025-10-02 05:01:15] INFO: Authentication service started</div>
                <div>[2025-10-02 05:01:00] INFO: System initialization started</div>
                <div>[2025-10-02 04:59:30] INFO: Previous session cleanup completed</div>
                <div>[2025-10-02 04:58:15] WARNING: High memory usage detected: 85%</div>
                <div>[2025-10-02 04:57:00] INFO: Scheduled maintenance task completed</div>
                <div>[2025-10-02 04:55:45] INFO: User session created for admin@company.com</div>
                <div>[2025-10-02 04:54:30] INFO: System health check passed</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}