import {
  Scene,
  SceneObject,
  cloneSceneObject,
} from "../scene/objectTypes";

import {
  getDescendantIds,
} from "./hierarchy";


/* =========================================
   TYPES
========================================= */

export type CommitScene = (
  createNextScene: (
    current: Scene
  ) => Scene
) => void;


/* =========================================
   ADD OBJECT
========================================= */

export function addSceneObject(
  commitScene: CommitScene,
  object: SceneObject
) {
  commitScene((current) => ({
    ...current,

    objects: [
      ...current.objects,
      object,
    ],
  }));
}


/* =========================================
   REMOVE OBJECT
========================================= */

export function removeSceneObject(
  commitScene: CommitScene,
  id: string
): string[] {

  let removedIds: string[] = [];

  commitScene((current) => {

    const exists =
      current.objects.some(
        (object) =>
          object.id === id
      );

    if (!exists) {
      return current;
    }

    /*
     * Remove the selected object
     * and all descendants.
     */

    removedIds = [
      id,
      ...getDescendantIds(
        current.objects,
        id
      ),
    ];

    return {
      ...current,

      objects:
        current.objects.filter(
          (object) =>
            !removedIds.includes(
              object.id
            )
        ),
    };
  });

  return removedIds;
}


/* =========================================
   DUPLICATE OBJECT
========================================= */

export function duplicateSceneObject(
  commitScene: CommitScene,
  id: string
): string | undefined {

  let duplicatedId:
    | string
    | undefined;

  commitScene((current) => {

    const original =
      current.objects.find(
        (object) =>
          object.id === id
      );

    if (!original) {
      return current;
    }

    /*
     * Generate a unique ID.
     */

    let newId = "";

    do {
      newId =
        `${original.type}-${Math.random()
          .toString(36)
          .slice(2, 10)}`;
    } while (
      current.objects.some(
        (object) =>
          object.id === newId
      )
    );

    duplicatedId = newId;

    /*
     * Use the type-safe clone helper.
     */

    const duplicate =
      cloneSceneObject(
        original,
        newId
      );

    /*
     * Preserve hierarchy.
     */

    duplicate.parentId =
      original.parentId;

    /*
     * Offset duplicate.
     */

    duplicate.transform.position = [
      original.transform.position[0] + 0.75,
      original.transform.position[1],
      original.transform.position[2],
    ];

    return {
      ...current,

      objects: [
        ...current.objects,
        duplicate,
      ],
    };
  });

  return duplicatedId;
}


/* =========================================
   UPDATE OBJECT
========================================= */

export function updateSceneObject(
  commitScene: CommitScene,
  id: string,
  changes: {
    transform?: Partial<SceneObject["transform"]>;

    props?: Record<
      string,
      unknown
    >;

    parentId?: string;

    visible?: boolean;

    locked?: boolean;

    name?: string;
  }
) {

  commitScene((current) => {

    const object =
      current.objects.find(
        (item) =>
          item.id === id
      );

    if (!object) {
      return current;
    }

    /*
     * Preserve the existing
     * discriminated SceneObject.
     */

    const nextObject = {
      ...object,

      ...changes,

      transform:
        changes.transform
          ? {
              ...object.transform,
              ...changes.transform,
            }
          : object.transform,

      props:
        changes.props
          ? {
              ...object.props,
              ...changes.props,
            }
          : object.props,

    } as SceneObject;

    return {
      ...current,

      objects:
        current.objects.map(
          (item) =>
            item.id === id
              ? nextObject
              : item
        ),
    };
  });
}


/* =========================================
   UPDATE TRANSFORM
========================================= */

export function updateSceneTransform(
  commitScene: CommitScene,
  id: string,
  changes: Partial<
    SceneObject["transform"]
  >
) {

  commitScene((current) => {

    const object =
      current.objects.find(
        (item) =>
          item.id === id
      );

    if (!object) {
      return current;
    }

    return {
      ...current,

      objects:
        current.objects.map(
          (item) =>
            item.id === id
              ? {
                  ...item,

                  transform: {
                    ...item.transform,
                    ...changes,
                  },
                }
              : item
        ),
    };
  });
}