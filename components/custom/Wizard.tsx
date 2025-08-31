import React, {
  Children,
  createContext,
  isValidElement,
  PropsWithChildren,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
  useMemo,
  memo,
} from "react";
import { Progress, ProgressFilledTrack } from "../ui/progress";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
import { HStack } from "../ui/hstack";
import { View, Text as RNText, useColorScheme } from "react-native";
import { FadeInCardY } from "./motion";
import { Button, ButtonText } from "../ui/button";
import { Loading } from "./Loading";

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

// Optimisation 1: Memoize le reducer pour éviter les re-créations
const wizardReducer = (
  state: Record<number, WizardStepData<any>>,
  action: WizardStepAction
) => {
  const currentStep = state[action.stepNumber] || {
    stepNumber: action.stepNumber.toString(),
    onNext: undefined,
    onPrev: undefined,
    error: null,
    data: null,
  };

  switch (action.type) {
    case WIZARD_STEP_ACTION.CHANGE_DATA:
      // Optimisation 2: Éviter les mutations inutiles
      if (currentStep.data === action.data) return state;
      return {
        ...state,
        [action.stepNumber]: {
          ...currentStep,
          data: action.data,
        },
      };

    case WIZARD_STEP_ACTION.SET_ERROR:
      if (currentStep.error === action.error) return state;
      return {
        ...state,
        [action.stepNumber]: {
          ...currentStep,
          error: action.error,
        },
      };

    case WIZARD_STEP_ACTION.SET_ON_NEXT:
      return {
        ...state,
        [action.stepNumber]: {
          ...currentStep,
          onNext: action.onNext,
        },
      };

    case WIZARD_STEP_ACTION.SET_ON_PREV:
      return {
        ...state,
        [action.stepNumber]: {
          ...currentStep,
          onPrev: action.onPrev,
        },
      };

    default:
      return state;
  }
};

const WIZARD_STEP_NAME = "WizardStep";

interface WizardContextType {
  changeStepNumber: (stepNumber: number) => void;
  wizardStateDispatcher: React.Dispatch<WizardStepAction> | null;
  wizardStates: { [x: number]: WizardStepData<any> };
  currentStepNumber: number;
  currentStepIndex: number;
}

const WizardContext = createContext<WizardContextType>({
  changeStepNumber() {},
  wizardStateDispatcher: null,
  wizardStates: {},
  currentStepNumber: 0,
  currentStepIndex: 0,
});

export interface WizardProps {
  children: ReactElement<WizardStepProps>[];
  startStep?: number;
}

