import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { useMemo, useState } from "react";
import { HumanDateFormatter } from "@/utils";
import {
  GetAnthropometricMeasureRequest,
  GetBiochemicalReferenceRequest,
  GetClinicalSignReferenceRequest,
} from "@/core/diagnostics";
import { MedicalRecordDto } from "@/core/medical_record";
import {
  MedicalRecordDataOrdoredByDay,
  useAnthropometricMeasure,
  useBiochemicalReference,
  useClinicalReference,
  useComplicationRefs,
} from "@/src/hooks";
import { Loading } from "@/components/custom";
import { Icon } from "@/components/ui/icon";
import {
  ChevronDownIcon,
  ChevronUpIcon,
<<<<<<< HEAD
=======
  Edit,
>>>>>>> main
  FlaskConical,
  PillBottle,
  Ruler,
  Stethoscope,
} from "lucide-react-native";
import { Center } from "@/components/ui/center";
import { usePediatricApp } from "@/adapter";
import { DateManager } from "@/core/shared";
import React from "react";
import { Box } from "@/components/ui/box";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Pressable } from "@/components/ui/pressable";
import {
  DailyMedicalRecordDataActionModal,
  MedicalRecordDataType,
} from "./DailyMedicalRecordDataActionBottomSheet";

interface DailyMedicalRecordDataProps {
  data: MedicalRecordDataOrdoredByDay[number];
  onUpdate?: () => void;
}
export const DailyMedicalRecordDataComponent: React.FC<
  DailyMedicalRecordDataProps
