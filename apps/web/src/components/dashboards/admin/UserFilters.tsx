import React, { useState } from 'react';
import styles from '../../../styles/UserFilters.module.css';

interface UserFilters {
  role?: string;
  team?: string;
  country?: string;
  status?: 'active' | 'inactive' | 'locked';
  search?: string;
}

interface UserFiltersProps {
  filters: UserFilters;
  onFiltersChange: (filters: UserFilters) => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({ filters, onFiltersChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof UserFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const activeFilterCount = Object.keys(filters).filter(key => filters[key as keyof UserFilters]).length;

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.searchBar}>
        <input 
          type="text"
          placeholder="Search users..."
          value={filters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className={styles.searchInput}
        />
        <button 
          className={styles.filterToggle}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          🔍 Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
      </div>
      
      {isExpanded && (
        <div className={styles.filtersPanel}>
          <div className={styles.filterGroup}>
            <label>Role</label>
            <select 
              value={filters.role || ''}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="management">Management</option>
              <option value="tech_support">Tech Support</option>
              <option value="business_dev">Business Dev</option>
              <option value="product_dev">Product Dev</option>
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <label>Status</label>
            <select 
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="locked">Locked</option>
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <label>Country</label>
            <select 
              value={filters.country || ''}
              onChange={(e) => handleFilterChange('country', e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">All Countries</option>
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
            </select>
          </div>
          
          <div className={styles.filterActions}>
            <button 
              className={styles.clearButton}
              onClick={clearFilters}
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserFilters;
