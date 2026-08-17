import { useEditor } from "../context/EditorContext";
import SceneObject from "./SceneObject";

export default function Scene() {
  const { scene } = useEditor();

  /*
   * Only render hierarchy roots here.
   *
   * SceneObject is responsible for recursively
   * rendering its children.
   */
  const roots = scene.objects.filter(
    (object) =>
      object.parentId === undefined ||
      !scene.objects.some(
        (parent) =>
          parent.id === object.parentId
      )
  );

  return (
    <group name="editor-scene">
      {roots.map((object) => (
        <SceneObject
          key={object.id}
          object={object}
        />
      ))}
    </group>
  );
}