export interface EmployeeTask{
    id: number;
    employeeId: number;
    taskId: number;
    status: string;
    poc: string;
    dueDate: Date;
    createdBy?: number;
    updatedBy?: number;
    createdOn?: string;
    updatedOn?: string;

}