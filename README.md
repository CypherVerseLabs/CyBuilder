<br/>
<br/>

<p align="center">
    <img width="500" src="https://lbemedia.net/images/android-chrome-192x192.ico" alt="CyBuilder logo" />
</p>

<h3 align="center">
    CyBuilder
</h3>

<h5 align="center">
    A visual scene builder for the 3D Web.
</h5>

<div align="center">

[![cyengine](https://img.shields.io/npm/v/cyengine?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/cyengine)

[![License](https://img.shields.io/github/license/CypherVerseLabs/cyengine?style=flat&colorA=000000&colorB=000000)](https://github.com/CypherVerseLabs/cyengine)

</div>

<p align="center">
    <a href="https://cypherverse.space">www.cypherverse.space</a>
    ·
    <a href="https://github.com/CypherVerseLabs/cyengine">github</a>
    ·
    <a href="https://discord.gg/CrbfwhVVq">discord</a>
</p>

<br/>
<br/>

---

# CyBuilder

CyBuilder is a browser-based visual editor for building interactive 3D scenes on the Web.

It provides a data-driven scene editor on top of React, React Three Fiber, Three.js, Drei, and cyengine.

CyBuilder allows creators to:

- Add and remove scene objects
- Select objects in a 3D scene
- Edit transforms numerically
- Move, rotate, and scale objects
- Edit object-specific properties
- Duplicate objects
- Copy and paste objects
- Delete objects
- Organize objects using parent/child relationships
- Undo and redo scene changes
- Manage local assets
- Save projects to `.cybuilder` files
- Load `.cybuilder` projects
- Toggle the editor on and off
- Create scenes from reusable Idea definitions

The editor is designed as an authoring layer around the underlying 3D runtime.

---

# Project Status

## Current Stage

> **Core editor foundation is implemented.**

The current editor includes:

- Scene object system
- Scene state management
- Object selection
- Scene hierarchy / outliner
- Object inspector
- Position editing
- Rotation editing
- Scale editing
- Translate mode
- Rotate mode
- Scale mode
- Object-specific property editing
- Add-object Ideas panel
- Categorized Ideas
- Object deletion
- Object duplication
- Copy / paste
- Undo / redo
- Transform transactions
- Runtime editor toggle
- Collapsible editor panel
- Parent / child relationships
- Local asset management
- Scene save
- Scene load
- `.cybuilder` project files
- Asset embedding inside project files
- Scene restoration from saved projects

---

# Editor Structure

The editor is centered around three major systems:

```text
EditorReality
    │
    ├── EditorProvider
    │
    ├── Scene
    │
    └── EditorUI