export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  messageCode: number | null;
  message: string;
  data: T | null;
}
