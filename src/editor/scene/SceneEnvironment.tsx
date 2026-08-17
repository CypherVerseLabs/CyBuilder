import {
  Background,
  Fog,
  HDRI,
  InfinitePlane,
} from "cyengine";

import { ColorRepresentation } from "three";
import { useEditor } from "../context/EditorContext";

export default function SceneEnvironment() {
  const { scene } = useEditor();

  const background = scene.objects.find(
    (object) => object.type === "background"
  );

  const fog = scene.objects.find(
    (object) => object.type === "fog"
  );

  const hdri = scene.objects.find(
    (object) => object.type === "hdri"
  );

  const infinitePlane = scene.objects.find(
    (object) => object.type === "infinitePlane"
  );

  return (
    <>
      {/* BACKGROUND */}

      {background &&
        background.type === "background" && (
          <Background
            color={
              background.props.color as ColorRepresentation
            }
          />
        )}

      {/* FOG */}

      {fog &&
        fog.type === "fog" && (
          <Fog
            color={
              fog.props.color as ColorRepresentation
            }
            near={fog.props.near}
            far={fog.props.far}
          />
        )}

      {/* HDRI */}

      {hdri &&
        hdri.type === "hdri" &&
        hdri.props.src && (
          <HDRI
            src={hdri.props.src}
            disableBackground={
              hdri.props.disableBackground
            }
            disableEnvironment={
              hdri.props.disableEnvironment
            }
          />
        )}

      {/* INFINITE PLANE */}

      {infinitePlane &&
        infinitePlane.type === "infinitePlane" && (
          <InfinitePlane
            height={infinitePlane.props.height}
            size={infinitePlane.props.size}
            visible={infinitePlane.props.visible}
          />
        )}
    </>
  );
}