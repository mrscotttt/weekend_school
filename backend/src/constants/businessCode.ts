export enum BusinessCode {
  // Booking
  BOOKING_SUCCESS = 600,
  BOOKING_STUDENT_NOT_FOUND = 601,
  BOOKING_CLASS_NOT_FOUND = 602,
  BOOKING_CLASS_FULL = 603,
  BOOKING_ALREADY_BOOKED = 604,
  BOOKING_PACKAGE_EXPIRED = 605,
  BOOKING_PACKAGE_NOT_FOUND = 606,
  BOOKING_PACKAGE_INACTIVE = 607,
  BOOKING_WINDOW_CLOSED = 608,

  // Skip
  SKIP_SUCCESS = 700,
  SKIP_BOOKING_NOT_FOUND = 701,
  SKIP_ALREADY_FINALIZED = 702,
  SKIP_CLASS_STARTED = 703,
  SKIP_COMPENSATION_CREATE_FAILED = 704,
  SKIP_COMPENSATION_EXISTS = 705,
  SKIP_INVALID_STATUS = 706,
  SKIP_WINDOW_EXPIRED = 707,

  // Attend
  ATTEND_SUCCESS = 800,
  ATTEND_BOOKING_NOT_FOUND = 801,
  ATTEND_ALREADY_RECORDED = 802,
  ATTEND_INVALID_STATUS = 803,
  ATTEND_INSUFFICIENT_CREDITS = 804,
  ATTEND_PACKAGE_EXPIRED = 805,
  ATTEND_STUDENT_NOT_ENROLLED = 806,

  // Absent
  ABSENT_SUCCESS = 900,
  ABSENT_BOOKING_NOT_FOUND = 901,
  ABSENT_ALREADY_FINALIZED = 902,
  ABSENT_INVALID_STATUS = 903,
  ABSENT_CREDIT_DEDUCTION_FAILED = 904,
  ABSENT_PACKAGE_EXPIRED = 905,
  ABSENT_STUDENT_NOT_ENROLLED = 906,
}

export const BUSINESS_MESSAGE: Record<BusinessCode, string> = {
  [BusinessCode.BOOKING_SUCCESS]: 'Booking successful',
  [BusinessCode.BOOKING_STUDENT_NOT_FOUND]: 'Student not found',
  [BusinessCode.BOOKING_CLASS_NOT_FOUND]: 'Class not found',
  [BusinessCode.BOOKING_CLASS_FULL]: 'Class is full',
  [BusinessCode.BOOKING_ALREADY_BOOKED]: 'Already booked',
  [BusinessCode.BOOKING_PACKAGE_EXPIRED]: 'Package has expired',
  [BusinessCode.BOOKING_PACKAGE_NOT_FOUND]: 'Package not found',
  [BusinessCode.BOOKING_PACKAGE_INACTIVE]: 'Package is inactive',
  [BusinessCode.BOOKING_WINDOW_CLOSED]: 'Booking window is closed',

  [BusinessCode.SKIP_SUCCESS]: 'Skip recorded successfully',
  [BusinessCode.SKIP_BOOKING_NOT_FOUND]: 'Booking not found',
  [BusinessCode.SKIP_ALREADY_FINALIZED]: 'Booking already finalized',
  [BusinessCode.SKIP_CLASS_STARTED]: 'Class has already started',
  [BusinessCode.SKIP_COMPENSATION_CREATE_FAILED]: 'Failed to create compensation',
  [BusinessCode.SKIP_COMPENSATION_EXISTS]: 'Compensation already exists',
  [BusinessCode.SKIP_INVALID_STATUS]: 'Invalid booking status for skip',
  [BusinessCode.SKIP_WINDOW_EXPIRED]: 'Skip window has expired',

  [BusinessCode.ATTEND_SUCCESS]: 'Attendance recorded successfully',
  [BusinessCode.ATTEND_BOOKING_NOT_FOUND]: 'Booking not found',
  [BusinessCode.ATTEND_ALREADY_RECORDED]: 'Attendance already recorded',
  [BusinessCode.ATTEND_INVALID_STATUS]: 'Invalid booking status for attend',
  [BusinessCode.ATTEND_INSUFFICIENT_CREDITS]: 'Insufficient credits',
  [BusinessCode.ATTEND_PACKAGE_EXPIRED]: 'Package has expired',
  [BusinessCode.ATTEND_STUDENT_NOT_ENROLLED]: 'Student not enrolled',

  [BusinessCode.ABSENT_SUCCESS]: 'Absence recorded successfully',
  [BusinessCode.ABSENT_BOOKING_NOT_FOUND]: 'Booking not found',
  [BusinessCode.ABSENT_ALREADY_FINALIZED]: 'Booking already finalized',
  [BusinessCode.ABSENT_INVALID_STATUS]: 'Invalid booking status for absent',
  [BusinessCode.ABSENT_CREDIT_DEDUCTION_FAILED]: 'Failed to deduct credit',
  [BusinessCode.ABSENT_PACKAGE_EXPIRED]: 'Package has expired',
  [BusinessCode.ABSENT_STUDENT_NOT_ENROLLED]: 'Student not enrolled',
};
