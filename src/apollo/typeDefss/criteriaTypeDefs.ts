import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Criteria {
    id: ID
    name: String
    description: String
    assessmentOnCriteriaList: [AssessmentOnCriteria]
  }
`;

export default typeDefs;
