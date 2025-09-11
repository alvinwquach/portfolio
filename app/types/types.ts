import { PortableTextBlock } from "@portabletext/types";

export interface Blog {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: { asset: { url: string } };
  video?: { asset: { playbackId: string } };
  excerpt?: string;
  contentRaw: PortableTextBlock[];
  publishedAt?: string;
  tags?: string[];
  featured: boolean;
}

export interface Project {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  mainImage?: {
    asset: {
      url: string;
    };
  };
  description?: string;
  github?: string;
  live?: string;
  technologies?: string[];
}

export interface Skill {
  name: string;
  featured: boolean;
  image: {
    asset: {
      url: string;
    };
  };
  skillUrl?: string;
}

export interface Profile {
  _id: string;
  name: string;
  email?: string;
  linkedin?: string;
  github?: string;
  bioRaw?: PortableTextBlock[];
  profileImage: {
    asset: {
      url: string;
    };
  };
  skills?: Skill[];
}
