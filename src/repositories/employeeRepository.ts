import { DBManager } from '../arch-layer/database/dbManager';
import {
  FETCH_EMPLOYEES,
  SELECT_EMP_BY_ID,
  CREATE_EMP,
  UPDATE_EMP_BY_ID,
  DELETE_EMP_BY_ID,
  CREATED_EMP
} from '../common/queries';
import { Employee } from '../models/employeeModel';

export class EmployeeRepository {
  private dbManager: DBManager;

  constructor() {
    this.dbManager = new DBManager();
  }

  async getAllEmployees(): Promise<Employee[]> {
    await this.dbManager.connect();
    const query = FETCH_EMPLOYEES;
    return await this.dbManager.query<Employee>(query);
  }

  async getEmployeeById(id: number): Promise<Employee | null> {
    await this.dbManager.connect();
    const employees = await this.dbManager.query<Employee>(
      SELECT_EMP_BY_ID,
      [id]
    );
    return employees.length > 0 ? employees[0] : null;
  }

  async createEmployee(employeeData: Partial<Employee>): Promise<Employee> {
    await this.dbManager.connect();

    if (!employeeData.name) throw new Error('Employee name is required');
    if (!employeeData.email) throw new Error('Employee email is required');

    const now = new Date().toISOString();

    const employeeToCreate = {
      ...employeeData,
      createdOn: employeeData.createdOn || now,
      updatedOn: employeeData.updatedOn || now,
      createdBy: employeeData.createdBy || null,
      updatedBy: employeeData.updatedBy || null,
    };

    await this.dbManager.write(CREATE_EMP, [
      employeeToCreate.teamId,
      employeeToCreate.name,
      employeeToCreate.email,
      employeeToCreate.phone,
      employeeToCreate.joiningDate,
      employeeToCreate.primarySkill,
      employeeToCreate.createdBy,
      employeeToCreate.updatedBy,
      employeeToCreate.createdOn,
      employeeToCreate.updatedOn,
    ]);

    const createdEmployees = await this.dbManager.query<Employee>(CREATED_EMP);

    if (createdEmployees.length === 0) {
      throw new Error('Failed to create and retrieve the new employee.');
    }

    return createdEmployees[0];
  }

  async updateEmployee(
    id: number,
    updateData: Partial<Employee>
  ): Promise<Employee | null> {
    await this.dbManager.connect();

    const existingEmployee = await this.getEmployeeById(id);
    if (!existingEmployee) return null;

    const fieldsToUpdate = {
      teamId: updateData.teamId ?? existingEmployee.teamId,
      name: updateData.name ?? existingEmployee.name,
      email: updateData.email ?? existingEmployee.email,
      phone: updateData.phone ?? existingEmployee.phone,
      joiningDate: updateData.joiningDate ?? existingEmployee.joiningDate,
      primarySkill: updateData.primarySkill ?? existingEmployee.primarySkill,
      updatedBy: updateData.updatedBy ?? existingEmployee.updatedBy,
      updatedOn: new Date().toISOString(),
    };

    await this.dbManager.write(UPDATE_EMP_BY_ID, [
      fieldsToUpdate.teamId,
      fieldsToUpdate.name,
      fieldsToUpdate.email,
      fieldsToUpdate.phone,
      fieldsToUpdate.joiningDate,
      fieldsToUpdate.primarySkill,
      fieldsToUpdate.updatedBy,
      fieldsToUpdate.updatedOn,
      id
    ]);

    const updatedEmployee = await this.getEmployeeById(id);

    if (
      updatedEmployee &&
      updatedEmployee.updatedOn !== existingEmployee.updatedOn
    ) {
      return updatedEmployee;
    }

    return null;
  }

  async deleteEmployee(id: number): Promise<boolean> {
    await this.dbManager.connect();

    const existingEmployee = await this.getEmployeeById(id);
    if (!existingEmployee) return false;

    await this.dbManager.write(DELETE_EMP_BY_ID, [id]);

    const deletedEmployee = await this.getEmployeeById(id);
    return deletedEmployee === null;
  }
}
