import { Response } from 'express';

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  messageCode: number | null;
  message: string;
  data: T | null;
}

export const sendSuccess = <T>(res: Response, data: T, statusCode = 200, message = 'Success'): void => {
  const body: ApiResponse<T> = { success: true, statusCode, messageCode: null, message, data };
  res.status(statusCode).json(body);
};

export const sendCreated = <T>(res: Response, data: T, message = 'Created'): void => {
  sendSuccess(res, data, 201, message);
};

export const sendBusinessError = (res: Response, messageCode: number, message: string): void => {
  const body: ApiResponse<null> = { success: false, statusCode: 200, messageCode, message, data: null };
  res.status(200).json(body);
};
