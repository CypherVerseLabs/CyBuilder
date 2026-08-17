/* =========================================
   CYBUILDER ASSET MANAGER
========================================= */

/*
 * Assets are deliberately kept OUTSIDE SceneObject.
 *
 * SceneObject stores URLs/paths.
 *
 * AssetManager stores the actual browser File.
 *
 * This lets the scene remain JSON serializable.
 */


/* =========================================
   TYPES
========================================= */

export type LocalAsset = {
  id: string;

  name: string;

  type: string;

  file: File;

  objectUrl: string;
};


/* =========================================
   ID
========================================= */

export function createAssetId(): string {

  return (
    "asset-" +
    Math.random()
      .toString(36)
      .slice(2, 12)
  );
}


/* =========================================
   OBJECT URL
========================================= */

export function createAssetObjectUrl(
  file: File
): string {

  return URL.createObjectURL(
    file
  );
}


/* =========================================
   LOCAL URL TEST
========================================= */

export function isLocalObjectUrl(
  value: unknown
): value is string {

  return (
    typeof value === "string" &&
    value.startsWith(
      "blob:"
    )
  );
}


/* =========================================
   REMOTE URL TEST
========================================= */

export function isRemoteUrl(
  value: unknown
): value is string {

  if (
    typeof value !== "string"
  ) {
    return false;
  }

  return (
    value.startsWith(
      "http://"
    ) ||
    value.startsWith(
      "https://"
    )
  );
}


/* =========================================
   ASSET FILE NAME
========================================= */

export function sanitizeAssetFileName(
  name: string
): string {

  const cleaned = Array.from(name)
    .filter((char) => {
      const code = char.charCodeAt(0);

      // Remove Windows-invalid filename characters
      if (
        char === "<" ||
        char === ">" ||
        char === ":" ||
        char === '"' ||
        char === "/" ||
        char === "\\" ||
        char === "|" ||
        char === "?" ||
        char === "*"
      ) {
        return false;
      }

      // Remove ASCII control characters 0x00–0x1F
      if (code >= 0x00 && code <= 0x1F) {
        return false;
      }

      return true;
    })
    .join("")
    .trim();

  return cleaned || "asset";
}