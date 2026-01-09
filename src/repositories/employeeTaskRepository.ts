import { DBManager } from '../arch-layer/database/dbManager';
import {
  ASSIGN_TASK_TO_EMPLOYEE,
  FETCH_TASKS_BY_EMPLOYEE,
  UPDATE_EMPLOYEE_TASK,
  DELETE_EMPLOYEE_TASK
} from '../common/queries';

export class EmployeeTaskRepository {
  private dbManager: DBManager;

  constructor() {
    this.dbManager = new DBManager();
  }

  async assignTask(
    employeeId: number,
    taskId: number,
    status?: string,
    poc?: string
  ): Promise<void> {
    await this.dbManager.connect();
    await this.dbManager.write(ASSIGN_TASK_TO_EMPLOYEE, [
      employeeId,
      taskId,
      status || null,
      poc || null
    ]);
  }

  async getTasksByEmployee(employeeId: number) {
    await this.dbManager.connect();
    return await this.dbManager.query(
      FETCH_TASKS_BY_EMPLOYEE,
      [employeeId]
    );
  }

  async updateEmployeeTask(
    employeeTaskId: number,
    status?: string,
    poc?: string
  ): Promise<void> {
    await this.dbManager.connect();
    await this.dbManager.write(UPDATE_EMPLOYEE_TASK, [
      status || null,
      poc || null,
      employeeTaskId
    ]);
  }

  async removeEmployeeTask(employeeTaskId: number): Promise<void> {
    await this.dbManager.connect();
    await this.dbManager.write(DELETE_EMPLOYEE_TASK, [employeeTaskId]);
  }
}
