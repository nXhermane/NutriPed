import { ImageProps,Image } from "@/components/ui/image";
import { AppConstants } from "@/src/constants";
import React from "react";
import { useColorScheme } from "react-native";



export interface AppLogoProps extends Omit<ImageProps,'source' | 'src' |'alt' | 'resizeMode'>  {

}
export const AppLogo : React.FC<AppLogoProps>= (props) => {
     const colorScheme = useColorScheme();
     const logoSource =
       colorScheme == "dark"
         ? require("./../../assets/images/nutriped.dark.png")
         : require("./../../assets/images/nutriped.ligth.png");
return (
  <Image
        source={logoSource}
        alt={AppConstants.app_name + " Logo"}
        resizeMode={"contain"}
        {...props}
      />
)
}