import { usePediatricApp } from "@/adapter";
import { Loading } from "@/components/custom";
import { FadeInCardX } from "@/components/custom/motion";
import { Box } from "@/components/ui/box";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { ComplicationDto } from "@/core/nutrition_care";
import { useUI } from "@/src/context";
import { useComplicationRefs, useMedicalRecord } from "@/src/hooks";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Check } from "lucide-react-native";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { remapProps } from "react-native-css-interop";
import { SegmentedControl } from "segmented-control-rn";
import { DateManager } from "@/core/shared";
import {
  useAddDataToMedicalRecordModal,
  usePatientDetail,
} from "../../context";

const SegmentedControlRM = remapProps(SegmentedControl, {
  className: "style",
  activeClassName: "activeSegmentStyle",
});

export type ComplicationState = "present" | "none" | "absent";
type ComplicationChange = {
  code: string;
  previousState: ComplicationState;
  newState: ComplicationState;
  hasChanged: boolean;
};

export const AddComplicationToMedicalRecord: React.FC = () => {
  const { patient } = usePatientDetail();
  const { medicalRecordService } = usePediatricApp();
  const { close } = useAddDataToMedicalRecordModal();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { data, onLoading } = useComplicationRefs();
  const { data: medicalRecord } = useMedicalRecord();

  const stableData = useMemo(() => data, [data]);

  const [initialStates, setInitialStates] = useState<
    Map<string, ComplicationState>
  >(new Map());
  const [complicationChanges, setComplicationChanges] = useState<
    Map<string, ComplicationChange>
  >(new Map());
  const [changesCount, setChangesCount] = useState(0);

  useEffect(() => {
    if (medicalRecord && stableData) {
      const newStates = new Map<string, ComplicationState>();
      stableData.forEach(complication => {
        const existing = medicalRecord.complicationData?.find(
          c => c.code === complication.code
        );
        const state: ComplicationState = existing
          ? existing.isPresent
            ? "present"
            : "absent"
          : "none";
        newStates.set(complication.code, state);
      });

      const changed =
        JSON.stringify(Array.from(newStates.entries())) !==
        JSON.stringify(Array.from(initialStates.entries()));
      if (changed) setInitialStates(newStates);
    }
  }, [medicalRecord?.id, stableData]);

  useEffect(() => {
    setChangesCount(complicationChanges.size);
  }, [complicationChanges]);

  const getCurrentState = (code: string): ComplicationState => {
    return (
      complicationChanges.get(code)?.newState ||
      initialStates.get(code) ||
      "none"
    );
  };
  useEffect(() => {
    if (isSuccess) close();
  }, [isSuccess]);

  const handleStateChange = useCallback(
    (code: string, newState: ComplicationState) => {
      setComplicationChanges(prev => {
        const previousState = initialStates.get(code) || "none";
        const hasChanged = previousState !== newState;
        const updated = new Map(prev);

        if (hasChanged) {
          updated.set(code, {
            code,
            previousState,
            newState,
            hasChanged: true,
          });
        } else {
          updated.delete(code);
        }

        return updated;
      });
    },
    [initialStates]
  );

  const getChangesToSave = (): { code: string; isPresent: boolean }[] => {
    return Array.from(complicationChanges.values())
      .filter(c => c.hasChanged && c.newState !== "none")
      .map(c => ({ code: c.code, isPresent: c.newState === "present" }));
  };

  const handleSubmitForm = async () => {
    setIsSubmitting(true);
    setIsSuccess(false);
    setError(null);
    const changesToSave = getChangesToSave();
    const result = await medicalRecordService.addData({
      medicalRecordId: patient.id,
      data: {
        complicationData: changesToSave.map(value => ({
          ...value,
          recordedAt: DateManager.formatDate(new Date()),
        })),
      },
    });
    if ("data" in result) {
      setIsSuccess(true);
    } else {
      const _errorContext = JSON.parse(result.content);
      console.error(_errorContext);
      setError(_errorContext);
    }
    setIsSubmitting(false);
  };

  const hasChanges = changesCount > 0;

  if (onLoading) return <Loading />;

  return (
    <VStack className="flex-1 bg-background-primary">
      <BottomSheetScrollView showsVerticalScrollIndicator={false}>
        <VStack className="gap-2 px-4 pt-v-5">
          {stableData.map((item, index) => {
            const currentState = getCurrentState(item.code);
            const changed = complicationChanges.has(item.code);

            return (
              <FadeInCardX key={item.code} delayNumber={index + 1}>
                <ComplicationFormItem
                  data={item}
                  state={currentState}
                  hasChanged={changed}
                  onStateChange={newState =>
                    handleStateChange(item.code, newState)
                  }
                />
              </FadeInCardX>
            );
          })}
        </VStack>
      </BottomSheetScrollView>

      <HStack className="mb-4 w-full bg-background-primary px-8 py-4">
        <Button
          className={`h-v-10 w-full rounded-xl ${error ? "bg-red-500" : "bg-primary-c_light"} ${
            hasChanges ? "bg-primary-c_light" : "bg-gray-400"
          } `}
          onPress={handleSubmitForm}
          disabled={!hasChanges}
        >
          {isSubmitting && (
            <ButtonSpinner
              size={"small"}
              className="data-[active=true]:text-primary-c_light"
            />
          )}
          <ButtonText className="font-h4 font-medium text-white">
            Enregistrer {hasChanges ? `(${changesCount})` : ""}
          </ButtonText>
          {isSuccess && <ButtonIcon as={Check} className="text-white" />}
        </Button>
      </HStack>
    </VStack>
  );
};

