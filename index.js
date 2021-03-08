import { ApolloServer } from "apollo-server";
import { typeDefs, resolvers } from "./src/GraphQLSchema";
import mongoose from "mongoose";
import { decodeToken } from "./decodeToken";

require("dotenv/config");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  context: ({ req }) => {
    const token = req.headers.authorization || "token";

    const decoded = decodeToken(token);

    return !decoded
      ? { type: "UNAUTHORIZED", payload: null }
      : { type: "AUTHORIZED", payload: decoded };
  },
});

const connectToDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://admin:admin@cluster0.cprho.mongodb.net/test",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    return true;
  } catch (error) {
    return error;
  }
};

connectToDB()
  .then((res) => {
    server.listen().then(({ url }) => console.log(`🚀 Server started ${url}`));
  })
  .catch((err) => new Error("😶Failed to initialize application database"));
