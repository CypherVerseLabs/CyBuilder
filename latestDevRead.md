Add this section to your README.md (or replace your current project-status section with it):

# CyBuilder


A browser-based 3D scene builder/editor built with React, React Three Fiber, Three.js, and Drei.


---


# Project Status


## Current Stage


The core editor foundation is working.


We currently have:


- Scene object type system
- Scene state management
- Object selection
- Inspector
- Transform editing
- Move / Rotate / Scale modes
- Add objects through Ideas
- Delete objects
- Duplicate objects
- Copy / Paste
- Undo / Redo
- Editor toggle
- Collapsible left panel
- Scene object list
- Property editing
- Transform transactions for undo/redo
- Basic scene object metadata
- Optional `parentId` field reserved for future hierarchy


---


# Current File Structure


The important editor files currently are:


```text
src/
├── scene/
│   └── objectTypes.ts
│
├── context/
│   └── EditorContext.tsx
│
├── components/
│   ├── EditorUI.tsx
│   └── PropertyEditor.tsx
│
└── ideas/
    └── ...

The exact folder names may vary slightly depending on the existing project structure.

Scene Object System
File
src/scene/objectTypes.ts

This file contains:

Transform
SceneObjectBase
ImageObject
ModelObject
VideoObject
AudioObject
HDRIObject
BackgroundObject
FogObject
InfinitePlaneObject
CloudySkyObject
RainObject
TitleObject
LinkObject
SpeakerObject
GroundObject
LostFloorObject
SceneObject
Scene
defaultTransform
cloneSceneObject()

The current SceneObjectBase contains:

export type SceneObjectBase = {
  id: string;
  transform: Transform;


  name?: string;
  visible?: boolean;
  locked?: boolean;


  parentId?: string;
};
Important

parentId currently exists only as reserved data.

Hierarchy behavior has NOT been implemented.

Do not start building parenting/grouping yet unless explicitly requested.

Hierarchy is a future feature.

Editor Context
File
src/context/EditorContext.tsx

The editor context currently provides:

Scene
scene
Selection
selectedId
select()
Transform
transformMode
setTransformMode()
beginTransform()
endTransform()
updateTransform()
Editor state
editorActive
setEditorActive()
toggleEditor()
Scene operations
addObject()
removeObject()
duplicateObject()
updateObject()
History
canUndo
canRedo
undo()
redo()

Undo/redo currently supports up to:

MAX_HISTORY_SIZE = 100

Transform dragging is treated as a single undo operation through:

beginTransform()
endTransform()
Editor UI
File
src/components/EditorUI.tsx

The current editor UI contains:

Left panel
CyBuilder header
Collapse/expand button
Undo
Redo
Scene object list
Transform mode buttons
Ideas/categories
Add-object buttons
Right inspector
Selected object type
Object ID
Position
Rotation
Scale
Object-specific properties
Copy
Paste
Duplicate
Delete
Keyboard shortcuts

Currently implemented:

Ctrl/Cmd + Z
    Undo


Ctrl/Cmd + Shift + Z
    Redo


Ctrl/Cmd + Y
    Redo


Ctrl/Cmd + C
    Copy selected object


Ctrl/Cmd + V
    Paste object


Ctrl/Cmd + D
    Duplicate selected object


Delete / Backspace
    Delete selected object


Escape
    Deselect


E
    Toggle editor
Current Development Priority

Do NOT add major new systems yet.

The next work should be done in this order.

1. Visibility and Locking

Use the existing fields:

visible?: boolean;
locked?: boolean;

Implement:

Eye/visibility toggle
Lock/unlock toggle
Hidden objects should not render
Locked objects should not be transformable
Locked objects should still be visible/selectable if desired

Primary files:

src/scene/objectTypes.ts
src/context/EditorContext.tsx
src/components/EditorUI.tsx
2. Editable Object Names

Currently objects are displayed with generated names such as:

Model 1
Model 2
Image 1

Add editable names.

Example:

House
Main Character
Logo
Background Video

Use:

name?: string;

which already exists in SceneObjectBase.

Primary files:

src/scene/objectTypes.ts
src/context/EditorContext.tsx
src/components/EditorUI.tsx
3. Improve the Scene / Outliner

The current Scene section is a simple object list.

Improve it into a more useful scene/outliner panel.

Potential features:

Object name
Object type
Visibility button
Lock button
Selection
Rename
Better visual hierarchy

Hierarchy itself is NOT required yet.

Primary file:

src/components/EditorUI.tsx
4. Transform Controls Polish

Improve the actual 3D transform workflow.

Current modes:

Move
Rotate
Scale

Make sure:

Gizmos behave correctly
Inspector values update correctly
Dragging creates one undo entry
Transform mode switching is reliable
Numeric transform editing works reliably

Relevant files may include:

src/context/EditorContext.tsx
src/components/EditorUI.tsx

and the existing TransformControls-related component/file.

5. Snapping

Add optional snapping.

Potential settings:

Position Snap: 0.5
Rotation Snap: 15°
Scale Snap: 0.1

Possible UI:

Snap: ON/OFF

This should be implemented after transform controls are stable.

6. Camera Tools

Add useful editor camera controls:

Focus Selected
Frame Selected
Reset Camera
Top View
Front View
Side View

The most important first feature is:

Focus Selected
7. Save / Load Scenes

Add scene persistence.

Potential features:

Save Scene
Load Scene
Export Scene
Import Scene

The existing structure is already suitable for JSON serialization:

export type Scene = {
  objects: SceneObject[];
};

Potential future files:

src/scene/
    sceneStorage.ts

or similar.

Do not over-engineer this until the editor state is stable.

Future Features

These are intentionally NOT current priorities.

Selection / Editing
Multi-select
Box selection
Select all
Alignment tools
Object grouping
Hierarchy
Parent/child objects
Groups
Nested transforms
Drag objects into parents
Outliner hierarchy
Local/world transform behavior
Important

Hierarchy is intentionally postponed.

The existing:

parentId?: string;

is only preparation for this future feature.

Do not implement hierarchy behavior yet.

Advanced Future Features

Eventually the editor may support:

Asset library
Materials
Lights
Cameras
Animation
Keyframes
Timeline
Scene templates
Publishing
Exporting
Importing assets
More advanced snapping
Local/world transform modes
Multi-object transforms
Alignment/distribution
Advanced scene management

These should come after the core editor workflow is stable.

Current Stopping Point

This is the current development checkpoint.

The project is in a good state to pause.

The immediate next task when development resumes is:

1. Visibility + Locking

Then:

2. Editable Object Names
3. Improved Scene / Outliner
4. Transform Controls Polish
5. Snapping
6. Camera Tools
7. Save / Load
8. Multi-select
9. Hierarchy

Do not skip ahead to hierarchy unless specifically requested.

New Chat Handoff Instructions

If continuing development in a new ChatGPT conversation, provide this README and say:

Continue CyBuilder from the current README checkpoint.

We are currently finished with the core editor foundation.

The next task is Visibility + Locking.

Do not implement hierarchy yet.

Review the existing files before changing architecture.

Give me the complete replacement file(s) when making changes, not just snippets.

Preserve all existing functionality unless the change specifically requires modifying it.

The assistant should first inspect the relevant existing files and then make the smallest clean change necessary.

Important Development Rule

When modifying existing files:

Do not remove existing object types.
Do not remove existing editor features.
Do not replace working functionality unnecessarily.
Preserve undo/redo behavior.
Preserve copy/paste behavior.
Preserve duplicate behavior.
Preserve transform transactions.
Keep TypeScript types consistent.
Prefer complete replacement files when requested.
Explain exactly which file each change belongs in.
Current Core Files

The three most important files at this checkpoint are:

src/scene/objectTypes.ts
src/context/EditorContext.tsx
src/components/EditorUI.tsx

Before making changes to any of these, use the current versions from the project rather than assuming an older version.

Checkpoint

Status:

CORE EDITOR FOUNDATION: COMPLETE

Next:

VISIBILITY + LOCKING

Deferred:

HIERARCHY / PARENTING


### One thing I'd change from our earlier discussion


I would **keep `parentId?: string` in `objectTypes.ts`**, but leave it unused for now. That gives us an easy path to hierarchy later without forcing us to implement it today.


**Current stopping point:**


> ✅ Core foundation done  
> ▶️ Next: **Visibility + Locking**  
> ⏸️ Hierarchy postponed