const CosmosClient = require("@azure/cosmos").CosmosClient;

export default async ({ endpoint, key }) => {
  const client = new CosmosClient({ endpoint, key });
  const { database } = await client.databases.createIfNotExists({
    id: "Reviews",
  });

  const { container } = await database.containers.createIfNotExists({
    id: "Items",
  });

  return {
    createReview: async (review) => {
      const { resource } = await container.items.create(review);
      return resource;
    },
    getAll: async () => {
      const querySpec = {
        query: "SELECT * from c",
      };

      const { resources } = await container.items.query(querySpec).fetchAll();
      return resources;
    },
  };
};
