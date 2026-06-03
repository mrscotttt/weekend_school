import pool from '../db/connection';
import { Student } from '../models/Student';
import { RowDataPacket } from 'mysql2';

export const findAllStudents = async (): Promise<Student[]> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT student_id, name, credit_total, created_at, updated_at FROM student'
  );
  return rows as Student[];
};
