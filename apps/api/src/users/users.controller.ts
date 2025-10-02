import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
  Query,
  Request,
  Inject,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
// import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';

@ApiTags('Users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(@Inject('UsersService') private readonly usersService: any) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGEMENT)
  @ApiOperation({ summary: 'Create a new user (Admin/Management only)' })
  create(@Body() createUserDto: CreateUserDto, @Request() req) {
    return this.usersService.createWithAudit(createUserDto, req.user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users with advanced filtering' })
  @ApiQuery({ name: 'role', required: false, enum: UserRole })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'isLocked', required: false, type: Boolean })
  @ApiQuery({ name: 'country', required: false, type: String })
  @ApiQuery({ name: 'teamId', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('role') role?: UserRole,
    @Query('isActive') isActive?: boolean,
    @Query('isLocked') isLocked?: boolean,
    @Query('country') country?: string,
    @Query('teamId') teamId?: string,
    @Query('search') search?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 50,
  ) {
    const filters = {
      role,
      isActive: isActive !== undefined ? isActive === true : undefined,
      isLocked: isLocked !== undefined ? isLocked === true : undefined,
      country,
      teamId,
      search,
    };
    
    // Remove undefined filters
    Object.keys(filters).forEach(key => 
      filters[key] === undefined && delete filters[key]
    );
    
    if (Object.keys(filters).length > 0) {
      return this.usersService.findAllWithFilters(filters, +page, +limit);
    }
    
    return this.usersService.findAllWithFilters(undefined, +page, +limit);
  }

  @Get('stats')
  @Roles(UserRole.ADMIN, UserRole.MANAGEMENT)
  @ApiOperation({ summary: 'Get user statistics (Admin/Management only)' })
  async getStats() {
    const [activeUsers, lockedUsers, totalUsers] = await Promise.all([
      this.usersService.getActiveUsersCount(),
      this.usersService.getLockedUsersCount(),
      this.usersService.findAll().then(users => users.length),
    ]);
    
    return {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      lockedUsers,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGEMENT)
  @ApiOperation({ summary: 'Update a user (Admin/Management only)' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    return this.usersService.updateWithAudit(id, updateUserDto, req.user.sub);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a user (Admin only)' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Patch(':id/deactivate')
  @Roles(UserRole.ADMIN, UserRole.MANAGEMENT)
  @ApiOperation({ summary: 'Deactivate a user (Admin/Management only)' })
  deactivate(@Param('id') id: string) {
    return this.usersService.deactivate(id);
  }

  @Patch(':id/reactivate')
  @Roles(UserRole.ADMIN, UserRole.MANAGEMENT)
  @ApiOperation({ summary: 'Reactivate a user (Admin/Management only)' })
  reactivate(@Param('id') id: string) {
    return this.usersService.reactivate(id);
  }

  @Patch(':id/lock')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Lock user account (Admin only)' })
  lockAccount(@Param('id') id: string) {
    return this.usersService.lockAccount(id);
  }

  @Patch(':id/unlock')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Unlock user account (Admin only)' })
  unlockAccount(@Param('id') id: string) {
    return this.usersService.unlockAccount(id);
  }

  @Patch(':id/reset-password')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Reset user password (Admin only)' })
  resetPassword(
    @Param('id') id: string, 
    @Body() body: { newPassword: string }
  ) {
    return this.usersService.resetPassword(id, body.newPassword);
  }

  @Patch(':id/assign-team')
  @Roles(UserRole.ADMIN, UserRole.MANAGEMENT)
  @ApiOperation({ summary: 'Assign user to team (Admin/Management only)' })
  assignToTeam(
    @Param('id') id: string,
    @Body() body: { teamId: string }
  ) {
    return this.usersService.assignToTeam(id, body.teamId);
  }

  @Patch(':id/remove-team')
  @Roles(UserRole.ADMIN, UserRole.MANAGEMENT)
  @ApiOperation({ summary: 'Remove user from team (Admin/Management only)' })
  removeFromTeam(@Param('id') id: string) {
    return this.usersService.removeFromTeam(id);
  }

  // Advanced Admin Endpoints for Phase 2

  @Get('statistics')
  @Roles(UserRole.ADMIN, UserRole.MANAGEMENT)
  @ApiOperation({ summary: 'Get comprehensive user statistics (Admin/Management only)' })
  getUserStatistics() {
    return this.usersService.getUserStatistics();
  }

  @Post('batch-operation')
  @Roles(UserRole.ADMIN, UserRole.MANAGEMENT)
  @ApiOperation({ summary: 'Perform batch operations on users (Admin/Management only)' })
  batchOperation(
    @Body() operation: {
      userIds: string[];
      action: 'activate' | 'deactivate' | 'lock' | 'unlock' | 'assignTeam' | 'removeTeam' | 'changeRole';
      value?: string;
    },
    @Request() req
  ) {
    return this.usersService.batchUserOperation(operation, req.user.sub);
  }

  @Post('generate-password')
  @Roles(UserRole.ADMIN, UserRole.MANAGEMENT)
  @ApiOperation({ summary: 'Generate a secure random password (Admin/Management only)' })
  generatePassword() {
    return this.usersService.generateRandomPassword();
  }

  @Get('by-team/:teamId')
  @ApiOperation({ summary: 'Get users by team ID' })
  getUsersByTeam(@Param('teamId') teamId: string) {
    return this.usersService.findByTeam(teamId);
  }

  @Get('by-role/:role')
  @ApiOperation({ summary: 'Get users by role' })
  getUsersByRole(@Param('role') role: string) {
    return this.usersService.findByRole(role);
  }

  @Get('by-country/:country')
  @ApiOperation({ summary: 'Get users by country' })
  getUsersByCountry(@Param('country') country: string) {
    return this.usersService.findByCountry(country);
  }
}