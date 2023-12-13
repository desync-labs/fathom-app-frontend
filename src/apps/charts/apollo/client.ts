import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export const client = new ApolloClient({
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
