import { DBManager } from '../arch-layer/database/dbManager';
import {
  ASSIGN_TASK_TO_EMPLOYEE,
  FETCH_TASKS_BY_EMPLOYEE,
  UPDATE_EMPLOYEE_TASK,
  DELETE_EMPLOYEE_TASK
} from '../common/queries';

export interface EmployeeTask {
  id: number;
  employeeId: number;
  taskId: number;
  status?: string;
  poc?: string;
}

export class EmployeeTaskRepository {
  private dbManager: DBManager;

  constructor() {
    this.dbManager = new DBManager();
  }

  // Resolve employee_task.id
  async getEmployeeTaskId(
    employeeId: number,
    taskId: number
  ): Promise<number | null> {
    await this.dbManager.connect();

    const rows = await this.dbManager.query<{ id: number }>(
      'SELECT id FROM employee_task WHERE employeeId = ? AND taskId = ?',
      [employeeId, taskId]
    );

    return rows.length > 0 ? rows[0].id : null;
  }

  //  Assign task (with duplicate check)
  async assignTask(
    employeeId: number,
    taskId: number,
    status?: string,
    poc?: string
  ): Promise<void> {
    await this.dbManager.connect();

    const existing = await this.getEmployeeTaskId(employeeId, taskId);
    if (existing) {
      throw new Error('Task already assigned to this employee');
    }

    await this.dbManager.write(ASSIGN_TASK_TO_EMPLOYEE, [
      employeeId,
      taskId,
      status ?? null,
      poc ?? null
    ]);
  }

  //  Get tasks for employee
  async getTasksByEmployee(employeeId: number): Promise<EmployeeTask[]> {
    await this.dbManager.connect();
    return this.dbManager.query<EmployeeTask>(
      FETCH_TASKS_BY_EMPLOYEE,
      [employeeId]
    );
  }

  //  Update mapping
  async updateEmployeeTask(
    employeeTaskId: number,
    status?: string,
    poc?: string
  ): Promise<void> {
    await this.dbManager.connect();
    await this.dbManager.write(UPDATE_EMPLOYEE_TASK, [
      status ?? null,
      poc ?? null,
      employeeTaskId
    ]);
  }

  //  Remove mapping
  async removeEmployeeTask(employeeTaskId: number): Promise<void> {
    await this.dbManager.connect();
    await this.dbManager.write(DELETE_EMPLOYEE_TASK, [employeeTaskId]);
  }
}
