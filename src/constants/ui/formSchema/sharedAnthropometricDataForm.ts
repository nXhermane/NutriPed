// =============================================
// CHAMPS DE FORMULAIRE INDIVIDUELS
// =============================================

import { IField } from "@/components/custom/FormField";
import {
  AnthroSystemCodes,
  CLINICAL_SIGNS,
  DAY_IN_MONTHS,
  DAY_IN_YEARS,
  MAX_LENHEI,
  MIN_LENHEI,
} from "@/core/constants";
import { Sex } from "@/core/shared";
import { convertBirthDateIntoAgeInMonth } from "@/utils";
import z from "zod";

export const WeightField = {
  type: "quantity" as const,
  default: {
    unit: "kg",
    value: 0,
  },
  defaultUnit: { unit: "kg", convertionFactor: 1, label: "kg" },
  label: "Poids",
  name: AnthroSystemCodes.WEIGHT,
  unitOptions: [
    { unit: "kg", convertionFactor: 1, label: "kg" },
    { unit: "g", convertionFactor: 0.001, label: "g" },
  ],
  placeholder: "Ex: 20",
  isRequire: true,
};

export const HeightField = {
  type: "quantity" as const,
  default: {
    unit: "cm",
    value: 0,
  },
  defaultUnit: { unit: "cm", convertionFactor: 1, label: "cm" },
  label: "Taille",
  name: AnthroSystemCodes.HEIGHT,
  unitOptions: [
    { unit: "cm", convertionFactor: 1, label: "cm" },
    { unit: "m", convertionFactor: 100, label: "m" },
  ],
  placeholder: "Ex: 20",
};

export const LengthField = {
  type: "quantity" as const,
  default: {
    unit: "cm",
    value: 0,
  },
  defaultUnit: { unit: "cm", convertionFactor: 1, label: "cm" },
  label: "Longueur",
  name: AnthroSystemCodes.LENGTH,
  unitOptions: [
    { unit: "cm", convertionFactor: 1, label: "cm" },
    { unit: "m", convertionFactor: 100, label: "m" },
  ],
  placeholder: "Ex: 20",
};

export const MUACField = {
  type: "quantity" as const,
  default: {
    unit: "cm",
    value: 0,
  },
  defaultUnit: { unit: "cm", convertionFactor: 1, label: "cm" },
  label: "Périmètre brachial",
  name: AnthroSystemCodes.MUAC,
  unitOptions: [
    { unit: "cm", convertionFactor: 1, label: "cm" },
    { unit: "mm", convertionFactor: 0.1, label: "mm" },
  ],
  placeholder: "Ex: 20",
};

export const HeadCircumferenceField = {
  type: "quantity" as const,
  default: {
    unit: "cm",
    value: 0,
  },
  defaultUnit: { unit: "cm", convertionFactor: 1, label: "cm" },
  label: "Périmètre crânien",
  name: AnthroSystemCodes.HEAD_CIRCUMFERENCE,
  unitOptions: [
    { unit: "cm", convertionFactor: 1, label: "cm" },
    { unit: "mm", convertionFactor: 0.1, label: "mm" },
  ],
  placeholder: "Ex: 20",
};

export const TSFField = {
  type: "quantity" as const,
  default: {
    unit: "mm",
    value: 0,
  },
  defaultUnit: { unit: "mm", convertionFactor: 1, label: "mm" },
  label: "Pli cutané tricipital",
  name: AnthroSystemCodes.TSF,
  unitOptions: [{ unit: "mm", convertionFactor: 1, label: "mm" }],
  placeholder: "Ex: 20",
};

export const SSFField = {
  type: "quantity" as const,
  default: {
    unit: "mm",
    value: 0,
  },
  defaultUnit: { unit: "mm", convertionFactor: 1, label: "mm" },
  label: "Pli cutané sous-scapulaire",
  name: AnthroSystemCodes.SSF,
  unitOptions: [{ unit: "mm", convertionFactor: 1, label: "mm" }],
  placeholder: "Ex: 20",
};

