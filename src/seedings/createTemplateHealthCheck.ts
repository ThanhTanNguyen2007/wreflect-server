import logger from '../logger';
import prisma from '../prisma';

const templatesData = [
  {
    title: 'Health Check Template',
    isDefault: true,
    questions: [
      {
        title: 'Objective',
        color: 'orange',
        description:
          'Bad: Objectives are not clear, specific, lack of commitment \nGood: Objectives are identified clearly, fully commited by all members.',
      },
      {
        title: 'Roles & Responsibilities',
        color: 'blue',
        description:
          'Bad:  The roles and responsibilities of each team member are not identified and shared clearly.\nThe roles and responsibilities of each team member are clear to everyone.',
      },
      {
        title: 'Openness',
        color: 'purple',
        description:
          'Bad: When it comes to conversation and work, members are cautious.\nGood: In discussion and work, members are allowed to share their ideas, opinions, and thoughts.',
      },
      {
        title: 'Trust',
        color: 'pink',
        description: 'Bad:  Members have doubts and mistrust for one another.\nGood: Members trust each other.',
      },
      {
        title: 'Conflict & Differentiation',
        color: 'green',
        description:
          'Bad:  While working, members are either passive or try to avoid disputes and disagreements.\nGood: Members openly discuss problems and disagreements in order to find the best solution.',
      },
      {
        title: 'Collaboration',
        color: 'lpink',
        description:
          'Bad: Members passively request to cooperate or aid.\nGood: Members actively coordinate to each other.',
      },
      {
        title: 'Contribution',
        color: 'lblue',
        description:
          'Bad: A few members control the discussion and working process.\nGood: In conversations and tasks, all members actively participate.',
      },
      {
        title: 'Decisions',
        color: 'orange',
        description:
          'Bad: A few members control the decisions making.\nGood: In decisions making, all members actively participate.',
      },
      {
        title: 'Flexibility',
        color: 'blue',
        description:
          'Bad:  Members are forced to strict regulations and principles.\nGood: Members flexibly adjust working rules to adapt to emergent conditions. ',
      },
      {
        title: 'Resources',
        color: 'purple',
        description:
          "Bad: Each individual's ability and experience are underutilized.\nGood:  Each individual's ability and experience are put to the best possible use.",
      },
      {
        title: 'Fun',
        color: 'pink',
        description:
          "Bad: We don't enjoy our work and look forward to coming to work.\nGood: We love going to work and have great fun working together. ",
      },
      {
        title: 'Learning',
        color: 'green',
        description:
          "Bad: We never have time to learn anything.\nGood: We're learning lots of interesting stuff all the time.",
      },
    ],
  },
];

(async () => {
  try {
    const question = templatesData[0].questions?.map((question) => ({
      title: question?.title,
      description: question?.description,
      color: question?.color,
    }));
    const creatingTemplateHealthCheck = await prisma?.template?.create({
      data: {
        title: templatesData[0].title,
        isDefault: true,
        healthCheckQuestions: {
          create: [...question],
        },
      },
    });
    logger.info('createing criteria data susscussfully', creatingTemplateHealthCheck);
  } catch (error) {
    logger.error('error occur: ', error);
  }
})();
