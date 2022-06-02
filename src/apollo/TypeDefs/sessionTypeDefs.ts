import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Session {
    id: ID
    userId: String
    token: String
    expiresAt: String
    data: String
    createdAt: String
    updatedAt: String
  }
`;

export default typeDefs;
