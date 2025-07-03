import {
  BottomSheet,
  BottomSheetBackdrop,
  BottomSheetContent,
  BottomSheetDragIndicator,
  BottomSheetPortal,
  BottomSheetTrigger,
  BottomSheetScrollView,
} from "@/components/ui/bottomsheet";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useUI } from "@/src/context";
import { ChevronUp } from "lucide-react-native";
import React, { useState } from "react";
import colors from "tailwindcss/colors";
import { GrowthInteractiveChart } from "./GrowthChartInteractive";
import { ChartDataDto, GrowthRefChartAndTableCodes } from "@/core/diagnostics";
import {
  useGrowthChartDataGenerator,
  useSeriePlottingDataGenerator,
} from "@/src/hooks/pages/tool_detail";
import { ChartUiDataType, DisplayMode } from "@/src/constants/ui";
import { GrowthChartInteractiveOptions } from "./GrowthChartInteractiveOptions";

export interface GrowthReferenceChartProps {
  code: GrowthRefChartAndTableCodes;
  chartData: ChartDataDto[];
  chartName: string;
}
export const GrowthReferenceChart: React.FC<GrowthReferenceChartProps> =
  React.memo(({ chartData, code, chartName }) => {
    const { colorMode } = useUI();
    const [zoomActivate, setZoomActivate] = useState<boolean>(false);
    const {
      data,
      setDisplayedXAxisRange,
      setDisplayMode,
      chartUiData,
      displayMode,
      displayedXAxisRange,
    } = useGrowthChartDataGenerator(chartData, code);
    const { plottedSeriesData } = useSeriePlottingDataGenerator(code);

    return (
      <BottomSheet>
        <VStack className="bg-background-primary p-4">
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
          snapPoints={["75%", "90%"]}
          enableContentPanningGesture={false}
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
            <BottomSheetScrollView
              className={"h-[90vh]"}
              contentContainerClassName={""}
              showsVerticalScrollIndicator={false}
            >
              <GrowthInteractiveChart
                data={data}
                displayMode={displayMode as DisplayMode}
                chartUiData={chartUiData as ChartUiDataType}
                chartName={chartName}
                zoomActivate={zoomActivate}
                plottedSeriesData={plottedSeriesData}
              />
              <GrowthChartInteractiveOptions
                chartUiData={chartUiData as ChartUiDataType}
                displayRange={
                  displayedXAxisRange as
                    | ChartUiDataType["availableDisplayRange"][number]["range"]
                    | "all"
                }
                setDisplayRange={setDisplayedXAxisRange as any}
                displayMode={displayMode as DisplayMode}
                setDisplayMode={setDisplayMode}
                zoomActivate={zoomActivate}
                setZoomActivate={setZoomActivate}
              />
            </BottomSheetScrollView>
          </BottomSheetContent>
        </BottomSheetPortal>
      </BottomSheet>
    );
  });
