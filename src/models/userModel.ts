// models/userModel.ts

export interface User {
  id: number;
  username: string;
  password: string;
  roleId: number;
  role: string;
}