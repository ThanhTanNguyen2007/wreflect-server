import { orderWithEnum } from './Assessment/assessmentTypes';
import { getCriteriaList } from '../../services/criteria';
import { gql } from 'apollo-server-express';
const typeDefs = gql`
  type Teams {
    data: [Team]
    total: Int
    page: Int
    size: Int
  }

  type Assessments {
    data: [Assessment]
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

  type areaRadarChartData {
    isSubmit: Boolean
    criteria: Criteria
    assessor: Member
    point: Int
  }

  type rosePlotChartData {
    criteria: Criteria
    sum: Int
    count: Int
    avg: Float
  }

  type analysisAssessmentData {
    areaRadarChartData: [areaRadarChartData]
    rosePlotChartData: [rosePlotChartData]
  }

  enum inviteStatus {
    JOINED
    UNJOINED
    UNLOGIN
  }

  type inviteResponse {
    status: inviteStatus
  }

  type getEssential {
    criteriaList: [Criteria]
  }

  type Templates {
    data: [Template]
    total: Int
    page: Int
    size: Int
  }

  type CriteriaList {
    data: [Criteria]
    total: Int
    page: Int
    size: Int
  }

  type Users {
    data: [User]
    total: Int
    page: Int
    size: Int
  }

  type Teams {
    data: [Team]
    total: Int
    page: Int
    size: Int
  }

  enum sortBy {
    name
    createdAt
    status
  }

  enum orderWith {
    asc
    desc
  }

  type getNotificationData {
    data: [Notification]
    total: Int
  }

  type Query {
    # getTeams(status: String, isGettingAll: Boolean, search: String, page: Int, size: Int): Teams
    getTeams(isGettingAll: Boolean, status: String, search: String, page: Int, size: Int): Teams
    getTeamsOfUser(isGettingAll: Boolean, search: String, page: Int, size: Int): Teams
    getTeamIds: [getTeamIds]
    team(teamId: String!): Team
    members(teamId: String!): [Member]
    boards(teamId: String!): [Board]
    board(boardId: String): Board

    getAssessment(teamId: ID!, assessmentId: ID!): Assessment

    account: User
    inviteLink(teamId: String): inviteResponse

    getHealthCheck(teamId: String, boardId: String): HealthCheck

    getEssential: getEssential

    getAnalysisAssessment(teamId: String!, assessmentId: String!, memberId: String!): analysisAssessmentData

    getNotifications(page: Int!, size: Int!): [Notification]

    getNumOfUnSeenNoti: Int

    getAssessments(
      teamId: String!
      isGettingAll: Boolean
      search: String
      sortBy: sortBy
      orderWith: orderWith
      page: Int
      size: Int
    ): Assessments

    getTemplates(isGettingAll: Boolean, search: String, page: Int, size: Int): Templates
    getCriteriaList(isGettingAll: Boolean, search: String, page: Int, size: Int): CriteriaList
    getUsers(isGettingAll: Boolean, search: String, page: Int, size: Int): Users
    # getTeams(isGettingAll: Boolean, search: String, page: Int, size: Int): Teams

    getTemplatesOfTeam(teamId: String!): [Template]
  }
`;

export default typeDefs;
