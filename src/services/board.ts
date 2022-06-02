import { update } from 'lodash';
import { createBoardArgs, deleteBoardArgs, updateBoardArgs } from '../apollo/TypeDefs/Board/boardTypes';
import prisma from '../prisma';
import error from '../errorsManagement';
import { checkIsMemberOwningTeam, checkIsMemberOfTeam } from './essential';

export const getBoards = async (teamId: string) => {
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

export const createBoard = async (meId: string, args: createBoardArgs) => {
  const memberOwnedTeam = await checkIsMemberOwningTeam(args.teamId, meId);

  const team = await prisma.team.update({
    where: {
      id: args.teamId,
    },
    data: {
      boards: {
        create: {
          isPublic: args.isPublic,
          isLocked: args.isLocked,
          disableDownVote: args.disableDownVote,
          disableUpVote: args.disableUpVote,
          isAnonymous: args.isAnonymous,
          votesLimit: args.votesLimit,
          title: args.title,
          createdBy: memberOwnedTeam?.user?.email,
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
      },
    },
    include: {
      members: {
        orderBy: [
          {
            isSuperOwner: 'desc',
          },
          {
            isOwner: 'desc',
          },
          {
            joinedAt: 'desc',
          },
        ],
        include: {
          user: true,
        },
      },
      boards: {
        include: {
          columns: {
            include: {
              opinions: {
                include: {
                  remarks: {
                    include: {
                      author: {
                        include: {
                          user: true,
                        },
                      },
                    },
                  },
                  author: {
                    include: {
                      user: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!team) return error.NotFound();

  return team;
};

export const updateBoard = async (meId: string, args: updateBoardArgs) => {
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
      endTime: args?.endTime ? new Date(args.endTime) : new Date(),
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

export const deleteBoard = async (meId: string, args: deleteBoardArgs) => {
  const memberOwnedTeam = await checkIsMemberOwningTeam(args.teamId, meId);

  if (memberOwnedTeam?.team?.boards?.length <= 1) {
    return error.METHOD_NOT_ALLOWED('Only have 1 board in this team, method delete not allowed');
  }

  const team = await prisma.team.update({
    where: {
      id: args.teamId,
    },
    data: {
      boards: {
        delete: {
          id: args.boardId,
        },
      },
    },
  });

  if (!team) return error.NotFound();

  return team;
};

export const updateMeetingNote = async (meId: string, teamId: string, boardId: string, meetingNote: string) => {
  await checkIsMemberOfTeam(teamId, meId);

  const updatingBoard = await prisma?.board?.update({
    where: {
      id: boardId,
    },
    data: {
      meetingNote,
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
    },
  });

  return updatingBoard;
};
