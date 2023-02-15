import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";

//TODO: Use the environment dev/prod/staging to fetch the url.. 
//Break down the url into base url (env specific) and graph name into constats.
const STABLE_COIN_DEV =
  "https://dev.composer.live/subgraphs/name/stablecoin-subgraph";
const STABLE_COIN_STAGING =
  "";

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
  uri: STABLE_COIN_DEV,
});

const governanceLink = new HttpLink({
  uri: "https://dev.composer.live/subgraphs/name/dao-subgraph",
});

const defaultLink = new HttpLink({
  uri: "https://dev.composer.live/graphql",//"https://graph.composer.live/graphql",
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
