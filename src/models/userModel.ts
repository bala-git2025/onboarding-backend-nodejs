// models/userModel.ts

export interface User {
  id: number;
  userName: string;
  password: string;
  roleId: number;
  role: string;
  employeeId?: number;
}