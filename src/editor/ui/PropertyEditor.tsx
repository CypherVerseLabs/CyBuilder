import {
  CSSProperties,
  ReactNode,
} from "react";

import {
  SceneObject,
} from "../scene/objectTypes";

import {
  AnyIdeaDefinition,
  IdeaField,
  IdeaArrayItemType,
} from "../ideas";


/* =========================================
   TYPES
========================================= */

type PropertyEditorProps = {
  object: SceneObject;

  definition: AnyIdeaDefinition;

  onChange: (
    object: SceneObject
  ) => void;
};


/* =========================================
   PROPERTY EDITOR
========================================= */

export default function PropertyEditor({
  object,
  definition,
  onChange,
}: PropertyEditorProps) {

  /* -----------------------------------------
     UPDATE PROPERTY
  ----------------------------------------- */

  const updateProp = (
    key: string,
    value: unknown
  ) => {

    onChange({
      ...object,

      props: {
        ...object.props,

        [key]: value,
      },

    } as SceneObject);
  };


  /* -----------------------------------------
     RENDER
  ----------------------------------------- */

  return (
    <div>

      {definition.schema.map(
        (field) => {

          const value = (
            object.props as Record<
              string,
              unknown
            >
          )[field.name];


          return (
            <PropertyField
              key={field.name}

              field={field}

              value={value}

              onChange={(
                nextValue
              ) =>
                updateProp(
                  field.name,
                  nextValue
                )
              }
            />
          );
        }
      )}

    </div>
  );
}


/* =========================================
   PROPERTY FIELD
========================================= */

function PropertyField({
  field,
  value,
  onChange,
}: {
  field: IdeaField;

  value: unknown;

  onChange: (
    value: unknown
  ) => void;
}) {

  const label =
    field.label ??
    field.name;


  switch (field.type) {

    /* ---------------------------------------
       BOOLEAN
    --------------------------------------- */

    case "boolean":

      return (
        <Checkbox
          label={label}

          checked={
            Boolean(value)
          }

          onChange={
            onChange
          }
        />
      );


    /* ---------------------------------------
       COLOR
    --------------------------------------- */

    case "color":

      return (
        <ColorInput
          label={label}

          value={
            String(
              value ??
              "#ffffff"
            )
          }

          onChange={
            onChange
          }
        />
      );


    /* ---------------------------------------
       NUMBER
    --------------------------------------- */

    case "number":
    case "float":
    case "integer":
    case "radius":

      return (
        <NumberInput
          label={label}

          value={
            Number(
              value ?? 0
            )
          }

          integer={
            field.type ===
            "integer"
          }

          step={
            field.step
          }

          onChange={
            onChange
          }
        />
      );


    /* ---------------------------------------
       VECTOR 2
    --------------------------------------- */

    case "vector2":

      return (
        <Vector2Input
          label={label}

          value={
            toVector2(
              value
            )
          }

          step={
            field.step
          }

          onChange={
            onChange
          }
        />
      );


    /* ---------------------------------------
       ARRAY
    --------------------------------------- */

    case "array":

      return (
        <ArrayInput
          label={label}

          value={
            Array.isArray(
              value
            )
              ? value
              : []
          }

          itemType={
            field.itemType ??
            "string"
          }

          step={
            field.step
          }

          onChange={
            onChange
          }
        />
      );


    /* ---------------------------------------
       STRING / ASSET
    --------------------------------------- */

    case "string":
    case "image":
    case "video":
    case "audio":
    case "gltf":

      return (
        <TextInput
          label={label}

          value={
            String(
              value ?? ""
            )
          }

          placeholder={
            field.placeholder
          }

          onChange={
            onChange
          }
        />
      );


    /* ---------------------------------------
       UNKNOWN
    --------------------------------------- */

    default:

      return null;
  }
}


/* =========================================
   VECTOR 2
========================================= */

function toVector2(
  value: unknown
): [number, number] {

  if (
    Array.isArray(value) &&
    value.length >= 2
  ) {

    const x =
      Number(value[0]);

    const y =
      Number(value[1]);


    return [

      Number.isFinite(x)
        ? x
        : 0,

      Number.isFinite(y)
        ? y
        : 0,

    ];
  }


  return [
    0,
    0,
  ];
}


/* =========================================
   VECTOR 2 INPUT
========================================= */

