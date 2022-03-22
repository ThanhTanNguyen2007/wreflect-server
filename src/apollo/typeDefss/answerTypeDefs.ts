import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Answer {
    id: ID
    questionId: String
    value: String
    memberAnswersId: String
    memberAnswer: MemberAnswer
  }
`;

export default typeDefs;
