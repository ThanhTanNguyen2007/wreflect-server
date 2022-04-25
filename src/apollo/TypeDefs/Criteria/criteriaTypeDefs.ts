import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Criteria {
    id: ID
    name: String
    description: String
    answerOnCriteriaList: [AnswerOnCriteria]
  }
`;

export default typeDefs;
