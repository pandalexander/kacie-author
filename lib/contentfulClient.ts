// lib/contentfulClient.ts
import { createClient, type ContentfulClientApi } from "contentful";

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

if (!spaceId || !accessToken) {
  throw new Error(
    "Contentful Space ID or Access Token is missing. Check your .env.local file."
  );
}

// Ensure correct type for client based on environment (browser/server)
const client = createClient({
  space: spaceId,
  accessToken: accessToken,
});

export default client;
