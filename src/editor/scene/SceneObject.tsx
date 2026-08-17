import {
  TransformControls,
} from "@react-three/drei";

import {
  ReactElement,
  useRef,
} from "react";

import {
  ThreeEvent,
} from "@react-three/fiber";

import {
  Group,
} from "three";

import {
  useEditor,
} from "../context/EditorContext";

import {
  SceneObject as SceneObjectData,
} from "./objectTypes";

import SceneObjectContent from "./SceneObjectContent";


/* =========================================
   TYPES
========================================= */

type SceneObjectProps = {
  object: SceneObjectData;
};


/* =========================================
   SCENE OBJECT
========================================= */

export default function SceneObject({
  object,
}: SceneObjectProps): ReactElement {

  const {
    scene,
    selectedId,
    select,
    updateTransform,
    beginTransform,
    endTransform,
    transformMode,
    editorActive,
  } = useEditor();


  /* =======================================
     GROUP REF
  ======================================= */

  const groupRef =
    useRef<Group>(null);


  /* =======================================
     SELECTION
  ======================================= */

  const isSelected =
    selectedId === object.id;


  /* =======================================
     TRANSFORM
  ======================================= */

  const {
    position,
    rotation,
    scale,
  } = object.transform;


  /* =======================================
     CHILDREN
  ======================================= */

  const children =
    scene.objects.filter(
      (child) =>
        child.parentId === object.id
    );


  /* =======================================
     CLICK
  ======================================= */

  const handleClick = (
    event: ThreeEvent<MouseEvent>
  ) => {

    event.stopPropagation();

    if (!editorActive) {
      return;
    }

    select(object.id);
  };


  /* =======================================
     OBJECT CHANGE
  ======================================= */

  const handleObjectChange = () => {

    const group =
      groupRef.current;

    if (!group) {
      return;
    }

    updateTransform(
      object.id,
      {
        position: [
          group.position.x,
          group.position.y,
          group.position.z,
        ],

        rotation: [
          group.rotation.x,
          group.rotation.y,
          group.rotation.z,
        ],

        scale: [
          group.scale.x,
          group.scale.y,
          group.scale.z,
        ],
      }
    );
  };


  /* =======================================
     OBJECT GROUP
  ======================================= */

  const content = (
    <group
      ref={groupRef}
      name={`scene-object-${object.id}`}
      position={position}
      rotation={rotation}
      scale={scale}
      visible={
        object.visible !== false
      }
      raycast={
        editorActive
          ? undefined
          : () => null
      }
      onClick={
        editorActive
          ? handleClick
          : undefined
      }
    >

      {/* ===================================
          OBJECT CONTENT
      =================================== */}

      <SceneObjectContent
        object={object}
      />


      {/* ===================================
          SELECTION
      =================================== */}

      {isSelected && editorActive && (
        <SelectionIndicator />
      )}


      {/* ===================================
          CHILDREN
      =================================== */}

      {children.map(
        (child) => (
          <SceneObject
            key={child.id}
            object={child}
          />
        )
      )}

    </group>
  );


  /* =======================================
     TRANSFORM CONTROLS
  ======================================= */

  if (
    !isSelected ||
    !editorActive ||
    object.locked
  ) {
    return content;
  }


  return (
    <TransformControls
      mode={transformMode}

      onMouseDown={() => {
        beginTransform(
          object.id
        );
      }}

      onObjectChange={
        handleObjectChange
      }

      onMouseUp={() => {
        endTransform();
      }}
    >
      {content}
    </TransformControls>
  );
}


/* =========================================
   SELECTION INDICATOR
========================================= */

function SelectionIndicator(): ReactElement {
  return (
    <mesh
      raycast={() => null}
    >
      <boxGeometry
        args={[
          1.05,
          1.05,
          1.05,
        ]}
      />

      <meshBasicMaterial
        color="#4c7dff"
        wireframe
        transparent
        opacity={0.35}
        depthTest={false}
      />
    </mesh>
  );
}