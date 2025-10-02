import React, { useState, useEffect } from 'react';
import { teamsAPI } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import styles from '../../styles/TeamManagementPanel.module.css';

interface Team {
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
    resolutionTime: number;
    satisfactionScore: number;
    responseTime: number;
  };
  slaDefaults: {
    highPriority: number;
    mediumPriority: number;
    lowPriority: number;
  };
  performance: {
    currentMonth: {
      ticketsResolved: number;
      avgResolutionTime: number;
      avgSatisfactionScore: number;
      slaCompliance: number;
    };
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TeamManagementPanelProps {
  onStatsUpdate?: () => void;
}

const TeamManagementPanel: React.FC<TeamManagementPanelProps> = ({ onStatsUpdate }) => {
  const { user: currentUser } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'kpis' | 'members'>('overview');

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await teamsAPI.getTeams();
      setTeams(response.data);
    } catch (error: any) {
      console.error('Error fetching teams:', error);
      setError(error.response?.data?.message || 'Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (teamData: any) => {
    try {
      setError(null);
      await teamsAPI.createTeam(teamData);
      await fetchTeams();
      onStatsUpdate?.();
      setShowCreateModal(false);
    } catch (error: any) {
      console.error('Error creating team:', error);
      setError(error.response?.data?.message || 'Failed to create team');
      throw error;
    }
  };

  const handleUpdateTeam = async (teamId: string, teamData: any) => {
    try {
      setError(null);
      await teamsAPI.updateTeam(teamId, teamData);
      await fetchTeams();
      onStatsUpdate?.();
      setEditingTeam(null);
    } catch (error: any) {
      console.error('Error updating team:', error);
      setError(error.response?.data?.message || 'Failed to update team');
      throw error;
    }
  };

  const handleUpdateKPITargets = async (teamId: string, kpiTargets: any) => {
    try {
      setError(null);
      await teamsAPI.updateKPITargets(teamId, kpiTargets);
      await fetchTeams();
      onStatsUpdate?.();
    } catch (error: any) {
      console.error('Error updating KPI targets:', error);
      setError(error.response?.data?.message || 'Failed to update KPI targets');
    }
  };

  const handleUpdateSLADefaults = async (teamId: string, slaDefaults: any) => {
    try {
      setError(null);
      await teamsAPI.updateSLADefaults(teamId, slaDefaults);
      await fetchTeams();
      onStatsUpdate?.();
    } catch (error: any) {
      console.error('Error updating SLA defaults:', error);
      setError(error.response?.data?.message || 'Failed to update SLA defaults');
    }
  };

  const getPerformanceStatus = (team: Team) => {
    const compliance = team.performance.currentMonth.slaCompliance;
    if (compliance >= 95) return { status: 'excellent', color: '#10b981' };
    if (compliance >= 90) return { status: 'good', color: '#3b82f6' };
    if (compliance >= 85) return { status: 'warning', color: '#f59e0b' };
    return { status: 'poor', color: '#ef4444' };
  };

  return (
    <div className={styles.teamManagementPanel}>
      <div className={styles.panelHeader}>
        <div className={styles.headerLeft}>
          <h2>Team Management</h2>
          <p>Manage teams, assign members, and configure KPI targets</p>
        </div>
        <div className={styles.headerRight}>
          <button 
            className={styles.createButton}
            onClick={() => setShowCreateModal(true)}
            disabled={loading}
          >
            Create Team
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

      <div className={styles.mainContent}>
        {/* Teams List */}
        <div className={styles.teamsSection}>
          <div className={styles.sectionHeader}>
            <h3>Teams Overview</h3>
            <span className={styles.teamCount}>{teams.length} teams</span>
          </div>
          
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading teams...</p>
            </div>
          ) : (
            <div className={styles.teamsGrid}>
              {teams.map(team => {
                const performanceStatus = getPerformanceStatus(team);
                return (
                  <div 
                    key={team.id} 
                    className={`${styles.teamCard} ${selectedTeam?.id === team.id ? styles.selected : ''}`}
                    onClick={() => setSelectedTeam(team)}
                  >
                    <div className={styles.teamHeader}>
                      <div className={styles.teamInfo}>
                        <h4>{team.name}</h4>
                        <p>{team.description}</p>
                      </div>
                      <div 
                        className={styles.performanceIndicator}
                        style={{ backgroundColor: performanceStatus.color }}
                        title={`SLA Compliance: ${team.performance.currentMonth.slaCompliance}%`}
                      >
                        {team.performance.currentMonth.slaCompliance}%
                      </div>
                    </div>
                    
                    <div className={styles.teamDetails}>
                      <div className={styles.teamMetric}>
                        <span className={styles.metricLabel}>Lead:</span>
                        <span className={styles.metricValue}>{team.leadName}</span>
                      </div>
                      <div className={styles.teamMetric}>
                        <span className={styles.metricLabel}>Members:</span>
                        <span className={styles.metricValue}>{team.memberCount}</span>
                      </div>
                      <div className={styles.teamMetric}>
                        <span className={styles.metricLabel}>Department:</span>
                        <span className={styles.metricValue}>{team.department}</span>
                      </div>
                      <div className={styles.teamMetric}>
                        <span className={styles.metricLabel}>Country:</span>
                        <span className={styles.metricValue}>{team.country}</span>
                      </div>
                    </div>
                    
                    <div className={styles.teamPerformance}>
                      <div className={styles.performanceMetric}>
                        <span>Tickets Resolved</span>
                        <span>{team.performance.currentMonth.ticketsResolved}</span>
                      </div>
                      <div className={styles.performanceMetric}>
                        <span>Avg Resolution Time</span>
                        <span>{team.performance.currentMonth.avgResolutionTime}h</span>
                      </div>
                      <div className={styles.performanceMetric}>
                        <span>Satisfaction Score</span>
                        <span>{team.performance.currentMonth.avgSatisfactionScore}/5</span>
                      </div>
                    </div>
                    
                    <div className={styles.teamActions}>
                      <button 
                        className={styles.editButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingTeam(team);
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        className={styles.viewButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTeam(team);
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Team Details Panel */}
        {selectedTeam && (
          <div className={styles.teamDetailsPanel}>
            <div className={styles.detailsHeader}>
              <h3>{selectedTeam.name}</h3>
              <button 
                className={styles.closeDetails}
                onClick={() => setSelectedTeam(null)}
              >
                ×
              </button>
            </div>
            
            <div className={styles.detailsTabs}>
              <button 
                className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                className={`${styles.tab} ${activeTab === 'kpis' ? styles.active : ''}`}
                onClick={() => setActiveTab('kpis')}
              >
                KPI Targets
              </button>
              <button 
                className={`${styles.tab} ${activeTab === 'members' ? styles.active : ''}`}
                onClick={() => setActiveTab('members')}
              >
                Members
              </button>
            </div>
            
            <div className={styles.tabContent}>
              {activeTab === 'overview' && (
                <div className={styles.overviewTab}>
                  <div className={styles.overviewGrid}>
                    <div className={styles.overviewCard}>
                      <h4>Team Information</h4>
                      <div className={styles.infoGrid}>
                        <div className={styles.infoItem}>
                          <span>Lead:</span>
                          <span>{selectedTeam.leadName}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span>Department:</span>
                          <span>{selectedTeam.department}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span>Country:</span>
                          <span>{selectedTeam.country}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span>Members:</span>
                          <span>{selectedTeam.memberCount}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span>Status:</span>
                          <span className={selectedTeam.isActive ? styles.active : styles.inactive}>
                            {selectedTeam.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className={styles.infoItem}>
                          <span>Created:</span>
                          <span>{new Date(selectedTeam.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.overviewCard}>
                      <h4>Current Performance</h4>
                      <div className={styles.performanceGrid}>
                        <div className={styles.performanceItem}>
                          <span className={styles.performanceValue}>
                            {selectedTeam.performance.currentMonth.ticketsResolved}
                          </span>
                          <span className={styles.performanceLabel}>Tickets Resolved</span>
                        </div>
                        <div className={styles.performanceItem}>
                          <span className={styles.performanceValue}>
                            {selectedTeam.performance.currentMonth.avgResolutionTime}h
                          </span>
                          <span className={styles.performanceLabel}>Avg Resolution Time</span>
                        </div>
                        <div className={styles.performanceItem}>
                          <span className={styles.performanceValue}>
                            {selectedTeam.performance.currentMonth.avgSatisfactionScore}/5
                          </span>
                          <span className={styles.performanceLabel}>Satisfaction Score</span>
                        </div>
                        <div className={styles.performanceItem}>
                          <span className={styles.performanceValue}>
                            {selectedTeam.performance.currentMonth.slaCompliance}%
                          </span>
                          <span className={styles.performanceLabel}>SLA Compliance</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'kpis' && (
                <div className={styles.kpiTab}>
                  <div className={styles.kpiSection}>
                    <h4>KPI Targets</h4>
                    <div className={styles.kpiGrid}>
                      <div className={styles.kpiItem}>
                        <label>Monthly Tickets Target</label>
                        <input 
                          type="number" 
                          value={selectedTeam.kpiTargets.monthlyTickets}
                          onChange={(e) => {
                            const newTargets = {
                              ...selectedTeam.kpiTargets,
                              monthlyTickets: parseInt(e.target.value) || 0
                            };
                            handleUpdateKPITargets(selectedTeam.id, newTargets);
                          }}
                        />
                      </div>
                      <div className={styles.kpiItem}>
                        <label>Resolution Time Target (hours)</label>
                        <input 
                          type="number" 
                          value={selectedTeam.kpiTargets.resolutionTime}
                          onChange={(e) => {
                            const newTargets = {
                              ...selectedTeam.kpiTargets,
                              resolutionTime: parseInt(e.target.value) || 0
                            };
                            handleUpdateKPITargets(selectedTeam.id, newTargets);
                          }}
                        />
                      </div>
                      <div className={styles.kpiItem}>
                        <label>Satisfaction Score Target</label>
                        <input 
                          type="number" 
                          step="0.1"
                          min="1"
                          max="5"
                          value={selectedTeam.kpiTargets.satisfactionScore}
                          onChange={(e) => {
                            const newTargets = {
                              ...selectedTeam.kpiTargets,
                              satisfactionScore: parseFloat(e.target.value) || 0
                            };
                            handleUpdateKPITargets(selectedTeam.id, newTargets);
                          }}
                        />
                      </div>
                      <div className={styles.kpiItem}>
                        <label>Response Time Target (minutes)</label>
                        <input 
                          type="number" 
                          value={selectedTeam.kpiTargets.responseTime}
                          onChange={(e) => {
                            const newTargets = {
                              ...selectedTeam.kpiTargets,
                              responseTime: parseInt(e.target.value) || 0
                            };
                            handleUpdateKPITargets(selectedTeam.id, newTargets);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.slaSection}>
                    <h4>SLA Defaults</h4>
                    <div className={styles.slaGrid}>
                      <div className={styles.slaItem}>
                        <label>High Priority (hours)</label>
                        <input 
                          type="number" 
                          value={selectedTeam.slaDefaults.highPriority}
                          onChange={(e) => {
                            const newDefaults = {
                              ...selectedTeam.slaDefaults,
                              highPriority: parseInt(e.target.value) || 0
                            };
                            handleUpdateSLADefaults(selectedTeam.id, newDefaults);
                          }}
                        />
                      </div>
                      <div className={styles.slaItem}>
                        <label>Medium Priority (hours)</label>
                        <input 
                          type="number" 
                          value={selectedTeam.slaDefaults.mediumPriority}
                          onChange={(e) => {
                            const newDefaults = {
                              ...selectedTeam.slaDefaults,
                              mediumPriority: parseInt(e.target.value) || 0
                            };
                            handleUpdateSLADefaults(selectedTeam.id, newDefaults);
                          }}
                        />
                      </div>
                      <div className={styles.slaItem}>
                        <label>Low Priority (hours)</label>
                        <input 
                          type="number" 
                          value={selectedTeam.slaDefaults.lowPriority}
                          onChange={(e) => {
                            const newDefaults = {
                              ...selectedTeam.slaDefaults,
                              lowPriority: parseInt(e.target.value) || 0
                            };
                            handleUpdateSLADefaults(selectedTeam.id, newDefaults);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'members' && (
                <div className={styles.membersTab}>
                  <div className={styles.membersHeader}>
                    <h4>Team Members</h4>
                    <button className={styles.addMemberButton}>
                      Add Member
                    </button>
                  </div>
                  <div className={styles.membersList}>
                    {selectedTeam.memberIds.length > 0 ? (
                      selectedTeam.memberIds.map(memberId => (
                        <div key={memberId} className={styles.memberItem}>
                          <div className={styles.memberInfo}>
                            <span className={styles.memberName}>Member {memberId}</span>
                            <span className={styles.memberRole}>Team Member</span>
                          </div>
                          <button className={styles.removeMemberButton}>
                            Remove
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className={styles.noMembers}>No members assigned to this team</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamManagementPanel;