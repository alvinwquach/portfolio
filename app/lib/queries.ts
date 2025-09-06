import { gql } from "@apollo/client";

export const GET_BLOGS = gql`
  query GetBlogs {
    allBlog {
      _id
      title
      slug {
        current
      }
      mainImage {
        asset {
          url
        }
      }
      excerpt
      contentRaw
      publishedAt
      tags
      featured
    }
  }
`;

export const GET_FEATURED_BLOG = gql`
  query GetFeaturedBlog {
    allBlog(
      where: { featured: { eq: true } }
      sort: [{ publishedAt: DESC }]
      limit: 1
    ) {
      _id
      title
      slug {
        current
      }
      mainImage {
        asset {
          url
        }
      }
      excerpt
      contentRaw
      publishedAt
      tags
      featured
    }
  }
`;

export const GET_BLOG_BY_SLUG = gql`
  query GetBlogBySlug($slug: String!) {
    allBlog(where: { slug: { current: { eq: $slug } } }) {
      _id
      title
      slug {
        current
      }
      mainImage {
        asset {
          url
        }
      }
      contentRaw
      excerpt
      publishedAt
      tags
      featured
    }
  }
`;

export const GET_PROJECTS = gql`
  query GetProjects {
    allProject {
      _id
      title
      slug {
        current
      }
      mainImage {
        asset {
          url
        }
      }
      description
      github
      live
      technologies
    }
  }
`;
