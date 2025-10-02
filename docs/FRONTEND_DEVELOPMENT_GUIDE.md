# ApaceTicket Admin ERP - Frontend Development Guide

**Ready for Frontend Development** 🚀  
**All Backend APIs Complete** ✅  

---

## 🎨 **Frontend Architecture Recommendations**

### **Technology Stack**
```
Frontend: Next.js 14 (existing)
Styling: CSS Modules (existing gradient theme)
State: React Context + Custom hooks
HTTP: Axios (existing)
Charts: Chart.js or Recharts
Tables: React-table or Tanstack Table
Forms: React Hook Form + Yup validation
Notifications: React-hot-toast
```

### **Project Structure**
```
src/
├── components/
│   ├── admin/              # Admin-specific components
│   │   ├── UserManagement/
│   │   ├── TeamManagement/
│   │   ├── TicketOversight/
│   │   └── SystemConfig/
│   ├── common/             # Shared components
│   └── forms/              # Form components
├── contexts/               # State management
├── hooks/                  # Custom hooks
├── services/               # API services
├── types/                  # TypeScript types
└── utils/                  # Helper functions
```

---

## 🔥 **Priority 1: User Management Interface**

### **Components to Build**

#### 1. **UserManagementPage** (`/admin/users`)
```typescript
interface UserManagementPageProps {
  // Main container for user management
}

// Features:
// - User list with filtering
// - Create/edit user modals
// - Bulk operations
// - User statistics cards
```

#### 2. **UserTable** Component
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  isLocked: boolean;
  country: string;
  team?: Team;
  lastLoginAt: Date;
  createdAt: Date;
}

// Features:
// - Sortable columns
// - Status indicators (active/locked/inactive)
// - Quick actions (lock/unlock, assign team)
// - Bulk selection
```

#### 3. **UserFilters** Component
```typescript
interface UserFilters {
  role?: UserRole;
  team?: string;
  country?: string;
  status?: 'active' | 'inactive' | 'locked';
  search?: string;
}

// Features:
// - Dropdown filters
// - Search input
// - Clear filters button
// - Active filter count
```

#### 4. **CreateUserModal** Component
```typescript
interface CreateUserForm {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: UserRole;
  country?: string;
  teamId?: string;
}

// Features:
// - Form validation
// - Role selection dropdown
// - Team assignment
// - Password generation option
```

#### 5. **UserStatsCards** Component
```typescript
interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  lockedUsers: number;
}

// Features:
// - Card layout
// - Color-coded metrics
// - Click to filter
```

### **API Integration**

#### User Service (`services/userService.ts`)
```typescript
class UserService {
  async getUsers(filters?: UserFilters): Promise<User[]>
  async getUserStats(): Promise<UserStats>
  async createUser(data: CreateUserForm): Promise<User>
  async updateUser(id: string, data: Partial<User>): Promise<User>
  async deleteUser(id: string): Promise<void>
  async lockUser(id: string): Promise<User>
  async unlockUser(id: string): Promise<User>
  async resetPassword(id: string, newPassword: string): Promise<User>
  async assignToTeam(userId: string, teamId: string): Promise<User>
}
```

---

## 🎨 **UI Design Guidelines**

### **Color Scheme (Maintain Existing)**
```css
:root {
  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-secondary: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  --gradient-success: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  --gradient-warning: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  --gradient-danger: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  
  --dark-bg: #1a1a2e;
  --card-bg: #16213e;
  --text-primary: #ffffff;
  --text-secondary: #a0a3bd;
  --border-color: #2d3748;
}
```

### **Component Patterns**

#### Status Indicators
```typescript
const StatusBadge = ({ status }: { status: 'active' | 'inactive' | 'locked' }) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500 text-white';
      case 'inactive': return 'bg-gray-500 text-white';
      case 'locked': return 'bg-red-500 text-white';
    }
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs ${getStatusStyle(status)}`}>
      {status.toUpperCase()}
    </span>
  );
};
```

