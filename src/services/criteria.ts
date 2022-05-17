import { errorName } from './../constant/errorsConstant';
import { checkIsAdmin } from './essential';
import {
  getCriteriaListArgs,
  updateCriteriaArgs,
  createCriteriaArgs,
} from './../apollo/TypeDefs/Criteria/criteriaTypeDefs';
import prisma from '../prisma';
import errorsManagement from '../errorsManagement';

export const getCriteriaList = async (isGettingAll = false, search = '', page = 1, size = 10) => {
  const criteriaList = await prisma.criteria.findMany({
    where: {
      name: {
        contains: search.trim().toLowerCase(),
        mode: 'insensitive',
      },
    },
    ...(!isGettingAll && { skip: (page - 1) * size }),
    ...(!isGettingAll && { take: size }),
    orderBy: {
      createdAt: 'desc',
    },
  });

  const total = await prisma?.criteria.count({
    where: {
      name: {
        contains: search.trim(),
      },
    },
  });

  return {
    data: criteriaList,
    total,
  };
};

export const createCriteria = async (isAdmin: boolean, args: createCriteriaArgs) => {
  checkIsAdmin(isAdmin);

  const isCriteriaNameExist = await prisma?.criteria?.findUnique({
    where: {
      name: args?.name,
    },
  });

  if (isCriteriaNameExist) return errorsManagement?.BadRequest('Criteria Name already exist.');

  const creatingCriteria = await prisma.criteria.create({
    data: {
      name: args?.name?.trim(),
      description: args?.description?.trim(),
    },
  });

  return creatingCriteria;
};

export const updateCriteria = async (isAdmin: boolean, args: updateCriteriaArgs) => {
  checkIsAdmin(isAdmin);

  const isCriteriaNameExist = await prisma?.criteria?.findUnique({
    where: {
      name: args?.name,
    },
  });

  if (isCriteriaNameExist) return errorsManagement?.BadRequest('Criteria Name already exist.');

  const updatingCriteria = await prisma?.criteria?.update({
    where: {
      id: args?.criteriaId,
    },
    data: {
      name: args?.name,
      description: args?.description,
    },
  });

  return updatingCriteria;
};

export const deleteCriteria = async (isAdmin: boolean, criteriaId: string) => {
  checkIsAdmin(isAdmin);

  const deletingCriteria = await prisma?.criteria?.delete({
    where: {
      id: criteriaId,
    },
  });

  if (!deletingCriteria) return errorsManagement?.NotFound('Criteria not exist to delete');
  return deletingCriteria;
};
