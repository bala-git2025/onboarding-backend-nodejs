import { DBManager } from '../arch-layer/database/dbManager';
import { FECTH_TASKS, FETCH_TASK_BY_ID } from '../common/queries';
import { Task } from '../models/taskModel';

const CREATE_TASK = `
  INSERT INTO tasks (name, description, category, createdBy, updatedBy, createdOn, updatedOn)
  VALUES (?, ?, ?, ?, ?, ?, ?)
  RETURNING *;
`;

export class TaskRepository {
  private dbManager: DBManager;

  constructor() {
    this.dbManager = new DBManager();
  }

  // To retrieve all the Tasks
  async getAllTasks(): Promise<Task[]> {
    try {
      await this.dbManager.connect();
      const query = FECTH_TASKS;
      return await this.dbManager.query<Task>(query);
    } catch (err) {
      throw new Error(`Failed to fetch tasks: ${(err as Error).message}`);
    }
  }
  
  // To retrieve Task by Id
  async getTaskById(id: number): Promise<Task | null> {
    try {
      await this.dbManager.connect();
      const query = FETCH_TASK_BY_ID;
      const tasks = await this.dbManager.query<Task>(query, [id]);
      return tasks.length > 0 ? tasks[0] : null;
    } catch (err) {
      throw new Error(`Failed to fetch tasks with ${id}: ${(err as Error).message}`);
    }
  }

  // To create a new Task
  async createTask(taskData: Partial<Task>): Promise<Task> {
    try {
      await this.dbManager.connect();

      // Set default values for createdOn and updatedOn if not provided
      const now = new Date().toISOString();
      const createdOn = taskData.createdOn || now;
      const updatedOn = taskData.updatedOn || now;

      const result = await this.dbManager.query<Task>(CREATE_TASK, [
        taskData.name,
        taskData.description || null,
        taskData.category || null,
        taskData.createdBy || null,
        taskData.updatedBy || null,
        createdOn,
        updatedOn,
      ]);
      return result[0];
    } catch(err) {
      throw new Error(`Failed to create a new task: ${(err as Error).message}`);
    }
  }
}