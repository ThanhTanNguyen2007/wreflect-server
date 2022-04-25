import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type MemberComment {
    id: ID
    templateId: String
    healthCheckId: String
    createdAt: String
    updatedAt: String
    memberId: String
    questionId: String
    text: String
    member: Member
    healthCheck: HealthCheck
  }
`;

export default typeDefs;
