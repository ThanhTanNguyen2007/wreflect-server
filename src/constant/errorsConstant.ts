import { StatusCodes } from 'http-status-codes';

export enum errorName {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOTFOUND = 'NOTFOUND',
  BADREQUEST = 'BADREQUEST',
}

export const errorType = (errorName: string) => {
  switch (errorName) {
    case 'NOTFOUND':
      return {
        message: 'Requested not found',
        code: StatusCodes.NOT_FOUND,
      };
    case 'FORBIDDEN':
      return {
        message: 'You don\'t have permission for this request',
        code: StatusCodes.FORBIDDEN,
      };
    case 'BADREQUEST':
      return {
        message: 'Bad request user input',
        code: StatusCodes.BAD_REQUEST,
      };
    default:
      return {
        message: 'Somthing failed with server',
        code: StatusCodes.INTERNAL_SERVER_ERROR,
      };
  }
};
