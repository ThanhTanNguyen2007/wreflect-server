import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type MemberAnswer {
    id: ID
    templateId: String
    healthCheckId: String
    createdAt: String
    updatedAt: String
    userId: String
    answers: [Answer]
    healthCheck: HealthCheck
    user: User
  }
`;

export default typeDefs;
