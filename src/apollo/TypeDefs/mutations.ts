import { Opinion, HealthCheck, MemberOnHealthCheckOnQuestion } from '@prisma/client';
import { gql } from 'apollo-server-express';
const typeDefs = gql`
  type AddMembersMutationResponse {
    team: Team
    success: [String]
    warnings: [String]
    errors: [String]
  }

  type BatchPayload {
    count: Int!
  }

  input answerInput {
    questionId: String!
    value: String!
  }

  input commentInput {
    questionId: String!
    text: String!
  }

  type statusResponse {
    success: Boolean!
  }

  input orderOpinion {
    droppableId: String!
    index: Int!
  }

  input combineOpinion {
    droppableId: String!
    draggableId: String!
  }

  input AnswerOnCriteriaInput {
    id: ID
    criteriaId: String
    point: Int
    comment: String
  }

  input ResultInput {
    id: ID
    concerningMemberId: String
    answerOnCriteriaList: [AnswerOnCriteriaInput]
  }

  input questionsInput {
    title: String
    description: String
    color: String
  }

  input healthCheckAnswer {
    questionId: String!
    point: Int!
    comment: String!
  }

  enum PhaseType {
    DEFAULT
    PHASE
  }

  enum OpinionStatus {
    NEW
    IN_PROGRESS
    DONE
    REJECTED
  }

  enum ActionConvertColumn {
    ACTIONS
    OPINIONS
  }

  enum StatusHealthCheck {
    OPEN
    CLOSED
  }

  # type analysisForAdmin {

  # }

  type Mutation {
    updateMeetingNote(teamId: String!, meetingNote: String!): Member

    createTeam(
      name: String!
      description: String
      startDate: String!
      endDate: String!
      status: String
      isPublic: Boolean
      picture: String
    ): Team
    updateTeam(
      id: String!
      name: String
      startDate: String
      endDate: String
      status: String
      isPublic: Boolean
      picture: String
      description: String
    ): Team

    deleteTeam(teamId: String!): BatchPayload
    changeTeamAccess(teamId: String!, isPublic: Boolean!): Team

    startSurveyHealthCheck(
      teamId: String!
      boardId: String!
      templateId: String!
      isAnonymous: Boolean!
      isCustom: Boolean!
      status: StatusHealthCheck!
    ): getHealthCheck

    answerHealthCheck(
      teamId: String!
      boardId: String!
      templateId: String!
      answers: [answerInput!]!
      comments: [commentInput!]!
    ): getHealthCheck

    updateAction(teamId: String!, boardId: String!, columnId: String!, opinion: String!): Team
    # usingCurrentBoard(teamId: String!, boardId: String!): Team

    createBoard(
      teamId: String!
      isPublic: Boolean
      isLocked: Boolean
      disableDownVote: Boolean
      disableUpVote: Boolean
      isAnonymous: Boolean
      votesLimit: Int
      title: String
      timerInProgress: Boolean
      type: BoardType
      currentPhase: PhaseType
      endTime: String
      column1: String
      column2: String
      column3: String
      column4: String
      column5: String
      isActiveCol1: Boolean
      isActiveCol2: Boolean
      isActiveCol3: Boolean
      isActiveCol4: Boolean
      isActiveCol5: Boolean
    ): Team

    updateBoard(
      teamId: String!
      boardId: String!
      isPublic: Boolean
      isLocked: Boolean
      disableDownVote: Boolean
      disableUpVote: Boolean
      isAnonymous: Boolean
      votesLimit: Int
      title: String
      timerInProgress: Boolean
      type: BoardType
      currentPhase: PhaseType
      endTime: String
      column1: String
      column2: String
      column3: String
      column4: String
      column5: String
      isActiveCol1: Boolean
      isActiveCol2: Boolean
      isActiveCol3: Boolean
      isActiveCol4: Boolean
      isActiveCol5: Boolean
    ): Board

    deleteBoard(teamId: String!, boardId: String!): Team

    convertOpinionsInColumn(teamId: String!, boardId: String!, columnId: String!, action: ActionConvertColumn!): Column
    emptyColumn(teamId: String!, boardId: String!, columnId: String): Column

    createOpinion(
      teamId: String!
      boardId: String!
      columnId: String!
      text: String
      isAction: Boolean
      isCreateBottom: Boolean
    ): Column
    updateOpinion(
      teamId: String!
      opinionId: String!
      text: String
      upVote: [String]
      downVote: [String]
      isAction: Boolean
      isBookmarked: Boolean
      responsible: String
      color: String
      status: OpinionStatus
      newColumnId: String
    ): Opinion

    removeOpinion(teamId: String!, boardId: String!, columnId: String!, opinionId: String!): Column

    convertOpinion(
      teamId: String!
      boardId: String!
      columnId: String!
      opinionId: String!
      isAction: Boolean!
    ): Opinion

    orderOpinion(
      teamId: String!
      boardId: String!
      destination: orderOpinion
      source: orderOpinion
      draggableId: String
    ): Board
    combineOpinion(
      teamId: String!
      boardId: String!
      combine: combineOpinion
      source: orderOpinion
      draggableId: String
      text: String
    ): Board

    createRemark(
      teamId: String!
      boardId: String!
      columnId: String!
      opinionId: String!
      opinionId: String
      text: String!
    ): Opinion
    removeRemark(teamId: String!, boardId: String!, columnId: String!, opinionId: String!, remarkId: String!): Opinion

    addMembers(emailUsers: [String!], teamId: String!): AddMembersMutationResponse
    removeMember(memberId: String!, teamId: String!): Team
    changeRoleMember(memberId: String!, teamId: String!, isOwner: Boolean!): Team

    updateActionTracker(
      teamId: String!
      sourceBoardId: String!
      sourceColumnId: String!
      destinationBoardId: String!
      destinationColumnId: String!
      opinionId: String!
      status: OpinionStatus!
      responsible: String!
    ): Team

    createAssessment(
      teamId: String!
      nameAssessment: String!
      startDate: String!
      endDate: String!
      assessmentId: String
      criteriaList: [String!]!
      memberIds: [String]!
    ): Assessment

    updateAssessment(teamId: String!, assessmentName: String!, assessmentId: String!): Assessment

    deleteAssessment(teamId: String!, assessmentId: String!): Assessment

    doPersonalReflection(
      teamId: String!
      assessmentId: String!
      assessorId: String!
      results: [ResultInput]
    ): Assessment

    seenNotification(notificationId: String!): Notification
    removeNotification(notificationId: String!): Notification

    createTemplateHealthCheck(name: String!, questions: [questionsInput!]!): Template
    updateTemplateHealthCheck(templateId: String!, name: String!, questions: [questionsInput!]!): Template
    deleteTemplateHealthCheck(templateId: String!): Template

    createCriteria(name: String!, description: String!): Criteria
    updateCriteria(criteriaId: String!, name: String!, description: String!): Criteria
    deleteCriteria(criteriaId: String!): Criteria
    banUser(
      userId: String!
      title: String!
      description: String!
      isBannedForever: Boolean
      startDate: String
      endDate: String
    ): User
    # getAnalysisForAdmin(): analysisForAdmin

    createHealthCheck(teamId: String!, boardId: String, templateId: String!, isAnonymous: Boolean!): HealthCheck
    submitHealthCheckAnswer(teamId: String!, boardId: String!, answers: [healthCheckAnswer]!): HealthCheck
    reopenHealthCheck(teamId: String!, boardId: String!): HealthCheck

    createCustomTemplateForTeam(teamId: String!, name: String!, questions: [questionsInput!]!): Template
  }
`;

export default typeDefs;
