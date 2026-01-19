import { RenderFieldProps, getFieldComponent } from "./structure";
import { DefaultValue, FieldComponent } from "./types";

type DataField<FieldType extends FieldComponent<string, DefaultValue>> =
    | {
          name: string;
          type: FieldType["type"];
      }
    | {
          name: string;
          render: (props: RenderFieldProps) => React.ReactNode;
      };

export type DataStructure<FieldType extends FieldComponent<string, DefaultValue>> = {
    steps: readonly {
        fields: readonly DataField<FieldType>[];
    }[];
};

export type TypedFormData<
    FieldType extends FieldComponent<string, DefaultValue>,
    Structure extends DataStructure<FieldType>,
> = {
    [K in Structure["steps"][number]["fields"][number]["name"]]: Parameters<
        Extract<
            FieldType,
            {
                type: Extract<
                    Structure["steps"][number]["fields"][number],
                    { name: K; type: string }
                >["type"];
            }
        >["render"]
    >[0]["defaultValue"];
};

const getFieldTypeFromStructure = <FieldType extends FieldComponent<string, DefaultValue>>(
    structure: DataStructure<FieldType>,
    name: string
): FieldComponent<string, DefaultValue>["type"] | null => {
    const { steps } = structure;

    if (typeof steps === "string") {
        return null;
    }

    for (const step of steps) {
        for (const field of step.fields) {
            if (field.name === name && "type" in field) {
                return field.type;
            }
        }
    }

    return null;
};

export const parseFormData = <
    FieldType extends FieldComponent<string, DefaultValue>,
    Structure extends DataStructure<FieldType>,
>(
    structure: Structure,
    fields: FieldType[],
    formData: FormData
): TypedFormData<FieldType, Structure> => {
    type FormFieldType = Structure["steps"][number]["fields"][number];
    const formEntryData = Object.fromEntries(formData.entries());

    const data: Partial<TypedFormData<FieldType, Structure>> = {};

    for (const key of Object.keys(formEntryData)) {
        const value = formEntryData[key];

        if (!value) {
            continue;
        }

        const fieldType = getFieldTypeFromStructure(structure, key);

        if (!fieldType) {
            continue;
        }

        const fieldComponent = getFieldComponent(fields, fieldType);

        if (!fieldComponent) {
            continue;
        }

        data[key as FormFieldType["name"]] = fieldComponent.parseValue(value);
    }

    return data as TypedFormData<FieldType, Structure>;
};
