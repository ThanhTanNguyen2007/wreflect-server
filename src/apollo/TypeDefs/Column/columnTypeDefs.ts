import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Column {
    id: ID
    color: String
    title: String
    position: Int
    isActive: Boolean
    boardId: String
    opinions(meId: ID): [Opinion]
    board(meId: ID): Board
  }
`;

export default typeDefs;
