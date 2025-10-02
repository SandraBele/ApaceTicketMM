import React from 'react';
import styles from '../../styles/UserFilters.module.css';

interface UserFiltersProps {
  filters: {
    role: string;
    isActive: string;
    isLocked: string;
    country: string;
    search: string;
  };
  onFilterChange: (filters: any) => void;
  onRefresh: () => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({ filters, onFilterChange, onRefresh }) => {
  const handleFilterChange = (key: string, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      role: '',
      isActive: '',
      isLocked: '',
      country: '',
      search: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className={styles.userFilters}>
      <div className={styles.filtersRow}>
        <div className={styles.filterGroup}>
          <label>Role</label>
          <select 
            value={filters.role} 
            onChange={(e) => handleFilterChange('role', e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="tech_support">Tech Support</option>
            <option value="business_dev">Business Dev</option>
            <option value="management">Management</option>
            <option value="product_dev">Product Dev</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Status</label>
          <select 
            value={filters.isActive} 
            onChange={(e) => handleFilterChange('isActive', e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Account</label>
          <select 
            value={filters.isLocked} 
            onChange={(e) => handleFilterChange('isLocked', e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Accounts</option>
            <option value="false">Unlocked</option>
            <option value="true">Locked</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Country</label>
          <select 
            value={filters.country} 
            onChange={(e) => handleFilterChange('country', e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Countries</option>
            <option value="US">United States</option>
            <option value="UK">United Kingdom</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="JP">Japan</option>
            <option value="IN">India</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Search</label>
          <input 
            type="text" 
            placeholder="Search users..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.actionsRow}>
        <div className={styles.filterActions}>
          {hasActiveFilters && (
            <button 
              onClick={clearFilters}
              className={styles.clearButton}
            >
              Clear Filters
            </button>
          )}
          
          <button 
            onClick={onRefresh}
            className={styles.refreshButton}
          >
            Refresh
          </button>
        </div>

        <div className={styles.filterSummary}>
          {hasActiveFilters && (
            <span className={styles.activeFiltersCount}>
              {Object.values(filters).filter(v => v !== '').length} filter(s) active
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserFilters;