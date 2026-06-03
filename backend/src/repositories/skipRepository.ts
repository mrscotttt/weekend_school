import { PoolConnection, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { CompensationHistory } from '../models/CompensationHistory';

export const findPendingCompensationByStudent = async (
  conn: PoolConnection,
  studentId: string,
): Promise<CompensationHistory | null> => {
  const [rows] = await conn.execute<RowDataPacket[]>(
    `SELECT ch.compens_id, ch.booking_id, ch.compens_type, ch.compens_status, ch.expired_at, ch.remark, ch.created_at, ch.updated_at
     FROM compensation_history ch
     JOIN booking_transaction bt ON ch.booking_id = bt.booking_id
     WHERE bt.student_id = ? AND ch.compens_status = 'PENDING'
     LIMIT 1`,
    [studentId],
  );
  return rows.length > 0 ? (rows[0] as CompensationHistory) : null;
};

export const updateBookingStatusToSkip = async (conn: PoolConnection, bookingId: string): Promise<void> => {
  await conn.execute<ResultSetHeader>(
    "UPDATE booking_transaction SET attendance_status = 'SKIP', updated_at = NOW() WHERE booking_id = ?",
    [bookingId],
  );
};

export const insertCompensationHistory = async (
  conn: PoolConnection,
  compensId: string,
  bookingId: string,
): Promise<void> => {
  await conn.execute<ResultSetHeader>(
    `INSERT INTO compensation_history (compens_id, booking_id, compens_type, compens_status, expired_at, remark, created_at, updated_at)
     VALUES (?, ?, 'MAKEUP_CLASS', 'PENDING', '2099-12-31 00:00:00', 'skip and makeup class', NOW(), NOW())`,
    [compensId, bookingId],
  );
};
