import {
  defaultTransform,
  CloudySkyObject,
  RainObject,
  TitleObject,
  LinkObject,
  SpeakerObject,
  GroundObject,
} from "../../scene/objectTypes";

import {
  AnyIdeaDefinition,
} from "../types";

function createId(
  type: string
) {
  return `${type}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

/* =========================================
   CUSTOM IDEAS
========================================= */

export const customIdeas:
  AnyIdeaDefinition[] = [

  /* =======================================
     CLOUDY SKY
  ======================================= */

  {
    type: "cloudySky",
    name: "Cloudy Sky",
    category: "Environment",

    schema: [
      {
        name: "color",
        type: "color",
        label: "Base Color",
      },

      {
        name: "colors",
        type: "array",
        itemType: "number",
        label: "Gradient Colors",
        step: 0.01,
      },
    ],

    ai: {
      description:
        "Creates a large cloudy procedural sky surrounding the scene.",

      tags: [
        "sky",
        "clouds",
        "environment",
        "atmosphere",
      ],

      skills: [
        "environment.sky",
      ],
    },

    create: (
      overrides: Partial<CloudySkyObject> = {}
    ) => ({
      id: createId("cloudySky"),
      type: "cloudySky",

      transform: {
        ...defaultTransform,
      },

      props: {
        color: "#9efcff",

        colors: [
          0.7, 0.85, 1,
          0.4, 0.65, 0.9,
          0.2, 0.45, 0.7,
          0.1, 0.2, 0.5,
        ],
      },

      ...overrides,
    }),
  },

  /* =======================================
     RAIN
  ======================================= */

  {
    type: "rain",
    name: "Rain",
    category: "Environment",

    schema: [
      {
        name: "count",
        type: "integer",
        label: "Count",
        step: 1,
      },

      {
        name: "color",
        type: "color",
        label: "Color",
      },

      {
        name: "size",
        type: "number",
        label: "Size",
        step: 0.01,
      },
    ],

    ai: {
      description:
        "Creates animated falling rain particles.",

      tags: [
        "rain",
        "weather",
        "particles",
        "atmosphere",
      ],

      skills: [
        "environment.weather",
      ],
    },

    create: (
      overrides: Partial<RainObject> = {}
    ) => ({
      id: createId("rain"),
      type: "rain",

      transform: {
        ...defaultTransform,
      },

      props: {
        count: 5000,
        color: "#8a2be2",
        size: 0.1,
      },

      ...overrides,
    }),
  },

  /* =======================================
     TITLE
  ======================================= */

  {
    type: "title",
    name: "Title",
    category: "Interface",

    schema: [
      {
        name: "text",
        type: "string",
        label: "Text",
        placeholder: "Title text",
      },

      {
        name: "image",
        type: "image",
        label: "Image",
        placeholder: "Image URL",
      },
    ],

    ai: {
      description:
        "Creates a player-facing 3D title.",

      tags: [
        "title",
        "text",
        "ui",
        "interface",
      ],

      skills: [
        "interface.title",
      ],
    },

    create: (
      overrides: Partial<TitleObject> = {}
    ) => ({
      id: createId("title"),
      type: "title",

      transform: {
        ...defaultTransform,
      },

      props: {
        text: "Welcome",
        image: "",
      },

      ...overrides,
    }),
  },

  /* =======================================
     LINK
  ======================================= */

  {
    type: "link",
    name: "Link",
    category: "Interface",

    schema: [
      {
        name: "href",
        type: "string",
        label: "URL",
        placeholder: "/page",
      },

      {
        name: "text",
        type: "string",
        label: "Text",
        placeholder: "Link text",
      },
    ],

    ai: {
      description:
        "Creates an interactive 3D navigation link.",

      tags: [
        "link",
        "navigation",
        "button",
        "interface",
      ],

      skills: [
        "interface.navigation",
      ],
    },

    create: (
      overrides: Partial<LinkObject> = {}
    ) => ({
      id: createId("link"),

      type: "link",

      transform: {
        ...defaultTransform,
      },

      props: {
        href: "/",
        text: "Visit page",
      },

      ...overrides,
    }),
  },

  /* =======================================
     SPEAKER
  ======================================= */

  {
    type: "speaker",
    name: "Speaker",
    category: "Audio",

    schema: [
      {
        name: "audioUrl",
        type: "audio",
        label: "Audio",
        placeholder: "Audio URL",
      },

      {
        name: "distance",
        type: "number",
        label: "Distance",
        step: 0.01,
      },

      {
        name: "volume",
        type: "number",
        label: "Volume",
        step: 0.01,
      },
    ],

    ai: {
      description:
        "Creates a 3D speaker with positional audio.",

      tags: [
        "audio",
        "speaker",
        "sound",
        "music",
      ],

      skills: [
        "audio.spatial",
      ],
    },

    create: (
      overrides: Partial<SpeakerObject> = {}
    ) => ({
      id: createId("speaker"),

      type: "speaker",

      transform: {
        ...defaultTransform,
      },

      props: {
        audioUrl:
          "https://d27rt3a60hh1lx.cloudfront.net/audio/nocopyright-lofi-muse.mp3",

        distance: 6,

        volume: 1,
      },

      ...overrides,
    }),
  },

  /* =======================================
     GROUND
  ======================================= */

  {
    type: "ground",
    name: "Ground",
    category: "Environment",

    schema: [
      {
        name: "size",
        type: "number",
        label: "Size",
        step: 1,
      },

      {
        name: "gridSize",
        type: "integer",
        label: "Grid Size",
        step: 1,
      },
    ],

    ai: {
      description:
        "Creates an interactive grid-based ground surface.",

      tags: [
        "ground",
        "floor",
        "grid",
        "surface",
      ],

      skills: [
        "environment.ground",
      ],
    },

    create: (
      overrides: Partial<GroundObject> = {}
    ) => ({
      id: createId("ground"),

      type: "ground",

      transform: {
        ...defaultTransform,
      },

      props: {
        size: 500,
        gridSize: 100,
      },

      ...overrides,
    }),
  },
];