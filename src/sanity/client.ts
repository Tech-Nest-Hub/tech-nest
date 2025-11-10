import { createClient } from "@sanity/client";

export const SanityClient = createClient({
  projectId: "fyydph8c",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false ,
});

export default SanityClient;