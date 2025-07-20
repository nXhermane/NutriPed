import React, {
  Children,
  createContext,
  isValidElement,
  PropsWithChildren,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { Progress, ProgressFilledTrack } from "../ui/progress";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
import { HStack } from "../ui/hstack";
import { View, Text as RNText, useColorScheme } from "react-native";
import { FadeInCardY } from "./motion";
import { Button, ButtonText } from "../ui/button";

interface WizardStepData<T extends {}> {
  stepNumber: string;
  onNext?: () => void;
  onPrev?: () => void;
  error: string | null;
  data: T | null;
}
enum WIZARD_STEP_ACTION {
  CHANGE_DATA = "CHANGE_DATA",
  SET_ERROR = "SET_ERROR",
  SET_ON_NEXT = "SET_ON_NEXT",
  SET_ON_PREV = "SET_ON_PREV",
}
type WizardStepAction = { stepNumber: number } & (
  | {
      type: WIZARD_STEP_ACTION.CHANGE_DATA;
      data: any | null;
    }
  | {
      type: WIZARD_STEP_ACTION.SET_ERROR;
      error: string | null;
    }
  | {
      type: WIZARD_STEP_ACTION.SET_ON_NEXT;
      onNext?: () => void;
    }
  | {
      type: WIZARD_STEP_ACTION.SET_ON_PREV;
      onPrev?: () => void;
    }
);

function wizardReducer(
  state: Record<number, WizardStepData<any>>,
  action: WizardStepAction
) {
  switch (action.type) {
    case WIZARD_STEP_ACTION.CHANGE_DATA: {
      return {
        ...state,
        [action.stepNumber]: {
          ...state[action.stepNumber],
          data: action.data,
        },
      };
    }
    case WIZARD_STEP_ACTION.SET_ERROR: {
      return {
        ...state,
        [action.stepNumber]: {
          ...state[action.stepNumber],
          error: action.error,
        },
      };
    }
    case WIZARD_STEP_ACTION.SET_ON_NEXT: {
      return {
        ...state,
        [action.stepNumber]: {
          ...state[action.stepNumber],
          onNext: action.onNext,
        },
      };
    }
    case WIZARD_STEP_ACTION.SET_ON_PREV: {
      return {
        ...state,
        [action.stepNumber]: {
          ...state[action.stepNumber],
          onPrev: action.onPrev,
        },
      };
    }
  }
}
const WIZARD_STEP_NAME = "WizardStep";

interface WizardContextType {
  changeStepNumber: (stepNumber: number) => void;
  wizardStateDispatcher: React.ActionDispatch<
    [action: WizardStepAction]
  > | null;
  wizardStates: { [x: number]: WizardStepData<any> };
}
const WizardContext = createContext<WizardContextType>({
  changeStepNumber(stepNumber) {},
  wizardStateDispatcher: null,
  wizardStates: {},
});
export interface WizardProps {
  children: ReactElement<WizardStepProps>[];
  startStep?: number;
}

export function Wizard({ children, startStep = 0 }: WizardProps) {
  const [wizardStates, dispatch] = useReducer(wizardReducer, {});
  const [currentStepNumber, setCurrentStepNumber] = useState<number>(0);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const allChildren = Children.toArray(children);
  const steps = allChildren.filter(
    (child): child is ReactElement<WizardStepProps> =>
      isValidElement(child) &&
      (child.type as any).displayName === WIZARD_STEP_NAME
  );
  if (steps.length != allChildren.length)
    throw new Error("All <Wizard> Childs must be an <Wizard.Step>");

  steps.sort((a, b) => a.props.stepNumber - b.props.stepNumber);
  useEffect(() => {
    setCurrentStepNumber(startStep);
  }, [startStep]);
  useEffect(() => {
    const findedIndex = steps.findIndex(
      step => step.props.stepNumber === currentStepNumber
    );
    setCurrentStepIndex(findedIndex);
  }, [currentStepNumber]);
  /** @function changeStepNumber - change step number : available for navigation */
  const changeStepNumber = useCallback(
    (stepNumber: number) => {
      const stepsNumbers = steps.map(step => step.props.stepNumber);
      if (stepsNumbers.includes(stepNumber)) setCurrentStepNumber(stepNumber);
    },
    [steps]
  );

  return (
    <WizardContext.Provider
      value={{
        changeStepNumber,
        wizardStateDispatcher: dispatch,
        wizardStates,
      }}
    >
      <VStack className="flex-1">
        <Header
          currentTitle={
            currentStepIndex != -1
              ? steps[currentStepIndex].props.label
              : "Not Found Step"
          }
          stepsLength={steps.length}
          currentStepIndex={currentStepIndex}
        />
        <Body step={steps[currentStepIndex]} />
        <Footer
          isStart={startStep === currentStepNumber}
          onNext={() => {
            wizardStates[currentStepNumber]?.onNext &&
              wizardStates[currentStepNumber].onNext();
          }}
          onError={typeof wizardStates[currentStepNumber]?.error === "string"}
          onPrev={() => {
            wizardStates[currentStepNumber]?.onPrev &&
              wizardStates[currentStepNumber].onPrev();
          }}
          nextBtnLabel={
            currentStepIndex != -1
              ? steps[currentStepIndex].props.nextBtnLabel
              : undefined
          }
          prevBtnLabel={
            currentStepIndex != -1
              ? steps[currentStepIndex].props.prevBtnLabel
              : undefined
          }
        />
      </VStack>
    </WizardContext.Provider>
  );
}

interface WizardHeaderProps {
  currentTitle?: string;
  stepsLength: number;
  currentStepIndex: number;
}
const Header: React.FC<WizardHeaderProps> = ({
  currentTitle,
  currentStepIndex,
  stepsLength,
}) => {
  return (
    <VStack>
      <HStack className="h-v-8 w-full items-center justify-between bg-background-secondary px-2">
        <FadeInCardY trigger={currentStepIndex} delayNumber={0.4}>
          <Text className="font-body text-sm font-normal text-typography-primary">
            {currentTitle}
          </Text>
        </FadeInCardY>

        <Text className="rounded-full bg-primary-border/5 p-1 px-2 font-light text-xs text-typography-primary_light">
          {(currentStepIndex + 1).toString() + "/" + stepsLength.toString()}
        </Text>
      </HStack>
      <Progress
        className="absolute bottom-0 h-v-1 rounded-none bg-background-secondary"
        value={
          currentStepIndex != -1
            ? (currentStepIndex * 100) / (stepsLength - 1)
            : 0 || 0
        }
      >
        <ProgressFilledTrack className="rounded-full bg-blue-600" />
      </Progress>
    </VStack>
  );
};
export interface WizardBodyProps {
  step?: ReactElement<WizardStepProps>;
}

const Body: React.FC<WizardBodyProps> = ({ step }) => {
  const colorScheme = useColorScheme();
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {step ?? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <RNText
            style={{
              fontSize: 14,
              color: colorScheme === "light" ? "#000" : "#fff",
              fontStyle: "italic",
              fontWeight: 500,
            }}
          >
            Step not found
          </RNText>
        </View>
      )}
    </View>
  );
};

