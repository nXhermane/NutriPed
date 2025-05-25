import React from "react";
import { useColorScheme } from "@hooks";
import { ImageProps, Image } from "../ui/image";

export interface ModeImageProps extends Omit<ImageProps, "source"> {
  sourceDark: ImageProps["source"];
  sourceLight: ImageProps["source"];
}

export const ModeImage: React.FC<ModeImageProps> = ({
  sourceDark,
  sourceLight,
  ...props
}) => {
  const colorScheme = useColorScheme();
  return (
    <Image
      source={colorScheme == "dark" ? sourceDark : sourceLight}
      {...props}
    />
  );
};
