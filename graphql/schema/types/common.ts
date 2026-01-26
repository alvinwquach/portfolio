/**
 * Common GraphQL Type Definitions
 * ================================
 * Shared types used across the GraphQL schema
 */

export const commonTypes = `#graphql
  """
  Sanity image asset with URL and dimensions
  """
  type Image {
    _id: String
    url: String
    alt: String
    hotspot: Hotspot
    dimensions: ImageDimensions
  }

  type Hotspot {
    x: Float
    y: Float
    width: Float
    height: Float
  }

  type ImageDimensions {
    width: Int
    height: Int
    aspectRatio: Float
  }

  """
  Portable Text block content (simplified)
  """
  scalar PortableText

  """
  JSON scalar for flexible data structures
  """
  scalar JSON

  """
  DateTime scalar
  """
  scalar DateTime

  """
  Slug type for URL-friendly identifiers
  """
  type Slug {
    current: String!
  }

  """
  File asset for downloadable content
  """
  type File {
    url: String
    filename: String
    size: Int
  }

  """
  Code block with syntax highlighting
  """
  type CodeBlock {
    language: String
    code: String
    filename: String
  }
`;
