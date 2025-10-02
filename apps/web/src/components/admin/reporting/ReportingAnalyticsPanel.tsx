'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Download, Filter, Calendar, TrendingUp, Users, Ticket, DollarSign } from 'lucide-react';
import ReportChart from './ReportChart';
import ReportFilters from './ReportFilters';
import ReportExport from './ReportExport';

interface ReportData {
  id: string;
  name: string;
  type: 'user' | 'team' | 'ticket' | 'financial';
  period: string;
  data: any;
  createdAt: string;
}

interface ReportFilters {
  dateRange: {
    start: string;
    end: string;
  };
  reportType: string[];
  teams: string[];
  users: string[];
}

export default function ReportingAnalyticsPanel() {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [filters, setFilters] = useState<ReportFilters>({
    dateRange: {
      start: '',
      end: ''
    },
    reportType: [],
    teams: [],
    users: []
  });
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockReports: ReportData[] = [
      {
        id: '1',
        name: 'Monthly Team Performance - November 2024',
        type: 'team',
        period: '2024-11',
        data: {
          teams: [
            { name: 'Technical Support', ticketsResolved: 156, avgResponseTime: 1.8, slaCompliance: 94 },
            { name: 'Business Development', ticketsResolved: 89, avgResponseTime: 3.2, slaCompliance: 88 },
            { name: 'Product Development', ticketsResolved: 203, avgResponseTime: 0.9, slaCompliance: 98 }
          ],
          totalTickets: 448,
          avgSatisfaction: 4.2
        },
        createdAt: '2024-12-01T09:00:00Z'
      },
      {
        id: '2',
        name: 'User Performance Analysis - Q4 2024',
        type: 'user',
        period: '2024-Q4',
        data: {
          users: [
            { name: 'John Doe', ticketsResolved: 67, avgRating: 4.5, responseTime: 1.2 },
            { name: 'Jane Smith', ticketsResolved: 45, avgRating: 4.3, responseTime: 2.8 },
            { name: 'Bob Wilson', ticketsResolved: 89, avgRating: 4.7, responseTime: 0.8 }
          ],
          topPerformer: 'Bob Wilson',
          avgProductivity: 85
        },
        createdAt: '2024-11-30T16:30:00Z'
      },
      {
        id: '3',
        name: 'Financial Overview - 2024',
        type: 'financial',
        period: '2024',
        data: {
          revenue: 1250000,
          expenses: 890000,
          profit: 360000,
          monthlyBreakdown: [
            { month: 'Jan', revenue: 98000, expenses: 72000 },
            { month: 'Feb', revenue: 105000, expenses: 74000 },
            { month: 'Mar', revenue: 112000, expenses: 76000 },
            { month: 'Apr', revenue: 108000, expenses: 75000 },
            { month: 'May', revenue: 115000, expenses: 78000 },
            { month: 'Jun', revenue: 118000, expenses: 79000 }
          ]
        },
        createdAt: '2024-11-28T14:15:00Z'
      }
    ];

    setTimeout(() => {
      setReports(mockReports);
      setLoading(false);
    }, 500);
  }, []);

  const handleGenerateReport = async (reportConfig: any) => {
    setIsGenerating(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newReport: ReportData = {
        id: (reports.length + 1).toString(),
        name: `${reportConfig.name} - ${new Date().toLocaleDateString()}`,
        type: reportConfig.type,
        period: reportConfig.period,
        data: {
          // Mock generated data
          summary: 'Generated report data',
          metrics: {
            total: Math.floor(Math.random() * 1000),
            average: Math.floor(Math.random() * 100),
            performance: Math.floor(Math.random() * 100)
          }
        },
        createdAt: new Date().toISOString()
      };
      
      setReports([newReport, ...reports]);
    } finally {
      setIsGenerating(false);
    }
  };

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'user': return <Users className="h-4 w-4" />;
      case 'team': return <Users className="h-4 w-4" />;
      case 'ticket': return <Ticket className="h-4 w-4" />;
      case 'financial': return <DollarSign className="h-4 w-4" />;
      default: return <BarChart3 className="h-4 w-4" />;
    }
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'user': return 'bg-blue-100 text-blue-800';
      case 'team': return 'bg-green-100 text-green-800';
      case 'ticket': return 'bg-purple-100 text-purple-800';
      case 'financial': return 'bg-yellow-100 text-yellow-800';
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Reporting & Analytics</h2>
          <p className="text-gray-600 mb-4">
            Generate comprehensive reports, analyze performance metrics, and export data for stakeholders.
          </p>
        </div>
        <button
          onClick={() => handleGenerateReport({
            name: 'Custom Report',
            type: 'team',
            period: new Date().toISOString().slice(0, 7)
          })}
          disabled={isGenerating}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
        >
          <BarChart3 className="h-4 w-4" />
          {isGenerating ? 'Generating...' : 'Generate Report'}
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter(r => new Date(r.createdAt).getMonth() === new Date().getMonth()).length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Generation Time</p>
              <p className="text-2xl font-bold text-gray-900">2.3s</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Export Rate</p>
              <p className="text-2xl font-bold text-gray-900">87%</p>
            </div>
            <Download className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Report Generation Panel */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate New Report</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => handleGenerateReport({
              name: 'User Performance Report',
              type: 'user',
              period: new Date().toISOString().slice(0, 7)
            })}
            disabled={isGenerating}
            className="flex items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors disabled:opacity-50"
          >
            <Users className="h-5 w-5 text-blue-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">User Performance</div>
              <div className="text-sm text-gray-500">Individual metrics & rankings</div>
            </div>
          </button>
          
          <button
            onClick={() => handleGenerateReport({
              name: 'Team Analysis Report',
              type: 'team',
              period: new Date().toISOString().slice(0, 7)
            })}
            disabled={isGenerating}
            className="flex items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors disabled:opacity-50"
          >
            <Users className="h-5 w-5 text-green-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Team Analysis</div>
              <div className="text-sm text-gray-500">Team performance & KPIs</div>
            </div>
          </button>
          
          <button
            onClick={() => handleGenerateReport({
              name: 'Ticket Overview Report',
              type: 'ticket',
              period: new Date().toISOString().slice(0, 7)
            })}
            disabled={isGenerating}
            className="flex items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors disabled:opacity-50"
          >
            <Ticket className="h-5 w-5 text-purple-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Ticket Overview</div>
              <div className="text-sm text-gray-500">Support ticket analytics</div>
            </div>
          </button>
          
          <button
            onClick={() => handleGenerateReport({
              name: 'Financial Summary Report',
              type: 'financial',
              period: new Date().toISOString().slice(0, 7)
            })}
            disabled={isGenerating}
            className="flex items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-yellow-50 hover:border-yellow-300 transition-colors disabled:opacity-50"
          >
            <DollarSign className="h-5 w-5 text-yellow-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Financial Summary</div>
              <div className="text-sm text-gray-500">Revenue & expense analysis</div>
            </div>
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Generated Reports</h3>
          <p className="text-sm text-gray-600 mt-1">View and export your generated reports</p>
        </div>
        <div className="divide-y divide-gray-200">
          {reports.map((report) => (
            <div key={report.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getReportTypeColor(report.type)}`}>
                    {getReportTypeIcon(report.type)}
                    {report.type}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{report.name}</h4>
                    <p className="text-sm text-gray-500">Period: {report.period} • Generated {new Date(report.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <BarChart3 className="h-4 w-4" />
                    View
                  </button>
                  <ReportExport 
                    report={report}
                    onExport={(format) => {
                      console.log(`Exporting ${report.name} as ${format}`);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {reports.length === 0 && (
          <div className="text-center py-12">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No reports generated</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by generating your first report.</p>
          </div>
        )}
      </div>

      {/* Report Details Modal */}
      {selectedReport && (
        <ReportChart
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
}