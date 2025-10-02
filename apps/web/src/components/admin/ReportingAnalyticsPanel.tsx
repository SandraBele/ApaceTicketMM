import React, { useState, useEffect } from 'react';
import { reportsAPI } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import styles from '../../styles/ReportingAnalyticsPanel.module.css';

interface Report {
  id: string;
  name: string;
  type: 'user_performance' | 'team_performance' | 'ticket_analysis' | 'sla_compliance' | 'financial_summary' | 'satisfaction_trends';
  description: string;
  period: string;
  generatedAt: string;
  generatedBy: string;
  format: 'json' | 'csv' | 'pdf';
}

interface ReportTemplate {
  id: string;
  name: string;
  type: string;
  parameters: string[];
  description: string;
}

interface ReportingAnalyticsPanelProps {
  onStatsUpdate?: () => void;
}

const ReportingAnalyticsPanel: React.FC<ReportingAnalyticsPanelProps> = ({ onStatsUpdate }) => {
  const { user: currentUser } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'reports' | 'analytics' | 'templates'>('reports');
  const [generatingReport, setGeneratingReport] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [reportParams, setReportParams] = useState<any>({});
  
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [reportsResponse, templatesResponse] = await Promise.all([
        reportsAPI.getReports(),
        reportsAPI.getTemplates()
      ]);
      
      setReports(reportsResponse.data);
      setTemplates(templatesResponse.data);
    } catch (error: any) {
      console.error('Error fetching reports data:', error);
      setError(error.response?.data?.message || 'Failed to fetch reports data');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!selectedTemplate) return;
    
    try {
      setGeneratingReport(true);
      setError(null);
      
      const reportData = {
        type: selectedTemplate.type,
        parameters: reportParams,
        generatedBy: currentUser?.email || 'admin'
      };
      
      await reportsAPI.generateReport(reportData);
      await fetchInitialData();
      onStatsUpdate?.();
      
      setShowGenerateModal(false);
      setSelectedTemplate(null);
      setReportParams({});
    } catch (error: any) {
      console.error('Error generating report:', error);
      setError(error.response?.data?.message || 'Failed to generate report');
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleExportReport = async (reportId: string, format: 'csv' | 'pdf' | 'json') => {
    try {
      setError(null);
      const response = await reportsAPI.exportReport(reportId, format);
      
      // Simulate download
      const link = document.createElement('a');
      link.href = response.data.downloadUrl;
      link.download = `report_${reportId}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      console.error('Error exporting report:', error);
      setError(error.response?.data?.message || 'Failed to export report');
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return;
    
    try {
      setError(null);
      await reportsAPI.deleteReport(reportId);
      await fetchInitialData();
    } catch (error: any) {
      console.error('Error deleting report:', error);
      setError(error.response?.data?.message || 'Failed to delete report');
    }
  };

  const openGenerateModal = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setReportParams({
      period: 'Current Month',
      format: 'json'
    });
    setShowGenerateModal(true);
  };

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'user_performance': return '👤';
      case 'team_performance': return '👥';
      case 'ticket_analysis': return '🎫';
      case 'sla_compliance': return '⏱️';
      case 'financial_summary': return '💰';
      case 'satisfaction_trends': return '📊';
      default: return '📄';
    }
  };

  const mockAnalyticsData = {
    overallMetrics: {
      totalTickets: 197,
      resolvedTickets: 142,
      avgResolutionTime: 24.5,
      slaCompliance: 93.2,
      customerSatisfaction: 4.3
    },
    trendData: [
      { month: 'Jan', tickets: 145, satisfaction: 4.1 },
      { month: 'Feb', tickets: 162, satisfaction: 4.2 },
      { month: 'Mar', tickets: 158, satisfaction: 4.0 },
      { month: 'Apr', tickets: 171, satisfaction: 4.3 },
      { month: 'May', tickets: 189, satisfaction: 4.4 },
      { month: 'Jun', tickets: 203, satisfaction: 4.2 },
      { month: 'Jul', tickets: 195, satisfaction: 4.3 },
      { month: 'Aug', tickets: 187, satisfaction: 4.1 },
      { month: 'Sep', tickets: 197, satisfaction: 4.3 }
    ],
    teamPerformance: [
      { team: 'Technical Support', compliance: 94.2, tickets: 87 },
      { team: 'Product Development', compliance: 88.6, tickets: 42 },
      { team: 'Business Development', compliance: 96.8, tickets: 68 }
    ]
  };

  return (
    <div className={styles.reportingAnalyticsPanel}>
      <div className={styles.panelHeader}>
        <div className={styles.headerLeft}>
          <h2>Reporting & Analytics</h2>
          <p>Generate reports, view analytics, and export data insights</p>
        </div>
        <div className={styles.headerRight}>
          <button 
            className={styles.generateButton}
            onClick={() => setShowGenerateModal(true)}
            disabled={loading}
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className={styles.errorMessage}>
          <span>{error}</span>
          <button onClick={() => setError(null)} className={styles.dismissError}>
            ×
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className={styles.tabNavigation}>
        <button 
          className={`${styles.tab} ${activeTab === 'reports' ? styles.active : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          Generated Reports
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'analytics' ? styles.active : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics Dashboard
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'templates' ? styles.active : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          Report Templates
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === 'reports' && (
          <div className={styles.reportsTab}>
            {loading ? (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Loading reports...</p>
              </div>
            ) : (
              <div className={styles.reportsGrid}>
                {reports.map(report => (
                  <div key={report.id} className={styles.reportCard}>
                    <div className={styles.reportHeader}>
                      <div className={styles.reportIcon}>
                        {getReportTypeIcon(report.type)}
                      </div>
                      <div className={styles.reportInfo}>
                        <h4>{report.name}</h4>
                        <p>{report.description}</p>
                      </div>
                    </div>
                    
                    <div className={styles.reportDetails}>
                      <div className={styles.reportMeta}>
                        <span>Period: {report.period}</span>
                        <span>Generated: {new Date(report.generatedAt).toLocaleDateString()}</span>
                        <span>By: {report.generatedBy}</span>
                        <span>Format: {report.format.toUpperCase()}</span>
                      </div>
                    </div>
                    
                    <div className={styles.reportActions}>
                      <button 
                        className={styles.exportButton}
                        onClick={() => handleExportReport(report.id, 'csv')}
                      >
                        Export CSV
                      </button>
                      <button 
                        className={styles.exportButton}
                        onClick={() => handleExportReport(report.id, 'pdf')}
                      >
                        Export PDF
                      </button>
                      <button 
                        className={styles.deleteButton}
                        onClick={() => handleDeleteReport(report.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                
                {reports.length === 0 && (
                  <div className={styles.emptyState}>
                    <h3>No reports generated yet</h3>
                    <p>Create your first report using the templates</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <div className={styles.analyticsTab}>
            {/* Key Metrics */}
            <div className={styles.metricsSection}>
              <h3>Key Performance Metrics</h3>
              <div className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                  <div className={styles.metricValue}>{mockAnalyticsData.overallMetrics.totalTickets}</div>
                  <div className={styles.metricLabel}>Total Tickets</div>
                  <div className={styles.metricTrend}>+12% from last month</div>
                </div>
                <div className={styles.metricCard}>
                  <div className={styles.metricValue}>{mockAnalyticsData.overallMetrics.resolvedTickets}</div>
                  <div className={styles.metricLabel}>Resolved Tickets</div>
                  <div className={styles.metricTrend}>+8% from last month</div>
                </div>
                <div className={styles.metricCard}>
                  <div className={styles.metricValue}>{mockAnalyticsData.overallMetrics.avgResolutionTime}h</div>
                  <div className={styles.metricLabel}>Avg Resolution Time</div>
                  <div className={styles.metricTrend}>-15% from last month</div>
                </div>
                <div className={styles.metricCard}>
                  <div className={styles.metricValue}>{mockAnalyticsData.overallMetrics.slaCompliance}%</div>
                  <div className={styles.metricLabel}>SLA Compliance</div>
                  <div className={styles.metricTrend}>+2% from last month</div>
                </div>
                <div className={styles.metricCard}>
                  <div className={styles.metricValue}>{mockAnalyticsData.overallMetrics.customerSatisfaction}/5</div>
                  <div className={styles.metricLabel}>Customer Satisfaction</div>
                  <div className={styles.metricTrend}>+0.2 from last month</div>
                </div>
              </div>
            </div>
            
            {/* Trend Charts */}
            <div className={styles.chartsSection}>
              <div className={styles.chartCard}>
                <h4>Monthly Ticket Trends</h4>
                <div className={styles.chartPlaceholder}>
                  <div className={styles.chartBars}>
                    {mockAnalyticsData.trendData.map((data, index) => (
                      <div key={index} className={styles.chartBar}>
                        <div 
                          className={styles.bar}
                          style={{ height: `${(data.tickets / 250) * 100}%` }}
                        ></div>
                        <span className={styles.barLabel}>{data.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className={styles.chartCard}>
                <h4>Team Performance Comparison</h4>
                <div className={styles.teamPerformanceChart}>
                  {mockAnalyticsData.teamPerformance.map((team, index) => (
                    <div key={index} className={styles.teamPerformanceItem}>
                      <div className={styles.teamName}>{team.team}</div>
                      <div className={styles.performanceBar}>
                        <div 
                          className={styles.performanceFill}
                          style={{ width: `${team.compliance}%` }}
                        ></div>
                        <span className={styles.performanceValue}>{team.compliance}%</span>
                      </div>
                      <div className={styles.ticketCount}>{team.tickets} tickets</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'templates' && (
          <div className={styles.templatesTab}>
            <div className={styles.templatesGrid}>
              {templates.map(template => (
                <div key={template.id} className={styles.templateCard}>
                  <div className={styles.templateHeader}>
                    <div className={styles.templateIcon}>
                      {getReportTypeIcon(template.type)}
                    </div>
                    <div className={styles.templateInfo}>
                      <h4>{template.name}</h4>
                      <p>{template.description}</p>
                    </div>
                  </div>
                  
                  <div className={styles.templateDetails}>
                    <div className={styles.templateParams}>
                      <strong>Parameters:</strong>
                      <div className={styles.paramsList}>
                        {template.parameters.map((param, index) => (
                          <span key={index} className={styles.param}>{param}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.templateActions}>
                    <button 
                      className={styles.generateTemplateButton}
                      onClick={() => openGenerateModal(template)}
                    >
                      Generate Report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className={styles.modalOverlay} onClick={() => setShowGenerateModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Generate Report</h3>
              <button 
                className={styles.closeModal}
                onClick={() => setShowGenerateModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className={styles.modalContent}>
              {selectedTemplate ? (
                <div>
                  <div className={styles.templateSelection}>
                    <h4>{selectedTemplate.name}</h4>
                    <p>{selectedTemplate.description}</p>
                  </div>
                  
                  <div className={styles.reportParametersForm}>
                    <div className={styles.formGroup}>
                      <label>Report Period</label>
                      <select 
                        value={reportParams.period || ''}
                        onChange={(e) => setReportParams({...reportParams, period: e.target.value})}
                      >
                        <option value="Current Month">Current Month</option>
                        <option value="Last Month">Last Month</option>
                        <option value="Current Quarter">Current Quarter</option>
                        <option value="Last Quarter">Last Quarter</option>
                        <option value="Current Year">Current Year</option>
                      </select>
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label>Output Format</label>
                      <select 
                        value={reportParams.format || 'json'}
                        onChange={(e) => setReportParams({...reportParams, format: e.target.value})}
                      >
                        <option value="json">JSON</option>
                        <option value="csv">CSV</option>
                        <option value="pdf">PDF</option>
                      </select>
                    </div>
                    
                    {selectedTemplate.parameters.includes('teamFilter') && (
                      <div className={styles.formGroup}>
                        <label>Team Filter (Optional)</label>
                        <input 
                          type="text"
                          placeholder="Enter team name"
                          value={reportParams.teamFilter || ''}
                          onChange={(e) => setReportParams({...reportParams, teamFilter: e.target.value})}
                        />
                      </div>
                    )}
                    
                    {selectedTemplate.parameters.includes('countryFilter') && (
                      <div className={styles.formGroup}>
                        <label>Country Filter (Optional)</label>
                        <select 
                          value={reportParams.countryFilter || ''}
                          onChange={(e) => setReportParams({...reportParams, countryFilter: e.target.value})}
                        >
                          <option value="">All Countries</option>
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="UK">United Kingdom</option>
                          <option value="AU">Australia</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className={styles.templatesList}>
                  <h4>Select a Report Template</h4>
                  {templates.map(template => (
                    <div 
                      key={template.id} 
                      className={styles.templateOption}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <span className={styles.templateIcon}>
                        {getReportTypeIcon(template.type)}
                      </span>
                      <span className={styles.templateName}>{template.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className={styles.modalActions}>
              <button 
                className={styles.cancelButton}
                onClick={() => setShowGenerateModal(false)}
                disabled={generatingReport}
              >
                Cancel
              </button>
              <button 
                className={styles.generateButton}
                onClick={handleGenerateReport}
                disabled={generatingReport || !selectedTemplate}
              >
                {generatingReport ? 'Generating...' : 'Generate Report'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportingAnalyticsPanel;