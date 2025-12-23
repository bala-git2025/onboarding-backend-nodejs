// employeeRepository.ts
import { DBManager } from '../arch-layer/database/dbManager';
import { Employee } from '../models/employeeModel';

export class EmployeeRepository {
  private dbManager: DBManager;

  constructor() {
    this.dbManager = new DBManager();
  }

  async getAllEmployees(): Promise<Employee[]> {
    try {
      // Ensure DB connection before querying
      await this.dbManager.connect();

      const query = 'SELECT * FROM Employees';
      return await this.dbManager.query<Employee>(query);
    } catch (err) {
      throw new Error(`Failed to fetch employees: ${(err as Error).message}`);
    }
  }

}