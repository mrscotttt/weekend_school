import { v4 as uuidv4 } from 'uuid';
import pool from '../db/connection';
import { findBookingByStudentAndClass } from '../repositories/bookingRepository';
import {
  findPendingCompensationByStudent,
  updateBookingStatusToSkip,
  insertCompensationHistory,
} from '../repositories/skipRepository';
import { BusinessError } from '../errors/BusinessError';
import { BusinessCode } from '../constants/businessCode';

export interface SkipResult {
  bookingId: string;
  status: 'SKIP';
}

export const recordSkip = async (studentId: string, classId: string): Promise<SkipResult> => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const booking = await findBookingByStudentAndClass(conn, studentId, classId);
    if (!booking) {
      throw new BusinessError(BusinessCode.SKIP_BOOKING_NOT_FOUND);
    }

    if (booking.attendance_status === 'SKIP') {
      throw new BusinessError(BusinessCode.SKIP_ALREADY_FINALIZED);
    }
    if (booking.attendance_status === 'ATTEND' || booking.attendance_status === 'ABSENT') {
      throw new BusinessError(BusinessCode.SKIP_INVALID_STATUS);
    }

    const existingCompensation = await findPendingCompensationByStudent(conn, studentId);
    if (existingCompensation) {
      throw new BusinessError(BusinessCode.SKIP_COMPENSATION_EXISTS);
    }

    await updateBookingStatusToSkip(conn, booking.booking_id);

    await insertCompensationHistory(conn, uuidv4(), booking.booking_id);

    await conn.commit();
    return { bookingId: booking.booking_id, status: 'SKIP' };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};
