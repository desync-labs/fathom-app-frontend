import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: 'http://139.59.27.103:8000/subgraphs/name/fathomapp-subgraph',
  cache: new InMemoryCache(),
})