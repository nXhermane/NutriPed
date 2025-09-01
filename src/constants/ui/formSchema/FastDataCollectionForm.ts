import { FormSchema } from "@/components/custom";
import { BirthDateField, SexField } from "./sharedAnthropometricDataForm";

export const FastDataCollectionFormSchema: FormSchema = [
  {
    section: "Information générales",
    fields: [
      {
        label: "Nom complet",
        type: "text",
        placeholder: "Ex: Dupont Martin",
        name: "fullName",
        isRequire: true,
        default: "",
      },
      SexField,
      BirthDateField,
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
