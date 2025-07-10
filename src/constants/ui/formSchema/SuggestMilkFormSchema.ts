import { FormSchema, SchemaConstraint } from "@/components/custom";
import {
  AnthroSystemCodes,
  APPETITE_TEST_CODES,
  CLINICAL_SIGNS,
  COMPLICATION_CODES,
  ConditionResult,
  DAY_IN_MONTHS,
  DAY_IN_YEARS,
} from "@/core/constants";
import {
  BirthDateField,
  dateZodSchema,
  EdemaField,
  EdemaZodSchema,
  WeightField,
  WeightZodSchema,
} from "./sharedAnthropometricDataForm";
import { APPETITE_TEST_RESULT_CODES } from "@/core/nutrition_care";
import z from "zod";
import { validateWithSchemaPipeline } from "./utils";

export const SuggestMilkFormSchema: FormSchema = [
  {
    fields: [
      BirthDateField,
      WeightField,
      {
        type: "select",
        name: APPETITE_TEST_CODES.CODE,
        label: "Test d'appétit",
        selectOptions: [
          { label: "Bon Appétit", value: APPETITE_TEST_RESULT_CODES.GOOD },
          { label: "Faible Appétit", value: APPETITE_TEST_RESULT_CODES.BAD },
        ],
        default: APPETITE_TEST_RESULT_CODES.GOOD,
        isRequire: true,
      },
      {
        type: "select",
        name: COMPLICATION_CODES.COMPLICATIONS_NUMBER,
        label: "Nombre de complications",
        selectOptions: [
          { label: "Aucune", value: 0 },
          { label: "1 complication", value: 1 },
          {
            label: "2 complications",
            value: 2,
          },
          {
            label: "3+ complications",
            value: 3,
          },
        ],
        default: 0,
        isRequire: true,
      },
      { ...Object.assign(EdemaField), isRequire: true },
    ],
  },
];

export const SuggestMilkFormZodSchema = {
  validate(data: any) {
    const zodSchemaLists: z.ZodTypeAny[] = [
      z.object({
        [AnthroSystemCodes.WEIGHT]: WeightZodSchema.transform(data => {
          return data.value;
        }),
      }),
      z
        .object({
          birthDate: dateZodSchema(
            "La date de naissance est invalide.",
            "birthDate"
          ),
        })
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
        [APPETITE_TEST_CODES.CODE]: z.enum([
          APPETITE_TEST_RESULT_CODES.BAD,
          APPETITE_TEST_RESULT_CODES.GOOD,
        ]),
      }),
      z.object({
        [COMPLICATION_CODES.COMPLICATIONS_NUMBER]: z.number(),
      }),
      z.object({
        [CLINICAL_SIGNS.EDEMA]: EdemaZodSchema.transform(data => {
          return data === "yes" ? ConditionResult.True : ConditionResult.False;
        }),
      }),
    ];
    return validateWithSchemaPipeline(data, zodSchemaLists);
  },
};
