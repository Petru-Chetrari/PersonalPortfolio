import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { AppDataSource } from '../data-source';
import { UserEntity } from '../entities/User';

const JWT_SECRET = process.env['JWT_SECRET'] || 'dev-secret-change-in-production';
const ACCESS_EXPIRY = process.env['JWT_ACCESS_EXPIRY'] || '15m';
const REFRESH_EXPIRY = process.env['JWT_REFRESH_EXPIRY'] || '7d';
const BCRYPT_ROUNDS = 12;

export interface TokenPayload {
  sub: string;
  username: string;
  role: 'admin' | 'client';
  type?: 'access' | 'refresh';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult {
  tokens: AuthTokens;
  user: { id: string; username: string; email: string; role: string };
}

function generateTokens(user: UserEntity): AuthTokens {
  const accessToken = jwt.sign(
    { sub: user.id, username: user.username, role: user.role, type: 'access' } as TokenPayload,
    JWT_SECRET,
    { expiresIn: ACCESS_EXPIRY as any }
  );

  const refreshToken = jwt.sign(
    { sub: user.id, username: user.username, role: user.role, type: 'refresh' } as TokenPayload,
    JWT_SECRET,
    { expiresIn: REFRESH_EXPIRY as any }
  );

  return { accessToken, refreshToken };
}

export class AuthService {
  static async register(
    username: string,
    email: string,
    password: string,
    role: 'admin' | 'client' = 'client'
  ): Promise<AuthResult> {
    const repo = AppDataSource.getRepository(UserEntity);

    // Check for existing user
    const existing = await repo.findOne({ where: { username } });
    if (existing) {
      const error: any = new Error('Username already exists');
      error.status = 409;
      throw error;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // Create user
    const user = repo.create({
      id: uuidv4(),
      username,
      email,
      passwordHash,
      role,
    });
    await repo.save(user);

    const tokens = generateTokens(user);
    return {
      tokens,
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
    };
  }

  static async login(username: string, password: string): Promise<AuthResult> {
    const repo = AppDataSource.getRepository(UserEntity);

    const user = await repo.findOne({ where: { username } });
    if (!user) {
      const error: any = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      const error: any = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }

    const tokens = generateTokens(user);
    return {
      tokens,
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
    };
  }

  static async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = jwt.verify(refreshToken, JWT_SECRET) as TokenPayload;

      if (payload.type !== 'refresh') {
        const error: any = new Error('Invalid token type');
        error.status = 401;
        throw error;
      }

      // Verify user still exists
      const repo = AppDataSource.getRepository(UserEntity);
      const user = await repo.findOne({ where: { id: payload.sub } });
      if (!user) {
        const error: any = new Error('User not found');
        error.status = 401;
        throw error;
      }

      const accessToken = jwt.sign(
        { sub: user.id, username: user.username, role: user.role, type: 'access' } as TokenPayload,
        JWT_SECRET,
        { expiresIn: ACCESS_EXPIRY as any }
      );

      return { accessToken };
    } catch (err: any) {
      if (err.status) throw err;
      const error: any = new Error('Invalid or expired refresh token');
      error.status = 401;
      throw error;
    }
  }

  static async getMe(userId: string): Promise<{ id: string; username: string; email: string; role: string }> {
    const repo = AppDataSource.getRepository(UserEntity);
    const user = await repo.findOne({ where: { id: userId } });
    if (!user) {
      const error: any = new Error('User not found');
      error.status = 404;
      throw error;
    }
    return { id: user.id, username: user.username, email: user.email, role: user.role };
  }

  static verifyAccessToken(token: string): TokenPayload {
    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;
    if (payload.type !== 'access') {
      const error: any = new Error('Invalid token type');
      error.status = 401;
      throw error;
    }
    return payload;
  }
}
