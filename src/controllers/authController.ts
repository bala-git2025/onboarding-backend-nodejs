import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { send200, send201, send401, send500 } from '../arch-layer/response/reponse';
import { UserRepository } from '../repositories/userRepository';
import { ResponsePayload, User, AuthUser } from '../models/userModel';

const router = Router();
const userRepo = new UserRepository();
const SECRET_KEY = process.env.JWT_SECRET || 'super_secret_key';

/* ------------------ Middleware to verify JWT ------------------ */
const authenticate = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return send401(res, req.path, new Error('No token provided'));

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as AuthUser;
    // Store the decoded user in res.locals instead of req.user
    res.locals.authUser = decoded;
    next();
  } catch (err) {
    return send401(res, req.path, new Error('Invalid token'));
  }
};

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
      return send401(res, req.path, new Error('Invalid Username & Password'));
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

    const responsePayload: ResponsePayload = {
      token,
      role: user.role,
      userName: user.userName,
      employeeId: user.employeeId,
      employeeName: user.employeeName
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

/**
 * GET /auth/profile
 */
router.get('/profile', authenticate, async (req, res) => {
  try {
    const authUser = res.locals.authUser as AuthUser;
    const user = await userRepo.findById(authUser.id);
    if (!user || !user.employeeId) {
      return send401(res, req.path, new Error('User not found'));
    }

    const profile = await userRepo.getProfile(user.employeeId);
    if (!profile) {
      return send500(res, req.path, new Error('Profile not found'));
    }

    send200(res, req.path, profile);
  } catch (err) {
    send500(res, req.path, err as Error);
  }
});

/**
 * PUT /auth/profile
 */
router.put('/profile', authenticate, async (req, res) => {
  try {
    const authUser = res.locals.authUser as AuthUser;
    const user = await userRepo.findById(authUser.id);
    if (!user || !user.employeeId) {
      return send401(res, req.path, new Error('User not found'));
    }

    const { email, phone, primarySkill } = req.body;
    const updated = await userRepo.updateProfile(user.employeeId, { email, phone, primarySkill });

    send200(res, req.path, updated);
  } catch (err) {
    send500(res, req.path, err as Error);
  }
});

export default router;