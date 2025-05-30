import React from "react";
import { ImageProps, Image } from "../ui/image";
import { useUI } from "@/src/context";

export interface ModeImageProps extends Omit<ImageProps, "source"> {
  sourceDark: ImageProps["source"];
  sourceLight: ImageProps["source"];
}

export const ModeImage: React.FC<ModeImageProps> = ({
  sourceDark,
  sourceLight,
  ...props
}) => {
  const { colorMode } = useUI();
  return (
    <Image source={colorMode == "dark" ? sourceDark : sourceLight} {...props} />
  );
};
