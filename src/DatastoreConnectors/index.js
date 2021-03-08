import MongoConnector from "./MongoDBConnector";
import SharepointConnector from "./SharepointConnector";
import CosmosDBConnector from "./CosmosDBConnector";

export default async (connector) => {
  if (!connector.type) {
    throw new Error("Please pass connection type for your datastore");
  }

  if (connector.type === "MONGODB") {
    if (!connector.connectionString)
      throw new Error("please pass your mongodb connection string");

    const { createReview, getAll } = await MongoConnector(
      connector.connectionString
    );

    switch (connector.payload.type) {
      case "create":
        return await createReview(connector.payload.data);
      case "get_all":
        return await getAll();

      default:
        throw new Error("please pass a request type in the connector payload");
    }
  }

  if (connector.type === "SHAREPOINT") {
  }

  if (connector.type === "COSMOSDB") {
    if (!connector.endpoint || !connector.key)
      throw new Error("please pass your cosmosdb endpoint and key");

    const { endpoint, key } = connector;
    const { createReview, getAll } = await CosmosDBConnector({
      endpoint,
      key,
    });

    switch (connector.payload.type) {
      case "create":
        return await createReview(connector.payload.data);
      case "get_all":
        return await getAll();

      default:
        throw new Error("please pass a request type in the connector payload");
    }
  }
  return {};
};
