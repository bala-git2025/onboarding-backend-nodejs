import { DBManager } from '../arch-layer/database/dbManager';
import { FETCH_TASKS, FETCH_TASK_BY_ID, CREATE_TASK, UPDATE_TASK_BY_ID, DELETE_TASK_BY_ID, CREATED_TASK } from '../common/queries';
import { Task } from '../models/taskModel';

export class TaskRepository {
  private dbManager: DBManager;

  constructor() {
    this.dbManager = new DBManager();
  }

  async getAllTasks(): Promise<Task[]> {
    await this.dbManager.connect();
    const query = FETCH_TASKS;
    return await this.dbManager.query<Task>(query);
  }

  async getTaskById(id: number): Promise<Task | null> {
    await this.dbManager.connect();
    const tasks = await this.dbManager.query<Task>(FETCH_TASK_BY_ID, [id]);
    return tasks.length > 0 ? tasks[0] : null;
  }

  async createTask(taskData: Partial<Task>): Promise<Task> {
    await this.dbManager.connect();

    if (!taskData.name) throw new Error('Task name is required');

    const now = new Date().toISOString();
    const taskToCreate = {
      ...taskData,
      createdOn: taskData.createdOn || now,
      updatedOn: taskData.updatedOn || now,
      createdBy: taskData.createdBy || null,
      updatedBy: taskData.updatedBy || null,
    };

    await this.dbManager.write(CREATE_TASK, [
      taskToCreate.name,
      taskToCreate.description || null,
      taskToCreate.category || null,
      taskToCreate.createdBy,
      taskToCreate.updatedBy,
      taskToCreate.createdOn,
      taskToCreate.updatedOn,
    ]);

    const createdTasks = await this.dbManager.query<Task>(CREATED_TASK);

    if (createdTasks.length === 0) {
      throw new Error('Failed to create and retrieve the new task.');
    }
    return createdTasks[0];
  }

  async updateTask(id: number, updateData: Partial<Task>): Promise<Task | null> {
    await this.dbManager.connect();

    const existingTask = await this.getTaskById(id);
    if (!existingTask) return null;

    const fieldsToUpdate = {
      name: updateData.name ?? existingTask.name,
      description: updateData.description ?? existingTask.description,
      category: updateData.category ?? existingTask.category,
      updatedBy: updateData.updatedBy ?? existingTask.updatedBy,
      updatedOn: new Date().toISOString(),
    };

    await this.dbManager.write(UPDATE_TASK_BY_ID, [
      fieldsToUpdate.name,
      fieldsToUpdate.description,
      fieldsToUpdate.category,
      fieldsToUpdate.updatedBy,
      fieldsToUpdate.updatedOn,
      id
    ]);

    const updatedTask = await this.getTaskById(id);

    if (updatedTask && updatedTask.updatedOn !== existingTask.updatedOn) {
      return updatedTask;
    }

    return null;
  }

  async deleteTask(id: number): Promise<boolean> {
    // FIX: Explicitly connect before any operation
    await this.dbManager.connect();

    const existingTask = await this.getTaskById(id);
    if (!existingTask) return false;

    await this.dbManager.write(DELETE_TASK_BY_ID, [id]);

    const deletedTask = await this.getTaskById(id);
    return deletedTask === null;
  }
}