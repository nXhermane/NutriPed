import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import {
  ChartUiDataType,
  DisplayMode,
  DisplayModeUiLabel,
} from "@/src/constants/ui";
import React from "react";
import { FilterChips } from "../shared";
import { Switch } from "@/components/ui/switch";
import { HStack } from "@/components/ui/hstack";
import colors from "tailwindcss/colors";

export interface GrowthChartInteractiveOptionsProps {
  chartUiData: ChartUiDataType;
  displayRange:
    | ChartUiDataType["availableDisplayRange"][number]["range"]
    | "all";
  setDisplayRange: (
    range: ChartUiDataType["availableDisplayRange"][number]["range"] | "all"
  ) => void;
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;
  zoomActivate: boolean;
  setZoomActivate: (value: boolean) => void;
}
export const GrowthChartInteractiveOptions: React.FC<
  GrowthChartInteractiveOptionsProps
> = ({
  chartUiData,
  displayRange,
  setDisplayRange,
  displayMode,
  setDisplayMode,
  setZoomActivate,
  zoomActivate,
}) => {
  return (
    <VStack className="mt-4 gap-4 p-1">
      <VStack className="gap-3 rounded-xl bg-background-primary px-3 py-3">
        <Text className="font-h4 text-base font-medium text-typography-primary">
          Période à visualiser
        </Text>
        <ChartDisplayRange
          range={chartUiData?.availableDisplayRange || []}
          onChange={value => setDisplayRange(value)}
          value={displayRange}
        />
      </VStack>
      <VStack className="gap-3 rounded-xl bg-background-primary px-3 py-3">
        <Text className="font-h4 text-base font-medium text-typography-primary">
          Mode d'affichage
        </Text>
        <ChartDisplayMode
          availableDisplayMode={
            (chartUiData?.availableDisplayMode as any) || []
          }
          onChange={mode => setDisplayMode(mode)}
          displayMode={displayMode}
        />
      </VStack>
      <HStack className="gap-3 rounded-xl bg-background-primary px-3 py-3">
        <Text className="font-h4 text-base font-medium text-typography-primary">
          Activer le zoom
        </Text>
        <Switch
          size="md"
          trackColor={{ false: colors.neutral["400"], true: colors.green[600] }}
          thumbColor={colors.neutral[50]}
          value={zoomActivate}
          onToggle={() => setZoomActivate(!zoomActivate)}
        />
      </HStack>
    </VStack>
  );
};

interface ChartDisplayRangeProps {
  range: ChartUiDataType["availableDisplayRange"];
  onChange: (
    value: ChartUiDataType["availableDisplayRange"][number]["range"] | "all"
  ) => void;
  value: ChartUiDataType["availableDisplayRange"][number]["range"] | "all";
}

const ChartDisplayRange: React.FC<ChartDisplayRangeProps> = React.memo(
  ({ onChange, range, value }) => {
    return (
      <FilterChips<
        ChartUiDataType["availableDisplayRange"][number]["range"] | "all"
      >
        data={[
          { label: "Tous", value: "all" },
          ...range.map(r => ({ label: r.label, value: r.range })),
        ]}
        value={value}
        onChange={onChange}
      />
    );
  }
);

interface ChartDisplayModeProps {
  availableDisplayMode: DisplayMode[];
  displayMode: DisplayMode;
  onChange: (mode: DisplayMode) => void;
}
const ChartDisplayMode: React.FC<ChartDisplayModeProps> = ({
  availableDisplayMode,
  displayMode,
  onChange,
}) => {
  return (
    <FilterChips<DisplayMode>
      data={availableDisplayMode.map(mode => ({
        label: DisplayModeUiLabel[mode],
        value: mode,
      }))}
      value={displayMode}
      onChange={onChange}
    />
  );
};
