import {
  useMemo,
  useState,
} from "react";

import {
  Scene,
  SceneObject,
} from "./objectTypes";


type SceneHierarchyProps = {
  collapsed?: boolean;

  scene: Scene;

  selectedId?: string;

  onSelect: (
    id?: string
  ) => void;
};


/* =========================================
   OBJECT DISPLAY NAME
========================================= */

function getObjectDisplayName(
  object: SceneObject,
  index: number
): string {

  switch (object.type) {

    case "infinitePlane":
      return `Infinite Plane ${index + 1}`;

    case "hdri":
      return `HDRI ${index + 1}`;

    case "background":
      return `Background ${index + 1}`;

    case "image":
      return `Image ${index + 1}`;

    case "model":
      return `Model ${index + 1}`;

    case "video":
      return `Video ${index + 1}`;

    case "audio":
      return `Audio ${index + 1}`;

    case "fog":
      return `Fog ${index + 1}`;

    case "cloudySky":
      return `Cloudy Sky ${index + 1}`;

    case "rain":
      return `Rain ${index + 1}`;

    case "title":
      return `Title ${index + 1}`;

    case "link":
      return `Link ${index + 1}`;

    case "speaker":
      return `Speaker ${index + 1}`;

    case "ground":
      return `Ground ${index + 1}`;

    case "lostFloor":
      return `Lost Floor ${index + 1}`;

    default:
      return `Object ${index + 1}`;
  }
}


/* =========================================
   SCENE HIERARCHY
========================================= */

export default function SceneHierarchy({
  collapsed = false,
  scene,
  selectedId,
  onSelect,
}: SceneHierarchyProps) {

  const [
    expanded,
    setExpanded,
  ] = useState<Record<string, boolean>>({});


  /* =======================================
     STABLE TYPE INDEXES
  ======================================= */

  const indexes = useMemo(() => {

    const counters =
      new Map<
        SceneObject["type"],
        number
      >();

    const result =
      new Map<string, number>();

    for (
      const object of scene.objects
    ) {

      const current =
        counters.get(object.type) ?? 0;

      result.set(
        object.id,
        current
      );

      counters.set(
        object.type,
        current + 1
      );
    }

    return result;

  }, [scene.objects]);


  if (collapsed) {
    return null;
  }


  /* =======================================
     ROOT OBJECTS
  ======================================= */

  const roots =
    scene.objects.filter(
      (object) =>
        object.parentId === undefined ||
        !scene.objects.some(
          (parent) =>
            parent.id === object.parentId
        )
    );


  /* =======================================
     TOGGLE
  ======================================= */

  const toggleExpanded = (
    id: string
  ) => {

    setExpanded(
      (current) => ({
        ...current,
        [id]:
          !current[id],
      })
    );
  };


  /* =======================================
     RENDER
  ======================================= */

  return (
    <div>

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
        Scene
      </div>


      {roots.length === 0 ? (

        <div
          style={{
            padding: "10px",
            marginBottom: 16,
            borderRadius: 7,
            background: "#202027",
            color: "#777",
            fontSize: 11,
            textAlign: "center",
          }}
        >
          Empty scene
        </div>

      ) : (

        <div
          style={{
            marginBottom: 16,
          }}
        >
          {roots.map(
            (object) => (
              <HierarchyItem
                key={object.id}
                object={object}
                level={0}
                selectedId={selectedId}
                expanded={expanded}
                scene={scene}
                indexes={indexes}
                onSelect={onSelect}
                onToggle={toggleExpanded}
              />
            )
          )}
        </div>

      )}

    </div>
  );
}


/* =========================================
   HIERARCHY ITEM PROPS
========================================= */

type HierarchyItemProps = {
  object: SceneObject;

  level: number;

  selectedId?: string;

  expanded: Record<
    string,
    boolean
  >;

  scene: {
    objects: SceneObject[];
  };

  indexes: Map<
    string,
    number
  >;

  onSelect: (
    id?: string
  ) => void;

  onToggle: (
    id: string
  ) => void;
};


