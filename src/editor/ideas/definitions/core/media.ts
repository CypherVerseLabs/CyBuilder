import {
  defaultTransform,
  ImageObject,
  ModelObject,
  VideoObject,
  AudioObject,
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

export const mediaIdeas:
  AnyIdeaDefinition[] = [

  /* =========================================
     IMAGE
  ========================================= */

  {
    type: "image",
    name: "Image",
    category: "Media",

    schema: [
      {
        name: "src",
        type: "string",
        label: "Image",
      },
    ],

    ai: {
      description:
        "Displays an image in the scene.",

      tags: [
        "image",
        "picture",
        "photo",
        "media",
      ],

      skills: [
        "media.create",
      ],
    },

    create: (
      overrides: Partial<ImageObject> = {}
    ) => ({
      id: createId("image"),
      type: "image",

      transform: {
        ...defaultTransform,
      },

      props: {
        src: "",
      },

      ...overrides,
    }),
  },

  /* =========================================
     MODEL
  ========================================= */

  {
    type: "model",
    name: "Model",
    category: "Media",

    schema: [
  {
    name: "src",
    type: "gltf",
    label: "Model",
  },
  {
    name: "center",
    type: "boolean",
    label: "Center",
  },
  {
    name: "normalize",
    type: "boolean",
    label: "Normalize",
  },
],

    ai: {
      description:
        "Adds a 3D model to the scene.",

      tags: [
        "3d",
        "model",
        "object",
        "mesh",
      ],

      skills: [
        "media.create",
      ],
    },

    create: (
      overrides: Partial<ModelObject> = {}
    ) => ({
      id: createId("model"),
      type: "model",

      transform: {
        ...defaultTransform,
      },

      props: {
        src: "",
        center: true,
        normalize: true,
      },

      ...overrides,
    }),
  },

  /* =========================================
     VIDEO
  ========================================= */

  {
    type: "video",
    name: "Video",
    category: "Media",

    schema: [
  {
    name: "src",
    type: "video",
    label: "Video",
  },
  {
    name: "size",
    type: "float",
    label: "Size",
    step: 0.1,
  },
  {
    name: "volume",
    type: "float",
    label: "Volume",
    step: 0.01,
  },
  {
    name: "muted",
    type: "boolean",
    label: "Muted",
  },
  {
    name: "framed",
    type: "boolean",
    label: "Framed",
  },
],

    ai: {
      description:
        "Displays a video in the scene.",

      tags: [
        "video",
        "media",
        "movie",
      ],

      skills: [
        "media.create",
      ],
    },

    create: (
      overrides: Partial<VideoObject> = {}
    ) => ({
      id: createId("video"),
      type: "video",

      transform: {
        ...defaultTransform,
      },

      props: {
        src: "",
        size: 1,
        framed: false,
        muted: false,
        volume: 1,
      },

      ...overrides,
    }),
  },

  /* =========================================
     AUDIO
  ========================================= */

  {
    type: "audio",
    name: "Audio",
    category: "Media",

    schema: [
  {
    name: "url",
    type: "audio",
    label: "Audio",
  },
  {
    name: "volume",
    type: "float",
    label: "Volume",
    step: 0.01,
  },
  {
    name: "rollOff",
    type: "float",
    label: "Roll Off",
    step: 0.1,
  },
],

    ai: {
      description:
        "Adds spatial audio to the scene.",

      tags: [
        "audio",
        "sound",
        "music",
        "spatial audio",
      ],

      skills: [
        "media.create",
      ],
    },

    create: (
      overrides: Partial<AudioObject> = {}
    ) => ({
      id: createId("audio"),
      type: "audio",

      transform: {
        ...defaultTransform,
      },

      props: {
        url: "",
        volume: 1,
        rollOff: 1,
      },

      ...overrides,
    }),
  },
];