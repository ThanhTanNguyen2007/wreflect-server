import { TeamStatus } from '.prisma/client';
import { Request } from 'express';
import { User } from '@prisma/client';

export type SanitizedUser = {
  id: number;
  email: string;
  isAdmin: boolean;
  picture: string;
  status: string;
};

export interface RequestWithUserInfo extends Request {
  user: User;
}

export type UserStatus = 'NotInitiated' | 'Initiated' | 'Completed';
export enum UserStatusEnum {
  NotInitiated = 'NotInitiated',
  Initiated = 'Initiated',
  Completed = 'Completed',
}

export const apiPaths = ['/api', '/graphql'];

export type customerError = {
  message: string;
  code: number;
};

export type createTeamArgs = {
  name: string;
  startDate: string;
  endDate: string;
  isPublic: boolean;
  description?: string;
  picture?: string;
};

export type updateTeamArgs = {
  teamId: string;
  name?: string;
  startDate?: string;
  endDate?: string;
  isPublic?: boolean;
  picture?: string;
  description?: string;
};

export type updateProfileType = {
  introduction?: string;
  talents?: string[];
  interests?: string[];
  name?: string;
};

export type addMemberToTeamType = {
  emailUsers: string[];
  teamId: string;
};

export type removeMemberType = {
  memberId: string;
};

export type setRoleMemberType = {
  memberId: string;
  teamId: string;
  isOwner: boolean;
};

export type getListDataType = {
  status?: TeamStatus;
  isGettingAll?: boolean;
  search?: string;
  page?: number;
  size?: number;
};

export type getListMembersType = {
  teamId: string;
};

export type updateUserType = {
  firstName?: string;
  lastName?: string;
  gender?: string;
  workplace?: string;
  userStatus?: string;
  school?: string;
  introduction?: string;
  phoneNumbers?: string[];
  photos?: string[];
  talents?: string;
  interests?: string;
};
