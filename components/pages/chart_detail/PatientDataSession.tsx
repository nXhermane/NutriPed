import { DynamicFormGenerator, FormHandler } from "@/components/custom";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";
import {
  AnthroSystemCodes,
  GrowthRefChartAndTableCodes,
  GrowthReferenceChartDto,
  IndicatorDto,
} from "@/core/diagnostics";
import {
  useChartDetailHandler,
  useGenerateSchemaForIndicator,
} from "@/src/hooks";
import { ChevronUp, Plus, Trash } from "lucide-react-native";
import React, { useRef, useState } from "react";
import { ScrollView } from "react-native";
import { KeyboardAvoidingView, KeyboardAwareScrollView } from "react-native-keyboard-controller";
import colors from "tailwindcss/colors";
import { ChartMeasurementSerieComponent } from "./ChartMeasurementSerieComponent";
import { GetSerieLabelModal } from "./GetSerieLabelModal";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { GrowthChartComponent } from "./GrowthChart";

export interface PatientDataSessionProps {
  growthChartDto: GrowthReferenceChartDto;
  indicatorDto: IndicatorDto;
}

export const PatientDataSession: React.FC<PatientDataSessionProps> = ({
  growthChartDto,
  indicatorDto,
}) => {
  const schema = useGenerateSchemaForIndicator(indicatorDto);

  const {
    closeLabelPicker,
    handleAction,
    labelPickerIsOpen,
    selectedSerie,
    series,
  } = useChartDetailHandler(
    growthChartDto?.code as GrowthRefChartAndTableCodes
  );
  const dynamicFormRef = useRef<FormHandler<any> | null>(null);

  const handleSubmitAddForm = async () => {
    const data = await dynamicFormRef.current?.submit();
    if (data) {
      const result = handleAction("addMeasure")(data as any);
      if (result) dynamicFormRef.current?.reset();
    }
  };
  const handleNewSerieAction = async () => {
    await handleAction("new")({} as any);
  };
  const handleDeleteSerieAction = async () => {
    if (selectedSerie === null) await handleAction("delete")({} as any);
    else handleAction("deleteSerie")(selectedSerie.serieId as any);
  };

  return (
    <React.Fragment>
      <VStack className="m-4 gap-4 rounded-xl bg-background-secondary px-3 py-3">
        <HStack className="items-center justify-between">
          <Heading className="font-h4 text-base font-medium text-typography-primary">
            Données du patient
          </Heading>
        </HStack>
       
          <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
            {!schema ? (
              <Center className="flex-1 bg-background-primary">
                <Spinner size={"large"} color={colors.blue["600"]} />
              </Center>
            ) : (
              <DynamicFormGenerator
                schema={[{ fields: schema.fields, section: "" }]}
                zodSchema={schema.zodSchema}
                ref={dynamicFormRef}
                className="p-0 px-0"
              />
            )}
          </KeyboardAwareScrollView>
    
        <Button
          className="h-v-10 rounded-xl bg-primary-c_light"
          onPress={handleSubmitAddForm}
        >
          <ButtonIcon as={Plus} className="text-typography-primary" />
          <ButtonText className="font-h4 font-medium text-typography-primary">
            Ajouter mesure
          </ButtonText>
        </Button>
        <GetSerieLabelModal
          isOpen={labelPickerIsOpen}
          onClose={closeLabelPicker}
        />
      </VStack>
      <VStack className="m-4 gap-4 rounded-xl bg-background-secondary px-3 py-3">
        <HStack className="items-center justify-between">
          <Heading className="font-h4 text-base font-medium text-typography-primary">
            Series
          </Heading>
          <HStack className="gap-2">
            <Pressable
              className="rounded-full bg-red-500"
              onPress={handleDeleteSerieAction}
            >
              <Icon as={Trash} className={"m-1 h-5 w-5"} />
            </Pressable>
            <Pressable
              className="rounded-full bg-primary-c_light p-1"
              onPress={handleNewSerieAction}
            >
              <Icon as={Plus} className={"h-5 w-5"} />
            </Pressable>
          </HStack>
        </HStack>
        <ChartMeasurementSerieComponent
          series={series}
          selectedSerie={selectedSerie?.serieId}
          onChooseAction={value =>
            handleAction("choose")({ serieId: value.serieId } as any)
          }
          onDeleteMeasureAction={(measureId: string) => {
            handleAction("deleteMeasure")(measureId as any);
          }}
          neededMeasureCodes={
            indicatorDto?.neededMeasureCodes as AnthroSystemCodes[]
          }
        />
      </VStack>
      <GrowthChartComponent />
    </React.Fragment>
  );
};
