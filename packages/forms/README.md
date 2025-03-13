## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
    1. [Install dependencies](#1-install-dependencies)
    2. [Create a field component](#2-create-a-field-component)
    3. [Create a form config](#3-create-a-form-config)
    4. [Render the form](#4-render-the-form)
3. [Typescript](#typescript)
    1. [Providing your own types](#providing-your-own-types)
        1. [Define the field config](#1-define-the-field-config)
        2. [Build intermediate type](#2-build-intermediate-type)
        3. [Patch form fields](#3-patch-form-fields)
    2. [Infer form config](#infer-form-config)
4. [Guides](#guides)
    1. [Multistep](#multistep)

## Introduction

This form lib is most likely overkill if your project requires a single static form with a few fields. If your project is build on highly dynamic forms it will help you to abstract most of the UI part and logic while keeping everything consistent.

It does so by following a config first approach. The idea is that after your first form, the following are created by writing a `FormConfig` only - something like this for a form with a single email input field:

```typescript
export const forgotPasswordFormConfig = createFormConfig([
    {
        type: "text",
        name: "email",
        validations: [
            {
                validation: validateEmail,
            },
        ],
        fieldConfig: {
            placeholder: "E-Mail Adresse",
        },
    },
]);
```

## Getting Started

### 1. Install dependencies

```
npm i --save @becklyn/forms
```

### 2. Create a field component

Create a single component to handle rendering all of your different input components. It will be called by the `FormBuilder` including the respective field's props.

```tsx
export const FieldComponent: React.FC<FormBuilderChildrenProps<FieldTypes>> = ({
    value,
    error,
    field,
    onInput,
    onBlur,
}) => {
    const id = useId();

    switch (field.type) {
        case "text": {
            const { name, fieldConfig } = field;
            return (
                <Text
                    {...fieldConfig}
                    id={id}
                    name={name}
                    value={value}
                    error={error}
                    onValueChanged={onInput}
                    onBlur={onBlur}
                />
            );
        }
        case "select": {
            const { name, fieldConfig } = field;
            return (
                <Select
                    {...fieldConfig}
                    id={id}
                    value={value}
                    error={error}
                    onBlur={onBlur}
                    onSelect={onInput}
                />
            );
        }
    }
};
```

### 3. Create a form config

```typescript
export const forgotPasswordFormConfig = createFormConfig([
    {
        type: "text",
        name: "email",
        validations: [
            {
                validation: validateEmail,
            },
        ],
        fieldConfig: {
            placeholder: "E-Mail Adresse",
        },
    },
]);
```

### 4. Render the form

To render your form config the FormBuilder needs to be a descendant of `FormProvider` (or a component using `withForm`). An implementation could look something like this where the majority can easily be abstracted.

```tsx
// the form renderer can be reused to render all kinds of forms
export const FormRenderer: React.FC = () => {
    return <FormBuilder>{props => <FieldComponent {...props} />}</FormBuilder>;
};

export const LoginFormHandler = withForm(() => {
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
});

export const SomeComponent: React.FC = () => {
    return <LoginFormHandler config={forgotPasswordFormConfig} />;
};
```

## Typescript

### Providing your own types

Each field comes with default props (e.g `id`, `value`, `onValueChanged`), however it is also possible to pass additional props via `fieldConfig` that are relevant based on the type of the field (e.g `maxLength` for a text input).

#### 1. Define the field config

Your fields should export a config interface that includes all the specific props for that field:

```typescript
export interface TextFieldConfig {
    placeholder: string;
    label?: string;
    maxLength?: number;
}
```

#### 2. Build intermediate type

Create an intermediate type that forms can consume:

```typescript
export type FormFieldText = FormFieldConfig<"text", TextFieldConfig, string>;
```

The first parameter specifies to which field the fieldConfig will be applied. Here `"text"` means that in your config, if you add `type: "text"`, the `fieldConfig` will expect props specified in `TextFieldConfig`.

The third generic parameter in `FormFieldConfig` is the type of allowed values this field can handle.

Its useful to build a type that unifies all your fields:

```typescript
export type FormFieldText = FormFieldConfig<"text", TextFieldConfig, string>;
export type FormFieldNumber = FormFieldConfig<"number", NumberFieldConfig, number>;
export type FormFieldSelect = FormFieldConfig<
    "select",
    SelectFieldConfig,
    { id: string; value: string }
>;
export type FormField = FormFieldText | FormFieldNumber | FormFieldSelect;
```

### Infer form config

To be able to infer a form config's type <ins>it must be readonly</ins>. You can use the following helper to infer your config:

```typescript
type ForgotPasswordConfig = FormInfer<typeof forgotPasswordFormConfig>;
```

<b>In case your types are not inferred correctly, immutability should be checked first:</b>

- Make sure you do not assert a type
- Object literals must be readonly
- Array literals must be readonly tuples

While this is true using `createFormConfig`, parts of your config that are rendered conditionally or created with a custom util function such as `createArray` might not be caught if not done properly. For custom functions make sure you are using generic type assertion with `const`. To help out with conditional rendering, a function called `eitherOr` is provided.

```typescript
useMemo(() => {
    return createFormConfig<FormField>([
        // Render a or b
        eitherOr(
            someCondition,
            {
                type: "text",
                name: "email",
                fieldConfig: {
                    placeholder: "E-Mail Adresse",
                },
            },
            {
                type: "text",
                name: "phone",
                fieldConfig: {
                    placeholder: "Telefonnummer",
                },
            }
        ),
        // Render a conditionally
        eitherOr(
            someCondition && {
                type: "text",
                name: "phone",
                fieldConfig: {
                    placeholder: "Telefonnummer",
                },
            }
        ),
    ]);
}, [someCondition]);
```

The `FormBuilder` is generic, too:

```typescript
export const FormRenderer: React.FC = () => {
    return <FormBuilder<FieldTypes>>{props => <FieldComponent {...props} />}</FormBuilder>;
};
```

## Guides

### Multistep

Multistep can be achieved easily and abstracted into a custom component. The concept is simple: there's one parent provider handling all data and a child provider per step reporting to the parent.
While this lib handles the data, validations etc., you must still handle the multistep logic yourself.

```tsx
const Step = withForm<FormField>(() => {
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
});

const MultiStep = withForm<FormField>(() => {
    // your custom hook
    const { step } = useMultiStep();

    switch (step) {
        case 1:
            return <Step config={firstStepConfig} inheritData />;
        case 2:
            return <Step config={secondStepConfig} inheritData />;
        case 3:
            return <Step config={thirdStepConfig} inheritData />;
    }
});
```
