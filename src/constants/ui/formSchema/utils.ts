import z from "zod";

// Fonction utilitaire pour rendre un schema optionnel obligatoire
export const makeRequired = <T extends z.ZodTypeAny>(schema: z.ZodOptional<T>): T => {
  return schema.unwrap();
}

// Fonction utilitaire pour rendre un schema obligatoire optionnel
export const makeOptional = <T extends z.ZodTypeAny>(schema: T): z.ZodOptional<T> => {
  return schema.optional();
};