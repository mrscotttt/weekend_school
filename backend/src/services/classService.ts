import { findStudentById, findUpcomingClassesForStudent } from '../repositories/classRepository';
import { BusinessError } from '../errors/BusinessError';
import { BusinessCode } from '../constants/businessCode';

type AttendanceStatusMapped = 'READY_TO_BOOK' | 'BOOKED' | 'ATTEND' | 'SKIP' | 'ABSENT';

export interface ClassDto {
  classId: string;
  courseId: string;
  className: string;
  description: string | null;
  classDate: Date;
  seatTotal: number;
  seatCurrent: number;
  seatAvailable: number;
  attendanceStatus: AttendanceStatusMapped;
  hasSkippedBefore: boolean;
}

export const getUpcomingClasses = async (studentId: string): Promise<ClassDto[]> => {
  const exists = await findStudentById(studentId);
  if (!exists) {
    throw new BusinessError(BusinessCode.BOOKING_STUDENT_NOT_FOUND);
  }

  const rows = await findUpcomingClassesForStudent(studentId);

  return rows.map((row) => {
    const seatCurrent = Number(row.seat_current);
    const attendanceStatus: AttendanceStatusMapped =
      row.attendance_status === 'BOOKED' ? 'BOOKED'
      : row.attendance_status === 'ATTEND' ? 'ATTEND'
      : row.attendance_status === 'SKIP' ? 'SKIP'
      : row.attendance_status === 'ABSENT' ? 'ABSENT'
      : 'READY_TO_BOOK';

    return {
      classId: row.class_id,
      courseId: row.course_id,
      className: row.name,
      description: row.desc,
      classDate: row.class_date,
      seatTotal: row.seat_total,
      seatCurrent,
      seatAvailable: row.seat_total - seatCurrent,
      attendanceStatus,
      hasSkippedBefore: Boolean(row.has_skipped_before),
    };
  });
};
