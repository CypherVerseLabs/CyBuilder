import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Scene,
  SceneObject,
  Transform,
} from "../scene/objectTypes";

import {
  TransformMode,
} from "./transformMode";

import {
  getDescendantIds,
} from "./hierarchy";


/* =========================================
   TYPES
========================================= */

export type SceneObjectUpdate = {
  transform?: Partial<Transform>;

  props?: Record<string, unknown>;

  parentId?: string;

  name?: string;

  visible?: boolean;

  locked?: boolean;
};


/* =========================================
   SCENE FILE
========================================= */

export const SCENE_FILE_FORMAT =
  "cybuilder-scene";

export const SCENE_FILE_VERSION = 1;


type SceneFile = {
  format: string;

  version: number;

  scene: Scene;
};


/* =========================================
   CONTEXT VALUE
========================================= */

type EditorContextValue = {
  scene: Scene;

  selectedId?: string;

  transformMode: TransformMode;

  editorActive: boolean;


  /* HISTORY */

  canUndo: boolean;

  canRedo: boolean;

  undo: () => void;

  redo: () => void;


  /* SELECTION */

  select: (
    id?: string
  ) => void;


  /* TRANSFORM */

  setTransformMode: (
    mode: TransformMode
  ) => void;

  beginTransform: (
    id: string
  ) => void;

  endTransform: () => void;


  /* EDITOR */

  setEditorActive: (
    active: boolean
  ) => void;

  toggleEditor: () => void;


  /* SCENE */

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


  /* HIERARCHY */

  setParent: (
    id: string,
    parentId?: string
  ) => void;


  /* SAVE / LOAD */

  saveScene: () => void;

  loadScene: (
    scene: Scene
  ) => void;
};


/* =========================================
   INITIAL SCENE
========================================= */

const emptyScene: Scene = {
  objects: [],
};


/* =========================================
   HISTORY
========================================= */

const MAX_HISTORY_SIZE = 100;


/* =========================================
   CONTEXT
========================================= */

const EditorContext =
  createContext<
    EditorContextValue | undefined
  >(undefined);


/* =========================================
   PROVIDER
========================================= */

type EditorProviderProps = {
  children: ReactNode;

  initialScene?: Scene;
};


