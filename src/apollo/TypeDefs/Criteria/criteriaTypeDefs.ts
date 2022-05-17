import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Criteria {
    id: ID
    name: String
    createdAt: String
    updatedAt: String
    description: String
    answerOnCriteriaList: [AnswerOnCriteria]
  }
`;

export type createCriteriaArgs = {
  name: string;
  description: string;
};
export type updateCriteriaArgs = {
  criteriaId: string;
  name: string;
  description: string;
};

export type deleteCriteriaArgs = {
  criteriaId: string;
};

export type getCriteriaListArgs = {
  isGettingAll?: boolean;
  search?: string;
  page?: number;
  size?: number;
};

export default typeDefs;