export const BirthDateField: IField = {
  label: "Date de naissance",
  type: "date",
  name: "birthDate",
  mode: "date",
  maxDate: new Date(),
  placeholder: "2025-03-20",
  isRequire: true,
  default: new Date().toISOString().split("T")[0],
} as const;
export const RegisterDateField: IField = {
  label: "Date d'enregistrement",
  type: "date",
  name: "registerDate",
  mode: "date",
  maxDate: new Date(),
  placeholder: "25-03-20",
  isRequire: true,
  default: new Date().toISOString().split("T")[0],
  helperText: "C'est la date d'enregistrement des mesures anthropometriques.",
} as const;

export const SexField: IField = {
  label: "Sexe",
  type: "radio",
  radioOptions: [
    {
      label: "Garçons",
      value: Sex.MALE,
    },
    {
      label: "Fille",
      value: Sex.FEMALE,
    },
  ],
  name: AnthroSystemCodes.SEX,
  isRequire: true,
  default: Sex.MALE,
} as const;
export const EdemaField: IField = {
  type: "select",
  default: "no",
  label: "Œdème bilateral",
  name: CLINICAL_SIGNS.EDEMA,
  selectOptions: [
    { label: "Present", value: "yes" },
    { label: "Absent", value: "no" },
  ],
} as const;

// =============================================
// SCHEMAS ZOD INDIVIDUELS
// =============================================

export const WeightZodSchema = z
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
  );

export const HeightZodSchema = z.preprocess(
  (raw: any) => {
    if (!raw || typeof raw !== "object" || raw.value === 0) return undefined;
    return raw;
  },
  z
    .object({
      code: z.string().nonempty(),
      value: z.number().positive("La taille debout doit être positive."),
      unit: z.enum(["cm", "m"], {
        errorMap: (issue, ctx) => ({
          message:
            "Unité invalide. Seules les valeurs 'cm' et 'm' sont acceptées.",
        }),
      }),
    })
    .refine(
      height => {
        if (height.unit === "cm")
          return height.value >= MIN_LENHEI && height.value <= MAX_LENHEI;
        if (height.unit === "m")
          return (
            height.value >= MIN_LENHEI * 0.01 &&
            height.value <= MAX_LENHEI * 0.01
          );
        return true;
      },
      {
        message: `La taille debout doit être comprise entre ${MIN_LENHEI}cm et ${MAX_LENHEI}cm.`,
        path: ["value"],
      }
    )
);

export const LengthZodSchema = z.preprocess(
  (raw: any) => {
    if (!raw || typeof raw !== "object" || raw.value === 0) return undefined;
    return raw;
  },
  z
    .object({
      code: z.string().nonempty(),
      value: z.number().positive("La taille couchée doit être positive."),
      unit: z.enum(["cm", "m"], {
        errorMap: (issue, ctx) => ({
          message:
            "Unité invalide. Seules les valeurs 'cm' et 'm' sont acceptées.",
        }),
      }),
    })
    .refine(
      length => {
        if (length.unit === "cm")
          return length.value >= MIN_LENHEI && length.value <= MAX_LENHEI;
        if (length.unit === "m")
          return (
            length.value >= MIN_LENHEI * 0.01 &&
            length.value <= MAX_LENHEI * 0.01
          );
        return true;
      },
      {
        message: `La taille couchée doit être comprise entre ${MIN_LENHEI}cm et ${MAX_LENHEI}cm.`,
        path: ["value"],
      }
    )
);

export const MUACZodSchema = z.preprocess(
  (raw: any) => {
    if (!raw || typeof raw !== "object" || raw.value === 0) return undefined;
    return raw;
  },
  z
    .object({
      code: z.string().nonempty(),
      value: z.number().positive("Le périmètre brachial doit être positif."),
      unit: z.enum(["cm", "mm"], {
        errorMap: (issue, ctx) => ({
          message:
            "Unité invalide. Seules les valeurs 'cm' et 'mm' sont acceptées.",
        }),
      }),
    })
    .refine(
      muac => {
        if (muac.unit === "cm") return muac.value >= 6.5 && muac.value <= 35;
        if (muac.unit === "mm") return muac.value >= 65 && muac.value <= 350;
        return true;
      },
      {
        message:
          "Le périmètre brachial doit être compris entre 6.5 cm et 35cm ou 65mm et 350mm.",
        path: ["value"],
      }
    )
);

