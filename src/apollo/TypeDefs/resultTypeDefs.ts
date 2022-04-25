import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Result {
    id: ID
    concerningMemberId: String
    evaluationId: String
    answerOnCriteriaList: [AnswerOnCriteria]
    concerningMember: Member
  }
`;

export default typeDefs;
