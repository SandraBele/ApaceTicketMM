'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';

interface ReportData {
  id: string;
  name: string;
  type: string;
  period: string;
  data: any;
  createdAt: string;
}

interface ReportExportProps {
  report: ReportData;
  onExport: (format: 'csv' | 'pdf' | 'json') => void;
}

export default function ReportExport({ report, onExport }: ReportExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleExport = async (format: 'csv' | 'pdf' | 'json') => {
    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, this would call the backend API
      // to generate and download the report in the specified format
      
      if (format === 'csv') {
        downloadCSV(report);
      } else if (format === 'json') {
        downloadJSON(report);
      } else if (format === 'pdf') {
        // PDF generation would require a backend service
        console.log('PDF generation would be handled by backend');
      }
      
      onExport(format);
    } finally {
      setIsExporting(false);
      setShowDropdown(false);
    }
  };

  const downloadCSV = (report: ReportData) => {
    let csvContent = '';
    
    // Convert report data to CSV format based on type
    switch (report.type) {
      case 'team':
        csvContent = convertTeamDataToCSV(report.data);
        break;
      case 'user':
        csvContent = convertUserDataToCSV(report.data);
        break;
      case 'financial':
        csvContent = convertFinancialDataToCSV(report.data);
        break;
      default:
        csvContent = 'Report Type,Period,Generated Date\n';
        csvContent += `${report.type},${report.period},${report.createdAt}\n`;
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${report.name.replace(/\s+/g, '_')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const downloadJSON = (report: ReportData) => {
    const jsonContent = JSON.stringify(report, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${report.name.replace(/\s+/g, '_')}.json`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const convertTeamDataToCSV = (data: any) => {
    if (!data.teams) return 'No team data available';
    
    let csv = 'Team Name,Tickets Resolved,Average Response Time (hours),SLA Compliance (%)\n';
    data.teams.forEach((team: any) => {
      csv += `"${team.name}",${team.ticketsResolved},${team.avgResponseTime},${team.slaCompliance}\n`;
    });
    
    csv += '\n';
    csv += `Total Tickets,${data.totalTickets}\n`;
    csv += `Average Satisfaction,${data.avgSatisfaction}\n`;
    
    return csv;
  };

  const convertUserDataToCSV = (data: any) => {
    if (!data.users) return 'No user data available';
    
    let csv = 'User Name,Tickets Resolved,Average Rating,Response Time (hours)\n';
    data.users.forEach((user: any) => {
      csv += `"${user.name}",${user.ticketsResolved},${user.avgRating},${user.responseTime}\n`;
    });
    
    csv += '\n';
    csv += `Top Performer,"${data.topPerformer}"\n`;
    csv += `Average Productivity,${data.avgProductivity}%\n`;
    
    return csv;
  };

  const convertFinancialDataToCSV = (data: any) => {
    let csv = 'Financial Summary\n';
    csv += `Total Revenue,${data.revenue}\n`;
    csv += `Total Expenses,${data.expenses}\n`;
    csv += `Net Profit,${data.profit}\n\n`;
    
    if (data.monthlyBreakdown) {
      csv += 'Month,Revenue,Expenses,Profit\n';
      data.monthlyBreakdown.forEach((month: any) => {
        csv += `${month.month},${month.revenue},${month.expenses},${month.revenue - month.expenses}\n`;
      });
    }
    
    return csv;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={isExporting}
        className="flex items-center gap-1 px-3 py-1 text-sm bg-green-100 text-green-800 border border-green-200 rounded-md hover:bg-green-200 transition-colors disabled:opacity-50"
      >
        <Download className="h-4 w-4" />
        {isExporting ? 'Exporting...' : 'Export'}
      </button>
      
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
          <div className="py-1">
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <Download className="h-4 w-4" />
              Export as CSV
            </button>
            <button
              onClick={() => handleExport('json')}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <Download className="h-4 w-4" />
              Export as JSON
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <Download className="h-4 w-4" />
              Export as PDF
            </button>
          </div>
        </div>
      )}
      
      {showDropdown && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}