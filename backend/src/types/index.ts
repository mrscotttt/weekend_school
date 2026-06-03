export interface Student {
  student_id: string;
  name: string;
  credit_total: number;
  created_at: Date;
  updated_at: Date;
}

export interface Class {
  class_id: string;
  course_id: string;
  name: string;
  desc?: string;
  seat_total: number;
  class_date: Date;
  created_at: Date;
  updated_at: Date;
}

export type AttendanceStatus = 'BOOKED' | 'ATTEND' | 'SKIP' | 'ABSENT';

export interface BookingTransaction {
  booking_id: string;
  student_id: string;
  class_id: string;
  attendance_status: AttendanceStatus;
  created_at: Date;
  updated_at: Date;
}

export type CompensType = 'MAKEUP_CLASS' | 'EXTEND_EXPIRY';
export type CompensStatus = 'PENDING' | 'REDEEMED' | 'EXPIRED';

export interface CreditTransaction {
  transaction_id: string;
  student_id: string;
  booking_id?: string;
  class_id?: string;
  credit_amount: number;
  remark?: string;
  created_at: Date;
}

export interface CompensationHistory {
  compens_id: string;
  booking_id: string;
  compens_type: CompensType;
  compens_status: CompensStatus;
  expired_at?: Date;
  remark?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
