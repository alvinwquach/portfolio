import { PortableTextBlock } from "sanity";

export interface About {
  storyRaw: PortableTextBlock;
  linkedin: string | null;
  github: string | null;
  email: string | null;
}
