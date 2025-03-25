## Table of Contents

1. [Getting Started](#getting-started)

    1. [Install dependencies](#1-install-dependencies)
    2. [Create your fields](#2-create-your-fields)
    3. [Create a field component](#3-create-a-field-component)
    4. [Define your initial state](#4-define-your-initial-state)
    5. [Create a form config](#5-create-a-form-config)
    6. [Render the form](#6-render-the-form)

2. [Advanced usecases](#advanced-usecases)
    1. [Conditional fields](#conditional-fields)
3. [Guides](#guides)
    1. [Multistep](#multistep)

## Getting Started

### 1. Install dependencies

```
npm i --save @becklyn/forms
```

### 2. Create your fields

Start by building your form fields:

```typescript
interface BaseFieldConfig {
    placeholder: string;
    label?: string;
    maxLength?: number;
}

type StringFieldConfig = FormFieldConfig<"string", BaseFieldConfig, string | null>;
type NumberFieldConfig = FormFieldConfig<"number", BaseFieldConfig, number>;
type AllConfigs = StringFieldConfig | NumberFieldConfig;

interface TextProps extends BaseFieldConfig {
    id: string;
    name: string;
    value?: string | null;
    onBlur?: () => void;
    onValueChanged?: (value: string) => void;
}

const Text = ({ id, value, name, onBlur, onValueChanged, ...attributes }: TextProps) => {
    return (
        <input
            {...attributes}
            id={id}
            value={value ?? ""}
            name={name}
            onBlur={onBlur}
            type="text"
            onInput={e => onValueChanged && onValueChanged((e.target as HTMLInputElement).value)}
        />
    );
};

interface NumberProps extends BaseFieldConfig {
    id: string;
    name: string;
    value?: number;
    onBlur?: () => void;
    onValueChanged?: (value: number) => void;
}

const Number = ({ id, value, name, onBlur, onValueChanged, ...attributes }: NumberProps) => {
    return (
        <input
            {...attributes}
            id={id}
            value={value ?? ""}
            name={name}
            onBlur={onBlur}
            type="number"
            onInput={e =>
                onValueChanged && onValueChanged(parseFloat((e.target as HTMLInputElement).value))
            }
        />
    );
};
```

### 3. Create a field component

Create a single component to handle rendering all of your different input components. It will be called by the `FormBuilder` including the respective field's props.

```tsx
const FieldComponent: FC<FormBuilderChildrenProps<AllConfigs, Record<string, any>>> = ({
    value,
    field,
    onBlur,
    onInput,
}) => {
    const id = useId();

    switch (field.type) {
        case "string": {
            const { name, fieldConfig } = field;

            return (
                <Text
                    {...fieldConfig}
                    id={id}
                    value={value}
                    name={name}
                    onBlur={onBlur}
                    onValueChanged={onInput}
                />
            );
        }
        case "number": {
            const { name, fieldConfig } = field;

            return (
                <Number
                    {...fieldConfig}
                    id={id}
                    value={value}
                    name={name}
                    onBlur={onBlur}
                    onValueChanged={onInput}
                />
            );
        }
    }
};
```

### 4. Define your initial state

After defining all fields that your forms may use you can define the initial state of your specific form in a flat config (field name -> initial value):

```typescript
const initialState = {
    Firstname: generateInitialValue<StringFieldConfig>(""),
    Lastname: generateInitialValue<StringFieldConfig>(""),
    Age: generateInitialValue<NumberFieldConfig>(0),
};
```

### 5. Create a form config

Finally you can configure the structure of your form:

```typescript
const userFormConfig = [
    {
        type: "row",
        content: [
            {
                type: "string",
                name: "Firstname",
                fieldConfig: {
                    placeholder: "Enter your firstname",
                    label: "Firstname",
                },
            },
            {
                type: "string",
                name: "Lastname",
                valueFn: generateValueFn<FormData>(data => data.Lastname || "default value"),
                onInput: generateOnInput<StringFieldConfig, FormData>(
                    ({ field, value, previousData }) => {
                        console.log("value", value);
                        console.log("field", field);

                        return { ...previousData };
                    }
                ),
                fieldConfig: generateFormFieldConfigFn<StringFieldConfig, FormData>(
                    ({ data, value }) => {
                        console.log("data", data);
                        console.log("value", value);

                        return {
                            placeholder: "Enter your lastname",
                            label: "Lastname",
                        };
                    }
                ),
            },
        ],
    },
    {
        type: "number",
        name: "Age",
        fieldConfig: {
            placeholder: "Enter your age",
            label: "Age",
        },
    },
] as const satisfies FormConfig<AllConfigs, FormData>;
```

### 6. Render the form

To render your form config the FormBuilder needs to be a descendant of `FormProvider`. An implementation could look something like this where the majority can easily be abstracted.

```tsx
export const FormRenderer: React.FC = () => {
    return (
        <FormBuilder<AllConfigs, FormData>>{props => <FieldComponent {...props} />}</FormBuilder>
    );
};

export const UserFormHandler = () => {
    const { validateForm } = useForm();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formErrors = validateForm();

        if (formErrors) {
            return;
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <FormRenderer />
            <button type="submit">Submit</button>
        </form>
    );
};

export const Component = () => {
    return (
        <FormProvider<AllConfigs, typeof initialState>
            config={userFormConfig}
            initialData={initialState}>
            <UserFormHandler />
        </FormProvider>
    );
};
```

## Advanced usecases

### Usage without styled components

You can instantiate the `FormBuilder` with your custom components that do not rely on `styled-components`:

```typescript
export const FormRenderer: React.FC = () => {
    return (
        <FormBuilder<AllConfigs, FormData>
            Components={{
                BuilderWrapper: ({ children }: PropsWithChildren) => <div>{children}</div>,
                FieldWrapper: ({ children }: PropsWithChildren) => <div>{children}</div>,
                RowWrapper: ({ children }: PropsWithChildren) => <div>{children}</div>,
                SectionWrapper: ({ children }: PropsWithChildren) => <div>{children}</div>,
            }}>
            {props => <FieldComponent {...props} />}
        </FormBuilder>
    );
};
```

### Conditional fields

To help out with conditional rendering, a function called `eitherOr` is provided.

```typescript
const form = useMemo(() => {
    return [
        {
            type: "row",
            content: [
                eitherOr(
                    someCondition,
                    {
                        type: "string",
                        name: "email",
                        fieldConfig: {
                            placeholder: "Email address",
                            label: "Email",
                        },
                    },
                    {
                        type: "string",
                        name: "phone",
                        fieldConfig: {
                            placeholder: "Phone number",
                            label: "Phone",
                        },
                    }
                ),
                eitherOr(
                    someCondition && {
                        type: "string",
                        name: "phone",
                        fieldConfig: {
                            placeholder: "Phone number",
                            label: "Phone",
                        },
                    }
                ),
            ],
        },
    ] as const satisfies FormConfig<AllConfigs, FormData>;
}, [someCondition]);
```

## Guides

### Multistep

Multistep can be achieved easily and abstracted into a custom component. The concept is simple: there's one parent provider handling all data and a child provider per step reporting to the parent.
While this lib handles the data, validations etc., you must still handle the multistep logic yourself.

```tsx
const Step = () => {
    const { validateForm } = useForm<FormField>();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formErrors = validateForm();

        if (formErrors) {
            return;
        }

        // go to next step or submit form
    };

    return (
        <form onSubmit={handleSubmit}>
            <FormRenderer />
        </form>
    );
};

const MultiStep = () => {
    // your custom hook
    const { step } = useMultiStep();

    let config, initialData;

    switch (step) {
        case 1:
            config = firstStepConfig;
            initialData = initialFirstStepState;
            break;
        case 2:
            config = secondStepConfig;
            initialData = initialSecondStepState;
            break;
        case 3:
            config = thirdStepConfig;
            initialData = initialThirdStepState;
            break;
    }

    return (
        <FormProvider<AllConfigs, typeof initialData>
            config={config}
            initialData={initialData}
            inheritData>
            <Step />
        </FormProvider>
    );
};
```
