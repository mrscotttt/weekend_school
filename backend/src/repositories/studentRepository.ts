import pool from '../db/connection';
import { Student } from '../models/Student';
import { RowDataPacket } from 'mysql2';

export const findAllStudents = async (): Promise<Student[]> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT student_id, name, credit_total, created_at, updated_at FROM student'
  );
  return rows as Student[];
};

export interface StudentCreditRow {
  student_id: string;
  credit_total: number;
  used_credit: number;
  remaining_credit: number;
}

export const findStudentCredits = async (studentId: string): Promise<StudentCreditRow | null> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT
       s.student_id,
       s.credit_total,
       COALESCE(SUM(ct.credit_amount), 0) AS used_credit,
       s.credit_total + COALESCE(SUM(ct.credit_amount), 0) AS remaining_credit
     FROM student s
     LEFT JOIN credit_transaction ct ON ct.student_id = s.student_id
     WHERE s.student_id = ?
     GROUP BY s.student_id`,
    [studentId],
  );
  return rows.length > 0 ? (rows[0] as StudentCreditRow) : null;
};
