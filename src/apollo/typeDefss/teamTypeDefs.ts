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
    boards(meId: ID): [Board]
    healthCheck: [HealthCheck]
    assessment: [Assessment]
  }

  enum TeamStatus {
    DOING
    DONE
  }
`;

export default typeDefs;
