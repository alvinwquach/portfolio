import { defineType, defineField } from "sanity";

export const blogType = defineType({
  name: "blog",
  title: "Blog",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "The title of the blog post.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "URL-friendly identifier, auto-generated from title.",
      options: {
        source: "title",
        slugify: (input) =>
          input.toLowerCase().replace(/\s+/g, "-").slice(0, 200),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      description: "Hero image for the blog post.",
      options: { hotspot: true },
    }),
    defineField({
      name: "video",
      title: "Video",
      type: "mux.video",
      description: "Upload or link a Mux video for this blog post.",
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      description: "Short summary of the blog post, shown in previews.",
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      description: "The main content of the blog post.",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      description: "Tags help categorize and group related posts.",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      description: "Set the publish date and time for scheduling or sorting.",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description: "Mark as featured blog to display prominently.",
      initialValue: false,
    }),
  ],
});
