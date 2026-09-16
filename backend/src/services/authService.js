import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../db/prisma.js';
import { env } from '../config/env.js';
import { AppError } from '../errors/AppError.js';
const publicUser = ({ id, email, timezone, createdAt }) => ({ id, email, timezone, createdAt });
const hash = (value) => crypto.createHash('sha256').update(value).digest('hex');
function signAccess(user) { return jwt.sign({ sub: user.id, email: user.email }, env.accessSecret, { expiresIn: env.accessTtl }); }
async function issue(user) { const raw = jwt.sign({ sub: user.id, nonce: crypto.randomUUID() }, env.refreshSecret, { expiresIn: `${env.refreshDays}d` }); await prisma.refreshToken.create({ data: { userId: user.id, tokenHash: hash(raw), expiresAt: new Date(Date.now() + env.refreshDays * 86400000) } }); return { accessToken: signAccess(user), refreshToken: raw, user: publicUser(user) }; }
export const authService = {
  async register(data) { const exists = await prisma.user.findUnique({ where: { email: data.email } }); if (exists) throw new AppError(409, 'EMAIL_IN_USE', 'An account with this email already exists'); const user = await prisma.user.create({ data: { email: data.email, passwordHash: await bcrypt.hash(data.password, 12), timezone: data.timezone } }); return issue(user); },
  async login(data) { const user = await prisma.user.findUnique({ where: { email: data.email } }); if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) throw new AppError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect'); return issue(user); },
  async refresh(raw) { if (!raw) throw new AppError(401, 'UNAUTHENTICATED', 'Refresh token is required'); let payload; try { payload = jwt.verify(raw, env.refreshSecret); } catch { throw new AppError(401, 'INVALID_TOKEN', 'Session has expired'); } const token = await prisma.refreshToken.findUnique({ where: { tokenHash: hash(raw) }, include: { user: true } }); if (!token || token.revokedAt || token.expiresAt < new Date() || token.userId !== payload.sub) throw new AppError(401, 'INVALID_TOKEN', 'Session is no longer valid'); await prisma.refreshToken.update({ where: { id: token.id }, data: { revokedAt: new Date() } }); return issue(token.user); },
  async logout(raw) { if (raw) await prisma.refreshToken.updateMany({ where: { tokenHash: hash(raw), revokedAt: null }, data: { revokedAt: new Date() } }); },
  async me(id) { const user = await prisma.user.findUnique({ where: { id } }); if (!user) throw new AppError(401, 'UNAUTHENTICATED', 'Account no longer exists'); return publicUser(user); }
};