> = ({ data, onUpdate = () => void 0 }) => {
  const [
    showMedicalRecordDataActionModal,
    setShowMedicalRecordDataActionModal,
  ] = useState<boolean>(false);
  const [currentMedicalRecordData, setCurrentMedicalRecordData] =
    useState<MedicalRecordDataType | null>(null);
  const dateFormatOptions: Intl.DateTimeFormatOptions = useMemo(
    () => ({
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    []
  );
  return (
    <React.Fragment>
      <VStack className="mx-2 gap-3 overflow-hidden rounded-2xl border-[0.5px] border-primary-border/5 bg-background-secondary pt-v-3">
        <Box className="absolute -left-3 top-2 h-2 w-2 rounded-full bg-primary-c_light"></Box>
        <VStack className="px-4">
          <HStack className="justify-between">
            <Text className="font-body text-sm font-normal text-typography-primary_light">
              {HumanDateFormatter.toRelativeDate(
                DateManager.formatDate(data.recordDate),
                false
              )}
              {" - "}
              {data.recordDate.toLocaleDateString("fr-FR", dateFormatOptions)}
            </Text>
          </HStack>
          <HStack></HStack>
        </VStack>
        <Accordion>
          {data.anthrop.length != 0 && (
            <AccordionItem
              value="anthrop"
              className="border-b-[0.5px] border-primary-border/5"
            >
              <AccordionHeader>
                <AccordionTrigger>
                  {({ isExpanded }: { isExpanded: boolean }) => {
                    return (
                      <>
                        <HStack className="w-full items-center justify-between">
                          <HStack className="items-center gap-2">
                            <Center className="rounded-full bg-blue-500/20 p-1">
                              <Icon
                                as={Ruler}
                                className="h-4 w-4 text-blue-500"
                              />
                            </Center>
                            <Text className="font-h4 text-base font-medium text-typography-primary">
                              Anthropométriques
                            </Text>
                          </HStack>
                          <HStack className="gap-2">
                            <Center className="rounded-full bg-blue-500/20 px-1">
                              <Text className="rounded-full font-body text-xs font-normal text-blue-500">
                                {data.anthrop.length}
                              </Text>
                            </Center>
                            {isExpanded ? (
                              <AccordionIcon
                                as={ChevronUpIcon}
                                className="h-4 w-4"
                              />
                            ) : (
                              <AccordionIcon
                                as={ChevronDownIcon}
                                className="h-4 w-4"
                              />
                            )}
                          </HStack>
                        </HStack>
                      </>
                    );
                  }}
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent>
                <VStack className="gap-2 pl-5 pt-2">
                  {data.anthrop.map((item, index) => (
                    <AnthropometricItemComponent
                      key={item.id}
                      data={item}
                      onPress={() => {
                        setShowMedicalRecordDataActionModal(true);
                        setCurrentMedicalRecordData({
                          tag: "anthropometric",
                          data: item,
                        });
                      }}
                    />
                  ))}
                </VStack>
              </AccordionContent>
            </AccordionItem>
          )}
          {data.biological.length != 0 && (
            <AccordionItem
              value="biological"
              className="border-b-[0.5px] border-primary-border/5"
            >
              <AccordionHeader>
                <AccordionTrigger>
                  {({ isExpanded }: { isExpanded: boolean }) => {
                    return (
                      <>
                        <HStack className="w-full items-center justify-between">
                          <HStack className="gap-2">
                            <Center className="rounded-full bg-indigo-500/20 p-1">
                              <Icon
                                as={FlaskConical}
                                className="h-4 w-4 text-indigo-500"
                              />
                            </Center>
                            <Text className="font-h4 text-base font-medium text-typography-primary">
                              Biologiques
                            </Text>
                          </HStack>

                          <HStack className="gap-2">
                            <Center className="rounded-full bg-indigo-500/20 px-1">
                              <Text className="rounded-full font-body text-xs font-normal text-indigo-500">
                                {data.biological.length}
                              </Text>
                            </Center>
                            {isExpanded ? (
                              <AccordionIcon
                                as={ChevronUpIcon}
                                className="h-4 w-4"
                              />
                            ) : (
                              <AccordionIcon
                                as={ChevronDownIcon}
                                className="h-4 w-4"
                              />
                            )}
                          </HStack>
                        </HStack>
                      </>
                    );
                  }}
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent>
                <VStack className="gap-2 pl-5 pt-2">
                  {data.biological.map((item, index) => (
                    <BiologicalItemComponent
                      key={item.id}
                      data={item}
                      onPress={() => {
                        setShowMedicalRecordDataActionModal(true);
                        setCurrentMedicalRecordData({
                          tag: "biological",
                          data: item,
                        });
                      }}
                    />
                  ))}
                </VStack>
              </AccordionContent>
            </AccordionItem>
          )}
          {data.clinical.length != 0 && (
            <AccordionItem
              value="clinical"
              className="border-b-[0.5px] border-primary-border/5"
            >
              <AccordionHeader>
                <AccordionTrigger>
                  {({ isExpanded }: { isExpanded: boolean }) => {
                    return (
                      <>
                        <HStack className="w-full items-center justify-between">
                          <HStack className="items-center gap-2">
                            <Center className="rounded-full bg-purple-500/20 p-1">
                              <Icon
                                as={Stethoscope}
                                className="h-4 w-4 text-purple-500"
                              />
                            </Center>
                            <Text className="font-h4 text-base font-medium text-typography-primary">
                              Signes Cliniques
                            </Text>
                          </HStack>

                          <HStack className="gap-2">
                            <Center className="rounded-full bg-purple-500/20 px-1">
                              <Text className="rounded-full font-body text-xs font-normal text-purple-500">
                                {data.clinical.length}
                              </Text>
                            </Center>

                            {isExpanded ? (
                              <AccordionIcon
                                as={ChevronUpIcon}
                                className="h-4 w-4"
                              />
                            ) : (
                              <AccordionIcon
                                as={ChevronDownIcon}
                                className="h-4 w-4"
                              />
                            )}
                          </HStack>
                        </HStack>
                      </>
                    );
                  }}
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent>
                <VStack className="gap-2 pl-5 pt-2">
                  {data.clinical.map((item, index) => (
                    <ClinicalItemComponent
                      key={item.id}
                      data={item}
                      onPress={() => {
                        setShowMedicalRecordDataActionModal(true);
                        setCurrentMedicalRecordData({
                          tag: "clinical",
                          data: item,
                        });
                      }}
                    />
                  ))}
                </VStack>
              </AccordionContent>
            </AccordionItem>
          )}
          {data.complication.length != 0 && (
            <AccordionItem
              value="complication"
              className="border-b-[0.5px] border-primary-border/5"
            >
              <AccordionHeader>
                <AccordionTrigger>
                  {({ isExpanded }: { isExpanded: boolean }) => {
                    return (
                      <>
                        <HStack className="w-full items-center justify-between">
                          <HStack className="items-center gap-2">
                            <Center className="rounded-full bg-orange-500/20 p-1">
                              <Icon
                                as={PillBottle}
                                className="h-4 w-4 text-orange-500"
                              />
                            </Center>
                            <Text className="font-h4 text-base font-medium text-typography-primary">
                              Complications
                            </Text>
                          </HStack>
                          <HStack className="gap-2">
                            <Center className="rounded-full bg-orange-500/20 px-1">
                              <Text className="rounded-full font-body text-xs font-normal text-orange-500">
                                {data.complication.length}
                              </Text>
                            </Center>

                            {isExpanded ? (
                              <AccordionIcon
                                as={ChevronUpIcon}
                                className="h-4 w-4"
                              />
                            ) : (
                              <AccordionIcon
                                as={ChevronDownIcon}
                                className="h-4 w-4"
                              />
                            )}
                          </HStack>
                        </HStack>
                      </>
                    );
                  }}
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent>
                <VStack className="gap-2 pl-5 pt-2">
                  {data.complication.map((item, index) => (
                    <ComplicationItemComponent
                      key={item.id}
                      data={item}
                      onPress={() => {
                        setShowMedicalRecordDataActionModal(true);
                        setCurrentMedicalRecordData({
                          tag: "complication",
                          data: item,
                        });
                      }}
                    />
                  ))}
                </VStack>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </VStack>
      {currentMedicalRecordData && (
        <DailyMedicalRecordDataActionModal
          data={currentMedicalRecordData}
          isVisible={showMedicalRecordDataActionModal}
          onClose={() => {
            setShowMedicalRecordDataActionModal(true);
            setCurrentMedicalRecordData(null);
<<<<<<< HEAD
=======
            onUpdate();
>>>>>>> main
          }}
        />
      )}
    </React.Fragment>
  );
};
export interface AnthropometricItemComponentProps {
<<<<<<< HEAD
  data: Omit<
    MedicalRecordDto["anthropometricData"][number],
    "id" | "recordedAt" | "context"
  >;
=======
  data: MedicalRecordDto["anthropometricData"][number];
>>>>>>> main
  onPress?: () => void;
}
export function AnthropometricItemComponent({
  data,
  onPress = () => void 0,
}: AnthropometricItemComponentProps) {
  const getAnthropometricMeasureDataReq =
    useMemo<GetAnthropometricMeasureRequest>(() => {
      return {
        code: data.code,
      };
    }, [data.code]);
  const {
    data: anthropMeasureData,
    error,
    onLoading,
  } = useAnthropometricMeasure(getAnthropometricMeasureDataReq);

  if (onLoading) return <Loading />;

  return (
    <Pressable onPress={onPress}>
      <HStack className="justify-between rounded-xl border-b-[0.5px] border-primary-border/5 bg-background-primary px-1 py-2">
        <Text className="font-body text-sm font-normal text-typography-primary_light">
          {anthropMeasureData[0]?.name ?? data.code}
        </Text>
        <HStack>
          <Text className="font-h4 text-sm font-medium text-typography-primary">
            {data.value} {data.unit}
          </Text>
        </HStack>
      </HStack>
    </Pressable>
  );
}

export interface BiologicalItemComponentProps {
<<<<<<< HEAD
  data: Omit<MedicalRecordDto["biologicalData"][number], "id" | "recordedAt">;
=======
  data: MedicalRecordDto["biologicalData"][number];
>>>>>>> main
  onPress?: () => void;
}
export function BiologicalItemComponent({
  data,
  onPress = () => void 0,
}: BiologicalItemComponentProps) {
  const getBiologicalRefReq = useMemo<GetBiochemicalReferenceRequest>(
    () => ({
      code: data.code,
    }),
    [data.code]
  );
  const {
    data: biologicalRefData,
    error,
    onLoading,
  } = useBiochemicalReference(getBiologicalRefReq);
  if (onLoading) return <Loading />;

  return (
    <Pressable onPress={onPress}>
      <HStack className="justify-between rounded-xl border-b-[0.5px] border-primary-border/5 bg-background-primary px-1 py-2">
        <Text className="font-body text-sm font-normal text-typography-primary_light">
          {biologicalRefData[0]?.name ?? data.code}
        </Text>
        <HStack>
          <Text className="font-h4 text-sm font-medium text-typography-primary">
            {data.value} {data.unit}
          </Text>
        </HStack>
      </HStack>
    </Pressable>
  );
}

export interface ClinicalItemComponentProps {
<<<<<<< HEAD
  data: Omit<
    MedicalRecordDto["clinicalData"][number],
    "id" | "recordedAt" | "isPresent"
  > & {
    isPresent: boolean | undefined;
  };
=======
  data: MedicalRecordDto["clinicalData"][number];
>>>>>>> main
  onPress?: () => void;
}

export function ClinicalItemComponent({
  data,
  onPress = () => void 0,
}: ClinicalItemComponentProps) {
  const {
    diagnosticServices: { clinicalNutritionalAnalysis },
  } = usePediatricApp();

  const getClinicalRefReq = useMemo<GetClinicalSignReferenceRequest>(
    () => ({
      code: data.code,
    }),
    [data.code]
  );
  const {
    data: clinicalRefData,
    error,
    onLoading,
  } = useClinicalReference(getClinicalRefReq);

  if (onLoading) return <Loading />;

  return (
    <Pressable onPress={onPress}>
      <HStack className="justify-between rounded-xl border-b-[0.5px] border-primary-border/5 bg-background-primary px-1 py-2">
        <Text className="font-body text-sm font-normal text-typography-primary_light">
          {clinicalRefData[0]?.name ?? data.code}
        </Text>
        <HStack>
<<<<<<< HEAD
          {data.isPresent == undefined ? (
            <Text className="font-h4 text-sm font-medium text-typography-primary">
              Non vérifié
            </Text>
          ) : (
            <Text
              className={`font-h4 text-sm font-medium ${data.isPresent ? "text-orange-700" : "text-green-700"}`}
            >
              {data.isPresent ? "Présent" : "Absent"}
            </Text>
          )}
=======
          <Text
            className={`font-h4 text-sm font-medium ${data.isPresent ? "text-orange-700" : "text-green-700"}`}
          >
            {data.isPresent ? "Présent" : "Absent"}
          </Text>
>>>>>>> main
        </HStack>
      </HStack>
    </Pressable>
  );
}

export interface ComplicationItemComponentProps {
  data: MedicalRecordDto["complicationData"][number];
  onPress?: () => void;
}

export const ComplicationItemComponent: React.FC<
  ComplicationItemComponentProps
> = ({ data, onPress = () => void 0 }) => {
  const { data: complicationRefs, error, onLoading } = useComplicationRefs();
  if (onLoading) return <Loading />;

  return (
    <Pressable onPress={onPress}>
      <HStack className="justify-between rounded-xl border-b-[0.5px] border-primary-border/5 bg-background-primary px-1 py-2">
        <Text className="font-body text-sm font-normal text-typography-primary_light">
          {complicationRefs.find(compl => data.code === compl.code)?.name ??
            data.code}
        </Text>
        <HStack>
          <Text
            className={`font-h4 text-sm font-medium ${data.isPresent ? "text-orange-700" : "text-green-700"}`}
          >
            {data.isPresent ? "Présente" : "Absente"}
          </Text>
        </HStack>
      </HStack>
    </Pressable>
  );
};