export const ActiveSegment = ({ label }: { label: string }) => (
  <Text className="font-h4 text-sm font-medium text-white">{label}</Text>
);

export const InactiveSegment = ({ label }: { label: string }) => (
  <Text className="font-h4 text-sm font-medium text-typography-primary_light">
    {label}
  </Text>
);

const segments = [
  {
    active: <ActiveSegment label="Présente" />,
    inactive: <InactiveSegment label="Présente" />,
    value: "present",
  },
  {
    active: <ActiveSegment label="None" />,
    inactive: <InactiveSegment label="None" />,
    value: "none",
  },
  {
    active: <ActiveSegment label="Absente" />,
    inactive: <InactiveSegment label="Absente" />,
    value: "absent",
  },
];

export interface ComplicationFormItemProps {
  data: ComplicationDto;
  state: ComplicationState;
  hasChanged: boolean;
  onStateChange: (state: ComplicationState) => void;
}

export const ComplicationFormItem: React.FC<ComplicationFormItemProps> = ({
  state = "none",
  data,
  hasChanged,
  onStateChange,
}) => {
  const getIndexFromState = (state: ComplicationState): number =>
    state === "present" ? 0 : state === "none" ? 1 : 2;

  const getStateFromIndex = (index: number): ComplicationState =>
    index === 0 ? "present" : index === 1 ? "none" : "absent";

  const getSegmentColor = () => {
    if (!hasChanged) return "rgb(156, 163, 175)";
    return state === "present"
      ? "rgb(34, 197, 94)"
      : state === "absent"
        ? "rgb(239, 68, 68)"
        : "rgb(156, 163, 175)";
  };

  const onSegmentChange = useCallback(
    (index: number) => {
      const newState = getStateFromIndex(index);
      if (newState !== state) {
        onStateChange(newState);
      }
    },
    [state, onStateChange]
  );

  return (
    <VStack
      className={`gap-3 rounded-xl px-3 py-3 ${
        hasChanged
          ? "border-[0.5px] border-primary-c_light"
          : "bg-background-secondary"
      }`}
    >
      <HStack className="items-center justify-between">
        <Text className="flex-1">{data.name}</Text>
      </HStack>

      <Box className="w-fit rounded-xl bg-background-primary">
        <SegmentedControlRM
          onChange={onSegmentChange}
          segments={segments}
          selectedIndex={getIndexFromState(state)}
          style={{ backgroundColor: "inherit", borderRadius: 12 }}
          activeSegmentStyle={{
            backgroundColor: getSegmentColor(),
            borderRadius: 8,
          }}
        />
      </Box>
    </VStack>
  );
};
