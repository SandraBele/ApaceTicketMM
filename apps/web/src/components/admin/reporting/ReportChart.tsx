'use client';

import { useState } from 'react';
import { X, BarChart3, TrendingUp, PieChart, Users } from 'lucide-react';

interface ReportData {
  id: string;
  name: string;
  type: 'user' | 'team' | 'ticket' | 'financial';
  period: string;
  data: any;
  createdAt: string;
}

interface ReportChartProps {
  report: ReportData;
  onClose: () => void;
}

export default function ReportChart({ report, onClose }: ReportChartProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'trends'>('overview');

  const renderChart = () => {
    switch (report.type) {
      case 'team':
        return renderTeamChart();
      case 'user':
        return renderUserChart();
      case 'financial':
        return renderFinancialChart();
      default:
        return renderDefaultChart();
    }
  };

  const renderTeamChart = () => {
    if (!report.data.teams) return null;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-900">{report.data.totalTickets}</div>
            <div className="text-sm text-blue-700">Total Tickets Processed</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-900">{report.data.avgSatisfaction}</div>
            <div className="text-sm text-green-700">Average Satisfaction</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-900">{report.data.teams.length}</div>
            <div className="text-sm text-purple-700">Active Teams</div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-4">Team Performance Breakdown</h4>
          <div className="space-y-3">
            {report.data.teams.map((team: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">{team.name}</div>
                    <div className="text-sm text-gray-500">{team.ticketsResolved} tickets resolved</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{team.avgResponseTime}h avg response</div>
                  <div className="text-sm text-gray-500">{team.slaCompliance}% SLA compliance</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderUserChart = () => {
    if (!report.data.users) return null;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-900">{report.data.topPerformer}</div>
            <div className="text-sm text-blue-700">Top Performer</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-900">{report.data.avgProductivity}%</div>
            <div className="text-sm text-green-700">Average Productivity</div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-4">Individual Performance</h4>
          <div className="space-y-3">
            {report.data.users.map((user: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <Users className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.ticketsResolved} tickets resolved</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">⭐ {user.avgRating}</div>
                  <div className="text-sm text-gray-500">{user.responseTime}h response</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderFinancialChart = () => {
    if (!report.data.monthlyBreakdown) return null;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-900">${(report.data.revenue / 1000).toFixed(0)}K</div>
            <div className="text-sm text-green-700">Total Revenue</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-900">${(report.data.expenses / 1000).toFixed(0)}K</div>
            <div className="text-sm text-red-700">Total Expenses</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-900">${(report.data.profit / 1000).toFixed(0)}K</div>
            <div className="text-sm text-blue-700">Net Profit</div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-4">Monthly Breakdown</h4>
          <div className="space-y-3">
            {report.data.monthlyBreakdown.map((month: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                <div className="font-medium text-gray-900">{month.month}</div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">${(month.revenue / 1000).toFixed(0)}K</div>
                    <div className="text-xs text-gray-500">Revenue</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-red-600">${(month.expenses / 1000).toFixed(0)}K</div>
                    <div className="text-xs text-gray-500">Expenses</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-blue-600">${((month.revenue - month.expenses) / 1000).toFixed(0)}K</div>
                    <div className="text-xs text-gray-500">Profit</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderDefaultChart = () => {
    return (
      <div className="text-center py-12">
        <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Chart Preview</h3>
        <p className="mt-1 text-sm text-gray-500">Report data visualization would appear here.</p>
      </div>
    );
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'details', label: 'Details', icon: PieChart },
    { id: 'trends', label: 'Trends', icon: TrendingUp }
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-6xl shadow-lg rounded-md bg-white mb-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{report.name}</h3>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span>Period: {report.period}</span>
              <span>•</span>
              <span>Generated {new Date(report.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span className="capitalize">{report.type} Report</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 text-sm font-medium transition-colors ${
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

        {/* Content */}
        <div className="max-h-96 overflow-y-auto">
          {activeTab === 'overview' && renderChart()}
          {activeTab === 'details' && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Raw Data</h4>
              <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
                {JSON.stringify(report.data, null, 2)}
              </pre>
            </div>
          )}
          {activeTab === 'trends' && (
            <div className="text-center py-12">
              <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Trend Analysis</h3>
              <p className="mt-1 text-sm text-gray-500">Historical trend analysis would appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}