import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { MedicalRecordDto } from "@/core/medical_record";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { HStack } from "@/components/ui/hstack";
import { GetClinicalSignReferenceRequest } from "@/core/evaluation";
import {
  remapSignDataToClinicalSign,
  useClinicalReference,
  useClinicalSignReferenceFormGenerator,
} from "@/src/hooks";
import {
  DynamicFormGenerator,
  FormHandler,
  Loading,
} from "@/components/custom";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { usePediatricApp } from "@/adapter";
import {
  Button,
  ButtonGroup,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { Check, X } from "lucide-react-native";
import { Alert } from "react-native";
import {
  useDailyMedicalRecordDataActionModal,
  usePatientDetail,
} from "@/src/context/pages";
import { uiBus } from "@/uiBus";

export interface MedicalRecordClinicalSignDataActionProps {
  data: MedicalRecordDto["clinicalData"][number];
}

export const MedicalRecordClinicalSignDataAction: React.FC<
  MedicalRecordClinicalSignDataActionProps
> = ({ data }) => {
  const { patient } = usePatientDetail();
  const { medicalRecordService } = usePediatricApp();
  const { close } = useDailyMedicalRecordDataActionModal();
  const formRef = useRef<FormHandler<any>>(null);
  const getClinialSignRefsReq = useMemo<GetClinicalSignReferenceRequest>(() => {
    return {
      code: data.code,
    };
  }, [data.code]);
  const {
    data: clinicalRefs,
    error,
    onLoading,
  } = useClinicalReference(getClinialSignRefsReq);
  const {
    data: formData,
    onLoading: formOnLoading,
    variableUsageMap,
  } = useClinicalSignReferenceFormGenerator(clinicalRefs, false);
  const [errorOnUpdateSubmit, setErrorOnUpdateSubmit] = useState<string | null>(
    null
  );
  const [errorOnDelete, setErrorOnDelete] = useState<string | null>(null);
  const [isSubmittingUpdateForm, setIsSubmittingUpdateForm] =
    useState<boolean>(false);
  const [isSubmittingDelete, setIsSubmittingDelete] = useState<boolean>(false);
  const [isSuccessOnUpdateForm, setIsSuccessOnUpdateForm] =
    useState<boolean>(false);
  const [isSuccessDelete, setIsSuccessDelete] = useState<boolean>(false);
  const handleSubmitUpdateForm = async () => {
    setErrorOnUpdateSubmit(null);
    setIsSuccessOnUpdateForm(false);
    setIsSubmittingUpdateForm(true);
    const formData = await formRef.current?.submit();
    if (formData && variableUsageMap) {
      const remappedData = remapSignDataToClinicalSign(
        formData,
        variableUsageMap
      );
      const result = await medicalRecordService.update({
        medicalRecordId: patient.id,
        data: {
          clinicalData: [
            {
              code: remappedData[0].code,
              data: remappedData[0].data,
              id: data.id,
            },
          ],
        },
      });
      if ("data" in result) {
        setIsSuccessOnUpdateForm(true);
        uiBus.emit("medical:update");
      } else {
        const _errorContent = JSON.parse(result.content);
        console.error(_errorContent);
        setErrorOnUpdateSubmit(_errorContent);
      }
    }
    setIsSubmittingUpdateForm(false);
  };
  const handleDelete = async () => {
    setErrorOnDelete(null);
    setIsSuccessDelete(false);
    setIsSubmittingDelete(true);
    Alert.alert(
      "Confirmation de l'action",
      "Voulez-vous vraiment supprimer définitivement cette mesure ?",
      [
        {
          text: "Oui",
          async onPress() {
            const result = await medicalRecordService.deleteData({
              medicalRecordId: patient.id,
              data: { clinicalData: [data.id] },
            });
            if ("data" in result) {
              setIsSuccessDelete(true);
              uiBus.emit("medical:update");
            } else {
              const _errorContent = JSON.parse(result.content);
              console.error(_errorContent);
              setErrorOnDelete(_errorContent);
            }
          },
          isPreferred: true,
          style: "default",
        },
        {
          text: "Non",
          style: "destructive",
          onPress: () => {
            return void 0;
          },
        },
      ]
    );
    setIsSubmittingDelete(false);
  };
  useEffect(() => {
    if (isSuccessDelete || isSuccessOnUpdateForm) {
      close();
    }
  }, [isSuccessDelete, isSuccessOnUpdateForm]);
  if (onLoading || formOnLoading || !formData) return <Loading />;
  return (
    <React.Fragment>
      <BottomSheetScrollView>
        <VStack className="items-center border-b-[0.5px] border-primary-border/10 py-v-2">
          <Heading className="font-h3 text-lg font-semibold text-typography-primary">
            Gestion du signe clinique
          </Heading>
          <Text className="font-body text-sm font-normal text-typography-primary_light">
            Modifier ou supprimer le signe clinique
          </Text>
        </VStack>
        <VStack>
          <VStack className="mx-4 my-v-2 rounded-xl bg-primary-c_light/10 px-4 py-v-2">
            <Text className="font-h4 text-base font-medium text-typography-primary">
              Valeur actuelle
            </Text>
            <HStack className="w-full flex-wrap gap-1">
              <Text className="font-body text-sm font-normal text-typography-primary_light">
                {clinicalRefs[0]?.name}
              </Text>
              <Text>•</Text>
              <Text className="font-h4 text-sm font-medium text-typography-primary">
                {data.isPresent ? "Présent" : "Absent"}
              </Text>
              <Text>•</Text>
              <Text className="font-body text-sm font-normal text-typography-primary_light">
                {"Ajouté le " +
                  new Date(data.recordedAt).toLocaleDateString("fr-FR")}
              </Text>
            </HStack>
          </VStack>

          <VStack>
            <KeyboardAwareScrollView>
              <DynamicFormGenerator
                ref={formRef}
                disableSessionShown
                schema={formData?.schema}
                zodSchema={formData.zodSchema}
              />
            </KeyboardAwareScrollView>
          </VStack>
          <HStack className="h-fit w-full px-4 py-4">
            <ButtonGroup className="flex-1">
              <Button
                isDisabled={isSuccessDelete}
                className={`h-v-10 w-full rounded-xl ${errorOnUpdateSubmit ? "bg-red-500" : "bg-primary-c_light"}`}
                onPress={handleSubmitUpdateForm}
              >
                {isSubmittingUpdateForm && (
                  <ButtonSpinner
                    size={"small"}
                    className="data-[active=true]:text-primary-c_light"
                  />
                )}
                <ButtonText className="font-h4 font-medium text-white data-[active=true]:text-primary-c_light">
                  Modifier
                </ButtonText>
                {isSuccessOnUpdateForm && (
                  <ButtonIcon as={Check} className="text-white" />
                )}
                {errorOnUpdateSubmit && (
                  <ButtonIcon as={X} className="text-white" />
                )}
              </Button>
              <Button
                className={`h-v-10 w-full rounded-xl ${errorOnDelete ? "bg-red-800" : "bg-red-500"}`}
                onPress={handleDelete}
              >
                {isSubmittingDelete && (
                  <ButtonSpinner
                    size={"small"}
                    className="data-[active=true]:text-red-500"
                  />
                )}
                <ButtonText className="font-h4 font-medium text-white data-[active=true]:text-red-500">
                  Supprimer définitivement
                </ButtonText>
                {isSuccessDelete && (
                  <ButtonIcon as={Check} className="text-white" />
                )}
                {errorOnDelete && <ButtonIcon as={X} className="text-white" />}
              </Button>
            </ButtonGroup>
          </HStack>
        </VStack>
      </BottomSheetScrollView>
    </React.Fragment>
  );
};
