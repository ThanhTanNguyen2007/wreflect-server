import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Template {
    id: String
    title: String
    isDefault: Boolean
    teamId: String
    createdAt: String
    updatedAt: String
    healthCheckQuestions: [TemplateQuestion]
  }
`;

export type getTemplatesArgs = {
  isGettingAll?: boolean;
  search?: string;
  offSet?: number;
  limit?: number;
};

export type createTemplateHealthCheckArgs = {
  name: string;
  questions: {
    title: string;
    description: string;
    color: string;
  }[];
};

export type updateTemplateHealthCheckArgs = {
  templateId: string;
  name: string;
  questions: {
    title: string;
    description: string;
    color: string;
  }[];
};

export default typeDefs;
