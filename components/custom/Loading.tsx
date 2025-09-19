import React, { ReactNode } from "react";
import { Center } from "../ui/center";
import { Spinner } from "../ui/spinner";
import { Text } from "../ui/text";
import colors from "tailwindcss/colors";
import { Button, ButtonIcon } from "../ui/button";
import { RefreshCw } from "lucide-react-native";
export interface LoadingProps {
  state?: 'loading' | 'error' | 'empty';
  children?: string | ReactNode;
  onReload?: () => void;
  reloadText?: string;
}

export const Loading: React.FC<LoadingProps> = ({ 
  state = 'loading', 
  children =  "Chargement...", 
  onReload, 
  reloadText = "Réessayer" 
}) => {
  return (
    <Center className="flex-1 bg-background-primary">
      {state === 'loading' && (
        <>
          <Spinner size="large" className="mt-8" color={colors.blue["600"]} />
          {children && (
            <Text className="mt-4 font-body text-sm font-normal text-typography-primary_light">
              {typeof children === "string" ? children : children}
            </Text>
          )}
        </>
      )}
      
      {state === 'error' && (
        <>
          <Text className="mb-4 text-center text-typography-error">
            {children || "Une erreur s'est produite"}
          </Text>
          {onReload && (
            <Button onPress={onReload} accessibilityLabel="Recharger le contenu">
              <ButtonIcon as={RefreshCw} />
              <Text>{reloadText}</Text>
            </Button>
          )}
        </>
      )}
    </Center>
  );
};