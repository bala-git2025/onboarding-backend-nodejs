import { DBManager } from "../arch-layer/database/dbManager";
import { teamModel } from "../models/teamModel";
import { GET_TEAM_LIST, GET_TEAM_DETAILS, CREATE_EMPLOYEE_TASK, CHECK_TASK_EXISTS } from "../common/queries";
import { EmployeeTask } from "../models/employeeTaskModel";


export class ManagerRepository {
    private dbManager: DBManager

    constructor() {
        this.dbManager = new DBManager();
    }

    async getAllManagersList(): Promise<teamModel[]> {
        await this.dbManager.connect();
        const query = GET_TEAM_LIST;
        return await this.dbManager.query<teamModel>(query);
    }

    async getTeamDetails(id: number): Promise<any[]> {
        await this.dbManager.connect();
        const query = GET_TEAM_DETAILS;
        return await this.dbManager.query(query, [id]);
    }


    async createTask(employeeTaskData: Partial<EmployeeTask>): Promise<EmployeeTask> {

        await this.dbManager.connect();

        if (!employeeTaskData.employeeId || !employeeTaskData.taskId) {
            throw new Error('EmployeeId and task Id are required');
        }

        const [createdTask] = await this.dbManager.excuteWriteReturn(CREATE_EMPLOYEE_TASK, [
            employeeTaskData.employeeId ?? null,
            employeeTaskData.taskId ?? null,
            employeeTaskData.status,
            employeeTaskData.poc,
            employeeTaskData.dueDate,
            employeeTaskData.createdBy ?? null,
            employeeTaskData.updatedBy ?? null,
            employeeTaskData.createdOn ?? new Date().toISOString(),
            employeeTaskData.updatedOn ?? new Date().toISOString(),
        ]);



        if (!createdTask) {
            throw new Error('Failed to create and retrieve the new employee.');
        }

        return createdTask as EmployeeTask;
    }

}