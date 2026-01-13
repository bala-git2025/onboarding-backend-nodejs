import { DBManager } from '../arch-layer/database/dbManager';
import { UserQueries } from '../common/queries';
import { User } from '../models/userModel';

const dbManager = new DBManager();

export class UserRepository {
  async findByUsername(username: string): Promise<User | null> {
    await dbManager.connect();
    const users = await dbManager.query<User>(
      UserQueries.findByUsername,
      [username]
    );
    return users.length > 0 ? users[0] : null;
  }

  async createUser(username: string, hashedPassword: string, roleId: number): Promise<User> {
    await dbManager.connect();
    const result = await dbManager.write<User>(
      UserQueries.insertUser,
      [username, hashedPassword, roleId]
    );
    return result[0];
  }
}