import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

// Create mock User objects with all required properties
class MockUser implements User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  country: string;
  teamId: string;
  team: any;
  isLocked: boolean;
  failedLoginAttempts: number;
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
  createdTickets: any[];
  assignedTickets: any[];

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  constructor(data: Partial<User>) {
    Object.assign(this, data);
    this.createdTickets = this.createdTickets || [];
    this.assignedTickets = this.assignedTickets || [];
  }
}

// Mock in-memory database
let mockUsers: MockUser[] = [
  new MockUser({
    id: '1',
    email: 'admin@apace.local',
    password: '$2a$10$IDSiCRg2p940SYLg1/1ClOmEMJM6fQvZyQ7YOmUqaUVXEU7YNgZ26', // admin123
    firstName: 'Admin',
    lastName: 'User',
    role: UserRole.ADMIN,
    isActive: true,
    country: 'United States',
    teamId: null,
    isLocked: false,
    failedLoginAttempts: 0,
    lastLoginAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    team: null,
  }),
  new MockUser({
    id: '2',
    email: 'support@apace.local',
    password: '$2a$10$IDSiCRg2p940SYLg1/1ClOmEMJM6fQvZyQ7YOmUqaUVXEU7YNgZ26', // support123 (same hash for testing)
    firstName: 'Tech',
    lastName: 'Support',
    role: UserRole.TECH_SUPPORT,
    isActive: true,
    country: 'Canada',
    teamId: null,
    isLocked: false,
    failedLoginAttempts: 0,
    lastLoginAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    team: null,
  }),
];

