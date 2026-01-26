/**
 * GraphQL Yoga API Route
 * ======================
 * Creates a GraphQL endpoint at /api/graphql using GraphQL Yoga
 *
 * GraphQL Yoga is a lightweight, fully-featured GraphQL server that:
 * - Works with Next.js App Router
 * - Supports subscriptions, file uploads, and more
 * - Has excellent performance characteristics
 *
 * Why GraphQL over direct GROQ queries?
 * - Type safety with generated types
 * - Industry-standard API design skills for portfolio
 * - Flexible caching strategies
 * - Works with any GraphQL client
 */

import { createYoga } from 'graphql-yoga';
import { schema } from '@/graphql/schema';
import { NextRequest, NextResponse } from 'next/server';

// Create the Yoga instance
const { handleRequest } = createYoga({
  schema,
  graphqlEndpoint: '/api/graphql',

  // Enable GraphiQL IDE in development
  graphiql: process.env.NODE_ENV === 'development',

  // CORS configuration
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_SITE_URL || '*'
      : '*',
    credentials: true,
    methods: ['POST', 'GET', 'OPTIONS'],
  },

  // Logging
  logging: {
    debug: (...args) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('[GraphQL Debug]', ...args);
      }
    },
    info: (...args) => console.log('[GraphQL Info]', ...args),
    warn: (...args) => console.warn('[GraphQL Warn]', ...args),
    error: (...args) => console.error('[GraphQL Error]', ...args),
  },

  // Custom error masking for production
  maskedErrors: process.env.NODE_ENV === 'production',
});

// Export handlers for both GET (GraphiQL) and POST (queries/mutations)
export async function GET(request: NextRequest) {
  return handleRequest(request, {});
}

export async function POST(request: NextRequest) {
  return handleRequest(request, {});
}

export async function OPTIONS(request: NextRequest) {
  return handleRequest(request, {});
}
