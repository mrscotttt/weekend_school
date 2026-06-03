export type AttendanceStatus = 'BOOKED' | 'ATTEND' | 'SKIP' | 'ABSENT';

export interface BookingTransaction {
  booking_id: string;
  student_id: string;
  class_id: string;
  attendance_status: AttendanceStatus;
  created_at: Date;
  updated_at: Date;
}
