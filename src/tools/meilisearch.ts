import { MeiliSearch } from "meilisearch"
import { ForumConfig } from "@/config.ts"
import App = ForumConfig.App

const client = new MeiliSearch({
  host: `${App.BaseUrl}/meili`,
  apiKey: App.SearchKey,
})

export function useMeili() {
  return client
}
