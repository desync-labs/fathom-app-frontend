import { ApolloClient, InMemoryCache } from '@apollo/client';

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
        }
      }
    }
  }
})

export const client = new ApolloClient({
  uri: 'http://167.71.216.61:8000/subgraphs/name/fathomapp-subgraph',
  cache,
})