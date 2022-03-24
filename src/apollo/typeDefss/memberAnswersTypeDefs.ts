import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type MemberAnswer {
    id: ID
    templateId: String
    healthCheckId: String
    createdAt: String
    updatedAt: String
    memberId: String
    answers: [Answer]
    healthCheck: HealthCheck
    member: Member
  }
`;

export default typeDefs;
