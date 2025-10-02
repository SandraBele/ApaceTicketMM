import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from '../components/dashboards/AdminDashboard';
import TechSupportDashboard from '../components/dashboards/TechSupportDashboard';
import BusinessDevDashboard from '../components/dashboards/BusinessDevDashboard';
import ManagementDashboard from '../components/dashboards/ManagementDashboard';
import ProductDevDashboard from '../components/dashboards/ProductDevDashboard';
import styles from '../styles/Dashboard.module.css';

export default function Dashboard() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'tech_support':
        return <TechSupportDashboard />;
      case 'business_dev':
        return <BusinessDevDashboard />;
      case 'management':
        return <ManagementDashboard />;
      case 'product_dev':
        return <ProductDevDashboard />;
      default:
        return <div className={styles.error}>Invalid role: {user.role}</div>;
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>ApaceTicket</h1>
          <div className={styles.userInfo}>
            <span className={styles.userName}>
              {user.firstName} {user.lastName}
            </span>
            <span className={styles.userRole}>{user.role.replace('_', ' ')}</span>
            <button onClick={logout} className={styles.logoutBtn}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {renderDashboard()}
      </main>
    </div>
  );
}
