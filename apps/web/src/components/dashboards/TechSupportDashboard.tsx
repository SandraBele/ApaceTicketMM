import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import styles from '../../styles/Dashboard.module.css';

const TechSupportDashboard: React.FC = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get('/api/tickets');
        const myTickets = response.data.filter(
          (ticket: any) => ticket.assignedToId === user?.id
        );
        setTickets(myTickets);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user]);

  if (loading) {
    return <div className={styles.loading}>Loading tickets...</div>;
  }

  const getSlaStatusColor = (status: string) => {
    switch (status) {
      case 'GREEN': return '#10b981';
      case 'YELLOW': return '#f59e0b';
      case 'RED': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const urgentTickets = tickets.filter(t => t.slaStatus === 'RED');
  const warningTickets = tickets.filter(t => t.slaStatus === 'YELLOW');
  const normalTickets = tickets.filter(t => t.slaStatus === 'GREEN');

  return (
    <div className={styles.dashboardContent}>
      <h1 className={styles.dashboardTitle}>Tech Support Dashboard</h1>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>My Assigned Tickets</h3>
          <p className={styles.statNumber}>{tickets.length}</p>
        </div>
        <div className={styles.statCard} style={{ borderLeft: '4px solid #ef4444' }}>
          <h3>Urgent (SLA Breached)</h3>
          <p className={styles.statNumber}>{urgentTickets.length}</p>
        </div>
        <div className={styles.statCard} style={{ borderLeft: '4px solid #f59e0b' }}>
          <h3>Warning (75%+ SLA)</h3>
          <p className={styles.statNumber}>{warningTickets.length}</p>
        </div>
        <div className={styles.statCard} style={{ borderLeft: '4px solid #10b981' }}>
          <h3>On Track</h3>
          <p className={styles.statNumber}>{normalTickets.length}</p>
        </div>
      </div>

      <div className={styles.section}>
        <h2>My Assigned Tickets</h2>
        <div className={styles.ticketGrid}>
          {tickets.map((ticket) => (
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
              {ticket.slaTimeRemaining > 0 && (
                <div className={styles.slaTime}>
                  SLA Time Remaining: {Math.floor(ticket.slaTimeRemaining / 60)}h {ticket.slaTimeRemaining % 60}m
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechSupportDashboard;
