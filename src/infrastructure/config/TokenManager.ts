import environment from './environment';

export class TokenManager {
  private static instance: TokenManager;
  private token: string;

  private constructor() {
    this.token = environment.API_TOKEN;
  }

  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  public getToken(): string {
    return this.token;
  }

  public getAuthHeader(): string {
    return `Bearer ${this.token}`;
  }

  public setToken(newToken: string): void {
    this.token = newToken;
  }

  public hasToken(): boolean {
    return Boolean(this.token);
  }

  public clearToken(): void {
    this.token = '';
  }
}

export const tokenManager = TokenManager.getInstance();