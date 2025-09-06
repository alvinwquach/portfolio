import { type SchemaTypeDefinition } from "sanity";
import { blogType } from "./blogType";
import { projectType } from "./projectType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blogType, projectType],
};
