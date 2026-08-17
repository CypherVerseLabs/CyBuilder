import {
  Scene,
  SceneObject,
  Transform,
} from "../scene/objectTypes";

import {
  TransformMode,
} from "./transformMode";


/* =========================================
   OBJECT UPDATE
========================================= */

export type SceneObjectUpdate = {
  type?: SceneObject["type"];

  transform?: Partial<Transform>;

  parentId?: string;
};


/* =========================================
   CONTEXT VALUE
========================================= */

export type EditorContextValue = {
  scene: Scene;

  selectedId?: string;

  transformMode: TransformMode;

  editorActive: boolean;


  /* =======================================
     HISTORY
  ======================================= */

  canUndo: boolean;

  canRedo: boolean;

  undo: () => void;

  redo: () => void;


  /* =======================================
     SELECTION
  ======================================= */

  select: (
    id?: string
  ) => void;


  /* =======================================
     TRANSFORM
  ======================================= */

  setTransformMode: (
    mode: TransformMode
  ) => void;

  beginTransform: (
    id: string
  ) => void;

  endTransform: () => void;


  /* =======================================
     EDITOR
  ======================================= */

  setEditorActive: (
    active: boolean
  ) => void;

  toggleEditor: () => void;


  /* =======================================
     SCENE
  ======================================= */

  addObject: (
    object: SceneObject
  ) => void;

  removeObject: (
    id: string
  ) => void;

  duplicateObject: (
    id: string
  ) => void;

  updateObject: (
    id: string,
    changes: SceneObjectUpdate
  ) => void;

  updateTransform: (
    id: string,
    transform: Partial<Transform>
  ) => void;


  /* =======================================
     HIERARCHY
  ======================================= */

  setParent: (
    id: string,
    parentId?: string
  ) => void;
};