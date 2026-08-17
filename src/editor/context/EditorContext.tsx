import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import JSZip from "jszip";

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

import {
  LocalAsset,
  createAssetId,
  createAssetObjectUrl,
  sanitizeAssetFileName,
} from "./AssetManager";


/* =========================================
   TYPES
========================================= */

type SceneObjectUpdate = {
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

export const SCENE_FILE_VERSION =
  2;


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


  /* =======================================
     ASSETS
  ======================================= */

  assets: LocalAsset[];

  addAsset: (
    file: File
  ) => string;

  removeAsset: (
    id: string
  ) => void;


  /* =======================================
     UNDO / REDO
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


  /* =======================================
     SAVE / LOAD
  ======================================= */

  saveScene: () => Promise<void>;

  loadScene: (
    file: File
  ) => Promise<void>;
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
   PROVIDER PROPS
========================================= */

type EditorProviderProps = {
  children: ReactNode;

  initialScene?: Scene;
};


/* =========================================
   DEEP SCENE CLONE
========================================= */

function cloneScene(
  scene: Scene
): Scene {

  return structuredClone(
    scene
  );
}


/* =========================================
   REWRITE LOCAL ASSETS FOR SAVE
========================================= */

function rewriteSceneForSave(
  scene: Scene,
  assets: LocalAsset[]
): Scene {

  const assetByUrl =
    new Map<string, LocalAsset>();

  for (
    const asset of assets
  ) {
    assetByUrl.set(
      asset.objectUrl,
      asset
    );
  }

  const cloned =
    cloneScene(
      scene
    );

  const usedNames =
    new Map<string, number>();

  for (
    const object of cloned.objects
  ) {

    const props =
      object.props as Record<
        string,
        unknown
      >;

    for (
      const key of Object.keys(
        props
      )
    ) {

      const value =
        props[key];

      if (
        typeof value !== "string"
      ) {
        continue;
      }

      const asset =
        assetByUrl.get(
          value
        );

      if (!asset) {
        continue;
      }

      const safeName =
        sanitizeAssetFileName(
          asset.name
        );

      const count =
        usedNames.get(
          safeName
        ) ?? 0;

      usedNames.set(
        safeName,
        count + 1
      );

      const finalName =
        count === 0
          ? safeName
          : `${count}-${safeName}`;

      props[key] =
        `assets/${finalName}`;
    }
  }

  return cloned;
}


/* =========================================
   PROVIDER
========================================= */

export function EditorProvider({
  children,
  initialScene,
}: EditorProviderProps) {

  /* =======================================
     SCENE
  ======================================= */

  const [scene, setScene] =
    useState<Scene>(
      initialScene ?? emptyScene
    );


  /* =======================================
     HISTORY
  ======================================= */

  const [history, setHistory] =
    useState<Scene[]>([]);

  const [future, setFuture] =
    useState<Scene[]>([]);


  /* =======================================
     ASSETS
  ======================================= */

  const [
    assets,
    setAssets,
  ] = useState<LocalAsset[]>([]);


  /* =======================================
     ASSET REF
  ======================================= */

  const assetsRef =
    useRef<LocalAsset[]>([]);

  assetsRef.current =
    assets;


  /* =======================================
     TRANSFORM TRANSACTION
  ======================================= */

  const transformTransaction =
    useRef<{
      id: string;

      scene: Scene;
    } | null>(null);


  /* =======================================
     SELECTION
  ======================================= */

  const [
    selectedId,
    setSelectedId,
  ] = useState<string>();


  /* =======================================
     TRANSFORM MODE
  ======================================= */

  const [
    transformMode,
    setTransformMode,
  ] = useState<TransformMode>(
    "translate"
  );


  /* =======================================
     EDITOR ACTIVE
  ======================================= */

  const [
    editorActive,
    setEditorActiveState,
  ] = useState(true);


  /* =======================================
     ADD ASSET
  ======================================= */

  const addAsset =
    useCallback(
      (
        file: File
      ): string => {

        const id =
          createAssetId();

        const objectUrl =
          createAssetObjectUrl(
            file
          );

        const asset: LocalAsset = {
          id,

          name:
            file.name,

          type:
            file.type ||
            "application/octet-stream",

          file,

          objectUrl,
        };

        setAssets(
          (current) => [
            ...current,
            asset,
          ]
        );

        return objectUrl;
      },
      []
    );


  /* =======================================
     REMOVE ASSET
  ======================================= */

  const removeAsset =
    useCallback(
      (id: string) => {

        setAssets(
          (current) => {

            const asset =
              current.find(
                (item) =>
                  item.id === id
              );

            if (asset) {

              URL.revokeObjectURL(
                asset.objectUrl
              );
            }

            return current.filter(
              (item) =>
                item.id !== id
            );
          }
        );

      },
      []
    );


  /* =======================================
     HISTORY HELPER
  ======================================= */

  const pushHistory =
    useCallback(
      (
        previousScene: Scene
      ) => {

        setHistory(
          (previous) => {

            const nextHistory = [
              ...previous,
              previousScene,
            ];

            if (
              nextHistory.length >
              MAX_HISTORY_SIZE
            ) {
              return nextHistory.slice(
                nextHistory.length -
                  MAX_HISTORY_SIZE
              );
            }

            return nextHistory;
          }
        );

        setFuture([]);
      },
      []
    );


  /* =======================================
     COMMIT SCENE
  ======================================= */

  const commitScene =
    useCallback(
      (
        createNextScene: (
          current: Scene
        ) => Scene
      ) => {

        setScene(
          (current) => {

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

            pushHistory(
              cloneScene(
                current
              )
            );

            return nextScene;
          }
        );
      },
      [pushHistory]
    );


  /* =======================================
     SAVE SCENE
  ======================================= */

  const saveScene =
    useCallback(
      async () => {

        const zip =
          new JSZip();


        /* ---------------------------------
           SCENE
        --------------------------------- */

        const sceneForSave =
          rewriteSceneForSave(
            scene,
            assetsRef.current
          );


        const file: SceneFile = {
          format:
            SCENE_FILE_FORMAT,

          version:
            SCENE_FILE_VERSION,

          scene:
            sceneForSave,
        };


        zip.file(
          "scene.json",
          JSON.stringify(
            file,
            null,
            2
          )
        );


        /* ---------------------------------
           ASSETS
        --------------------------------- */

        const usedNames =
          new Set<string>();


        for (
          const asset of assetsRef.current
        ) {

          const safeName =
            sanitizeAssetFileName(
              asset.name
            );

          let fileName =
            safeName;

          let counter = 1;

          while (
            usedNames.has(
              fileName
            )
          ) {

            fileName =
              `${counter}-${safeName}`;

            counter++;
          }

          usedNames.add(
            fileName
          );

          zip.file(
            `assets/${fileName}`,
            asset.file
          );
        }


        /* ---------------------------------
           ZIP
        --------------------------------- */

        const blob =
          await zip.generateAsync({
            type: "blob",
          });


        const url =
          URL.createObjectURL(
            blob
          );


        const anchor =
          document.createElement(
            "a"
          );

        anchor.href =
          url;

        anchor.download =
          "cybuilder-project.cybuilder";

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

      },
      [scene]
    );


  /* =======================================
     LOAD SCENE
  ======================================= */

  const loadScene =
    useCallback(
      async (
        projectFile: File
      ) => {

        const zip =
          await JSZip.loadAsync(
            projectFile
          );


        const sceneEntry =
          zip.file(
            "scene.json"
          );


        if (!sceneEntry) {

          throw new Error(
            "Invalid CyBuilder project: scene.json is missing."
          );
        }


        const text =
          await sceneEntry.async(
            "text"
          );


        const parsed =
          JSON.parse(
            text
          ) as Partial<SceneFile>;


        if (
          parsed.format !==
          SCENE_FILE_FORMAT
        ) {

          throw new Error(
            "This is not a CyBuilder project."
          );
        }


        if (
          parsed.version !== 2
        ) {

          throw new Error(
            `Unsupported CyBuilder project version: ${String(
              parsed.version
            )}`
          );
        }


        if (
          !parsed.scene ||
          !Array.isArray(
            parsed.scene.objects
          )
        ) {

          throw new Error(
            "Invalid scene data."
          );
        }


        const loadedScene =
          parsed.scene;


        /* ---------------------------------
           RELEASE OLD ASSETS
        --------------------------------- */

        for (
          const asset of assetsRef.current
        ) {

          URL.revokeObjectURL(
            asset.objectUrl
          );
        }


        /* ---------------------------------
           LOAD ASSETS
        --------------------------------- */

        const loadedAssets:
          LocalAsset[] = [];


        const assetEntries =
          Object.keys(
            zip.files
          ).filter(
            (name) =>
              name.startsWith(
                "assets/"
              ) &&
              !zip.files[name].dir
          );


        for (
          const path of assetEntries
        ) {

          const entry =
            zip.files[path];


          const blob =
            await entry.async(
              "blob"
            );


          const fileName =
            path.slice(
              "assets/".length
            );


          const file =
            new File(
              [
                blob,
              ],
              fileName,
              {
                type:
                  blob.type ||
                  "application/octet-stream",
              }
            );


          const objectUrl =
            URL.createObjectURL(
              file
            );


          loadedAssets.push({
            id:
              createAssetId(),

            name:
              fileName,

            type:
              file.type,

            file,

            objectUrl,
          });
        }


        /* ---------------------------------
           REWRITE ASSET PATHS
        --------------------------------- */

        const assetByPath =
          new Map<
            string,
            LocalAsset
          >();


        for (
          const asset of loadedAssets
        ) {

          assetByPath.set(
            `assets/${asset.name}`,
            asset
          );
        }


        const restoredScene =
          cloneScene(
            loadedScene
          );


        for (
          const object of
            restoredScene.objects
        ) {

          const props =
            object.props as Record<
              string,
              unknown
            >;


          for (
            const key of Object.keys(
              props
            )
          ) {

            const value =
              props[key];


            if (
              typeof value !==
              "string"
            ) {
              continue;
            }


            const asset =
              assetByPath.get(
                value
              );


            if (!asset) {
              continue;
            }


            props[key] =
              asset.objectUrl;
          }
        }


        /* ---------------------------------
           COMMIT
        --------------------------------- */

        transformTransaction.current =
          null;


        setScene(
          restoredScene
        );


        setAssets(
          loadedAssets
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

        transformTransaction.current = {
          id,

          scene:
            cloneScene(
              scene
            ),
        };

      },
      [scene]
    );


  /* =======================================
     END TRANSFORM
  ======================================= */

  const endTransform =
    useCallback(
      () => {

        const transaction =
          transformTransaction.current;

        if (!transaction) {
          return;
        }

        transformTransaction.current =
          null;


        setScene(
          (current) => {

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
          }
        );

      },
      [pushHistory]
    );


  /* =======================================
     UNDO
  ======================================= */

  const undo =
    useCallback(
      () => {

        if (
          transformTransaction.current
        ) {
          return;
        }

        setHistory(
          (previous) => {

            if (
              previous.length === 0
            ) {
              return previous;
            }


            const previousScene =
              previous[
                previous.length - 1
              ];


            setScene(
              (current) => {

                setFuture(
                  (currentFuture) => {

                    const nextFuture = [
                      ...currentFuture,
                      cloneScene(
                        current
                      ),
                    ];


                    if (
                      nextFuture.length >
                      MAX_HISTORY_SIZE
                    ) {

                      return nextFuture.slice(
                        nextFuture.length -
                          MAX_HISTORY_SIZE
                      );
                    }


                    return nextFuture;
                  }
                );


                return previousScene;
              }
            );


            return previous.slice(
              0,
              -1
            );
          }
        );

      },
      []
    );


  /* =======================================
     REDO
  ======================================= */

  const redo =
    useCallback(
      () => {

        if (
          transformTransaction.current
        ) {
          return;
        }

        setFuture(
          (previous) => {

            if (
              previous.length === 0
            ) {
              return previous;
            }


            const nextScene =
              previous[
                previous.length - 1
              ];


            setScene(
              (current) => {

                setHistory(
                  (currentHistory) => {

                    const nextHistory = [
                      ...currentHistory,
                      cloneScene(
                        current
                      ),
                    ];


                    if (
                      nextHistory.length >
                      MAX_HISTORY_SIZE
                    ) {

                      return nextHistory.slice(
                        nextHistory.length -
                          MAX_HISTORY_SIZE
                      );
                    }


                    return nextHistory;
                  }
                );


                return nextScene;
              }
            );


            return previous.slice(
              0,
              -1
            );
          }
        );

      },
      []
    );


  /* =======================================
     EDITOR
  ======================================= */

  const setEditorActive =
    useCallback(
      (
        active: boolean
      ) => {

        setEditorActiveState(
          active
        );
      },
      []
    );


  const toggleEditor =
    useCallback(
      () => {

        setEditorActiveState(
          (current) =>
            !current
        );

      },
      []
    );


  /* =======================================
     SELECT
  ======================================= */

  const select =
    useCallback(
      (
        id?: string
      ) => {

        setSelectedId(
          id
        );

      },
      []
    );


  /* =======================================
     ADD OBJECT
  ======================================= */

  const addObject =
    useCallback(
      (
        object: SceneObject
      ) => {

        commitScene(
          (current) => ({

            ...current,

            objects: [
              ...current.objects,
              object,
            ],

          })
        );

      },
      [commitScene]
    );


  /* =======================================
     REMOVE OBJECT
  ======================================= */

  const removeObject =
    useCallback(
      (
        id: string
      ) => {

        let removedIds:
          string[] = [];


        commitScene(
          (current) => {

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
          (current) => {

            if (
              current &&
              removedIds.includes(
                current
              )
            ) {

              return undefined;
            }

            return current;
          }
        );

      },
      [commitScene]
    );


  /* =======================================
     DUPLICATE
  ======================================= */

  const duplicateObject =
    useCallback(
      (
        id: string
      ) => {

        let duplicatedId:
          | string
          | undefined;


        commitScene(
          (current) => {

            const original =
              current.objects.find(
                (object) =>
                  object.id === id
              );


            if (!original) {
              return current;
            }


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


            duplicatedId =
              newId;


            const duplicate:
              SceneObject = {

              ...structuredClone(
                original
              ),

              id:
                newId,

              parentId:
                original.parentId,

              transform: {

                ...original.transform,

                position: [

                  original.transform
                    .position[0] + 0.75,

                  original.transform
                    .position[1],

                  original.transform
                    .position[2],

                ],
              },

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


        if (
          duplicatedId
        ) {

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
          (current) => {

            const object =
              current.objects.find(
                (item) =>
                  item.id === id
              );


            if (!object) {
              return current;
            }


            const objects:
              SceneObject[] =
              current.objects.map(
                (item) => {

                  if (
                    item.id !== id
                  ) {
                    return item;
                  }


                  return {
                    ...item,

                    transform:
                      changes.transform
                        ? {
                            ...item.transform,
                            ...changes.transform,
                          }
                        : item.transform,

                    props:
                      changes.props
                        ? {
                            ...item.props,
                            ...changes.props,
                          }
                        : item.props,

                    parentId:
                      changes.parentId ??
                      item.parentId,

                    name:
                      changes.name ??
                      item.name,

                    visible:
                      changes.visible ??
                      item.visible,

                    locked:
                      changes.locked ??
                      item.locked,

                  } as SceneObject;
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
          (current) => {

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
                  (item) => {

                    if (
                      item.id !== id
                    ) {
                      return item;
                    }


                    return {

                      ...item,

                      transform: {
                        ...item.transform,
                        ...changes,
                      },

                    } as SceneObject;
                  }
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
          (current) => {

            const object =
              current.objects.find(
                (item) =>
                  item.id === id
              );


            if (!object) {
              return current;
            }


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


            if (
              parentId === id
            ) {
              return current;
            }


            const parent =
              current.objects.find(
                (item) =>
                  item.id === parentId
              );


            if (!parent) {
              return current;
            }


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


        /* ASSETS */

        assets,

        addAsset,

        removeAsset,


        /* HISTORY */

        canUndo:
          history.length > 0,

        canRedo:
          future.length > 0,

        undo,

        redo,


        /* SELECTION */

        select,


        /* TRANSFORM */

        setTransformMode,

        beginTransform,

        endTransform,


        /* EDITOR */

        setEditorActive,

        toggleEditor,


        /* SCENE */

        addObject,

        removeObject,

        duplicateObject,

        updateObject,

        updateTransform,


        /* HIERARCHY */

        setParent,


        /* SAVE / LOAD */

        saveScene,

        loadScene,

      }),
      [

        scene,

        selectedId,

        transformMode,

        editorActive,

        assets,

        history,

        future,

        addAsset,

        removeAsset,

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