import { gql } from 'apollo-server-express';

const typeDefs = gql`
  enum UserStatus {
    ONLINE
    OFFLINE
  }

  type User {
    id: ID!
    email: String
    createdAt: String
    updatedAt: String
    isAdmin: String
    userStatus: UserStatus
    nickname: String
    picture: String!
    gender: Gender
    workplace: String
    address: String
    school: String
    introduction: String
    talent: String
    interest: String

    members: [Member]
  }
`;

export default typeDefs;
