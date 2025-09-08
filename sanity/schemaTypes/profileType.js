import { defineType, defineField } from "sanity";

export const profileType = defineType({
  name: "profile",
  title: "Profile",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "linkedin",
      title: "LinkedIn URL",
      type: "url",
    }),
    defineField({
      name: "github",
      title: "GitHub URL",
      type: "url",
    }),
    defineField({
      name: "bio",
      title: "Bio / Blurb",
      type: "array",
      description: "The main content of the blurb.",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "profileImage",
      title: "Profile Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "skills",
      title: "Skills",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "name",
              title: "Skill Name",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "image",
              title: "Skill Image/Icon",
              type: "image",
              options: { hotspot: true },
            },
          ],
        },
      ],
    }),
  ],
});
