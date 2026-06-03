export type CompensType = 'MAKEUP_CLASS' | 'EXTEND_EXPIRY';
export type CompensStatus = 'PENDING' | 'REDEEMED' | 'EXPIRED';

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
