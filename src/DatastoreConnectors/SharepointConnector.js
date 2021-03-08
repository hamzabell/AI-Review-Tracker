import SP from "sharepoint";

export default async () => {
  const client = new SP.RestService(
    "https://hashemnetwork.sharepoint.com/sites/HA-SHEMMLPROJECT"
  );

  console.log(client);
};
