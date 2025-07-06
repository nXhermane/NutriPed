import { VStack } from "@/components/ui/vstack";
import { SuggestMilkForm } from "./SuggestMilkForm";
import {
  SuggestMilkFormSchema,
  SuggestMilkFormZodSchema,
} from "@/src/constants/ui";
import { FadeInCardY } from "@/components/custom/motion";
import { useRef, useState } from "react";
import { FormHandler } from "@/components/custom";
import { usePediatricApp } from "@/adapter";
import {
  MilkSuggestionResultDto,
  SuggestMilkRequest,
} from "@/core/nutrition_care";
import { SuggestMilkResult } from "./SuggestMilkResult";
import { useToast } from "@/src/context";

export const SuggestMilkPanel = () => {
  const {
    nutritionCareServices: { milk },
  } = usePediatricApp();
  const toast = useToast();
  const [suggestionResult, setSuggestionResult] =
    useState<MilkSuggestionResultDto | null>(null);

  const formRef = useRef<FormHandler<any>>(null);
  const onSubmit = async () => {
    setSuggestionResult(null);
    const data = await formRef.current?.submit();
    if (data) {
      const result = await milk.suggestMilk(data as SuggestMilkRequest);
      if ("data" in result) {
        setSuggestionResult(result.data);
      } else {
        if (JSON.parse(result.content) === "Milk is not found.") {
          toast.show(
            "Info",
            "Correspondance non trouvée",
            "Aucun lait adapté à ce profil de patient n'est disponible dans la base de données."
          );
        } else {
          toast.show(
            "Error",
            "Erreur technique",
            `Une erreur est survenue lors du calcul.\nDétail : ${JSON.parse(result.content)}`
          );
        }
      }
    }
  };
  return (
    <VStack className="h-full w-full bg-background-primary">
      <FadeInCardY delayNumber={2}>
        <SuggestMilkForm
          formRef={formRef}
          onSubmit={onSubmit}
          submitBtnLabel="Caluler la suggestion de lait"
          submitBtnRightIcon="Calculator"
          schema={{
            fields: SuggestMilkFormSchema[0].fields,
            zodSchema: SuggestMilkFormZodSchema,
          }}
        />
      </FadeInCardY>

      {suggestionResult && (
        <FadeInCardY delayNumber={3}>
          <SuggestMilkResult result={suggestionResult} />
        </FadeInCardY>
      )}
    </VStack>
  );
};