export function EditorProvider({
  children,
  initialScene,
}: EditorProviderProps) {

  const [scene, setScene] =
    useState<Scene>(
      initialScene ?? emptyScene
    );


  const [history, setHistory] =
    useState<Scene[]>([]);

  const [future, setFuture] =
    useState<Scene[]>([]);


  const transformTransaction =
    useRef<{
      id: string;
      scene: Scene;
    } | null>(null);


  const [
    selectedId,
    setSelectedId,
  ] = useState<string>();


  const [
    transformMode,
    setTransformMode,
  ] = useState<TransformMode>(
    "translate"
  );


  const [
    editorActive,
    setEditorActiveState,
  ] = useState(true);


  /* =======================================
     HISTORY HELPER
  ======================================= */

  const pushHistory =
    useCallback(
      (previousScene: Scene) => {

        setHistory(
          (previous) => {

            const next = [
              ...previous,
              previousScene,
            ];

            return next.length >
              MAX_HISTORY_SIZE
              ? next.slice(
                  next.length -
                    MAX_HISTORY_SIZE
                )
              : next;
          }
        );

        setFuture([]);

      },
      []
    );


  /* =======================================
     COMMIT
  ======================================= */

  const commitScene =
    useCallback(
      (
        createNextScene: (
          current: Scene
        ) => Scene
      ) => {

        setScene((current) => {

          const nextScene =
            createNextScene(
              current
            );

          if (
            nextScene === current
          ) {
            return current;
          }

          if (
            transformTransaction.current
          ) {
            return nextScene;
          }

          pushHistory(current);

          return nextScene;
        });

      },
      [pushHistory]
    );


  /* =======================================
     SAVE
  ======================================= */

  const saveScene =
    useCallback(() => {

      const file: SceneFile = {
        format:
          SCENE_FILE_FORMAT,

        version:
          SCENE_FILE_VERSION,

        scene,
      };

      const json =
        JSON.stringify(
          file,
          null,
          2
        );

      const blob =
        new Blob(
          [json],
          {
            type:
              "application/json",
          }
        );

      const url =
        URL.createObjectURL(
          blob
        );

      const anchor =
        document.createElement(
          "a"
        );

      anchor.href = url;

      anchor.download =
        "cybuilder-scene.cybuilder.json";

      document.body.appendChild(
        anchor
      );

      anchor.click();

      document.body.removeChild(
        anchor
      );

      URL.revokeObjectURL(
        url
      );

    }, [scene]);


  /* =======================================
     LOAD
  ======================================= */

  const loadScene =
    useCallback(
      (nextScene: Scene) => {

        transformTransaction.current =
          null;

        setScene(
          structuredClone(nextScene)
        );

        setHistory([]);

        setFuture([]);

        setSelectedId(
          undefined
        );

      },
      []
    );


  /* =======================================
     BEGIN TRANSFORM
  ======================================= */

  const beginTransform =
    useCallback(
      (id: string) => {

        if (
          transformTransaction.current
        ) {
          return;
        }

        const objectExists =
          scene.objects.some(
            (object) =>
              object.id === id
          );

        if (!objectExists) {
          return;
        }

        transformTransaction.current = {
          id,
          scene,
        };

      },
      [scene]
    );


  /* =======================================
     END TRANSFORM
  ======================================= */

  const endTransform =
    useCallback(() => {

      const transaction =
        transformTransaction.current;

      if (!transaction) {
        return;
      }

      transformTransaction.current =
        null;

      setScene((current) => {

        if (
          current ===
          transaction.scene
        ) {
          return current;
        }

        pushHistory(
          transaction.scene
        );

        return current;
      });

    }, [pushHistory]);


  /* =======================================
     UNDO
  ======================================= */

  const undo =
    useCallback(() => {

      if (
        transformTransaction.current
      ) {
        return;
      }

      setHistory((previous) => {

        if (
          previous.length === 0
        ) {
          return previous;
        }

        const previousScene =
          previous[
            previous.length - 1
          ];

        setScene((current) => {

          setFuture(
            (currentFuture) => {

              const next = [
                ...currentFuture,
                current,
              ];

              return next.length >
                MAX_HISTORY_SIZE
                ? next.slice(
                    next.length -
                      MAX_HISTORY_SIZE
                  )
                : next;
            }
          );

          return previousScene;
        });

        return previous.slice(
          0,
          -1
        );

      });

    }, []);


  /* =======================================
     REDO
  ======================================= */

  const redo =
    useCallback(() => {

      if (
        transformTransaction.current
      ) {
        return;
      }

      setFuture((previous) => {

        if (
          previous.length === 0
        ) {
          return previous;
        }

        const nextScene =
          previous[
            previous.length - 1
          ];

        setScene((current) => {

          setHistory(
            (currentHistory) => {

              const next = [
                ...currentHistory,
                current,
              ];

              return next.length >
                MAX_HISTORY_SIZE
                ? next.slice(
                    next.length -
                      MAX_HISTORY_SIZE
                  )
                : next;
            }
          );

          return nextScene;
        });

        return previous.slice(
          0,
          -1
        );

      });

    }, []);


  /* =======================================
     EDITOR
  ======================================= */

  const setEditorActive =
    useCallback(
      (active: boolean) => {
        setEditorActiveState(active);
      },
      []
    );


  const toggleEditor =
    useCallback(() => {
      setEditorActiveState(
        (current) => !current
      );
    }, []);


  /* =======================================
     SELECTION
  ======================================= */

  const select =
    useCallback(
      (id?: string) => {
        setSelectedId(id);
      },
      []
    );


  /* =======================================
     ADD
  ======================================= */

  const addObject =
    useCallback(
      (object: SceneObject) => {

        commitScene(
          (current): Scene => ({
            ...current,

            objects: [
              ...current.objects,
              structuredClone(object),
            ],
          })
        );

      },
      [commitScene]
    );


  /* =======================================
     REMOVE
  ======================================= */

  const removeObject =
    useCallback(
      (id: string) => {

        let removedIds: string[] = [];

        commitScene(
          (current): Scene => {

            const exists =
              current.objects.some(
                (object) =>
                  object.id === id
              );

            if (!exists) {
              return current;
            }

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

          }
        );

        setSelectedId(
          (current) =>
            current &&
            removedIds.includes(current)
              ? undefined
              : current
        );

      },
      [commitScene]
    );


  /* =======================================
     DUPLICATE
  ======================================= */

  const duplicateObject =
    useCallback(
      (id: string) => {

        let duplicatedId:
          | string
          | undefined;

        commitScene(
          (current): Scene => {

            const original =
              current.objects.find(
                (object) =>
                  object.id === id
              );

            if (!original) {
              return current;
            }

            let newId: string;

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

            duplicatedId =
              newId;

            const duplicate =
              structuredClone(
                original
              );

            duplicate.id =
              newId;

            duplicate.transform = {
              ...duplicate.transform,

              position: [
                duplicate.transform.position[0] +
                  0.75,

                duplicate.transform.position[1],

                duplicate.transform.position[2],
              ],
            };

            return {
              ...current,

              objects: [
                ...current.objects,
                duplicate,
              ],
            };

          }
        );

        if (duplicatedId) {
          setSelectedId(
            duplicatedId
          );
        }

      },
      [commitScene]
    );


  /* =======================================
     UPDATE OBJECT
  ======================================= */

  const updateObject =
    useCallback(
      (
        id: string,
        changes: SceneObjectUpdate
      ) => {

        commitScene(
          (current): Scene => {

            const object =
              current.objects.find(
                (item) =>
                  item.id === id
              );

            if (!object) {
              return current;
            }

            const objects =
              current.objects.map(
                (item): SceneObject => {

                  if (
                    item.id !== id
                  ) {
                    return item;
                  }

                  const updated = {
                    ...item,

                    transform:
                      changes.transform !==
                      undefined
                        ? {
                            ...item.transform,
                            ...changes.transform,
                          }
                        : item.transform,

                    props:
                      changes.props !==
                      undefined
                        ? {
                            ...item.props,
                            ...changes.props,
                          }
                        : item.props,

                    parentId:
                      Object.prototype.hasOwnProperty.call(
                        changes,
                        "parentId"
                      )
                        ? changes.parentId
                        : item.parentId,

                    name:
                      Object.prototype.hasOwnProperty.call(
                        changes,
                        "name"
                      )
                        ? changes.name
                        : item.name,

                    visible:
                      Object.prototype.hasOwnProperty.call(
                        changes,
                        "visible"
                      )
                        ? changes.visible
                        : item.visible,

                    locked:
                      Object.prototype.hasOwnProperty.call(
                        changes,
                        "locked"
                      )
                        ? changes.locked
                        : item.locked,
                  };

                  return updated as SceneObject;
                }
              );

            return {
              ...current,
              objects,
            };

          }
        );

      },
      [commitScene]
    );


  /* =======================================
     UPDATE TRANSFORM
  ======================================= */

  const updateTransform =
    useCallback(
      (
        id: string,
        changes: Partial<Transform>
      ) => {

        commitScene(
          (current): Scene => {

            const exists =
              current.objects.some(
                (item) =>
                  item.id === id
              );

            if (!exists) {
              return current;
            }

            return {
              ...current,

              objects:
                current.objects.map(
                  (item) =>
                    item.id === id
                      ? ({
                          ...item,

                          transform: {
                            ...item.transform,
                            ...changes,
                          },
                        } as SceneObject)
                      : item
                ),
            };

          }
        );

      },
      [commitScene]
    );


  /* =======================================
     SET PARENT
  ======================================= */

  const setParent =
    useCallback(
      (
        id: string,
        parentId?: string
      ) => {

        commitScene(
          (current): Scene => {

            const object =
              current.objects.find(
                (item) =>
                  item.id === id
              );

            if (!object) {
              return current;
            }


            /* REMOVE PARENT */

            if (
              parentId === undefined
            ) {

              if (
                object.parentId ===
                undefined
              ) {
                return current;
              }

              return {
                ...current,

                objects:
                  current.objects.map(
                    (item) =>
                      item.id === id
                        ? ({
                            ...item,
                            parentId:
                              undefined,
                          } as SceneObject)
                        : item
                  ),
              };
            }


            /* SELF */

            if (
              parentId === id
            ) {
              return current;
            }


            /* PARENT EXISTS */

            const parent =
              current.objects.find(
                (item) =>
                  item.id === parentId
              );

            if (!parent) {
              return current;
            }


            /* CIRCULAR */

            const descendants =
              getDescendantIds(
                current.objects,
                id
              );

            if (
              descendants.includes(
                parentId
              )
            ) {
              return current;
            }


            /* ALREADY PARENTED */

            if (
              object.parentId ===
              parentId
            ) {
              return current;
            }


            return {
              ...current,

              objects:
                current.objects.map(
                  (item) =>
                    item.id === id
                      ? ({
                          ...item,
                          parentId,
                        } as SceneObject)
                      : item
                ),
            };

          }
        );

      },
      [commitScene]
    );


  /* =======================================
     CONTEXT VALUE
  ======================================= */

  const value =
    useMemo<EditorContextValue>(
      () => ({

        scene,

        selectedId,

        transformMode,

        editorActive,


        canUndo:
          history.length > 0,

        canRedo:
          future.length > 0,

        undo,

        redo,


        select,


        setTransformMode,

        beginTransform,

        endTransform,


        setEditorActive,

        toggleEditor,


        addObject,

        removeObject,

        duplicateObject,

        updateObject,

        updateTransform,


        setParent,


        saveScene,

        loadScene,

      }),
      [
        scene,
        selectedId,
        transformMode,
        editorActive,
        history.length,
        future.length,
        undo,
        redo,
        select,
        setTransformMode,
        beginTransform,
        endTransform,
        setEditorActive,
        toggleEditor,
        addObject,
        removeObject,
        duplicateObject,
        updateObject,
        updateTransform,
        setParent,
        saveScene,
        loadScene,
      ]
    );


  return (
    <EditorContext.Provider
      value={value}
    >
      {children}
    </EditorContext.Provider>
  );
}


/* =========================================
   USE EDITOR
========================================= */

export function useEditor() {

  const context =
    useContext(
      EditorContext
    );

  if (!context) {
    throw new Error(
      "useEditor must be used inside an EditorProvider"
    );
  }

  return context;
}