export interface WizardFooterProps {
  isStart?: boolean;
  onNext?: () => void;
  onPrev?: () => void;
  nextBtnLabel?: string;
  prevBtnLabel?: string;
  onError?: boolean;
}

const Footer: React.FC<WizardFooterProps> = ({
  isStart = true,
  onNext = () => {},
  onPrev = () => {},
  nextBtnLabel = "Next",
  prevBtnLabel = "Prev",
  onError = false,
}) => {
  return (
    <HStack className="justify-between gap-2 px-4 py-v-2">
      {!isStart && (
        <Button
          variant="outline"
          className={`flex-1 rounded-xl border-[0.5px] border-primary-border/5 bg-background-primary`}
          onPress={onPrev}
        >
          <ButtonText className="border-typography-primary_light font-body text-subtitle2 color-typography-primary_light">
            {prevBtnLabel}
          </ButtonText>
        </Button>
      )}
      <Button
        className={`flex-1 rounded-xl bg-primary-c_light ${onError ? "bg-red-500" : "bg-primary-c_light"}`}
        onPress={onNext}
      >
        <ButtonText className="font-h4 font-medium text-typography-primary data-[active=true]:text-primary-c_light">
          {nextBtnLabel}
        </ButtonText>
      </Button>
    </HStack>
  );
};
interface WizardNavigationEvent {
  preventDefault: () => void;
}
export interface WizardStepContextType {
  onNext: (callback: (event: WizardNavigationEvent) => void) => void;
  onPrev: (callback: (event: WizardNavigationEvent) => void) => void;
  data: any | null;
  setData: (data: any | null) => void;
  error: string | null;
  setError: (error: string | null) => void;
}
const WizardStepContext = createContext<WizardStepContextType>({
  onNext(callback) {},
  onPrev(callback) {},
  data: null,
  error: null,
  setData(data) {},
  setError(error) {},
});

