// employeeModel.ts
export interface Employee {
  id: number;
  teamId: number;
  name: string;
  email: string;
  phone: string;
  joiningDate: string;
  primarySkill: string;
  createdBy?: number;
  updatedBy?: number;
  createdOn?: string;
  updatedOn?: string;
}