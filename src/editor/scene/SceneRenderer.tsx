import React from "react";

import {
  Scene,
} from "./objectTypes";

import SceneObject from "./SceneObject";


/* =========================================
   TYPES
========================================= */

type SceneRendererProps = {
  scene: Scene;
};


/* =========================================
   SCENE RENDERER
========================================= */

export default function SceneRenderer({
  scene,
}: SceneRendererProps): React.ReactElement {

  /*
   * Only render root objects here.
   *
   * Children are rendered recursively
   * inside SceneObject.
   *
   * If a parentId points to an object that
   * no longer exists, treat the object as
   * a root so it doesn't disappear.
   */

  const roots =
    scene.objects.filter(
      (object) => {

        if (
          object.parentId === undefined
        ) {
          return true;
        }

        return !scene.objects.some(
          (parent) =>
            parent.id ===
            object.parentId
        );
      }
    );


  return (
    <>
      {roots.map(
        (object) => (
          <SceneObject
            key={object.id}
            object={object}
          />
        )
      )}
    </>
  );
}