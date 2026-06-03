import { Request, Response } from 'express';
import { getAllStudents } from '../services/studentService';

export const getStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await getAllStudents();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
