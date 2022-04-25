import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Remark {
    id: ID
    authorId: String
    opinionId: String
    text: String
    createdAt: String
    updatedAt: String
    opinion: Opinion
    author: Member
  }
`;

export type createRemarkType = {
  teamId: string;
  boardId: string;
  columnId: string;
  opinionId: string;
  text: string;
};

export type removeRemarkType = {
  teamId: string;
  boardId: string;
  columnId: string;
  opinionId: string;
  remarkId: string;
};

export default typeDefs;
