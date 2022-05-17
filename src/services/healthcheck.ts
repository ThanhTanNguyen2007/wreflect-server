import { checkIsMemberOwningTeam, checkIsMemberOfTeam } from './essential';
// import { HealthCheck, MemberAnswer } from '@prisma/client';
import {
  answerHealthCheckArgs,
  reopenHealthCheckArgs,
  createHealthCheckArgs,
  submitHealthCheckAnswerArgs,
} from '../apollo/TypeDefs/HealthCheck/healthCheckTypeDefs';
import prisma from '../prisma';
import errorsManagement from '../errorsManagement';
import { TypeNameMetaFieldDef } from 'graphql';

export const getHealthCheck = async (teamId: string, boardId: string) => {
  const healthCheck = await prisma.healthCheck.findFirst({
    where: {
      teamId,
      boardId,
    },
    include: {
      memberOnHealthCheck: {
        include: {
          member: {
            include: {
              user: true,
            },
          },
          question: true,
        },
      },
    },
  });

  return healthCheck;
};

export const createHealthCheck = async (meId: string, args: createHealthCheckArgs) => {
  await checkIsMemberOwningTeam(args?.teamId, meId);

  const creatingHealthCheck = await prisma?.healthCheck?.create({
    data: {
      teamId: args?.teamId,
      boardId: args?.boardId,
      templateId: args?.templateId,
      isAnonymous: args?.isAnonymous,
    },
    include: {
      memberOnHealthCheck: {
        include: {
          member: {
            include: {
              user: true,
            },
          },
          question: true,
        },
      },
    },
  });

  if (!creatingHealthCheck) return errorsManagement?.BadRequest('Cant create Health Check');

  return creatingHealthCheck;
};

export const submitHealthCheckAnswer = async (meId: string, args: submitHealthCheckAnswerArgs) => {
  const memberOwnedTeam = await checkIsMemberOfTeam(args?.teamId, meId);

  const createAnswerOnQuestion = args?.answers?.map((answer) => ({
    questionId: answer?.questionId,
    point: answer?.point,
    comment: answer?.comment,
    memberId: memberOwnedTeam?.id,
  }));

  const submitingHealthCheck = await prisma?.healthCheck?.update({
    where: {
      teamId_boardId: {
        teamId: args?.teamId,
        boardId: args?.boardId,
      },
    },
    data: {
      memberOnHealthCheck: {
        create: [...createAnswerOnQuestion],
      },
    },
    include: {
      memberOnHealthCheck: {
        include: {
          member: {
            include: {
              user: true,
            },
          },
          question: true,
        },
      },
    },
  });

  return submitingHealthCheck;
};

// export const createHealthCheck = async (userId: string, args: startSurveyArgs) => {
//   const healthCheck = await prisma.healthCheck.create({
//     data: {
//       teamId: args.teamId,
//       boardId: args.boardId,
//       templateId: args.templateId,
//       createdBy: userId,
//       isAnonymous: args.isAnonymous,
//       isCustom: args.isCustom,
//       status: args.status,
//     },
//     include: {
//       memberAnswers: {
//         include: {
//           answers: true,
//           member: true,
//         },
//       },
//       memberComments: {
//         include: {
//           member: true,
//         },
//       },
//     },
//   });

//   return {
//     healthCheck: healthCheck || null,
//     memberAnswers: healthCheck?.memberAnswers || [],
//     memberComments: healthCheck?.memberComments || [],
//   };
// };

// export const setAnswerHealthCheck = async (userId: string, args: answerHealthCheckArgs) => {
//   const member = await checkIsMemberOfTeam(args.teamId, userId);

//   const createManyMemberComments = args.comments.map((comment) => {
//     return {
//       memberId: member.id,
//       templateId: args.templateId,
//       questionId: comment.questionId,
//       text: comment.text,
//     };
//   });

//   const healthCheck = await prisma.healthCheck.update({
//     where: {
//       boardId: args.boardId,
//     },
//     data: {
//       memberAnswers: {
//         create: {
//           memberId: member.id,
//           templateId: args.templateId,
//           answers: {
//             createMany: {
//               data: args.answers,
//             },
//           },
//         },
//       },
//       memberComments: {
//         createMany: {
//           data: createManyMemberComments,
//         },
//       },
//     },
//     include: {
//       memberAnswers: {
//         include: {
//           answers: true,
//           member: true,
//         },
//       },
//       memberComments: {
//         include: {
//           member: true,
//         },
//       },
//     },
//   });

//   return {
//     healthCheck: healthCheck || null,
//     memberAnswers: healthCheck?.memberAnswers || [],
//     memberComments: healthCheck?.memberComments || [],
//   };
// };

export const reopenHealthCheck = async (userId: string, args: reopenHealthCheckArgs) => {
  checkIsMemberOwningTeam(userId, args.teamId);

  const deletingHealthCheck = await prisma.healthCheck.delete({
    where: {
      teamId_boardId: {
        teamId: args?.teamId,
        boardId: args?.boardId,
      },
    },
  });
  if (!deletingHealthCheck) errorsManagement?.BadRequest('Cant delete healthcheck');
  return deletingHealthCheck;
};
