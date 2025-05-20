import React, {
  createContext,
  ReactNode,
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

const INIT_STATUS_KEY = "app_initialization_status";

export interface InitializationContextType {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
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

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await AsyncStorage.getItem(INIT_STATUS_KEY);
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
          setCurrentStage(event.type);
          setStatusMessage(event.message as string);
          sleep(100);
          console.log(`[Zip:${event.type}] ${event.message}`);
          if (event.progress !== undefined) {
            console.log(
              `Progression ZIP: ${(event.progress * 100).toFixed(0)}%`
            );
            setProgress(event.progress * 100);
          }
        },
      };
      const processor = new ZipProcessor(allowedExtensions, observer);
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
          setCurrentStage(p.stage);
          setStatusMessage(p.message);
          setProgress((p.completed / p.total) * 100);
          if (!initStages.includes(p.stage)) {
            setInitStages((prev) => [...prev, p.stage]);
          }
        },
        onError: (e) => {
          setError(`${e.stage}: ${e.error}`);
          setStatusMessage("Une erreur est survenue pendant l’initialisation");
        },
        onComplete: async () => {
          await AsyncStorage.setItem(INIT_STATUS_KEY, "completed");
          setIsInitialized(true);
          setStatusMessage("Initialisation terminée avec succès !");
        },
      });
      await pediatricDataManager.initialize(
        pediatricDataManager.prepareData(zipFileData)
      );
    } catch (err: unknown) {
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
