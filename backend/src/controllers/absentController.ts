import { Request, Response } from 'express';
import { recordAbsent } from '../services/absentService';
import { asyncHandler } from '../middleware/asyncHandler';
import { sendSuccess } from '../lib/response';

export const patchAbsent = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { studentId, classId } = req.body as { studentId: string; classId: string };
  const result = await recordAbsent(studentId, classId);
  sendSuccess(res, result);
});
