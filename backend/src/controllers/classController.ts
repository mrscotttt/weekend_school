import { Request, Response } from 'express';
import { getUpcomingClasses } from '../services/classService';
import { asyncHandler } from '../middleware/asyncHandler';
import { sendSuccess } from '../lib/response';

export const getAllClasses = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { studentId } = req.query as { studentId: string };
  const data = await getUpcomingClasses(studentId);
  sendSuccess(res, data);
});
