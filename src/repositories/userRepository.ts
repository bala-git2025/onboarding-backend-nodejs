import { DBManager } from "../arch-layer/database/dbManager";
import { UserQueries, CREATE_EMP } from "../common/queries";
import { User } from "../models/userModel";
import { DEFAULT_EMPLOYEE_DATA } from "../common/constants";

const dbManager = new DBManager();

export class UserRepository {
  /**
   * Find user by username
   */
  async findByUserName(userName: string): Promise<User | null> {
    await dbManager.connect();
    const users = await dbManager.query<User>(UserQueries.findByUserName, [
      userName,
    ]);

    if (users.length > 0) {
      const user = users[0];

      // If user has no employeeId, create a default employee record
      if (user.employeeId === null || user.employeeId === undefined) {
        try {
          const now = new Date().toISOString();

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
            now,
          ]);

          // For simplicity, assume the newly created employee has ID = 1
          await dbManager.write(UserQueries.updateUserEmployeeId, [1, user.id]);

          user.employeeId = 1;
        } catch (e) {
          // Silent fail
        }
      }

      return user;
    }
    return null;
  }

  /**
   * Create a new user
   */
  async createUser(
    userName: string,
    hashedPassword: string,
    roleId: number,
  ): Promise<User> {
    await dbManager.connect();
    const result = await dbManager.write<User>(UserQueries.insertUser, [
      userName,
      hashedPassword,
      roleId,
    ]);
    return result[0];
  }

  /**
   * Find user by ID
   */
  async findById(userId: number): Promise<User | null> {
    await dbManager.connect();
    const users = await dbManager.query<User>(UserQueries.findUserById, [
      userId,
    ]);

    return users.length > 0 ? users[0] : null;
  }

  /**
   * Get enriched employee profile (via user’s employeeId)
   */
  async getProfile(employeeId: number): Promise<User | null> {
    await dbManager.connect();
    const result = await dbManager.query<User>(UserQueries.findUserProfile, [
      employeeId,
    ]);
    return result.length > 0 ? result[0] : null;
  }

  /**
   * Update employee profile fields (email, phone, primarySkill)
   */
  async updateProfile(
    employeeId: number,
    updates: { email?: string; phone?: string; primarySkill?: string },
  ): Promise<User> {
    await dbManager.connect();
    const now = new Date().toISOString();
    const result = await dbManager.write<User>(UserQueries.updateUserProfile, [
      updates.email,
      updates.phone,
      updates.primarySkill,
      "system",
      now,
      employeeId,
    ]);
    return result[0];
  }
}
