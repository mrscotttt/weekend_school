export interface Student {
  student_id: string;
  name: string;
  credit_total: number;
  created_at: string;
  updated_at: string;
}

export interface StudentCredit {
  student_id: string;
  credit_total: number;
  used_credit: number;
  remaining_credit: number;
}
