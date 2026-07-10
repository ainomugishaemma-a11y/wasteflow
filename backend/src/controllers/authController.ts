import { Request, Response } from 'express';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { UserModel } from '../models/User';
import logger from '../utils/logger';

const AuthController = {
  async register(req: Request, res: Response) {
    try {
      const { fullname, email, password, role } = req.body;

      if (!fullname || !email || !password) {
        res.status(400).json({ error: 'Fullname, email, and password are required' });
        return;
      }

      const newUserId = await UserModel.create({
        fullname,
        email,
        password,
        role: (role as any) || 'waste_manager',
        status: 'active',
      });

      const createdUser = await UserModel.findById(newUserId);

      res.status(201).json({ user: { id: createdUser?.id, fullname: createdUser?.fullname, email: createdUser?.email, role: createdUser?.role } });
    } catch (error: any) {
      logger.error('Register error:', error);
      if (error.message === 'User already exists') {
        res.status(409).json({ error: 'An account with that email already exists' });
      } else {
        res.status(500).json({ error: 'Registration failed' });
      }
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email and password required' });
        return;
      }

      const dbUser = await UserModel.findByEmail(email);
      if (!dbUser || !dbUser.password) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const valid = await UserModel.verifyPassword(password, dbUser.password);
      if (!valid) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const payload = { id: dbUser.id as number, email: dbUser.email, role: dbUser.role };
      const accessToken = generateAccessToken(payload as any);
      const refreshToken = generateRefreshToken(payload as any);

      res.json({ user: { id: dbUser.id, fullname: dbUser.fullname, email: dbUser.email, role: dbUser.role }, accessToken, refreshToken });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  },

  async logout(req: Request, res: Response) {
    res.status(200).json({ message: 'Logged out successfully' });
  },

  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res.status(400).json({ error: 'Refresh token required' });
        return;
      }
      const payload = verifyRefreshToken(refreshToken);
      const accessToken = generateAccessToken({ id: payload.id, email: payload.email, role: payload.role });
      res.json({ accessToken });
    } catch (error) {
      logger.error('Refresh token error:', error);
      res.status(403).json({ error: 'Invalid or expired refresh token' });
    }
  },

  async forgotPassword(req: Request, res: Response) {
    res.status(200).json({ message: 'Forgot password is not supported in demo mode' });
  },
};

export default AuthController;
