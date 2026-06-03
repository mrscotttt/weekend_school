import { findAllStudents } from '../repositories/studentRepository';
import { Student } from '../models/Student';

export const getAllStudents = async (): Promise<Student[]> => {
  return findAllStudents();
};
