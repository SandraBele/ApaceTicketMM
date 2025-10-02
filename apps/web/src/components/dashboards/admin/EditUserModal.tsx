import React, { useState, useEffect } from 'react';
import styles from '../../../styles/EditUserModal.module.css';

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
}

interface EditUserModalProps {
  user: User;
  onClose: () => void;
  onSubmit: (userData: any) => Promise<void>;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    country: user.country || '',
    teamId: user.teamId || '',
    isActive: user.isActive,
    isLocked: user.isLocked,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordReset, setPasswordReset] = useState('');
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const updateData = { ...formData };
      if (passwordReset) {
        (updateData as any).password = passwordReset;
      }
      await onSubmit(updateData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPasswordReset(password);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Edit User</h2>
          <button className={styles.closeButton} onClick={onClose}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.error}>
              ⚠️ {error}
            </div>
          )}
          
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </div>
            <div className={styles.userDetails}>
              <h3>{user.firstName} {user.lastName}</h3>
              <p>{user.email}</p>
              <div className={styles.userBadges}>
                <span className={`${styles.badge} ${user.isActive ? styles.active : styles.inactive}`}>
                  {user.isActive ? '✅ Active' : '❌ Inactive'}
                </span>
                {user.isLocked && (
                  <span className={`${styles.badge} ${styles.locked}`}>
                    🔒 Locked
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>First Name *</label>
              <input 
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className={styles.input}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Last Name *</label>
              <input 
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className={styles.input}
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label>Email *</label>
            <input 
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Role *</label>
              <select 
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className={styles.select}
                required
              >
                <option value="tech_support">Tech Support</option>
                <option value="business_dev">Business Dev</option>
                <option value="product_dev">Product Dev</option>
                <option value="management">Management</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label>Country</label>
              <select 
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className={styles.select}
              >
                <option value="">Select Country</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
              </select>
            </div>
          </div>
          
          <div className={styles.statusControls}>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className={styles.checkbox}
                />
                <span>Active User</span>
              </label>
            </div>
            
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox"
                  checked={formData.isLocked}
                  onChange={(e) => setFormData({ ...formData, isLocked: e.target.checked })}
                  className={styles.checkbox}
                />
                <span>Account Locked</span>
              </label>
            </div>
          </div>
          
          <div className={styles.passwordSection}>
            <div className={styles.sectionHeader}>
              <button 
                type="button"
                className={styles.toggleButton}
                onClick={() => setShowPasswordReset(!showPasswordReset)}
              >
                {showPasswordReset ? '▼' : '▶'} Reset Password
              </button>
            </div>
            
            {showPasswordReset && (
              <div className={styles.passwordGroup}>
                <input 
                  type="text"
                  value={passwordReset}
                  onChange={(e) => setPasswordReset(e.target.value)}
                  className={styles.input}
                  placeholder="Enter new password"
                />
                <button 
                  type="button"
                  onClick={generatePassword}
                  className={styles.generateButton}
                >
                  Generate
                </button>
              </div>
            )}
          </div>
          
          <div className={styles.modalActions}>
            <button 
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
