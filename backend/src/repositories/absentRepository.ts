import { PoolConnection, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { BookingTransaction } from '../models/BookingTransaction';

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

export const updateBookingStatusToAbsent = async (conn: PoolConnection, bookingId: string): Promise<void> => {
  await conn.execute<ResultSetHeader>(
    "UPDATE booking_transaction SET attendance_status = 'ABSENT', updated_at = NOW() WHERE booking_id = ?",
    [bookingId],
  );
};

export const insertCreditTransaction = async (
  conn: PoolConnection,
  transactionId: string,
  studentId: string,
  bookingId: string,
  classId: string,
  creditAmount: number,
  remark: string,
): Promise<void> => {
  await conn.execute<ResultSetHeader>(
    `INSERT INTO credit_transaction (transaction_id, student_id, booking_id, class_id, credit_amount, remark, created_at)
     VALUES (?, ?, ?, ?, ?, ?, NOW())`,
    [transactionId, studentId, bookingId, classId, creditAmount, remark],
  );
};
