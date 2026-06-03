import { Request, Response } from 'express';
import { recordAttend } from '../services/attendService';
import { asyncHandler } from '../middleware/asyncHandler';
import { sendSuccess } from '../lib/response';

export const patchAttend = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { studentId, classId } = req.body as { studentId: string; classId: string };
  const result = await recordAttend(studentId, classId);
  sendSuccess(res, result);
});