export function Wizard({ children, startStep = 0 }: WizardProps) {
  const [wizardStates, dispatch] = useReducer(wizardReducer, {});
  const [currentStepNumber, setCurrentStepNumber] = useState<number>(startStep);

  // Optimisation 3: Memoize le traitement des enfants
  const steps = useMemo(() => {
    const allChildren = Children.toArray(children);
    const validSteps = allChildren.filter(
      (child): child is ReactElement<WizardStepProps> =>
        isValidElement(child) &&
        (child.type as any).displayName === WIZARD_STEP_NAME
    );
    
    if (validSteps.length !== allChildren.length) {
      throw new Error("All <Wizard> children must be <Wizard.Step>");
    }
    
    return validSteps.sort((a, b) => a.props.stepNumber - b.props.stepNumber);
  }, [children]);

  // Optimisation 4: Memoize currentStepIndex
  const currentStepIndex = useMemo(() => {
    return steps.findIndex(step => step.props.stepNumber === currentStepNumber);
  }, [steps, currentStepNumber]);

  // Optimisation 5: Memoize changeStepNumber avec les bonnes dépendances
  const changeStepNumber = useCallback((stepNumber: number) => {
    const stepsNumbers = steps.map(step => step.props.stepNumber);
    if (stepsNumbers.includes(stepNumber)) {
      setCurrentStepNumber(stepNumber);
    }
  }, [steps]);

  // Optimisation 6: Memoize context value
  const contextValue = useMemo(() => ({
    changeStepNumber,
    wizardStateDispatcher: dispatch,
    wizardStates,
    currentStepNumber,
    currentStepIndex,
  }), [changeStepNumber, wizardStates, currentStepNumber, currentStepIndex]);

  return (
    <WizardContext.Provider value={contextValue}>
      <VStack className="flex-1">
        <Header
          currentTitle={
            currentStepIndex !== -1 ? steps[currentStepIndex].props.label : undefined
          }
          stepsLength={steps.length}
          currentStepIndex={currentStepIndex}
        />
        <Body component={currentStepIndex !== -1 ? steps[currentStepIndex] : undefined} />
        <Footer
          isStart={startStep === currentStepNumber}
          currentStepNumber={currentStepNumber}
          currentStepIndex={currentStepIndex}
          steps={steps}
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

// Optimisation 7: Memoize Header component
const Header = memo<WizardHeaderProps>(({
  currentTitle,
  currentStepIndex,
  stepsLength,
}) => {
  const [isTimeOut, setIsTimeOut] = useState<boolean>(false);

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setIsTimeOut(true);
    }, 1500);
    return () => clearTimeout(timeOutId);
  }, []);

  // Optimisation 8: Memoize progress value calculation
  const progressValue = useMemo(() => {
    return currentStepIndex !== -1 
      ? (currentStepIndex * 100) / Math.max(stepsLength - 1, 1)
      : 0;
  }, [currentStepIndex, stepsLength]);

  return (
    <VStack>
      <HStack className="h-v-8 w-full items-center justify-between bg-background-secondary px-2">
        <FadeInCardY trigger={currentStepIndex} delayNumber={0.4}>
          <Text className="font-body text-sm font-normal text-typography-primary">
            {currentTitle || (isTimeOut ? "Step not found" : "Loading...")}
          </Text>
        </FadeInCardY>

        <Text className="rounded-full bg-primary-border/5 p-1 px-2 font-light text-xs text-typography-primary_light">
          {`${currentStepIndex + 1}/${stepsLength}`}
        </Text>
      </HStack>
      <Progress
        className="absolute bottom-0 h-v-1 rounded-none bg-background-secondary"
        value={progressValue}
      >
        <ProgressFilledTrack className="rounded-full bg-primary-c_light" />
      </Progress>
    </VStack>
  );
});

Header.displayName = "WizardHeader";

export interface WizardBodyProps {
  component?: ReactElement<WizardStepProps>;
}

// Optimisation 9: Memoize Body component
const Body = memo<WizardBodyProps>(({ component }) => {
  const [isTimeOut, setIsTimeOut] = useState<boolean>(false);
  const colorScheme = useColorScheme();

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setIsTimeOut(true);
    }, 1500);
    return () => clearTimeout(timeOutId);
  }, []);

  // Optimisation 10: Memoize error view style
  const errorViewStyle = useMemo(() => ({
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  }), []);

  const errorTextStyle = useMemo(() => ({
    fontSize: 14,
    color: colorScheme === "light" ? "#000" : "#fff",
    fontStyle: "italic" as const,
    fontWeight: 500 as const,
  }), [colorScheme]);

  return (
    <View style={{ flex: 1 }}>
      {component ? (
        component
      ) : isTimeOut ? (
        <View style={errorViewStyle}>
          <RNText style={errorTextStyle}>
            Step not found
          </RNText>
        </View>
      ) : (
        <Loading />
      )}
    </View>
  );
});

Body.displayName = "WizardBody";

export interface WizardFooterProps {
  isStart?: boolean;
  currentStepNumber: number;
  currentStepIndex: number;
  steps: ReactElement<WizardStepProps>[];
}

