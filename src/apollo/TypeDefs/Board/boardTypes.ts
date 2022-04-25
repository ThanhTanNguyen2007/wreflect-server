import { BoardType, Team, PhaseType } from '@prisma/client';

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