@Injectable()
export class MockUsersService {
  constructor() {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = mockUsers.find(u => u.email === createUserDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = new MockUser({
      id: (mockUsers.length + 1).toString(),
      ...createUserDto,
      password: hashedPassword,
      isActive: true,
      isLocked: false,
      failedLoginAttempts: 0,
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      team: null,
    });

    mockUsers.push(newUser);
    return newUser;
  }

  async findAll(): Promise<User[]> {
    return mockUsers.map(u => {
      const { password, ...userWithoutPassword } = u;
      return new MockUser(userWithoutPassword);
    });
  }

  async findOne(id: string): Promise<User> {
    const user = mockUsers.find(u => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const { password, ...userWithoutPassword } = user;
    return new MockUser(userWithoutPassword);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = mockUsers.find(u => u.email === email);
    return user || null;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedData = {
      ...mockUsers[userIndex],
      ...updateUserDto,
      updatedAt: new Date(),
    };
    
    mockUsers[userIndex] = new MockUser(updatedData);
    const { password, ...userWithoutPassword } = mockUsers[userIndex];
    return new MockUser(userWithoutPassword);
  }

  async remove(id: string): Promise<void> {
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    mockUsers.splice(userIndex, 1);
  }

  async deactivate(id: string): Promise<User> {
    return this.update(id, { isActive: false });
  }

  async reactivate(id: string): Promise<User> {
    return this.update(id, { isActive: true, isLocked: false, failedLoginAttempts: 0 });
  }

  async lockAccount(id: string): Promise<User> {
    return this.update(id, { isLocked: true });
  }

  async unlockAccount(id: string): Promise<User> {
    return this.update(id, { isLocked: false, failedLoginAttempts: 0 });
  }

  async incrementFailedLoginAttempts(id: string): Promise<User> {
    const user = await this.findOne(id);
    const failedAttempts = (user.failedLoginAttempts || 0) + 1;
    const isLocked = failedAttempts >= 5;
    return this.update(id, { failedLoginAttempts: failedAttempts, isLocked });
  }

  async resetFailedLoginAttempts(id: string): Promise<User> {
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updatedData = {
      ...mockUsers[userIndex],
      failedLoginAttempts: 0,
      lastLoginAt: new Date(),
      updatedAt: new Date(),
    };
    
    mockUsers[userIndex] = new MockUser(updatedData);
    const { password, ...userWithoutPassword } = mockUsers[userIndex];
    return new MockUser(userWithoutPassword);
  }

  async resetPassword(id: string, newPassword: string): Promise<User> {
    return this.update(id, { password: newPassword, isLocked: false, failedLoginAttempts: 0 });
  }

  async assignToTeam(userId: string, teamId: string): Promise<User> {
    return this.update(userId, { teamId });
  }

  async removeFromTeam(userId: string): Promise<User> {
    return this.update(userId, { teamId: null });
  }

  async findByTeam(teamId: string): Promise<User[]> {
    return mockUsers.filter(u => u.teamId === teamId).map(u => {
      const { password, ...userWithoutPassword } = u;
      return new MockUser(userWithoutPassword);
    });
  }

  async findByRole(role: string): Promise<User[]> {
    return mockUsers.filter(u => u.role === role).map(u => {
      const { password, ...userWithoutPassword } = u;
      return new MockUser(userWithoutPassword);
    });
  }

  async findByCountry(country: string): Promise<User[]> {
    return mockUsers.filter(u => u.country === country).map(u => {
      const { password, ...userWithoutPassword } = u;
      return new MockUser(userWithoutPassword);
    });
  }

  async getActiveUsersCount(): Promise<number> {
    return mockUsers.filter(u => u.isActive).length;
  }

  async getLockedUsersCount(): Promise<number> {
    return mockUsers.filter(u => u.isLocked).length;
  }

  // Advanced functions - simplified mock implementations
  async findAllWithFilters(filters?: any, page = 1, limit = 50): Promise<{ users: User[]; total: number }> {
    let filteredUsers = [...mockUsers];
    
    if (filters?.role) {
      filteredUsers = filteredUsers.filter(u => u.role === filters.role);
    }
    if (filters?.isActive !== undefined) {
      filteredUsers = filteredUsers.filter(u => u.isActive === filters.isActive);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filteredUsers = filteredUsers.filter(u => 
        u.firstName.toLowerCase().includes(search) ||
        u.lastName.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search)
      );
    }

    const total = filteredUsers.length;
    const startIndex = (page - 1) * limit;
    const users = filteredUsers.slice(startIndex, startIndex + limit).map(u => {
      const { password, ...userWithoutPassword } = u;
      return new MockUser(userWithoutPassword);
    });
    
    return { users, total };
  }

  async batchUserOperation(operation: any, performedById: string): Promise<User[]> {
    const updatedUsers = [];
    for (const userId of operation.userIds) {
      try {
        let updatedUser;
        switch (operation.action) {
          case 'activate':
            updatedUser = await this.reactivate(userId);
            break;
          case 'deactivate':
            updatedUser = await this.deactivate(userId);
            break;
          case 'lock':
            updatedUser = await this.lockAccount(userId);
            break;
          case 'unlock':
            updatedUser = await this.unlockAccount(userId);
            break;
          default:
            updatedUser = await this.findOne(userId);
        }
        updatedUsers.push(updatedUser);
      } catch (error) {
        console.log(`Failed to update user ${userId}:`, error.message);
      }
    }
    return updatedUsers;
  }

  async getUserStatistics(): Promise<any> {
    const active = mockUsers.filter(u => u.isActive).length;
    const locked = mockUsers.filter(u => u.isLocked).length;
    
    return {
      total: mockUsers.length,
      active,
      inactive: mockUsers.length - active,
      locked,
      byRole: {
        [UserRole.ADMIN]: mockUsers.filter(u => u.role === UserRole.ADMIN).length,
        [UserRole.TECH_SUPPORT]: mockUsers.filter(u => u.role === UserRole.TECH_SUPPORT).length,
        [UserRole.BUSINESS_DEV]: mockUsers.filter(u => u.role === UserRole.BUSINESS_DEV).length,
        [UserRole.MANAGEMENT]: mockUsers.filter(u => u.role === UserRole.MANAGEMENT).length,
        [UserRole.PRODUCT_DEV]: mockUsers.filter(u => u.role === UserRole.PRODUCT_DEV).length,
      },
      byTeam: { 'No Team': mockUsers.filter(u => !u.teamId).length },
      byCountry: {
        'United States': mockUsers.filter(u => u.country === 'United States').length,
        'Canada': mockUsers.filter(u => u.country === 'Canada').length,
      },
      recentActivity: mockUsers.filter(u => u.lastLoginAt).slice(0, 10),
    };
  }

  async generateRandomPassword(): Promise<string> {
    return 'temp123456';
  }

  async createWithAudit(createUserDto: CreateUserDto, performedById: string): Promise<User> {
    return this.create(createUserDto);
  }

  async updateWithAudit(id: string, updateUserDto: UpdateUserDto, performedById: string): Promise<User> {
    return this.update(id, updateUserDto);
  }
}