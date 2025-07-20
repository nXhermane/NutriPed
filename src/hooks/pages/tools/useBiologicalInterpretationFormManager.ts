import { DynamicFormZodSchemaType, FormSchema } from "@/components/custom";
import { IField } from "@/components/custom/FormField";
import { BiochemicalReferenceDto } from "@/core/diagnostics";
import {
  BirthDateField,
  BirthDateToTodayZodSchema,
  SexField,
  SexZodSchema,
  validateWithSchemaPipeline,
} from "@/src/constants/ui";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";

export function useBiologicalInterpretationFormManager(
  availableBioRefs: BiochemicalReferenceDto[] = [],
  withGeneralInfo: boolean = true
) {
  const [selectedBioMarker, setSelectedBioMarker] = useState<string[]>([]);
  const [fieldList, setFieldList] = useState<IField[]>([]);
  const [zodSchemaList, setZodSchemaList] = useState<z.ZodTypeAny[]>([]);
  const formSchema = useMemo<FormSchema>(() => {
    return [
      ...(withGeneralInfo
        ? [
            {
              section: "Informations généraux",
              fields: [BirthDateField, SexField],
            },
          ]
        : []),
      { section: "Marqueurs sélectionnées", fields: fieldList },
    ];
  }, [fieldList]);
  const zodValidation = useMemo<DynamicFormZodSchemaType>(() => {
    return {
      validate(data) {
        return validateWithSchemaPipeline(data, [
          ...(withGeneralInfo ? [BirthDateToTodayZodSchema, SexZodSchema] : []),
          ...zodSchemaList,
        ]);
      },
    };
  }, [zodSchemaList]);
  useEffect(() => {
    if (selectedBioMarker.length != 0) {
      const fields: IField[] = [];
      const zodList: z.ZodTypeAny[] = [];
      for (const biomarkerId of selectedBioMarker) {
        const findedBiomarker = availableBioRefs.find(
          ref => ref.id === biomarkerId
        );
        if (findedBiomarker) {
          const field: IField = {
            type: "quantity",
            default: { unit: findedBiomarker.unit, value: 0 },
            label: findedBiomarker.name,
            name: findedBiomarker.code,
            defaultUnit: {
              convertionFactor: 1,
              label: findedBiomarker.unit,
              unit: findedBiomarker.unit,
            },
            unitOptions: [
              {
                convertionFactor: 1,
                label: findedBiomarker.unit,
                unit: findedBiomarker.unit,
              },
            ],
          };
          fields.push(field);
          const zod = z.object({
            [findedBiomarker.code]: z.object({
              unit: z.string(),
              code: z.string(),
              value: z.number(),
            }),
          });
          zodList.push(zod);
        }
      }
      setFieldList(fields);
      setZodSchemaList(zodList);
    }
  }, [selectedBioMarker, availableBioRefs]);

  return { formSchema, zodValidation, setSelectedBioMarker, selectedBioMarker };
}
