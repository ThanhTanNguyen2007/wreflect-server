import { gql } from 'apollo-server-express';

const typeDefs = gql`
  enum AssessmentStatus {
    PLANNED
    DOING
    COMPLETE
    REOPENED
  }

  type Assessment {
    id: ID
    name: String
    startDate: String
    endDate: String
    teamId: String
    ownerId: String
    ownerMember: Member
    status: AssessmentStatus
    assessmentOnCriteriaList: [AssessmentOnCriteria]
  }
`;

export default typeDefs;
