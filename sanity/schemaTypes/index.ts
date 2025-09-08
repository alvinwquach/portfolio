import { type SchemaTypeDefinition } from "sanity";
import { blogType } from "./blogType";
import { profileType } from "./profileType";
import { projectType } from "./projectType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blogType, profileType, projectType],
};
