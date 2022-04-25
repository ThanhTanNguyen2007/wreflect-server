import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type UserOnCriteria {
    id: ID
    userId: String
    criteriaId: String
    value: Float
    criteria: Criteria
  }
`;

export default typeDefs;
