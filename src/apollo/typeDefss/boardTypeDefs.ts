import { BoardType, Team, PhaseType } from '@prisma/client';
import { gql } from 'apollo-server-express';
import { BotLocaleFilterName } from 'aws-sdk/clients/lexmodelsv2';

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

export type createBoardType = {
  teamId: string;
  isPublic?: boolean;
  isLocked?: boolean;
  disableDownVote?: boolean;
  disableUpVote?: boolean;
  isAnonymous?: boolean;
  votesLimit?: number;
  title: string;
  timerInProgress?: boolean;
  type?: BoardType;
  currentPhase?: PhaseType;
  endTime?: string;
  column1?: string;
  column2?: string;
  column3?: string;
  column4?: string;
  column5?: string;
  isActiveCol1?: boolean;
  isActiveCol2?: boolean;
  isActiveCol3?: boolean;
  isActiveCol4?: boolean;
  isActiveCol5?: boolean;
};

export type updateBoardType = {
  teamId: string;
  boardId: string;
  isPublic?: boolean;
  isLocked?: boolean;
  disableDownVote?: boolean;
  disableUpVote?: boolean;
  isAnonymous?: boolean;
  votesLimit?: number;
  title?: string;
  timerInProgress?: boolean;
  type?: BoardType;
  currentPhase?: PhaseType;
  endTime?: string;
  column1?: string;
  column2?: string;
  column3?: string;
  column4?: string;
  column5?: string;
  isActiveCol1?: boolean;
  isActiveCol2?: boolean;
  isActiveCol3?: boolean;
  isActiveCol4?: boolean;
  isActiveCol5?: boolean;
};

export type deleteBoardType = {
  teamId: string;
  boardId: string;
};

export default typeDefs;
