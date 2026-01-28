export interface EmployeeTask {
    id: number;
    employeeId: number;
    taskId: number;
    status: string;
    poc: string;
    dueDate: string | null;
    createdBy?: number;
    updatedBy?: number;
    createdOn?: string;
    updatedOn?: string;

}