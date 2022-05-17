import { MemberOnHealthCheckOnQuestion } from '@prisma/client';
import { gql } from 'apollo-server-express';

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
    memberOnHealthCheck: [MemberOnHealthCheckOnQuestion]
  }
`;

export type createHealthCheckArgs = {
  teamId: string;
  boardId: string;
  templateId: string;
  isAnonymous: boolean;
};

export type submitHealthCheckAnswerArgs = {
  teamId: string;
  boardId: string;
  healthCheckId: string;
  answers: MemberOnHealthCheckOnQuestion[];
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
