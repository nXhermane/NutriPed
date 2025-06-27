import { IField } from "@/components/custom/FormField";
import { AnthroSystemCodes, IndicatorDto } from "@/core/diagnostics";
import { getAnthropDataFormSchemaWithCode, mergeZodSchemas } from "@/src/constants/ui";
import { useEffect, useMemo, useState } from "react";
import z, { any } from "zod";

export function useGenerateSchemaForIndicator(indicatorDto?: IndicatorDto) {
    const [schema, setSchema] = useState<{ fields: IField[], zodSchema: z.ZodObject<any, any, any, any> }>()
    const generateFieldSchema = useMemo(() => (neededMeasures: AnthroSystemCodes[]) => {
        const fieldLists: Set<IField> = new Set()
        const zodSchemaLists: Set<any> = new Set()
        for (const measureCode of neededMeasures) {
            const formSchema = getAnthropDataFormSchemaWithCode(measureCode)
            if (formSchema != null) {
                const fields = Array.isArray(formSchema.field) ? formSchema.field : [formSchema.field]
                fields.forEach(field => {
                    if (!fieldLists.has(field)) fieldLists.add(field)
                })
                if (!zodSchemaLists.has(formSchema.zodSchema)) zodSchemaLists.add(formSchema.zodSchema)
            }
        }
        return {
            fields: Array.from(fieldLists),
            zodSchema: mergeZodSchemas(...Array.from(zodSchemaLists) as any[])
        }
    }, [])
    useEffect(() => {
        if (indicatorDto) {
            const fieldSchema = generateFieldSchema(indicatorDto.neededMeasureCodes as AnthroSystemCodes[])
            setSchema(fieldSchema as any)
        }
    }, [indicatorDto])

    return schema
}