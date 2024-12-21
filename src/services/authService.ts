/**
 * @file authService.ts
 * @description Authentication service that handles user login, logout, and session management.
 * Implements the Singleton pattern to ensure only one instance exists throughout the application.
 */

/**
 * User interface representing an authenticated user
 * @interface User
 */
export interface User {
  username: string;
  role: 'admin';
  lastLogin: string;
  squad: 'A' | 'B' | 'C' | 'D';
}

/**
 * Login credentials interface for authentication
 * @interface LoginCredentials
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Authentication Service Class
 * Manages user authentication and session state using localStorage
 * Implements the Singleton pattern to ensure single instance
 */
class AuthService {
  private static instance: AuthService;
  private readonly STORAGE_KEY = 'nccpd_auth';

  /**
   * Private constructor to prevent direct instantiation
   * Part of Singleton pattern implementation
   */
  private constructor() {}

  /**
   * Gets the singleton instance of AuthService
   * Creates new instance if one doesn't exist
   */
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Authenticates user with provided credentials
   * Currently simulates API call with mock data
   * 
   * @param credentials - User login credentials
   * @returns Promise resolving to User object if authentication successful
   * @throws Error if credentials are invalid
   */
  public async login(credentials: LoginCredentials): Promise<User> {
    // Simulate API call with multiple admin users
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock valid credentials for different squad admins
        const validCredentials = [
          { username: 'admin1', password: 'admin1' },
          { username: 'admin2', password: 'admin2' },
          { username: 'admin3', password: 'admin3' },
          { username: 'admin4', password: 'admin4' }
        ];

        // Check if provided credentials match any valid admin
        const matchedAdmin = validCredentials.find(
          admin => admin.username === credentials.username && admin.password === credentials.password
        );

        if (matchedAdmin) {
          // Map admin usernames to their respective squads
          const squadMap: Record<string, 'A' | 'B' | 'C' | 'D'> = {
            'admin1': 'A',
            'admin2': 'B',
            'admin3': 'C',
            'admin4': 'D'
          };

          // Create user object with authentication data
          const user: User = {
            username: matchedAdmin.username,
            role: 'admin',
            lastLogin: new Date().toISOString(),
            squad: squadMap[matchedAdmin.username]
          };
          this.setUser(user);
          resolve(user);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500); // Simulate network delay
    });
  }

  /**
   * Logs out the current user
   * Removes all authentication-related data from localStorage
   */
  public logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    // Clear additional stored data
    localStorage.removeItem('nccpd_officers');
    localStorage.removeItem('nccpd_rosters');
  }

  /**
   * Checks if a user is currently authenticated
   * @returns boolean indicating authentication status
   */
  public isAuthenticated(): boolean {
    const user = this.getUser();
    return !!user;
  }

  /**
   * Retrieves the current user from localStorage
   * @returns User object if found and valid, null otherwise
   */
  public getUser(): User | null {
    const userJson = localStorage.getItem(this.STORAGE_KEY);
    if (!userJson) return null;

    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }

  /**
   * Stores user data in localStorage
   * @param user - User object to store
   */
  private setUser(user: User): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }

  /**
   * Updates the last login timestamp for the current user
   */
  public updateLastLogin(): void {
    const user = this.getUser();
    if (user) {
      user.lastLogin = new Date().toISOString();
      this.setUser(user);
    }
  }

  /**
   * Enforces authentication requirement
   * Redirects to login page if user is not authenticated
   * 
   * @param navigate - Navigation function to redirect user
   */
  public requireAuth(navigate: (path: string) => void): void {
    if (!this.isAuthenticated()) {
      navigate('/login');
    }
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();
