import { authService } from '../services/authService.js';
import { habitService } from '../services/habitService.js';
import { dateSchema, habitPatchSchema, habitSchema, listSchema } from '../validators/schemas.js';
const userFor = (req) => authService.me(req.auth.sub);
export const habitController = {
  async list(req, res) { res.json({ data: await habitService.list(await userFor(req), listSchema.parse(req.query)) }); },
  async get(req, res) { res.json({ data: await habitService.get(await userFor(req), req.params.id) }); },
  async create(req, res) { res.status(201).json({ data: await habitService.create(await userFor(req), habitSchema.parse(req.body)) }); },
  async update(req, res) { res.json({ data: await habitService.update(await userFor(req), req.params.id, habitPatchSchema.parse(req.body)) }); },
  async archive(req, res) { res.json({ data: await habitService.archive(await userFor(req), req.params.id, true) }); },
  async restore(req, res) { res.json({ data: await habitService.archive(await userFor(req), req.params.id, false) }); },
  async completions(req, res) { res.json({ data: await habitService.completions(await userFor(req), req.params.id, listSchema.parse(req.query)) }); },
  async complete(req, res) { const { date } = dateSchema.parse(req.body); res.status(201).json({ data: await habitService.complete(await userFor(req), req.params.id, date) }); },
  async undo(req, res) { const { date } = dateSchema.parse(req.params); await habitService.undo(await userFor(req), req.params.id, date); res.status(204).send(); }
};
