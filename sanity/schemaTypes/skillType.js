import { defineType, defineField } from "sanity";

export const skillType = defineType({
  name: "skill",
  title: "Skill",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Skill Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Skill Image/Icon",
      type: "image",
      options: { hotspot: true },
    }),
  ],
});
