import { Image, useLimiter } from "cyengine";
import * as THREE from "three";
import { Group, Mesh, Vector3 } from "three";
import { useMemo, useRef, useState } from "react";
import { animated, useSpring } from "@react-spring/three";
import { GroupProps, useFrame } from "@react-three/fiber";

export type ProximityPictureProps = {
  image?: string;
  framed?: boolean;
  frameColor?: THREE.ColorRepresentation;
  radius?: number;
} & GroupProps;

export default function ProximityPicture(
  props: ProximityPictureProps
) {
  const {
    image = "https://d27rt3a60hh1lx.cloudfront.net/images/turtle.jpg",
    framed = false,
    frameColor = "#111111",
    radius = 2,
    ...rest
  } = props;

  const RADIUS = Math.max(
    radius,
    0.5
  );

  const ref =
    useRef<Group>(null);

  const circleRef =
    useRef<Mesh>(null);

  const [visible, setVisible] =
    useState(false);

  const { scale } = useSpring({
    scale: visible ? 1 : 0,
  });

  const dummy = useMemo(
    () => new Vector3(),
    []
  );

  const frameMat =
    new THREE.MeshBasicMaterial({
      color: frameColor,
    });

  const limiter =
    useLimiter(20);

  useFrame(
    ({ camera, clock }) => {
      if (
        !limiter.isReady(clock) ||
        !ref.current
      ) {
        return;
      }

      if (circleRef.current) {
        circleRef.current.scale.setScalar(
          1 / ref.current.scale.x
        );
      }

      ref.current.getWorldPosition(
        dummy
      );

      const dist = Math.max(
        dummy.distanceTo(
          camera.position
        ),
        0.25
      );

      if (dist < RADIUS) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    }
  );

  /*
   * React Spring's inferred animated
   * scale type becomes excessively deep
   * with the versions used by this project.
   *
   * Keep the runtime behavior unchanged,
   * but explicitly provide the animated
   * value to the Three group.
   */
  const AnimatedGroup =
    animated.group as any;

  return (
    <group
      name="proximity-picture"
      ref={ref}
      {...rest}
    >
      <AnimatedGroup scale={scale}>
        <Image
          src={image}
          framed={framed}
          frameMaterial={frameMat}
        />
      </AnimatedGroup>
    </group>
  );
}