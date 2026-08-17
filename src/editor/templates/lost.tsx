import React from "react";

import { Fog } from "../../ideas/Fog";
import { Background, LostFloor } from "cyengine";

import {
  EditorTemplate,
} from "./types";

export const lostWorldTemplate: EditorTemplate = {
  id: "lost-world",

  name: "Lost World",

  description:
    "A blank world with the Lost World atmosphere and procedural floor.",

  scene: {
    objects: [],
  },

  environment: (
    <group name="lost-world">
      <Fog
        color="white"
        near={0.1}
        far={15}
      />

      <directionalLight
        position-y={1}
        intensity={1.8}
      />

      <ambientLight
        intensity={1}
      />

      <Background
        color="white"
      />

      <LostFloor />
    </group>
  ),
};