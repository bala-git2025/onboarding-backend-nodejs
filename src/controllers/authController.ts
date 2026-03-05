import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  send200,
  send201,
  send401,
  send500,
} from "../arch-layer/response/reponse";
import { UserRepository } from "../repositories/userRepository";
import { ResponsePayload, User, AuthUser } from "../models/userModel";

// ---------------------------------------------------------
// TYPE EXTENSION: Tell TypeScript that Request can have a 'file'
// ---------------------------------------------------------
declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
    }
  }
}

const router = Router();
const userRepo = new UserRepository();
const SECRET_KEY = process.env.JWT_SECRET || "super_secret_key";

/* ------------------ MULTER CONFIGURATION ------------------ */
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) => {
    cb(null, uploadDir);
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
});

/* ------------------ Middleware to verify JWT ------------------ */
const authenticate = (req: Request, res: Response, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return send401(res, req.path, new Error('No token provided'));

  const token = authHeader.split(" ")[1];
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
router.post("/login", async (req: Request, res: Response) => {
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

    const profile = await userRepo.getProfile(user.employeeId);

    const baseUrl = "http://localhost:5000";
    const fullProfilePicture = profile?.profilePicture
      ? profile.profilePicture.startsWith("http")
        ? profile.profilePicture
        : `${baseUrl}/${profile.profilePicture}`
      : undefined;

    const responsePayload: ResponsePayload = {
      token,
      role: user.role,
      userName: user.userName,
      employeeId: user.employeeId,
      employeeName: user.employeeName,
      profilePicture: fullProfilePicture,
    };

    send200(res, req.path, responsePayload);
  } catch (err) {
    send500(res, req.path, err as Error);
  }
});

/**
 * POST /auth/register
 */
router.post("/register", async (req: Request, res: Response) => {
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
router.get('/profile', authenticate, async (req: Request, res: Response) => {
  try {
    const authUser = res.locals.authUser as AuthUser;
    const user = await userRepo.findById(authUser.id);
    if (!user || !user.employeeId) {
      return send401(res, req.path, new Error('User not found'));
    }

    let profile = await userRepo.getProfile(user.employeeId);
    
    if (!profile) {
      return send500(res, req.path, new Error('Profile not found'));
    }
    const baseUrl = 'http://localhost:5000'; 
    if (profile.profilePicture) {
      profile.profilePicture = profile.profilePicture.startsWith('http') 
        ? profile.profilePicture 
        : `${baseUrl}/${profile.profilePicture}`;
    }

    send200(res, req.path, profile);
  } catch (err) {
    send500(res, req.path, err as Error);
  }
});

/**
 * PUT /auth/profile
 */
router.put('/profile', authenticate, upload.single('profilePicture'), async (req: Request, res: Response) => {
  try {
    const authUser = res.locals.authUser as AuthUser;
    const user = await userRepo.findById(authUser.id);
    if (!user || !user.employeeId) {
      return send401(res, req.path, new Error('User not found'));
    }

    const { email, phone, primarySkill } = req.body;
    const baseUrl = 'http://localhost:5000'; 
    
    const profilePicturePath = req.file ? `${baseUrl}/uploads/${req.file.filename}` : undefined;

    if (req.body.profilePicture === 'null' || req.body.profilePicture === null) {
    }

    const updates: any = {
      email,
      phone,
      primarySkill
    };

    if (profilePicturePath) {
      updates.profilePicture = profilePicturePath;
    }
    
    if (req.body.profilePicture === null) {
        updates.profilePicture = null;
    }

    const updated = await userRepo.updateProfile(user.employeeId, updates);

    if (updated && updated.profilePicture && !updated.profilePicture.startsWith('http')) {
        updated.profilePicture = `${baseUrl}/${updated.profilePicture}`;
    }

    send200(res, req.path, updated);
  } catch (err) {
    console.error("Profile Update Error:", err);
    send500(res, req.path, err as Error);
  }
});

export default router;