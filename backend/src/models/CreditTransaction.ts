export interface CreditTransaction {
  transaction_id: string;
  student_id: string;
  booking_id?: string;
  class_id?: string;
  credit_amount: number;
  remark?: string;
  created_at: Date;
}
