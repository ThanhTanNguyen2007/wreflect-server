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
    notifications: [Notification]
    skillValues: [UserOnCriteria]
    banningUser: [BanningUser]
  }
`;

export type getUsersArgs = {
  isGettingAll?: boolean;
  search?: string;
  page?: number;
  size?: number;
};
export type banUserArgs = {
  userId: string;
  title: string;
  description: string;
  isBannedForever?: boolean;
  startDate?: string;
  endDate?: string;
};

export default typeDefs;
