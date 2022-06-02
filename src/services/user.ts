import { updateUserArgs } from './../apollo/TypeDefs/userTypeDefs';
import { checkIsAdmin, checkIsMemberOfTeam } from './essential';
import { update } from 'lodash';
import { errorName } from '../constant/errorsConstant';
import prisma from '../prisma';
import logger from '../logger';
import { pubsub } from '../pubSub';
import { banUserArgs } from '../apollo/TypeDefs/userTypeDefs';
import { P } from 'pino';

export const findOrCreateUserByEmail = async (
  email: string,
  picture: string,
  userId: string,
  name: string,
  nickname: string,
  sub: string,
) => {
  try {
    const findUser = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        members: true,
      },
    });

    // const getAllCriteria = await prisma?.user?.findMany();

    const updateData =
      findUser && findUser.nickname === 'UnRegistered' && findUser.members[0].isPendingInvitation
        ? {
            sub,
            members: {
              updateMany: {
                where: {
                  userId: findUser.id,
                },
                data: {
                  isPendingInvitation: false,
                },
              },
            },
          }
        : undefined;

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        email,
        userStatus: 'ONLINE',
        ...updateData,
      },
      create: {
        email,
        sub,
        userStatus: 'ONLINE',
        picture,
        nickname,
        skillValues: {},
      },
    });

    // if (updateData) {
    //   const team = prisma.team.find

    //   pubsub.publish('ADD_MEMBER', {
    //     subOnUpdateTeam: ,
    //   });
    // }

    return user;
  } catch (error) {
    logger.info('Error in findOrCreateUserByEmail');
    throw error;
  }
};

export const getUsers = async (isAdmin: boolean, isGettingAll = false, search = '', page = 1, size = 10) => {
  checkIsAdmin(isAdmin);

  const getUsers = await prisma.user.findMany({
    where: {
      OR: [
        {
          nickname: {
            contains: search?.trim().toLowerCase(),
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: search?.trim().toLowerCase(),
            mode: 'insensitive',
          },
        },
      ],
      isRegistered: true,
    },
    ...(!isGettingAll && { skip: (page - 1) * size }),
    ...(!isGettingAll && { take: size }),
    include: {
      banningUser: true,
      sessions: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const total = await prisma.user.count({
    where: {
      OR: [
        {
          nickname: {
            contains: search?.trim().toLowerCase(),
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ],
    },
  });

  return {
    data: getUsers,
    total,
    page,
    size,
  };
};

export const getUser = async (meId: string, userId?: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId ? userId : meId,
    },
    include: {
      notifications: true,
      skillValues: {
        include: {
          criteria: true,
        },
      },
      sessions: true,
    },
  });

  return user;
};

type cachedSkillsValue = {
  criteriaId: string;
  value: number;
  userId: string;
  date: string;
};

export const getSkillsAnalytic = async (meId: string) => {
  const skillsAnalytic = await prisma?.answerOnCriteria?.groupBy({
    where: {
      Result: {
        concerningMember: {
          userId: meId,
        },
      },
    },
    by: ['criteriaId'],
    _avg: {
      point: true,
    },
    _count: {
      point: true,
    },
    _max: {
      point: true,
    },
    _sum: {
      point: true,
    },
  });

  const skillList = await prisma?.criteria?.findMany({
    where: {
      id: { in: [...skillsAnalytic?.map((x) => x?.criteriaId)] },
    },
  });

  const mergedData = await Promise.all(
    skillList?.map((x) => {
      const skill = skillsAnalytic?.find((y) => y?.criteriaId === x?.id);
      if (skill) return { criteria: x, _avg: skill?._avg, _count: skill?._count };
    }),
  );

  return mergedData;
};

export const banUser = async (isAdmin: boolean, args: banUserArgs) => {
  checkIsAdmin(isAdmin);

  const startDate = args?.startDate ? new Date(args?.startDate) : new Date();
  const endDate = args?.endDate ? new Date(args?.endDate) : new Date();

  const banUser = await prisma?.user?.update({
    where: {
      id: args?.userId,
    },
    data: {
      banningUser: {
        create: {
          title: args?.title,
          description: args?.description,
          isBannedForever: args?.isBannedForever,
          startBanned: startDate,
          endBanned: endDate,
        },
      },
    },
    include: {
      banningUser: true,
    },
  });

  return banUser;
};

export const updateUser = async (meId: string, args: updateUserArgs) => {
  const updatingUser = await prisma?.user?.update({
    where: {
      id: meId,
    },
    data: {
      nickname: args?.nickname,
      picture: args?.picture,
      gender: args?.gender,
      workplace: args?.workplace,
      address: args?.address,
      school: args?.school,
      introduction: args?.introduction,
      talents: args?.talents,
      interests: args?.interests,
    },
    include: {
      sessions: true,
      notifications: true,
    },
  });

  return updatingUser;
};