// Optimisation 11: Memoize Footer component et utilise le context
const Footer = memo<WizardFooterProps>(({
  isStart = false,
  currentStepNumber,
  currentStepIndex,
  steps,
}) => {
  const { wizardStates } = useWizard();
  
  const currentStep = wizardStates[currentStepNumber];
  const stepProps = currentStepIndex !== -1 ? steps[currentStepIndex].props : null;
  
  const onNext = useCallback(() => {
    currentStep?.onNext?.();
  }, [currentStep]);

  const onPrev = useCallback(() => {
    currentStep?.onPrev?.();
  }, [currentStep]);

  const nextBtnLabel = stepProps?.nextBtnLabel || "Next";
  const prevBtnLabel = stepProps?.prevBtnLabel || "Previous";
  const hasError = typeof currentStep?.error === "string";

  return (
    <HStack className="justify-between gap-2 px-4 py-v-2">
      {!isStart && (
        <Button
          variant="outline"
          className="flex-grow rounded-xl border-[0.5px] border-primary-border/5 bg-primary-c_light/20"
          onPress={onPrev}
        >
          <ButtonText className="border-typography-primary_light font-h4 text-base font-medium text-primary-c_light">
            {prevBtnLabel}
          </ButtonText>
        </Button>
      )}
      <Button
        className={`flex-grow rounded-xl ${hasError ? "bg-red-500" : "bg-primary-c_light"}`}
        onPress={onNext}
      >
        <ButtonText className="font-h4 text-base font-medium text-white data-[active=true]:text-primary-c_light">
          {nextBtnLabel}
        </ButtonText>
      </Button>
    </HStack>
  );
});

Footer.displayName = "WizardFooter";

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
  onNext() {},
  onPrev() {},
  data: null,
  error: null,
  setData() {},
  setError() {},
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

  // Optimisation 12: Memoize callbacks with proper dependencies
  const onNext = useCallback(
    (callback: (event: WizardNavigationEvent) => void) => {
      if (!wizardStateDispatcher) return;
      
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
            const nextStep = nextStepNumber ?? stepNumber + 1;
            changeStepNumber(nextStep);
          }
        },
      });
    },
    [wizardStateDispatcher, stepNumber, nextStepNumber, changeStepNumber]
  );

  const onPrev = useCallback(
    (callback: (event: WizardNavigationEvent) => void) => {
      if (!wizardStateDispatcher) return;
      
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
            const prevStep = prevStepNumber ?? stepNumber - 1;
            changeStepNumber(prevStep);
          }
        },
      });
    },
    [wizardStateDispatcher, stepNumber, prevStepNumber, changeStepNumber]
  );

  const setData = useCallback(
    (data: any | null) => {
      if (!wizardStateDispatcher) return;
      wizardStateDispatcher({
        stepNumber,
        type: WIZARD_STEP_ACTION.CHANGE_DATA,
        data,
      });
    },
    [wizardStateDispatcher, stepNumber]
  );

  const setError = useCallback(
    (error: string | null) => {
      if (!wizardStateDispatcher) return;
      wizardStateDispatcher({
        stepNumber,
        type: WIZARD_STEP_ACTION.SET_ERROR,
        error,
      });
    },
    [wizardStateDispatcher, stepNumber]
  );

  // Optimisation 13: Memoize context value
  const stepContextValue = useMemo(() => ({
    data: wizardStates[stepNumber]?.data ?? null,
    error: wizardStates[stepNumber]?.error ?? null,
    setData,
    onNext,
    onPrev,
    setError,
  }), [wizardStates, stepNumber, setData, onNext, onPrev, setError]);

  return (
    <WizardStepContext.Provider value={stepContextValue}>
      {children}
    </WizardStepContext.Provider>
  );
};

Wizard.Step = Step;
Wizard.Step.displayName = WIZARD_STEP_NAME;

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error("useWizard must be used inside of WizardContextProvider");
  }
  return context;
}

// Optimisation 14: Hook optimisé pour récupérer toutes les données
export function useWizardData() {
  const { wizardStates } = useWizard();
  return useMemo(() => {
    return Object.fromEntries(
      Object.entries(wizardStates).map(([stepNumber, stepData]) => [
        parseInt(stepNumber),
        stepData.data,
      ])
    );
  }, [wizardStates]);
}

export function useWizardStep() {
  const context = useContext(WizardStepContext);
  if (!context) {
    throw new Error("useWizardStep must be used inside of Wizard.Step");
  }
  return context;
}