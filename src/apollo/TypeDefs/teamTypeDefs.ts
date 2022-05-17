import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Team {
    id: ID
    name: String
    createdAt: String
    startDate: String
    endDate: String
    picture: String
    isPublic: Boolean
    description: String
    status: TeamStatus
    members: [Member]
    boards(isGettingAll: Boolean, offSet: Int, limit: Int): [Board]
    healthCheck: [HealthCheck]
    assessments(isGettingAll: Boolean, offSet: Int, limit: Int): [Assessment]
  }

  enum TeamStatus {
    DOING
    DONE
  }
`;

export default typeDefs;
