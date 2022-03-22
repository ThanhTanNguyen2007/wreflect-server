import { Response, NextFunction } from 'express';
import StatusCodes from 'http-status-codes';
import { setCookie } from '../helpers';
import * as services from '../services';
import { RequestWithUserInfo } from '../types';
import config from '../config';
import logger from '../logger';

const sessionManager = async (
  req: RequestWithUserInfo,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  try {
    const PUBLIC_PATHS = ['/api/login', '/api/me', '/api/resend_verification_email'];
    if (PUBLIC_PATHS.includes(req.path)) {
      next();
      return;
    }

    const email = req?.cookies?.email;
    const token = req?.cookies?.token;

    const sanitizedUser = await services.session.checkAndExtendSession(email, token);
    if (!sanitizedUser) {
      setCookie('email', '', 0, res);
      setCookie('token', '', 0, res);
      // return error.UnAuthorized();
      return res.status(StatusCodes.UNAUTHORIZED).send('Unauthen');
      // throw new ApolloError('Unauthorized user', `${StatusCodes.UNAUTHORIZED}`);
    }
    const oneDayInMilliseconds = config.SESSION_DURATION_MINUTES * 60 * 1000;
    // TODO: Refactor cookie adding and remove to one place
    setCookie('email', email, oneDayInMilliseconds, res);
    setCookie('token', token, oneDayInMilliseconds, res);
    req.user = sanitizedUser;
    next();
  } catch (error) {
    if (error instanceof Error) logger.info(error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  }
};

export default sessionManager;
