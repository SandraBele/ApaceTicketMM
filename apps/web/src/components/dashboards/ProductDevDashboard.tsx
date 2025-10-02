import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import styles from '../../styles/Dashboard.module.css';

const ProductDevDashboard: React.FC = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get('/api/tickets');
        const rdTickets = response.data.filter(
          (ticket: any) => 
            ticket.category === 'Feature Request' || 
            ticket.category === 'Product Development' ||
            ticket.assignedToId === user?.id
        );
        setTickets(rdTickets);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user]);

  if (loading) {
    return <div className={styles.loading}>Loading R&D dashboard...</div>;
  }

  const inProgressTickets = tickets.filter(t => t.status === 'in_progress');
  const openTickets = tickets.filter(t => t.status === 'open');
  const resolvedTickets = tickets.filter(t => t.status === 'resolved');

  return (
    <div className={styles.dashboardContent}>
      <h1 className={styles.dashboardTitle}>Product Development Dashboard</h1>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Total R&D Tickets</h3>
          <p className={styles.statNumber}>{tickets.length}</p>
        </div>
        <div className={styles.statCard}>
          <h3>In Progress</h3>
          <p className={styles.statNumber}>{inProgressTickets.length}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Open</h3>
          <p className={styles.statNumber}>{openTickets.length}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Completed</h3>
          <p className={styles.statNumber}>{resolvedTickets.length}</p>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Feature Requests & Product Development</h2>
        <div className={styles.ticketGrid}>
          {tickets.map((ticket) => {
            const getSlaColor = (status: string) => {
              switch (status) {
                case 'GREEN': return '#10b981';
                case 'YELLOW': return '#f59e0b';
                case 'RED': return '#ef4444';
                default: return '#6b7280';
              }
            };

            return (
              <div key={ticket.id} className={styles.ticketCard}>
                <div 
                  className={styles.slaIndicator}
                  style={{ backgroundColor: getSlaColor(ticket.slaStatus) }}
                />
                <h3>{ticket.title}</h3>
                <p>{ticket.description}</p>
                <div className={styles.ticketMeta}>
                  <span className={styles.badge}>{ticket.status}</span>
                  <span className={styles.badge}>{ticket.priority}</span>
                  {ticket.category && (
                    <span className={styles.badge}>{ticket.category}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.section}>
        <h2>Customizable R&D Sections</h2>
        <div className={styles.customSections}>
          <div className={styles.customSection}>
            <h3>🚀 Current Sprint</h3>
            <p>Track active development tasks and feature implementations</p>
            <div className={styles.sectionCount}>{inProgressTickets.length} items</div>
          </div>
          <div className={styles.customSection}>
            <h3>💡 Feature Backlog</h3>
            <p>Prioritized list of upcoming features and improvements</p>
            <div className={styles.sectionCount}>{openTickets.length} items</div>
          </div>
          <div className={styles.customSection}>
            <h3>✅ Completed Features</h3>
            <p>Successfully delivered features and resolved items</p>
            <div className={styles.sectionCount}>{resolvedTickets.length} items</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDevDashboard;
