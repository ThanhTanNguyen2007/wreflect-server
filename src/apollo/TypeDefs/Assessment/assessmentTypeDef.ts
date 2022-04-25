import { gql } from 'apollo-server-express';

const typeDefs = gql`
  enum AssessmentStatus {
    Planned
    Doing
    Complete
    Reopened
  }

  type Assessment {
    id: ID
    name: String
    createdAt: String
    startDate: String
    endDate: String
    teamId: String
    creatorId: String
    status: AssessmentStatus
    team: Team
    creator: Member
    evaluations: [Evaluation]
  }
`;

export default typeDefs;
