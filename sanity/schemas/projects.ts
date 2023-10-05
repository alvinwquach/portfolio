export default {
  name: "projects",
  type: "document",
  title: "Projects",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      description: "Please provide the name of your project.",
    },
    {
      name: "description",
      title: "Description",
      type: "array",
      description: "Please describe what your project does.",
      of: [{ type: "block" }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      description: "Please provide the technical stack for your project.",
      options: {
        layout: "tags",
      },
    },
    {
      name: "wideScreenView",
      title: "Wide Screen View",
      type: "image",
      description: "Please upload a wide screen view of your project.",
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "url",
      title: "Url",
      type: "url",
      description: "Please provide the url to your project.",
    },
    {
      name: "repository",
      title: "Repository",
      type: "url",
      description: "Please provide the repository to your project.",
    },
  ],
};
