import { checkIsMemberOfTeam, allowUpdatingBoard, allowUpdatingOpinion } from './essential';
import { StatusCodes } from 'http-status-codes';
import { ApolloError } from 'apollo-server-errors';
import prisma from '../prisma';
import {
  combineOpinionType,
  createOpinionType,
  orderOpinionType,
  removeOpinionType,
  updateOpinionType,
} from '../apollo/typeDefss/opinionTypeDefs';
import { RequestWithUserInfo } from '../types';
import error from '../errorsManagement';
import { member, user } from '.';

export const getListOpinions = (columnId: string) => {
  const opinions = prisma.opinion.findMany({
    where: {
      columnId,
    },
    orderBy: {
      position: 'asc',
    },
  });

  return opinions;
};

export const getOpinion = async (opinionId: string) => {
  const opinion = await prisma.opinion.findUnique({
    where: {
      id: opinionId,
    },
  });
  return opinion;
};

export const createOpinion = async (meId: string, args: createOpinionType) => {
  const memberOfTeam = await checkIsMemberOfTeam(args.teamId, meId);
  await allowUpdatingBoard(memberOfTeam, args.boardId);

  const max = await prisma.opinion.aggregate({
    where: {
      columnId: args.columnId,
    },
    _max: {
      position: true,
    },
  });

  const updatePositionOpinion = args.isCreateBottom
    ? undefined
    : {
        updateMany: {
          where: {
            position: {
              gte: 0,
            },
          },
          data: {
            position: {
              increment: 1,
            },
          },
        },
      };

  const column = await prisma.column.update({
    where: {
      id: args.columnId,
    },
    data: {
      opinions: {
        ...updatePositionOpinion,
        create: {
          text: args.text,
          isAction: args.isAction,
          authorId: memberOfTeam.id,
          updatedBy: memberOfTeam.id,
          position:
            (max?._max?.position || max?._max?.position == 0) && args.isCreateBottom ? max._max.position + 1 : 0,
        },
      },
    },
    include: {
      opinions: {
        include: {
          remarks: {
            include: {
              author: {
                include: { user: true },
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
          author: {
            include: { user: true },
          },
        },
        orderBy: {
          position: 'asc',
        },
      },
    },
  });

  if (!column) return error.Forbidden();
  return column;
};

export const updateOpinion = async (teamId: string, userId: string, args: updateOpinionType) => {
  // await isOwnedOpinion(args.opinionId, userId);

  const opinion = await prisma.opinion.update({
    where: {
      id: args.opinionId,
    },
    data: {
      text: args?.text,
      upVote: args?.upVote,
      downVote: args?.downVote,
      isBookmarked: args?.isBookmarked,
      isAction: args?.isAction,
      responsible: args?.responsible,
      color: args?.color,
      status: args?.status,
      columnId: args?.newColumnId,
    },
  });

  return opinion;
};

export const removeOpinion = async (userId: string, args: removeOpinionType) => {
  const memberOfTeam = await checkIsMemberOfTeam(args.teamId, userId);
  await allowUpdatingOpinion(memberOfTeam, args.opinionId);

  const column = await prisma.column.update({
    where: {
      id: args.columnId,
    },
    data: {
      opinions: {
        delete: {
          id: args.opinionId,
        },
      },
    },
  });

  if (!column) return error.NotFound();
  return column;
};

export const orderOpinion = async (req: RequestWithUserInfo, args: orderOpinionType) => {
  const column =
    args.destination.droppableId === args.source.droppableId
      ? args.source.index == args.destination.index
        ? undefined
        : {
            update: {
              where: {
                id: args.destination.droppableId,
              },
              data: {
                opinions: {
                  updateMany: [
                    {
                      where: {
                        position: args.destination.index,
                      },
                      data: {
                        position: args.source.index,
                      },
                    },
                    {
                      where: {
                        id: args.draggableId,
                      },
                      data: { position: args.destination.index },
                    },
                  ],
                },
              },
            },
          }
      : {
          update: [
            {
              where: {
                id: args.destination.droppableId,
              },
              data: {
                opinions: {
                  connect: {
                    id: args.draggableId,
                  },
                  updateMany: [
                    {
                      where: {
                        position: {
                          gte: args.destination.index,
                        },
                      },
                      data: {
                        position: {
                          increment: 1,
                        },
                      },
                    },
                    {
                      where: {
                        id: args.draggableId,
                      },
                      data: {
                        position: args.destination.index,
                      },
                    },
                  ],
                },
              },
            },
            {
              where: {
                id: args.source.droppableId,
              },
              data: {
                opinions: {
                  disconnect: {
                    id: args.draggableId,
                  },
                  updateMany: {
                    where: {
                      position: {
                        gt: args.source.index,
                      },
                    },
                    data: {
                      position: {
                        decrement: 1,
                      },
                    },
                  },
                },
              },
            },
          ],
        };

  const board = await prisma.board.update({
    where: {
      id: args.boardId,
    },
    data: {
      columns: {
        ...column,
      },
    },
  });

  if (!board) return error.NotFound();
  return board;
};

export const combineOpinion = async (req: RequestWithUserInfo, args: combineOpinionType) => {
  const currentOpinion = await prisma.opinion.findFirst({
    where: {
      id: args.draggableId,
    },
    include: {
      remarks: true,
    },
  });

  if (!currentOpinion) throw new ApolloError('Data not found', `${StatusCodes.NOT_FOUND}`);

  await prisma.$transaction([
    prisma.column.update({
      where: {
        id: args.combine.droppableId,
      },
      data: {
        opinions: {
          update: {
            where: {
              id: args.combine.draggableId,
            },
            data: {
              text: args.text,
              mergedAuthors: {
                push: currentOpinion.authorId ?? undefined,
              },
              remarks: {
                connect: currentOpinion.remarks.map((remark) => {
                  return { id: remark.id };
                }),
              },
              upVote: {
                push: currentOpinion.upVote,
              },
            },
          },
        },
      },
    }),
    prisma.column.update({
      where: {
        id: args.source.droppableId,
      },
      data: {
        opinions: {
          updateMany: {
            where: {
              position: {
                gt: args.source.index,
              },
            },
            data: {
              position: {
                decrement: 1,
              },
            },
          },
          delete: {
            id: args.draggableId,
          },
        },
      },
    }),
  ]);
  const board = await prisma.board.findFirst({
    where: {
      columns: {
        some: {
          id: args.source.droppableId,
        },
      },
    },
    include: {
      columns: {
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
