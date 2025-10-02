'use client';

import { useState, useEffect } from 'react';
import { Plus, Users, Target, Settings } from 'lucide-react';
import TeamList from './TeamList';
import TeamForm from './TeamForm';
import KPIConfiguration from './KPIConfiguration';

interface Team {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  kpiTargets: {
    ticketsPerMonth: number;
    responseTimeHours: number;
    resolutionRate: number;
  };
  timezone: string;
  workingHours: {
    start: string;
    end: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  teamId?: string;
}

export default function TeamManagementPanel() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isKPIOpen, setIsKPIOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for development
  useEffect(() => {
    const mockTeams: Team[] = [
      {
        id: '1',
        name: 'Technical Support',
        description: 'Customer technical assistance team',
        memberCount: 8,
        kpiTargets: {
          ticketsPerMonth: 150,
          responseTimeHours: 2,
          resolutionRate: 95
        },
        timezone: 'UTC+0',
        workingHours: {
          start: '09:00',
          end: '17:00'
        },
        createdAt: '2024-01-15T08:00:00Z',
        updatedAt: '2024-12-01T10:30:00Z'
      },
      {
        id: '2',
        name: 'Business Development',
        description: 'Sales and client relationship team',
        memberCount: 5,
        kpiTargets: {
          ticketsPerMonth: 80,
          responseTimeHours: 4,
          resolutionRate: 90
        },
        timezone: 'UTC+1',
        workingHours: {
          start: '08:00',
          end: '16:00'
        },
        createdAt: '2024-02-01T09:00:00Z',
        updatedAt: '2024-11-28T14:20:00Z'
      },
      {
        id: '3',
        name: 'Product Development',
        description: 'Software development and innovation team',
        memberCount: 12,
        kpiTargets: {
          ticketsPerMonth: 200,
          responseTimeHours: 1,
          resolutionRate: 98
        },
        timezone: 'UTC-5',
        workingHours: {
          start: '10:00',
          end: '18:00'
        },
        createdAt: '2024-01-10T07:30:00Z',
        updatedAt: '2024-12-02T11:45:00Z'
      }
    ];

    const mockUsers: User[] = [
      { id: '1', email: 'john.doe@apace.local', firstName: 'John', lastName: 'Doe', role: 'Tech Support', teamId: '1' },
      { id: '2', email: 'jane.smith@apace.local', firstName: 'Jane', lastName: 'Smith', role: 'Business Dev', teamId: '2' },
      { id: '3', email: 'bob.wilson@apace.local', firstName: 'Bob', lastName: 'Wilson', role: 'Product Dev', teamId: '3' },
      { id: '4', email: 'alice.brown@apace.local', firstName: 'Alice', lastName: 'Brown', role: 'Tech Support', teamId: '1' },
      { id: '5', email: 'charlie.davis@apace.local', firstName: 'Charlie', lastName: 'Davis', role: 'Management' }
    ];

    setTimeout(() => {
      setTeams(mockTeams);
      setUsers(mockUsers);
      setLoading(false);
    }, 500);
  }, []);

  const handleCreateTeam = () => {
    setSelectedTeam(null);
    setIsFormOpen(true);
  };

  const handleEditTeam = (team: Team) => {
    setSelectedTeam(team);
    setIsFormOpen(true);
  };

  const handleConfigureKPIs = (team: Team) => {
    setSelectedTeam(team);
    setIsKPIOpen(true);
  };

  const handleSaveTeam = async (teamData: Partial<Team>) => {
    try {
      if (selectedTeam) {
        // Update existing team
        const updatedTeams = teams.map(team =>
          team.id === selectedTeam.id
            ? { ...team, ...teamData, updatedAt: new Date().toISOString() }
            : team
        );
        setTeams(updatedTeams);
      } else {
        // Create new team
        const newTeam: Team = {
          id: (teams.length + 1).toString(),
          memberCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...teamData
        } as Team;
        setTeams([...teams, newTeam]);
      }
      setIsFormOpen(false);
      setSelectedTeam(null);
    } catch (err) {
      setError('Failed to save team');
    }
  };

  const handleSaveKPIs = async (kpiData: Team['kpiTargets']) => {
    try {
      if (selectedTeam) {
        const updatedTeams = teams.map(team =>
          team.id === selectedTeam.id
            ? { ...team, kpiTargets: kpiData, updatedAt: new Date().toISOString() }
            : team
        );
        setTeams(updatedTeams);
      }
      setIsKPIOpen(false);
      setSelectedTeam(null);
    } catch (err) {
      setError('Failed to save KPI configuration');
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    try {
      setTeams(teams.filter(team => team.id !== teamId));
    } catch (err) {
      setError('Failed to delete team');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Team Management</h2>
          <p className="text-gray-600 mb-4">
            Manage teams, assign members, and configure KPI targets for optimal performance tracking.
          </p>
        </div>
        <button
          onClick={handleCreateTeam}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus className="h-4 w-4" />
          Create Team
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Teams</p>
              <p className="text-2xl font-bold text-gray-900">{teams.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">
                {teams.reduce((sum, team) => sum + team.memberCount, 0)}
              </p>
            </div>
            <Target className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg KPI Target</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(teams.reduce((sum, team) => sum + team.kpiTargets.ticketsPerMonth, 0) / teams.length || 0)}
              </p>
            </div>
            <Settings className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Team List */}
      <TeamList
        teams={teams}
        users={users}
        onEdit={handleEditTeam}
        onDelete={handleDeleteTeam}
        onConfigureKPIs={handleConfigureKPIs}
      />

      {/* Team Form Modal */}
      {isFormOpen && (
        <TeamForm
          team={selectedTeam}
          users={users.filter(user => !user.teamId || user.teamId === selectedTeam?.id)}
          onSave={handleSaveTeam}
          onCancel={() => {
            setIsFormOpen(false);
            setSelectedTeam(null);
          }}
        />
      )}

      {/* KPI Configuration Modal */}
      {isKPIOpen && selectedTeam && (
        <KPIConfiguration
          team={selectedTeam}
          onSave={handleSaveKPIs}
          onCancel={() => {
            setIsKPIOpen(false);
            setSelectedTeam(null);
          }}
        />
      )}
    </div>
  );
}