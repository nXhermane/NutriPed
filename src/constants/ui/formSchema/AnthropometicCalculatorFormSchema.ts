import { FormSchema } from "@/components/custom";
import {
  BirthDateField,
  dateZodSchema,
  EdemaField,
  HeadCircumferenceField,
  HeadCircumferenceZodSchema,
  HeightField,
  HeightZodSchema,
  LengthField,
  LengthZodSchema,
  MUACField,
  MUACZodSchema,
  SexField,
  SSFField,
  SSFZodSchema,
  TSFField,
  TSFZodSchema,
  WeightField,
  WeightZodSchema,
} from "./sharedAnthropometricDataForm";
import { z } from "zod";
import { AnthroSystemCodes, DAY_IN_MONTHS, DAY_IN_YEARS } from "@/core/constants";
import { makeOptionalSchema, validateWithSchemaPipeline } from "./utils";
import { Sex } from "@/core/shared";

export const AnthropometricCalculatorFormSchema: FormSchema = [{
  section: "Informations générales",
  fields: [
    BirthDateField,
    SexField,
  ]
}, {
  section: "Anthropometrie",
  fields: [
    WeightField,
    HeightField,
    LengthField,
    MUACField,
    HeadCircumferenceField,
    TSFField,
    SSFField,
  ],
}]

export const AnthropometricCalculatorFormZodSchema = {
  validate(data: any) {
    const zodSchemaLists: z.ZodTypeAny[] = [
      z.object({
        [AnthroSystemCodes.WEIGHT]: WeightZodSchema,
      }),
      z.object({
        [AnthroSystemCodes.MUAC]: makeOptionalSchema(MUACZodSchema)
      }),
      z.object({
        [AnthroSystemCodes.HEAD_CIRCUMFERENCE]: makeOptionalSchema(HeadCircumferenceZodSchema)
      }),
      z.object({
        [AnthroSystemCodes.TSF]: makeOptionalSchema(TSFZodSchema)
      }),
      z.object({
        [AnthroSystemCodes.SSF]: makeOptionalSchema(SSFZodSchema)
      }),
      z.object({ birthDate: dateZodSchema("La date de naissance est invalide.", "birthDate") })
        .transform(data => {
          const date1 = new Date(data.birthDate);
          const date2 = new Date();
          const diffInMs = date2.getTime() - date1.getTime();
          const dayAfterBirthDay = diffInMs / (1000 * 60 * 60 * 24);
          const monthAfterBirthDay = dayAfterBirthDay / DAY_IN_MONTHS;
          const yearAfterBirthDay = dayAfterBirthDay / DAY_IN_YEARS;
          return {
            [AnthroSystemCodes.AGE_IN_DAY]: dayAfterBirthDay,
            [AnthroSystemCodes.AGE_IN_MONTH]: monthAfterBirthDay,
          };
        }),
      z.object({
        [AnthroSystemCodes.SEX]: z.enum([Sex.MALE, Sex.FEMALE], {
          errorMap: () => ({ message: "Le sexe est requis" }),
        }),
      }),

      z.object({
        [AnthroSystemCodes.HEIGHT]: makeOptionalSchema(HeightZodSchema),
        [AnthroSystemCodes.LENGTH]: makeOptionalSchema(LengthZodSchema)
      }).refine(
        data => {
          if (data[AnthroSystemCodes.LENGTH] && data[AnthroSystemCodes.HEIGHT]) {
            return false;
          }
          return data[AnthroSystemCodes.LENGTH] || data[AnthroSystemCodes.HEIGHT];
        },
        {
          message:
            "Juste une taille des deux doit être fournir, soit la taille couchée soit la taille debout.",
          path: [AnthroSystemCodes.HEIGHT, AnthroSystemCodes.LENGTH],
        }
      )
    ];

    return validateWithSchemaPipeline(data, zodSchemaLists);
  },
};
