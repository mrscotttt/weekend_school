import api from '@/lib/api';
import { ApiResponse } from '@/types/api';
import { Student, StudentCredit } from '@/types/student';

export const getStudents = async (): Promise<Student[]> => {
  const res = await api.get<ApiResponse<Student[]>>('/students');
  return res.data.data ?? [];
};

export const getStudentCredits = async (studentId: string): Promise<StudentCredit> => {
  const res = await api.get<ApiResponse<StudentCredit>>('/students/credits', {
    params: { studentId },
  });
  return res.data.data!;
};
