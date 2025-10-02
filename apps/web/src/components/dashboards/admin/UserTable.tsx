import React from 'react';
import styles from '../../../styles/UserTable.module.css';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  isLocked: boolean;
  country: string;
  teamId?: string;
  team?: { id: string; name: string };
  lastLoginAt?: Date;
  createdAt: Date;
  failedLoginAttempts: number;
}

interface UserTableProps {
  users: User[];
  selectedUsers: string[];
  onSelectUser: (userId: string) => void;
  onSelectAll: () => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onLockUser: (userId: string) => void;
  onUnlockUser: (userId: string) => void;
  onResetPassword: (userId: string, newPassword: string) => void;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
  onSort: (column: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  selectedUsers,
  onSelectUser,
  onSelectAll,
  onEditUser,
  onDeleteUser,
  onLockUser,
  onUnlockUser,
  onResetPassword,
  sortBy,
  sortOrder,
  onSort,
}) => {
  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return '#ef4444';
      case 'management': return '#8b5cf6';
      case 'tech_support': return '#3b82f6';
      case 'business_dev': return '#10b981';
      case 'product_dev': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusBadge = (user: User) => {
    if (user.isLocked) {
      return <span className={`${styles.badge} ${styles.locked}`}>🔒 Locked</span>;
    }
    if (!user.isActive) {
      return <span className={`${styles.badge} ${styles.inactive}`}>❌ Inactive</span>;
    }
    return <span className={`${styles.badge} ${styles.active}`}>✅ Active</span>;
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const SortableHeader = ({ column, children }: { column: string; children: React.ReactNode }) => (
    <th 
      className={styles.sortableHeader}
      onClick={() => onSort(column)}
    >
      <div className={styles.headerContent}>
        {children}
        {sortBy === column && (
          <span className={styles.sortIcon}>
            {sortOrder === 'ASC' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </th>
  );

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <h3>Users ({users.length})</h3>
        <div className={styles.tableActions}>
          {selectedUsers.length > 0 && (
            <span className={styles.selectionCount}>
              {selectedUsers.length} selected
            </span>
          )}
        </div>
      </div>
      
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.checkboxColumn}>
                <input 
                  type="checkbox"
                  checked={selectedUsers.length === users.length && users.length > 0}
                  onChange={onSelectAll}
                  className={styles.checkbox}
                />
              </th>
              <SortableHeader column="firstName">Name</SortableHeader>
              <SortableHeader column="email">Email</SortableHeader>
              <SortableHeader column="role">Role</SortableHeader>
              <th>Team</th>
              <SortableHeader column="country">Country</SortableHeader>
              <th>Status</th>
              <SortableHeader column="lastLoginAt">Last Login</SortableHeader>
              <SortableHeader column="createdAt">Created</SortableHeader>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr 
                key={user.id} 
                className={selectedUsers.includes(user.id) ? styles.selectedRow : ''}
              >
                <td>
                  <input 
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => onSelectUser(user.id)}
                    className={styles.checkbox}
                  />
                </td>
                <td className={styles.nameCell}>
                  <div className={styles.userInfo}>
                    <div className={styles.avatar}>
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </div>
                    <div className={styles.nameInfo}>
                      <div className={styles.fullName}>
                        {user.firstName} {user.lastName}
                      </div>
                      {user.failedLoginAttempts > 0 && (
                        <div className={styles.failedAttempts}>
                          {user.failedLoginAttempts} failed attempts
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span 
                    className={styles.roleBadge}
                    style={{ backgroundColor: getRoleColor(user.role) }}
                  >
                    {user.role.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td>
                  {user.team ? (
                    <span className={styles.teamBadge}>{user.team.name}</span>
                  ) : (
                    <span className={styles.noTeam}>No Team</span>
                  )}
                </td>
                <td>{user.country || 'N/A'}</td>
                <td>{getStatusBadge(user)}</td>
                <td>{formatDate(user.lastLoginAt)}</td>
                <td>{formatDate(user.createdAt)}</td>
                <td>
                  <div className={styles.actionButtons}>
                    <button 
                      className={styles.actionBtn}
                      onClick={() => onEditUser(user)}
                      title="Edit User"
                    >
                      ✏️
                    </button>
                    
                    {user.isLocked ? (
                      <button 
                        className={`${styles.actionBtn} ${styles.unlock}`}
                        onClick={() => onUnlockUser(user.id)}
                        title="Unlock User"
                      >
                        🔓
                      </button>
                    ) : (
                      <button 
                        className={`${styles.actionBtn} ${styles.lock}`}
                        onClick={() => onLockUser(user.id)}
                        title="Lock User"
                      >
                        🔒
                      </button>
                    )}
                    
                    <button 
                      className={`${styles.actionBtn} ${styles.reset}`}
                      onClick={() => {
                        const newPassword = prompt('Enter new password:');
                        if (newPassword) {
                          onResetPassword(user.id, newPassword);
                        }
                      }}
                      title="Reset Password"
                    >
                      🔄
                    </button>
                    
                    <button 
                      className={`${styles.actionBtn} ${styles.delete}`}
                      onClick={() => onDeleteUser(user.id)}
                      title="Delete User"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {users.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>👥</div>
            <h3>No users found</h3>
            <p>No users match your current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserTable;
