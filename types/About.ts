import { PortableTextBlock } from "sanity";

export interface About {
  image: {
    asset: {
      url: string;
    };
  };
  storyRaw: PortableTextBlock;
  linkedin: string | null;
  github: string | null;
  email: string | null;
}
