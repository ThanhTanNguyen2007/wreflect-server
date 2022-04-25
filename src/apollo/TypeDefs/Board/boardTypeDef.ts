import { gql } from 'apollo-server-express';

const typeDefs = gql`
  enum BoardType {
    DEFAULT
    PHASE
  }
  enum PhaseType {
    REFLECT
    GROUP
    VOTES
    DISCUSS
  }

  type Board {
    id: ID
    teamId: String
    createdAt: String
    updatedAt: String
    createdBy: String
    isPublic: Boolean
    isLocked: Boolean
    disableDownVote: Boolean
    disableUpVote: Boolean
    isAnonymous: Boolean
    votesLimit: Int
    title: String
    timerInProgress: Int
    endTime: String
    type: BoardType
    currentPhase: PhaseType
    team(meId: ID): Team
    columns(meId: ID): [Column]
  }
`;



export default typeDefs;
