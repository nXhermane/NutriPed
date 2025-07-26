import { DynamicFormZodSchemaType } from "@/components/custom";
import { IField } from "@/components/custom/FormField";
import { AnthroSystemCodes, IndicatorDto } from "@/core/diagnostics";
import {
  getAnthropDataFormSchemaWithCode,
  validateWithSchemaPipeline,
} from "@/src/constants/ui";
import { useEffect, useMemo, useState } from "react";

export type MeasurementFormSchema = {
  fields: IField[];
  zodSchema: DynamicFormZodSchemaType;
};

export function useDynamicFormSchemaForIndicator(indicatorDto?: IndicatorDto) {
  const [schema, setSchema] = useState<MeasurementFormSchema>();
  const generateFieldSchema = useMemo(
    () => (neededMeasures: AnthroSystemCodes[]) => {
      const fieldLists: Set<IField> = new Set();
      const zodSchemaLists: Set<any> = new Set();
      for (const measureCode of neededMeasures) {
        const formSchema = getAnthropDataFormSchemaWithCode(measureCode);
        if (formSchema != null) {
          const fields = Array.isArray(formSchema.field)
            ? formSchema.field
            : [formSchema.field];
          fields.forEach(field => {
            if (!fieldLists.has(field)) fieldLists.add(field);
          });
          if (!zodSchemaLists.has(formSchema.zodSchema))
            zodSchemaLists.add(formSchema.zodSchema);
        }
      }

      return {
        fields: Array.from(fieldLists),
        zodSchema: {
          validate(data: any) {
            return validateWithSchemaPipeline(data, Array.from(zodSchemaLists));
          },
        },
      };
    },
    []
  );
  useEffect(() => {
    if (indicatorDto) {
      const fieldSchema = generateFieldSchema(
        indicatorDto.neededMeasureCodes as AnthroSystemCodes[]
      );
      setSchema(fieldSchema as any);
    }
  }, [indicatorDto, generateFieldSchema]);

  return schema;
}
