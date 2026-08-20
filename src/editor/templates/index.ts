import {
  EditorTemplate,
} from "./types";

import {
  lostWorldTemplate,
} from "./lost";

import {
  foundTemplate,
} from "./found";


/* =========================================
   ALL TEMPLATES
========================================= */

export const editorTemplates: EditorTemplate[] = [
  lostWorldTemplate,
  foundTemplate,
];


/* =========================================
   GET ALL
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