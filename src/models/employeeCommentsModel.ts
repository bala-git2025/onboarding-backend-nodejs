export interface EmployeeComments {
  id: number;
  employeeTaskId: number;
  employeeId: number;
  comment?: string;
  createdBy?: number;
  updatedBy?: number;
  createdOn?: string;
  updatedOn?: string;
}
