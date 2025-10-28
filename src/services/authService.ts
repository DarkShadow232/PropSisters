import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    email: string;
    displayName: string;
    phoneNumber?: string;
    photoURL?: string;
    role: string;
    isEmailVerified?: boolean;
  };
}

export interface RegisterData {
  email: string;
  password: string;
  displayName: string;
  phoneNumber?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

/**
 * Auth Service - MongoDB-based authentication
 */
class AuthService {
  private axiosInstance;

  constructor() {
    console.log('🔗 AuthService: Initializing with base URL:', API_BASE_URL);
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true, // Important for session cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Register new user with email and password (MongoDB)
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await this.axiosInstance.post('/auth/register', data);
      return response.data as AuthResponse;
    } catch (error: any) {
      console.error('Error registering user:', error);
      throw new Error(error.response?.data?.message || 'Failed to register user');
    }
  }

  /**
   * Login with email and password (MongoDB)
   */
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      console.log('AuthService: Making request to:', this.axiosInstance.defaults.baseURL + '/auth/login');
      const response = await this.axiosInstance.post('/auth/login', data);
      console.log('AuthService: Response received:', response.data);
      return response.data as AuthResponse;
    } catch (error: any) {
      console.error('Error logging in:', error);
      throw new Error(error.response?.data?.message || 'Failed to login');
    }
  }


  /**
   * Verify current session
   */
  async verifySession(): Promise<AuthResponse> {
    try {
      const response = await this.axiosInstance.get('/auth/verify');
      return response.data as AuthResponse;
    } catch (error: any) {
      console.error('Error verifying session:', error);
      throw new Error(error.response?.data?.message || 'Session verification failed');
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<AuthResponse> {
    try {
      const response = await this.axiosInstance.get('/auth/me');
      return response.data as AuthResponse;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get current user');
    }
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      await this.axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Error logging out:', error);
      // Don't throw - still try to clean up locally
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: { 
    displayName?: string; 
    phoneNumber?: string;
    photoURL?: string 
  }): Promise<AuthResponse> {
    try {
      const response = await this.axiosInstance.put('/auth/profile', updates);
      return response.data as AuthResponse;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  }

  /**
   * Change password (for email/password users only)
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<AuthResponse> {
    try {
      const response = await this.axiosInstance.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
      return response.data as AuthResponse;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to change password');
    }
  }
}

export const authService = new AuthService();
export default authService;
