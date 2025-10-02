import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../styles/SystemConfigPanel.module.css';

interface SystemConfig {
  id: string;
  key: string;
  value: string;
  description?: string;
}

interface AuditLog {
  id: string;
  action: string;
  performedBy?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  targetUser?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  details?: string;
  createdAt: string;
}

const SystemConfigPanel: React.FC = () => {
  const [configs, setConfigs] = useState<SystemConfig[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('settings');
  const [editingConfig, setEditingConfig] = useState<SystemConfig | null>(null);

  useEffect(() => {
    fetchConfigs();
    fetchAuditLogs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const response = await axios.get('/api/system-config');
      setConfigs(response.data);
    } catch (error) {
      console.error('Error fetching system configs:', error);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const response = await axios.get('/api/audit-logs?limit=50');
      setAuditLogs(response.data);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfigUpdate = async (configKey: string, newValue: string) => {
    try {
      await axios.patch(`/api/system-config/${configKey}`, { value: newValue });
      await fetchConfigs();
      setEditingConfig(null);
    } catch (error) {
      console.error('Error updating config:', error);
    }
  };

  const getConfigDisplayValue = (config: SystemConfig) => {
    switch (config.key) {
      case 'sla_warning_threshold':
      case 'sla_breach_threshold':
        return `${config.value}%`;
      case 'failed_login_attempts_limit':
      case 'password_min_length':
        return config.value;
      case 'require_2fa_for_admin':
      case 'backup_enabled':
      case 'email_notifications_enabled':
      case 'whatsapp_integration_enabled':
      case 'invoicing_enabled':
      case 'ai_categorization_enabled':
        return config.value === 'true' ? 'Enabled' : 'Disabled';
      default:
        return config.value;
    }
  };

  const getConfigInputType = (configKey: string) => {
    switch (configKey) {
      case 'sla_warning_threshold':
      case 'sla_breach_threshold':
      case 'failed_login_attempts_limit':
      case 'password_min_length':
        return 'number';
      case 'require_2fa_for_admin':
      case 'backup_enabled':
      case 'email_notifications_enabled':
      case 'whatsapp_integration_enabled':
      case 'invoicing_enabled':
      case 'ai_categorization_enabled':
        return 'select';
      default:
        return 'text';
    }
  };

  const formatActionLabel = (action: string) => {
    return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading system configuration...</p>
      </div>
    );
  }

  return (
    <div className={styles.systemConfigPanel}>
      <div className={styles.panelHeader}>
        <div className={styles.headerLeft}>
          <h2>System Configuration</h2>
          <p>Manage system settings, security controls, and audit logs</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabNavigation}>
        <button 
          className={`${styles.tab} ${activeTab === 'settings' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          System Settings
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'audit' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('audit')}
        >
          Audit Logs
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'backup' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('backup')}
        >
          Backup & Maintenance
        </button>
      </div>

      {/* System Settings Tab */}
      {activeTab === 'settings' && (
        <div className={styles.settingsContent}>
          <div className={styles.settingsGrid}>
            {configs.map(config => (
              <div key={config.id} className={styles.configCard}>
                <div className={styles.configHeader}>
                  <h4>{config.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
                  <button 
                    className={styles.editButton}
                    onClick={() => setEditingConfig(config)}
                  >
                    Edit
                  </button>
                </div>
                
                <div className={styles.configValue}>
                  {getConfigDisplayValue(config)}
                </div>
                
                {config.description && (
                  <div className={styles.configDescription}>
                    {config.description}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Edit Config Modal */}
          {editingConfig && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                  <h3>Edit Configuration</h3>
                  <button 
                    className={styles.closeButton}
                    onClick={() => setEditingConfig(null)}
                  >
                    ×
                  </button>
                </div>
                
                <div className={styles.modalBody}>
                  <div className={styles.inputGroup}>
                    <label>{editingConfig.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</label>
                    {getConfigInputType(editingConfig.key) === 'number' ? (
                      <input
                        type="number"
                        defaultValue={editingConfig.value}
                        className={styles.input}
                        id="configValue"
                      />
                    ) : getConfigInputType(editingConfig.key) === 'select' ? (
                      <select
                        defaultValue={editingConfig.value}
                        className={styles.select}
                        id="configValue"
                      >
                        <option value="true">Enabled</option>
                        <option value="false">Disabled</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        defaultValue={editingConfig.value}
                        className={styles.input}
                        id="configValue"
                      />
                    )}
                  </div>
                </div>
                
                <div className={styles.modalFooter}>
                  <button 
                    className={styles.cancelButton}
                    onClick={() => setEditingConfig(null)}
                  >
                    Cancel
                  </button>
                  <button 
                    className={styles.saveButton}
                    onClick={() => {
                      const input = document.getElementById('configValue') as HTMLInputElement | HTMLSelectElement;
                      if (input) {
                        handleConfigUpdate(editingConfig.key, input.value);
                      }
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Audit Logs Tab */}
      {activeTab === 'audit' && (
        <div className={styles.auditContent}>
          <div className={styles.tableContainer}>
            <table className={styles.auditTable}>
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Performed By</th>
                  <th>Target</th>
                  <th>Details</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map(log => (
                  <tr key={log.id}>
                    <td>
                      <span className={styles.actionBadge}>
                        {formatActionLabel(log.action)}
                      </span>
                    </td>
                    <td>
                      {log.performedBy ? (
                        `${log.performedBy.firstName} ${log.performedBy.lastName}`
                      ) : (
                        'System'
                      )}
                    </td>
                    <td>
                      {log.targetUser ? (
                        `${log.targetUser.firstName} ${log.targetUser.lastName}`
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className={styles.details}>
                      {log.details || '-'}
                    </td>
                    <td>
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Backup & Maintenance Tab */}
      {activeTab === 'backup' && (
        <div className={styles.backupContent}>
          <div className={styles.backupSection}>
            <h3>System Status</h3>
            <div className={styles.statusGrid}>
              <div className={styles.statusCard}>
                <div className={styles.statusIndicator} style={{ backgroundColor: '#10b981' }}></div>
                <div className={styles.statusInfo}>
                  <h4>Database</h4>
                  <p>Online</p>
                </div>
              </div>
              <div className={styles.statusCard}>
                <div className={styles.statusIndicator} style={{ backgroundColor: '#10b981' }}></div>
                <div className={styles.statusInfo}>
                  <h4>API Server</h4>
                  <p>Running</p>
                </div>
              </div>
              <div className={styles.statusCard}>
                <div className={styles.statusIndicator} style={{ backgroundColor: '#f59e0b' }}></div>
                <div className={styles.statusInfo}>
                  <h4>Backup Service</h4>
                  <p>Last backup: 2 hours ago</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.backupSection}>
            <h3>Maintenance Actions</h3>
            <div className={styles.actionsGrid}>
              <button className={styles.actionButton}>
                Create Backup
              </button>
              <button className={styles.actionButton}>
                Clear Cache
              </button>
              <button className={styles.actionButton}>
                Restart Services
              </button>
              <button className={styles.actionButton}>
                System Health Check
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemConfigPanel;