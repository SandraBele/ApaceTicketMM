import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, In } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { AuditAction } from '../audit-logs/entities/audit-log.entity';

interface UserFilters {
  role?: UserRole;
  isActive?: boolean;
  isLocked?: boolean;
  country?: string;
  teamId?: string;
  search?: string;
}

interface BatchUserOperation {
  userIds: string[];
  action: 'activate' | 'deactivate' | 'lock' | 'unlock' | 'assignTeam' | 'removeTeam' | 'changeRole';
  value?: string; // For team assignment or role change
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private auditLogsService: AuditLogsService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user with email already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['team'],
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive', 'country', 'teamId', 'isLocked', 'failedLoginAttempts', 'lastLoginAt', 'createdAt', 'updatedAt'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['team'],
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive', 'country', 'teamId', 'isLocked', 'failedLoginAttempts', 'lastLoginAt', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ 
      where: { email },
      relations: ['team'],
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    
    // If email is being updated, check for conflicts
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    // If password is being updated, hash it
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async deactivate(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.isActive = false;
    return this.usersRepository.save(user);
  }

  async reactivate(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.isActive = true;
    user.isLocked = false;
    user.failedLoginAttempts = 0;
    return this.usersRepository.save(user);
  }

  async lockAccount(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.isLocked = true;
    return this.usersRepository.save(user);
  }

  async unlockAccount(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.isLocked = false;
    user.failedLoginAttempts = 0;
    return this.usersRepository.save(user);
  }

  async incrementFailedLoginAttempts(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.failedLoginAttempts += 1;
    
    // Lock account after 5 failed attempts (configurable)
    if (user.failedLoginAttempts >= 5) {
      user.isLocked = true;
    }
    
    return this.usersRepository.save(user);
  }

  async resetFailedLoginAttempts(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.failedLoginAttempts = 0;
    user.lastLoginAt = new Date();
    return this.usersRepository.save(user);
  }

  async resetPassword(id: string, newPassword: string): Promise<User> {
    const user = await this.findOne(id);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.isLocked = false;
    user.failedLoginAttempts = 0;
    return this.usersRepository.save(user);
  }

  async assignToTeam(userId: string, teamId: string): Promise<User> {
    const user = await this.findOne(userId);
    user.teamId = teamId;
    return this.usersRepository.save(user);
  }

  async removeFromTeam(userId: string): Promise<User> {
    const user = await this.findOne(userId);
    user.teamId = null;
    return this.usersRepository.save(user);
  }

  async findByTeam(teamId: string): Promise<User[]> {
    return this.usersRepository.find({
      where: { teamId },
      relations: ['team'],
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive', 'country', 'teamId', 'createdAt', 'updatedAt'],
      order: { firstName: 'ASC' },
    });
  }

  async findByRole(role: string): Promise<User[]> {
    return this.usersRepository.find({
      where: { role: role as any },
      relations: ['team'],
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive', 'country', 'teamId', 'createdAt', 'updatedAt'],
      order: { firstName: 'ASC' },
    });
  }

  async findByCountry(country: string): Promise<User[]> {
    return this.usersRepository.find({
      where: { country },
      relations: ['team'],
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive', 'country', 'teamId', 'createdAt', 'updatedAt'],
      order: { firstName: 'ASC' },
    });
  }

  async getActiveUsersCount(): Promise<number> {
    return this.usersRepository.count({
      where: { isActive: true },
    });
  }

  async getLockedUsersCount(): Promise<number> {
    return this.usersRepository.count({
      where: { isLocked: true },
    });
  }

  // Advanced Admin Functions for Phase 2

  async findAllWithFilters(filters?: UserFilters, page = 1, limit = 50): Promise<{ users: User[]; total: number }> {
    let queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.team', 'team')
      .select([
        'user.id', 'user.email', 'user.firstName', 'user.lastName', 
        'user.role', 'user.isActive', 'user.country', 'user.teamId', 
        'user.isLocked', 'user.failedLoginAttempts', 'user.lastLoginAt',
        'user.createdAt', 'user.updatedAt', 'team.id', 'team.name'
      ]);

    if (filters) {
      queryBuilder = this.applyUserFilters(queryBuilder, filters);
    }

    const total = await queryBuilder.getCount();
    const users = await queryBuilder
      .orderBy('user.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { users, total };
  }

  private applyUserFilters(queryBuilder: SelectQueryBuilder<User>, filters: UserFilters): SelectQueryBuilder<User> {
    if (filters.role) {
      queryBuilder.andWhere('user.role = :role', { role: filters.role });
    }

    if (filters.isActive !== undefined) {
      queryBuilder.andWhere('user.isActive = :isActive', { isActive: filters.isActive });
    }

    if (filters.isLocked !== undefined) {
      queryBuilder.andWhere('user.isLocked = :isLocked', { isLocked: filters.isLocked });
    }

    if (filters.country) {
      queryBuilder.andWhere('user.country = :country', { country: filters.country });
    }

    if (filters.teamId) {
      queryBuilder.andWhere('user.teamId = :teamId', { teamId: filters.teamId });
    }

    if (filters.search) {
      queryBuilder.andWhere(
        '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    return queryBuilder;
  }

  async batchUserOperation(operation: BatchUserOperation, performedById: string): Promise<User[]> {
    const users = await this.usersRepository.find({
      where: { id: In(operation.userIds) },
      relations: ['team'],
    });

    if (users.length !== operation.userIds.length) {
      throw new NotFoundException('Some users not found');
    }

    const updatedUsers: User[] = [];

    for (const user of users) {
      let updated = false;
      const originalData = { ...user };

      switch (operation.action) {
        case 'activate':
          if (!user.isActive) {
            user.isActive = true;
            user.isLocked = false;
            user.failedLoginAttempts = 0;
            updated = true;
          }
          break;

        case 'deactivate':
          if (user.isActive) {
            user.isActive = false;
            updated = true;
          }
          break;

        case 'lock':
          if (!user.isLocked) {
            user.isLocked = true;
            updated = true;
          }
          break;

        case 'unlock':
          if (user.isLocked) {
            user.isLocked = false;
            user.failedLoginAttempts = 0;
            updated = true;
          }
          break;

        case 'assignTeam':
          if (operation.value && user.teamId !== operation.value) {
            user.teamId = operation.value;
            updated = true;
          }
          break;

        case 'removeTeam':
          if (user.teamId) {
            user.teamId = null;
            updated = true;
          }
          break;

        case 'changeRole':
          if (operation.value && user.role !== operation.value) {
            user.role = operation.value as UserRole;
            updated = true;
          }
          break;
      }

      if (updated) {
        const savedUser = await this.usersRepository.save(user);
        updatedUsers.push(savedUser);

        // Log the audit action
        await this.auditLogsService.create({
          action: this.getAuditActionForBatchOperation(operation.action),
          performedById,
          targetUserId: user.id,
          entityType: 'User',
          entityId: user.id,
          details: `Batch operation: ${operation.action}${operation.value ? ` with value: ${operation.value}` : ''}`,
        });
      }
    }

    return updatedUsers;
  }

  private getAuditActionForBatchOperation(action: string): AuditAction {
    switch (action) {
      case 'activate':
        return AuditAction.USER_REACTIVATED;
      case 'deactivate':
        return AuditAction.USER_DEACTIVATED;
      case 'lock':
        return AuditAction.ACCOUNT_LOCKED;
      case 'unlock':
        return AuditAction.ACCOUNT_UNLOCKED;
      case 'assignTeam':
      case 'removeTeam':
        return AuditAction.USER_UPDATED;
      case 'changeRole':
        return AuditAction.ROLE_CHANGED;
      default:
        return AuditAction.USER_UPDATED;
    }
  }

  async getUserStatistics(): Promise<{
    total: number;
    active: number;
    inactive: number;
    locked: number;
    byRole: Record<string, number>;
    byTeam: Record<string, number>;
    byCountry: Record<string, number>;
    recentActivity: any[];
  }> {
    const [users, recentLogins] = await Promise.all([
      this.usersRepository.find({ relations: ['team'] }),
      this.usersRepository.find({
        where: { lastLoginAt: { $ne: null } as any },
        order: { lastLoginAt: 'DESC' },
        take: 10,
        select: ['id', 'email', 'firstName', 'lastName', 'lastLoginAt'],
      }),
    ]);

    const stats = {
      total: users.length,
      active: users.filter(u => u.isActive).length,
      inactive: users.filter(u => !u.isActive).length,
      locked: users.filter(u => u.isLocked).length,
      byRole: {},
      byTeam: {},
      byCountry: {},
      recentActivity: recentLogins,
    };

    // Group by role
    users.forEach(user => {
      stats.byRole[user.role] = (stats.byRole[user.role] || 0) + 1;
    });

    // Group by team
    users.forEach(user => {
      const teamName = user.team?.name || 'No Team';
      stats.byTeam[teamName] = (stats.byTeam[teamName] || 0) + 1;
    });

    // Group by country
    users.forEach(user => {
      const country = user.country || 'Unknown';
      stats.byCountry[country] = (stats.byCountry[country] || 0) + 1;
    });

    return stats;
  }

  async generateRandomPassword(): Promise<string> {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  }

  async createWithAudit(createUserDto: CreateUserDto, performedById: string): Promise<User> {
    const user = await this.create(createUserDto);
    
    await this.auditLogsService.create({
      action: AuditAction.USER_CREATED,
      performedById,
      targetUserId: user.id,
      entityType: 'User',
      entityId: user.id,
      details: `Created user: ${user.email} with role: ${user.role}`,
    });

    return user;
  }

  async updateWithAudit(id: string, updateUserDto: UpdateUserDto, performedById: string): Promise<User> {
    const originalUser = await this.findOne(id);
    const updatedUser = await this.update(id, updateUserDto);
    
    const changes = this.getChanges(originalUser, updatedUser);
    if (changes.length > 0) {
      await this.auditLogsService.create({
        action: AuditAction.USER_UPDATED,
        performedById,
        targetUserId: id,
        entityType: 'User',
        entityId: id,
        details: `Updated fields: ${changes.join(', ')}`,
      });
    }

    return updatedUser;
  }

  private getChanges(original: User, updated: User): string[] {
    const changes = [];
    if (original.email !== updated.email) changes.push('email');
    if (original.firstName !== updated.firstName) changes.push('firstName');
    if (original.lastName !== updated.lastName) changes.push('lastName');
    if (original.role !== updated.role) changes.push('role');
    if (original.isActive !== updated.isActive) changes.push('isActive');
    if (original.country !== updated.country) changes.push('country');
    if (original.teamId !== updated.teamId) changes.push('team');
    return changes;
  }
}