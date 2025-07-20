import { FormSchema } from "@/components/custom";
import {
  BirthDateField,
  BirthDateToTodayZodSchema,
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
  SexZodSchema,
  SSFField,
  SSFZodSchema,
  TSFField,
  TSFZodSchema,
  WeightField,
  WeightZodSchema,
} from "./sharedAnthropometricDataForm";
import { z } from "zod";
import {
  AnthroSystemCodes,
  DAY_IN_MONTHS,
  DAY_IN_YEARS,
} from "@/core/constants";
import { makeOptionalSchema, validateWithSchemaPipeline } from "./utils";
import { Sex } from "@/core/shared";

export const AnthropometricCalculatorFormSchema: FormSchema = [
  {
    section: "Informations générales",
    fields: [BirthDateField, SexField],
  },
  {
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
  },
];

export const AnthropometricCalculatorFormZodSchema = {
  validate(data: any) {
    const zodSchemaLists: z.ZodTypeAny[] = [
      z.object({
        [AnthroSystemCodes.WEIGHT]: WeightZodSchema,
      }),
      z.object({
        [AnthroSystemCodes.MUAC]: makeOptionalSchema(MUACZodSchema),
      }),
      z.object({
        [AnthroSystemCodes.HEAD_CIRCUMFERENCE]: makeOptionalSchema(
          HeadCircumferenceZodSchema
        ),
      }),
      z.object({
        [AnthroSystemCodes.TSF]: makeOptionalSchema(TSFZodSchema),
      }),
      z.object({
        [AnthroSystemCodes.SSF]: makeOptionalSchema(SSFZodSchema),
      }),
      BirthDateToTodayZodSchema,
      SexZodSchema,

      z
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
        ),
    ];

    return validateWithSchemaPipeline(data, zodSchemaLists);
  },
};
