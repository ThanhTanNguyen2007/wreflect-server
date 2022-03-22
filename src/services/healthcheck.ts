import { HealthCheck, MemberAnswer } from '@prisma/client';
import {
  startSurveyArgs,
  answerHealthCheckArgs,
  reopenHealthCheckArgs,
} from './../apollo/typeDefss/healthCheckTypeDefs';
import prisma from '../prisma';
import { checkIsMemberOwningTeam, checkIsMemberOfTeam } from './essential';

export const getHealthCheck = async (teamId: string, boardId: string) => {
  const healthCheck = await prisma.healthCheck.findFirst({
    where: {
      teamId,
      boardId,
    },
    include: {
      memberAnswers: {
        include: {
          answers: true,
          member: true,
        },
      },
      memberComments: {
        include: {
          member: true,
        },
      },
    },
  });

  return {
    healthCheck: healthCheck || null,
    memberAnswers: healthCheck?.memberAnswers || [],
    memberComments: healthCheck?.memberComments || [],
  };
};

export const createHealthCheck = async (userId: string, args: startSurveyArgs) => {
  const healthCheck = await prisma.healthCheck.create({
    data: {
      teamId: args.teamId,
      boardId: args.boardId,
      templateId: args.templateId,
      createdBy: userId,
      isAnonymous: args.isAnonymous,
      isCustom: args.isCustom,
      status: args.status,
    },
    include: {
      memberAnswers: {
        include: {
          answers: true,
          member: true,
        },
      },
      memberComments: {
        include: {
          member: true,
        },
      },
    },
  });

  return {
    healthCheck: healthCheck || null,
    memberAnswers: healthCheck?.memberAnswers || [],
    memberComments: healthCheck?.memberComments || [],
  };
};

export const setAnswerHealthCheck = async (userId: string, args: answerHealthCheckArgs) => {
  const member = await checkIsMemberOfTeam(args.teamId, userId);

  const createManyMemberComments = args.comments.map((comment) => {
    return {
      memberId: member.id,
      templateId: args.templateId,
      questionId: comment.questionId,
      text: comment.text,
    };
  });

  const healthCheck = await prisma.healthCheck.update({
    where: {
      boardId: args.boardId,
    },
    data: {
      memberAnswers: {
        create: {
          memberId: member.id,
          templateId: args.templateId,
          answers: {
            createMany: {
              data: args.answers,
            },
          },
        },
      },
      memberComments: {
        createMany: {
          data: createManyMemberComments,
        },
      },
    },
    include: {
      memberAnswers: {
        include: {
          answers: true,
          member: true,
        },
      },
      memberComments: {
        include: {
          member: true,
        },
      },
    },
  });

  return {
    healthCheck: healthCheck || null,
    memberAnswers: healthCheck?.memberAnswers || [],
    memberComments: healthCheck?.memberComments || [],
  };
};

export const reopenHealthCheck = async (userId: string, args: reopenHealthCheckArgs) => {
  checkIsMemberOwningTeam(userId, args.teamId);

  const healthCheck = await prisma.healthCheck.delete({
    where: {
      boardId: args.boardId,
    },
    include: {
      memberAnswers: {
        include: {
          answers: true,
          member: true,
        },
      },
      memberComments: {
        include: {
          member: true,
        },
      },
    },
  });

  if (!healthCheck) console.log('cant delete healthcheck');

  return {
    healthCheck: null,
    memberAnswers: [],
    memberComments: [],
  };
};
