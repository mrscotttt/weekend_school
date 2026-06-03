import pool from "../db/connection";
import { RowDataPacket } from "mysql2/promise";

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
    "SELECT student_id FROM student WHERE student_id = ?",
    [studentId]
  );
  return rows.length > 0;
};

export const findUpcomingClassesForStudent = async (
  studentId: string
): Promise<ClassRow[]> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `
    SELECT
      c.class_id,
      c.course_id,
      c.name,
      c.\`desc\`,
      c.class_date,
      c.seat_total,

      COUNT(DISTINCT seat_bt.booking_id) AS seat_current,

      COALESCE(
        latest_bt.attendance_status,
        'READY_TO_BOOK'
      ) AS attendance_status,

      CASE
        WHEN EXISTS (
          SELECT 1
          FROM booking_transaction bt_skip
          INNER JOIN compensation_history ch
            ON ch.booking_id = bt_skip.booking_id
          WHERE bt_skip.student_id = ?
            AND bt_skip.class_id = c.class_id
        )
        THEN TRUE
        ELSE FALSE
      END AS has_skipped_before

    FROM class c

    LEFT JOIN booking_transaction seat_bt
      ON seat_bt.class_id = c.class_id

    LEFT JOIN (
      SELECT bt1.*
      FROM booking_transaction bt1
      INNER JOIN (
        SELECT
              class_id,
              MAX(created_at) AS latest_created
            FROM booking_transaction
            WHERE student_id = ?
            GROUP BY class_id
          ) bt2
            ON bt1.class_id = bt2.class_id
          AND bt1.created_at = bt2.latest_created
          WHERE bt1.student_id = ?
        ) latest_bt
          ON latest_bt.class_id = c.class_id

        WHERE c.class_date >= NOW()

        GROUP BY
          c.class_id,
          c.course_id,
          c.name,
          c.\`desc\`,
          c.class_date,
          c.seat_total,
          latest_bt.attendance_status

        ORDER BY c.class_date ASC
        `,
    [
      studentId, // EXISTS skip
      studentId, // latest booking subquery
      studentId, // latest booking outer query
    ]
  );

  return rows as ClassRow[];
};
