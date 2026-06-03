import { findAllStudents, findStudentCredits, StudentCreditRow } from '../repositories/studentRepository';
import { Student } from '../models/Student';
import { NotFoundError } from '../middleware/AppError';

export const getAllStudents = async (): Promise<Student[]> => {
  return findAllStudents();
};

export const getStudentCredits = async (studentId: string): Promise<StudentCreditRow> => {
  const result = await findStudentCredits(studentId);
  if (!result) {
    throw new NotFoundError('Student not found');
  }
  return result;
};
