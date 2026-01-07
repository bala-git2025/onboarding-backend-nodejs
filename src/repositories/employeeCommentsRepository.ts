import { DBManager } from "../arch-layer/database/dbManager";
import { EmployeeComments } from "../models/employeeCommentsModel";
import { FETCH_ALL_EMPLOYEE_COMMENTS } from "../common/queries";

export class EmployeeCommentsRepository {
  private dbManager: DBManager;

  constructor() {
    this.dbManager = new DBManager();
  }

  /*   GET /employeeComments
       To fetch all the employee comments
  */
  async getAllEmployeeComments(): Promise<EmployeeComments[]> {
    try {
      await this.dbManager.connect();
      const query = FETCH_ALL_EMPLOYEE_COMMENTS;
      return await this.dbManager.query<EmployeeComments>(query);
    } catch (err) {
      throw new Error(
        `Failed to fetch employee comments: ${(err as Error).message}`
      );
    }
  }
}
