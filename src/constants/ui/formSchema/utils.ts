import { AnthroSystemCodes, DAY_IN_MONTHS, DAY_IN_YEARS } from "@/core/constants";
import z from "zod";
import { BirthDateField, dateZodSchema, HeadCircumferenceField, HeadCircumferenceZodSchema, HeightField, HeightZodSchema, LengthField, LengthZodSchema, MUACField, MUACZodSchema, RegisterDateField, SSFField, SSFZodSchema, TSFField, TSFZodSchema, WeightField, WeightZodSchema } from "./sharedAnthropometricDataForm";

// Fonction utilitaire pour rendre un schema optionnel obligatoire
export const makeRequired = <T extends z.ZodTypeAny>(schema: z.ZodOptional<T>): T => {
  return schema.unwrap();
}

// Fonction utilitaire pour rendre un schema obligatoire optionnel
export const makeOptional = <T extends z.ZodTypeAny>(schema: T): z.ZodOptional<T> => {
  return schema.optional();
};


export function getAnthropDataFormSchemaWithCode(code: AnthroSystemCodes) {
  switch (code) {
    case AnthroSystemCodes.WEIGHT: {
      return {
        code: code,
        field: WeightField,
        zodSchema: z.object({ [AnthroSystemCodes.WEIGHT]: WeightZodSchema }),
      }
    }
    case AnthroSystemCodes.LENGTH: {
      return {
        code,
        field: LengthField,
        zodSchema: z.object({ [AnthroSystemCodes.LENGTH]: LengthZodSchema })
      }
    }
    case AnthroSystemCodes.HEIGHT: {
      return { code, field: HeightField, zodSchema: z.object({ [AnthroSystemCodes.HEIGHT]: HeightZodSchema }) }
    }
    case AnthroSystemCodes.MUAC: {
      return { code, field: MUACField, zodSchema: z.object({ [AnthroSystemCodes.MUAC]: MUACZodSchema }) }
    }
    case AnthroSystemCodes.HEAD_CIRCUMFERENCE: {
      return { code, field: HeadCircumferenceField, zodSchema: z.object({ [AnthroSystemCodes.HEAD_CIRCUMFERENCE]: HeadCircumferenceZodSchema }) }
    }
    case AnthroSystemCodes.SSF: {
      return { code, field: SSFField, zodSchema: z.object({ [AnthroSystemCodes.SSF]: SSFZodSchema }) }
    }
    case AnthroSystemCodes.TSF: {
      return { code, field: TSFField, zodSchema: z.object({ [AnthroSystemCodes.TSF]: TSFZodSchema }) }
    }
    case AnthroSystemCodes.LENHEI: {
      return {
        code: AnthroSystemCodes.LENHEI,
        field: [LengthField, HeightField],
        zodSchema: z.object({
          [AnthroSystemCodes.HEIGHT]: HeightZodSchema,
          [AnthroSystemCodes.LENGTH]: LengthZodSchema
        }).refine(
          data => {
            return data[AnthroSystemCodes.LENGTH] || data[AnthroSystemCodes.HEIGHT];
          },
          {
            message: "Au moins une taille doit être fournie, soit la taille couchée soit la taille debout.",
            path: [AnthroSystemCodes.HEIGHT, AnthroSystemCodes.LENGTH],
          }
        ).transform(data => {
          const measure = data[AnthroSystemCodes.HEIGHT] || data[AnthroSystemCodes.LENGTH] as typeof data[AnthroSystemCodes.HEIGHT] || data[AnthroSystemCodes.LENGTH]!
          return {
            code: AnthroSystemCodes.LENHEI,
            value: measure.value,
            unit: measure.unit
          }

        })
      }
    }
    case AnthroSystemCodes.AGE_IN_DAY:
    case AnthroSystemCodes.AGE_IN_MONTH: {
      return {
        code: AnthroSystemCodes.AGE_IN_MONTH,
        field: [BirthDateField, RegisterDateField],
        zodSchema: z.object({
          birthDate: dateZodSchema("La date de naissance est invalide.", 'birthDate'),
          registerDate: dateZodSchema("La date d'enregistrement est invalide.",'registerData')
        }).transform(data => {
          const date1 = new Date(data.birthDate)
          const date2 = new Date(data.registerDate)
          const diffInMs = date2.getTime() - date1.getTime()
          const dayAfterBirthDay = diffInMs / (1000 * 60 * 60 * 24)
          const monthAfterBirthDay = dayAfterBirthDay / DAY_IN_MONTHS
          const yearAfterBirthDay = dayAfterBirthDay / DAY_IN_YEARS
          return {
            [AnthroSystemCodes.AGE_IN_DAY]: dayAfterBirthDay,
            [AnthroSystemCodes.AGE_IN_MONTH]: monthAfterBirthDay,
          }
        })
      }
    }
    default: {
      console.warn("This Measure is not supported for the moment.")
      return null
    }
  }
}


export function mergeZodSchemas(...schemas: (z.ZodObject<any, any, any, any> | z.ZodEffects<any,any,any>)[]) {
  const mergedShapes = schemas.reduce((acc, schema) => ({
    ...acc,
    ...(schema instanceof z.ZodEffects ? schema._def.schema.shape  : schema.shape)
  }), {})
  return z.object(mergedShapes)
}