export interface AuthUser {
  id: string;
  username: string;
  email: string;
  wallet: {
    balance: number
  }
}
