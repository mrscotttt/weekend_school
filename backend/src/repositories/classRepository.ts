import pool from '../db/connection';
import { RowDataPacket } from 'mysql2/promise';

export interface ClassRow {
  class_id: string;
  course_id: string;
  name: string;
  desc: string | null;
  class_date: Date;
  seat_total: number;
  seat_current: number;
  attendance_status: string | null;
  has_skipped_before: boolean;
}

export const findStudentById = async (studentId: string): Promise<boolean> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT student_id FROM student WHERE student_id = ?',
    [studentId],
  );
  return rows.length > 0;
};

export const findUpcomingClassesForStudent = async (studentId: string): Promise<ClassRow[]> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT
       c.class_id,
       c.course_id,
       c.name,
       c.\`desc\`,
       c.class_date,
       c.seat_total,
       COUNT(DISTINCT seat_bt.booking_id) AS seat_current,
       bt.attendance_status,
       CASE
         WHEN MAX(ch.compens_id) IS NOT NULL THEN TRUE
         ELSE FALSE
       END AS has_skipped_before
     FROM class c
     LEFT JOIN booking_transaction seat_bt
       ON seat_bt.class_id = c.class_id
     LEFT JOIN booking_transaction bt
       ON bt.class_id = c.class_id
      AND bt.student_id = ?
     LEFT JOIN compensation_history ch
       ON ch.booking_id = bt.booking_id
     WHERE c.class_date >= NOW()
     GROUP BY
       c.class_id,
       c.course_id,
       c.name,
       c.class_date,
       c.seat_total,
       bt.attendance_status`,
    [studentId],
  );
  return rows as ClassRow[];
};
