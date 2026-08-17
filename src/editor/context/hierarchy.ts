import {
  SceneObject,
} from "../scene/objectTypes";


/* =========================================
   GET DESCENDANT IDS
========================================= */

export function getDescendantIds(
  objects: SceneObject[],
  rootId: string
): string[] {

  const descendants: string[] = [];


  const visit = (
    parentId: string
  ) => {

    for (
      const object of objects
    ) {

      if (
        object.parentId !==
        parentId
      ) {
        continue;
      }

      descendants.push(
        object.id
      );

      visit(
        object.id
      );
    }
  };


  visit(rootId);


  return descendants;
}