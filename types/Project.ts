import { PortableTextBlock } from "sanity";

export interface Project {
  name: string;
  descriptionRaw: PortableTextBlock;
  tags: string[];
  wideScreenView: {
    asset: {
      url: string;
    };
  };
  url?: string;
  repository?: string;
}
