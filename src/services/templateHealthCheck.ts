import { getTemplatesArgs } from './../apollo/TypeDefs/templateTypeDefs';
import { createTemplateHealthCheckArgs, updateTemplateHealthCheckArgs } from '../apollo/TypeDefs/templateTypeDefs';
import { checkIsAdmin } from './essential';
import prisma from '../prisma';

export const getTemplates = async (
  args: getTemplatesArgs = {
    isGettingAll: false,
    search: undefined,
    offSet: 0,
    limit: 10,
  },
) => {
  const templates = await prisma?.template?.findMany({
    where: {
      isDefault: true,
      title: {
        contains: args?.search || undefined,
      },
    },
    ...(!args?.isGettingAll && { skip: args?.offSet }),
    ...(!args?.isGettingAll && { take: args?.limit }),
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
        contains: args?.search || undefined,
      },
    },
  });

  return {
    data: templates,
    total,
  };
};

export const createTemplate = async (isAdmin: boolean, args: createTemplateHealthCheckArgs) => {
  checkIsAdmin(isAdmin);

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
