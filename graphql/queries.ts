import { gql } from "@apollo/client";

export const GET_PROJECTS = gql`
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
