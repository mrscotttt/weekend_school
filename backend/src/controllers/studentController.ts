import { Request, Response } from 'express';
import { getAllStudents } from '../services/studentService';
import { asyncHandler } from '../middleware/asyncHandler';
import { sendSuccess } from '../lib/response';

export const getStudents = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = await getAllStudents();
  sendSuccess(res, data);
});
