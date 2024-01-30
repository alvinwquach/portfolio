import { gql } from "@apollo/client";

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
