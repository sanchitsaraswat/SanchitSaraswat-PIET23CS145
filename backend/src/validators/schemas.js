import { z } from 'zod';
const dateKey = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD');
export const registerSchema = z.object({ email: z.string().email().max(254).transform((v) => v.toLowerCase().trim()), password: z.string().min(12).max(128), timezone: z.string().min(1).max(64).default('UTC') });
export const loginSchema = registerSchema.pick({ email: true, password: true });
export const habitSchema = z.object({ name: z.string().trim().min(1).max(100), description: z.string().trim().max(1000).nullable().optional(), scheduleType: z.enum(['DAILY', 'CUSTOM']), weekdays: z.array(z.number().int().min(0).max(6)).max(7).optional().default([]) }).superRefine((data, ctx) => { if (data.scheduleType === 'CUSTOM' && !data.weekdays.length) ctx.addIssue({ code: 'custom', message: 'Choose at least one day for a custom schedule', path: ['weekdays'] }); if (new Set(data.weekdays).size !== data.weekdays.length) ctx.addIssue({ code: 'custom', message: 'Days must be unique', path: ['weekdays'] }); });
export const habitPatchSchema = habitSchema.partial().superRefine((data, ctx) => { if (data.scheduleType === 'CUSTOM' && data.weekdays && !data.weekdays.length) ctx.addIssue({ code: 'custom', message: 'Choose at least one day', path: ['weekdays'] }); });
export const dateSchema = z.object({ date: dateKey });
export const listSchema = z.object({ page: z.coerce.number().int().min(1).default(1), limit: z.coerce.number().int().min(1).max(100).default(20), q: z.string().trim().max(100).optional(), archived: z.enum(['true', 'false']).optional() });
