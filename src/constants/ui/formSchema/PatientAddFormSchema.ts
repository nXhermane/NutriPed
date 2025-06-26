import { FormSchema, SchemaConstraint } from "@/components/custom";
import { Sex } from "@/core/shared";
import { z } from "zod";

export const AddPatientFormSchema: FormSchema = [
  {
    section: "Informations personnelles",
    fields: [
      {
        label: "Nom complet",
        type: "text",
        placeholder: "Ex: Dupont Martin",
        name: "fullName",
        isRequire: true,
        default: "",
      },
      {
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
        name: "gender",
        isRequire: true,
        default: Sex.MALE,
      },
      {
        label: "Date de naissance",
        type: "date",
        name: "birthDate",
        mode: "date",
        maxDate: new Date(),
        placeholder: "2025-03-20",
        isRequire: true,
        default: new Date().toISOString().split("T")[0],
      },
    ],
  },
  {
    section: "Contact",
    fields: [
      {
        label: "Email",
        type: "text",
        placeholder: "example@gmail.com",
        name: "email",
        default: "",
      },
      {
        label: "Téléphone",
        type: "text",
        placeholder: "+229 XX XX XX XX",
        name: "phone",
        default: "",
      },
    ],
  },
  {
    section: "Adresse",
    fields: [
      {
        label: "Rue",
        type: "text",
        placeholder: "Nom de rue",
        name: "street",
        default: "",
      },
      // {
      //   label: "N°",
      //   type: "text",
      //   placeholder: "N°",
      //   name: "number",
      //   default: "",
      // },
      {
        label: "Ville",
        type: "text",
        placeholder: "Cotonou",
        name: "city",
        default: "",
      },
      {
        label: "Code postal",
        type: "text",
        placeholder: "Code postal",
        name: "postalCode",
        default: "",
      },
      { label: "Pays", type: "text", name: "country", default: "Bénin" },
    ],
  },
  {
    section: "Parents",
    fields: [
      {
        label: "Nom de la mère",
        type: "text",
        placeholder: "Nom complet de la mère",
        name: "motherName",
        default: "",
      },
      {
        label: "Nom du père",
        type: "text",
        placeholder: "Nom complet du père",
        name: "fatherName",
        default: "",
      },
    ],
  },
];

export const AddPatientFormZodSchema: SchemaConstraint<
  typeof AddPatientFormSchema
> = z.object({
  // Informations personnelles
  fullName: z.string().min(2, "Le nom complet est requis"),
  gender: z.enum([Sex.MALE, Sex.FEMALE], {
    errorMap: () => ({ message: "Le sexe est requis" }),
  }),
  birthDate: z.string().min(1, "La date de naissance est requise"),

  // Contact
  email: z
    .string()
    .email("Email invalide")
    .or(z.string().length(0))
    .transform(val => (val.trim() === "" ? "default@gmail.com" : val)),
  phone: z
    .string()
    .regex(/^\+?[0-9\s-]{8,}$/, "Numéro de téléphone invalide")
    .or(z.string().length(0))
    .transform(val => (val.trim() === "" ? "+229 XXXXXXXX" : val)),

  // Adresse
  street: z.string(),
  // number: z.string(),
  city: z.string().transform(val => (val.trim() === "" ? "Bénin" : val)),
  postalCode: z.string(),
  country: z.string(),

  // Parents
  motherName: z.string(),
  fatherName: z.string(),
});