function Vector2Input({
  label,
  value,
  step = 0.01,
  onChange,
}: {
  label: string;

  value: [
    number,
    number
  ];

  step?: number;

  onChange: (
    value: [
      number,
      number
    ]
  ) => void;
}) {

  const updateAxis = (
    axis: 0 | 1,
    nextValue: number
  ) => {

    const next: [
      number,
      number
    ] = [
      ...value,
    ];

    next[axis] =
      nextValue;


    onChange(
      next
    );
  };


  return (
    <div
      style={{
        marginBottom: 10,
      }}
    >

      <FieldLabel>
        {label}
      </FieldLabel>


      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(2, 1fr)",

          gap: 5,
        }}
      >

        <input
          type="number"

          step={step}

          value={
            value[0]
          }

          onChange={(
            event
          ) => {

            const next =
              Number(
                event.target.value
              );


            if (
              Number.isFinite(
                next
              )
            ) {

              updateAxis(
                0,
                next
              );
            }
          }}

          aria-label={
            `${label} X`
          }

          style={
            inputStyle
          }
        />


        <input
          type="number"

          step={step}

          value={
            value[1]
          }

          onChange={(
            event
          ) => {

            const next =
              Number(
                event.target.value
              );


            if (
              Number.isFinite(
                next
              )
            ) {

              updateAxis(
                1,
                next
              );
            }
          }}

          aria-label={
            `${label} Y`
          }

          style={
            inputStyle
          }
        />

      </div>

    </div>
  );
}


/* =========================================
   ARRAY INPUT
========================================= */

function ArrayInput({
  label,
  value,
  itemType,
  step,
  onChange,
}: {
  label: string;

  value: unknown[];

  itemType:
    IdeaArrayItemType;

  step?: number;

  onChange: (
    value: unknown[]
  ) => void;
}) {

  /* -----------------------------------------
     UPDATE ITEM
  ----------------------------------------- */

  const updateItem = (
    index: number,
    nextValue: unknown
  ) => {

    const next =
      [...value];

    next[index] =
      nextValue;


    onChange(
      next
    );
  };


  /* -----------------------------------------
     ADD ITEM
  ----------------------------------------- */

  const addItem = () => {

    onChange([
      ...value,

      getDefaultArrayValue(
        itemType
      ),
    ]);
  };


  /* -----------------------------------------
     REMOVE ITEM
  ----------------------------------------- */

  const removeItem = (
    index: number
  ) => {

    onChange(
      value.filter(
        (
          _,
          itemIndex
        ) =>
          itemIndex !==
          index
      )
    );
  };


  return (
    <div
      style={{
        marginBottom: 12,
      }}
    >

      <FieldLabel>
        {label}
      </FieldLabel>


      {value.map(
        (
          item,
          index
        ) => (

          <div
            key={index}

            style={{
              display:
                "flex",

              gap: 5,

              marginBottom:
                5,
            }}
          >

            <div
              style={{
                flex: 1,
              }}
            >

              <ArrayItemInput
                itemType={
                  itemType
                }

                value={
                  item
                }

                step={
                  step
                }

                onChange={(
                  nextValue
                ) =>
                  updateItem(
                    index,
                    nextValue
                  )
                }
              />

            </div>


            <button
              type="button"

              onClick={() =>
                removeItem(
                  index
                )
              }

              style={{
                width: 28,

                border: 0,

                borderRadius: 5,

                background:
                  "#6f2525",

                color:
                  "#fff",

                cursor:
                  "pointer",
              }}

              aria-label={
                `Remove ${label} item ${
                  index + 1
                }`
              }
            >
              ×
            </button>

          </div>
        )
      )}


      <button
        type="button"

        onClick={
          addItem
        }

        style={{
          width:
            "100%",

          padding:
            "7px 8px",

          border: 0,

          borderRadius: 6,

          background:
            "#292930",

          color:
            "#fff",

          cursor:
            "pointer",

          fontSize: 11,
        }}
      >
        + Add
      </button>

    </div>
  );
}


/* =========================================
   ARRAY ITEM INPUT
========================================= */

function ArrayItemInput({
  itemType,
  value,
  step,
  onChange,
}: {
  itemType:
    IdeaArrayItemType;

  value: unknown;

  step?: number;

  onChange: (
    value: unknown
  ) => void;
}) {

  switch (itemType) {

    /* ---------------------------------------
       NUMBERS
    --------------------------------------- */

    case "number":
    case "float":
    case "integer":
    case "radius":

      return (
        <input
          type="number"

          step={
            step ??
            (
              itemType ===
              "integer"
                ? 1
                : 0.01
            )
          }

          value={
            Number(
              value ?? 0
            )
          }

          onChange={(
            event
          ) => {

            const next =
              Number(
                event.target.value
              );


            if (
              Number.isFinite(
                next
              )
            ) {

              onChange(
                itemType ===
                "integer"

                  ? Math.round(
                      next
                    )

                  : next
              );
            }
          }}

          style={
            inputStyle
          }
        />
      );


    /* ---------------------------------------
       BOOLEAN
    --------------------------------------- */

    case "boolean":

      return (
        <label
          style={{
            display:
              "flex",

            alignItems:
              "center",

            gap: 8,

            minHeight:
              32,

            fontSize: 11,
          }}
        >

          <input
            type="checkbox"

            checked={
              Boolean(
                value
              )
            }

            onChange={(
              event
            ) =>
              onChange(
                event.target
                  .checked
              )
            }
          />

          {value
            ? "True"
            : "False"}

        </label>
      );


    /* ---------------------------------------
       COLOR
    --------------------------------------- */

    case "color":

      return (
        <input
          type="color"

          value={
            String(
              value ??
              "#ffffff"
            )
          }

          onChange={(
            event
          ) =>
            onChange(
              event.target
                .value
            )
          }

          style={{
            width:
              "100%",

            height:
              32,

            border: 0,

            padding: 0,

            background:
              "transparent",

            cursor:
              "pointer",
          }}
        />
      );


    /* ---------------------------------------
       STRING
    --------------------------------------- */

    default:

      return (
        <input
          value={
            String(
              value ?? ""
            )
          }

          onChange={(
            event
          ) =>
            onChange(
              event.target
                .value
            )
          }

          style={
            inputStyle
          }
        />
      );
  }
}


