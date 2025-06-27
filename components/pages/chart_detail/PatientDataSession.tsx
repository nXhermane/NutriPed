import { DynamicFormGenerator, FormHandler } from "@/components/custom";
import { FormField } from "@/components/custom/FormField";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionTitleText,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
} from "@/components/ui/actionsheet";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@/components/ui/modal";
import { ActionsheetDragIndicator } from "@/components/ui/select/select-actionsheet";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import {
  GrowthRefChartAndTableCodes,
  GrowthReferenceChartDto,
  IndicatorDto,
} from "@/core/diagnostics";
import {
  useChartDetailHandler,
  useGenerateSchemaForIndicator,
} from "@/src/hooks";
import { ChartMeasurementSerie } from "@/src/store";
import {
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react-native";
import React, { useRef, useState } from "react";
import { ScrollView } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import colors from "tailwindcss/colors";

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
      console.log(data);
    }
  };
  return (
    <VStack className="m-4 gap-4 rounded-xl bg-background-secondary px-3 py-3">
      <HStack className="items-center justify-between">
        <Heading className="font-h4 text-lg font-medium text-typography-primary">
          Données du patient
        </Heading>
      </HStack>
      <ScrollView>
        <KeyboardAvoidingView>
          {!schema ? (
            <Center className="flex-1 bg-background-primary">
              <Spinner size={"large"} color={colors.blue["600"]} />
            </Center>
          ) : (
            <DynamicFormGenerator
              schema={[{ fields: schema.fields,section: "" }]}
              zodSchema={schema.zodSchema}
              ref={dynamicFormRef}
              className="p-0 px-0"
            />
          )}
        </KeyboardAvoidingView>
      </ScrollView>
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
  );
};

export interface GetSerieLabelModalProps {
  isOpen?: boolean;
  onClose?: (value: { serieLabel: string } | null) => void;
}
export const GetSerieLabelModal: React.FC<GetSerieLabelModalProps> = React.memo(
  ({ isOpen, onClose }) => {
    const [serieLabel, setSerieLabel] = useState<string>("");
    const [error, setError] = useState<string | undefined>(undefined);
    return (
      <Modal
        isOpen={isOpen}
        onClose={() => onClose && onClose(null)}
        useRNModal
      >
        <ModalBackdrop />
        <ModalContent className="w-[90%] rounded-xl border-0 border-primary-border/5 bg-background-primary px-3">
          <ModalBody>
            <FormField
              field={{
                type: "text",
                default: "",
                label: "Entrer le nom de la serie de mesures",
                name: "serieLabel",
              }}
              value={serieLabel}
              onChange={(fieldName: string, value: string) => {
                setError(undefined);
                setSerieLabel(value);
              }}
              error={error}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              onPress={() => onClose && onClose(null)}
              variant="outline"
              className="rounded-xl border-[1px] border-primary-border/5 bg-background-secondary"
            >
              <ButtonText className="font-h4 text-sm font-medium text-typography-primary_light">
                Annuler
              </ButtonText>
            </Button>
            <Button
              onPress={() => {
                if (serieLabel.trim() === "") {
                  setError("Le nom de la serie ne peut être vide.");
                  return;
                }
                onClose && onClose({ serieLabel });
                setSerieLabel("");
              }}
              className={`rounded-xl border-[1px] border-primary-border/5 ${error ? "bg-red-500" : "bg-primary-c_light"}`}
            >
              <ButtonText className="font-h4 text-sm font-medium text-typography-primary">
                Enregistrer
              </ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
);

export interface GetSerieIdModalProps {
  isOpen?: boolean;
  onClose?: (value: { serieId: string } | null) => void;
  selectionOptions: { serieLabel: string; serieId: string }[];
}
export const GetSerieIdModal: React.FC<GetSerieIdModalProps> = React.memo(
  ({ selectionOptions, isOpen, onClose }) => {
    return (
      <Actionsheet isOpen={isOpen} onClose={() => onClose && onClose(null)}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          {selectionOptions.map(item => {
            return (
              <ActionsheetItem
                key={item.serieId}
                onPress={() => onClose && onClose({ serieId: item.serieId })}
              >
                <ActionsheetItemText>{item.serieLabel}</ActionsheetItemText>
              </ActionsheetItem>
            );
          })}
        </ActionsheetContent>
      </Actionsheet>
    );
  }
);

export interface ChartMeasurementSerieComponentProps {
  series: ChartMeasurementSerie[];
}
export const ChartMeasurementSerieComponent: React.FC<ChartMeasurementSerieComponentProps> =
  React.memo(({ series = [] }) => {
    return (
      <Accordion>
        {series.map(serie => (
          <AccordionItem value={serie.id} key={serie.id}>
            <AccordionHeader>
              <AccordionTrigger>
                {({ isExpanded }: any) => {
                  return (
                    <>
                      <AccordionTitleText>{serie.label}</AccordionTitleText>
                      {isExpanded ? (
                        <AccordionIcon as={ChevronUp} />
                      ) : (
                        <AccordionIcon as={ChevronDown} />
                      )}
                    </>
                  );
                }}
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>
              {serie.data.map(item => (
                <Text key={item.id}>{JSON.stringify(item.data)}</Text>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  });
/**
 *  <Menu
          offset={5}
          className="rounded-lg border-[1px] border-primary-border/5"
          trigger={({ ...triggerProps }) => {
            return (
              <Pressable {...triggerProps}>
                <Icon
                  as={ChevronDown}
                  className="h-5 w-5 rounded-full bg-background-primary p-1"
                />
              </Pressable>
            );
          }}
        >
          {ChartDetailMenuOtpionData.map(item => (
            <MenuItem
              className="items-center gap-3"
              key={item.key}
              textValue={item.label}
              onPress={handleMenu(item.key)}
            >
              <Icon
                as={icons[item.iconName]}
                className={`h-3 w-3 ${item.color}`}
              />
              <MenuItemLabel className="font-body text-xs font-normal">
                {item.label}
              </MenuItemLabel>
            </MenuItem>
          ))}
        </Menu>
 */
