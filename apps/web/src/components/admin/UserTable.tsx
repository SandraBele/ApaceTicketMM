import React from 'react';
import styles from '../../styles/UserTable.module.css';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  isLocked: boolean;
  country?: string;
  team?: { id: string; name: string };
  lastLoginAt?: string;
  failedLoginAttempts: number;
  createdAt: string;
}

interface UserTableProps {
  users: User[];
  selectedUsers: string[];
  loading: boolean;
  onUserSelect: (userId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onUserEdit: (user: User) => void;
  onUserAction: (userId: string, action: string) => void;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  onPageChange: (page: number) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  selectedUsers,
  loading,
  onUserSelect,
  onSelectAll,
  onUserEdit,
  onUserAction,
  pagination,
  onPageChange
}) => {
  const formatRole = (role: string) => {
    return role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusColor = (user: User) => {
    if (user.isLocked) return '#ef4444';
    if (!user.isActive) return '#f59e0b';
    return '#10b981';
  };

  const getStatusLabel = (user: User) => {
    if (user.isLocked) return 'Locked';
    if (!user.isActive) return 'Inactive';
    return 'Active';
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className={styles.userTable}>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedUsers.length === users.length && users.length > 0}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className={styles.checkbox}
                />
              </th>
              <th>User</th>
              <th>Role</th>
              <th>Team</th>
              <th>Country</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={(e) => onUserSelect(user.id, e.target.checked)}
                    className={styles.checkbox}
                  />
                </td>
                <td>
                  <div className={styles.userInfo}>
                    <div className={styles.userName}>
                      {user.firstName} {user.lastName}
                    </div>
                    <div className={styles.userEmail}>
                      {user.email}
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`${styles.badge} ${styles.roleBadge}`}>
                    {formatRole(user.role)}
                  </span>
                </td>
                <td>
                  {user.team ? (
                    <span className={styles.teamName}>{user.team.name}</span>
                  ) : (
                    <span className={styles.noTeam}>No Team</span>
                  )}
                </td>
                <td>
                  <span className={styles.country}>
                    {user.country || 'Not set'}
                  </span>
                </td>
                <td>
                  <div className={styles.statusContainer}>
                    <div 
                      className={styles.statusIndicator}
                      style={{ backgroundColor: getStatusColor(user) }}
                    ></div>
                    <span className={styles.statusLabel}>
                      {getStatusLabel(user)}
                    </span>
                    {user.failedLoginAttempts > 0 && (
                      <span className={styles.failedAttempts}>
                        ({user.failedLoginAttempts} failed logins)
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <span className={styles.lastLogin}>
                    {user.lastLoginAt 
                      ? new Date(user.lastLoginAt).toLocaleDateString()
                      : 'Never'
                    }
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button 
                      className={styles.actionButton}
                      onClick={() => onUserEdit(user)}
                    >
                      Edit
                    </button>
                    
                    {user.isActive ? (
                      <button 
                        className={`${styles.actionButton} ${styles.deactivateButton}`}
                        onClick={() => onUserAction(user.id, 'deactivate')}
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button 
                        className={`${styles.actionButton} ${styles.activateButton}`}
                        onClick={() => onUserAction(user.id, 'reactivate')}
                      >
                        Activate
                      </button>
                    )}
                    
                    {user.isLocked ? (
                      <button 
                        className={`${styles.actionButton} ${styles.unlockButton}`}
                        onClick={() => onUserAction(user.id, 'unlock')}
                      >
                        Unlock
                      </button>
                    ) : (
                      <button 
                        className={`${styles.actionButton} ${styles.lockButton}`}
                        onClick={() => onUserAction(user.id, 'lock')}
                      >
                        Lock
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
          </div>
          
          <div className={styles.paginationControls}>
            <button 
              className={styles.pageButton}
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  className={`${styles.pageButton} ${
                    page === pagination.page ? styles.activePage : ''
                  }`}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
              );
            })}
            
            <button 
              className={styles.pageButton}
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;