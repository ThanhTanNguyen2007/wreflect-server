import { OpinionStatus } from '@prisma/client';
import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Opinion {
    id: ID
    columnId: String
    authorId: String
    createdAt: String
    updatedAt: String
    text: String
    upVote: [String]
    downVote: [String]
    updatedBy: String
    isAction: Boolean
    isBookmarked: Boolean
    responsible: String
    mergedAuthors: [String]
    color: String
    position: Int
    status: OpinionStatus
    author: Member
    column(meId: ID): Column
    remarks: [Remark]
  }

  enum OpinionStatus {
    NEW
    IN_PROGRESS
    DONE
    REJECT
  }
`;

export type createOpinionType = {
  teamId: string;
  boardId: string;
  columnId: string;
  text: string;
  isAction: boolean;
  isCreateBottom: boolean;
};

export type updateOpinionType = {
  teamId: string;
  opinionId: string;
  text?: string;
  upVote?: string[];
  downVote?: string[];
  isAction?: boolean;
  isBookmarked?: boolean;
  responsible?: string;
  color?: string;
  status?: OpinionStatus;
  newColumnId?: string;
};

export type removeOpinionType = {
  teamId: string;
  boardId: string;
  columnId: string;
  opinionId: string;
};

export type orderOpinionType = {
  teamId: string;
  boardId: string;
  destination: {
    droppableId: string;
    index: number;
  };
  source: {
    droppableId: string;
    index: number;
  };
  draggableId: string;
};

export type combineOpinionType = {
  teamId: string;
  boardId: string;
  combine: {
    draggableId: string;
    droppableId: string;
  };
  source: {
    droppableId: string;
    index: number;
  };
  draggableId: string;
  text: string;
};

export default typeDefs;
