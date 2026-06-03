import { Request, Response } from 'express';
import { getAllStudents, getStudentCredits } from '../services/studentService';
import { asyncHandler } from '../middleware/asyncHandler';
import { sendSuccess } from '../lib/response';

export const getStudents = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data = await getAllStudents();
  sendSuccess(res, data);
});

export const getCredits = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { studentId } = req.query as { studentId: string };
  const data = await getStudentCredits(studentId);
  sendSuccess(res, data);
});
