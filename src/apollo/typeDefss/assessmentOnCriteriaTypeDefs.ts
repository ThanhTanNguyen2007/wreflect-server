import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type AssessmentOnCriteria {
    asssessmentId: String
    criteriaId: String
    createdAt: String
    createdBy: String
    assessment: Assessment
    criteria: Criteria
  }
`;

export default typeDefs;
