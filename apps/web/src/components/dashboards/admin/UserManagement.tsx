import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserTable from './UserTable';
import CreateUserModal from './CreateUserModal';
import EditUserModal from './EditUserModal';
import UserFilters from './UserFilters';
import BulkOperations from './BulkOperations';
import styles from '../../../styles/UserManagement.module.css';

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

interface UserFilters {
  role?: string;
  team?: string;
  country?: string;
  status?: 'active' | 'inactive' | 'locked';
  search?: string;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  lockedUsers: number;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [stats, setStats] = useState<UserStats>({ totalUsers: 0, activeUsers: 0, inactiveUsers: 0, lockedUsers: 0 });
  const [filters, setFilters] = useState<UserFilters>({});
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  useEffect(() => {
    fetchUsers();
    fetchUserStats();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.team) params.append('team', filters.team);
      if (filters.role) params.append('role', filters.role);
      if (filters.country) params.append('country', filters.country);
      
      const response = await axios.get(`/api/users?${params.toString()}`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await axios.get('/api/users/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...users];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(user => 
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(user => {
        switch (filters.status) {
          case 'active': return user.isActive && !user.isLocked;
          case 'inactive': return !user.isActive;
          case 'locked': return user.isLocked;
          default: return true;
        }
      });
    }

    setFilteredUsers(filtered);
  };

  const handleCreateUser = async (userData: any) => {
    try {
      await axios.post('/api/users', userData);
      setShowCreateModal(false);
      fetchUsers();
      fetchUserStats();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  const handleUpdateUser = async (userId: string, userData: any) => {
    try {
      await axios.patch(`/api/users/${userId}`, userData);
      setEditingUser(null);
      fetchUsers();
      fetchUserStats();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/users/${userId}`);
        fetchUsers();
        fetchUserStats();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleLockUser = async (userId: string) => {
    try {
      await axios.patch(`/api/users/${userId}/lock`);
      fetchUsers();
      fetchUserStats();
    } catch (error) {
      console.error('Error locking user:', error);
    }
  };

  const handleUnlockUser = async (userId: string) => {
    try {
      await axios.patch(`/api/users/${userId}/unlock`);
      fetchUsers();
      fetchUserStats();
    } catch (error) {
      console.error('Error unlocking user:', error);
    }
  };

  const handleResetPassword = async (userId: string, newPassword: string) => {
    try {
      await axios.patch(`/api/users/${userId}/reset-password`, { newPassword });
      alert('Password reset successfully');
    } catch (error) {
      console.error('Error resetting password:', error);
    }
  };

  const handleBulkAction = async (action: string, userIds: string[]) => {
    try {
      switch (action) {
        case 'activate':
          await Promise.all(userIds.map(id => axios.patch(`/api/users/${id}/reactivate`)));
          break;
        case 'deactivate':
          await Promise.all(userIds.map(id => axios.patch(`/api/users/${id}/deactivate`)));
          break;
        case 'lock':
          await Promise.all(userIds.map(id => axios.patch(`/api/users/${id}/lock`)));
          break;
        case 'unlock':
          await Promise.all(userIds.map(id => axios.patch(`/api/users/${id}/unlock`)));
          break;
      }
      setSelectedUsers([]);
      fetchUsers();
      fetchUserStats();
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className={styles.userManagement}>
      {/* User Statistics Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statContent}>
            <h3>Total Users</h3>
            <p className={styles.statNumber}>{stats.totalUsers}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statContent}>
            <h3>Active Users</h3>
            <p className={styles.statNumber}>{stats.activeUsers}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>❌</div>
          <div className={styles.statContent}>
            <h3>Inactive Users</h3>
            <p className={styles.statNumber}>{stats.inactiveUsers}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🔒</div>
          <div className={styles.statContent}>
            <h3>Locked Users</h3>
            <p className={styles.statNumber}>{stats.lockedUsers}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.leftControls}>
          <button 
            className={styles.createButton}
            onClick={() => setShowCreateModal(true)}
          >
            ➕ Create User
          </button>
          
          {selectedUsers.length > 0 && (
            <BulkOperations 
              selectedCount={selectedUsers.length}
              onBulkAction={handleBulkAction}
              selectedUsers={selectedUsers}
            />
          )}
        </div>
        
        <UserFilters 
          filters={filters}
          onFiltersChange={setFilters}
        />
      </div>

      {/* User Table */}
      <UserTable 
        users={filteredUsers}
        selectedUsers={selectedUsers}
        onSelectUser={(userId) => {
          setSelectedUsers(prev => 
            prev.includes(userId) 
              ? prev.filter(id => id !== userId)
              : [...prev, userId]
          );
        }}
        onSelectAll={() => {
          setSelectedUsers(
            selectedUsers.length === filteredUsers.length 
              ? [] 
              : filteredUsers.map(user => user.id)
          );
        }}
        onEditUser={setEditingUser}
        onDeleteUser={handleDeleteUser}
        onLockUser={handleLockUser}
        onUnlockUser={handleUnlockUser}
        onResetPassword={handleResetPassword}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={(column) => {
          if (sortBy === column) {
            setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
          } else {
            setSortBy(column);
            setSortOrder('ASC');
          }
        }}
      />

      {/* Modals */}
      {showCreateModal && (
        <CreateUserModal 
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateUser}
        />
      )}
      
      {editingUser && (
        <EditUserModal 
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSubmit={(userData) => handleUpdateUser(editingUser.id, userData)}
        />
      )}
    </div>
  );
};

export default UserManagement;
