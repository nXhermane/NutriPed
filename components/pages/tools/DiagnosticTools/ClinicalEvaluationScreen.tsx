import {
  DynamicFormGenerator,
  FakeBlur,
  FormHandler,
  Loading,
} from "@/components/custom";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { HStack } from "@/components/ui/hstack";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { ClinicalNutritionalAnalysisResultDto } from "@/core/diagnostics";
import {
  useClinicalReference,
  useClinicalSignReferenceFormGenerator,
} from "@/src/hooks";
import { useClinicalSignAnalyser } from "@/src/hooks/pages/tools/useClinicalSignAnlyser";
import { Calculator, Check, Stethoscope, X } from "lucide-react-native";
import { useRef, useState } from "react";
import { ScrollView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import colors from "tailwindcss/colors";
import { ClinicalEvaluationResultModal } from "./ClinicalEvaluationResultModal";

export function ClinicalEvaluationScreen() {
  const { data, onLoading, error } = useClinicalReference();
  const {
    data: formData,
    variableUsageMap,
    onLoading: formOnLoading,
  } = useClinicalSignReferenceFormGenerator(data);
  const handleClinicalEvaluation = useClinicalSignAnalyser();
  const dynamicFormRef = useRef<FormHandler<any>>(null);
  const [onSubmit, setOnSubmit] = useState<boolean>(false);
  const [onError, setOnError] = useState<boolean>(false);
  const [onSucess, setOnSucess] = useState<boolean>(false);
  const [clinicalEvaluationResult, setClinicalEvaluationResult] = useState<
    ClinicalNutritionalAnalysisResultDto[] | null
  >(null);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const handleSubmitForm = async () => {
    setOnSubmit(true);
    setOnError(false);
    setOnSucess(false);
    const data = await dynamicFormRef.current?.submit();
    if (data) {
      const result = await handleClinicalEvaluation(data, variableUsageMap!);
      if (result && "data" in result) {
        setClinicalEvaluationResult(result.data);
        setOnSucess(true);
        setShowResultModal(true);
      } else {
        setOnError(true);
      }
    } else {
      setOnError(true);
    }
    setOnSubmit(false);
  };
  if (onLoading || formOnLoading || !formData)
    return <Loading>Chargement...</Loading>;

  return (
    <HStack className="flex-1 items-center justify-between bg-background-primary">
      <VStack className="mx-4 my-4 rounded-xl bg-background-secondary p-3 pb-16">
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          {formData && (
            <DynamicFormGenerator
              ref={dynamicFormRef}
              schema={formData.schema}
              zodSchema={formData.zodSchema}
              className="p-0 px-0"
              onChange={(fieldName, value) => {
                setOnError(false);
                setOnSucess(false);
              }}
            />
          )}
        </KeyboardAwareScrollView>
      </VStack>
      <HStack className="absolute bottom-0 w-full overflow-hidden rounded-xl">
        <FakeBlur className="w-full px-8 py-4">
          <Button
            className={`h-v-10 w-full rounded-xl ${onError ? "bg-red-500" : "bg-primary-c_light"}`}
            onPress={handleSubmitForm}
          >
            {onSubmit ? (
              <ButtonSpinner
                size={"small"}
                className="data-[active=true]:text-primary-c_light"
              />
            ) : (
              <ButtonIcon
                as={Stethoscope}
                className="text-typography-primary"
              />
            )}
            <ButtonText className="font-h4 font-medium text-typography-primary data-[active=true]:text-primary-c_light">
              Examiner
            </ButtonText>

            {onSucess && (
              <ButtonIcon as={Check} className="text-typography-primary" />
            )}
            {onError && (
              <ButtonIcon as={X} className="text-typography-primary" />
            )}
          </Button>
        </FakeBlur>
      </HStack>
      <ClinicalEvaluationResultModal
        isVisible={showResultModal}
        results={clinicalEvaluationResult!}
        onClose={() => setShowResultModal(false)}
      />
    </HStack>
  );
}
