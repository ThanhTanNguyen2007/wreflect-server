import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type AnswerOnCriteria {
    id: ID
    criteriaId: String
    resultId: String
    point: Int
    comment: String
    updatedAt: String
    criteria: Criteria
  }
`;

export default typeDefs;
