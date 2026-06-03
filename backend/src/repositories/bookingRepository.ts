import { PoolConnection, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { Class } from '../models/Class';
import { BookingTransaction } from '../models/BookingTransaction';
import { CompensationHistory } from '../models/CompensationHistory';

export const findClassById = async (conn: PoolConnection, classId: string): Promise<Class | null> => {
  const [rows] = await conn.execute<RowDataPacket[]>(
    'SELECT class_id, course_id, name, `desc`, seat_total, class_date, created_at, updated_at FROM class WHERE class_id = ?',
    [classId],
  );
  return rows.length > 0 ? (rows[0] as Class) : null;
};

export const findBookingByStudentAndClass = async (
  conn: PoolConnection,
  studentId: string,
  classId: string,
): Promise<BookingTransaction | null> => {
  const [rows] = await conn.execute<RowDataPacket[]>(
    'SELECT booking_id, student_id, class_id, attendance_status, created_at, updated_at FROM booking_transaction WHERE student_id = ? AND class_id = ?',
    [studentId, classId],
  );
  return rows.length > 0 ? (rows[0] as BookingTransaction) : null;
};

export const findCompensationByBookingId = async (
  conn: PoolConnection,
  bookingId: string,
): Promise<CompensationHistory | null> => {
  const [rows] = await conn.execute<RowDataPacket[]>(
    'SELECT compens_id, booking_id, compens_type, compens_status, expired_at, remark, created_at, updated_at FROM compensation_history WHERE booking_id = ? LIMIT 1',
    [bookingId],
  );
  return rows.length > 0 ? (rows[0] as CompensationHistory) : null;
};

export const countSeatsByClassId = async (conn: PoolConnection, classId: string): Promise<number> => {
  const [rows] = await conn.execute<RowDataPacket[]>(
    'SELECT COUNT(*) AS cnt FROM booking_transaction WHERE class_id = ?',
    [classId],
  );
  return (rows[0] as { cnt: number }).cnt;
};

export const insertBooking = async (
  conn: PoolConnection,
  bookingId: string,
  studentId: string,
  classId: string,
): Promise<void> => {
  await conn.execute<ResultSetHeader>(
    `INSERT INTO booking_transaction (booking_id, student_id, class_id, attendance_status, created_at, updated_at)
     VALUES (?, ?, ?, 'BOOKED', NOW(), NOW())`,
    [bookingId, studentId, classId],
  );
};
