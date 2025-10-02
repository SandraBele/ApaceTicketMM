import React, { useState } from 'react';
import styles from '../../styles/BulkOperations.module.css';

interface BatchOperationsProps {
  selectedCount: number;
  onBatchOperation: (action: string, value?: string) => Promise<void>;
  onClear: () => void;
}

const BatchOperations: React.FC<BatchOperationsProps> = ({ 
  selectedCount, 
  onBatchOperation, 
  onClear 
}) => {
  const [loading, setLoading] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const handleAction = async (action: string) => {
    if (!confirm(`Are you sure you want to ${action} ${selectedCount} users?`)) {
      return;
    }
    
    setLoading(true);
    setActiveAction(action);
    
    try {
      await onBatchOperation(action);
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
    } finally {
      setLoading(false);
      setActiveAction(null);
    }
  };

  const actions = [
    { 
      id: 'activate', 
      label: 'Activate', 
      icon: '✅', 
      color: '#10b981',
      description: 'Activate selected users'
    },
    { 
      id: 'deactivate', 
      label: 'Deactivate', 
      icon: '❌', 
      color: '#f59e0b',
      description: 'Deactivate selected users'
    },
    { 
      id: 'lock', 
      label: 'Lock', 
      icon: '🔒', 
      color: '#ef4444',
      description: 'Lock selected user accounts'
    },
    { 
      id: 'unlock', 
      label: 'Unlock', 
      icon: '🔓', 
      color: '#3b82f6',
      description: 'Unlock selected user accounts'
    },
  ];

  return (
    <div className={styles.bulkOperations}>
      <div className={styles.selectionInfo}>
        <span className={styles.selectedCount}>
          {selectedCount} user{selectedCount !== 1 ? 's' : ''} selected
        </span>
        <button 
          className={styles.clearButton}
          onClick={onClear}
          disabled={loading}
        >
          Clear Selection
        </button>
      </div>
      
      <div className={styles.actionButtons}>
        {actions.map((action) => (
          <button
            key={action.id}
            className={`${styles.actionButton} ${loading && activeAction === action.id ? styles.loading : ''}`}
            onClick={() => handleAction(action.id)}
            disabled={loading}
            style={{ '--action-color': action.color } as React.CSSProperties}
            title={action.description}
          >
            <span className={styles.actionIcon}>{action.icon}</span>
            <span className={styles.actionLabel}>{action.label}</span>
            {loading && activeAction === action.id && (
              <span className={styles.spinner}></span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BatchOperations;