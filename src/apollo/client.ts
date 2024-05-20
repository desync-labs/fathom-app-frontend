import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { ChainId, SUBGRAPH_URLS } from "connectors/networks";

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
        strategyHistoricalAprs: {
          keyArgs: ["strategy"],
          merge(existing = [], incoming) {
            return [...existing, ...incoming];
          },
        },
        strategyReports: {
          keyArgs: ["strategy"],
          merge(existing = [], incoming) {
            return [...existing, ...incoming];
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

export const createApolloClient = (chainId: ChainId) => {
  const stableCoinLink = new HttpLink({
    uri: `${
      (SUBGRAPH_URLS as any)[chainId]
    }/subgraphs/name/stablecoin-subgraph`,
  });

  const governanceLink = new HttpLink({
    uri: `${(SUBGRAPH_URLS as any)[chainId]}/subgraphs/name/dao-subgraph`,
  });

  const vaultsLink = new HttpLink({
    uri: `${(SUBGRAPH_URLS as any)[chainId]}/subgraphs/name/vaults-subgraph`,
  });

  const defaultLink = new HttpLink({
    uri: `${(SUBGRAPH_URLS as any)[chainId]}/graphql`,
  });

  return new ApolloClient({
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
};

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
