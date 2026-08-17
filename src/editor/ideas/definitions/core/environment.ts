import {
  defaultTransform,
  HDRIObject,
  BackgroundObject,
  FogObject,
  InfinitePlaneObject,
  LostFloorObject,
} from "../../../scene/objectTypes";

import {
  AnyIdeaDefinition,
} from "../../types";

function createId(
  type: string
) {
  return `${type}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

export const environmentIdeas:
  AnyIdeaDefinition[] = [

  /* =========================================
     HDRI
  ========================================= */

  {
    type: "hdri",
    name: "HDRI",
    category: "Environment",

    schema: [
      {
        name: "src",
        type: "string",
        label: "Source",
        placeholder: "HDRI URL",
      },
      {
        name: "disableBackground",
        type: "boolean",
        label: "Disable Background",
      },
      {
        name: "disableEnvironment",
        type: "boolean",
        label: "Disable Environment",
      },
    ],

    ai: {
      description:
        "Adds an HDRI environment and lighting.",

      tags: [
        "hdri",
        "environment",
        "lighting",
        "sky",
      ],

      skills: [
        "environment.lighting",
      ],
    },

    create: (
      overrides: Partial<HDRIObject> = {}
    ) => ({
      id: createId("hdri"),
      type: "hdri",

      transform: {
        ...defaultTransform,
      },

      props: {
        src: "",
        disableBackground: false,
        disableEnvironment: false,
      },

      ...overrides,
    }),
  },

  /* =========================================
     BACKGROUND
  ========================================= */

  {
    type: "background",
    name: "Background",
    category: "Environment",

    schema: [
      {
        name: "color",
        type: "color",
        label: "Color",
      },
    ],

    ai: {
      description:
        "Sets the scene background color.",

      tags: [
        "background",
        "color",
        "environment",
      ],

      skills: [
        "environment.background",
      ],
    },

    create: (
      overrides: Partial<BackgroundObject> = {}
    ) => ({
      id: createId("background"),
      type: "background",

      transform: {
        ...defaultTransform,
      },

      props: {
        color: "#111111",
      },

      ...overrides,
    }),
  },

  /* =========================================
     FOG
  ========================================= */

  {
    type: "fog",
    name: "Fog",
    category: "Environment",

    schema: [
      {
        name: "color",
        type: "color",
        label: "Color",
      },
      {
        name: "near",
        type: "float",
        label: "Near",
        step: 0.01,
      },
      {
        name: "far",
        type: "float",
        label: "Far",
        step: 0.01,
      },
    ],

    ai: {
      description:
        "Adds atmospheric fog to the scene.",

      tags: [
        "fog",
        "atmosphere",
        "weather",
      ],

      skills: [
        "environment.atmosphere",
      ],
    },

    create: (
      overrides: Partial<FogObject> = {}
    ) => ({
      id: createId("fog"),
      type: "fog",

      transform: {
        ...defaultTransform,
      },

      props: {
        color: "#ffffff",
        near: 10,
        far: 80,
      },

      ...overrides,
    }),
  },

  /* =========================================
     INFINITE PLANE
  ========================================= */

  {
    type: "infinitePlane",
    name: "Infinite Plane",
    category: "Environment",

    schema: [
      {
        name: "height",
        type: "float",
        label: "Height",
        step: 0.01,
      },
      {
        name: "size",
        type: "vector2",
        label: "Size",
        step: 0.01,
      },
      {
        name: "visible",
        type: "boolean",
        label: "Visible",
      },
    ],

    ai: {
      description:
        "Creates a large plane used as a scene surface or floor.",

      tags: [
        "plane",
        "floor",
        "ground",
        "surface",
      ],

      skills: [
        "environment.surface",
      ],
    },

    create: (
      overrides: Partial<InfinitePlaneObject> = {}
    ) => ({
      id: createId("infinitePlane"),
      type: "infinitePlane",

      transform: {
        ...defaultTransform,
      },

      props: {
        height: -0.0001,
        visible: false,
        size: [100, 100],
      },

      ...overrides,
    }),
  },

    /* =========================================
     LOST FLOOR
  ========================================= */

  {
    type: "lostFloor",
    name: "Lost Floor",
    category: "Environment",

    schema: [
      {
        name: "size",
        type: "vector2",
        label: "Size",
        step: 1,
      },
      {
        name: "visible",
        type: "boolean",
        label: "Visible",
      },
    ],

    ai: {
      description:
        "Creates the atmospheric procedural floor used by the Lost World template.",

      tags: [
        "lost",
        "floor",
        "ground",
        "surface",
        "world",
      ],

      skills: [
        "environment.lost-floor",
      ],
    },

    create: (
      overrides: Partial<LostFloorObject> = {}
    ) => ({
      id: createId("lostFloor"),
      type: "lostFloor",

      transform: {
        ...defaultTransform,
      },

      props: {
        size: [10000, 10000],
        visible: true,
      },

      ...overrides,
    }),
  },
];

