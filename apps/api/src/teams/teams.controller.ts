import { Controller, Get, Post, Patch, Delete, Body, Param, Inject, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Team } from './teams.service.mock';

interface ITeamsService {
  findAll(): Promise<Team[]>;
  findOne(id: string): Promise<Team | undefined>;
  create(teamData: Partial<Team>): Promise<Team>;
  update(id: string, updateData: Partial<Team>): Promise<Team | undefined>;
  delete(id: string): Promise<boolean>;
  addMember(teamId: string, userId: string): Promise<Team | undefined>;
  removeMember(teamId: string, userId: string): Promise<Team | undefined>;
  updateKPITargets(teamId: string, kpiTargets: any): Promise<Team | undefined>;
  updateSLADefaults(teamId: string, slaDefaults: any): Promise<Team | undefined>;
  getTeamStats(): Promise<any>;
}

@Controller('teams')
@UseGuards(JwtAuthGuard)
export class TeamsController {
  constructor(
    @Inject('TeamsService') private readonly teamsService: ITeamsService,
  ) {}

  @Get()
  async findAll() {
    return await this.teamsService.findAll();
  }

  @Get('stats')
  async getStats() {
    return await this.teamsService.getTeamStats();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const team = await this.teamsService.findOne(id);
    if (!team) {
      throw new Error('Team not found');
    }
    return team;
  }

  @Post()
  async create(@Body() createTeamDto: any) {
    return await this.teamsService.create(createTeamDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTeamDto: any) {
    const team = await this.teamsService.update(id, updateTeamDto);
    if (!team) {
      throw new Error('Team not found');
    }
    return team;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const success = await this.teamsService.delete(id);
    if (!success) {
      throw new Error('Team not found');
    }
    return { message: 'Team deleted successfully' };
  }

  @Patch(':id/add-member')
  async addMember(@Param('id') teamId: string, @Body('userId') userId: string) {
    const team = await this.teamsService.addMember(teamId, userId);
    if (!team) {
      throw new Error('Team not found');
    }
    return team;
  }

  @Patch(':id/remove-member')
  async removeMember(@Param('id') teamId: string, @Body('userId') userId: string) {
    const team = await this.teamsService.removeMember(teamId, userId);
    if (!team) {
      throw new Error('Team not found');
    }
    return team;
  }

  @Patch(':id/kpi-targets')
  async updateKPITargets(@Param('id') teamId: string, @Body() kpiTargets: any) {
    const team = await this.teamsService.updateKPITargets(teamId, kpiTargets);
    if (!team) {
      throw new Error('Team not found');
    }
    return team;
  }

  @Patch(':id/sla-defaults')
  async updateSLADefaults(@Param('id') teamId: string, @Body() slaDefaults: any) {
    const team = await this.teamsService.updateSLADefaults(teamId, slaDefaults);
    if (!team) {
      throw new Error('Team not found');
    }
    return team;
  }
}