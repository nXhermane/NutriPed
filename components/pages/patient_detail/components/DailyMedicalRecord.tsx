import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { MedicalRecordDataOrdoredByDay } from "@/src/hooks/pages/patient_detail/useOrdoredMedicalRecordDataByDay";
import { useEffect, useMemo, useState } from "react";
import { convertBirthDateIntoAgeInMonth, HumanDateFormatter } from "@/utils";
import {
  AnthropometricDataDto,
  GetAnthropometricMeasureRequest,
  GetBiochemicalReferenceRequest,
  GetClinicalSignReferenceRequest,
} from "@/core/diagnostics";
import { MedicalRecordDto } from "@/core/medical_record";
import {
  useAnthropometricMeasure,
  useBiochemicalReference,
  useClinicalReference,
} from "@/src/hooks";
import { Loading } from "@/components/custom";
import { Icon } from "@/components/ui/icon";
import { FlaskConical, Ruler, Stethoscope, X } from "lucide-react-native";
import { Center } from "@/components/ui/center";
import { usePatientDetail } from "../context";
import { usePediatricApp } from "@/adapter";
import { Sex } from "@/core/shared";

interface DailyMedicalRecordDataProps {
  data: MedicalRecordDataOrdoredByDay[number];
}
export const DailyMedicalRecordDataComponent: React.FC<
  DailyMedicalRecordDataProps
> = ({ data }) => {
  const dateFormatOptions: Intl.DateTimeFormatOptions = useMemo(
    () => ({
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    []
  );
  return (
    <VStack className="mx-2 gap-3 rounded-2xl bg-background-secondary px-3 py-v-3">
      <HStack className="justify-between">
        <Text className="font-body text-sm font-normal text-typography-primary_light">
          {data.recordDate.toLocaleDateString("fr-FR", dateFormatOptions) ===
          new Date().toLocaleDateString("fr-FR", dateFormatOptions)
            ? "Aujourd'hui"
            : data.recordDate.toLocaleDateString("fr-FR", dateFormatOptions)}
        </Text>
      </HStack>
      {data.anthrop.length != 0 && (
        <VStack>
          <HStack className="gap-2">
            <Center className="">
              <Icon as={Ruler} className="h-4 w-4 text-typography-primary" />
            </Center>
            <Text className="font-h4 text-base font-medium text-typography-primary">
              Anthropométriques
            </Text>
          </HStack>
          <VStack className="gap-2 pl-5 pt-2">
            {data.anthrop.map((item, index) => (
              <AnthropometricItemComponent key={index} data={item} />
            ))}
          </VStack>
        </VStack>
      )}
      {data.biological.length != 0 && (
        <VStack>
          <HStack className="gap-2">
            <Center className="">
              <Icon
                as={FlaskConical}
                className="h-4 w-4 text-typography-primary"
              />
            </Center>
            <Text className="font-h4 text-base font-medium text-typography-primary">
              Biologiques
            </Text>
          </HStack>
          <VStack className="gap-2 pl-5 pt-2">
            {data.biological.map((item, index) => (
              <BiologicalItemComponent key={index} data={item} />
            ))}
          </VStack>
        </VStack>
      )}
      {data.clinical.length != 0 && (
        <VStack>
          <HStack className="gap-2">
            <Center className="">
              <Icon
                as={Stethoscope}
                className="h-4 w-4 text-typography-primary"
              />
            </Center>
            <Text className="font-h4 text-base font-medium text-typography-primary">
              Signes Cliniques
            </Text>
          </HStack>
          <VStack className="gap-2 pl-5 pt-2">
            {data.clinical.map((item, index) => (
              <ClinicalItemComponent key={index} data={item} />
            ))}
          </VStack>
        </VStack>
      )}
    </VStack>
  );
};
export interface AnthropometricItemComponentProps {
  data: MedicalRecordDto["anthropometricData"][number];
}
export function AnthropometricItemComponent({
  data,
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
    <HStack className="justify-between rounded-xl bg-background-primary px-3 py-3">
      <Text className="font-body text-sm font-normal text-typography-primary_light">
        {anthropMeasureData[0]?.name ?? data.code}
      </Text>
      <HStack>
        <Text className="font-h4 text-sm font-medium text-typography-primary">
          {data.value} {data.unit}
        </Text>
      </HStack>
    </HStack>
  );
}

export interface BiologicalItemComponentProps {
  data: MedicalRecordDto["biologicalData"][number];
}
export function BiologicalItemComponent({
  data,
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
    <HStack className="justify-between rounded-xl bg-background-primary px-3 py-3">
      <Text className="font-body text-sm font-normal text-typography-primary_light">
        {biologicalRefData[0]?.name ?? data.code}
      </Text>
      <HStack>
        <Text className="font-h4 text-sm font-medium text-typography-primary">
          {data.value} {data.unit}
        </Text>
      </HStack>
    </HStack>
  );
}

export interface ClinicalItemComponentProps {
  data: MedicalRecordDto["clinicalData"][number];
}

export function ClinicalItemComponent({ data }: ClinicalItemComponentProps) {
  const {
    diagnosticServices: { clinicalNutritionalAnalysis },
  } = usePediatricApp();
  const [onInterpretation, setOnInterpretation] = useState<boolean>(false);
  const [errorOnInterpretation, setErrorOnInterpretation] = useState<
    string | null
  >(null);
  const [interpretationResult, setInterpretationResult] = useState<
    "Présent" | "Absent" | null
  >(null);
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
  const { patient } = usePatientDetail();
  const interpretateClinicalSign = async () => {
    setErrorOnInterpretation(null);
    setOnInterpretation(true);
    setInterpretationResult(null);
    const result = await clinicalNutritionalAnalysis.makeClinicalAnalysis({
      clinicalSigns: [data],
      sex: patient.gender as Sex,
      ...convertBirthDateIntoAgeInMonth(new Date(patient.birthday)),
    });
    if ("data" in result) {
      const findedIndex = result.data.findIndex(
        clinicalDto => clinicalDto.clinicalSign === data.code
      );
      setInterpretationResult(findedIndex != -1 ? "Présent" : "Absent");
    } else {
      const _errorContent = JSON.parse(result.content);
      console.error(_errorContent);
      setOnInterpretation(_errorContent);
    }
    setOnInterpretation(false);
  };
  useEffect(() => {
    interpretateClinicalSign();
  }, [data]);
  if (onLoading) return <Loading />;

  return (
    <HStack className="justify-between rounded-xl bg-background-primary px-3 py-3">
      <Text className="font-body text-sm font-normal text-typography-primary_light">
        {clinicalRefData[0]?.name ?? data.code}
      </Text>
      <HStack>
        {onInterpretation ? (
          <Loading />
        ) : errorOnInterpretation ? (
          <Icon as={X} className="h-4 w-4 text-red-500" />
        ) : (
          <Text className="font-h4 text-sm font-medium text-typography-primary">
            {interpretationResult}
          </Text>
        )}
      </HStack>
    </HStack>
  );
}
