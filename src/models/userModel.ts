// models/userModel.ts

export interface User {
  [x: string]: any;
  id: number;
  userName: string;
  password: string;
  roleId: number;
  role: string;
  employeeId?: number;
  employeeName?: string;
}