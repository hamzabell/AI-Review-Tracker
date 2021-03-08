import { gql, ApolloError } from "apollo-server";
import { nanoid } from "nanoid";
import mongoose from "mongoose";
import { UserSchema, DatastoreSchema } from "../DBSchemas/app";

const UserModel = mongoose.model("User", UserSchema);
const DatastoreModel = mongoose.model("Datastore", DatastoreSchema);

export const Datastore = gql`
  enum DatastoreType {
    MONGODB
    COSMOSDB
    SHAREPOINT
  }

  type Datastore {
    _id: ID!
    user: User!
    datastoreType: DatastoreType!
    mongoConnectionString: String
    cosmosEndpoint: String
    cosmosKey: String
  }

  extend type Query {
    datastores: [Datastore]
    datastore(userId: String!): Datastore
  }

  input UserInput {
    id: ID
  }

  input DatastoreInput {
    user: UserInput!
    databaseType: DatastoreType
    mongoConnectionString: String
    cosmosEndpoint: String
    cosmosKey: String
  }

  extend type Mutation {
    addDatastore(datastore: DatastoreInput): Datastore
    updateDatastore(userId: String, datastore: DatastoreInput): Datastore
  }
`;

export const resolvers = {
  Query: {
    datastores: async (_, args, context) => {
      try {
        const datastores = await DatastoreModel.find();
        return datastores;
      } catch (err) {
        throw new ApolloError(err, "DATASTORE_CONNECTION_ERROR");
      }
    },
    datastore: async (_, { userId }, context) => {
      try {
        const datastore = await DatastoreModel.findOne({ user: userId });
        return datastore;
      } catch (err) {
        throw new ApolloError(err, "DATASTORE_CONNECTION_ERROR");
      }
    },
  },
  Mutation: {
    addDatastore: async (_, { datastore }, context) => {
      try {
        const createdDatastore = await DatastoreModel.create({
          _id: nanoid(),
          ...datastore,
        });
        return createdDatastore;
      } catch (err) {
        throw new ApolloError(err, "DATASTORE_CONNECTION_ERROR");
      }
    },
    updateDatastore: async (_, { userId, datastore }, context) => {
      try {
        const updatedDatastore = await DatastoreModel.updateOne(
          {
            user: userId,
          },
          datastore
        );
        return updatedDatastore;
      } catch (err) {
        throw new ApolloError(err, "DATASTORE_CONNECTION_ERROR");
      }
    },
  },
  others: {
    Datastore: {
      user: async (obj, args, context) => {
        try {
          return await UserModel.findOne({ _id: obj.user.id });
        } catch (err) {
          throw new ApolloError(err, "DATASTORE_CONNECTION_ERROR");
        }
      },
    },
  },
};
