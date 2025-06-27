import { SuccessToast } from "@/components/custom/SuccessToast";
import { ErrorToast } from "@/components/custom/ErrorToast";
import { useToast as useGluestackToast } from "@/components/ui/toast";
import React, { createContext, ReactNode, useContext } from "react";
import { Dimensions } from "react-native";
import { InfoToast } from "@/components/custom";

type ToastType = "Success" | "Error" | "Info";
export interface ToastContextType {
  show: (type: ToastType, title?: string, desc?: string) => void;
}
export const ToastContext = createContext<ToastContextType>(
  {} as ToastContextType
);

export interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const toast = useGluestackToast();
  const [toastId, setToastId] = React.useState("0");

  const show = (type: ToastType, title?: string, desc?: string) => {
    const newId = Math.random().toString();
    setToastId(newId);
    if (!toast.isActive(toastId))
      toast.show({
        id: newId,
        placement: "bottom",
        duration: 5000,
        containerStyle: {
          width: Dimensions.get("screen").width,
        },
        render: ({ id }) => {
          switch (type) {
            case "Success":
              return <SuccessToast id={id} title={title} desc={desc} />;
            case "Error":
              return <ErrorToast id={id} title={title} desc={desc} />;
            case "Info":
              return <InfoToast id={id} title={title} desc={desc} />;
            default: {
              console.warn("This toast type is not supported.");
              return <></>;
            }
          }
        },
      });
  };

  return (
    <ToastContext.Provider value={{ show }}>{children}</ToastContext.Provider>
  );
};

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
