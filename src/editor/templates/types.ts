import { ReactNode } from "react";
import { Scene } from "../scene/objectTypes";

export type EditorTemplate = {
  id: string;
  name: string;
  description: string;

  /**
   * Initial editable scene objects.
   */
  scene: Scene;

  /**
   * Static environment rendered behind
   * the editable scene.
   */
  environment?: ReactNode;
};