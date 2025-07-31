import { AnthroSystemCodes } from "@/core/constants";
import { z } from "zod";
import { WeightField, HeightField, LengthField, MUACField, HeadCircumferenceField, TSFField, SSFField, BirthDateToTodayZodSchema, HeadCircumferenceZodSchema, HeightZodSchema, LengthZodSchema, MUACZodSchema, SexZodSchema, SSFZodSchema, TSFZodSchema, WeightZodSchema } from "./sharedAnthropometricDataForm";
import { makeOptionalSchema, validateWithSchemaPipeline } from "./utils";

export const AddAnthropometricMeasureToMedicalRecordFormSchema = [{

    fields: [
        {...WeightField,isRequire: false},
        HeightField,
        LengthField,
        MUACField,
        HeadCircumferenceField,
        TSFField,
        SSFField,
    ]
}]
export const AddAnthropometricMeasureToMedicalRecordFormZodSchema = {
    validate(data: any) {
        const zodSchemaLists: z.ZodTypeAny[] = [
            z.object({
                [AnthroSystemCodes.WEIGHT]: makeOptionalSchema(z.preprocess(
                    (raw: any) => {
                        if (!raw || typeof raw !== "object" || raw.value === 0) return undefined;
                        return raw;
                    }, z
                        .object({
                            code: z.string().nonempty(),
                            value: z.number().positive("Le poids doit être positive."),
                            unit: z.enum(["kg", "g"], {
                                errorMap: (issue, ctx) => ({
                                    message:
                                        "Unité invalide. Seules les valeurs 'kg' et 'g' sont acceptées.",
                                }),
                            }),
                        })
                        .refine(
                            weight => {
                                if (weight.unit === "g") return weight.value >= 500;
                                if (weight.unit === "kg") return weight.value >= 0.5;
                                return true;
                            },
                            {
                                message: "Le poids doit être au moins 500g ou 0.5kg.",
                                path: ["value"],
                            }
                        )))
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
            z
                .object({
                    [AnthroSystemCodes.HEIGHT]: makeOptionalSchema(HeightZodSchema),
                    [AnthroSystemCodes.LENGTH]: makeOptionalSchema(LengthZodSchema),
                })
                .refine(
                    (data: any) => {
                        if (
                            data[AnthroSystemCodes.LENGTH] &&
                            data[AnthroSystemCodes.HEIGHT]
                        ) {
                            return false;
                        }
                        return true
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
}