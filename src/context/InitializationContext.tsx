import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  InitializationProgress,
  PediatricSoftwareDataManager,
  sleep,
  usePediatricApp,
} from "@/adapter";
import ZipProcessor from "@services/ZipProcessor/ZipProcessor";
import {
  IZipProcessorObserver,
  allowedExtensions,
} from "@services/ZipProcessor";
import { CORE_CONFIG } from "@config/core";
import { useGoogleAuth } from "./GoogleAuthContext";

const INIT_STATUS_KEY = "app_initialization_status";

export interface InitializationContextType {
  isInitialized: boolean;
  isLoading: boolean;
  phase: string | null;
  error: string | null;
  state: "in_process" | "completed" | "error";
  progress: number; // 0 à 100
  currentStage: string;
  statusMessage: string;
  initStages: string[];
  initializeApp: () => void;
  resetInitialization: () => void;
}

export const InitializationContext = createContext<InitializationContextType>(
  {} as InitializationContextType
);

export interface InitializationProviderProps {
  children: ReactNode;
}

export const InitializationProvider: React.FC<InitializationProviderProps> = ({
  children,
}) => {
  const { diagnosticServices, nutritionCareServices, unitService } =
    usePediatricApp();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [currentStage, setCurrentStage] = useState<string>("");
  const [initStages, setInitStages] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [state, setState] = useState<"in_process" | "completed" | "error">(
    "in_process"
  );
  const [currentPhase, setCurrentPhase] = useState<null | string>(null);
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await AsyncStorage.getItem(INIT_STATUS_KEY);
        console.log(status);
        setIsInitialized(status === "completed");
      } catch {
        setError("Erreur lors de la vérification du statut d'initialisation");
      } finally {
        setIsLoading(false);
      }
    };
    checkStatus();
  }, []);

  const initializeApp = async () => {
    setIsLoading(true);
    setError(null);
    setProgress(0);
    setCurrentStage("");
    setStatusMessage("");
    setInitStages([]);

    try {
      const observer: IZipProcessorObserver = {
        onProgress(event) {
          setState("in_process");
          setCurrentStage(event.type);
          setStatusMessage(event.message as string);
          sleep(100);
          console.log(`[Zip:${event.type}] ${event.message}`);
          if (event.progress !== undefined) {
            const zipProgress = Number((event.progress * 100).toFixed(0));
            console.log(`Progression ZIP: ${zipProgress}%`);
            setProgress(event.progress * 100);
            if (zipProgress === 100) {
              setState("completed");
            }
          }
        },
      };

      const processor = new ZipProcessor(allowedExtensions, observer);
      setCurrentPhase("Phase de téléchargement");
      const zipFileData = await processor.load(CORE_CONFIG.pediatricDataZipUrl);

      const pediatricDataManager = new PediatricSoftwareDataManager({
        anthropometricService: diagnosticServices.anthropometricMeasure,
        appetiteTestRefService: nutritionCareServices.appetiteTest,
        biochemicalRefService: diagnosticServices.biochemicalReference,
        clinicalRefService: diagnosticServices.clinicalSign,
        complicationService: nutritionCareServices.complication,
        diagnosticRuleService: diagnosticServices.diagnosticRule,
        growthChartService: diagnosticServices.growthChart,
        growthTableService: diagnosticServices.growthTable,
        indicatorService: diagnosticServices.indicator,
        medicineService: nutritionCareServices.medicine,
        milkService: nutritionCareServices.milk,
        nutritionalRiskService: diagnosticServices.nutritionalRisk,
        orientationService: nutritionCareServices.orientation,
        unitService: unitService,
      });

      pediatricDataManager.addObserver({
        onProgress: (p: InitializationProgress) => {
          const initProgress = Number(
            ((p.completed / p.total) * 100).toFixed(0)
          );
          setCurrentStage(p.stage);
          setStatusMessage(p.message);
          setProgress(initProgress);
          if (!initStages.includes(p.stage)) {
            setInitStages(prev => [...prev, p.stage]);
          }
          setState("in_process");
        },
        onError: e => {
          setError(`${e.stage}: ${e.error}`);
          setState("error");
          setStatusMessage("Une erreur est survenue pendant l’initialisation");
        },
        onComplete: async () => {
          await AsyncStorage.setItem(INIT_STATUS_KEY, "completed");
          setIsInitialized(true);
          setState("completed");
          setStatusMessage("Initialisation terminée avec succès !");
        },
      });
      const preparedData = pediatricDataManager.prepareData(zipFileData);
      setCurrentPhase("Phase de construction");
      await pediatricDataManager.initialize(preparedData);
    } catch (err: unknown) {
      setState("error");
      setError(`Erreur d'initialisation: ${(err as Error).message}`);
      setStatusMessage("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const resetInitialization = async () => {
    try {
      await AsyncStorage.removeItem(INIT_STATUS_KEY);
      setIsInitialized(false);
    } catch {
      setError("Erreur lors de la réinitialisation");
    }
  };

  return (
    <InitializationContext.Provider
      value={{
        isInitialized,
        isLoading,
        error,
        phase: currentPhase,
        state,
        progress,
        currentStage,
        statusMessage,
        initStages,
        initializeApp,
        resetInitialization,
      }}
    >
      {children}
    </InitializationContext.Provider>
  );
};

export function useInitialization() {
  return useContext(InitializationContext);
}
