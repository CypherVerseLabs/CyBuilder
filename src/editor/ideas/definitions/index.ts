import {
  mediaIdeas,
} from "./core/media";

import {
  environmentIdeas,
} from "./core/environment";

import {
  customIdeas,
} from "./custom";

import type {
  AnyIdeaDefinition,
  IdeaType,
} from "../types";

export const ideaDefinitions: AnyIdeaDefinition[] = [
  ...mediaIdeas,
  ...environmentIdeas,
  ...customIdeas,
];
/* =========================================
   ALL
========================================= */

export function getIdeaDefinitions():
  AnyIdeaDefinition[] {
  return ideaDefinitions;
}

/* =========================================
   LOOKUP
========================================= */

export function getIdeaDefinition(
  type: IdeaType
): AnyIdeaDefinition | undefined {
  return ideaDefinitions.find(
    (definition) =>
      definition.type === type
  );
}

/* =========================================
   CATEGORIES
========================================= */

export function getIdeaCategories(): string[] {
  return Array.from(
    new Set(
      ideaDefinitions.map(
        (definition) =>
          definition.category
      )
    )
  );
}

/* =========================================
   CATEGORY
========================================= */

export function getIdeasByCategory(
  category: string
): AnyIdeaDefinition[] {
  return ideaDefinitions.filter(
    (definition) =>
      definition.category === category
  );
}