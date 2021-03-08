import { gql } from "apollo-server";
import { userResolver, userTypeDefs as User } from "./user";
import { reviewResolver, Review } from "./review";
import { Datastore, resolvers as DatastoreResolvers } from "./Datastore";

const root = gql`
  type Query {
    root: String
  }
  type Mutation {
    root: String
  }
`;

const typeDefs = [root, User, Review, Datastore];

const resolvers = {
  Query: {
    ...userResolver.Query,
    ...reviewResolver.Query,
    ...DatastoreResolvers.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...reviewResolver.Mutation,
    ...DatastoreResolvers.Mutation,
  },
  ...reviewResolver.others,
  ...DatastoreResolvers.others,
};

export { typeDefs, resolvers };
