'use client';

import { useState, useEffect } from 'react';
import { X, Target, Clock, TrendingUp, AlertCircle } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  kpiTargets: {
    ticketsPerMonth: number;
    responseTimeHours: number;
    resolutionRate: number;
  };
  timezone: string;
  workingHours: {
    start: string;
    end: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface KPIConfigurationProps {
  team: Team;
  onSave: (kpiData: Team['kpiTargets']) => void;
  onCancel: () => void;
}

export default function KPIConfiguration({ team, onSave, onCancel }: KPIConfigurationProps) {
  const [kpiData, setKpiData] = useState({
    ticketsPerMonth: team.kpiTargets.ticketsPerMonth,
    responseTimeHours: team.kpiTargets.responseTimeHours,
    resolutionRate: team.kpiTargets.resolutionRate
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Sample current performance data for comparison
  const [currentPerformance] = useState({
    ticketsPerMonth: Math.floor(team.kpiTargets.ticketsPerMonth * 0.85), // 85% of target
    responseTimeHours: team.kpiTargets.responseTimeHours * 1.2, // 20% slower than target
    resolutionRate: team.kpiTargets.resolutionRate - 3 // 3% below target
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (kpiData.ticketsPerMonth < 1) {
      newErrors.ticketsPerMonth = 'Tickets per month must be at least 1';
    } else if (kpiData.ticketsPerMonth > 1000) {
      newErrors.ticketsPerMonth = 'Tickets per month cannot exceed 1000';
    }

    if (kpiData.responseTimeHours < 0.1) {
      newErrors.responseTimeHours = 'Response time must be at least 0.1 hours';
    } else if (kpiData.responseTimeHours > 72) {
      newErrors.responseTimeHours = 'Response time cannot exceed 72 hours';
    }

    if (kpiData.resolutionRate < 1 || kpiData.resolutionRate > 100) {
      newErrors.resolutionRate = 'Resolution rate must be between 1 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await onSave(kpiData);
    } catch (error) {
      setErrors({ submit: 'Failed to save KPI configuration. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceColor = (current: number, target: number, isLowerBetter = false) => {
    const ratio = isLowerBetter ? target / current : current / target;
    if (ratio >= 0.95) return 'text-green-600';
    if (ratio >= 0.85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceIcon = (current: number, target: number, isLowerBetter = false) => {
    const ratio = isLowerBetter ? target / current : current / target;
    if (ratio >= 0.95) return <TrendingUp className="h-4 w-4 text-green-600" />;
    return <AlertCircle className="h-4 w-4 text-red-600" />;
  };

  const formatHours = (hours: number) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)} min`;
    } else if (hours === 1) {
      return '1 hour';
    } else {
      return `${hours} hours`;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Configure KPI Targets
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Set performance targets for {team.name}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* KPI Configuration Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Performance Targets
                </h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Ticket Target
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={kpiData.ticketsPerMonth}
                      onChange={(e) => setKpiData({ 
                        ...kpiData, 
                        ticketsPerMonth: parseInt(e.target.value) || 0
                      })}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                        errors.ticketsPerMonth ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Number of tickets per month"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-sm">tickets/month</span>
                    </div>
                  </div>
                  {errors.ticketsPerMonth && <p className="mt-1 text-sm text-red-600">{errors.ticketsPerMonth}</p>}
                  <p className="mt-1 text-xs text-gray-500">
                    Target number of tickets to be processed by this team each month
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Response Time Target
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0.1"
                      max="72"
                      step="0.1"
                      value={kpiData.responseTimeHours}
                      onChange={(e) => setKpiData({ 
                        ...kpiData, 
                        responseTimeHours: parseFloat(e.target.value) || 0
                      })}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                        errors.responseTimeHours ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Hours"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-sm">hours</span>
                    </div>
                  </div>
                  {errors.responseTimeHours && <p className="mt-1 text-sm text-red-600">{errors.responseTimeHours}</p>}
                  <p className="mt-1 text-xs text-gray-500">
                    Maximum time allowed for initial response to new tickets
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resolution Rate Target
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={kpiData.resolutionRate}
                      onChange={(e) => setKpiData({ 
                        ...kpiData, 
                        resolutionRate: parseInt(e.target.value) || 0
                      })}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                        errors.resolutionRate ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Percentage"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-sm">%</span>
                    </div>
                  </div>
                  {errors.resolutionRate && <p className="mt-1 text-sm text-red-600">{errors.resolutionRate}</p>}
                  <p className="mt-1 text-xs text-gray-500">
                    Percentage of tickets that should be resolved successfully
                  </p>
                </div>
              </div>

              {/* Error Message */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {errors.submit}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md text-sm font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save KPI Targets'}
                </button>
              </div>
            </form>
          </div>

          {/* Current Performance Overview */}
          <div className="space-y-6">
            <h4 className="text-md font-medium text-gray-900 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Current Performance
            </h4>
            
            <div className="space-y-4">
              {/* Monthly Tickets */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Monthly Tickets</span>
                  {getPerformanceIcon(currentPerformance.ticketsPerMonth, kpiData.ticketsPerMonth)}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {currentPerformance.ticketsPerMonth}
                    </p>
                    <p className="text-sm text-gray-500">Current (This Month)</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-600">
                      {kpiData.ticketsPerMonth}
                    </p>
                    <p className="text-sm text-gray-500">Target</p>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min((currentPerformance.ticketsPerMonth / kpiData.ticketsPerMonth) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                  <p className={`text-sm mt-1 ${getPerformanceColor(currentPerformance.ticketsPerMonth, kpiData.ticketsPerMonth)}`}>
                    {Math.round((currentPerformance.ticketsPerMonth / kpiData.ticketsPerMonth) * 100)}% of target
                  </p>
                </div>
              </div>

              {/* Response Time */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Response Time</span>
                  {getPerformanceIcon(currentPerformance.responseTimeHours, kpiData.responseTimeHours, true)}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatHours(currentPerformance.responseTimeHours)}
                    </p>
                    <p className="text-sm text-gray-500">Current Average</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-600">
                      {formatHours(kpiData.responseTimeHours)}
                    </p>
                    <p className="text-sm text-gray-500">Target</p>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        currentPerformance.responseTimeHours <= kpiData.responseTimeHours
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                          : 'bg-gradient-to-r from-red-500 to-pink-500'
                      }`}
                      style={{ 
                        width: currentPerformance.responseTimeHours <= kpiData.responseTimeHours 
                          ? '100%' 
                          : `${Math.min((kpiData.responseTimeHours / currentPerformance.responseTimeHours) * 100, 100)}%`
                      }}
                    ></div>
                  </div>
                  <p className={`text-sm mt-1 ${getPerformanceColor(currentPerformance.responseTimeHours, kpiData.responseTimeHours, true)}`}>
                    {currentPerformance.responseTimeHours <= kpiData.responseTimeHours ? 'Meeting target' : 'Above target'}
                  </p>
                </div>
              </div>

              {/* Resolution Rate */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Resolution Rate</span>
                  {getPerformanceIcon(currentPerformance.resolutionRate, kpiData.resolutionRate)}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {currentPerformance.resolutionRate}%
                    </p>
                    <p className="text-sm text-gray-500">Current Rate</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-600">
                      {kpiData.resolutionRate}%
                    </p>
                    <p className="text-sm text-gray-500">Target</p>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        currentPerformance.resolutionRate >= kpiData.resolutionRate
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                          : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                      }`}
                      style={{ 
                        width: `${Math.min((currentPerformance.resolutionRate / kpiData.resolutionRate) * 100, 100)}%`
                      }}
                    ></div>
                  </div>
                  <p className={`text-sm mt-1 ${getPerformanceColor(currentPerformance.resolutionRate, kpiData.resolutionRate)}`}>
                    {Math.round((currentPerformance.resolutionRate / kpiData.resolutionRate) * 100)}% of target
                  </p>
                </div>
              </div>
            </div>

            {/* KPI Impact Analysis */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="text-sm font-medium text-blue-900 mb-2">Impact Analysis</h5>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Setting realistic targets improves team motivation</li>
                <li>• Response time directly affects customer satisfaction</li>
                <li>• Higher resolution rates reduce repeat tickets</li>
                <li>• Monthly targets should align with team capacity</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}