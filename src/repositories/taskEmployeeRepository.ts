import { DBManager } from '../arch-layer/database/dbManager';
import {
  FETCH_EMPLOYEES_BY_TASKID,
  CHECK_TASK_EXISTS,
  CHECK_EMPLOYEE_EXISTS,
  CHECK_ASSIGNMENT_EXISTS,
  CREATE_EMPLOYEE_TASK_ASSIGNMENT,
  FETCH_CREATED_ASSIGNMENT
} from '../common/queries';

export class TaskEmployeeRepository {
  private dbManager: DBManager;

  constructor() {
    this.dbManager = new DBManager();
  }

  async getEmployeesByTask(taskId: number) {
    await this.dbManager.connect();
    return await this.dbManager.query(FETCH_EMPLOYEES_BY_TASKID, [taskId]);
  }

  async checkTaskExists(taskId: number): Promise<boolean> {
    await this.dbManager.connect();
    const result = await this.dbManager.query(CHECK_TASK_EXISTS, [taskId]);
    return result.length > 0;
  }

  async checkEmployeeExists(employeeId: number): Promise<boolean> {
    await this.dbManager.connect();
    const result = await this.dbManager.query(CHECK_EMPLOYEE_EXISTS, [employeeId]);
    return result.length > 0;
  }

  async checkAssignmentExists(taskId: number, employeeId: number): Promise<boolean> {
    await this.dbManager.connect();
    const result = await this.dbManager.query(CHECK_ASSIGNMENT_EXISTS, [taskId, employeeId]);
    return result.length > 0;
  }

  async assignEmployeeToTask(
    taskId: number,
    employeeId: number,
    status?: string,
    poc?: string,
    createdBy?: number,
    updatedBy?: number
  ) {
    await this.dbManager.connect();
    const now = new Date().toISOString();

    await this.dbManager.write(CREATE_EMPLOYEE_TASK_ASSIGNMENT, [
      employeeId,
      taskId,
      status || null,
      poc || null,
      createdBy || null,
      updatedBy || null,
      now,
      now
    ]);

    const result = await this.dbManager.query(FETCH_CREATED_ASSIGNMENT, [taskId, employeeId]);
    return result[0];
  }
}