/* =========================================
   ARRAY DEFAULT
========================================= */

function getDefaultArrayValue(
  itemType:
    IdeaArrayItemType
): unknown {

  switch (itemType) {

    case "boolean":
      return false;


    case "number":
    case "float":
    case "integer":
    case "radius":
      return 0;


    case "color":
      return "#ffffff";


    default:
      return "";
  }
}


/* =========================================
   TEXT INPUT
========================================= */

function TextInput({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;

  value: string;

  placeholder?: string;

  onChange: (
    value: string
  ) => void;
}) {

  return (
    <div
      style={{
        marginBottom: 10,
      }}
    >

      <FieldLabel>
        {label}
      </FieldLabel>


      <input
        value={
          value
        }

        placeholder={
          placeholder
        }

        onChange={(
          event
        ) =>
          onChange(
            event.target
              .value
          )
        }

        style={
          inputStyle
        }
      />

    </div>
  );
}


/* =========================================
   NUMBER INPUT
========================================= */

function NumberInput({
  label,
  value,
  integer = false,
  step,
  onChange,
}: {
  label: string;

  value: number;

  integer?: boolean;

  step?: number;

  onChange: (
    value: number
  ) => void;
}) {

  return (
    <div
      style={{
        marginBottom: 10,
      }}
    >

      <FieldLabel>
        {label}
      </FieldLabel>


      <input
        type="number"

        step={
          step ??
          (
            integer
              ? 1
              : 0.01
          )
        }

        value={
          value
        }

        onChange={(
          event
        ) => {

          const next =
            Number(
              event.target.value
            );


          if (
            Number.isFinite(
              next
            )
          ) {

            onChange(
              integer
                ? Math.round(
                    next
                  )
                : next
            );
          }
        }}

        style={
          inputStyle
        }
      />

    </div>
  );
}


/* =========================================
   COLOR INPUT
========================================= */

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;

  value: string;

  onChange: (
    value: string
  ) => void;
}) {

  return (
    <div
      style={{
        marginBottom: 10,
      }}
    >

      <FieldLabel>
        {label}
      </FieldLabel>


      <input
        type="color"

        value={
          value
        }

        onChange={(
          event
        ) =>
          onChange(
            event.target
              .value
          )
        }

        style={{
          width:
            "100%",

          height:
            36,

          border: 0,

          padding: 0,

          background:
            "transparent",

          cursor:
            "pointer",
        }}
      />

    </div>
  );
}


/* =========================================
   CHECKBOX
========================================= */

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;

  checked: boolean;

  onChange: (
    value: boolean
  ) => void;
}) {

  return (
    <label
      style={{
        display:
          "flex",

        alignItems:
          "center",

        gap: 8,

        fontSize: 11,

        marginTop: 8,

        marginBottom: 10,

        cursor:
          "pointer",
      }}
    >

      <input
        type="checkbox"

        checked={
          checked
        }

        onChange={(
          event
        ) =>
          onChange(
            event.target
              .checked
          )
        }
      />

      {label}

    </label>
  );
}


/* =========================================
   FIELD LABEL
========================================= */

function FieldLabel({
  children,
}: {
  children:
    ReactNode;
}) {

  return (
    <label
      style={{
        display:
          "block",

        fontSize:
          11,

        opacity:
          0.65,

        marginBottom:
          5,
      }}
    >
      {children}
    </label>
  );
}


/* =========================================
   INPUT STYLE
========================================= */

const inputStyle:
  CSSProperties = {

  boxSizing:
    "border-box",

  width:
    "100%",

  padding:
    "7px 8px",

  borderRadius:
    6,

  border:
    "1px solid rgba(255,255,255,0.12)",

  background:
    "rgba(255,255,255,0.06)",

  color:
    "#ffffff",

  outline:
    "none",
};