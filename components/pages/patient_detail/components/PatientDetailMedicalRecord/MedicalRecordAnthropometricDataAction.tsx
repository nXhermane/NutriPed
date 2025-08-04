import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { MedicalRecordDto } from "@/core/medical_record";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { HStack } from "@/components/ui/hstack";
import {
  AnthroSystemCodes,
  GetAnthropometricMeasureRequest,
} from "@/core/diagnostics";
import { useAnthropometricMeasure } from "@/src/hooks";
import {
  DynamicFormGenerator,
  FormHandler,
  Loading,
} from "@/components/custom";
import { getAnthropDataFormSchemaWithCode } from "@/src/constants/ui";
import { IField } from "@/components/custom/FormField";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import {
  Button,
  ButtonGroup,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { Check, X } from "lucide-react-native";
import { usePediatricApp } from "@/adapter";

import { Alert } from "react-native";
import {
  useDailyMedicalRecordDataActionModal,
  usePatientDetail,
} from "@/src/context/pages";
import { uiBus } from "@/uiBus";

export interface MedicalRecordAnthropometricDataActionProps {
  data: MedicalRecordDto["anthropometricData"][number];
}

export const MedicalRecordAnthropometricDataAction: React.FC<
  MedicalRecordAnthropometricDataActionProps
> = ({ data }) => {
  const { patient } = usePatientDetail();
  const { medicalRecordService } = usePediatricApp();
  const { close } = useDailyMedicalRecordDataActionModal();
  const formRef = useRef<FormHandler<any>>(null);

  const getAnthropRefReq = useMemo<GetAnthropometricMeasureRequest>(
    () => ({
      code: data.code,
    }),
    [data.code]
  );
  const {
    data: anthropometricRefs,
    error,
    onLoading,
  } = useAnthropometricMeasure(getAnthropRefReq);
  const formSchema = useMemo(() => {
    return getAnthropDataFormSchemaWithCode(data.code as AnthroSystemCodes);
  }, [getAnthropDataFormSchemaWithCode, data.code]);
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
    if (formData) {
      const anthrop = formData[data.code];
      const result = await medicalRecordService.update({
        medicalRecordId: patient.id,
        data: {
          anthropometricData: [
            {
              id: data.id,
              measurement: {
                unit: anthrop.unit,
                value: anthrop.value,
              },
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
              data: { anthropometricData: [data.id] },
            });
            if ("data" in result) setIsSuccessDelete(true);
            else {
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
  if (onLoading) return <Loading />;
  return (
    <BottomSheetScrollView>
      <VStack className="items-center border-b-[0.5px] border-primary-border/10 py-v-2">
        <Heading className="font-h3 text-lg font-semibold text-typography-primary">
          Gestion de la mesure
        </Heading>
        <Text className="font-body text-sm font-normal text-typography-primary_light">
          Modifier ou supprimer cette mesure
        </Text>
      </VStack>
      <VStack>
        <VStack className="mx-4 my-v-2 rounded-xl bg-primary-c_light/10 px-4 py-v-2">
          <Text className="font-h4 text-base font-medium text-typography-primary">
            Mesure actuelle
          </Text>
          <HStack className="gap-1">
            <Text className="font-body text-sm font-normal text-typography-primary_light">
              {anthropometricRefs[0]?.name}
            </Text>
            <Text>•</Text>
            <Text className="font-h4 text-sm font-medium text-typography-primary">
              {data.value} {data.unit}
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
              schema={[{ fields: [formSchema?.field as IField] }]}
              initialState={{
                [data.code]: {
                  value: {
                    unit: data.unit,
                    value: data.value,
                    code: data.code,
                  },
                },
              }}
              zodSchema={formSchema?.zodSchema as any}
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
  );
};
