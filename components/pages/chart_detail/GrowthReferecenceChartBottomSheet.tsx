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
import React from "react";
import colors from "tailwindcss/colors";
import {
  GrowthReferenceChart,
  GrowthReferenceChartProps,
} from "./GrowthReferenceChart";
import { BlurView } from "expo-blur";
import { FakeBlur } from "@/components/custom";

export interface GrowthReferenceChartBottomSheetProps
  extends GrowthReferenceChartProps {}
export const GrowthReferenceChartBottomSheet: React.FC<GrowthReferenceChartBottomSheetProps> =
  React.memo(({ ...props }) => {
    const { colorMode } = useUI();

    return (
      <BottomSheet>
        <HStack className="absolute bottom-0">
          <FakeBlur
            // experimentalBlurMethod="dimezisBlurView"
            // intensity={50}
            // tint={colorMode}
            className="h-full w-full overflow-hidden rounded-t-2xl p-4"
          >
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
          </FakeBlur>
        </HStack>

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
              <GrowthReferenceChart {...props} />
            </BottomSheetScrollView>
          </BottomSheetContent>
        </BottomSheetPortal>
      </BottomSheet>
    );
  });
