import { FormSchema, SchemaConstraint } from "@/components/custom";
import {
  AnthroSystemCodes,
  CLINICAL_SIGNS,
  MAX_LENHEI,
  MIN_LENHEI,
} from "@/core/constants";
import z from "zod";

export const DiagnosticDataFormSchema: FormSchema = [
  {
    section: "Anthropometrie",
    fields: [
      {
        type: "quantity",
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
      },
      {
        type: "quantity",
        default: {
          unit: "cm",
          value: 0,
        },
        defaultUnit: { unit: "cm", convertionFactor: 1, label: "cm" },
        label: "Taille Debout",
        name: AnthroSystemCodes.HEIGHT,
        unitOptions: [
          { unit: "cm", convertionFactor: 1, label: "cm" },
          { unit: "m", convertionFactor: 100, label: "m" },
        ],
        placeholder: "Ex: 20",
      },
      {
        type: "quantity",
        default: {
          unit: "cm",
          value: 0,
        },
        defaultUnit: { unit: "cm", convertionFactor: 1, label: "cm" },
        label: "Taille Couchée",
        name: AnthroSystemCodes.LENGTH,
        unitOptions: [
          { unit: "cm", convertionFactor: 1, label: "cm" },
          { unit: "m", convertionFactor: 100, label: "m" },
        ],
        placeholder: "Ex: 20",
      },
      {
        type: "quantity",
        default: {
          unit: "cm",
          value: 0,
        },
        defaultUnit: { unit: "cm", convertionFactor: 1, label: "cm" },
        label: "Périmètre brachial",
        name: AnthroSystemCodes.MUAC,
        unitOptions: [
          { unit: "cm", convertionFactor: 1, label: "cm" },
          { unit: "mm", convertionFactor: 0.1, label: "mm" },
        ],
        placeholder: "Ex: 20",
      },
      {
        type: "quantity",
        default: {
          unit: "cm",
          value: 0,
        },
        defaultUnit: { unit: "cm", convertionFactor: 1, label: "cm" },
        label: "Périmètre crânien",
        name: AnthroSystemCodes.HEAD_CIRCUMFERENCE,
        unitOptions: [
          { unit: "cm", convertionFactor: 1, label: "cm" },
          { unit: "mm", convertionFactor: 0.1, label: "mm" },
        ],
        placeholder: "Ex: 20",
      },
      {
        type: "quantity",
        default: {
          unit: "mm",
          value: 0,
        },
        defaultUnit: { unit: "mm", convertionFactor: 1, label: "mm" },
        label: "Pli cutané tricipital",
        name: AnthroSystemCodes.TSF,
        unitOptions: [{ unit: "mm", convertionFactor: 1, label: "mm" }],
        placeholder: "Ex: 20",
      },
      {
        type: "quantity",
        default: {
          unit: "mm",
          value: 0,
        },
        defaultUnit: { unit: "mm", convertionFactor: 1, label: "mm" },
        label: "Pli cutané sous-scapulaire",
        name: AnthroSystemCodes.SSF,
        unitOptions: [{ unit: "mm", convertionFactor: 1, label: "mm" }],
        placeholder: "Ex: 20",
      },
    ],
  },
  {
    section: "Clinique",
    fields: [
      {
        type: "select",
        default: "Absent",
        label: "Œdème bilateral",
        name: CLINICAL_SIGNS.EDEMA,
        selectOptions: [
          { label: "Present", value: "yes" },
          {
            label: "Absent",
            value: "no",
          },
        ],
      },
    ],
  },
];
// type : : SchemaConstraint<typeof DiagnosticDataFormSchema>
export const DiagnosticDataFormZodSchema: any = z
  .object({
    // Anthropometrie
    [AnthroSystemCodes.WEIGHT]: z
      .object({
        code: z.string().nonempty(),
        value: z.number().positive("Le poids doit être positive."),
        unit: z.enum(["kg", "g"], {
          errorMap: (issue, ctx) => ({
            message:
              "Unité invalide. Seules les valeurs 'kg' et 'g' sont acceptées.",
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
          message: "Le poids doit être au moins 500g ou 0.5kg.",
          path: ["value"],
        }
      ),
    [AnthroSystemCodes.HEIGHT]: z.preprocess(
      (raw: any) => {
        if (!raw || typeof raw !== "object" || raw.value === 0)
          return undefined;
        return raw;
      },
      z
        .object({
          code: z.string().nonempty(),
          value: z.number().positive("La taille debout doit être positive."),
          unit: z.enum(["cm", "m"], {
            errorMap: (issue, ctx) => ({
              message:
                "Unité invalide. Seules les valeurs 'cm' et 'mm' sont acceptées.",
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
            message: `La taille debout doit être au comprise entre ${MIN_LENHEI}cm et ${MAX_LENHEI}cm.`,
            path: ["value"],
          }
        )
        .optional()
    ),
    [AnthroSystemCodes.LENGTH]: z.preprocess(
      (raw: any) => {
        if (!raw || typeof raw !== "object" || raw.value === 0)
          return undefined;
        return raw;
      },
      z
        .object({
          code: z.string().nonempty(),
          value: z.number().positive("La taille couchée doit être positive."),
          unit: z.enum(["cm", "m"], {
            errorMap: (issue, ctx) => ({
              message:
                "Unité invalide. Seules les valeurs 'cm' et 'mm' sont acceptées.",
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
            message: `La taille couchée doit être au comprise entre ${MIN_LENHEI}cm et ${MAX_LENHEI}cm.`,
            path: ["value"],
          }
        )
        .optional()
    ),

    [AnthroSystemCodes.MUAC]: z.preprocess(
      (raw: any) => {
        if (!raw || typeof raw !== "object" || raw.value === 0)
          return undefined;
        return raw;
      },
      z
        .object({
          code: z.string().nonempty(),
          value: z
            .number()
            .positive("Le périmètre brachial doit être positif."),
          unit: z.enum(["cm", "mm"], {
            errorMap: (issue, ctx) => ({
              message:
                "Unité invalide. Seules les valeurs 'cm' et 'mm' sont acceptées.",
            }),
          }),
        })
        .refine(
          muac => {
            if (muac.unit === "cm") return muac.value >= 5 && muac.value <= 100; //BETA :
            if (muac.unit === "mm")
              return muac.value >= 50 && muac.value <= 1000;
            return true;
          },
          {
            message:
              "Le périmètre brachial doit être compris entre 5cm et 100cm ou 50mm et 1000mm.",
            path: ["value"],
          }
        )
        .optional()
    ),
    [AnthroSystemCodes.HEAD_CIRCUMFERENCE]: z.preprocess(
      (raw: any) => {
        if (!raw || typeof raw !== "object" || raw.value === 0)
          return undefined;
        return raw;
      },
      z
        .object({
          code: z.string().nonempty(),
          value: z.number().positive("Le périmètre crânien doit être positif."),
          unit: z.enum(["cm", "mm"], {
            errorMap: (issue, ctx) => ({
              message:
                "Unité invalide. Seules les valeurs 'cm' et 'mm' sont acceptées.",
            }),
          }),
        })
        .refine(
          head_circumference => {
            if (head_circumference.unit === "cm")
              return (
                head_circumference.value >= 5 && head_circumference.value <= 100
              ); //BETA :
            if (head_circumference.unit === "mm")
              return (
                head_circumference.value >= 50 &&
                head_circumference.value <= 1000
              );
            return true;
          },
          {
            message:
              "Le périmètre crânien doit être compris entre 5cm et 100cm ou 50mm et 1000mm.",
            path: ["value"],
          }
        )
        .optional()
    ),
    [AnthroSystemCodes.TSF]: z.preprocess(
      (raw: any) => {
        if (!raw || typeof raw !== "object" || raw.value === 0)
          return undefined;
        return raw;
      },
      z
        .object({
          code: z.string().nonempty(),
          value: z
            .number()
            .positive("La valeur du pli cutané tricipital doit être positif."),
          unit: z.enum(["mm"], {
            errorMap: (issue, ctx) => ({
              message:
                "Unité invalide. Seules les valeurs en 'mm' sont acceptées.",
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
              "La valeur du pli cutané sous-scapulaire doit être compris entre 0mm et 1000mm.",
            path: ["value"],
          }
        )
        .optional()
    ),
    [AnthroSystemCodes.SSF]: z.preprocess(
      (raw: any) => {
        if (!raw || typeof raw !== "object" || raw.value === 0)
          return undefined;
        return raw;
      },
      z
        .object({
          code: z.string().nonempty(),
          value: z
            .number()
            .positive(
              "La valeur du pli cutané sous-scapulaire doit être positif."
            ),
          unit: z.enum(["mm"], {
            errorMap: (issue, ctx) => ({
              message:
                "Unité invalide. Seules les valeurs en 'mm' sont acceptées.",
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
              "La valeur du pli cutané sous-scapulaire doit être compris entre 0mm et 1000mm.",
            path: ["value"],
          }
        )
        .optional()
    ),
    // Clinical value
    [CLINICAL_SIGNS.EDEMA]: z.enum(["yes", "no"]),
  })
  .refine(
    data => {
      return data[AnthroSystemCodes.LENGTH] || data[AnthroSystemCodes.HEIGHT];
    },
    {
      message:
        "Au moins une taille doit être founir. soit la taille couchée soit la taille debout.",
      path: [AnthroSystemCodes.HEIGHT, AnthroSystemCodes.LENGTH],
    }
  );