#### Action Buttons
```typescript
const ActionButton = ({ 
  variant, 
  children, 
  onClick 
}: { 
  variant: 'primary' | 'secondary' | 'danger',
  children: React.ReactNode,
  onClick: () => void
}) => {
  const getVariantStyle = (variant: string) => {
    switch (variant) {
      case 'primary': return 'bg-gradient-to-r from-blue-500 to-purple-600';
      case 'secondary': return 'bg-gradient-to-r from-gray-500 to-gray-600';
      case 'danger': return 'bg-gradient-to-r from-red-500 to-pink-600';
    }
  };
  
  return (
    <button 
      className={`px-4 py-2 rounded-lg text-white transition-all hover:scale-105 ${getVariantStyle(variant)}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

---

## 📁 **State Management Pattern**

### **User Management Context**
```typescript
interface UserManagementContextType {
  users: User[];
  loading: boolean;
  filters: UserFilters;
  selectedUsers: string[];
  stats: UserStats;
  
  // Actions
  setFilters: (filters: UserFilters) => void;
  selectUser: (userId: string) => void;
  selectAllUsers: () => void;
  clearSelection: () => void;
  refreshUsers: () => Promise<void>;
  createUser: (data: CreateUserForm) => Promise<void>;
  updateUser: (id: string, data: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  bulkAction: (action: string, userIds: string[]) => Promise<void>;
}

const UserManagementProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useReducer(userManagementReducer, initialState);
  
  // Implementation...
  
  return (
    <UserManagementContext.Provider value={contextValue}>
      {children}
    </UserManagementContext.Provider>
  );
};
```

---

## 📊 **Real-time Updates**

### **WebSocket Integration** (Future Enhancement)
```typescript
const useRealTimeUpdates = () => {
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4000/ws');
    
    ws.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);
      
      switch (type) {
        case 'USER_UPDATED':
          // Update user in state
          break;
        case 'USER_LOCKED':
          // Show notification
          break;
        case 'TICKET_OVERDUE':
          // Show alert
          break;
      }
    };
    
    return () => ws.close();
  }, []);
};
```

---

## 🧪 **Testing Strategy**

### **Component Testing**
```typescript
// UserTable.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { UserTable } from '../UserTable';

describe('UserTable', () => {
  it('renders users correctly', () => {
    const mockUsers = [/* mock data */];
    render(<UserTable users={mockUsers} />);
    
    expect(screen.getByText('admin@apace.local')).toBeInTheDocument();
  });
  
  it('handles user selection', () => {
    const onSelectUser = jest.fn();
    render(<UserTable users={mockUsers} onSelectUser={onSelectUser} />);
    
    fireEvent.click(screen.getByTestId('user-checkbox-1'));
    expect(onSelectUser).toHaveBeenCalledWith('1');
  });
});
```

### **Integration Testing**
```typescript
// UserManagement.integration.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { UserManagementPage } from '../UserManagementPage';
import { UserManagementProvider } from '../UserManagementContext';

describe('User Management Integration', () => {
  it('loads and displays users', async () => {
    render(
      <UserManagementProvider>
        <UserManagementPage />
      </UserManagementProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('admin@apace.local')).toBeInTheDocument();
    });
  });
});
```

---

## 🚀 **Getting Started Steps**

### **Step 1: Set up Base Components**
1. Create `components/admin/UserManagement/` directory
2. Build `UserTable` with basic layout
3. Add `UserFilters` component
4. Implement `UserStatsCards`

### **Step 2: Add State Management**
1. Create `UserManagementContext`
2. Implement user service integration
3. Add loading and error states

### **Step 3: Add Interactions**
1. Implement user creation modal
2. Add edit functionality
3. Implement bulk operations
4. Add confirmation dialogs

### **Step 4: Polish & Test**
1. Add proper error handling
2. Implement optimistic updates
3. Add loading skeletons
4. Write comprehensive tests

---

## 📱 **Responsive Design**

### **Breakpoints**
```css
/* Mobile First */
.user-table {
  /* Mobile: Stack cards */
}

@media (min-width: 768px) {
  .user-table {
    /* Tablet: Condensed table */
  }
}

@media (min-width: 1024px) {
  .user-table {
    /* Desktop: Full table with all columns */
  }
}
```

### **Mobile Considerations**
- Stack user cards on mobile
- Hide non-essential columns
- Use bottom sheet for filters
- Touch-friendly action buttons

---

**Ready to Start Development!** 🚀  
**All APIs are functional and documented**  
**Choose your starting point and begin building!**
