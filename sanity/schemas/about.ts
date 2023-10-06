export default {
  name: "about",
  type: "document",
  title: "About",
  fields: [
    {
      name: "image",
      title: "Image",
      type: "image",
      description: "Please upload an image of yourself.",
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "story",
      title: "Story",
      type: "array",
      description: "Please provide your story here.",
      of: [{ type: "block" }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "linkedin",
      title: "LinkedIn",
      type: "url",
      description: "Please provide the link to your LinkedIn.",
    },
    {
      name: "github",
      title: "Github",
      type: "url",
      description: "Please provide the link to your Github.",
    },
    {
      name: "email",
      title: "Email",
      type: "string",
      description: "Please provide the link to your email.",
    },
  ],
};
