import { defineType, defineField } from "sanity";

export const projectType = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Project name or title.",
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
      description: "A featured image for the project.",
      options: { hotspot: true },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: "Brief description or overview of the project.",
    }),
    defineField({
      name: "github",
      title: "GitHub Link",
      type: "url",
      description: "Link to the GitHub repository for the project.",
    }),
    defineField({
      name: "live",
      title: "Live Link",
      type: "url",
      description: "Live site or deployment link.",
    }),
    defineField({
      name: "technologies",
      title: "Technologies Used",
      type: "array",
      description: "List of technologies, tools, or frameworks used.",
      of: [{ type: "string" }],
    }),
  ],
});
