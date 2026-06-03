import { Request, Response, NextFunction } from 'express';
import { AppError } from './AppError';
import { ApiResponse, sendBusinessError } from '../lib/response';
import { BusinessError } from '../errors/BusinessError';

interface MysqlError extends Error {
  code?: string;
}

const mysqlErrorMap: Record<string, number> = {
  ER_DUP_ENTRY: 409,
  ER_ROW_IS_REFERENCED_2: 409,
  ER_NO_REFERENCED_ROW_2: 400,
  PROTOCOL_CONNECTION_LOST: 503,
  ECONNREFUSED: 503,
  ETIMEDOUT: 504,
};

const mysqlMessageMap: Record<string, string> = {
  ER_DUP_ENTRY: 'Duplicate entry',
  ER_ROW_IS_REFERENCED_2: 'Record is referenced by other data',
  ER_NO_REFERENCED_ROW_2: 'Referenced record does not exist',
  PROTOCOL_CONNECTION_LOST: 'Database connection lost',
  ECONNREFUSED: 'Database connection refused',
  ETIMEDOUT: 'Database connection timed out',
};

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  console.error(`[${new Date().toISOString()}] ${err.name}: ${err.message}`);

  if (err instanceof BusinessError) {
    sendBusinessError(res, err.messageCode, err.message);
    return;
  }

  if (err instanceof AppError) {
    const body: ApiResponse<null> = { success: false, statusCode: err.statusCode, messageCode: null, message: err.message, data: null };
    res.status(err.statusCode).json(body);
    return;
  }

  const mysqlErr = err as MysqlError;
  if (mysqlErr.code && mysqlErrorMap[mysqlErr.code]) {
    const statusCode = mysqlErrorMap[mysqlErr.code];
    const message = mysqlMessageMap[mysqlErr.code];
    const body: ApiResponse<null> = { success: false, statusCode, messageCode: null, message, data: null };
    res.status(statusCode).json(body);
    return;
  }

  const body: ApiResponse<null> = { success: false, statusCode: 500, messageCode: null, message: 'Internal server error', data: null };
  res.status(500).json(body);
};
