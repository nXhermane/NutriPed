import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
} from "@/components/ui/actionsheet";
import { ButtonText, Button } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Box } from "@/components/ui/box";
import React, { useEffect, useState } from "react";
import { Text } from "@/components/ui/text";
import {
  Check,
  ChevronRight,
  icons,
  LucideLoader,
  X,
  Zap,
} from "lucide-react-native";
import { Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { motify } from "moti";
import { useInitialization } from "@/src/context";
import { Alert } from "@/components/ui/alert";

export interface InitAppBottomSheetProps {
  showInitializationSheet: boolean;
  onClose: () => void;
}
export const InitAppBottomSheet: React.FC<InitAppBottomSheetProps> = ({
  showInitializationSheet,
  onClose,
}) => {
  const [showActionsheet, setShowActionsheet] = React.useState(false);
  const handleClose = () => {
    setShowActionsheet(false);
    onClose && onClose();
  };
  const {
    error,
    initializeApp,
    isInitialized,
    progress,
    statusMessage,
    phase,
    state,
  } = useInitialization();
  useEffect(() => {
    if (isInitialized) {
      handleClose();
    } else {
      initializeApp();
    }
  }, [isInitialized]);
  useEffect(() => {
    setShowActionsheet(showInitializationSheet);
  }, [showInitializationSheet]);
  return (
    <Actionsheet isOpen={showActionsheet} useRNModal={true}>
      <ActionsheetBackdrop />
      <ActionsheetContent className={"w-full bg-background-secondary"}>
        {/* <ActionsheetDragIndicatorWrapper className="bg-red-500" > */}
        <ActionsheetDragIndicator className={"w-5"} />
        {/* </ActionsheetDragIndicatorWrapper> */}
        <VStack className={"w-full gap-v-5 py-v-9"}>
          <VStack className={"items-center gap-v-3"}>
            <Box className={`h-v-14 ${isInitialized ? "" : "animate-pulse"}`}>
              <Icon as={Zap} className={"h-14 w-14 text-yellow-500"} />
            </Box>
            <VStack className="items-center">
              <Heading
                className={
                  "text-center font-h3 text-xl font-semibold text-typography-primary"
                }
              >
                Initialisation en cours
              </Heading>
              <Text
                className={
                  "text-center font-light text-xs text-typography-primary_light"
                }
              >
                Configuration de votre environnement de travail
              </Text>
            </VStack>
            <InitPhaseWrapper
              currentStep={statusMessage}
              currentPhase={phase as string}
              progress={progress}
              error={error === null ? undefined : error}
              state={state}
              tryAgain={initializeApp}
            />
          </VStack>
        </VStack>
      </ActionsheetContent>
    </Actionsheet>
  );
};

export interface InitPhaseProps {
  title?: string;
  icon?: keyof typeof icons;
  progress?: number;
  currentStep?: string;
  error?: string;
  state?: "completed" | "error" | "in_process";
  tryAgain?: () => void;
}
const InitPhase: React.FC<InitPhaseProps> = ({
  title,
  icon = "Download",
  progress,
  currentStep,
  tryAgain = () => {},
  state = "completed",
  error,
}) => {
  const AnimatedBtn = motify(Button)();
  const LucideIcon = icons[icon];
  return (
    <Box
      className={"w-full gap-v-2 rounded-xl bg-background-primary px-3 py-v-2"}
    >
      <HStack className={"items-center gap-2"}>
        <Icon as={LucideIcon} className={"h-5 w-5 text-typography-primary"} />
        <VStack>
          <Text className={"font-h4 text-sm text-typography-primary"}>
            {title}
          </Text>
          <Text
            className={`font-h4 text-xs italic ${state === "error" ? "text-error-500" : state === "completed" ? "text-success-500" : "text-secondary-c"}`}
          >
            {progress} %
          </Text>
        </VStack>
      </HStack>
      <Center>
        <Progress
          orientation="horizontal"
          size={"sm"}
          value={progress ? progress : 0}
          className={"bg-background-secondary"}
        >
          <ProgressFilledTrack
            className={`${state === "error" ? "bg-error-500" : state === "completed" ? "bg-success-500" : "bg-secondary-c"}`}
          />
        </Progress>
      </Center>

      <HStack className={"w-full items-center gap-1"}>
        <Icon as={ChevronRight} className={"h-4 w-4 text-secondary-c"} />
        <Text
          className={
            "max-w-[80%] font-light text-xs text-typography-primary_light"
          }
        >
          {currentStep}
        </Text>
        {state === "error" ? (
          <Icon as={X} className={"h-4 w-4 text-error-500"} />
        ) : state === "completed" ? (
          <Icon as={Check} className={"h-4 w-4 text-success-500"} />
        ) : (
          <Box className="animate-spin">
            <Icon as={LucideLoader} className={"h-4 w-4 text-yellow-500"} />
          </Box>
        )}
      </HStack>
      {state === "error" && (
        <HStack
          className={
            "w-full items-center justify-center rounded-lg border-[0.5px] border-error-500 bg-background-secondary px-1 py-1"
          }
        >
          <Text className={"w-full font-light_italic text-xs text-error-500"}>
            {error}
          </Text>

          <AnimatedBtn
            from={{
              scale: 1,
              opacity: 0.5,
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              type: "spring",
              loop: true,
            }}
            className={
              "absolute h-v-5 rounded-lg bg-error-500/80 py-0 opacity-80"
            }
            onPress={tryAgain}
          >
            <ButtonText className={"text-xs text-typography-primary"}>
              Ressayer
            </ButtonText>
          </AnimatedBtn>
        </HStack>
      )}
    </Box>
  );
};

interface InitPhaseWrapperProps {
  currentPhase: string;
  progress: number;
  error?: string;
  currentStep: string;
  state: "completed" | "in_process" | "error";
  tryAgain?: () => void;
}

const InitPhaseWrapper: React.FC<InitPhaseWrapperProps> = ({
  currentPhase,
  currentStep,
  error,
  progress,
  state,
  tryAgain,
}) => {
  const phaseIconList: (keyof typeof icons)[] = ["Download", "CircleDotDashed"];
  const [currentIndex, setCurrentIndex] = useState<number>();
  const [phase, setPhase] = useState<
    {
      title: string;
      icon: keyof typeof icons;
    }[]
  >([]);

  useEffect(() => {
    setPhase(prev => {
      if (prev.findIndex(item => item.title === currentPhase) === -1) {
        setCurrentIndex(prev.length);
        return [
          ...prev,
          {
            title: currentPhase,
            icon: phaseIconList[prev.length],
          },
        ];
      }

      setCurrentIndex(prev.length - 1);
      return prev;
    });
  }, [currentPhase]);
  const handleReTry = () => {
    tryAgain && tryAgain();
  };
  useEffect(() => {
    if (error) {
      console.log(error, state);
    }
  }, [error]);

  return (
    <Box className="w-full gap-v-5">
      {phase.map((item, index) => (
        <InitPhase
          key={index}
          title={item.title}
          currentStep={index === currentIndex ? currentStep : "Phase Finished"}
          error={error}
          icon={item.icon}
          progress={index === currentIndex ? progress : 100}
          state={index === currentIndex ? state : "completed"}
          tryAgain={handleReTry}
        />
      ))}
    </Box>
  );
};
