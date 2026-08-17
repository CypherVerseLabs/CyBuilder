import type { ComponentType } from "react";

import Ground from "../../ideas/Ground";
import CloudySky from "../../ideas/CloudySky";
import ProximityPicture from "../../ideas/decorations/ProximityPicture";

import {
  AnyIdeaDefinition,
} from "./types";

import {
  getIdeaDefinitions,
} from "./definitions/";

import {
  IdeaPlugin,
} from "./types";

/* =========================================
   REGISTRY TYPES
========================================= */

export type IdeaKind =
  | "scene-object"
  | "component";

export type IdeaSchemaField = {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
};

export type RegisteredIdea = {
  id: string;

  name: string;

  category: string;

  kind: IdeaKind;

  /*
   * React component used when the idea
   * represents a CyEngine component.
   */
  component?: ComponentType<any>;

  /*
   * Scene-object definition used when
   * the idea creates an editor SceneObject.
   */
  definition?: AnyIdeaDefinition;

  /*
   * AI/search metadata.
   */
  description?: string;

  tags?: string[];

  skills?: string[];

  /*
   * Editable properties exposed
   * to the editor and AI.
   */
  schema?: IdeaSchemaField[];
};

/* =========================================
   REGISTRY STORAGE
========================================= */

const registry =
  new Map<string, RegisteredIdea>();

/* =========================================
   REGISTER
========================================= */

export function registerIdea(
  idea: RegisteredIdea
) {
  if (registry.has(idea.id)) {
    console.warn(
      `[CyBuilder] Idea "${idea.id}" is already registered.`
    );

    return;
  }

  registry.set(
    idea.id,
    idea
  );
}

/* =========================================
   REGISTER MANY
========================================= */

export function registerIdeas(
  ideas: RegisteredIdea[]
) {
  for (const idea of ideas) {
    registerIdea(idea);
  }
}

/* =========================================
   REGISTER PLUGIN
========================================= */

export function registerPlugin(
  plugin: IdeaPlugin
) {
  registerIdeas(
    plugin.ideas.map(
      idea => ({
        id: idea.type,
        name: idea.name,
        category: idea.category,
        kind: "scene-object",

        definition: idea,

        description:
          idea.ai?.description,

        tags:
          idea.ai?.tags,

        skills:
          idea.ai?.skills,
      })
    )
  );
}

/* =========================================
   SCENE OBJECT IDEAS
========================================= */

function registerSceneObjectIdeas() {
  const definitions =
    getIdeaDefinitions();

  for (const definition of definitions) {
    registerIdea({
      id: definition.type,

      name: definition.name,

      category:
        definition.category,

      kind: "scene-object",

      definition,

      description:
        definition.ai?.description,

      tags:
        definition.ai?.tags,

      skills:
        definition.ai?.skills,
    });
  }
}

/* =========================================
   COMPONENT IDEAS
========================================= */

function registerComponentIdeas() {
  registerIdeas([
    {
      id: "ground",

      name: "Ground",

      category: "Environment",

      kind: "component",

      component: Ground,

      description:
        "Interactive grid ground surface.",

      tags: [
        "ground",
        "floor",
        "surface",
        "terrain",
      ],

      skills: [
        "environment.ground",
      ],

      schema: [
        {
          name: "size",
          type: "number",
        },

        {
          name: "gridSize",
          type: "number",
        },
      ],
    },

    {
      id: "cloudy-sky",

      name: "Cloudy Sky",

      category: "Environment",

      kind: "component",

      component: CloudySky,

      description:
        "Procedural animated cloudy sky.",

      tags: [
        "sky",
        "cloud",
        "environment",
        "atmosphere",
      ],

      skills: [
        "environment.sky",
      ],

      schema: [
        {
          name: "color",
          type: "color",
        },

        {
          name: "colors",
          type: "number[]",
        },
      ],
    },

    {
      id: "proximity-picture",

      name: "Proximity Picture",

      category: "Decorations",

      kind: "component",

      component:
        ProximityPicture,

      description:
        "An image that appears when the player approaches it.",

      tags: [
        "image",
        "picture",
        "proximity",
        "decoration",
        "media",
      ],

      skills: [
        "decoration.proximity-picture",
      ],

      schema: [
        {
          name: "image",
          type: "image",
        },

        {
          name: "position",
          type: "position",
        },

        {
          name: "scale",
          type: "scale",
        },

        {
          name: "rotation",
          type: "rotation",
        },

        {
          name: "radius",
          type: "radius",
        },

        {
          name: "framed",
          type: "boolean",
        },
      ],
    },
  ]);
}

/* =========================================
   INITIALIZE CORE REGISTRY
========================================= */

registerSceneObjectIdeas();

registerComponentIdeas();

/* =========================================
   LOOKUP
========================================= */

export function getRegisteredIdea(
  id: string
): RegisteredIdea | undefined {
  return registry.get(id);
}

export function getIdeaDefinition(
  type: AnyIdeaDefinition["type"]
): AnyIdeaDefinition | undefined {
  const idea =
    registry.get(type);

  if (!idea) {
    return undefined;
  }

  return idea.definition;
}
/* =========================================
   ALL
========================================= */

export function getRegisteredIdeas():
  RegisteredIdea[] {
  return Array.from(
    registry.values()
  );
}

/* =========================================
   CATEGORY
========================================= */

export function getRegisteredIdeasByCategory(
  category: string
): RegisteredIdea[] {
  return getRegisteredIdeas().filter(
    idea =>
      idea.category === category
  );
}

/* =========================================
   SEARCH
========================================= */

export function searchRegisteredIdeas(
  query: string
): RegisteredIdea[] {
  const normalized =
    query.trim().toLowerCase();

  if (!normalized) {
    return getRegisteredIdeas();
  }

  return getRegisteredIdeas().filter(
    idea => {
      const text = [
        idea.id,
        idea.name,
        idea.category,
        idea.description ?? "",
        ...(idea.tags ?? []),
        ...(idea.skills ?? []),
      ]
        .join(" ")
        .toLowerCase();

      return text.includes(
        normalized
      );
    }
  );
}