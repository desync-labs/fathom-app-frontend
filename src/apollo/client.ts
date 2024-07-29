import {
  ApolloClient,
  ApolloLink,
  concat,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { SUBGRAPH_URLS } from "connectors/networks";
import { DEFAULT_CHAIN_ID } from "utils/Constants";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";

/***
 * For Query we have pagination, So we need to return incoming items
 */
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        positions: {
          keyArgs: ["chainId", "account"],
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
        pools: {
          keyArgs: ["chainId"],
          merge(_, incoming) {
            return incoming;
          },
        },
        strategyHistoricalAprs: {
          keyArgs: ["strategy", "chainId"],
          merge(existing = [], incoming) {
            return [...existing, ...incoming];
          },
        },
        strategyReports: {
          keyArgs: ["strategy", "chainId"],
          merge(existing = [], incoming) {
            return [...existing, ...incoming];
          },
        },
        accountVaultPositions: {
          keyArgs: ["account"],
          merge(_, incoming) {
            return incoming;
          },
        },
        vaults: {
          keyArgs: ["chainId"],
          merge(_, incoming) {
            return incoming;
          },
        },
        indexingStatusForCurrentVersion: {
          keyArgs: ["chainId"],
          merge(_, incoming) {
            return incoming;
          },
        },
        users: {
          keyArgs: ["walletAddress"],
          merge(_, incoming) {
            return incoming;
          },
        },
        mints: {
          keyArgs: ["account"],
          merge(_, incoming) {
            return incoming;
          },
        },
        burns: {
          keyArgs: ["account"],
          merge(_, incoming) {
            return incoming;
          },
        },
        swaps: {
          keyArgs: ["account"],
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

if (process.env.REACT_APP_ENV === "dev") {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

const httpLink = new HttpLink({ uri: SUBGRAPH_URLS[DEFAULT_CHAIN_ID] });

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  const chainId = operation.getContext().chainId;

  let uri =
    chainId && (SUBGRAPH_URLS as any)[chainId]
      ? (SUBGRAPH_URLS as any)[chainId]
      : SUBGRAPH_URLS[DEFAULT_CHAIN_ID];

  if (operation.getContext().clientName === "stable") {
    uri += "/subgraphs/name/stablecoin-subgraph";
  } else if (operation.getContext().clientName === "governance") {
    uri += "/subgraphs/name/dao-subgraph";
  } else if (operation.getContext().clientName === "vaults") {
    uri += "/subgraphs/name/vaults-subgraph";
  } else if (operation.getContext().clientName === "dex") {
    uri += "/subgraphs/name/dex-subgraph";
  } else {
    uri += "/graphql";
  }

  operation.setContext(() => ({
    uri,
  }));

  return forward(operation);
});

export const client = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache,
});

export const dexClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://graph.xinfin.fathom.fi/subgraphs/name/dex-subgraph",
  }),
  cache: new InMemoryCache(),
});

export const healthClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://graph.xinfin.fathom.fi/graphql",
  }),
  cache: new InMemoryCache(),
});

export const blockClient = new ApolloClient({
  link: new HttpLink({
    uri: "https://graph.xinfin.fathom.fi/subgraphs/name/blocklytics/ethereum-blocks",
  }),
  cache: new InMemoryCache(),
});
