import prisma from '../prisma';
import logger from '../logger';

const criteriaDataList = [
  {
    name: 'Kỹ năng lắng nghe',
    description: 'Là kỹ năng luôn tôn trọng và lắng nghe người đối diện nói.',
  },
  {
    name: 'Cởi mở với những quan điểm khác biệt	',
    description:
      'Là sẵn sàng cân nhắc, lắng nghe ý kiến của người khác và biết đưa ra nhận xét, phản ứng thích hợp với người đối diện.',
  },
  {
    name: 'Tính chủ động và trách nhiệm	',
    description: 'Là tính tích cực hoàn thành công việc được giao, chủ động tham gia các buổi làm việc nhóm.',
  },
  {
    name: 'Đóng góp',
    description: 'Là luôn tham gia các buổi trao đổi nhóm, đóng góp sáng kiến/ý tưởng, nâng cao chất lượng công việc.',
  },
  {
    name: 'Theo dõi và kiểm soát tiến độ cùng kết quả công việc',
    description: 'Là khả năng trao đổi, cập nhật, chia sẻ thông tin, tiến độ, kết quả công việc của mọi thành viên.',
  },
  {
    name: 'Khả năng lãnh đạo',
    description:
      'Là khả năng dẫn dắt nhóm, lắng nghe, tổ chức, sắp xếp công việc cho các thành viên trong nhóm để dự án đi đúng tiến độ.',
  },
  {
    name: 'Kỹ năng viết',
    description: 'là khả năng viết đa dạng lĩnh vực tùy thuộc vào yêu cầu.',
  },
  {
    name: 'Nghiên cứu tài liệu',
    description: 'Là kỹ năng nghiên cứu, tự học hỏi kiến thức, tài liệu chuyên môn để sáng tạo nội dung theo yêu cầu. ',
  },
  {
    name: 'Thiết kế đồ họa',
    description: 'Là khả năng sử dụng các phần mềm đồ họa để thiết kế các ý tưởng, hình ảnh họa cho nội dung bài viết.',
  },
  {
    name: 'Kỹ năng thuyết trình',
    description: 'Là khả năng thuyết trình, trình bày ý tưởng nội dung mình đề xuất với nhóm.',
  },
];

(async () => {
  try {
    const creatingNewCriteria = await prisma.criteria.createMany({
      data: [...criteriaDataList],
    });
    logger.info('createing criteria data susscussfully', creatingNewCriteria);
  } catch (error) {
    logger.error('error occur: ', error);
  }
})();