export const HeadCircumferenceZodSchema = z.preprocess(
  (raw: any) => {
    if (!raw || typeof raw !== "object" || raw.value === 0) return undefined;
    return raw;
  },
  z
    .object({
      code: z.string().nonempty(),
      value: z.number().positive("Le périmètre crânien doit être positif."),
      unit: z.enum(["cm", "mm"], {
        errorMap: (issue, ctx) => ({
          message:
            "Unité invalide. Seules les valeurs 'cm' et 'mm' sont acceptées.",
        }),
      }),
    })
    .refine(
      head_circumference => {
        if (head_circumference.unit === "cm")
          return (
            head_circumference.value >= 5 && head_circumference.value <= 100
          );
        if (head_circumference.unit === "mm")
          return (
            head_circumference.value >= 50 && head_circumference.value <= 1000
          );
        return true;
      },
      {
        message:
          "Le périmètre crânien doit être compris entre 5cm et 100cm ou 50mm et 1000mm.",
        path: ["value"],
      }
    )
);

export const TSFZodSchema = z.preprocess(
  (raw: any) => {
    if (!raw || typeof raw !== "object" || raw.value === 0) return undefined;
    return raw;
  },
  z
    .object({
      code: z.string().nonempty(),
      value: z
        .number()
        .positive("La valeur du pli cutané tricipital doit être positif."),
      unit: z.enum(["mm"], {
        errorMap: (issue, ctx) => ({
          message: "Unité invalide. Seules les valeurs en 'mm' sont acceptées.",
        }),
      }),
    })
    .refine(
      tsf => {
        if (tsf.unit === "mm") return tsf.value >= 0 && tsf.value <= 1000;
        return true;
      },
      {
        message:
          "La valeur du pli cutané tricipital doit être compris entre 0mm et 1000mm.",
        path: ["value"],
      }
    )
);

export const SSFZodSchema = z.preprocess(
  (raw: any) => {
    if (!raw || typeof raw !== "object" || raw.value === 0) return undefined;
    return raw;
  },
  z
    .object({
      code: z.string().nonempty(),
      value: z
        .number()
        .positive("La valeur du pli cutané sous-scapulaire doit être positif."),
      unit: z.enum(["mm"], {
        errorMap: (issue, ctx) => ({
          message: "Unité invalide. Seules les valeurs en 'mm' sont acceptées.",
        }),
      }),
    })
    .refine(
      ssf => {
        if (ssf.unit === "mm") return ssf.value >= 0 && ssf.value <= 1000;
        return true;
      },
      {
        message:
          "La valeur du pli cutané sous-scapulaire doit être compris entre 0mm et 1000mm.",
        path: ["value"],
      }
    )
);

export const dateZodSchema = (message?: string, fieldName?: string) =>
  z.string().refine(
    val => {
      return !isNaN(Date.parse(val));
    },
    { message: message || "Date invalide.", path: fieldName ? [fieldName] : [] }
  );

export const EdemaZodSchema = z.enum(["yes", "no"]);

export const BirthDateToTodayZodSchema = z
  .object({
    birthDate: dateZodSchema("La date de naissance est invalide.", "birthDate"),
  })
  .transform(data => {
    const date1 = new Date(data.birthDate);
    return convertBirthDateIntoAgeInMonth(date1);
  });
export const SexZodSchema = z.object({
  [AnthroSystemCodes.SEX]: z.enum([Sex.MALE, Sex.FEMALE], {
    errorMap: () => ({ message: "Le sexe est requis" }),
  }),
});
