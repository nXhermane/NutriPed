import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";

const APP_STATE_KEY = "app_state";

// Définition des types d'actions
const ACTION_TYPES = {
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
  SET_LOADING: "SET_LOADING",
  SET_USER: "SET_USER",
  RESET_STATE: "RESET_STATE",
  HYDRATE_STATE: "HYDRATE_STATE",
};

const initialState = {
  error: null,
  isLoading: false,
};

// Réducteur
const appReducer = (state: any, action: { type: any; payload: any }) => {
  switch (action.type) {
    case ACTION_TYPES.SET_ERROR:
      return { ...state, error: action.payload };
    case ACTION_TYPES.CLEAR_ERROR:
      return { ...state, error: null };
    case ACTION_TYPES.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case ACTION_TYPES.SET_USER:
      return { ...state, user: action.payload };
    case ACTION_TYPES.RESET_STATE:
      return initialState;
    case ACTION_TYPES.HYDRATE_STATE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

// Context Type
export interface AppStateContextType extends Record<string, any> {
  setError: (error: string) => void;
  clearError: () => void;
  setLoading: (isLoading: boolean) => void;
  resetState: () => void;
}
// Context

export const AppStateContext = createContext<AppStateContextType>(
  {} as AppStateContextType
);

// Context Provider
export interface AppStateProviderProps {
  children: ReactNode;
}
export const AppStateProvider: React.FC<AppStateProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Hydrate state from AsyncStorage on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        const storedState = await AsyncStorage.getItem(APP_STATE_KEY);
        if (storedState) {
          dispatch({
            type: ACTION_TYPES.HYDRATE_STATE,
            payload: JSON.parse(storedState),
          });
        }
      } catch (error) {
        console.error("Failed to load state:", error);
      }
    };

    loadState();
  }, []);

  // Persist state to AsyncStorage when it changes
  useEffect(() => {
    const saveState = async () => {
      try {
        await AsyncStorage.setItem(APP_STATE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error("Failed to save state:", error);
      }
    };

    saveState();
  }, [state]);

  // Actions
  const setError = (error: any) => {
    dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error });
  };

  const clearError = () => {
    dispatch({ type: ACTION_TYPES.CLEAR_ERROR, payload: "" });
  };

  const setLoading = (isLoading: boolean) => {
    dispatch({ type: ACTION_TYPES.SET_LOADING, payload: isLoading });
  };

  const resetState = () => {
    dispatch({ type: ACTION_TYPES.RESET_STATE, payload: {} });
  };

  return (
    <AppStateContext.Provider
      value={{
        ...state,
        setError,
        clearError,
        setLoading,
        resetState,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => useContext(AppStateContext);
