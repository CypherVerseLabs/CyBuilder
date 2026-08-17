import {
  SceneObject,
} from "../scene/objectTypes";

/* =========================================
   IDEA TYPE
========================================= */

export type IdeaType =
  SceneObject["type"];

/* =========================================
   FIELD TYPES
========================================= */

export type IdeaFieldType =
  | "string"
  | "image"
  | "video"
  | "audio"
  | "gltf"
  | "number"
  | "float"
  | "integer"
  | "radius"
  | "color"
  | "boolean"
  | "vector2"
  | "array";

/* =========================================
   ARRAY ITEM TYPE
========================================= */

export type IdeaArrayItemType =
  | "string"
  | "number"
  | "float"
  | "integer"
  | "radius"
  | "color"
  | "boolean"
  | "vector2";

/* =========================================
   BASE FIELD
========================================= */

type BaseIdeaField = {
  name: string;
  label?: string;
  placeholder?: string;
  step?: number;
};

/* =========================================
   IDEA FIELD
========================================= */

export type IdeaField =
  | (BaseIdeaField & {
      type:
        | "string"
        | "image"
        | "video"
        | "audio"
        | "gltf"
        | "number"
        | "float"
        | "integer"
        | "radius"
        | "color"
        | "boolean"
        | "vector2";
    })
  | (BaseIdeaField & {
      type: "array";
      itemType: IdeaArrayItemType;
    });

/* =========================================
   IDEA DEFINITION
========================================= */

export type IdeaDefinition<
  T extends SceneObject
> = {
  type: T["type"];

  name: string;

  category: string;

  schema: IdeaField[];

  create: (
    overrides?: Partial<T>
  ) => T;

  ai?: {
    description?: string;
    tags?: string[];
    skills?: string[];
  };
};

/* =========================================
   ANY IDEA DEFINITION
========================================= */

export type AnyIdeaDefinition = {
  [K in SceneObject["type"]]:
    IdeaDefinition<
      Extract<
        SceneObject,
        { type: K }
      >
    >;
}[SceneObject["type"]];

/* =========================================
   PLUGIN
========================================= */

export type IdeaPlugin = {
  name: string;
  ideas: AnyIdeaDefinition[];
};