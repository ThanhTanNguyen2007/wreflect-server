import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Profile {
    id: ID!
    userId: String!
    
    createdAt: String!
    updatedAt: String!
    user: User
  }

  enum Gender {
    UNSPECIFIED
    MALE
    FEMALE
  }
`;

export default typeDefs;
