import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type statusRequest {
    success: Boolean
  }

  type Subscription {
    subOnUpdateTeams(meId: ID!): statusRequest
    subOnUpdateTeam(meId: ID!, teamId: ID!): Team

    updateBoard(meId: ID!, teamId: ID!): Board

    subOnUpdateColumn(meId: ID!, teamId: ID!): Column

    updateOpinion(meId: ID!, teamId: ID!): Opinion

    subOnUpdateHealthCheck(meId: ID!, teamId: ID!): HealthCheck

    subOnUpdateMeetingNote(teamId: ID!, boardId: ID!): Board
  }
`;

export default typeDefs;
