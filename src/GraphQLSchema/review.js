import { gql, ApolloError } from "apollo-server";
import { nanoid } from "nanoid";
import datastoreConnector from "../DatastoreConnectors";

export const Review = gql`
  scalar Date

  enum Source {
    FACEBOOK
    TWITTER
    BOT
  }

  enum Sentiment {
    POSITIVE
    NEUTRAL
    NEGATIVE
  }

  type Review {
    _id: ID!
    comment: String!
    source: Source
    sentiment: Sentiment
  }

  extend type Query {
    reviews: [Review]
    review(source: String!): [Review]
  }

  input ReviewInput {
    comment: String
    source: Source
    sentiment: Sentiment
  }

  extend type Mutation {
    addReview(review: ReviewInput): Review
  }
`;

export const reviewResolver = {
  Query: {
    reviews: async (_, args, context) => {
      try {
        const result = await datastoreConnector({
          type: "COSMOSDB",
          endpoint: "https://akancosmosdb.documents.azure.com:443/",
          key:
            "IGEVHIr6Lk86UEqXt4tzymhcI5rkiCK9MUPiYxNBBeLTaDDcpy2w7juLNKwjUdnhztGeOjFqXpzFoLyDXuyy1Q==",
          payload: {
            type: "get_all",
          },
        });
        return result;
      } catch (err) {
        throw new ApolloError(err, "DATASTORE_CONNECTION_ERROR");
      }
    },
  },
  Mutation: {
    addReview: async (_, { review }, context) => {
      try {
        const result = await datastoreConnector({
          type: "COSMOSDB",
          endpoint: "https://akancosmosdb.documents.azure.com:443/",
          key:
            "IGEVHIr6Lk86UEqXt4tzymhcI5rkiCK9MUPiYxNBBeLTaDDcpy2w7juLNKwjUdnhztGeOjFqXpzFoLyDXuyy1Q==",
          payload: {
            type: "create",
            data: {
              _id: nanoid(),
              ...review,
            },
          },
        });

        return result;
      } catch (err) {
        throw new ApolloError(err, "DATASTORE_CONNECTION_ERROR");
      }
    },
  },
  others: {},
};
