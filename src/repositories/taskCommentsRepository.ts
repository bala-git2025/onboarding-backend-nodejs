import { DBManager } from "../arch-layer/database/dbManager";
import { TaskComments } from "../models/taskCommentsModel";
import { FETCH_ALL_TASK_COMMENTS, FETCH_TASK_COMMENTS_BY_ID } from "../common/queries";

export class TaskCommentsRepository {
  private dbManager: DBManager;

  constructor() {
    this.dbManager = new DBManager();
  }
  /*   GET /taskComments
    To fetch all the task comments
   */
  async getAllTaskComments(): Promise<TaskComments[]> {
    try {
      await this.dbManager.connect();
      const query = FETCH_ALL_TASK_COMMENTS;
      return await this.dbManager.query<TaskComments>(query);
    } catch (err) {
      throw new Error(`Failed to fetch task comments: ${(err as Error).message}`);
    }
  }

  /*   
  GET taskComments/:taskId
  To Fetch all the task comments using the task Id
*/
  async getTaskCommentsByTaskId(taskId: number): Promise<TaskComments[]> {
    await this.dbManager.connect();
    const tasksComments = await this.dbManager.query<TaskComments>(FETCH_TASK_COMMENTS_BY_ID, [taskId]);
    return tasksComments;
  }
}