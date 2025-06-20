import React, { useEffect, useState } from "react";
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
  const [source, setSource] = useState<typeof sourceDark>(sourceDark);
  useEffect(() => {
    setSource(colorMode == "dark" ? sourceDark : sourceLight);
  }, [colorMode]);
  return <Image source={source} {...props} />;
};
