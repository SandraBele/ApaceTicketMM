import { Injectable } from '@nestjs/common';

export interface Team {
  id: string;
  name: string;
  description: string;
  leadId: string;
  leadName: string;
  memberIds: string[];
  memberCount: number;
  country: string;
  department: string;
  kpiTargets: {
    monthlyTickets: number;
    resolutionTime: number; // hours
    satisfactionScore: number; // 1-5
    responseTime: number; // minutes
  };
  slaDefaults: {
    highPriority: number; // hours
    mediumPriority: number; // hours
    lowPriority: number; // hours
  };
  performance: {
    currentMonth: {
      ticketsResolved: number;
      avgResolutionTime: number;
      avgSatisfactionScore: number;
      slaCompliance: number; // percentage
    };
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class MockTeamsService {
  private teams: Team[] = [
    {
      id: '1',
      name: 'Technical Support',
      description: 'Customer technical support and troubleshooting team',
      leadId: '2',
      leadName: 'John Doe',
      memberIds: ['2', '5'],
      memberCount: 2,
      country: 'US',
      department: 'Support',
      kpiTargets: {
        monthlyTickets: 100,
        resolutionTime: 24,
        satisfactionScore: 4.5,
        responseTime: 30
      },
      slaDefaults: {
        highPriority: 4,
        mediumPriority: 24,
        lowPriority: 72
      },
      performance: {
        currentMonth: {
          ticketsResolved: 87,
          avgResolutionTime: 18.5,
          avgSatisfactionScore: 4.2,
          slaCompliance: 94.2
        }
      },
      isActive: true,
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-09-30T10:30:00Z'
    },
    {
      id: '2',
      name: 'Product Development',
      description: 'Software development and feature enhancement team',
      leadId: '4',
      leadName: 'Sarah Wilson',
      memberIds: ['4'],
      memberCount: 1,
      country: 'CA',
      department: 'Engineering',
      kpiTargets: {
        monthlyTickets: 50,
        resolutionTime: 48,
        satisfactionScore: 4.0,
        responseTime: 60
      },
      slaDefaults: {
        highPriority: 8,
        mediumPriority: 48,
        lowPriority: 120
      },
      performance: {
        currentMonth: {
          ticketsResolved: 42,
          avgResolutionTime: 36.8,
          avgSatisfactionScore: 4.1,
          slaCompliance: 88.6
        }
      },
      isActive: true,
      createdAt: '2024-02-01T00:00:00Z',
      updatedAt: '2024-09-28T14:20:00Z'
    },
    {
      id: '3',
      name: 'Business Development',
      description: 'Sales support and customer relationship management',
      leadId: '3',
      leadName: 'Mike Johnson',
      memberIds: ['3'],
      memberCount: 1,
      country: 'UK',
      department: 'Sales',
      kpiTargets: {
        monthlyTickets: 75,
        resolutionTime: 12,
        satisfactionScore: 4.7,
        responseTime: 15
      },
      slaDefaults: {
        highPriority: 2,
        mediumPriority: 12,
        lowPriority: 48
      },
      performance: {
        currentMonth: {
          ticketsResolved: 68,
          avgResolutionTime: 10.2,
          avgSatisfactionScore: 4.6,
          slaCompliance: 96.8
        }
      },
      isActive: true,
      createdAt: '2024-01-20T00:00:00Z',
      updatedAt: '2024-09-29T09:15:00Z'
    }
  ];

  async findAll(): Promise<Team[]> {
    return this.teams;
  }

  async findOne(id: string): Promise<Team | undefined> {
    return this.teams.find(team => team.id === id);
  }

  async create(teamData: Partial<Team>): Promise<Team> {
    const newTeam: Team = {
      id: (this.teams.length + 1).toString(),
      name: teamData.name || '',
      description: teamData.description || '',
      leadId: teamData.leadId || '',
      leadName: teamData.leadName || '',
      memberIds: teamData.memberIds || [],
      memberCount: teamData.memberIds?.length || 0,
      country: teamData.country || '',
      department: teamData.department || '',
      kpiTargets: teamData.kpiTargets || {
        monthlyTickets: 50,
        resolutionTime: 24,
        satisfactionScore: 4.0,
        responseTime: 30
      },
      slaDefaults: teamData.slaDefaults || {
        highPriority: 4,
        mediumPriority: 24,
        lowPriority: 72
      },
      performance: {
        currentMonth: {
          ticketsResolved: 0,
          avgResolutionTime: 0,
          avgSatisfactionScore: 0,
          slaCompliance: 0
        }
      },
      isActive: teamData.isActive !== undefined ? teamData.isActive : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.teams.push(newTeam);
    return newTeam;
  }

  async update(id: string, updateData: Partial<Team>): Promise<Team | undefined> {
    const teamIndex = this.teams.findIndex(team => team.id === id);
    if (teamIndex === -1) {
      return undefined;
    }

    const updatedTeam = {
      ...this.teams[teamIndex],
      ...updateData,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };

    this.teams[teamIndex] = updatedTeam;
    return updatedTeam;
  }

  async delete(id: string): Promise<boolean> {
    const teamIndex = this.teams.findIndex(team => team.id === id);
    if (teamIndex === -1) {
      return false;
    }

    this.teams.splice(teamIndex, 1);
    return true;
  }

  async addMember(teamId: string, userId: string): Promise<Team | undefined> {
    const team = await this.findOne(teamId);
    if (!team) {
      return undefined;
    }

    if (!team.memberIds.includes(userId)) {
      team.memberIds.push(userId);
      team.memberCount = team.memberIds.length;
      team.updatedAt = new Date().toISOString();
    }

    return team;
  }

  async removeMember(teamId: string, userId: string): Promise<Team | undefined> {
    const team = await this.findOne(teamId);
    if (!team) {
      return undefined;
    }

    team.memberIds = team.memberIds.filter(id => id !== userId);
    team.memberCount = team.memberIds.length;
    team.updatedAt = new Date().toISOString();

    return team;
  }

  async updateKPITargets(teamId: string, kpiTargets: Team['kpiTargets']): Promise<Team | undefined> {
    const team = await this.findOne(teamId);
    if (!team) {
      return undefined;
    }

    team.kpiTargets = { ...team.kpiTargets, ...kpiTargets };
    team.updatedAt = new Date().toISOString();

    return team;
  }

  async updateSLADefaults(teamId: string, slaDefaults: Team['slaDefaults']): Promise<Team | undefined> {
    const team = await this.findOne(teamId);
    if (!team) {
      return undefined;
    }

    team.slaDefaults = { ...team.slaDefaults, ...slaDefaults };
    team.updatedAt = new Date().toISOString();

    return team;
  }

  async getTeamStats(): Promise<any> {
    const totalTeams = this.teams.length;
    const activeTeams = this.teams.filter(team => team.isActive).length;
    const totalMembers = this.teams.reduce((sum, team) => sum + team.memberCount, 0);
    const avgPerformance = this.teams.reduce((sum, team) => sum + team.performance.currentMonth.slaCompliance, 0) / totalTeams;

    return {
      totalTeams,
      activeTeams,
      totalMembers,
      avgSLACompliance: Math.round(avgPerformance * 10) / 10
    };
  }
}