import type { Roster, ShiftAssignment } from '../types/roster';

const STORAGE_KEY = 'nccpd_rosters';

class RosterService {
  private static instance: RosterService;

  private constructor() {}

  public static getInstance(): RosterService {
    if (!RosterService.instance) {
      RosterService.instance = new RosterService();
    }
    return RosterService.instance;
  }

  private getRosters(): Roster[] {
    const rostersJson = localStorage.getItem(STORAGE_KEY);
    return rostersJson ? JSON.parse(rostersJson) : [];
  }

  private saveRosters(rosters: Roster[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rosters));
  }

  public createRoster(roster: Omit<Roster, 'id'>): Roster {
    const rosters = this.getRosters();
    const newRoster: Roster = {
      ...roster,
      id: Date.now().toString()
    };
    rosters.push(newRoster);
    this.saveRosters(rosters);
    return newRoster;
  }

  public getRoster(id: string): Roster | undefined {
    const rosters = this.getRosters();
    return rosters.find(roster => roster.id === id);
  }

  public getAllRosters(): Roster[] {
    return this.getRosters();
  }

  public updateRoster(updatedRoster: Roster): void {
    const rosters = this.getRosters();
    const index = rosters.findIndex(roster => roster.id === updatedRoster.id);
    if (index !== -1) {
      rosters[index] = updatedRoster;
      this.saveRosters(rosters);
    }
  }

  public deleteRoster(id: string): void {
    const rosters = this.getRosters();
    const filteredRosters = rosters.filter(roster => roster.id !== id);
    this.saveRosters(filteredRosters);
  }

  public addAssignment(rosterId: string, assignment: Omit<ShiftAssignment, 'id'>): void {
    const rosters = this.getRosters();
    const rosterIndex = rosters.findIndex(roster => roster.id === rosterId);
    
    if (rosterIndex !== -1) {
      const roster = rosters[rosterIndex];
      const newAssignment: ShiftAssignment = {
        ...assignment,
        shiftId: assignment.shiftId,
        officerId: assignment.officerId,
        date: assignment.date,
        position: assignment.position
      };
      
      roster.assignments = [...(roster.assignments || []), newAssignment];
      this.saveRosters(rosters);
    }
  }

  public getAssignments(rosterId: string): ShiftAssignment[] {
    const roster = this.getRoster(rosterId);
    return roster?.assignments || [];
  }

  public clearAllData(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export const rosterService = RosterService.getInstance();
