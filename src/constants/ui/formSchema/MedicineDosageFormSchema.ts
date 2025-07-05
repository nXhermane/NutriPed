import { FormSchema } from "@/components/custom";
import { WeightField, WeightZodSchema } from "./sharedAnthropometricDataForm";
import z from "zod";
import { validateWithSchemaPipeline } from "./utils";
import { AnthroSystemCodes } from "@/core/diagnostics";

export const MedicineDosageFormSchema: FormSchema = [
    {
        fields: [
            WeightField
        ]
    }
]
export const MedicineDosageFormZodSchema = {
    validate(data: any) {
        const zodSchemaLists: z.ZodTypeAny[] = [
            z.object({
                [AnthroSystemCodes.WEIGHT]: WeightZodSchema.transform(data => {
                    return data.value
                }),
            }),
        ]
        return validateWithSchemaPipeline(data, zodSchemaLists)
    }
}