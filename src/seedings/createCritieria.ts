import prisma from '../prisma';
import logger from '../logger';

const criteriaDataList = [
  {
    name: 'Kỹ năng lắng nghe',
    description: '',
  },
  {
    name: 'Cởi mở với những quan điểm khác biệt	',
    description: '',
  },
  {
    name: 'Tính chủ động và trách nhiệm	',
    description: '',
  },
  {
    name: 'Đóng góp	',
    description: '',
  },
  {
    name: 'Theo dõi và kiểm soát tiến độ cùng kết quả công việc',
    description: '',
  },
  {
    name: 'Khả năng lãnh đạo',
    description: '',
  },
];

(async () => {
  try {
    const creatingNewCriteria = await prisma.criteria.createMany({
      data: [...criteriaDataList],
    });
    logger.info('createing criteria data susscussfully');
  } catch (error) {
    logger.error('error occur: ');
  }
})();
