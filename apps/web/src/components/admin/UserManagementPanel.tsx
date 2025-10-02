import React, { useState, useEffect } from 'react';
import { usersAPI } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import UserTable from './UserTable';
import UserFilters from './UserFilters';
import BatchOperations from './BatchOperations';
import CreateUserModal from './CreateUserModal';
import EditUserModal from './EditUserModal';
import styles from '../../styles/UserManagementPanel.module.css';

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

interface UserManagementPanelProps {
  onStatsUpdate: () => void;
}

const UserManagementPanel: React.FC<UserManagementPanelProps> = ({ onStatsUpdate }) => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    role: '',
    isActive: '',
    isLocked: '',
    country: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [filters, pagination.page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const params: any = {};
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '') {
          params[key] = value;
        }
      });
      
      params.page = pagination.page;
      params.limit = pagination.limit;

      const response = await usersAPI.getUsers(params);
      
      // Handle different response formats
      if (response.data && Array.isArray(response.data)) {
        // Direct array response
        setUsers(response.data);
        setFilteredUsers(response.data);
        setPagination(prev => ({ ...prev, total: response.data.length }));
      } else if (response.data.users) {
        // Paginated response with users array
        setUsers(response.data.users);
        setFilteredUsers(response.data.users);
        setPagination(prev => ({ ...prev, total: response.data.total || response.data.users.length }));
      } else {
        // Fallback
        setUsers(response.data);
        setFilteredUsers(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      setError(error.response?.data?.message || 'Failed to fetch users');
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleUserSelect = (userId: string, selected: boolean) => {
    if (selected) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleBatchOperation = async (action: string, value?: string) => {
    try {
      setError(null);
      await usersAPI.batchOperation({
        userIds: selectedUsers,
        action,
        value
      });
      
      await fetchUsers();
      onStatsUpdate();
      setSelectedUsers([]);
    } catch (error: any) {
      console.error('Error performing batch operation:', error);
      setError(error.response?.data?.message || 'Failed to perform batch operation');
    }
  };

  const handleUserCreate = async (userData: any) => {
    try {
      setError(null);
      await usersAPI.createUser(userData);
      await fetchUsers();
      onStatsUpdate();
      setShowCreateModal(false);
    } catch (error: any) {
      console.error('Error creating user:', error);
      setError(error.response?.data?.message || 'Failed to create user');
      throw error;
    }
  };

  const handleUserUpdate = async (userId: string, userData: any) => {
    try {
      setError(null);
      await usersAPI.updateUser(userId, userData);
      await fetchUsers();
      onStatsUpdate();
      setEditingUser(null);
    } catch (error: any) {
      console.error('Error updating user:', error);
      setError(error.response?.data?.message || 'Failed to update user');
      throw error;
    }
  };

  const handleUserAction = async (userId: string, action: string) => {
    try {
      setError(null);
      
      // Use the specific API methods for each action
      switch (action) {
        case 'deactivate':
          await usersAPI.deactivateUser(userId);
          break;
        case 'reactivate':
          await usersAPI.reactivateUser(userId);
          break;
        case 'lock':
          await usersAPI.lockUser(userId);
          break;
        case 'unlock':
          await usersAPI.unlockUser(userId);
          break;
        default:
          throw new Error(`Unknown action: ${action}`);
      }
      
      await fetchUsers();
      onStatsUpdate();
    } catch (error: any) {
      console.error(`Error performing ${action}:`, error);
      setError(error.response?.data?.message || `Failed to ${action} user`);
    }
  };

  return (
    <div className={styles.userManagementPanel}>
      <div className={styles.panelHeader}>
        <div className={styles.headerLeft}>
          <h2>User Management</h2>
          <p>Manage user accounts, roles, and permissions</p>
        </div>
        <div className={styles.headerRight}>
          <button 
            className={styles.createButton}
            onClick={() => setShowCreateModal(true)}
            disabled={loading}
          >
            Create User
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className={styles.errorMessage}>
          <span>{error}</span>
          <button onClick={() => setError(null)} className={styles.dismissError}>
            ×
          </button>
        </div>
      )}

      <UserFilters 
        filters={filters} 
        onFilterChange={handleFilterChange}
        onRefresh={fetchUsers}
      />

      {selectedUsers.length > 0 && (
        <BatchOperations
          selectedCount={selectedUsers.length}
          onBatchOperation={handleBatchOperation}
          onClear={() => setSelectedUsers([])}
        />
      )}

      <UserTable
        users={users}
        selectedUsers={selectedUsers}
        loading={loading}
        onUserSelect={handleUserSelect}
        onSelectAll={handleSelectAll}
        onUserEdit={setEditingUser}
        onUserAction={handleUserAction}
        pagination={pagination}
        onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
      />

      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleUserCreate}
        />
      )}

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSubmit={(userData) => handleUserUpdate(editingUser.id, userData)}
        />
      )}
    </div>
  );
};

export default UserManagementPanel;