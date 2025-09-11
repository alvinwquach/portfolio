import { type SchemaTypeDefinition } from "sanity";
import { blogType } from "./blogType";
import { profileType } from "./profileType";
import { projectType } from "./projectType";
import { skillType } from "./skillType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blogType, profileType, projectType, skillType],
};
