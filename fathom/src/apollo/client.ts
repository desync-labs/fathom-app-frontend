import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";

/***
 * For Query we have pagination, So we need to return incoming items
 */
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        positions: {
          keyArgs: false,
          merge(existing = [], incoming, other) {
            return incoming;
          },
        },
        proposals: {
          keyArgs: false,
          merge(existing = [], incoming) {
            return incoming;
          },
        },
      },
    },
    Staker: {
      fields: {
        lockPositions: {
          keyArgs: false,
          merge(existing = [], incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

const stableCoinLink = new HttpLink({
  uri: "https://graph.composer.live/subgraphs/name/fathomapp-subgraph",
});

const governanceLink = new HttpLink({
  uri: "https://graph.composer.live/subgraphs/name/dao-subgraph",
});

const defaultLink = new HttpLink({
  uri: "https://graph.composer.live/graphql",
});

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
});