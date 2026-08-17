import {
  Vector3Tuple,
} from "three";


/* =========================================
   TRANSFORM
========================================= */

export type Transform = {
  position: Vector3Tuple;
  rotation: Vector3Tuple;
  scale: Vector3Tuple;
};


/* =========================================
   SCENE OBJECT BASE
========================================= */

export type SceneObjectBase = {
  id: string;

  transform: Transform;

  /*
   * Hierarchy / editor metadata
   */
  name?: string;

  visible?: boolean;

  locked?: boolean;

  /*
   * Parent object.
   *
   * undefined = root level
   */
  parentId?: string;
};


/* =========================================
   IMAGE
========================================= */

export type ImageObject =
  SceneObjectBase & {
    type: "image";

    props: {
      src: string;
    };
  };


/* =========================================
   MODEL
========================================= */

export type ModelObject =
  SceneObjectBase & {
    type: "model";

    props: {
      src: string;
      center: boolean;
      normalize: boolean;
    };
  };


/* =========================================
   VIDEO
========================================= */

export type VideoObject =
  SceneObjectBase & {
    type: "video";

    props: {
      src: string;
      size: number;
      framed: boolean;
      muted: boolean;
      volume: number;
    };
  };


/* =========================================
   AUDIO
========================================= */

export type AudioObject =
  SceneObjectBase & {
    type: "audio";

    props: {
      url: string;
      volume: number;
      rollOff: number;
    };
  };


/* =========================================
   HDRI
========================================= */

export type HDRIObject =
  SceneObjectBase & {
    type: "hdri";

    props: {
      src: string;
      disableBackground: boolean;
      disableEnvironment: boolean;
    };
  };


/* =========================================
   BACKGROUND
========================================= */

export type BackgroundObject =
  SceneObjectBase & {
    type: "background";

    props: {
      color: string;
    };
  };


/* =========================================
   FOG
========================================= */

export type FogObject =
  SceneObjectBase & {
    type: "fog";

    props: {
      color: string;
      near: number;
      far: number;
    };
  };


/* =========================================
   INFINITE PLANE
========================================= */

export type InfinitePlaneObject =
  SceneObjectBase & {
    type: "infinitePlane";

    props: {
      height: number;
      visible: boolean;
      size: [number, number];
    };
  };


/* =========================================
   CLOUDY SKY
========================================= */

export type CloudySkyObject =
  SceneObjectBase & {
    type: "cloudySky";

    props: {
      color: string;
      colors: number[];
    };
  };


/* =========================================
   RAIN
========================================= */

export type RainObject =
  SceneObjectBase & {
    type: "rain";

    props: {
      count: number;
      color: string;
      size: number;
    };
  };


/* =========================================
   TITLE
========================================= */

export type TitleObject =
  SceneObjectBase & {
    type: "title";

    props: {
      text: string;
      image: string;
    };
  };


/* =========================================
   LINK
========================================= */

export type LinkObject =
  SceneObjectBase & {
    type: "link";

    props: {
      href: string;
      text: string;
    };
  };


/* =========================================
   SPEAKER
========================================= */

export type SpeakerObject =
  SceneObjectBase & {
    type: "speaker";

    props: {
      audioUrl: string;
      distance: number;
      volume: number;
    };
  };


/* =========================================
   GROUND
========================================= */

export type GroundObject =
  SceneObjectBase & {
    type: "ground";

    props: {
      size: number;
      gridSize: number;
    };
  };


/* =========================================
   LOST FLOOR
========================================= */

export type LostFloorObject =
  SceneObjectBase & {
    type: "lostFloor";

    props: {
      size: [number, number];
      visible: boolean;
    };
  };


/* =========================================
   SCENE OBJECT
========================================= */

export type SceneObject =
  | ImageObject
  | ModelObject
  | VideoObject
  | AudioObject
  | HDRIObject
  | BackgroundObject
  | FogObject
  | InfinitePlaneObject
  | CloudySkyObject
  | RainObject
  | TitleObject
  | LinkObject
  | SpeakerObject
  | GroundObject
  | LostFloorObject;


/* =========================================
   SCENE
========================================= */

export type Scene = {
  objects: SceneObject[];
};


/* =========================================
   DEFAULT TRANSFORM
========================================= */

export const defaultTransform: Transform = {
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  scale: [1, 1, 1],
};


/* =========================================
   CLONE SCENE OBJECT
========================================= */

export function cloneSceneObject(
  object: SceneObject,
  id: string
): SceneObject {

  const cloned = {
    ...object,

    id,

    transform: {
      ...object.transform,

      position: [
        ...object.transform.position,
      ] as Vector3Tuple,

      rotation: [
        ...object.transform.rotation,
      ] as Vector3Tuple,

      scale: [
        ...object.transform.scale,
      ] as Vector3Tuple,
    },

    props: {
      ...object.props,
    },
  };

  return cloned as typeof object;
}