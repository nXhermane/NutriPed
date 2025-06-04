import { FormSchema } from "@/components/custom";
import { Sex } from "@/core/shared";

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
      {
        label: "N°",
        type: "text",
        placeholder: "N°",
        name: "number",
        default: "",
      },
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
