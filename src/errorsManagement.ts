import { Member, User } from '@prisma/client';
import { ApolloError } from 'apollo-server-errors';
import { StatusCodes } from 'http-status-codes';

const NotFound = (messageErr?: string): never => {
  throw new ApolloError(messageErr || 'Data not found or not allowed to access', `${StatusCodes.NOT_FOUND}`);
};

const UnAuthorized = (mesageErr?: string): never => {
  throw new ApolloError(mesageErr || 'Unauthorized user', `${StatusCodes.UNAUTHORIZED}`);
};

const Forbidden = (messageErr?: string): never => {
  throw new ApolloError(messageErr || 'You dont have permission for this mutation', `${StatusCodes.FORBIDDEN}`);
};

const HandleError = (member: Member & { user: User }) => {
  if (member.isOwner || member.isSuperOwner || member.user.isAdmin) {
    return NotFound();
  } else return Forbidden();
};

const METHOD_NOT_ALLOWED = (messageErr?: string): never => {
  throw new ApolloError(messageErr || 'Method not allowed', `${StatusCodes.METHOD_NOT_ALLOWED}`);
};

export default { NotFound, Forbidden, UnAuthorized, METHOD_NOT_ALLOWED, HandleError };
