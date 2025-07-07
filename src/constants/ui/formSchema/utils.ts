import {
  AnthroSystemCodes,
  DAY_IN_MONTHS,
  DAY_IN_YEARS,
} from "@/core/constants";
import z from "zod";
import {
  BirthDateField,
  dateZodSchema,
  HeadCircumferenceField,
  HeadCircumferenceZodSchema,
  HeightField,
  HeightZodSchema,
  LengthField,
  LengthZodSchema,
  MUACField,
  MUACZodSchema,
  RegisterDateField,
  SSFField,
  SSFZodSchema,
  TSFField,
  TSFZodSchema,
  WeightField,
  WeightZodSchema,
} from "./sharedAnthropometricDataForm";
import { IField } from "@/components/custom/FormField";
import { parse } from "@babel/core";

// Fonction utilitaire pour rendre un schema optionnel obligatoire
export const makeRequired = <T extends z.ZodTypeAny>(
  schema: z.ZodOptional<T>
): T => {
  return schema.unwrap();
};

// Fonction utilitaire pour rendre un schema obligatoire optionnel
export const makeOptional = <T extends z.ZodTypeAny>(
  schema: T
): z.ZodOptional<T> => {
  return schema.optional();
};

export function getAnthropDataFormSchemaWithCode(code: AnthroSystemCodes) {
  switch (code) {
    case AnthroSystemCodes.WEIGHT: {
      return {
        code: code,
        field: WeightField,
        zodSchema: z.object({
          [AnthroSystemCodes.WEIGHT]: WeightZodSchema.optional(),
        }),
      };
    }
    case AnthroSystemCodes.LENGTH: {
      return {
        code,
        field: LengthField,
        zodSchema: z.object({ [AnthroSystemCodes.LENGTH]: LengthZodSchema }),
      };
    }
    case AnthroSystemCodes.HEIGHT: {
      return {
        code,
        field: HeightField,
        zodSchema: z.object({ [AnthroSystemCodes.HEIGHT]: HeightZodSchema }),
      };
    }
    case AnthroSystemCodes.MUAC: {
      return {
        code,
        field: MUACField,
        zodSchema: z.object({ [AnthroSystemCodes.MUAC]: MUACZodSchema }),
      };
    }
    case AnthroSystemCodes.HEAD_CIRCUMFERENCE: {
      return {
        code,
        field: HeadCircumferenceField,
        zodSchema: z.object({
          [AnthroSystemCodes.HEAD_CIRCUMFERENCE]: HeadCircumferenceZodSchema,
        }),
      };
    }
    case AnthroSystemCodes.SSF: {
      return {
        code,
        field: SSFField,
        zodSchema: z.object({ [AnthroSystemCodes.SSF]: SSFZodSchema }),
      };
    }
    case AnthroSystemCodes.TSF: {
      return {
        code,
        field: TSFField,
        zodSchema: z.object({ [AnthroSystemCodes.TSF]: TSFZodSchema }),
      };
    }
    case AnthroSystemCodes.LENHEI: {
      return {
        code: AnthroSystemCodes.LENHEI,
        field: [LengthField, HeightField],
        zodSchema: z
          .object({
            [AnthroSystemCodes.HEIGHT]: makeOptionalSchema(HeightZodSchema),
            [AnthroSystemCodes.LENGTH]: makeOptionalSchema(LengthZodSchema),
          })
          .refine(
            data => {
              if (
                data[AnthroSystemCodes.LENGTH] &&
                data[AnthroSystemCodes.HEIGHT]
              ) {
                return false;
              }
              return (
                data[AnthroSystemCodes.LENGTH] || data[AnthroSystemCodes.HEIGHT]
              );
            },
            {
              message:
                "Juste une taille des deux doit être fournir, soit la taille couchée soit la taille debout.",
              path: [AnthroSystemCodes.HEIGHT, AnthroSystemCodes.LENGTH],
            }
          )
          .transform(data => {
            const measure =
              data[AnthroSystemCodes.HEIGHT] ||
              (data[
                AnthroSystemCodes.LENGTH
              ] as (typeof data)[AnthroSystemCodes.HEIGHT]) ||
              data[AnthroSystemCodes.LENGTH]!;
            return {
              [AnthroSystemCodes.LENHEI]: {
                code: AnthroSystemCodes.LENHEI,
                value: measure.value,
                unit: measure.unit,
              },
              ...(data[AnthroSystemCodes.HEIGHT] && {
                [AnthroSystemCodes.HEIGHT]: data[AnthroSystemCodes.HEIGHT],
              }),
              ...(data[AnthroSystemCodes.LENGTH] && {
                [AnthroSystemCodes.LENGTH]: data[AnthroSystemCodes.LENGTH],
              }),
            };
          }),
      };
    }
    case AnthroSystemCodes.AGE_IN_DAY:
    case AnthroSystemCodes.AGE_IN_MONTH: {
      return {
        code: AnthroSystemCodes.AGE_IN_MONTH,
        field: [BirthDateField, RegisterDateField],
        zodSchema: z
          .object({
            birthDate: dateZodSchema(
              "La date de naissance est invalide.",
              "birthDate"
            ),
            registerDate: dateZodSchema(
              "La date d'enregistrement est invalide.",
              "registerData"
            ),
          })
          .transform(data => {
            const date1 = new Date(data.birthDate);
            const date2 = new Date(data.registerDate);
            const diffInMs = date2.getTime() - date1.getTime();
            const dayAfterBirthDay = diffInMs / (1000 * 60 * 60 * 24);
            const monthAfterBirthDay = dayAfterBirthDay / DAY_IN_MONTHS;
            const yearAfterBirthDay = dayAfterBirthDay / DAY_IN_YEARS;
            return {
              [AnthroSystemCodes.AGE_IN_DAY]: dayAfterBirthDay,
              [AnthroSystemCodes.AGE_IN_MONTH]: monthAfterBirthDay,
            };
          }),
      };
    }
    default: {
      console.warn("This Measure is not supported for the moment.");
      return null;
    }
  }
}

export function validateWithSchemaPipeline(
  input: Record<string, unknown>,
  schemas: z.ZodTypeAny[]
): { success: true; data: any } | { success: false; error: z.ZodError } {
  const finalData: Record<string, unknown> = {};
  const allIssues: z.ZodIssue[] = [];

  for (const schema of schemas) {
    const parsed = schema.safeParse(input);
    if (!parsed.success) {
      console.log(parsed,input)
      allIssues.push(...parsed.error.issues);
    } else {
      Object.assign(finalData, parsed.data);
    }
  }

  if (allIssues.length > 0) {
    return { success: false, error: new z.ZodError(allIssues) };
  }

  return { success: true, data: finalData };
}

export function makeOptionalSchema<T extends z.ZodTypeAny>(
  schema: T
): z.ZodTypeAny {
  if (schema instanceof z.ZodEffects) {
    // Récupérer la partie interne et reconstituer le ZodEffects optionnel
    const inner = schema._def.schema;

    switch (schema._def.effect?.type) {
      case "preprocess":
        return z.preprocess(schema._def.effect.transform, inner.optional());
      case "transform":
        return z
          .object((inner as z.ZodObject<any>).shape)
          .optional()
          .transform(schema._def.effect.transform);
      case "refinement":
        return inner.optional().refine(schema._def.effect.refinement);
      default:
        return inner.optional(); // fallback
    }
  }

  return schema.optional();
}
