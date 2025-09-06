import { PortableTextBlock } from "sanity";

export interface Blog {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: { asset: { url: string } };
  excerpt?: string;
  contentRaw: PortableTextBlock;
  publishedAt?: string;
  tags?: string[];
  featured: boolean;
}

export interface Project {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: { asset: { url: string } };
  description?: string;
  github?: string;
  live?: string;
  technologies?: string[];
}
