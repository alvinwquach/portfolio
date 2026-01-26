/**
 * GraphQL Context
 * ================
 * Context type for GraphQL resolvers
 */

import type { SanityClient } from 'next-sanity';
import { client } from '@/sanity/lib/client';

export interface GraphQLContext {
  sanityClient: SanityClient;
}

/**
 * Create context for GraphQL resolvers
 */
export function createContext(): GraphQLContext {
  return {
    sanityClient: client,
  };
}
