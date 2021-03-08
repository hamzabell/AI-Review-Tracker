import { gql, ApolloError } from "apollo-server";
import jwt from "jsonwebtoken";
import nanoid from "nanoid";
import mongoose from "mongoose";
import { UserSchema } from "../DBSchemas/app";
import isAuthenticated from "../../isAuthenticated";

const UserModel = mongoose.model("User", UserSchema);

export const userTypeDefs = gql`
  type User {
    _id: ID
    email: String!
    password: String!
    role: String!
  }

  type AuthUser {
    _id: ID
    email: String
    role: String
    token: String
  }

  type BasicUser {
    _id: ID
    email: String
    role: String
  }

  extend type Query {
    users: [BasicUser]
    user(id: ID): BasicUser
  }

  extend type Mutation {
    loginUser(email: String, password: String): AuthUser
    createUser(email: String, password: String, role: String): AuthUser
    updateUser(email: String): AuthUser
    deleteUser(email: String): [BasicUser]
  }
`;

export const userResolver = {
  Query: {
    users: async (obj, args, context) => {
      try {
        // if (!isAuthenticated(context))
        //   throw new ApolloError(
        //     "Please kindly login, you don't have authentication access",
        //     "AUTHENTICATION_ERROR"
        //   );
        const users = await UserModel.find();
        return users;
      } catch (error) {
        throw new ApolloError(error, "DATASTORE_CONNECTION_ERROR");
      }
    },
    user: (_, { id }, context) => {
      return users.filter((user) => user.id === id)[0];
    },
  },
  Mutation: {
    loginUser: async (_, { email, password }, context) => {
      try {
        const user = await UserModel.findOne({ email, password });
        if (!user)
          throw new ApolloError(
            "User email or password is incorrect",
            "USER_AUTH"
          );

        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
            role: user.role,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          }
        );

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          token,
        };
      } catch (error) {
        throw new ApolloError(error, "DATASTORE_CONNECTION_ERROR");
      }
    },

    createUser: async (_, args, context) => {
      try {
        const newUser = await UserModel.create({
          email: args.email,
          password: args.password,
          role: args.role,
        });
        const { _id, email, role } = newUser;

        const token = jwt.sign({ _id, email, role }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });

        return { _id, role, email, token };
      } catch (error) {
        throw new ApolloError(error, "DATASTORE_CONNECTION_ERROR");
      }
    },
    deleteUser: (_, { email }, context) => {
      return users.filter((user) => user.email === email);
    },
  },
};
