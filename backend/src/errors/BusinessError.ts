import { BusinessCode, BUSINESS_MESSAGE } from '../constants/businessCode';

export class BusinessError extends Error {
  public readonly messageCode: BusinessCode;

  constructor(code: BusinessCode, message?: string) {
    super(message ?? BUSINESS_MESSAGE[code]);
    this.name = 'BusinessError';
    this.messageCode = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
