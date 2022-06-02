import { BoardType, Team, PhaseType } from '@prisma/client';

export type createBoardArgs = {
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

export type updateBoardArgs = {
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

export type deleteBoardArgs = {
  teamId: string;
  boardId: string;
};

export type updatingMeetingNoteArgs = {
  teamId: string;
  boardId: string;
  meetingNote: string;
};
