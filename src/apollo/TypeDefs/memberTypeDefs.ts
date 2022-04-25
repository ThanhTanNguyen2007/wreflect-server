import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Member {
    id: ID!
    userId: String!
    teamId: String!
    isOwner: Boolean!
    isSuperOwner: Boolean!
    isPendingInvitation: Boolean!
    isGuess: Boolean!
    meetingNote: String
    invitedBy: String
    joinedAt: String!
    user: User
    team: Team
    opinions: [Opinion]
    remarks: [Remark]
    assessments: [Assessment]
    memberComments: [MemberComment]
    memberAnswers: [MemberAnswer]
    results: [Result]
    evaluations: [Evaluation]
  }
`;

export default typeDefs;
