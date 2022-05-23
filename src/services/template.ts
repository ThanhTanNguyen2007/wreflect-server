import {
  createCustomTemplateArgs,
  deleteCustomTemplateForTeamArgs,
  getTemplatesArgs,
  updateCustomTemplateArgs,
} from '../apollo/TypeDefs/templateTypeDefs';
import { createTemplateHealthCheckArgs, updateTemplateHealthCheckArgs } from '../apollo/TypeDefs/templateTypeDefs';
import { checkIsAdmin, checkIsMemberOfTeam, checkIsMemberOwningTeam } from './essential';
import error from '../errorsManagement';
import prisma from '../prisma';
import errorsManagement from '../errorsManagement';

export const getTemplatesOfTeam = async (teamId, meId) => {
  await checkIsMemberOfTeam(teamId, meId);

  const gettingTemplates = await prisma?.template.findMany({
    where: {
      OR: [
        {
          isDefault: true,
          isBlocked: false,
        },
        {
          teamId,
        },
      ],
    },
    include: {
      healthCheckQuestions: true,
    },
    orderBy: [
      {
        createdAt: 'desc',
      },
      {
        isDefault: 'asc',
      },
    ],
  });
  return gettingTemplates;
};

export const getTemplates = async (isGettingAll = false, search = '', page = 1, size = 10) => {
  const templates = await prisma?.template?.findMany({
    where: {
      isDefault: true,
      title: {
        contains: search.trim().toLowerCase(),
        mode: 'insensitive',
      },
    },
    ...(!isGettingAll && { skip: (page - 1) * size }),
    ...(!isGettingAll && { take: size }),
    include: {
      healthCheckQuestions: {
        include: {
          memberOnHealthCheck: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const total = await prisma.template.count({
    where: {
      isDefault: true,
      title: {
        contains: search,
      },
    },
  });

  return {
    data: templates,
    total,
  };
};

export const createTemplate = async (isAdmin: boolean, args: createTemplateHealthCheckArgs) => {
  await checkIsAdmin(isAdmin);

  const createHealthCheckQuestion = args?.questions?.map((question) => ({
    title: question?.title,
    description: question?.description,
    color: question?.color,
  }));

  const creatingTemplate = await prisma?.template?.create({
    data: {
      title: args?.name,
      isDefault: true,
      healthCheckQuestions: {
        create: [...createHealthCheckQuestion],
      },
    },
    include: {
      healthCheckQuestions: {
        include: {
          memberOnHealthCheck: true,
        },
      },
    },
  });

  return creatingTemplate;
};

export const createCustomTemplate = async (meId: string, args: createCustomTemplateArgs) => {
  await checkIsMemberOwningTeam(args?.teamId, meId);

  const generateQuestions = args?.questions?.map((question) => ({
    title: question?.title,
    description: question?.description,
    color: question?.color,
  }));

  const creatingCustomTemplate = await prisma?.template.create({
    data: {
      teamId: args?.teamId,
      title: args?.name,
      isDefault: false,
      isBlocked: false,
      healthCheckQuestions: {
        create: [...generateQuestions],
      },
    },
    include: {
      healthCheckQuestions: true,
    },
  });

  return creatingCustomTemplate;
};

export const updateCustomTemplate = async (meId: string, args: updateCustomTemplateArgs) => {
  await checkIsMemberOwningTeam(args?.teamId, meId);

  const updateQuestions = args?.questions?.map((question) => ({
    where: {
      id: question?.id,
    },
    data: {
      title: question?.title,
      description: question?.description,
      color: question?.color,
    },
  }));

  const updatingTemplate = await prisma?.team?.update({
    where: {
      id: args?.teamId,
    },
    data: {
      teamTemplate: {
        update: {
          where: {
            id: args?.templateId,
          },
          data: {
            title: args?.name,
            healthCheckQuestions: {
              update: [...updateQuestions],
            },
          },
        },
      },
    },
    select: {
      teamTemplate: {
        include: {
          healthCheckQuestions: true,
        },
      },
    },
  });

  const template = updatingTemplate?.teamTemplate?.find((x) => x?.id === args?.templateId);

  if (!template) return errorsManagement?.NotFound('Id of template not found');

  return template;
};

export const updateTemplate = async (isAdmin: boolean, args: updateTemplateHealthCheckArgs) => {
  checkIsAdmin(isAdmin);

  const updateHealthCheckQuestion = args?.questions?.map((question) => ({
    title: question?.title,
    description: question?.description,
    color: question?.color,
  }));

  const updatingTemplate = await prisma?.template?.update({
    where: {
      id: args?.templateId,
    },
    data: {
      title: args?.name,
      isDefault: true,
      healthCheckQuestions: {
        deleteMany: {
          templateId: args?.templateId,
        },
      },
    },
    include: {
      healthCheckQuestions: {
        include: {
          memberOnHealthCheck: true,
        },
      },
    },
  });

  return updatingTemplate;
};

export const deleteTemplate = async (isAdmin: boolean, templateId: string) => {
  await checkIsAdmin(isAdmin);

  const deletingTemplate = await prisma.template.delete({
    where: {
      id: templateId,
    },
  });

  if (!deletingTemplate) return error?.NotFound('Cant find template to delete');
  return deletingTemplate;
};

export const deleteCustomTemplate = async (meId: string, args: deleteCustomTemplateForTeamArgs) => {
  await checkIsMemberOwningTeam(args?.teamId, meId);

  const deletingCustomTemplate = await prisma?.team.update({
    where: {
      id: args?.teamId,
    },
    data: {
      teamTemplate: {
        delete: {
          id: args?.templateId,
        },
      },
    },
    select: {
      teamTemplate: {
        include: {
          healthCheckQuestions: true,
        },
      },
    },
  });

  const template = deletingCustomTemplate?.teamTemplate?.find((x) => x?.id === args?.templateId);
  return template;
};