/* =========================================
   HIERARCHY ITEM
========================================= */

function HierarchyItem({
  object,
  level,
  selectedId,
  expanded,
  scene,
  indexes,
  onSelect,
  onToggle,
}: HierarchyItemProps) {

  const children =
    scene.objects.filter(
      (child) =>
        child.parentId === object.id
    );

  const hasChildren =
    children.length > 0;

  const isExpanded =
    expanded[object.id] ?? true;

  const isSelected =
    selectedId === object.id;

  const index =
    indexes.get(object.id) ?? 0;


  /* =======================================
     RENDER
  ======================================= */

  return (
    <div>

      {/* ===================================
          ITEM ROW
      ==================================== */}

      <div
        style={{
          display: "flex",
          alignItems: "center",

          width: "100%",
          minWidth: 0,

          marginBottom: 3,

          borderRadius: 6,

          background:
            isSelected
              ? "#4c7dff"
              : "transparent",
        }}
      >

        {/* =================================
            EXPAND BUTTON
        ================================= */}

        <button
          type="button"
          disabled={!hasChildren}
          aria-label={
            hasChildren
              ? isExpanded
                ? "Collapse"
                : "Expand"
              : undefined
          }
          onClick={() => {

            if (!hasChildren) {
              return;
            }

            onToggle(
              object.id
            );
          }}
          style={{
            width: 24,
            height: 30,

            marginLeft:
              6 + level * 16,

            padding: 0,

            border: 0,

            background:
              "transparent",

            color:
              hasChildren
                ? isSelected
                  ? "#ffffff"
                  : "#aaa"
                : "transparent",

            cursor:
              hasChildren
                ? "pointer"
                : "default",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            fontSize: 8,

            flexShrink: 0,
          }}
        >
          {hasChildren
            ? isExpanded
              ? "▼"
              : "▶"
            : "•"}
        </button>


        {/* =================================
            SELECT BUTTON
        ================================= */}

        <button
          type="button"
          onClick={() =>
            onSelect(object.id)
          }
          style={{
            display: "flex",
            alignItems: "center",

            flex: 1,
            minWidth: 0,

            height: 30,

            padding:
              "0 6px 0 0",

            border: 0,

            background:
              "transparent",

            color: "#ffffff",

            cursor: "pointer",

            textAlign: "left",

            fontSize: 11,
          }}
        >

          {/* TYPE DOT */}

          <span
            aria-hidden="true"
            style={{
              width: 7,
              height: 7,

              marginRight: 7,

              borderRadius: "50%",

              background:
                isSelected
                  ? "#ffffff"
                  : "#777",

              flexShrink: 0,
            }}
          />


          {/* NAME */}

          <span
            style={{
              overflow: "hidden",

              textOverflow:
                "ellipsis",

              whiteSpace:
                "nowrap",

              opacity:
                object.visible === false
                  ? 0.4
                  : 1,
            }}
          >
            {getObjectDisplayName(
              object,
              index
            )}
          </span>


          {/* LOCK */}

          {object.locked && (
            <span
              aria-label="Locked"
              style={{
                marginLeft: "auto",
                paddingLeft: 5,
                opacity: 0.55,
                fontSize: 9,
                flexShrink: 0,
              }}
            >
              🔒
            </span>
          )}

        </button>

      </div>


      {/* ===================================
          CHILDREN
      ==================================== */}

      {hasChildren &&
        isExpanded && (

          <div>
            {children.map(
              (child) => (
                <HierarchyItem
                  key={child.id}
                  object={child}
                  level={level + 1}
                  selectedId={selectedId}
                  expanded={expanded}
                  scene={scene}
                  indexes={indexes}
                  onSelect={onSelect}
                  onToggle={onToggle}
                />
              )
            )}
          </div>

        )}

    </div>
  );
}