import { RequestWithUserInfo } from './../types';
import { createBoardType, deleteBoardType, updateBoardType } from './../apollo/typeDefss/boardTypeDefs';
import { StatusCodes } from 'http-status-codes';
import { ApolloError } from 'apollo-server-errors';
import prisma from '../prisma';
import _, { now } from 'lodash';
import error from '../errorsManagement';
import { P } from 'pino';
import { argsToArgsConfig } from 'graphql/type/definition';
import { checkIsMemberOwningTeam, allowUpdatingBoard } from './essential';

export const getListBoardOfTeam = async (teamId: string) => {
  const boards = await prisma.board.findMany({
    where: {
      teamId,
    },
  });

  return boards;
};

export const getBoard = async (boardId: string, meId: string) => {
  const board = await prisma.board.findFirst({
    where: {
      id: boardId,
      team: {
        OR: [
          {
            members: {
              some: {
                userId: meId,
              },
            },
          },
          {
            isPublic: true,
          },
        ],
      },
    },
    include: {
      columns: {
        include: {
          opinions: {
            include: {
              remarks: true,
              author: true,
            },
          },
        },
      },
      team: {
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });

  !board && error.NotFound();

  return board;
};

export const createBoard = async (req: RequestWithUserInfo, args: createBoardType) => {
  const { id: meId, email } = req?.user;

  const board = await prisma.board.create({
    data: {
      teamId: args.teamId,
      isPublic: args.isPublic,
      isLocked: args.isLocked,
      disableDownVote: args.disableDownVote,
      disableUpVote: args.disableUpVote,
      isAnonymous: args.isAnonymous,
      votesLimit: args.votesLimit,
      title: args.title,
      createdBy: email,
      type: args.type,
      currentPhase: args.currentPhase,
      endTime: args.endTime,
      columns: {
        createMany: {
          data: [
            {
              title: args.column1 || '',
              isActive: args.isActiveCol1,
              position: 1,
            },
            {
              title: args.column2 || '',
              isActive: args.isActiveCol2,
              position: 2,
            },
            {
              title: args.column3 || '',
              isActive: args.isActiveCol3,
              position: 3,
            },
            {
              title: args.column4 || '',
              isActive: args.isActiveCol4,
              position: 4,
            },
            {
              title: args.column5 || '',
              isActive: args.isActiveCol5,
              position: 5,
            },
          ],
        },
      },
    },
  });

  return board;
};

export const updateBoard = async (meId: string, args: updateBoardType) => {
  await checkIsMemberOwningTeam(args.teamId, meId);

  const board = await prisma.board.update({
    where: {
      id: args.boardId,
    },
    data: {
      isPublic: args?.isPublic,
      isLocked: args?.isLocked,
      disableDownVote: args?.disableDownVote,
      disableUpVote: args?.disableUpVote,
      isAnonymous: args?.isAnonymous,
      votesLimit: args?.votesLimit,
      title: args?.title,
      timerInProgress: args?.timerInProgress,
      type: args?.type,
      currentPhase: args?.currentPhase,
      endTime: args?.endTime ? new Date(+args.endTime) : new Date(),
      columns: {
        updateMany: [
          {
            where: {
              position: 1,
            },
            data: {
              title: args?.column1,
              isActive: args?.isActiveCol1,
            },
          },
          {
            where: {
              position: 2,
            },
            data: {
              title: args?.column2,
              isActive: args?.isActiveCol2,
            },
          },
          {
            where: {
              position: 3,
            },
            data: {
              title: args?.column3,
              isActive: args?.isActiveCol3,
            },
          },
          {
            where: {
              position: 4,
            },
            data: {
              title: args?.column4,
              isActive: args?.isActiveCol4,
            },
          },
          {
            where: {
              position: 5,
            },
            data: {
              title: args?.column5,
              isActive: args?.isActiveCol5,
            },
          },
        ],
      },
    },
    include: {
      columns: {
        orderBy: {
          position: 'asc',
        },
        include: {
          opinions: {
            include: {
              remarks: true,
            },
          },
        },
      },
      team: {
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });

  return board;
};

export const deleteBoard = async (meId: string, args: deleteBoardType) => {
  const memberOwnedTeam = await checkIsMemberOwningTeam(args.teamId, meId);

  if (memberOwnedTeam?.team?.boards?.length <= 1) {
    return error.METHOD_NOT_ALLOWED('Only have 1 board in this team, method delete not allowed');
  }
  const deletingBoard = await prisma.board.delete({
    where: {
      id: args.boardId,
    },
  });

  return deletingBoard;
};
