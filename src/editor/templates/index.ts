import {
  EditorTemplate,
} from "./types";

import {
  lostWorldTemplate,
} from "./lost";

export const editorTemplates: EditorTemplate[] = [
  lostWorldTemplate,
];

/* =========================================
   ALL TEMPLATES
========================================= */

export function getEditorTemplates(): EditorTemplate[] {
  return editorTemplates;
}

/* =========================================
   LOOKUP
========================================= */

export function getEditorTemplate(
  id: string
): EditorTemplate | undefined {
  return editorTemplates.find(
    (template) =>
      template.id === id
  );
}

/* =========================================
   DEFAULT
========================================= */

export const defaultEditorTemplate =
  lostWorldTemplate;