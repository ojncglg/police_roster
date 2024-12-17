export interface User {
  username: string;
  role: 'admin';
  lastLogin: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

class AuthService {
  private static instance: AuthService;
  private readonly STORAGE_KEY = 'nccpd_auth';

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async login(credentials: LoginCredentials): Promise<User> {
    // TODO: Replace with actual API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.username === 'admin' && credentials.password === 'admin') {
          const user: User = {
            username: credentials.username,
            role: 'admin',
            lastLogin: new Date().toISOString()
          };
          this.setUser(user);
          resolve(user);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500); // Simulate network delay
    });
  }

  public logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    // Clear any other stored data if needed
    localStorage.removeItem('nccpd_officers');
    localStorage.removeItem('nccpd_rosters');
  }

  public isAuthenticated(): boolean {
    const user = this.getUser();
    return !!user;
  }

  public getUser(): User | null {
    const userJson = localStorage.getItem(this.STORAGE_KEY);
    if (!userJson) return null;

    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }

  private setUser(user: User): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }

  public updateLastLogin(): void {
    const user = this.getUser();
    if (user) {
      user.lastLogin = new Date().toISOString();
      this.setUser(user);
    }
  }

  public requireAuth(navigate: (path: string) => void): void {
    if (!this.isAuthenticated()) {
      navigate('/login');
    }
  }
}

export const authService = AuthService.getInstance();
