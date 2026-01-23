import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { send200, send201, send401, send500 } from '../arch-layer/response/reponse';
import { UserRepository } from '../repositories/userRepository';
import { EmployeeRepository } from '../repositories/employeeRepository';
import { User } from '../models/userModel';
import { Employee } from '../models/employeeModel';

const router = Router();
const userRepo = new UserRepository();
const employeeRepo = new EmployeeRepository();
const SECRET_KEY = process.env.JWT_SECRET || 'super_secret_key';

/**
 * POST /auth/login
 */
router.post('/login', async (req, res) => {
  const { userName, password } = req.body;

  try {
    const user: User | null = await userRepo.findByUserName(userName);

    if (!user) {
      return send401(res, req.path, new Error('Invalid credentials'));
    }

    if (!user.employeeId) {
      return send401(res, req.path, new Error('User account is not associated with an employee.'));
    }

        // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return send401(res, req.path, new Error('Invalid credentials'));
    }

    const employee: Employee | null = await employeeRepo.getEmployeeById(user.employeeId);

    if (!employee) {
      return send500(res, req.path, new Error('Associated employee record not found.'));
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    const responsePayload = {
      token,
      role: user.role,
      userName: user.userName,
      employeeId: user.employeeId,
      employeeName: employee.name
    };

    send200(res, req.path, responsePayload);
  } catch (err) {
    send500(res, req.path, err as Error);
  }
});

/**
 * POST /auth/register
 */
router.post('/register', async (req, res) => {
  const { userName, password, roleId } = req.body;

  try {
    // Check if user already exists
    const existingUser = await userRepo.findByUserName(userName);
    if (existingUser) {
      return send401(res, req.path, new Error('User already exists'));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Default role assignment: Employee if not provided
    const assignedRoleId = roleId || 1; // assuming Role table has 1 = Employee
    // Create user
    const newUser = await userRepo.createUser(userName, hashedPassword, assignedRoleId);

    send201(res, req.path, {
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        userName: newUser.userName,
        roleId: newUser.roleId,
      },
    });
  } catch (err) {
    send500(res, req.path, err as Error);
  }
});

export default router;