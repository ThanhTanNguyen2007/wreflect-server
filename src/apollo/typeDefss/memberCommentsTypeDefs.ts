import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type MemberComment {
    id: ID
    templateId: String
    healthCheckId: String
    createdAt: String
    updatedAt: String
    userId: String
    questionId: String
    text: String
    user: User
    healthCheck: HealthCheck
  }
`;

export default typeDefs;
