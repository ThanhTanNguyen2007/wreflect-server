import { getListDataType } from './../types';
import { StatusCodes } from 'http-status-codes';
import config from '../config';
import prisma from './../prisma';
import { createTeamArgs, RequestWithUserInfo, updateTeamArgs } from '../types';
import { Team, TeamStatus, BanningUser } from '@prisma/client';
import { errorName } from '../constant/errorsConstant';
import { ForbiddenError, ApolloError } from 'apollo-server-errors';
import { checkIsMemberOfTeam, checkIsMemberOwningTeam, allowUpdatingOpinion, checkIsAdmin } from './essential';
import error from '../errorsManagement';
import { updateActionTrackerType } from '../apollo/TypeDefs/opinionTypeDefs';
import errorsManagement from '../errorsManagement';

export const getTeams = async (
  isAdmin: boolean,
  isGettingAll = false,
  page = 1,
  size = 8,
  search = '',
  status?: TeamStatus,
) => {
  await checkIsAdmin(isAdmin);

  const data = await prisma.team.findMany({
    where: {
      AND: [
        {
          name: {
            contains: search.trim().toLowerCase(),
            mode: 'insensitive',
          },
        },
        {
          status: status?.trim() == 'ALL' ? undefined : status,
        },
      ],
    },
    ...(!isGettingAll && { skip: (page - 1) * size }),
    ...(!isGettingAll && { take: size }),
    orderBy: {
      createdAt: 'desc',
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

  const total = await prisma.team.count({
    where: {
      AND: [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          status: status?.trim() == 'ALL' ? undefined : status,
        },
      ],
    },
  });

  return {
    data,
    total,
    page,
    size,
  };
};

export const getTeamsOfUser = async (meId: string, isGettingAll = false, page = 1, size = 8, search = '') => {
  const myTeams = await prisma.team.findMany({
    where: {
      members: {
        some: {
          userId: meId,
        },
      },
      name: {
        contains: search,
        mode: 'insensitive',
      },
    },
    ...(!isGettingAll && { skip: (page - 1) * size }),
    ...(!isGettingAll && { take: size }),
    orderBy: { createdAt: 'desc' },
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

  const total = await prisma.team.count({
    where: {
      members: {
        some: {
          userId: meId,
        },
      },
      name: {
        contains: search,
        mode: 'insensitive',
      },
    },
  });

  return {
    data: myTeams,
    total,
    page,
    size,
  };
};

export const getTeam = async (meId: string, isAdmin: boolean, teamId: string) => {
  // const memberOfTeam = await checkIsMemberOfTeam(teamId, meId);
  // const member = await prisma.member.findUnique({
  //   where: {
  //     userId_teamId: {
  //       userId: meId,
  //       teamId,
  //     },
  //   },
  //   include: {
  //     user: true,
  //     team: true,
  //   },
  // });

  const where = !isAdmin
    ? {
        OR: [
          {
            isPublic: true,
          },
          // {
          //   boards: {
          //     some: {
          //       isPublic: true,
          //     },
          //   },
          // },
          {
            members: {
              some: {
                userId: meId,
              },
            },
          },
        ],
      }
    : undefined;

  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
      ...where,
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

export const createTeam = async (req: RequestWithUserInfo, data: createTeamArgs) => {
  const { id: meId } = req.user;

  const startDate = data.startDate ? new Date(data.startDate) : new Date();
  const endDate = data.endDate ? new Date(data.endDate) : new Date();

  const team = await prisma.team.create({
    data: {
      picture: `${config.SERVER_URL}/uploads/teamDefault.png`,
      name: data?.name?.trim(),
      isPublic: data?.isPublic,
      description: data?.description?.trim(),
      startDate,
      endDate,
      boards: {
        create: {
          createdBy: meId,
          title: 'Default Board',
          columns: {
            createMany: {
              data: [
                {
                  title: 'Went Well',
                  isActive: true,
                  position: 1,
                },
                {
                  title: 'To Improve',
                  isActive: true,
                  position: 2,
                },
                {
                  title: 'Action Items',
                  isActive: true,
                  position: 3,
                },
                {
                  title: '',
                  isActive: false,
                  position: 4,
                },
                {
                  title: '',
                  isActive: false,
                  position: 5,
                },
              ],
            },
          },
        },
      },
      members: {
        create: {
          isSuperOwner: true,
          userId: meId,
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

  return team;
};

export const updateTeam = async (meId: string, args: updateTeamArgs): Promise<Team> => {
  const startDate = args.startDate ? new Date(args.startDate) : undefined;
  const endDate = args.endDate ? new Date(args.endDate) : undefined;
  await checkIsMemberOwningTeam(args?.teamId, meId);

  const team = await prisma.team.update({
    where: {
      id: args.teamId,
    },
    data: {
      name: args.name?.trim(),
      description: args.description?.trim(),
      isPublic: args.isPublic,
      picture: args.picture?.trim(),
      startDate,
      endDate,
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

  return team;
};

export const changeTeamAccess = async (meId: string, teamId: string, isPublic: boolean) => {
  await checkIsMemberOwningTeam(teamId, meId);

  const team = await prisma.team.update({
    where: {
      id: teamId,
    },
    data: {
      isPublic: isPublic,
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

export const deleteTeam = async (meId: string, teamId: string) => {
  await checkIsMemberOwningTeam(teamId, meId);

  const deletingTeam = await prisma.team.delete({
    where: {
      id: teamId,
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

  return deletingTeam;
};

export const updateActionTracker = async (meId: string, args: updateActionTrackerType) => {
  const memberOfTeam = await checkIsMemberOfTeam(args?.teamId, meId);

  await allowUpdatingOpinion(memberOfTeam, args.opinionId);

  const team = await prisma.team.update({
    where: {
      id: args.teamId,
    },
    data: {
      boards: {
        update: [
          {
            where: {
              id: args.sourceBoardId,
            },
            data: {
              columns: {
                update: {
                  where: {
                    id: args.sourceColumnId,
                  },
                  data: {
                    opinions: {
                      disconnect: {
                        id: args.opinionId,
                      },
                    },
                  },
                },
              },
            },
          },
          {
            where: {
              id: args.destinationBoardId,
            },
            data: {
              columns: {
                update: {
                  where: {
                    id: args.destinationColumnId,
                  },
                  data: {
                    opinions: {
                      connect: {
                        id: args.opinionId,
                      },
                      update: {
                        where: {
                          id: args.opinionId,
                        },
                        data: {
                          responsible: args.responsible,
                          status: args.status,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      },
    },
  });

  if (!team) return error?.NotFound();
  return team;
};

export const joinTeamWithLink = async (meId: string, teamId: string) => {
  const memberOfTeam = await prisma.member.findUnique({
    where: {
      userId_teamId: {
        userId: meId,
        teamId,
      },
    },
    include: {
      user: true,
      team: true,
    },
  });
  if (memberOfTeam && !memberOfTeam?.isPendingInvitation) return errorsManagement?.BadRequest();
  //avoid member already joined team

  const updatingTeam = memberOfTeam?.isPendingInvitation
    ? {
        update: {
          where: { id: 'fdsf' },
          data: {
            isPendingInvitation: true,
          },
        },
      }
    : {
        create: {
          userId: meId,
        },
      };

  const condition = memberOfTeam?.isPendingInvitation ? undefined : { isPublic: true };

  const team = await prisma?.team?.findFirst({
    where: {
      id: teamId,
      ...condition,
    },
  });

  if (!team) return errorsManagement?.Forbidden('Team not found or not public to join');

  const newTeam = await prisma?.team?.update({
    where: {
      id: teamId,
    },
    data: {
      members: {
        ...updatingTeam,
      },
    },
    include: {
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
    },
  });

  return newTeam;
};
