import React from "react";

import {
  Audio,
  Fog,
  Image,
  InfinitePlane,
  LostFloor,
  Model,
  Video,
} from "cyengine";

import {
  ColorRepresentation,
} from "three";

import CloudySky from "../../ideas/CloudySky";
import { Rain } from "../../ideas/Rain";
import Title from "../../ideas/Title";
import Link from "../../ideas/Link";
import Speaker from "../../ideas/players/Speaker";
import Ground from "../../ideas/Ground";

import {
  SceneObject,
} from "./objectTypes";


/* =========================================
   TYPES
========================================= */

type SceneObjectContentProps = {
  object: SceneObject;
};


/* =========================================
   SCENE OBJECT CONTENT
========================================= */

export default function SceneObjectContent({
  object,
}: SceneObjectContentProps): React.ReactElement | null {

  switch (object.type) {

    /* =====================================
       IMAGE
    ===================================== */

    case "image":
      return object.props.src ? (
        <Image
          src={object.props.src}
        />
      ) : (
        <ImagePlaceholder />
      );


    /* =====================================
       MODEL
    ===================================== */

    case "model":
      return object.props.src ? (
        <Model
          src={object.props.src}
          center={object.props.center}
          normalize={object.props.normalize}
        />
      ) : (
        <ModelPlaceholder />
      );


    /* =====================================
       VIDEO
    ===================================== */

    case "video":
      return object.props.src ? (
        <Video
          src={object.props.src}
          size={object.props.size}
          framed={object.props.framed}
          muted={object.props.muted}
          volume={object.props.volume}
        />
      ) : (
        <VideoPlaceholder />
      );


    /* =====================================
       AUDIO
    ===================================== */

    case "audio":
      return object.props.url ? (
        <Audio
          url={object.props.url}
          volume={object.props.volume}
          rollOff={object.props.rollOff}
        />
      ) : (
        <AudioPlaceholder />
      );


    /* =====================================
       HDRI
    ===================================== */

    case "hdri":
      /*
       * HDRI rendering can be connected to
       * the actual CyEngine HDRI component
       * later.
       */
      return null;


    /* =====================================
       BACKGROUND
    ===================================== */

    case "background":
      return (
        <color
          attach="background"
          args={[
            object.props.color as ColorRepresentation,
          ]}
        />
      );


    /* =====================================
       FOG
    ===================================== */

    case "fog":
      return (
        <Fog
          color={
            object.props.color as ColorRepresentation
          }
          near={object.props.near}
          far={object.props.far}
        />
      );


    /* =====================================
       INFINITE PLANE
    ===================================== */

    case "infinitePlane":
      return (
        <InfinitePlane
          height={object.props.height}
          size={object.props.size}
          visible={object.props.visible}
        />
      );


    /* =====================================
       LOST FLOOR
    ===================================== */

    case "lostFloor":
      return object.props.visible ? (
        <LostFloor />
      ) : null;


    /* =====================================
       CLOUDY SKY
    ===================================== */

    case "cloudySky":
      return (
        <CloudySky
          color={object.props.color}
          colors={object.props.colors}
        />
      );


    /* =====================================
       RAIN
    ===================================== */

    case "rain":
      return (
        <Rain
          count={object.props.count}
          color={
            object.props.color as ColorRepresentation
          }
          size={object.props.size}
        />
      );


    /* =====================================
       TITLE
    ===================================== */

    case "title":
      return (
        <Title
          image={
            object.props.image ||
            undefined
          }
        >
          {object.props.text}
        </Title>
      );


    /* =====================================
       LINK
    ===================================== */

    case "link":
      return (
        <Link
          href={object.props.href}
        >
          {object.props.text}
        </Link>
      );


    /* =====================================
       SPEAKER
    ===================================== */

    case "speaker":
      return (
        <Speaker
          audioUrl={
            object.props.audioUrl
          }
          distance={
            object.props.distance
          }
          volume={
            object.props.volume
          }
        />
      );


    /* =====================================
       GROUND
    ===================================== */

    case "ground":
      return (
        <Ground
          size={object.props.size}
          gridSize={
            object.props.gridSize
          }
        />
      );


    /* =====================================
       FALLBACK
    ===================================== */

    default:
      return null;
  }
}


/* =========================================
   IMAGE PLACEHOLDER
========================================= */

function ImagePlaceholder(): React.ReactElement {
  return (
    <mesh>
      <planeGeometry
        args={[1, 1]}
      />

      <meshBasicMaterial
        color="#555566"
        wireframe
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}


/* =========================================
   MODEL PLACEHOLDER
========================================= */

function ModelPlaceholder(): React.ReactElement {
  return (
    <group>

      <mesh>
        <boxGeometry
          args={[1, 1, 1]}
        />

        <meshBasicMaterial
          color="#4c7dff"
          wireframe
          transparent
          opacity={0.8}
        />
      </mesh>

      <mesh>
        <sphereGeometry
          args={[0.08, 12, 12]}
        />

        <meshBasicMaterial
          color="#ffffff"
        />
      </mesh>

    </group>
  );
}


/* =========================================
   VIDEO PLACEHOLDER
========================================= */

function VideoPlaceholder(): React.ReactElement {
  return (
    <mesh>
      <planeGeometry
        args={[1.6, 0.9]}
      />

      <meshBasicMaterial
        color="#663366"
        wireframe
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}


/* =========================================
   AUDIO PLACEHOLDER
========================================= */

function AudioPlaceholder(): React.ReactElement {
  return (
    <group>

      <mesh>
        <sphereGeometry
          args={[0.2, 16, 16]}
        />

        <meshBasicMaterial
          color="#ffaa00"
          wireframe
        />
      </mesh>

      <mesh>
        <coneGeometry
          args={[0.12, 0.3, 8]}
        />

        <meshBasicMaterial
          color="#ffaa00"
        />
      </mesh>

    </group>
  );
}