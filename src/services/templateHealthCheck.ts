import { createCustomTemplateForTeamArgs, getTemplatesArgs } from './../apollo/TypeDefs/templateTypeDefs';
import { createTemplateHealthCheckArgs, updateTemplateHealthCheckArgs } from '../apollo/TypeDefs/templateTypeDefs';
import { checkIsAdmin, checkIsMemberOfTeam, checkIsMemberOwningTeam } from './essential';
import error from '../errorsManagement';
import prisma from '../prisma';

export const checkTemplateTilteIsExist = async (name: string) => {
  const isExistTemplate = await prisma?.template?.findUnique({
    where: {
      title: name,
    },
  });

  if (isExistTemplate) return error?.BadRequest('This name of template is already taked');
};

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
  await checkTemplateTilteIsExist(args?.name);

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

export const createCustomForHealthCheck = async (meId: string, args: createCustomTemplateForTeamArgs) => {
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

export const updateTemplate = async (isAdmin: boolean, args: updateTemplateHealthCheckArgs) => {
  checkIsAdmin(isAdmin);
  await checkTemplateTilteIsExist(args?.name);

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
        create: [...updateHealthCheckQuestion],
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
