import { Request, Response } from 'express';
import { createBooking } from '../services/bookingService';
import { asyncHandler } from '../middleware/asyncHandler';
import { sendSuccess } from '../lib/response';

export const postBooking = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { studentId, classId } = req.body as { studentId: string; classId: string };
  const result = await createBooking(studentId, classId);
  sendSuccess(res, result);
});
