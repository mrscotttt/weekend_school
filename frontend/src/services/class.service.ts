import api from '@/lib/api';
import { ApiResponse } from '@/types/api';
import { ClassItem } from '@/types/class';

export const getClasses = async (studentId: string): Promise<ClassItem[]> => {
  const res = await api.get<ApiResponse<ClassItem[]>>('/classes/all', {
    params: { studentId },
  });
  return res.data.data ?? [];
};
