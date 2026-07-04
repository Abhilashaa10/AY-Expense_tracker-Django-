import api from './api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
}

const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/login/', credentials);
    return {
      token: response.data.token,
      username: credentials.username,
    };
  },

  async register(data: RegisterData): Promise<void> {
    await api.post('/register/', {
      username: data.username,
      password: data.password,
    });
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default authService;