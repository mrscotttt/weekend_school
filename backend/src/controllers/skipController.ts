import { Request, Response } from 'express';
import { recordSkip } from '../services/skipService';
import { asyncHandler } from '../middleware/asyncHandler';
import { sendSuccess } from '../lib/response';

export const patchSkip = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { studentId, classId } = req.body as { studentId: string; classId: string };
  const result = await recordSkip(studentId, classId);
  sendSuccess(res, result);
});
