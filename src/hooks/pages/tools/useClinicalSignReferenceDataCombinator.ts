import { DynamicFormZodSchemaType, FormSchema } from "@/components/custom";
import { IField } from "@/components/custom/FormField";
import { ClinicalData, ClinicalDataType, ClinicalSignDataDto, ClinicalSignReferenceDto } from "@/core/diagnostics";
import { BirthDateField, BirthDateToTodayZodSchema, ClinicalRefCategoryUiData, ClinicalSignRefDataCategory, dateZodSchema, validateWithSchemaPipeline } from "@/src/constants/ui";
import { ValueOf } from "@/utils";
import { useEffect, useMemo, useState } from "react";
import { ConditionResult } from "smartcal";
import { z } from "zod";

export function useClinicalSignReferenceFormGenerator(clinicalSignRefs?: ClinicalSignReferenceDto[]) {
    const [clinicalSignRefFormData, setClinicalSignFormData] = useState<{ schema: FormSchema, zodSchema: DynamicFormZodSchemaType } | null>(null)
    const [onLoading, setOnLoading] = useState<boolean>(false)
    const generateFormClinicalSignsData = useMemo(() => (data: ClinicalSignReferenceDto[]): { schema: FormSchema, zodSchema: DynamicFormZodSchemaType } => {
        const processor = new ClinicalDataProcessor(data)
        const dynamicForm: FormSchema = []
        const dynamicFromValidationZodSchema: z.ZodTypeAny[] = []
        const formStructure = processor.generateOptimizedForm().formStructure
        for (const struture of Object.values(formStructure)) {
            const { fields, section, zodSchemas } = processor.generateDynamicFormSection(struture)
            dynamicForm.push({ fields, section })
            dynamicFromValidationZodSchema.push(...zodSchemas)
        }
        return {
            schema: [{
                section: ClinicalRefCategoryUiData[ClinicalSignRefDataCategory.DEMOGRAPHIC].uiText,
                fields: [BirthDateField]
            }, ...dynamicForm],
            zodSchema: {
                validate(data: any) {
                    return validateWithSchemaPipeline(data, [BirthDateToTodayZodSchema, ...dynamicFromValidationZodSchema])
                }
            }
        }
    }, [])
    useEffect(() => {
        if (clinicalSignRefs && clinicalSignRefs.length > 0) {
            setOnLoading(true)
            const schema = generateFormClinicalSignsData(clinicalSignRefs)
            setClinicalSignFormData(schema)
            setOnLoading(false)

        }
    }, [clinicalSignRefs])

    return { data: clinicalSignRefFormData, onLoading }
}



type UniqueVariables = { [dataCode: string]: (ClinicalSignDataDto & { usedInSigns: string[], category: ClinicalSignRefDataCategory }) }
type VariableUsageMap = { [dataCode: string]: string[] }

class ClinicalDataProcessor {
    private clinicalSigns: ClinicalSignReferenceDto[]
    private uniqueVariables: UniqueVariables
    private variableUsageMap: VariableUsageMap
    constructor(clinicalSigns: ClinicalSignReferenceDto[]) {
        this.clinicalSigns = clinicalSigns;
        this.uniqueVariables = this.extractUniqueVariables();
        this.variableUsageMap = this.buildVariableUsageMap();
    }

    // Extraction automatique des variables uniques
    private extractUniqueVariables(): UniqueVariables {
        const variableMap = new Map<string, ValueOf<UniqueVariables>>();

        this.clinicalSigns.forEach(sign => {
            sign.data.forEach(dataItem => {
                const key = dataItem.code;
                if (!variableMap.has(key)) {
                    variableMap.set(key, {
                        ...dataItem,
                        usedInSigns: [sign.code],
                        category: this.categorizeVariable(dataItem.code)
                    });
                } else {
                    variableMap.get(key)?.usedInSigns.push(sign.code);
                }
            });
        });

        return Object.fromEntries(variableMap);
    }

    // Catégorisation automatique des variables
    private categorizeVariable(code: string): ClinicalSignRefDataCategory {

        for (const [category, { prefixs }] of Object.entries(ClinicalRefCategoryUiData)) {
            for (const prefix of prefixs) {
                if (code.startsWith(prefix)) return category as ClinicalSignRefDataCategory
            }
        }
        return ClinicalSignRefDataCategory.OTHER
    }

    // Mapping des variables vers les signes cliniques
    private buildVariableUsageMap(): { [dataCode: string]: string[] } {
        const usageMap: { [key: string]: string[] } = {};

        this.clinicalSigns.forEach(sign => {
            sign.evaluationRule.variables.forEach((variable: string) => {
                if (!usageMap[variable]) {
                    usageMap[variable] = [];
                }
                usageMap[variable].push(sign.code);
            });
        });

        return usageMap;
    }


    generateOptimizedForm() {
        const categories = this.groupVariablesByCategory();

        return {
            metadata: {
                totalVariables: Object.keys(this.uniqueVariables).length,
                totalSigns: this.clinicalSigns.length,
                categories: Object.keys(categories)
            },
            formStructure: categories,
            variableUsageMap: this.variableUsageMap
        };
    }

