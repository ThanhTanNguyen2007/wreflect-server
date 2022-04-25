import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Notification {
    id: ID
    receiverId: String
    senderId: String
    title: String
    description: String
    isSeen: Boolean
    createdAt: String
    receiver: User
  }
`;

export default typeDefs;
