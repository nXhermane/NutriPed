import { FormSchema } from "@/components/custom";
import { AnthroSystemCodes, CLINICAL_SIGNS } from "@/core/constants";
import z from "zod";
import {
  EdemaField,
  EdemaZodSchema,
  HeadCircumferenceField,
  HeadCircumferenceZodSchema,
  HeightField,
  HeightZodSchema,
  LengthField,
  LengthZodSchema,
  MUACField,
  MUACZodSchema,
  SSFField,
  SSFZodSchema,
  TSFField,
  TSFZodSchema,
  WeightField,
  WeightZodSchema,
} from "./sharedAnthropometricDataForm";
import { makeOptionalSchema } from "./utils";

export const DiagnosticDataFormSchema: FormSchema = [
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
  {
    section: "Clinique",
    fields: [EdemaField],
  },
];

export const DiagnosticDataFormZodSchema = z
  .object({
    // Anthropometrie
    [AnthroSystemCodes.WEIGHT]: WeightZodSchema,
    [AnthroSystemCodes.HEIGHT]: makeOptionalSchema(HeightZodSchema),
    [AnthroSystemCodes.LENGTH]: makeOptionalSchema(LengthZodSchema),
    [AnthroSystemCodes.MUAC]: makeOptionalSchema(MUACZodSchema),
    [AnthroSystemCodes.HEAD_CIRCUMFERENCE]: makeOptionalSchema(
      HeadCircumferenceZodSchema
    ),
    [AnthroSystemCodes.TSF]: makeOptionalSchema(TSFZodSchema),
    [AnthroSystemCodes.SSF]: makeOptionalSchema(SSFZodSchema),
    // Clinical value
    [CLINICAL_SIGNS.EDEMA]: EdemaZodSchema,
  })
  .refine(
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
  );
