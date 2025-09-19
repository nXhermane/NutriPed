import { useMemo } from 'react';
import { DataFieldReferenceDto } from "@/core/evaluation";
import { IField } from "@/components/custom/FormField";
import { ConditionResult, FieldDataType } from "@/core/constants";
import z from 'zod';
import { FormSchema } from '@/components/custom';
import { BirthDateField, BirthDateToTodayZodSchema, ClinicalRefCategoryUiData, ClinicalSignRefDataCategory, DataFieldCategoryUI, SexField, SexZodSchema, validateWithSchemaPipeline } from '@/src/constants/ui';


interface UseDataFieldFormOptions {
  /**
   * Préfixe à ajouter aux noms des champs pour éviter les conflits
   */
  fieldPrefix?: string;

  /**
   * Si vrai, rend les champs obligatoires
   * @default false
   */
  required?: boolean;
  /**
   * Si vrai, ajoute les champs d'information générale au formulaire.
   * @default fasle
   */
  withGeneralInfo?: boolean;
}

export function useDataFieldForm(
  fields: DataFieldReferenceDto[],
  options: UseDataFieldFormOptions = {
  }
) {
  const { fieldPrefix = '', required = false, withGeneralInfo = false } = options;

  const formSchema = useMemo(() => {
    if (!fields?.length) return {
      schema: [],
      zod: {
        validate(data: any) {
          return {
            success: true,
            data
          }
        },
      }
    };

    // Grouper les champs par catégorie
    const fieldsByCategory = fields.reduce<Record<string, { field: IField, zod: z.ZodTypeAny }[]>>((acc, field) => {
      const category = field.category || 'default';

      if (!acc[category]) {
        acc[category] = [];
      }
      console.log(field.defaultValue, field.code)

      const fieldName = `${fieldPrefix}${field.code}`;


      // Déterminer le type de champ en fonction du type de données
      switch (field.type) {
        case FieldDataType.INT: {
          const _field: IField = {
            type: "number",
            default: field.defaultValue,
            label: field.label,
            name: field.code,
            helperText: field.question,
            isRequire: required,

          };
          const _zodSchema = z.object({
            [field.code]: z.number().nonnegative(),
          });
          acc[category].push({
            field: _field,
            zod: _zodSchema,
          })
        }
          break;
        case FieldDataType.BOOL: {
          const _field: IField = {
            type: "radio",
            label: field.label,
            name: field.code,
            default: field.defaultValue.toString(),
            radioOptions: [
              { label: "Oui", value: ConditionResult.True.toString() },
              { label: "Non", value: ConditionResult.False.toString() },
            ],
            helperText: field.question,
            isRequire: required,
          }
          const _zodSchema = z.object({
            [field.code]: z
              .enum([
                ConditionResult.True.toString(),
                ConditionResult.False.toString(),
              ])
              .transform(data => {
                return Boolean(Number(data));
              }),
          });
          acc[category].push({
            field: _field,
            zod: _zodSchema,
          })
        }
          break;
        case FieldDataType.STR: {
          const _field: IField = {
            type: "text",
            default: field.defaultValue,
            label: field.label,
            name: field.code,
            helperText: field.question,
            isRequire: required
          }
          const zod = z.string().nonempty();
          if (!required) {
            zod.optional();
          }
          const _zodSchema = z.object({
            [field.code]: zod,
          });
          acc[category].push({
            field: _field,
            zod: _zodSchema,
          })
        }
          break;
        case FieldDataType.QUANTITY: {
          const defaultUnit = field.units?.default;
          const availableUnits = field.units?.available || [];
          const _field: IField = {
            type: "quantity",
            name: field.code,
            label: field.label,
            helperText: field.question,
            isRequire: required,
            default: field.defaultValue,
            defaultUnit: {
              unit: defaultUnit!,
              convertionFactor: 1,
              label: defaultUnit!,
            },
            unitOptions:
              availableUnits.map(unit => ({
                unit: unit,
                convertionFactor: 1,
                label: unit,
              })) || [],
          }
          const _zodSchema = z.object({
            value: z
              .number()
              .positive("La valeur d'une quantité doit être positive."),
            unit: z.enum(availableUnits as any, {
              errorMap: (issue, ctx) => ({
                message: `Unité invalide. Seules les valeurs ${availableUnits.join(",")} sont acceptées.`,
              }),
            }),
          });
          acc[category].push({
            field: _field,
            zod: _zodSchema,
          })
        }
          break;
        case FieldDataType.ENUM: {
          const _field: IField = {
            type: 'select',
            name: field.code,
            label: field.label,
            helperText: field.question,
            isRequire: required,
            default: field.defaultValue,
            selectOptions: field.enum!,
          }
          const _zodSchema = z.object({
            [field.code]: z.enum(
              field.enum?.map(val => val.value) || ([] as any)
            ),
          });
          acc[category].push({
            field: _field,
            zod: _zodSchema,
          })
        }
          break;
        case FieldDataType.RANGE: {
          const _field: IField = {
            type: "number",
            name: field.code,
            label: field.label,
            helperText: field.question,
            isRequire: required,
            default: field.defaultValue,
            minValue: field.range?.[0]!,
            maxValue: field.range?.[1],
          }
          const _zodSchema = z.object({
            [field.code]: z
              .number()
              .min(field.range?.[0]!)
              .max(field.range?.[1]!)
              .default(field.defaultValue),
          });
          acc[category].push({
            field: _field,
            zod: _zodSchema,
          })
        }
          break;
        default: {
          throw new Error("This data field type is not supported by form generator")
        }
      }
      return acc;
    }, {});
    const schema: FormSchema = [];
    const zodSchemas: z.ZodTypeAny[] = [];
    for (const [category, fields] of Object.entries(fieldsByCategory)) {
      schema.push({
        section: DataFieldCategoryUI[category as never],
        fields: fields.map(_field => _field.field)
      })
      zodSchemas.push(...fields.map(_field => _field.zod))
    }
    return {
      schema: [
        ...(withGeneralInfo ? [
          {
            section:
              ClinicalRefCategoryUiData[
                ClinicalSignRefDataCategory.DEMOGRAPHIC
              ].uiText,
            fields: [SexField, BirthDateField],
          },
        ] : []),
        ...schema
      ],
      zod: {
        validate(data: any) {
          return validateWithSchemaPipeline(data, [...(withGeneralInfo
            ? [SexZodSchema, BirthDateToTodayZodSchema]
            : []), ...zodSchemas]);
        },
      }
    }
  }, [fields, fieldPrefix, required]);

  return {
    formSchema,
    /**
     * Extrait les valeurs des champs du formulaire en fonction des noms des champs d'origine
     */
    extractValues: (formValues: Record<string, any>) => {
      if (!fields?.length) return {};

      return fields.reduce<Record<string, any>>((acc, field) => {
        const fieldName = `${fieldPrefix}${field.code}`;
        acc[field.code] = formValues[fieldName];
        return acc;
      }, {});
    },
    /**
     * Prépare les valeurs initiales pour le formulaire
     */
    getInitialValues: () => {
      if (!fields?.length) return {};

      return fields.reduce<Record<string, any>>((acc, field) => {
        const fieldName = `${fieldPrefix}${field.code}`;
        acc[fieldName] = field.defaultValue;
        return acc;
      }, {});
    },
  };
}