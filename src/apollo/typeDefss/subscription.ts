import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type statusRequest {
    success: Boolean
  }

  type Subscription {
    subOnUpdateTeams(meId: ID!): statusRequest
    subOnUpdateTeam(meId: ID!): Team

    updateBoard(meId: ID!, boardId: ID!): Board
    deleteBoard(meId: ID!): Board

    subOnUpdateColumn(meId: ID!): Column

    updateOpinion(meId: ID!): Opinion

    updateGetHealthCheckData(boardId: String!, meId: ID!): getHealthCheck
  }
`;

export default typeDefs;
