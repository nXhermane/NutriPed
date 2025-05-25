import { ImageProps } from "@/components/ui/image";
import { AppConstants } from "@/src/constants";
import React from "react";
import { ModeImage } from "./ModeImage";
export interface AppLogoProps
  extends Omit<ImageProps, "source" | "src" | "alt" | "resizeMode"> {}
export const AppLogo: React.FC<AppLogoProps> = props => {
  return (
    <ModeImage
      sourceDark={require("./../../assets/images/nutriped.dark.png")}
      sourceLight={require("./../../assets/images/nutriped.ligth.png")}
      alt={AppConstants.app_name + " Logo"}
      resizeMode={"contain"}
      {...props}
    />
  );
};