export interface WizardStepProps extends PropsWithChildren {
  label: string;
  stepNumber: number;
  nextStepNumber?: number;
  prevStepNumber?: number;
  nextBtnLabel?: string;
  prevBtnLabel?: string;
}
const Step: React.FC<WizardStepProps> = ({
  children,
  stepNumber,
  nextStepNumber,
  prevStepNumber,
}) => {
  const { changeStepNumber, wizardStateDispatcher, wizardStates } = useWizard();

  const onNext = useCallback(
    (callback: (event: WizardNavigationEvent) => void) => {
      wizardStateDispatcher &&
        wizardStateDispatcher({
          type: WIZARD_STEP_ACTION.SET_ON_NEXT,
          stepNumber,
          onNext: async () => {
            let executeDefault = true;
            await Promise.resolve(
              callback({
                preventDefault() {
                  executeDefault = false;
                },
              })
            );
            if (executeDefault) {
              changeStepNumber(stepNumber + 1);
            }
          },
        });
    },
    [wizardStateDispatcher]
  );
  const onPrev = useCallback(
    (callback: (event: WizardNavigationEvent) => void) => {
      wizardStateDispatcher &&
        wizardStateDispatcher({
          type: WIZARD_STEP_ACTION.SET_ON_PREV,
          stepNumber,
          onPrev: async () => {
            let executeDefault = true;
            await Promise.resolve(
              callback({
                preventDefault() {
                  executeDefault = false;
                },
              })
            );
            if (executeDefault) {
              changeStepNumber(stepNumber - 1);
            }
          },
        });
    },
    [wizardStateDispatcher]
  );
  const setData = useCallback(
    (data: any | null) => {
      wizardStateDispatcher &&
        wizardStateDispatcher({
          stepNumber,
          type: WIZARD_STEP_ACTION.CHANGE_DATA,
          data,
        });
    },
    [wizardStateDispatcher]
  );
  const setError = useCallback(
    (error: string | null) => {
      wizardStateDispatcher &&
        wizardStateDispatcher({
          stepNumber,
          type: WIZARD_STEP_ACTION.SET_ERROR,
          error,
        });
    },
    [wizardStateDispatcher]
  );

  return (
    <WizardStepContext.Provider
      value={{
        data: wizardStates[stepNumber]?.data,
        error: wizardStates[stepNumber]?.error,
        setData,
        onNext,
        onPrev,
        setError,
      }}
    >
      {children}
    </WizardStepContext.Provider>
  );
};
Wizard.Step = Step;
Wizard.Step.displayName = WIZARD_STEP_NAME;

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context)
    throw new Error("useWizard must be used inside of WizardContextProvider");

  return context;
}
// export function useWizardData() {
//   const context = useWizard();
//   return Object.fromEntries(
//     Object.values(context.wizardStates).map(value => [
//       value.stepNumber,
//       value.data,
//     ])
//   );
// }
export function useWizardStep() {
  const context = useContext(WizardStepContext);
  if (!context)
    throw new Error("useWizardStep must be used inside of Wizard.Step");
  return context;
}
