/**
 * GraphQL Client Configuration
 * ============================
 * Uses graphql-request for lightweight, SSR-friendly GraphQL fetching
 *
 * Why graphql-request?
 * - Lightweight (< 10KB)
 * - Works in both server and client components
 * - Simple API with excellent TypeScript support
 * - No framework lock-in
 */

import { GraphQLClient } from 'graphql-request';

// Determine the GraphQL endpoint
// In production: Use the full URL
// In development/server: Use the internal API route
function getEndpoint(): string {
  // Server-side: use full URL or localhost
  if (typeof window === 'undefined') {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ||
                   process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` :
                   'http://localhost:3000';
    return `${baseUrl}/api/graphql`;
  }

  // Client-side: use relative path
  return '/api/graphql';
}

/**
 * GraphQL client instance
 * Use this for all GraphQL operations
 */
export const graphqlClient = new GraphQLClient(getEndpoint(), {
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Create a client with custom headers (for authentication, etc.)
 */
export function createGraphQLClient(headers?: Record<string, string>) {
  return new GraphQLClient(getEndpoint(), {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
}

/**
 * Helper for server-side data fetching with caching
 *
 * NOTE: During build, the GraphQL API isn't available, so we use
 * a dynamic import of the schema and execute queries directly.
 */
export async function fetchGraphQL<T>(
  query: string,
  variables?: Record<string, any>,
  options?: {
    cache?: RequestCache;
    revalidate?: number;
    tags?: string[];
  }
): Promise<T> {
  // During build or server-side, execute GraphQL queries directly
  // This avoids the need for the HTTP endpoint during static generation
  if (typeof window === 'undefined') {
    const { graphql } = await import('graphql');
    const { schema } = await import('@/graphql/schema');

    const result = await graphql({
      schema,
      source: query,
      variableValues: variables,
    });

    if (result.errors) {
      console.error('GraphQL Errors:', result.errors);
      throw new Error(result.errors[0]?.message || 'GraphQL Error');
    }

    // Serialize to plain objects (required for passing to Client Components)
    return JSON.parse(JSON.stringify(result.data)) as T;
  }

  // Client-side: use the HTTP endpoint
  const endpoint = getEndpoint();

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
    cache: options?.cache,
    next: {
      revalidate: options?.revalidate,
      tags: options?.tags,
    },
  });

  const json = await response.json();

  if (json.errors) {
    console.error('GraphQL Errors:', json.errors);
    throw new Error(json.errors[0]?.message || 'GraphQL Error');
  }

  return json.data as T;
}
