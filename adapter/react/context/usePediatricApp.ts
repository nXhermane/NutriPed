import { useContext } from "react";
import { PediatricAppContext } from "./PediatricAppContext";

// Custom hook to use the app context
export const usePediatricApp = () => {
  const context = useContext(PediatricAppContext);
  if (context === undefined) {
    throw new Error('usePediatricApp must be used within an PediatricAppProvider');
  }
  return context;
};