import { Text } from "@/components/ui/text";
import React, { useEffect } from "react";
import { Center } from "@/components/ui/center";
import { useRouter } from "expo-router";
import { useGoogleAuth } from "@/src/context";
import { Image } from "@/components/ui/image";
import { useColorScheme } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { AppConstants } from "@/src/constants";

export default function Index() {
  const router = useRouter();
  const { user } = useGoogleAuth();
  const colorScheme = useColorScheme();
  const logoSource =
    colorScheme == "dark"
      ? require("./../assets/images/nutriped.dark.png")
      : require("./../assets/images/nutriped.ligth.png");
  useEffect(() => {
    setTimeout(async () => {
      if (user) {
        router.replace("./home");
      } else {
        router.replace("./onboarding");
      }
    }, 2000);
  }, [user]);

  return (
    <Center className={"bg-white dark:bg-black"} style={{ flex: 1 }}>
      <Image
        source={logoSource}
        alt={AppConstants.app_name + " Logo"}
        className={"aspect-[320/320] h-60 w-auto"}
        resizeMode={"contain"}
      />
      <VStack className={"absolute bottom-16 items-center gap-4"}>
        <Heading size={"2xl"} className="font-heading">
          {AppConstants.app_name}
        </Heading>
        <Text size={"xs"} className={"font-light_italic"}>
          {AppConstants.app_version}
        </Text>
      </VStack>
    </Center>
  );
}
