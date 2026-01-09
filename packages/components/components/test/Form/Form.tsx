"use client";

export interface FormStructure<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    FieldType extends Field<string, any>,
    FormFieldType extends FormField<string, FieldType> = FormField<string, FieldType>,
> {
    steps: FormStep<FieldType, FormFieldType>[];
}

interface FormStep<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    FieldType extends Field<string, any>,
    FormFieldType extends FormField<string, FieldType>,
> {
    rows: FormRow<FieldType, FormFieldType>[];
}

interface FormRow<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    FieldType extends Field<string, any>,
    FormFieldType extends FormField<string, FieldType>,
> {
    fields: FormFieldType[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface FormField<Name extends string, FieldType extends Field<string, any>> {
    name: Name;
    type: FieldType["type"];
    default: Parameters<FieldType["render"]>[0]["defaultValue"];
    error?: string;
}

export interface Field<Type extends string, Default> {
    type: Type;
    render: (props: { name: string; defaultValue: Default }) => React.ReactNode;
}

interface FormProps<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    FieldType extends Field<string, any>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    FormFieldType extends FormField<string, any>,
> {
    fields: FieldType[];
    structure: FormStructure<FieldType, FormFieldType>;
    onSubmit: (data: {
        [K in FormFieldType["name"]]: Parameters<
            Extract<FieldType, { type: Extract<FormFieldType, { name: K }>["type"] }>["render"]
        >[0]["defaultValue"];
    }) => void;
}

export const Form = <
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    FieldType extends Field<string, any>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    FormFieldType extends FormField<string, any>,
>({
    fields,
    structure: { steps },
}: FormProps<FieldType, FormFieldType>) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());
        console.log(data);
    };

    const handleChange = (e: React.ChangeEvent<HTMLFormElement>) => {
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        console.log(data);
    };

    const getField = (type: FieldType["type"]) => {
        return fields.find(field => field.type === type);
    };

    return (
        <form onSubmit={handleSubmit} onChange={handleChange}>
            {steps.map((step, index) => (
                <div key={index}>
                    {step.rows.map((row, index) => (
                        <div key={index}>
                            {row.fields.map((field, index) => {
                                const Field = getField(field.type);

                                if (!Field) {
                                    return null;
                                }

                                return (
                                    <div key={index}>
                                        <Field.render
                                            name={field.name}
                                            defaultValue={field.default}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            ))}
            <button type="submit">Submit</button>
        </form>
    );
};
