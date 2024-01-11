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
          merge(_, incoming) {
            return incoming;
          },
        },
        proposals: {
          keyArgs: false,
          merge(_, incoming) {
            return incoming;
          },
        },
      },
    },
    Staker: {
      fields: {
        lockPositions: {
          keyArgs: false,
          merge(_, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

const stableCoinLink = new HttpLink({
  uri: `${process.env.REACT_APP_API_URL}/subgraphs/name/stablecoin-subgraph`,
});

const governanceLink = new HttpLink({
  uri: `${process.env.REACT_APP_API_URL}/subgraphs/name/dao-subgraph`,
});

const vaultsLink = new HttpLink({
  uri: `${process.env.REACT_APP_API_URL}/subgraphs/name/vaults-subgraph-test`,
});

const defaultLink = new HttpLink({
  uri: `${process.env.REACT_APP_API_URL}/graphql`,
});

export const client = new ApolloClient({
  link: ApolloLink.split(
    (operation) => operation.getContext().clientName === "stable", // Routes the query to the proper client
    stableCoinLink,
    ApolloLink.split(
      (operation) => operation.getContext().clientName === "governance", // Routes the query to the proper client
      governanceLink,
      ApolloLink.split(
        (operation) => operation.getContext().clientName === "vaults", // Routes the query to the vaultsLink
        vaultsLink,
        defaultLink
      )
    )
  ),
  cache,
});

export const dexClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://xinfin-graph.fathom.fi/subgraphs/name/dex-subgraph",
  }),
  cache: new InMemoryCache(),
});

export const healthClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://xinfin-graph.fathom.fi/graphql",
  }),
  cache: new InMemoryCache(),
});

export const blockClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://xinfin-graph.fathom.fi/subgraphs/name/blocklytics/ethereum-blocks",
  }),
  cache: new InMemoryCache(),
});
