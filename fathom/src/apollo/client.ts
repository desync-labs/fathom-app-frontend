import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache
} from "@apollo/client";

/***
 * For positions Query we have pagination, So we need to return incoming items
 */
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        positions: {
          keyArgs: ['id'],
          merge (existing = [], incoming) {
            return incoming;
          },
        },
        proposals: {
          keyArgs: ['id'],
          merge (existing = [], incoming) {
            return incoming;
          },
        }
      }
    }
  }
})

const stableCoinLink = new HttpLink({
  uri: "http://167.71.216.61:8000/subgraphs/name/fathomapp-subgraph",
})

const governanceLink = new HttpLink({
  uri: "http://167.71.216.61:8000/subgraphs/name/dao-subgraph",
})

export const client = new ApolloClient({
  link: ApolloLink.split(
    (operation) => operation.getContext().clientName === "stable", // Routes the query to the proper client
    stableCoinLink,
    governanceLink
  ),
  cache,
})