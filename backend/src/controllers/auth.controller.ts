import { Request, Response } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/auth.service';

const RegisterSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50),
  email: z.string().email('Invalid email format'),
  password: z.string().min(4, 'Password must be at least 4 characters').max(128),
});

const LoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

const RefreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const parsed = RegisterSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: 'Validation failed',
          details: parsed.error.errors.map(e => ({ field: e.path.join('.'), message: e.message })),
        });
        return;
      }

      const { username, email, password } = parsed.data;
      const result = await AuthService.register(username, email, password);

      res.status(201).json({
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
        user: result.user,
      });
    } catch (err: any) {
      const status = err.status || 500;
      res.status(status).json({ error: err.message || 'Internal server error' });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const parsed = LoginSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: 'Validation failed',
          details: parsed.error.errors.map(e => ({ field: e.path.join('.'), message: e.message })),
        });
        return;
      }

      const { username, password } = parsed.data;
      const result = await AuthService.login(username, password);

      res.status(200).json({
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
        user: result.user,
      });
      console.log(result.user, result.tokens.accessToken, result.tokens.refreshToken,);
    } catch (err: any) {
      const status = err.status || 500;
      res.status(status).json({ error: err.message || 'Internal server error' });
    }
  }

  static async refresh(req: Request, res: Response): Promise<void> {
    try {
      const parsed = RefreshSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: 'Validation failed',
          details: parsed.error.errors.map(e => ({ field: e.path.join('.'), message: e.message })),
        });
        return;
      }

      const { refreshToken } = parsed.data;
      const result = await AuthService.refresh(refreshToken);

      res.status(200).json({ accessToken: result.accessToken });
    } catch (err: any) {
      const status = err.status || 500;
      res.status(status).json({ error: err.message || 'Internal server error' });
    }
  }

  static async me(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const user = await AuthService.getMe(req.user.sub);
      res.status(200).json(user);
    } catch (err: any) {
      const status = err.status || 500;
      res.status(status).json({ error: err.message || 'Internal server error' });
    }
  }

  static async logout(_req: Request, res: Response): Promise<void> {
    // Stateless JWT — client discards tokens. 
    // If a token blacklist is needed later, add it here.
    res.status(200).json({ message: 'Logged out successfully' });
  }
}
