import { v4 as uuidv4 } from 'uuid';
import pool from '../db/connection';
import {
  findBookingByStudentAndClass,
  updateBookingStatusToAttend,
  insertCreditTransaction,
  findPendingMakeupCompensation,
  updateCompensationToRedeemed,
} from '../repositories/attendRepository';
import { BusinessError } from '../errors/BusinessError';
import { BusinessCode } from '../constants/businessCode';

export interface AttendResult {
  bookingId: string;
  status: 'ATTEND';
}

export const recordAttend = async (studentId: string, classId: string): Promise<AttendResult> => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const booking = await findBookingByStudentAndClass(conn, studentId, classId);
    if (!booking) {
      throw new BusinessError(BusinessCode.ATTEND_BOOKING_NOT_FOUND);
    }

    if (booking.attendance_status === 'ATTEND') {
      throw new BusinessError(BusinessCode.ATTEND_ALREADY_RECORDED);
    }
    if (booking.attendance_status === 'ABSENT' || booking.attendance_status === 'SKIP') {
      throw new BusinessError(BusinessCode.ATTEND_INVALID_STATUS);
    }

    await updateBookingStatusToAttend(conn, booking.booking_id);

    await insertCreditTransaction(conn, uuidv4(), studentId, booking.booking_id, classId, -1, 'ATTEND');

    const compensation = await findPendingMakeupCompensation(conn, studentId);
    if (compensation) {
      await updateCompensationToRedeemed(conn, compensation.compens_id);
    }

    await conn.commit();
    return { bookingId: booking.booking_id, status: 'ATTEND' };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};
