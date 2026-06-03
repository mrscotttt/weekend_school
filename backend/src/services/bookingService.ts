import { v4 as uuidv4 } from 'uuid';
import pool from '../db/connection';
import {
  findClassById,
  findBookingByStudentAndClass,
  findCompensationByBookingId,
  countSeatsByClassId,
  insertBooking,
} from '../repositories/bookingRepository';
import { BusinessError } from '../errors/BusinessError';
import { BusinessCode } from '../constants/businessCode';

export interface BookingResult {
  bookingId: string;
  status: 'BOOKED';
}

export const createBooking = async (studentId: string, classId: string): Promise<BookingResult> => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Find class
    const cls = await findClassById(conn, classId);
    if (!cls) {
      throw new BusinessError(BusinessCode.BOOKING_CLASS_NOT_FOUND);
    }

    // 2-3. Check existing booking
    const existing = await findBookingByStudentAndClass(conn, studentId, classId);
    if (existing) {
      if (existing.attendance_status === 'BOOKED') {
        throw new BusinessError(BusinessCode.BOOKING_ALREADY_BOOKED);
      }
      if (existing.attendance_status === 'ATTEND') {
        throw new BusinessError(BusinessCode.COURSE_COMPLETED);
      }
      if (existing.attendance_status === 'ABSENT') {
        throw new BusinessError(BusinessCode.COURSE_FORFEITED);
      }
      if (existing.attendance_status === 'SKIP') {
        const compensation = await findCompensationByBookingId(conn, existing.booking_id);
        if (compensation?.compens_status === 'REDEEMED') {
          throw new BusinessError(BusinessCode.SKIP_CLASS_STARTED);
        }
        if (compensation?.compens_status === 'EXPIRED') {
          throw new BusinessError(BusinessCode.BOOKING_PACKAGE_EXPIRED);
        }
      }
    }

    // 4. Validate seat
    const seatCurrent = await countSeatsByClassId(conn, classId);
    if (seatCurrent >= cls.seat_total) {
      throw new BusinessError(BusinessCode.BOOKING_CLASS_FULL);
    }

    // 5. Insert booking
    const bookingId = uuidv4();
    await insertBooking(conn, bookingId, studentId, classId);

    await conn.commit();
    return { bookingId, status: 'BOOKED' };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};
