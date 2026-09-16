import { authService } from '../services/authService.js';
import { loginSchema, registerSchema } from '../validators/schemas.js';
import { env } from '../config/env.js';
const cookie = { httpOnly: true, secure: env.nodeEnv === 'production', sameSite: 'lax', path: '/api/auth', maxAge: env.refreshDays * 86400000 };
const sendSession = (res, session, status = 200) => { res.cookie('refreshToken', session.refreshToken, cookie); res.status(status).json({ data: { accessToken: session.accessToken, user: session.user } }); };
export const authController = {
  async register(req, res) { sendSession(res, await authService.register(registerSchema.parse(req.body)), 201); },
  async login(req, res) { sendSession(res, await authService.login(loginSchema.parse(req.body))); },
  async refresh(req, res) { sendSession(res, await authService.refresh(req.cookies.refreshToken)); },
  async logout(req, res) { await authService.logout(req.cookies.refreshToken); res.clearCookie('refreshToken', cookie).status(204).send(); },
  async me(req, res) { res.json({ data: await authService.me(req.auth.sub) }); }
};
