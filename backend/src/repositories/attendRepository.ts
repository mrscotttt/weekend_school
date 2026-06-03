import { PoolConnection, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { BookingTransaction } from '../models/BookingTransaction';
import { CompensationHistory } from '../models/CompensationHistory';

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

export const updateBookingStatusToAttend = async (conn: PoolConnection, bookingId: string): Promise<void> => {
  await conn.execute<ResultSetHeader>(
    "UPDATE booking_transaction SET attendance_status = 'ATTEND', updated_at = NOW() WHERE booking_id = ?",
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

export const findPendingMakeupCompensation = async (
  conn: PoolConnection,
  studentId: string,
): Promise<CompensationHistory | null> => {
  const [rows] = await conn.execute<RowDataPacket[]>(
    `SELECT ch.compens_id, ch.booking_id, ch.compens_type, ch.compens_status, ch.expired_at, ch.remark, ch.created_at, ch.updated_at
     FROM compensation_history ch
     JOIN booking_transaction bt ON ch.booking_id = bt.booking_id
     WHERE bt.student_id = ? AND ch.compens_type = 'MAKEUP_CLASS' AND ch.compens_status = 'PENDING'
     LIMIT 1`,
    [studentId],
  );
  return rows.length > 0 ? (rows[0] as CompensationHistory) : null;
};

export const updateCompensationToRedeemed = async (conn: PoolConnection, compensId: string): Promise<void> => {
  await conn.execute<ResultSetHeader>(
    "UPDATE compensation_history SET compens_status = 'REDEEMED', updated_at = NOW() WHERE compens_id = ?",
    [compensId],
  );
};
