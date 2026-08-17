<br/>
<br/>

<p align="center">
    <img width="500" src="https://lbemedia.net/images/android-chrome-192x192.ico" alt="logo" />
</p>

<h3 align="center">
    CyBuilder
</h3>

<h5 align="center">
    A visual scene builder for the 3D Web.
</h5>

<div align="center">

[![cyengine](https://img.shields.io/npm/v/cyengine?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/cyengine)

</div>

<p align="center">
    <a href="https://cypherverse.space">cypherverse</a>
    ·
    <a href="https://cyengine-starter-pi.vercel.app">demo</a>
    ·
    <a href="https://discord.gg/CrbfwhVVq">discord</a>
</p>

<br/>
<br/>
<br/>
<br/>

<hr/>

## About

---

## Quick Start

### Requirements

The editor requires:

- Node.js
- React
- Three.js
- `@react-three/fiber`
- `@react-three/drei`
- `cyengine`

A modern Vite, Next.js, or React-based project can be used.

---

## Installation

Clone the project:

```bash
git clone <your-editor-repository>
cd <your-editor-repository>

Install dependencies:

npm install

or:

yarn

Start the development server:

npm run dev

or:

yarn dev

The editor can then be opened from the local development URL provided by
your framework.

Using the Editor

The primary editor component is:

import EditorReality from "./editor/EditorReality";


export default function App() {
  return (
    <EditorReality />
  );
}

EditorReality provides the complete editor environment.

It contains:

The cyengine reality
The editor state provider
The template environment
The editable scene
The editor UI
EditorReality
import EditorReality from "./editor/EditorReality";


function App() {
  return (
    <EditorReality />
  );
}
Props
type EditorRealityProps = {
  children?: ReactNode | ReactNode[];


  initialScene?: SceneData;


  template?: EditorTemplate;
};
initialScene

Provides an explicit starting scene.

<EditorReality
  initialScene={myScene}
/>

If no scene is provided, the scene from the selected editor template is used.

template

Provides the environment and default scene used by the editor.

<EditorReality
  template={myTemplate}
/>
Editor Structure

The editor is organized into several fundamental systems.

src/
└── editor/
    ├── EditorReality.tsx
    │
    ├── context/
    │   └── EditorContext.tsx
    │
    ├── ideas/
    │
    ├── scene/
    │   ├── Scene.tsx
    │   ├── SceneObject.tsx
    │   └── objectTypes.ts
    │
    ├── templates/
    │   ├── index.ts
    │   └── types.ts
    │
    └── ui/
        ├── EditorUI.tsx
        └── PropertyEditor.tsx
Editor
Scene

The scene contains the objects currently being edited.

import Scene from "./editor/scene/Scene";


<Scene />

The Scene component reads the current scene from EditorContext and
renders every scene object.

export default function Scene() {
  const { scene } = useEditor();


  return (
    <group name="editor-scene">
      {scene.objects.map((object) => (
        <SceneObject
          key={object.id}
          object={object}
        />
      ))}
    </group>
  );
}
Scene Objects

Every editable object is represented by a SceneObject.

type SceneObjectProps = {
  object: SceneObjectData;
};

Objects contain:

An ID
A type
Transform data
Idea-specific properties

Conceptually:

{
  id: "object-id",
  type: "model",


  transform: {
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
  },


  props: {
    src: "https://example.com/model.glb",
  },
}
Ideas

Ideas are the fundamental building blocks of the editor.

They represent the things that can be placed into a scene.

Examples include:

Image
Model
Video
Audio
HDRI
Background
Fog
Infinite Plane
Lost Floor
Cloudy Sky
Rain
Title
Link
Speaker
Ground

Ideas can be registered into categories and exposed automatically inside the
editor's Ideas panel.

Adding an Idea

The editor creates scene objects through:

createSceneObject(type);

For example:

const object =
  createSceneObject("model");


addObject(object);


select(object.id);

The new object is immediately added to the scene and selected.

Transform Editing

Every scene object has a transform:

transform: {
  position: [x, y, z],
  rotation: [x, y, z],
  scale: [x, y, z],
}

The editor supports three transform modes.

Move
Translate
Rotate
Rotate
Scale
Scale

The mode can be changed from the editor toolbar.

setTransformMode("translate");


setTransformMode("rotate");


setTransformMode("scale");
Inspector Transform Controls

Selected objects expose numeric transform controls.

Position


X   Y   Z


Rotation


X   Y   Z


Scale


X   Y   Z

Changes are written directly into the editor scene state.

Selection

Objects can be selected directly from the 3D scene.

const handleClick = (event: any) => {
  event.stopPropagation();


  select(object.id);
};

Objects selected in the viewport are also highlighted in the scene hierarchy.

A selection indicator is rendered around the selected object.

Scene Hierarchy

The left editor panel displays all objects currently in the scene.

Example:

Scene


● Model 1
● Image 1
● Ground 1
● Rain 1

Selecting an object in the hierarchy selects it in the 3D scene.

Inspector

The right side of the editor contains the object inspector.

The inspector provides:

Object type
Object ID
Transform controls
Idea properties
Duplicate
Delete

Example:

MODEL
object-id


Transform
Position
Rotation
Scale


Model Properties
...


Duplicate
Delete
Keyboard Shortcuts

The editor supports keyboard shortcuts designed to make scene editing fast.

Shortcut	Action
E	Toggle editor
Ctrl + D	Duplicate selected object
Cmd + D	Duplicate selected object
Delete	Delete selected object
Backspace	Delete selected object

Keyboard shortcuts are disabled while typing into:

Inputs
Textareas
Select elements
Content-editable elements

This prevents editor shortcuts from interfering with property editing.

Editor Toggle

Press:

E

to toggle the editor UI.

When the editor is disabled, the editor overlay is removed completely.

This is important for production experiences because the editor UI should not
intercept pointer interaction when the editor is not being used.

The scene itself remains intact.

Editor Context

The editor state is provided through:

<EditorProvider>
  ...
</EditorProvider>

Components can access editor state through:

const {
  scene,
  selectedId,
  select,
  addObject,
  removeObject,
  duplicateObject,
  updateObject,
  updateTransform,
  transformMode,
  setTransformMode,
  editorActive,
  toggleEditor,
} = useEditor();

The editor context is the central state management layer for the authoring
environment.

Templates

Templates provide a reusable starting environment for the editor.

The default template is:

import {
  defaultEditorTemplate,
} from "./templates";

Templates can provide:

Starting scene
Environment
Default world configuration

Example:

<EditorReality
  template={defaultEditorTemplate}
/>

A custom template can be provided:

<EditorReality
  template={myTemplate}
/>
Custom Scenes

A complete scene can be passed directly into the editor.

const scene = {
  objects: [
    {
      id: "ground-1",
      type: "ground",


      transform: {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
      },


      props: {
        size: 100,
        gridSize: 1,
      },
    },
  ],
};

Then:

<EditorReality
  initialScene={scene}
/>

This makes the editor suitable for both:

Creating scenes from scratch
Editing existing scenes
Production Architecture

The editor is intentionally separated into several layers.

EditorReality
      │
      ▼
EditorProvider
      │
      ├── Scene
      │     └── SceneObject
      │
      └── EditorUI
            ├── Scene Hierarchy
            ├── Transform Tools
            ├── Ideas
            └── Inspector
EditorReality

Owns the overall editor experience.

EditorProvider

Owns editor state and scene mutations.

Scene

Renders the current scene.

SceneObject

Connects scene data to actual Three.js/cyengine objects.

EditorUI

Provides the authoring interface.

PropertyEditor

Provides idea-specific property editing.

Development

Install dependencies:

npm install

Run the development environment:

npm run dev

Build the project:

npm run build

Preview the production build:

npm run preview

Run linting:

npm run lint

Run tests:

npm test

The exact commands depend on the project's package scripts.

Recommended Development Flow

When adding a new editor feature, follow this pattern:

1. Define the state
        ↓
2. Add the state mutation
        ↓
3. Expose it through EditorContext
        ↓
4. Add the UI
        ↓
5. Connect keyboard shortcuts if appropriate
        ↓
6. Update SceneObject if rendering behavior changes
        ↓
7. Test with multiple object types

This keeps the editor architecture predictable as the feature set grows.

Roadmap

The editor is being developed toward a complete 3D authoring environment.

Scene Editing
 Object selection
 Object hierarchy
 Add objects
 Delete objects
 Duplicate objects
 Transform controls
 Numeric transform editing
 Editor toggle
 Keyboard shortcuts
Workflow
 Undo
 Redo
 Copy
 Paste
 Rename objects
 Multi-selection
 Focus selected object
 Search scene
 Lock objects
 Hide objects
 Transform snapping
Scene Management
 Save scenes
 Load scenes
 Export scenes
 Import scenes
 Scene serialization
 Local project storage
Advanced Editing
 Parent/child hierarchy
 Grouping
 Multi-object transforms
 Alignment tools
 Grid snapping
 Rotation snapping
 Pivot controls
 Camera tools
Production
 Asset browser
 Asset upload
 Scene versioning
 Autosave
 Project management
 Collaboration
 Multiplayer editing
 Publish workflow
Philosophy

The editor follows the same philosophy as cyengine:

The creator should spend time creating the world, not managing the machinery
required to make the world work.

The editor therefore aims to abstract repetitive scene-management tasks while
keeping the underlying scene compatible with React and the cyengine ecosystem.

The final result should remain composable, inspectable, and usable directly
from code.

Technologies

The editor is built around the same technologies that power the modern 3D web:

React
TypeScript
Three.js
React Three Fiber
React Three Drei
cyengine

The editor does not attempt to replace these technologies.

Instead, it provides a visual authoring layer on top of them.

Contributing

Contributions are welcome.

Before adding a feature, consider whether it belongs in:

editor/
├── context/
├── scene/
├── ideas/
├── templates/
└── ui/

Keep scene state inside the editor context and keep rendering behavior inside
the scene layer.

UI-specific behavior should remain inside the UI layer whenever possible.

License

See the repository license for licensing information.

<br/> <br/> <p align="center"> Built for the future of the 3D Web. </p> ```
One important change I'd make

Since this is your editor repository, I'd keep the README's identity as the editor, while referencing cyengine as the underlying engine. That keeps the architecture clear:

cyengine
   │
   └── Editor
        │
        ├── EditorReality
        ├── EditorProvider
        ├── Scene
        ├── SceneObject
        ├── Ideas
        ├── Templates
        └── EditorUI