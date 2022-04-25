import { checkIsMemberOfTeam } from './essential';
import { update } from 'lodash';
import { errorName } from '../constant/errorsConstant';
import prisma from '../prisma';
import logger from '../logger';
import { pubsub } from '../pubSub';

export const findOrCreateUserByEmail = async (email: string, picture: string, name, nickname: string) => {
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
            nickname,
            picture,
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

export const getListUsers = async (search = '', isGettingAll = false, page = 1, size = 10) => {
  try {
    const data = await prisma.user.findMany({
      where: {
        email: {
          contains: search,
          mode: 'insensitive',
        },
      },
      ...(!isGettingAll && { skip: (page - 1) * size }),
      ...(!isGettingAll && { take: size }),
      include: {
        members: true,
      },
      skip: (page - 1) * size,
      take: size,
      orderBy: {
        createdAt: 'asc',
      },
    });

    const total = await prisma.user.count({
      where: {
        email: {
          contains: search,
          mode: 'insensitive',
        },
      },
    });

    return {
      data,
      total,
    };
  } catch (error) {
    logger.error('Error in getListUsers service');
    throw error;
  }
};

export const getUser = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        notifications: true,
        skillValues: {
          include: {
            criteria: true,
          },
        },
      },
    });

    return user;
  } catch (error) {
    logger.error('Error in getUserById service');
    throw error;
  }
};

export const updateUser = async (userId: string, args: any) => {
  try {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        picture: args?.picture,
      },
    });

    if (!user) throw new Error(errorName.FORBIDDEN);

    return user;
  } catch (error) {
    logger.error('Error in updateUser service');
    throw error;
  }
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
