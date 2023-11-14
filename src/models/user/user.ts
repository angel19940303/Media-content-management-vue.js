export interface User {
  id: number;
  userName: string;
  email: string;
  isAdmin: boolean;
  locked: boolean;
  name: string;
  permissions: number;
  password: string | undefined;
  createdAt: string | undefined;
}
