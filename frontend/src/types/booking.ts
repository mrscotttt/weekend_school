export interface BookingResult {
  bookingId: string;
  status: 'BOOKED';
}

export interface AttendResult {
  bookingId: string;
  status: 'ATTEND';
}

export interface SkipResult {
  bookingId: string;
  status: 'SKIP';
}

export interface AbsentResult {
  bookingId: string;
  status: 'ABSENT';
}
