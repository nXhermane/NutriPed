import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Icon, CheckIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast as useGluestackToast,
} from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import React, { createContext, ReactNode, useContext } from "react";

export interface ToastContextType {
  show: () => void;
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
  const handleToast = () => {
    if (!toast.isActive(toastId)) {
      showNewToast();
    }
  };

  const showNewToast = () => {
    const newId = Math.random().toString();
    setToastId(newId);
    toast.show({
      id: newId,
      placement: "bottom",
      duration: 30000,
      containerStyle: {
        width: "100%",
        backgroundColor: 'yellow'
      },
      render: ({ id }) => <SuccessToast id={id} />,
    });
  };

  const show = () => {
    handleToast();
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

export interface SuccessToastProps {
  id: string;
}
export const SuccessToast: React.FC<SuccessToastProps> = ({ id }) => {
  const uniqueToastId = "toast-" + id;
  return (
    <Box nativeID={id} style={{
        borderRadius: 20,
        width: '100%',
        backgroundColor: 'red'
    }}className={"h-20 w-[375px] border rounded-3xl rounded-2xl bg-red-500 dark:bg-red-700"}>
      <HStack>
        <Icon as={CheckIcon} className={"text-success-400"} />
        <Text className={"text-red-700"}>Hello This my personal toast</Text>
      </HStack>
    </Box>
  );
};
