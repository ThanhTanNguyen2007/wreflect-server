import prisma from '../prisma';

export const getListCriteria = async () => {
  const criteriaList = await prisma.criteria.findMany();
  return criteriaList;
};