    private groupVariablesByCategory() {
        const grouped: {
            [key: string]: {
                title: string, priority: number,
                variables: (ValueOf<UniqueVariables> & {
                    impactedSigns: string[],
                })[]
            }
        } = {};

        Object.entries(this.uniqueVariables).forEach(([code, variable]) => {
            const category = variable.category;

            if (!grouped[category]) {
                grouped[category] = {
                    title: ClinicalRefCategoryUiData[category as keyof typeof ClinicalRefCategoryUiData].uiText,
                    priority: ClinicalRefCategoryUiData[category as keyof typeof ClinicalRefCategoryUiData].priority,
                    variables: []
                };
            }

            grouped[category].variables.push({
                ...variable,
                impactedSigns: this.variableUsageMap[code] || []
            });
        });

        // Tri par priorité
        const sortedCategories: typeof grouped = {};
        Object.keys(grouped)
            .sort((a, b) => grouped[a].priority - grouped[b].priority)
            .forEach(key => {
                sortedCategories[key] = grouped[key];
            });

        return sortedCategories;
    }

    // getCategoryTitle(category: string): string {
    //     const titles = {
    //         'demographics': 'Informations Patient',
    //         'vitals': 'Signes Vitaux',
    //         'observations': 'Observations Cliniques',
    //         'clinical_data': 'Données Cliniques',
    //         'questions': 'Questions Spécifiques',
    //         'other': 'Autres'
    //     };
    //     return titles[category as keyof typeof titles] || category;
    // }

    // getCategoryPriority(category: string) {
    //     const priorities = {
    //         'demographics': 1,
    //         'vitals': 2,
    //         'observations': 3,
    //         'clinical_data': 4,
    //         'questions': 5,
    //         'other': 6
    //     };
    //     return priorities[category as keyof typeof priorities] || 99;
    // }

    generateDynamicFormSection(structure: {
        title: string, priority: number,
        variables: (ValueOf<UniqueVariables> & {
            impactedSigns: string[],
        })[]
    }) {
        const fields: IField[] = []
        const zodSchemas: z.ZodTypeAny[] = []
        for (const variable of structure.variables) {
            const form = this.generatorFormByVariable(variable)
            if (form) {
                fields.push(form.field)
                zodSchemas.push(form.zodSchema)
            }
        }
        return { section: structure.title, fields, zodSchemas }
    }

    generatorFormByVariable(variable: ClinicalSignDataDto) {
        switch (variable.dataType) {
            case ClinicalDataType.INT: {
                const field: IField = {
                    type: 'number',
                    default: 0,
                    label: variable.name,
                    name: variable.code,
                    helperText: variable.question,
                    isRequire: variable.required,
                    minValue: 0
                }
                const zodSchema = z.object({
                    [variable.code]: z.number().nonnegative()
                })
                return {
                    field,
                    zodSchema
                }
            }
            case ClinicalDataType.STR: {
                const field: IField = {
                    type: 'text',
                    default: "",
                    label: variable.name,
                    name: variable.code,
                    helperText: variable.question,
                    isRequire: variable.required
                }
                const zod = z.string().nonempty()
                if (!variable.required) {
                    zod.optional()
                }
                const zodSchema = z.object({
                    [variable.code]: zod
                })
                return {
                    field, zodSchema
                }
            }
            case ClinicalDataType.BOOL: {
                const field: IField = {
                    type: 'radio',
                    label: variable.name,
                    name: variable.code,
                    default: ConditionResult.False.toString(),
                    radioOptions: [{ label: "Oui", value: ConditionResult.True.toString() }, { label: "Non", value: ConditionResult.False.toString() }],
                    helperText: variable.question,
                    isRequire: variable.required
                }
                const zodSchema = z.object({
                    [variable.code]: z.enum([ConditionResult.True.toString(), ConditionResult.False.toString()]).transform(data => { return Number(data) })
                })
                return {
                    field, zodSchema
                }
            }
            case ClinicalDataType.RANGE: {
                const field: IField = {
                    type: 'number',
                    name: variable.code,
                    label: variable.name,
                    helperText: variable.question,
                    isRequire: variable.required,
                    default: variable.dataRange?.[0]!,
                    minValue: variable.dataRange?.[0]!,
                    maxValue: variable.dataRange?.[1]!
                }
                const zodSchema = z.object({
                    [variable.code]: z.number().min(variable.dataRange?.[0]!).max(variable.dataRange?.[1]!).default(variable.dataRange?.[0]!)
                })
                return {
                    field, zodSchema
                }
            }
            case ClinicalDataType.ENUM: {
                const field: IField = {
                    type: 'select',
                    name: variable.code,
                    label: variable.name,
                    helperText: variable.question,
                    isRequire: variable.required,
                    default: variable.enumValue ? variable.enumValue[0] : '',
                    selectOptions: variable.enumValue ? variable.enumValue.map(value => ({ label: value, value })) : []
                }
                const zodSchema = z.object({
                    [variable.code]: z.enum(variable.enumValue || [] as any)
                })
                return {
                    field, zodSchema
                }
            }


            default: {
                console.warn("Unsupported Clinical Data Type Detected!", variable.dataType)
                return null
            }
        }
    }
}
