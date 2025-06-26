import { FormSchema } from "@/components/custom";
import { AnthroSystemCodes, CLINICAL_SIGNS } from "@/core/constants";
import z from "zod";
import { EdemaField, EdemaZodSchema, HeadCircumferenceField, HeadCircumferenceZodSchema, HeightField, HeightZodSchema, LengthField, LengthZodSchema, MUACField, MUACZodSchema, SSFField, SSFZodSchema, TSFField, TSFZodSchema, WeightField, WeightZodSchema } from "./sharedAnthropometricDataForm";

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
    [AnthroSystemCodes.HEIGHT]: HeightZodSchema,
    [AnthroSystemCodes.LENGTH]: LengthZodSchema,
    [AnthroSystemCodes.MUAC]: MUACZodSchema,
    [AnthroSystemCodes.HEAD_CIRCUMFERENCE]: HeadCircumferenceZodSchema,
    [AnthroSystemCodes.TSF]: TSFZodSchema,
    [AnthroSystemCodes.SSF]: SSFZodSchema,
    // Clinical value
    [CLINICAL_SIGNS.EDEMA]: EdemaZodSchema,
  })
  .refine(
    data => {
      return data[AnthroSystemCodes.LENGTH] || data[AnthroSystemCodes.HEIGHT];
    },
    {
      message: "Au moins une taille doit être fournie, soit la taille couchée soit la taille debout.",
      path: [AnthroSystemCodes.HEIGHT, AnthroSystemCodes.LENGTH],
    }
  );
