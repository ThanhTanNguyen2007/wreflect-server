import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type MemberOnHealthCheckOnQuestion {
    id: String
    healthCheckId: String
    questionId: String
    memberId: String
    point: Int
    comment: String
    member: Member
    question: TemplateQuestion
  }
`;

export default typeDefs;
