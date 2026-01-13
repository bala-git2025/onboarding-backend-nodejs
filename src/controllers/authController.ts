import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { send200, send201, send401, send500 } from '../arch-layer/response/reponse';
import { UserRepository } from '../repositories/userRepository';
import { User } from '../models/userModel';

const router = Router();
const userRepo = new UserRepository();
const SECRET_KEY = process.env.JWT_SECRET || 'super_secret_key';

/**
 * POST /auth/login
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user: User | null = await userRepo.findByUsername(username);

    if (!user) {
      return send401(res, req.path, new Error('Invalid credentials'));
    }

    // ✅ Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return send401(res, req.path, new Error('Invalid credentials'));
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    // Role-based redirect
    let redirectUrl = '';
    if (user.role === 'Employee') {
      redirectUrl = '/employees/dashboard';
    } else if (user.role === 'Manager') {
      redirectUrl = '/manager/dashboard';
    }

    send200(res, req.path, {
      success: true,
      message: 'Login successful',
      token,
      role: user.role,
      redirectUrl,
    });
  } catch (err) {
    send500(res, req.path, err as Error);
  }
});

/**
 * POST /auth/register
 */
router.post('/register', async (req, res) => {
  const { username, password, roleId } = req.body;

  try {
    // Check if user already exists
    const existingUser = await userRepo.findByUsername(username);
    if (existingUser) {
      return send401(res, req.path, new Error('User already exists'));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Default role assignment: Employee if not provided
    const assignedRoleId = roleId || 1; // assuming Role table has 1 = Employee

    // Create user
    const newUser = await userRepo.createUser(username, hashedPassword, assignedRoleId);

    send201(res, req.path, {
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        roleId: newUser.roleId,
      },
    });
  } catch (err) {
    send500(res, req.path, err as Error);
  }
});


export default router;