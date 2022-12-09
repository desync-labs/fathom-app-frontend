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
          keyArgs: false,
          merge (existing = [], incoming, other) {
            return incoming;
          },
        },
        proposals: {
          keyArgs: false,
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

const defaultLink = new HttpLink({
  uri: "http://167.71.216.61:8030/graphql",
})

export const client = new ApolloClient({
  link: ApolloLink.split(
    (operation) => operation.getContext().clientName === "stable", // Routes the query to the proper client
    stableCoinLink,
    ApolloLink.split(
      (operation) => operation.getContext().clientName === "governance", // Routes the query to the proper client
      governanceLink,
      defaultLink
    )
  ),
  cache,
})