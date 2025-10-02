import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../../styles/Dashboard.module.css';

interface DashboardData {
  tickets: any[];
  users: any[];
  kpis: any[];
  invoices: any[];
  opportunities: any[];
}

const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData>({
    tickets: [],
    users: [],
    kpis: [],
    invoices: [],
    opportunities: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ticketsRes, usersRes, kpisRes, invoicesRes, opportunitiesRes] = await Promise.all([
          axios.get('/api/tickets'),
          axios.get('/api/users'),
          axios.get('/api/kpis'),
          axios.get('/api/invoices'),
          axios.get('/api/opportunities'),
        ]);

        setData({
          tickets: ticketsRes.data,
          users: usersRes.data,
          kpis: kpisRes.data,
          invoices: invoicesRes.data,
          opportunities: opportunitiesRes.data,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading dashboard...</div>;
  }

  const getSlaStatusColor = (status: string) => {
    switch (status) {
      case 'GREEN': return '#10b981';
      case 'YELLOW': return '#f59e0b';
      case 'RED': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className={styles.dashboardContent}>
      <h1 className={styles.dashboardTitle}>Admin Dashboard</h1>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Total Users</h3>
          <p className={styles.statNumber}>{data.users.length}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Total Tickets</h3>
          <p className={styles.statNumber}>{data.tickets.length}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Opportunities</h3>
          <p className={styles.statNumber}>{data.opportunities.length}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Invoices</h3>
          <p className={styles.statNumber}>{data.invoices.length}</p>
        </div>
      </div>

      <div className={styles.section}>
        <h2>All Tickets</h2>
        <div className={styles.ticketGrid}>
          {data.tickets.map((ticket) => (
            <div key={ticket.id} className={styles.ticketCard}>
              <div 
                className={styles.slaIndicator}
                style={{ backgroundColor: getSlaStatusColor(ticket.slaStatus) }}
              />
              <h3>{ticket.title}</h3>
              <p>{ticket.description}</p>
              <div className={styles.ticketMeta}>
                <span className={styles.badge}>{ticket.status}</span>
                <span className={styles.badge}>{ticket.priority}</span>
                <span className={styles.badge} style={{ backgroundColor: getSlaStatusColor(ticket.slaStatus) }}>
                  {ticket.slaStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2>All Users</h2>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Country</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((user) => (
                <tr key={user.id}>
                  <td>{user.firstName} {user.lastName}</td>
                  <td>{user.email}</td>
                  <td><span className={styles.badge}>{user.role}</span></td>
                  <td>{user.country || 'N/A'}</td>
                  <td>
                    <span className={user.isActive ? styles.activeStatus : styles.inactiveStatus}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
