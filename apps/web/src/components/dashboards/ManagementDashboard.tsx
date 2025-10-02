import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../../styles/Dashboard.module.css';

const ManagementDashboard: React.FC = () => {
  const [kpis, setKpis] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kpisRes, ticketsRes, opportunitiesRes] = await Promise.all([
          axios.get('/api/kpis'),
          axios.get('/api/tickets'),
          axios.get('/api/opportunities'),
        ]);

        setKpis(kpisRes.data);
        setTickets(ticketsRes.data);
        setOpportunities(opportunitiesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading dashboard...</div>;
  }

  const urgentTickets = tickets.filter(t => t.slaStatus === 'RED');
  const totalTicketsResolved = kpis.reduce((sum, kpi) => sum + kpi.ticketsResolved, 0);
  const totalOpportunityValue = opportunities.reduce((sum, opp) => sum + opp.estimatedValue, 0);
  const avgResolutionTime = kpis.length > 0 
    ? (kpis.reduce((sum, kpi) => sum + kpi.avgResolutionTimeHours, 0) / kpis.length).toFixed(1)
    : '0';

  const kpisByCountry = kpis.reduce((acc: any, kpi) => {
    const country = kpi.user?.country || 'Unknown';
    if (!acc[country]) {
      acc[country] = { ticketsResolved: 0, opportunitiesCreated: 0 };
    }
    acc[country].ticketsResolved += kpi.ticketsResolved;
    acc[country].opportunitiesCreated += kpi.opportunitiesCreated;
    return acc;
  }, {});

  return (
    <div className={styles.dashboardContent}>
      <h1 className={styles.dashboardTitle}>Management Dashboard</h1>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Tickets Resolved (Month)</h3>
          <p className={styles.statNumber}>{totalTicketsResolved}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Avg Resolution Time</h3>
          <p className={styles.statNumber}>{avgResolutionTime}h</p>
        </div>
        <div className={styles.statCard}>
          <h3>Urgent Tickets (SLA Breach)</h3>
          <p className={styles.statNumber}>{urgentTickets.length}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Total Pipeline Value</h3>
          <p className={styles.statNumber}>${totalOpportunityValue.toLocaleString()}</p>
        </div>
      </div>

      <div className={styles.section}>
        <h2>KPIs by Team Member</h2>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Team Member</th>
                <th>Country</th>
                <th>Tickets Resolved</th>
                <th>Tickets Created</th>
                <th>Avg Resolution Time</th>
                <th>Opportunities</th>
              </tr>
            </thead>
            <tbody>
              {kpis.map((kpi) => (
                <tr key={kpi.id}>
                  <td>{kpi.user?.firstName} {kpi.user?.lastName}</td>
                  <td>{kpi.user?.country || 'N/A'}</td>
                  <td>{kpi.ticketsResolved}</td>
                  <td>{kpi.ticketsCreated}</td>
                  <td>{kpi.avgResolutionTimeHours.toFixed(1)}h</td>
                  <td>{kpi.opportunitiesCreated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Performance by Country</h2>
        <div className={styles.countryGrid}>
          {Object.entries(kpisByCountry).map(([country, data]: [string, any]) => (
            <div key={country} className={styles.countryCard}>
              <h3>{country}</h3>
              <p>Tickets Resolved: <strong>{data.ticketsResolved}</strong></p>
              <p>Opportunities: <strong>{data.opportunitiesCreated}</strong></p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2>Urgent Issues Flagged</h2>
        <div className={styles.ticketGrid}>
          {urgentTickets.slice(0, 6).map((ticket) => (
            <div key={ticket.id} className={styles.ticketCard}>
              <div className={styles.slaIndicator} style={{ backgroundColor: '#ef4444' }} />
              <h3>{ticket.title}</h3>
              <p>{ticket.description}</p>
              <div className={styles.ticketMeta}>
                <span className={styles.badge}>{ticket.status}</span>
                <span className={styles.badge}>{ticket.priority}</span>
                <span className={styles.badge} style={{ backgroundColor: '#ef4444' }}>
                  SLA BREACHED
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManagementDashboard;
