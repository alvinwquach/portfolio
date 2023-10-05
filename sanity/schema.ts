import { type SchemaTypeDefinition } from "sanity";
import about from "./schemas/about";
import projects from "./schemas/projects";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [about, projects],
};
