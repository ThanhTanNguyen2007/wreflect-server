import { gql } from 'apollo-server-express';
import { StatusHealthCheck } from '@prisma/client';

const typeDefs = gql`
  type HealthCheck {
    id: ID
    teamId: String
    boardId: String
    templateId: String
    createdAt: String
    createdBy: String
    updatedAt: String
    updatedBy: String
    isAnonymous: Boolean
    isCustom: Boolean
    board: Board
    team: Team
    memberAnswers: [MemberAnswer]
    memberComments: [MemberComment]
  }
`;

export type startSurveyArgs = {
  teamId: string;
  boardId: string;
  templateId: string;
  isAnonymous: boolean;
  isCustom: boolean;
  status: StatusHealthCheck;
};

export type answerHealthCheckArgs = {
  teamId: string;
  boardId: string;
  templateId: string;
  answers: { questionId: string; value: string }[];
  comments: { questionId: string; text: string }[];
};

export type reopenHealthCheckArgs = {
  teamId: string;
  boardId: string;
};

export default typeDefs;
