/**
 * @file rosterService.ts
 * @description Service for managing roster data, including CRUD operations for rosters,
 * shift assignments, and training days. Implements the Singleton pattern and uses
 * localStorage for data persistence.
 */

import type { Roster, ShiftAssignment } from '../types/roster';

// Storage key for roster data in localStorage
const STORAGE_KEY = 'nccpd_rosters';

/**
 * RosterService Class
 * Manages all roster-related operations using the Singleton pattern
 */
class RosterService {
  private static instance: RosterService;

  /**
   * Private constructor to prevent direct instantiation
   * Part of Singleton pattern implementation
   */
  private constructor() {}

  /**
   * Gets the singleton instance of RosterService
   * Creates new instance if one doesn't exist
   */
  public static getInstance(): RosterService {
    if (!RosterService.instance) {
      RosterService.instance = new RosterService();
    }
    return RosterService.instance;
  }

  /**
   * Retrieves all rosters from localStorage
   * @returns Array of Roster objects
   */
  private getRosters(): Roster[] {
    const rostersJson = localStorage.getItem(STORAGE_KEY);
    return rostersJson ? JSON.parse(rostersJson) : [];
  }

  /**
   * Saves rosters to localStorage
   * @param rosters - Array of rosters to save
   */
  private saveRosters(rosters: Roster[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rosters));
  }

  /**
   * Creates a new roster
   * @param roster - Roster data without ID
   * @returns Created roster with generated ID
   */
  public createRoster(roster: Omit<Roster, 'id'>): Roster {
    const rosters = this.getRosters();
    const newRoster: Roster = {
      ...roster,
      id: Date.now().toString() // Generate unique ID using timestamp
    };
    rosters.push(newRoster);
    this.saveRosters(rosters);
    return newRoster;
  }

  /**
   * Retrieves a specific roster by ID
   * @param id - Roster ID to find
   * @returns Roster if found, undefined otherwise
   */
  public getRoster(id: string): Roster | undefined {
    const rosters = this.getRosters();
    return rosters.find(roster => roster.id === id);
  }

  /**
   * Retrieves all rosters
   * @returns Array of all rosters
   */
  public getAllRosters(): Roster[] {
    return this.getRosters();
  }

  /**
   * Updates an existing roster
   * @param updatedRoster - Roster with updated data
   */
  public updateRoster(updatedRoster: Roster): void {
    const rosters = this.getRosters();
    const index = rosters.findIndex(roster => roster.id === updatedRoster.id);
    if (index !== -1) {
      rosters[index] = updatedRoster;
      this.saveRosters(rosters);
    }
  }

  /**
   * Deletes a roster by ID
   * @param id - ID of roster to delete
   */
  public deleteRoster(id: string): void {
    const rosters = this.getRosters();
    const filteredRosters = rosters.filter(roster => roster.id !== id);
    this.saveRosters(filteredRosters);
  }

  /**
   * Adds a shift assignment to a roster
   * @param rosterId - ID of roster to add assignment to
   * @param assignment - Assignment data
   */
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

  /**
   * Retrieves all assignments for a roster
   * @param rosterId - ID of roster to get assignments for
   * @returns Array of shift assignments
   */
  public getAssignments(rosterId: string): ShiftAssignment[] {
    const roster = this.getRoster(rosterId);
    return roster?.assignments || [];
  }

  /**
   * Adds a training day to a roster
   * @param rosterId - ID of roster to add training day to
   * @param trainingDay - Training day data
   */
  public addTrainingDay(rosterId: string, trainingDay: { date: string; description?: string }): void {
    const rosters = this.getRosters();
    const rosterIndex = rosters.findIndex(roster => roster.id === rosterId);
    
    if (rosterIndex !== -1) {
      const roster = rosters[rosterIndex];
      roster.trainingDays = [...(roster.trainingDays || []), trainingDay];
      this.saveRosters(rosters);
    }
  }

  /**
   * Removes a training day from a roster
   * @param rosterId - ID of roster to remove training day from
   * @param date - Date of training day to remove
   */
  public removeTrainingDay(rosterId: string, date: string): void {
    const rosters = this.getRosters();
    const rosterIndex = rosters.findIndex(roster => roster.id === rosterId);
    
    if (rosterIndex !== -1) {
      const roster = rosters[rosterIndex];
      roster.trainingDays = roster.trainingDays.filter(td => td.date !== date);
      this.saveRosters(rosters);
    }
  }

  /**
   * Retrieves all training days for a roster
   * @param rosterId - ID of roster to get training days for
   * @returns Array of training days
   */
  public getTrainingDays(rosterId: string): { date: string; description?: string }[] {
    const roster = this.getRoster(rosterId);
    return roster?.trainingDays || [];
  }

  /**
   * Clears all roster data from localStorage
   * Useful for testing or resetting the application
   */
  public clearAllData(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}

// Export singleton instance
export const rosterService = RosterService.getInstance();
