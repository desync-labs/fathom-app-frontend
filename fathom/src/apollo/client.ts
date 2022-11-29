import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: 'http://167.71.216.61:8000/subgraphs/name/fathomapp-subgraph',
  cache: new InMemoryCache(),
})