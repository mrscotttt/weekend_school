export type AttendanceStatus = 'READY_TO_BOOK' | 'BOOKED' | 'ATTEND' | 'SKIP' | 'ABSENT';

export interface ClassItem {
  classId: string;
  courseId: string;
  className: string;
  description: string | null;
  classDate: string;
  seatTotal: number;
  seatCurrent: number;
  seatAvailable: number;
  attendanceStatus: AttendanceStatus;
  hasSkippedBefore: boolean;
}
