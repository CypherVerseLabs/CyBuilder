import { Html } from "@react-three/drei";

import {
  CSSProperties,
  ReactNode,
  ChangeEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { useEditor } from "../context/EditorContext";

import {
  createSceneObject,
  getIdeaCategories,
  getIdeasByCategory,
  getIdeaDefinition,
} from "../ideas";

import {
  Scene,
  SceneObject,
} from "../scene/objectTypes";

import PropertyEditor from "./PropertyEditor";

import SceneHierarchy from "../scene/SceneHierarchy";



/* =========================================
   CLONE SCENE OBJECT
========================================= */

function cloneSceneObject(
  object: SceneObject
): SceneObject {

  const cloned =
    structuredClone(object);

  cloned.id =
    `${cloned.type}-${Math.random()
      .toString(36)
      .slice(2, 10)}`;

  cloned.transform.position = [
    cloned.transform.position[0] + 0.75,
    cloned.transform.position[1],
    cloned.transform.position[2],
  ];

  return cloned;
}







/* =========================================
   EDITOR UI
========================================= */

export default function EditorUI() {

  /* =========================================
     PANEL STATE
  ========================================= */

  const [
    leftPanelCollapsed,
    setLeftPanelCollapsed,
  ] = useState(false);


  /* =========================================
     CLIPBOARD
  ========================================= */

  const [
    clipboardObject,
    setClipboardObject,
  ] = useState<SceneObject>();


  /* =========================================
     IDEA FOLDERS
  ========================================= */

  const [
    openIdeaFolders,
    setOpenIdeaFolders,
  ] = useState<Record<string, boolean>>({
    Media: true,
    Environment: true,
  });


  /* =========================================
     FILE INPUT
  ========================================= */

  const fileInputRef =
    useRef<HTMLInputElement>(null);


  /* =========================================
     EDITOR
  ========================================= */

  const {
    scene,

    selectedId,

    select,


    /* HISTORY */

    canUndo,
    canRedo,

    undo,
    redo,


    /* SCENE */

    addObject,
    removeObject,
    duplicateObject,

    updateObject,
    updateTransform,


    /* TRANSFORM */

    transformMode,
    setTransformMode,


    /* EDITOR */

    editorActive,
    toggleEditor,


    /* SAVE / LOAD */

    saveScene,
    loadScene,

  } = useEditor();


  /* =========================================
     KEYBOARD SHORTCUTS
  ========================================= */

  useEffect(() => {

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {

      const target =
        event.target as HTMLElement | null;


      const tagName =
        target?.tagName?.toLowerCase();


      /*
       * Never run editor shortcuts while
       * the user is typing into a control.
       */

      const isTyping =
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select" ||
        target?.isContentEditable;


      if (isTyping) {
        return;
      }


      /* -------------------------------------
         UNDO
      ------------------------------------- */

      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "z" &&
        !event.shiftKey
      ) {

        event.preventDefault();
        event.stopPropagation();

        undo();

        return;
      }


      /* -------------------------------------
         REDO
      ------------------------------------- */

      if (
        (event.ctrlKey || event.metaKey) &&
        (
          (
            event.key.toLowerCase() === "z" &&
            event.shiftKey
          ) ||
          event.key.toLowerCase() === "y"
        )
      ) {

        event.preventDefault();
        event.stopPropagation();

        redo();

        return;
      }


      /* -------------------------------------
         COPY
      ------------------------------------- */

      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "c"
      ) {

        if (!selectedId) {
          return;
        }

        const object =
          scene.objects.find(
            (item) =>
              item.id === selectedId
          );

        if (!object) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();

        setClipboardObject(
          structuredClone(object)
        );

        return;
      }


      /* -------------------------------------
         PASTE
      ------------------------------------- */

      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "v"
      ) {

        if (!clipboardObject) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();

        let pastedObject =
          cloneSceneObject(
            clipboardObject
          );

        while (
          scene.objects.some(
            (object) =>
              object.id ===
              pastedObject.id
          )
        ) {

          pastedObject =
            cloneSceneObject(
              clipboardObject
            );
        }

        addObject(
          pastedObject
        );

        select(
          pastedObject.id
        );

        return;
      }


      /* -------------------------------------
         DUPLICATE
      ------------------------------------- */

      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "d"
      ) {

        if (!selectedId) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();

        duplicateObject(
          selectedId
        );

        return;
      }


      /* -------------------------------------
         DELETE
      ------------------------------------- */

      if (
        event.key === "Delete" ||
        event.key === "Backspace"
      ) {

        if (!selectedId) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();

        removeObject(
          selectedId
        );

        return;
      }


      /* -------------------------------------
         DESELECT
      ------------------------------------- */

      if (
        event.key === "Escape"
      ) {

        event.preventDefault();

        select(
          undefined
        );

        return;
      }


      /* -------------------------------------
         TOGGLE EDITOR
      ------------------------------------- */

      if (
        event.key.toLowerCase() === "e"
      ) {

        event.preventDefault();

        toggleEditor();

        return;
      }

    };


    window.addEventListener(
      "keydown",
      handleKeyDown
    );


    return () => {

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

    };

  }, [
    scene,
    selectedId,
    clipboardObject,
    addObject,
    duplicateObject,
    removeObject,
    select,
    toggleEditor,
    undo,
    redo,
  ]);


  /* =========================================
     LOAD FILE
  ========================================= */

  const handleLoadFile = async (
  event: ChangeEvent<HTMLInputElement>
) => {

  const file =
    event.target.files?.[0];

  if (!file) {
    return;
  }

  try {

    await loadScene(
      file
    );

  } catch (error) {

    console.error(
      "Failed to load CyBuilder project:",
      error
    );

    window.alert(
      error instanceof Error
        ? error.message
        : "Failed to load CyBuilder project."
    );

  } finally {

    event.target.value = "";
  }
};

  /* =========================================
     SELECTED OBJECT
  ========================================= */

  const selectedObject =
    scene.objects.find(
      (object) =>
        object.id === selectedId
    );


  /* =========================================
     SELECTED IDEA DEFINITION
  ========================================= */

  const selectedDefinition =
    selectedObject
      ? getIdeaDefinition(
          selectedObject.type
        )
      : undefined;


  /* =========================================
     ADD IDEA
  ========================================= */

  const addIdea = (
    type: SceneObject["type"]
  ) => {

    const object =
      createSceneObject(
        type
      );


    addObject(
      object
    );


    select(
      object.id
    );
  };


  /* =========================================
     TOGGLE IDEA FOLDER
  ========================================= */

  const toggleIdeaFolder = (
    category: string
  ) => {

    setOpenIdeaFolders(
      (current) => ({
        ...current,

        [category]:
          !current[category],
      })
    );
  };


  /* =========================================
     EDITOR OFF
  ========================================= */

  if (!editorActive) {
    return null;
  }


  /* =========================================
     RENDER
  ========================================= */

  return (
    <Html
      fullscreen
      zIndexRange={[100, 0]}
      style={{
        pointerEvents: "none",
      }}
    >

      <div
        style={{
          position: "absolute",
          inset: 0,

          display: "flex",

          justifyContent:
            "space-between",

          pointerEvents: "none",

          fontFamily:
            "Inter, ui-sans-serif, system-ui, sans-serif",

          color: "#ffffff",
        }}
      >

        {/* =====================================
            LEFT PANEL
        ====================================== */}

        <div
          style={{
            width:
              leftPanelCollapsed
                ? 42
                : 240,

            height:
              "calc(100vh - 32px)",

            margin: 16,

            padding:
              leftPanelCollapsed
                ? 6
                : 12,

            boxSizing:
              "border-box",

            borderRadius: 12,

            background:
              "rgba(18, 18, 22, 0.94)",

            border:
              "1px solid rgba(255,255,255,0.1)",

            boxShadow:
              "0 10px 30px rgba(0,0,0,0.3)",

            pointerEvents:
              "auto",

            display: "flex",

            flexDirection:
              "column",

            transition:
              "width 160ms ease, padding 160ms ease",

            overflow: "hidden",
          }}
        >

          {/* =====================================
              HEADER
          ====================================== */}

          <div
            style={{
              display: "flex",

              alignItems:
                "center",

              justifyContent:
                leftPanelCollapsed
                  ? "center"
                  : "space-between",

              flexShrink: 0,

              marginBottom:
                leftPanelCollapsed
                  ? 0
                  : 12,
            }}
          >

            {!leftPanelCollapsed && (
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: 0.3,
                }}
              >
                CyBuilder
              </div>
            )}


            <button
              onClick={() =>
                setLeftPanelCollapsed(
                  !leftPanelCollapsed
                )
              }
              title={
                leftPanelCollapsed
                  ? "Expand panel"
                  : "Collapse panel"
              }
              style={{
                width: 30,
                height: 30,
                padding: 0,
                border: 0,
                borderRadius: 7,
                background: "#292930",
                color: "#ffffff",
                cursor: "pointer",
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {leftPanelCollapsed
                ? "›"
                : "‹"}
            </button>

          </div>


          {/* =====================================
              HISTORY + SAVE / LOAD
          ====================================== */}

          {!leftPanelCollapsed && (
            <>

              {/* HISTORY */}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: 5,
                  marginBottom: 5,
                  flexShrink: 0,
                }}
              >

                <button
                  onClick={undo}
                  disabled={!canUndo}
                  title="Undo (Ctrl/Cmd+Z)"
                  style={{
                    padding: "8px 6px",
                    border: 0,
                    borderRadius: 6,

                    background:
                      canUndo
                        ? "#292930"
                        : "#202027",

                    color:
                      canUndo
                        ? "#ffffff"
                        : "#55555f",

                    cursor:
                      canUndo
                        ? "pointer"
                        : "default",

                    fontSize: 11,

                    opacity:
                      canUndo
                        ? 1
                        : 0.7,
                  }}
                >
                  ↶ Undo
                </button>


                <button
                  onClick={redo}
                  disabled={!canRedo}
                  title="Redo (Ctrl/Cmd+Shift+Z)"
                  style={{
                    padding: "8px 6px",
                    border: 0,
                    borderRadius: 6,

                    background:
                      canRedo
                        ? "#292930"
                        : "#202027",

                    color:
                      canRedo
                        ? "#ffffff"
                        : "#55555f",

                    cursor:
                      canRedo
                        ? "pointer"
                        : "default",

                    fontSize: 11,

                    opacity:
                      canRedo
                        ? 1
                        : 0.7,
                  }}
                >
                  ↷ Redo
                </button>

              </div>


              {/* SAVE / LOAD */}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: 5,
                  marginBottom: 12,
                  flexShrink: 0,
                }}
              >

                <button
                  onClick={saveScene}
                  title="Save scene"
                  style={{
                    padding: "8px 6px",
                    border: 0,
                    borderRadius: 6,
                    background: "#343a52",
                    color: "#ffffff",
                    cursor: "pointer",
                    fontSize: 11,
                  }}
                >
                  ↓ Save
                </button>


                <button
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  title="Load scene"
                  style={{
                    padding: "8px 6px",
                    border: 0,
                    borderRadius: 6,
                    background: "#292930",
                    color: "#ffffff",
                    cursor: "pointer",
                    fontSize: 11,
                  }}
                >
                  ↑ Load
                </button>

              </div>


              {/* HIDDEN FILE INPUT */}

              <input
                ref={fileInputRef}
                type="file"
                accept=".cybuilder"
                onChange={handleLoadFile}
                style={{
                  display: "none",
                }}
              />

            </>
          )}


          {/* =====================================
              LEFT PANEL CONTENT
          ====================================== */}

          {!leftPanelCollapsed && (
            <div
              style={{
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                overflowX: "hidden",
                paddingRight: 3,
              }}
            >

              {/* SCENE */}

              <SceneHierarchy
                scene={scene}
                selectedId={selectedId}
                onSelect={select}
              />


              {/* TRANSFORM */}

              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  marginBottom: 9,
                  opacity: 0.55,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Transform
              </div>


              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(3, 1fr)",
                  gap: 5,
                  marginBottom: 18,
                }}
              >

                {(
                  [
                    ["translate", "Move"],
                    ["rotate", "Rotate"],
                    ["scale", "Scale"],
                  ] as const
                ).map(
                  ([mode, label]) => (
                    <button
                      key={mode}
                      onClick={() =>
                        setTransformMode(
                          mode
                        )
                      }
                      style={{
                        padding:
                          "8px 4px",

                        border: 0,

                        borderRadius: 6,

                        background:
                          transformMode ===
                          mode
                            ? "#4c7dff"
                            : "#292930",

                        color:
                          "#ffffff",

                        cursor:
                          "pointer",

                        fontSize: 10,
                      }}
                    >
                      {label}
                    </button>
                  )
                )}

              </div>


              {/* DIVIDER */}

              <div
                style={{
                  height: 1,
                  background:
                    "rgba(255,255,255,0.08)",
                  margin:
                    "4px 0 16px",
                }}
              />


              {/* IDEAS */}

              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  marginBottom: 9,
                  opacity: 0.55,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Ideas
              </div>


              {getIdeaCategories().map(
                (category) => {

                  const isOpen =
                    openIdeaFolders[
                      category
                    ] ?? true;


                  const ideas =
                    getIdeasByCategory(
                      category
                    );


                  return (
                    <div
                      key={category}
                      style={{
                        marginBottom: 10,
                      }}
                    >

                      <button
                        onClick={() =>
                          toggleIdeaFolder(
                            category
                          )
                        }
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent:
                            "space-between",
                          width: "100%",
                          padding:
                            "8px 9px",
                          border: 0,
                          borderRadius: 6,
                          background:
                            "#202027",
                          color:
                            "#ffffff",
                          cursor:
                            "pointer",
                          textAlign:
                            "left",
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >

                        <span
                          style={{
                            display: "flex",
                            alignItems:
                              "center",
                            gap: 7,
                          }}
                        >

                          <span
                            style={{
                              fontSize: 10,
                              opacity: 0.6,
                            }}
                          >
                            {isOpen
                              ? "▼"
                              : "▶"}
                          </span>


                          <span>
                            {category}
                          </span>

                        </span>


                        <span
                          style={{
                            fontSize: 9,
                            opacity: 0.4,
                          }}
                        >
                          {ideas.length}
                        </span>

                      </button>


                      {isOpen && (
                        <div
                          style={{
                            marginTop: 5,
                            paddingLeft: 8,
                          }}
                        >

                          {ideas.map(
                            (definition) => (
                              <button
                                key={
                                  definition.type
                                }
                                onClick={() =>
                                  addIdea(
                                    definition.type
                                  )
                                }
                                style={{
                                  display:
                                    "block",
                                  width:
                                    "100%",
                                  padding:
                                    "8px 9px",
                                  marginBottom:
                                    4,
                                  border: 0,
                                  borderRadius:
                                    6,
                                  background:
                                    "#292930",
                                  color:
                                    "#ffffff",
                                  textAlign:
                                    "left",
                                  cursor:
                                    "pointer",
                                  fontSize:
                                    11,
                                }}
                              >

                                <span
                                  style={{
                                    opacity:
                                      0.5,
                                    marginRight:
                                      6,
                                  }}
                                >
                                  +
                                </span>

                                {
                                  definition.name
                                }

                              </button>
                            )
                          )}

                        </div>
                      )}

                    </div>
                  );
                }
              )}

            </div>
          )}

        </div>


        {/* =====================================
            RIGHT INSPECTOR
        ====================================== */}

        {selectedObject && (
          <div
            style={{
              width: 280,

              maxHeight:
                "calc(100vh - 32px)",

              overflowY: "auto",

              margin: 16,

              padding: 14,

              boxSizing:
                "border-box",

              borderRadius: 12,

              background:
                "rgba(18, 18, 22, 0.94)",

              border:
                "1px solid rgba(255,255,255,0.1)",

              boxShadow:
                "0 10px 30px rgba(0,0,0,0.3)",

              pointerEvents:
                "auto",

              alignSelf:
                "flex-start",
            }}
          >

            {/* HEADER */}

            <div
              style={{
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "space-between",
                marginBottom: 14,
              }}
            >

              <div>

                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  {selectedObject.type}
                </div>


                <div
                  style={{
                    fontSize: 10,
                    opacity: 0.45,
                    marginTop: 3,
                  }}
                >
                  {selectedObject.id}
                </div>

              </div>


              <button
                onClick={() =>
                  select(undefined)
                }
                title="Deselect"
                style={{
                  border: 0,
                  background:
                    "transparent",
                  color: "#aaa",
                  cursor:
                    "pointer",
                  fontSize: 18,
                }}
              >
                ×
              </button>

            </div>


            {/* TRANSFORM */}

            <Section title="Transform">

              <VectorInput
                label="Position"
                value={
                  selectedObject
                    .transform
                    .position
                }
                onChange={(
                  axis,
                  value
                ) => {

                  const next = [
                    ...selectedObject
                      .transform
                      .position,
                  ] as [
                    number,
                    number,
                    number
                  ];

                  next[axis] =
                    value;


                  updateTransform(
                    selectedObject.id,
                    {
                      position:
                        next,
                    }
                  );
                }}
              />


              <VectorInput
                label="Rotation"
                value={
                  selectedObject
                    .transform
                    .rotation
                }
                onChange={(
                  axis,
                  value
                ) => {

                  const next = [
                    ...selectedObject
                      .transform
                      .rotation,
                  ] as [
                    number,
                    number,
                    number
                  ];

                  next[axis] =
                    value;


                  updateTransform(
                    selectedObject.id,
                    {
                      rotation:
                        next,
                    }
                  );
                }}
              />


              <VectorInput
                label="Scale"
                value={
                  selectedObject
                    .transform
                    .scale
                }
                onChange={(
                  axis,
                  value
                ) => {

                  const next = [
                    ...selectedObject
                      .transform
                      .scale,
                  ] as [
                    number,
                    number,
                    number
                  ];

                  next[axis] =
                    value;


                  updateTransform(
                    selectedObject.id,
                    {
                      scale:
                        next,
                    }
                  );
                }}
              />

            </Section>


            {/* IDEA PROPERTIES */}

            {selectedDefinition && (
              <PropertyEditor
                object={
                  selectedObject
                }
                definition={
                  selectedDefinition
                }
                onChange={(
                  object
                ) => {

                  updateObject(
                    selectedObject.id,
                    object
                  );

                }}
              />
            )}


            {/* ACTIONS */}

            <button
              onClick={() => {

                setClipboardObject(
                  structuredClone(
                    selectedObject
                  )
                );

              }}
              title="Copy (Ctrl/Cmd+C)"
              style={{
                width: "100%",
                padding:
                  "9px 10px",
                border: 0,
                borderRadius: 7,
                background:
                  "#292930",
                color:
                  "#ffffff",
                cursor:
                  "pointer",
              }}
            >
              Copy
            </button>


            <button
              disabled={
                !clipboardObject
              }
              onClick={() => {

                if (
                  !clipboardObject
                ) {
                  return;
                }


                let pastedObject =
                  cloneSceneObject(
                    clipboardObject
                  );


                while (
                  scene.objects.some(
                    (object) =>
                      object.id ===
                      pastedObject.id
                  )
                ) {

                  pastedObject =
                    cloneSceneObject(
                      clipboardObject
                    );

                }


                addObject(
                  pastedObject
                );


                select(
                  pastedObject.id
                );

              }}
              title="Paste (Ctrl/Cmd+V)"
              style={{
                width: "100%",
                marginTop: 6,
                padding:
                  "9px 10px",
                border: 0,
                borderRadius: 7,

                background:
                  clipboardObject
                    ? "#343a52"
                    : "#202027",

                color:
                  clipboardObject
                    ? "#ffffff"
                    : "#55555f",

                cursor:
                  clipboardObject
                    ? "pointer"
                    : "default",
              }}
            >
              Paste
            </button>


            <button
              onClick={() =>
                duplicateObject(
                  selectedObject.id
                )
              }
              title="Duplicate (Ctrl/Cmd+D)"
              style={{
                width: "100%",
                marginTop: 16,
                padding:
                  "9px 10px",
                border: 0,
                borderRadius: 7,
                background:
                  "#343a52",
                color:
                  "#ffffff",
                cursor:
                  "pointer",
              }}
            >
              Duplicate
            </button>


            <button
              onClick={() =>
                removeObject(
                  selectedObject.id
                )
              }
              title="Delete (Delete)"
              style={{
                width: "100%",
                marginTop: 6,
                padding:
                  "9px 10px",
                border: 0,
                borderRadius: 7,
                background:
                  "#6f2525",
                color:
                  "#ffffff",
                cursor:
                  "pointer",
              }}
            >
              Delete
            </button>

          </div>
        )}

      </div>

    </Html>
  );
}


