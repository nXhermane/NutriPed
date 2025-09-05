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
import { FakeBlur } from "@/components/custom";
import { Pressable } from "@/components/ui/pressable";
import {
  BottomSheetModal,
  BottomSheetScrollView as GorhomBottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { BackHandler } from "react-native";
import { router } from "expo-router";

export interface GrowthReferenceChartBottomSheetProps
  extends GrowthReferenceChartProps {}

const GrowthReferenceChartModal: React.FC<GrowthReferenceChartBottomSheetProps> =
  React.memo(({ ...props }) => {
    const { colorMode } = useUI();
    const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);
    const [modalIsVisible, setModalIsVisible] = React.useState<boolean>(false);
    const handlePress = React.useCallback(() => {
      bottomSheetModalRef.current?.present();
      setModalIsVisible(!modalIsVisible);
    }, [modalIsVisible]);
    React.useEffect(() => {
      const backAction = () => {
        if (modalIsVisible) {
          bottomSheetModalRef.current?.close();
        } else {
          if (router.canGoBack()) {
            router.back();
          }
        }
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }, [modalIsVisible]);

    return (
      <React.Fragment>
        <GrowthReferenceChartModalTrigger onPress={handlePress} />
        <BottomSheetModal
          onDismiss={() => {
            setModalIsVisible(false);
          }}
          snapPoints={["85%", "90%", "95%"]}
          ref={bottomSheetModalRef}
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
          enablePanDownToClose={true}
          enableDynamicSizing={false}
          enableContentPanningGesture={false}
        >
          <VStack className="flex-1 bg-background-primary">
            <GorhomBottomSheetScrollView showsVerticalScrollIndicator={false}>
              <GrowthReferenceChart {...props} />
            </GorhomBottomSheetScrollView>
          </VStack>
        </BottomSheetModal>
      </React.Fragment>
    );
  });
export interface GrowthReferenceChartModalTriggerProps {
  onPress: () => void;
}
export const GrowthReferenceChartModalTrigger: React.FC<GrowthReferenceChartModalTriggerProps> =
  React.memo(({ onPress }) => {
    return (
      <HStack className="absolute bottom-0">
        <FakeBlur className="h-full w-full overflow-hidden rounded-t-2xl p-4">
          <Pressable onPress={onPress}>
            <HStack className="h-v-10 items-center justify-center gap-4 rounded-xl border-[0.1px] border-primary-c_light">
              <VStack className="gap-0">
                <Icon as={ChevronUp} className="text-primary-c_light" />
                <Icon as={ChevronUp} className="text-primary-c_light/70" />
              </VStack>
              <Text className="font-h4 font-medium text-primary-c_light">
                Afficher la courbe
              </Text>
              <VStack className="gap-0">
                <Icon as={ChevronUp} className="text-primary-c_light" />
                <Icon as={ChevronUp} className="text-primary-c_light/70" />
              </VStack>
            </HStack>
          </Pressable>
        </FakeBlur>
      </HStack>
    );
  });
export const GrowthReferenceChartBottomSheet = GrowthReferenceChartModal;
