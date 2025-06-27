import { HStack } from "../ui/hstack";
import { VStack } from "../ui/vstack";
import { FormField, IField } from "./FormField";
import { Heading } from "../ui/heading";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useReducer,
} from "react";
import { z, ZodObject } from "zod";

enum ACTION_TYPE {
  UPDATE_FIELD = "update_field",
  SET_ERROR = "set_error",
  RESET = "reset",
}


type Action =
  | {
      type: ACTION_TYPE.UPDATE_FIELD;
      field: string;
      value: any;
    }
  | {
      type: ACTION_TYPE.RESET;
      payload: Record<string, { value: string; error?: string }>;
    }
  | {
      type: ACTION_TYPE.SET_ERROR;
      field: string;
      error?: string;
    };



const dynamicFromReducer = (
  state: Record<string, { value: any; error?: string }>,
  action: Action
) => {
  switch (action.type) {
    case ACTION_TYPE.UPDATE_FIELD:
      return {
        ...state,
        [action.field]: {
          value: action.value,
          error: state[action.field]?.error,
        },
      };
    case ACTION_TYPE.SET_ERROR:
      return {
        ...state,
        [action.field]: {
          value: state[action.field]?.value,
          error: action?.error,
        },
      };
    case ACTION_TYPE.RESET: {
     
      return {
        ...Object.fromEntries(
          Object.entries(state).map(([field, value]) => [
            field,
            { ...value, value: undefined },
          ])
        ),
      };
    }
    default:
      return state;
  }
};


export type FormSchema = {
  fields: IField[];
  section?: string;
}[];

type ExtractFieldNames<T extends FormSchema> =
  T[number]["fields"][number]["name"];
type BuildZodShape<Keys extends string> = {
  [K in Keys]: z.ZodTypeAny;
};
export type SchemaConstraint<IFormSchema extends FormSchema> = ZodObject<
  BuildZodShape<ExtractFieldNames<IFormSchema>>
>;

export type DynamicFormZodSchemaType =
  | {
      validate: (
        data: any
      ) => { success: false; error: z.ZodError } | { success: true; data: any };
    }
  | z.ZodObject<any, any, any, any>;


export interface DynamicFormGeneratorProps<T extends FormSchema> {
  schema: T;
  zodSchema?: DynamicFormZodSchemaType | SchemaConstraint<T>;
  className?: string;
}


export interface FormHandler<T extends FormSchema> {
  submit: () => Promise<z.infer<SchemaConstraint<T>> | null>;
  reset: () => void;
}




export const DynamicFormGenerator = forwardRef(
  <T extends FormSchema>(
    { schema, zodSchema, className }: DynamicFormGeneratorProps<T>,
    ref: React.Ref<FormHandler<T>>
  ) => {

    const [formState, dispatchFromState] = useReducer(
      dynamicFromReducer,
      Object.fromEntries(
        schema
          .flatMap(section => section.fields)
          .map(field => [
            field.name,
            { value: field.default, error: undefined },
          ])
      )
    );


    const handleFieldChange = (fieldName: ExtractFieldNames<T>, value: any) => {
      dispatchFromState({
        type: ACTION_TYPE.UPDATE_FIELD,
        field: fieldName,
        value,
      });
      dispatchFromState({
        type: ACTION_TYPE.SET_ERROR,
        field: fieldName,
        error: undefined,
      });
    };


    const submit = useCallback(async (): Promise<z.infer<
      SchemaConstraint<T>
    > | null> => {
      const formData = Object.fromEntries(
        Object.entries(formState).map(value => [value[0], value[1].value])
      ) as z.infer<SchemaConstraint<T>>;
      if (zodSchema) {
        const result =
          "safeParse" in zodSchema
            ? zodSchema.safeParse(formData)
            : zodSchema.validate(formData);
        if (!result.success) {
          result.error.errors.forEach(err => {
            err.path.forEach(path =>
              dispatchFromState({
                type: ACTION_TYPE.SET_ERROR,
                field: path as string,
                error: err.message,
              })
            );
          });
          return null;
        } else {
          Object.keys(formData).map(keys => {
            dispatchFromState({
              type: ACTION_TYPE.SET_ERROR,
              field: keys,
              error: undefined,
            });
          });
        }
        return result.data;
      }
      return formData;
    }, [formState, zodSchema]);


    const reset = () => {
      dispatchFromState({ type: ACTION_TYPE.RESET, payload: {} });
    };


    useImperativeHandle(ref, () => ({ submit, reset }), [submit]);


    
    return (
      <VStack
        className={
          "w-full flex-1 gap-y-4 bg-background-secondary px-4 py-v-4" +
          className
        }
      >
        {schema.map((section, sectionIndex) => {
          return (
            <VStack
              key={sectionIndex}
              className={
                "w-full gap-v-2 rounded-xl bg-background-primary px-3 py-v-3"
              }
            >
              {section.section && (
                <HStack className={"items-center gap-2"}>
                  <Heading
                    className={"font-h4 text-base font-medium text-primary-c"}
                  >
                    {section.section}
                  </Heading>
                </HStack>
              )}

              {section.fields.map((field, fieldIndex) => {
                return (
                  <FormField
                    key={fieldIndex}
                    field={field}
                    onChange={handleFieldChange}
                    value={formState[field.name]?.value}
                    error={formState[field.name]?.error}
                  />
                );
              })}
            </VStack>
          );
        })}
      </VStack>
    );
  }
);
