import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../../styles/Dashboard.module.css';

const BusinessDevDashboard: React.FC = () => {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [opportunitiesRes, invoicesRes] = await Promise.all([
          axios.get('/api/opportunities'),
          axios.get('/api/invoices'),
        ]);

        setOpportunities(opportunitiesRes.data);
        setInvoices(invoicesRes.data);
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

  const totalOpportunityValue = opportunities.reduce((sum, opp) => sum + opp.estimatedValue, 0);
  const wonOpportunities = opportunities.filter(opp => opp.status === 'won');
  const paidInvoices = invoices.filter(inv => inv.status === 'paid');
  const overdueInvoices = invoices.filter(inv => inv.status === 'overdue');

  const getOpportunityStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      lead: '#94a3b8',
      qualified: '#60a5fa',
      proposal: '#f59e0b',
      negotiation: '#a78bfa',
      won: '#10b981',
      lost: '#ef4444',
    };
    return colors[status] || '#6b7280';
  };

  return (
    <div className={styles.dashboardContent}>
      <h1 className={styles.dashboardTitle}>Business Development Dashboard</h1>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Total Opportunities</h3>
          <p className={styles.statNumber}>{opportunities.length}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Pipeline Value</h3>
          <p className={styles.statNumber}>${totalOpportunityValue.toLocaleString()}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Won Deals</h3>
          <p className={styles.statNumber}>{wonOpportunities.length}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Overdue Invoices</h3>
          <p className={styles.statNumber}>{overdueInvoices.length}</p>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Opportunities Pipeline</h2>
        <div className={styles.opportunityGrid}>
          {opportunities.map((opp) => (
            <div key={opp.id} className={styles.opportunityCard}>
              <div 
                className={styles.opportunityStatus}
                style={{ backgroundColor: getOpportunityStatusColor(opp.status) }}
              >
                {opp.status.toUpperCase()}
              </div>
              <h3>{opp.title}</h3>
              <p className={styles.clientInfo}>
                <strong>{opp.clientName}</strong><br />
                {opp.clientEmail}
                {opp.clientPhone && <><br />{opp.clientPhone}</>}
              </p>
              <p className={styles.opportunityValue}>
                ${opp.estimatedValue.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2>Invoices</h2>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Client</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.invoiceNumber}</td>
                  <td>{invoice.clientName}</td>
                  <td>${invoice.amount.toLocaleString()}</td>
                  <td>
                    <span 
                      className={styles.badge}
                      style={{
                        backgroundColor: 
                          invoice.status === 'paid' ? '#10b981' :
                          invoice.status === 'overdue' ? '#ef4444' : '#60a5fa'
                      }}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td>{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BusinessDevDashboard;
