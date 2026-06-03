import { v4 as uuidv4 } from 'uuid';
import pool from '../db/connection';
import {
  findBookingByStudentAndClass,
  updateBookingStatusToAbsent,
  insertCreditTransaction,
} from '../repositories/absentRepository';
import { BusinessError } from '../errors/BusinessError';
import { BusinessCode } from '../constants/businessCode';

export interface AbsentResult {
  bookingId: string;
  status: 'ABSENT';
}

export const recordAbsent = async (studentId: string, classId: string): Promise<AbsentResult> => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const booking = await findBookingByStudentAndClass(conn, studentId, classId);
    if (!booking) {
      throw new BusinessError(BusinessCode.ABSENT_BOOKING_NOT_FOUND);
    }

    if (booking.attendance_status === 'ABSENT') {
      throw new BusinessError(BusinessCode.ABSENT_ALREADY_FINALIZED);
    }
    if (booking.attendance_status === 'ATTEND' || booking.attendance_status === 'SKIP') {
      throw new BusinessError(BusinessCode.ABSENT_INVALID_STATUS);
    }

    await updateBookingStatusToAbsent(conn, booking.booking_id);

    await insertCreditTransaction(conn, uuidv4(), studentId, booking.booking_id, classId, -1, 'ABSENT');

    await conn.commit();
    return { bookingId: booking.booking_id, status: 'ABSENT' };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};
