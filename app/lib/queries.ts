export const GET_BLOGS = `
  *[_type == "blog"] {
    _id,
    title,
    slug {
      current
    },
    mainImage {
      asset -> {
        url
      }
    },
    excerpt,
    content,
    publishedAt,
    tags,
    featured
  }
`;

export const GET_FEATURED_BLOG = `
  *[_type == "blog" && featured == true] | order(publishedAt desc) [0] {
    _id,
    title,
    slug {
      current
    },
    mainImage {
      asset -> {
        url
      }
    },
    excerpt,
    content,
    publishedAt,
    tags,
    featured
  }
`;

export const GET_BLOG_BY_SLUG = (slug: string) => `
  *[_type == "blog" && slug.current == "${slug}"][0] {
    _id,
    title,
    slug {
      current
    },
    mainImage {
      asset -> {
        url
      }
    },
    content[],
    excerpt,
    publishedAt,
    tags,
    featured
  }
`;

export const GET_PROJECTS = `
  *[_type == "project"] {
    _id,
    title,
    slug {
      current
    },
    mainImage {
      asset -> {
        url
      }
    },
    description,
    github,
    live,
    technologies
  }
`;

export const GET_PROFILE = `
  *[_type == "profile"][0] {
    _id,
    name,
    email,
    linkedin,
    github,
    bio[],
    profileImage {
      asset -> {
        url
      }
    },
    skills[] {
      name,
      image {
        asset -> {
          url
        }
      }
    }
  }
`;
