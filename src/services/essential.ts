import prisma from './../prisma';
import error from '../errorsManagement';
import { Member, User } from '@prisma/client';

export const checkIsMemberOfTeam = async (teamId: string, userId: string) => {
  const member = await prisma.member.findUnique({
    where: {
      userId_teamId: {
        userId,
        teamId,
      },
    },
    include: {
      user: true,
      team: true,
    },
  });

  if (!member) {
    return error.NotFound();
  }
  return member;
};

export const allowUpdatingBoard = async (member: Member & { user: User }, boardId: string) => {
  const where =
    member.isSuperOwner || member.isOwner
      ? undefined
      : {
          isLocked: false,
        };
  const board = await prisma.board.findFirst({
    where: {
      id: boardId,
      ...where,
    },
  });

  if (!board) {
    return error.HandleError(member);
  }
  return board;
};

export const checkIsMemberOwningTeam = async (teamId: string, meId: string) => {
  const memberOwnedTeam = await prisma.member.findFirst({
    where: {
      teamId,
      userId: meId,
      OR: [
        {
          isOwner: true,
        },
        {
          isSuperOwner: true,
        },
      ],
    },
    include: {
      user: true,
      team: {
        include: {
          boards: true,
        },
      },
    },
  });

  if (!memberOwnedTeam) return error.Forbidden();
  return memberOwnedTeam;
};

export const allowUpdatingOpinion = async (member: Member & { user: User }, opinionId: string) => {
  const where =
    member.isOwner || member.isSuperOwner
      ? undefined
      : {
          OR: [
            {
              authorId: member.id,
            },
            {
              isAction: true,
              responsible: {
                in: ['not-responsible', member.id],
              },
            },
          ],
        };

  const opinion = await prisma.opinion.findFirst({
    where: {
      id: opinionId,
      ...where,
    },
  });

  if (!opinion) {
    return error.HandleError(member);
  }
  return opinion;
};

export const allowUpdatingRemark = async (member: Member & { user: User }, remarkId: string) => {
  const where =
    member.isSuperOwner || member.isOwner
      ? undefined
      : {
          authorId: member.id,
        };

  const remark = await prisma.remark.findFirst({
    where: {
      id: remarkId,
      ...where,
    },
  });

  if (!remark) {
    return error.HandleError(member);
  }

  return remark;
};
