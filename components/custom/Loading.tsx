import React, { ReactNode } from "react";
import { Center } from "../ui/center";
import { Spinner } from "../ui/spinner";
import { Text } from "../ui/text";
import colors from "tailwindcss/colors";

export interface LoadingProps {
  children?: string | ReactNode;
}

export const Loading: React.FC<LoadingProps> = props => {
  return (
    <Center className="flex-1 bg-background-primary">
      <Spinner size={"large"} className="mt-8" color={colors.blue["600"]} />
      {props.children &&
        (typeof props.children === "string" ? (
          <Text className="mt-4 font-body text-sm font-normal text-typography-primary_light">
            {props.children ?? "Chargement..."}
          </Text>
        ) : (
          props.children
        ))}
    </Center>
  );
};
