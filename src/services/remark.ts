import error from './../errorsManagement';
import { Opinion } from '@prisma/client';
import { RequestWithUserInfo } from './../types';
import { StatusCodes } from 'http-status-codes';
import { ApolloError } from 'apollo-server-errors';
import { createRemarkType, removeRemarkType } from './../apollo/typeDefss/remarkTypeDefs';
import prisma from '../prisma';
import { checkIsMemberOfTeam, allowUpdatingRemark, allowUpdatingOpinion } from './essential';
import { remark } from '.';

export const getListRemarks = (opinionId: string) => {
  const remarks = prisma.remark.findMany({
    where: {
      opinionId,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
  return remarks;
};

export const createRemark = async (meId: string, args: createRemarkType) => {
  const member = await checkIsMemberOfTeam(args.teamId, meId);
  // await allowUpdatingOpinion(member, args.opinionId);

  const opinion = await prisma.opinion.update({
    where: {
      id: args.opinionId,
    },
    data: {
      remarks: {
        create: {
          text: args.text,
          authorId: member.id,
        },
      },
    },
  });

  return opinion;
};

export const removeRemark = async (meId: string, args: removeRemarkType) => {
  const member = await checkIsMemberOfTeam(args.teamId, meId);
  await allowUpdatingRemark(member, args.remarkId);

  const opinion = await prisma.opinion.update({
    where: {
      id: args.opinionId,
    },
    data: {
      remarks: {
        delete: {
          id: args.remarkId,
        },
      },
    },
  });

  return opinion;
};