/* =========================================
   SECTION
========================================= */

function Section(props: {
  title: string;
  children: ReactNode;
}) {

  return (
    <div
      style={{
        marginTop: 16,
      }}
    >

      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          opacity: 0.55,
          textTransform:
            "uppercase",
          letterSpacing: 0.8,
          marginBottom: 9,
        }}
      >
        {props.title}
      </div>


      {props.children}

    </div>
  );
}


/* =========================================
   FIELD LABEL
========================================= */

function FieldLabel(props: {
  children: ReactNode;
}) {

  return (
    <label
      style={{
        display: "block",
        fontSize: 11,
        opacity: 0.65,
        marginBottom: 5,
      }}
    >
      {props.children}
    </label>
  );
}


/* =========================================
   VECTOR INPUT
========================================= */

function VectorInput(props: {
  label: string;

  value: [
    number,
    number,
    number
  ];

  onChange: (
    axis: 0 | 1 | 2,
    value: number
  ) => void;
}) {

  const {
    label,
    value,
    onChange,
  } = props;


  return (
    <div
      style={{
        marginBottom: 12,
      }}
    >

      <FieldLabel>
        {label}
      </FieldLabel>


      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(3, 1fr)",
          gap: 5,
        }}
      >

        {(
          [
            "X",
            "Y",
            "Z",
          ] as const
        ).map(
          (
            axisName,
            index
          ) => (

            <input
              key={
                axisName
              }
              type="number"
              step="0.01"
              value={
                value[index]
              }
              onChange={(
                event
              ) => {

                const next =
                  Number(
                    event.target.value
                  );


                if (
                  Number.isFinite(
                    next
                  )
                ) {

                  onChange(
                    index as
                      | 0
                      | 1
                      | 2,
                    next
                  );

                }
              }}
              aria-label={`${label} ${axisName}`}
              style={
                inputStyle
              }
            />

          )
        )}

      </div>

    </div>
  );
}


/* =========================================
   INPUT STYLE
========================================= */

const inputStyle:
  CSSProperties = {

  boxSizing:
    "border-box",

  width:
    "100%",

  padding:
    "7px 8px",

  borderRadius:
    6,

  border:
    "1px solid rgba(255,255,255,0.12)",

  background:
    "rgba(255,255,255,0.06)",

  color:
    "#ffffff",

  outline:
    "none",
};