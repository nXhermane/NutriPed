import {
  BottomSheet,
  BottomSheetBackdrop,
  BottomSheetContent,
  BottomSheetDragIndicator,
  BottomSheetPortal,
  BottomSheetTrigger,
} from "@/components/ui/bottomsheet";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useUI } from "@/src/context";
import { ChevronUp } from "lucide-react-native";
import React from "react";
import colors from "tailwindcss/colors";
import { GrowthInteractiveChart } from "./GrowthChartInteractive";
import { ChartDataDto, GrowthRefChartAndTableCodes } from "@/core/diagnostics";
import { useGrowthChartDataGenerator } from "@/src/hooks/pages/tool_detail";
import { ChartUiDataType, DisplayMode } from "@/src/constants/ui";
import { GrowthChartInteractiveOptions } from "./GrowthChartInteractiveOptions";

export interface GrowthReferenceChartProps {
  code: GrowthRefChartAndTableCodes;
  chartData: ChartDataDto[];
}
export const GrowthReferenceChart: React.FC<GrowthReferenceChartProps> =
  React.memo(({ chartData, code }) => {
    const { colorMode } = useUI();
    const {
      data,
      setDisplayedXAxisRange,
      setLenHeiInterval,
      setDayInterval,
      setDisplayMode,
      chartUiData,
      displayMode,
      displayedXAxisRange,
    } = useGrowthChartDataGenerator(chartData, code);

    return (
      <BottomSheet>
        <VStack className="m-4">
          <BottomSheetTrigger>
            <HStack className="h-v-10 items-center justify-center gap-4 rounded-xl bg-blue-500">
              <VStack className="gap-0">
                <Icon as={ChevronUp} className="text-white" />
                <Icon as={ChevronUp} className="text-white/70" />
              </VStack>
              <Text className="font-h4 font-medium text-white">
                Afficher la courbe
              </Text>
              <VStack className="gap-0">
                <Icon as={ChevronUp} className="text-white" />
                <Icon as={ChevronUp} className="text-white/70" />
              </VStack>
            </HStack>
          </BottomSheetTrigger>
        </VStack>

        <BottomSheetPortal
          snapPoints={["25%", "50%", "75%", "90%", "100%"]}
          backdropComponent={BottomSheetBackdrop}
          handleIndicatorStyle={{
            backgroundColor:
              colorMode === "light" ? colors.gray["300"] : colors.gray["500"],
          }}
          handleComponent={props => <BottomSheetDragIndicator {...props} />}
          backgroundComponent={props => {
            return (
              <VStack
                {...props}
                className="rounded-2xl bg-background-secondary"
              />
            );
          }}
        >
          <BottomSheetContent className="bg-background-secondary">
            <GrowthInteractiveChart
              data={data}
              displayMode={displayMode as DisplayMode}
              chartUiData={chartUiData as ChartUiDataType}
            />
            <GrowthChartInteractiveOptions
              chartUiData={chartUiData as ChartUiDataType}
              displayRange={
                displayedXAxisRange as
                  | ChartUiDataType["availableDisplayRange"][number]["range"]
                  | "all"
              }
              setDisplayRange={setDisplayedXAxisRange as any}
            />
          </BottomSheetContent>
        </BottomSheetPortal>
      </BottomSheet>
    );
  });
