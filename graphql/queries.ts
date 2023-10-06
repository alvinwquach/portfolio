import { gql } from "@apollo/client";

export const aboutQuery = gql`
  query allAbouts {
    allAbout {
      image {
        asset {
          url
        }
      }
      storyRaw
      linkedin
      github
      email
    }
  }
`;

export const projectsQuery = gql`
  query allProjects {
    allProjects {
      name
      descriptionRaw
      tags
      wideScreenView {
        asset {
          url
        }
      }
      url
      repository
    }
  }
`;
