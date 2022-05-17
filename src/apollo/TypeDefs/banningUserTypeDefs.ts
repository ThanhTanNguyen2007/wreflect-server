import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type BanningUser {
    id: ID
    isBannedForever: Boolean
    startBanned: String
    endBanned: String
    title: String
    description: String
    userId: String
  }
`;

export default typeDefs;
