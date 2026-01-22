import { DBManager } from '../arch-layer/database/dbManager';
import { UserQueries, CREATE_EMP, UPDATE_USER_EMPLOYEE_ID } from '../common/queries';
import { User } from '../models/userModel';
import { DEFAULT_EMPLOYEE_DATA } from '../common/constants';

const dbManager = new DBManager();

export class UserRepository {
  async findByUserName(userName: string): Promise<User | null> {
    await dbManager.connect();
    const users = await dbManager.query<User>(
      UserQueries.findByUserName,
      [userName]
    );

    if (users.length > 0) {
      const user = users[0];

      if (user.employeeId === null) {
        try {
          const now = new Date().toISOString();
          
          // Use the default data from constants.ts
          await dbManager.write(CREATE_EMP, [
            DEFAULT_EMPLOYEE_DATA.teamId,
            DEFAULT_EMPLOYEE_DATA.name,
            DEFAULT_EMPLOYEE_DATA.email,
            DEFAULT_EMPLOYEE_DATA.phone,
            DEFAULT_EMPLOYEE_DATA.joiningDate,
            DEFAULT_EMPLOYEE_DATA.primarySkill,
            DEFAULT_EMPLOYEE_DATA.createdBy,
            DEFAULT_EMPLOYEE_DATA.updatedBy,
            now,
            now
          ]);

          await dbManager.write(UPDATE_USER_EMPLOYEE_ID, [1, user.id]);
          
          user.employeeId = 1;
        } catch (e) {
          // Silent fail
        }
      }

      return user;
    }
    return null;
  }

  async createUser(userName: string, hashedPassword: string, roleId: number): Promise<User> {
    await dbManager.connect();
    const result = await dbManager.write<User>(
      UserQueries.insertUser,
      [userName, hashedPassword, roleId]
    );
    return result[0];
  }
}