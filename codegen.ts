/**
 * GraphQL Code Generator Configuration
 * =====================================
 * Generates TypeScript types from the GraphQL schema
 *
 * Run: npm run codegen
 */

import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  // Schema source - use the schema file directly
  schema: './graphql/schema/**/*.ts',

  // Documents to scan for operations
  documents: ['./lib/graphql/**/*.ts', './components/**/*.tsx', './app/**/*.tsx'],

  // Generate output
  generates: {
    // Generated types file
    './types/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
      ],
      config: {
        // Use named exports
        exportFragmentSpreadSubTypes: true,

        // Scalar mappings
        scalars: {
          DateTime: 'string',
          JSON: 'Record<string, unknown>',
          PortableText: 'any[]',
        },

        // Enum style
        enumsAsTypes: true,

        // Skip typename
        skipTypename: true,

        // Naming convention
        namingConvention: {
          typeNames: 'change-case-all#pascalCase',
          enumValues: 'change-case-all#upperCase',
        },
      },
    },

    // Resolver types for the server
    './graphql/types/resolvers.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        useIndexSignature: true,
        contextType: '../context#GraphQLContext',
        scalars: {
          DateTime: 'string',
          JSON: 'Record<string, unknown>',
          PortableText: 'any[]',
        },
      },
    },
  },

  // Hooks
  hooks: {
    afterAllFileWrite: ['prettier --write'],
  },
};

export default config;
