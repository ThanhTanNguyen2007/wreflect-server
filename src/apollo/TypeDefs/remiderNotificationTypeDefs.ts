import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type RemiderNotification {
    id: ID
    dateSent: String
    title: String
    description: String
    sentBy: String
    sentTo: String
  }
`;

export default typeDefs;
