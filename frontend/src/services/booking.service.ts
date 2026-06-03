import api from '@/lib/api';
import { ApiResponse } from '@/types/api';
import { BookingResult, AttendResult, SkipResult, AbsentResult } from '@/types/booking';

export const bookClass = async (studentId: string, classId: string): Promise<ApiResponse<BookingResult>> => {
  const res = await api.post<ApiResponse<BookingResult>>('/bookings', { studentId, classId });
  return res.data;
};

export const attendClass = async (studentId: string, classId: string): Promise<ApiResponse<AttendResult>> => {
  const res = await api.patch<ApiResponse<AttendResult>>('/attend', { studentId, classId });
  return res.data;
};

export const skipClass = async (studentId: string, classId: string): Promise<ApiResponse<SkipResult>> => {
  const res = await api.patch<ApiResponse<SkipResult>>('/skip', { studentId, classId });
  return res.data;
};

export const absentClass = async (studentId: string, classId: string): Promise<ApiResponse<AbsentResult>> => {
  const res = await api.patch<ApiResponse<AbsentResult>>('/absent', { studentId, classId });
  return res.data;
};
