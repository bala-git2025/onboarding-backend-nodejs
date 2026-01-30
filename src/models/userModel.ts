// models/userModel.ts

export interface AuthUser {
  id: number;
  role: string;
}

export interface User {
  [x: string]: any;
  id: number;
  userName: string;
  password: string;
  roleId: number;
  role: string;
  employeeId?: number;
  employeeName?: string;

  email?: string;
  phone?: string;
  primarySkill?: string;
  teamName?: string;
  joiningDate?: string;
  lastUpdated?: string;
}


export interface ResponsePayload{
      token: string;
      role: string;
      userName: string;
      employeeId: number;
      employeeName?: string;
}