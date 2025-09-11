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
      video {
        asset {
          playbackId
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
      sort: { publishedAt: DESC }
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
      video {
        asset {
          playbackId
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
    allBlog(where: { slug: { current: { eq: $slug } } }, limit: 1) {
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
      video {
        asset {
          playbackId
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

export const GET_PROFILE = gql`
  query GetProfile {
    allProfile(limit: 1) {
      _id
      name
      email
      linkedin
      github
      bioRaw
      profileImage {
        asset {
          url
        }
      }
      skills {
        name
        image {
          asset {
            url
          }
        }
      }
    }
  }
`;
