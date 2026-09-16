import { ZodError } from 'zod';
import { AppError } from '../errors/AppError.js';
export function errorHandler(err, _req, res, _next) {
  if (err instanceof ZodError) return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid request data', details: err.flatten() } });
  if (err instanceof AppError) return res.status(err.status).json({ error: { code: err.code, message: err.message } });
  if (err?.code === 'P2002') return res.status(409).json({ error: { code: 'CONFLICT', message: 'That record already exists' } });
  console.error('Unhandled error', { message: err.message, stack: process.env.NODE_ENV === 'production' ? undefined : err.stack });
  return res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } });
}
