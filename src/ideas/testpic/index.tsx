import EditorReality from "../../editor/EditorReality";
import { Scene } from "../../editor/scene/objectTypes";

const scene: Scene = {
  objects: [
    {
      id: "picture-1",
      type: "image",
      transform: {
        position: [0, 1, -3],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      },
      props: {
        src: "https://d27rt3a60hh1lx.cloudfront.net/images/turtle.jpg",
      },
    },
  ],
};

export default function App() {
  return (
    <EditorReality initialScene={scene} />
  );
}