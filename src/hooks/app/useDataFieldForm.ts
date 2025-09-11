import { useMemo } from 'react';
import { DataFieldReferenceDto } from "@/core/evaluation";
import { IField } from "@/components/custom/FormField";
import { FieldDataType } from "@/core/constants";

type FieldType = 'text' | 'number' | 'select' | 'date' | 'boolean' | 'multiline';

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
}

export function useDataFieldForm(
  fields: DataFieldReferenceDto[],
  options: UseDataFieldFormOptions = {}
) {
  const { fieldPrefix = '', required = false } = options;

  const formSchema = useMemo(() => {
    if (!fields?.length) return [];

    // Grouper les champs par catégorie
    const fieldsByCategory = fields.reduce<Record<string, IField[]>>((acc, field) => {
      const category = field.category || 'default';
      
      if (!acc[category]) {
        acc[category] = [];
      }

      const fieldName = `${fieldPrefix}${field.code}`;
      let fieldType: FieldType = 'text';
      let fieldProps: Partial<IField> = {};

      // Déterminer le type de champ en fonction du type de données
      switch (field.type) {
        case FieldDataType.NUMBER:
          fieldType = 'number';
          fieldProps = {
            keyboardType: 'numeric',
            ...(field.range && {
              min: field.range[0],
              max: field.range[1],
            }),
          };
          break;
          
        case FieldDataType.BOOLEAN:
          fieldType = 'boolean';
          break;
          
        case FieldDataType.DATE:
          fieldType = 'date';
          break;
          
        case FieldDataType.TEXT:
          fieldType = field.question?.length > 50 ? 'multiline' : 'text';
          break;
          
        case FieldDataType.ENUM:
          fieldType = 'select';
          fieldProps = {
            options: field.enum?.map(item => ({
              label: item.label,
              value: item.value,
            })) || [],
          };
          break;
          
        default:
          fieldType = 'text';
      }

      // Créer la configuration du champ
      const formField: IField = {
        name: fieldName,
        label: field.label,
        placeholder: field.question,
        type: fieldType,
        required: required,
        defaultValue: field.defaultValue,
        ...fieldProps,
      };

      // Ajouter l'unité si disponible
      if (field.units?.default) {
        formField.rightElement = field.units.default;
      }

      acc[category].push(formField);
      return acc;
    }, {});

    // Convertir en tableau de sections pour le DynamicFormGenerator
    return Object.entries(fieldsByCategory).map(([category, fields]) => ({
      section: category,
      fields,
    }));
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
