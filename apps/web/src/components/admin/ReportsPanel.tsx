import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../styles/ReportsPanel.module.css';

interface ReportData {
  totalTickets: number;
  resolvedTickets: number;
  avgResolutionTime: number;
  userPerformance: Array<{
    userId: string;
    name: string;
    ticketsResolved: number;
    avgResolutionTime: number;
  }>;
  teamPerformance: Array<{
    teamId: string;
    teamName: string;
    ticketsResolved: number;
    avgResolutionTime: number;
  }>;
}

const ReportsPanel: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    teamId: '',
    userId: ''
  });
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchTeams();
    fetchUsers();
    generateReport();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await axios.get('/api/teams');
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data.users || response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const generateReport = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });

      // Mock report data for now - in real implementation, this would come from API
      const mockData: ReportData = {
        totalTickets: 150,
        resolvedTickets: 120,
        avgResolutionTime: 4.2,
        userPerformance: [
          { userId: '1', name: 'John Doe', ticketsResolved: 25, avgResolutionTime: 3.8 },
          { userId: '2', name: 'Jane Smith', ticketsResolved: 30, avgResolutionTime: 4.1 },
          { userId: '3', name: 'Bob Johnson', ticketsResolved: 20, avgResolutionTime: 4.5 }
        ],
        teamPerformance: [
          { teamId: '1', teamName: 'Support Team', ticketsResolved: 75, avgResolutionTime: 4.0 },
          { teamId: '2', teamName: 'Technical Team', ticketsResolved: 45, avgResolutionTime: 4.8 }
        ]
      };
      
      setReportData(mockData);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!reportData) return;
    
    const csvContent = [
      ['Report Summary'],
      ['Total Tickets', reportData.totalTickets],
      ['Resolved Tickets', reportData.resolvedTickets],
      ['Avg Resolution Time (hours)', reportData.avgResolutionTime],
      [''],
      ['User Performance'],
      ['Name', 'Tickets Resolved', 'Avg Resolution Time'],
      ...reportData.userPerformance.map(user => [user.name, user.ticketsResolved, user.avgResolutionTime]),
      [''],
      ['Team Performance'],
      ['Team Name', 'Tickets Resolved', 'Avg Resolution Time'],
      ...reportData.teamPerformance.map(team => [team.teamName, team.ticketsResolved, team.avgResolutionTime])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${filters.startDate}-to-${filters.endDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.reportsPanel}>
      <div className={styles.panelHeader}>
        <div className={styles.headerLeft}>
          <h2>Reports & Analytics</h2>
          <p>Generate comprehensive reports and analyze performance metrics</p>
        </div>
        <div className={styles.headerRight}>
          <button 
            className={styles.exportButton}
            onClick={exportToCSV}
            disabled={!reportData}
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Report Filters */}
      <div className={styles.filtersSection}>
        <h3>Report Parameters</h3>
        <div className={styles.filtersGrid}>
          <div className={styles.filterGroup}>
            <label>Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              className={styles.filterInput}
            />
          </div>
          
          <div className={styles.filterGroup}>
            <label>End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              className={styles.filterInput}
            />
          </div>
          
          <div className={styles.filterGroup}>
            <label>Team</label>
            <select
              value={filters.teamId}
              onChange={(e) => setFilters(prev => ({ ...prev, teamId: e.target.value }))}
              className={styles.filterSelect}
            >
              <option value="">All Teams</option>
              {teams.map((team: any) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <label>User</label>
            <select
              value={filters.userId}
              onChange={(e) => setFilters(prev => ({ ...prev, userId: e.target.value }))}
              className={styles.filterSelect}
            >
              <option value="">All Users</option>
              {users.map((user: any) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <button 
          className={styles.generateButton}
          onClick={generateReport}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Report'}
        </button>
      </div>

      {/* Report Results */}
      {reportData && (
        <div className={styles.reportResults}>
          {/* Summary Cards */}
          <div className={styles.summaryCards}>
            <div className={styles.summaryCard}>
              <h4>Total Tickets</h4>
              <div className={styles.summaryNumber}>{reportData.totalTickets}</div>
            </div>
            <div className={styles.summaryCard}>
              <h4>Resolved</h4>
              <div className={styles.summaryNumber}>{reportData.resolvedTickets}</div>
              <div className={styles.summaryPercent}>
                {Math.round((reportData.resolvedTickets / reportData.totalTickets) * 100)}%
              </div>
            </div>
            <div className={styles.summaryCard}>
              <h4>Avg Resolution Time</h4>
              <div className={styles.summaryNumber}>{reportData.avgResolutionTime}h</div>
            </div>
          </div>

          {/* User Performance Table */}
          <div className={styles.tableSection}>
            <h3>User Performance</h3>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Tickets Resolved</th>
                    <th>Avg Resolution Time</th>
                    <th>Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.userPerformance.map(user => (
                    <tr key={user.userId}>
                      <td>{user.name}</td>
                      <td>{user.ticketsResolved}</td>
                      <td>{user.avgResolutionTime}h</td>
                      <td>
                        <div className={styles.performanceBar}>
                          <div 
                            className={styles.performanceFill}
                            style={{ 
                              width: `${Math.min((user.ticketsResolved / 30) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Team Performance Table */}
          <div className={styles.tableSection}>
            <h3>Team Performance</h3>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Team</th>
                    <th>Tickets Resolved</th>
                    <th>Avg Resolution Time</th>
                    <th>Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.teamPerformance.map(team => (
                    <tr key={team.teamId}>
                      <td>{team.teamName}</td>
                      <td>{team.ticketsResolved}</td>
                      <td>{team.avgResolutionTime}h</td>
                      <td>
                        <div className={styles.performanceBar}>
                          <div 
                            className={styles.performanceFill}
                            style={{ 
                              width: `${Math.min((team.ticketsResolved / 80) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPanel;