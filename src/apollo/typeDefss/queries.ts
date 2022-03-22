import { gql } from 'apollo-server-express';
const typeDefs = gql`
  type Teams {
    data: [Team]
    total: Int
    page: Int
    size: Int
  }

  type getTeamIds {
    id: String
    name: String
    picture: String
    boards: [Board]
  }

  type getHealthCheck {
    memberAnswers: [MemberAnswer]
    memberComments: [MemberComment]
    healthCheck: HealthCheck
  }

  enum inviteStatus {
    JOINED
    UNJOINED
    UNLOGIN
  }

  type inviteResponse {
    status: inviteStatus
  }

  type Query {
    teams(status: String, isGettingAll: Boolean, search: String, page: Int, size: Int): Teams
    getOwnedTeams(isGettingAll: Boolean, search: String, page: Int, size: Int): Teams
    getTeamIds: [getTeamIds]
    team(teamId: String!): Team
    members(teamId: String!): [Member]
    boards(teamId: String!): [Board]
    board(boardId: String): Board
    criteriaList: [Criteria]

    account(userId: String): User
    inviteLink(teamId: String): inviteResponse

    getHealthCheck(teamId: String, boardId: String): getHealthCheck
  }
`;

export default typeDefs;
