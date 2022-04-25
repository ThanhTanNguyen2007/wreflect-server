import { forEach } from 'lodash';
import { assessment, user } from '.';
import logger from '../logger';
import prisma from '../prisma';

export const remiderUserNotSubmitAssessment = async () => {
  try {
    const assessmentWillEnding = await prisma?.assessment?.findMany({
      where: {
        endDate: {
          gte: new Date(),
          lt: new Date(new Date().setDate(new Date().getDate() + 1)),
        },
        status: 'Doing',
      },
      include: {
        evaluations: {
          include: {
            assessor: true,
          },
        },
        team: true,
        creator: true,
      },
    });

    // send remider notification to user
    assessmentWillEnding.forEach(async (assessment) => {
      assessment?.evaluations?.forEach(async (evaluation) => {
        if (!evaluation?.isSubmit) {
          await prisma?.notification?.create({
            data: {
              title: `Assessment ${assessment?.name} will end today`,
              description: `Please visit to team (${assessment?.team?.name}) to do personal reflection for assessment (${assessment?.name})`,
              senderId: assessment?.creator?.userId,
              receiverId: evaluation?.assessor?.userId,
            },
          });
        }
      });
    });
  } catch (error) {
    logger?.error('some error occur', error);
  }
};

export const endAssessmentThatComplete = async () => {
  const currentDate = new Date();

  // close all assessment that enddate greater than today
  await prisma?.assessment?.updateMany({
    where: {
      endDate: {
        lt: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    },
    data: {
      status: 'Complete',
      completedDate: currentDate,
    },
  });

  //   if (numberOfCompletedAss?.count == 0) return;

  //   const completedAssessments = await prisma?.result?.findMany({
  //     where: {
  //       evaluation: {
  //         assessment: {
  //           completedDate: currentDate,
  //         },
  //       },
  //     },
  //     select: {
  //       concerningMember: {
  //         select: {
  //           userId: true,
  //         },
  //       },
  //     },
  //     distinct: ['concerningMemberId'],
  //   });

  //   completedAssessments?.forEach(async (result) => {
  //     const value = await prisma?.answerOnCriteria?.groupBy({
  //       where: {
  //         Result: {
  //           concerningMember: {
  //             userId: result?.concerningMember?.userId,
  //           },
  //         },
  //       },
  //       by: ['criteriaId'],
  //       _avg: {
  //         point: true,
  //       },
  //     });

  //     if (value && value?.length == 0) return;

  //     value?.forEach(async (valu) => {
  //       await prisma?.userOnCriteria.upsert({
  //         where: {
  //           userId_criteriaId: {
  //             userId: result?.concerningMember?.userId,
  //             criteriaId: valu?.criteriaId,
  //           },
  //         },
  //         update: {
  //           value: valu?._avg,
  //         },
  //         create: {
  //           value: valu?._avg,
  //         },
  //       });
  //     });
  //   });

  //   console.log(completedDate);
};

export const updateSkillsValueOfUser = async () => {
  try {
    const listUser = await prisma?.user?.findMany();
    listUser?.forEach(async (user) => {
      const avgSkill = await prisma?.answerOnCriteria?.groupBy({
        where: {
          Result: {
            concerningMember: {
              userId: user?.id,
            },
          },
        },
        by: ['criteriaId'],
        _avg: {
          point: true,
        },
      });

      avgSkill?.forEach(async (skill) => {
        await prisma?.userOnCriteria?.upsert({
          where: {
            userId_criteriaId: {
              userId: user?.id,
              criteriaId: skill?.criteriaId,
            },
          },
          update: {
            value: skill?._avg?.point || 0,
          },
          create: {
            value: skill?._avg?.point || 0,
            userId: user?.id,
            criteriaId: skill?.criteriaId,
          },
        });
      });
    });
  } catch (error) {
    logger?.error('update skills value occur error ', error);
  }
};
