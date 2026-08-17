import dynamic from "next/dynamic";

import {
  Scene,
} from "../editor/scene/objectTypes";

const EditorReality = dynamic(
  () => import("../editor/EditorReality"),
  {
    ssr: false,
  }
);

const scene: Scene = {
  objects: [
    {
      id: "sky-1",
      type: "cloudySky",

      transform: {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
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
    },

    {
      id: "rain-1",
      type: "rain",

      transform: {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      },

      props: {
        count: 5000,
        color: "#02e83c",
        size: 0.1,
      },
    },

    {
      id: "ground-1",
      type: "ground",

      transform: {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      },

      props: {
        size: 500,
        gridSize: 100,
      },
    },

    {
      id: "title-1",
      type: "title",

      transform: {
        position: [0, 1.2, -0.75],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      },

      props: {
        text: "welcome to Found",
        image: "",
      },
    },

    {
      id: "model-1",
      type: "model",

      transform: {
        position: [0, 2, -1.5],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      },

      props: {
        src: "./cyLogo.glb",
        center: false,
        normalize: false,
      },
    },

    {
      id: "link-1",
      type: "link",

      transform: {
        position: [-1.5, 0.8, 0.75],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      },

      props: {
        href: "/multiplayer",
        text: "visit multiplayer page",
      },
    },

    {
      id: "link-2",
      type: "link",

      transform: {
        position: [-1, 0.8, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      },

      props: {
        href: "/decentral_station",
        text: "Decentral Station",
      },
    },

    {
      id: "link-3",
      type: "link",

      transform: {
        position: [1, 0.8, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      },

      props: {
        href: "/workshop",
        text: "visit workshop page",
      },
    },

    {
      id: "speaker-1",
      type: "speaker",

      transform: {
        position: [1, 0, -4],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      },

      props: {
        audioUrl:
          "https://d27rt3a60hh1lx.cloudfront.net/audio/nocopyright-lofi-muse.mp3",

        distance: 6,

        volume: 1,
      },
    },
  ],
};

export default function EditorPage() {
  return (
    <EditorReality
      initialScene={scene}
    />
  );
}