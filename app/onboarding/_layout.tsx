import { AppLogo } from "@/components/custom";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { AppConstants } from "@/src/constants";
import { useGoogleAuth } from "@/src/context";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { VStack } from "@/components/ui/vstack";
import Swiper from "react-native-web-swiper";
import { View } from "@/components/ui/view";


export default function Layout() {
  const { user } = useGoogleAuth();
  const router = useRouter();
  const swiperRef = useRef<Swiper>(null);
  const [hideNextBtn, setHideNextBtn] = useState<boolean>(false);

  useEffect(() => {
    if (user != null) router.replace("./../home");
  }, [user]);

  return (
    <Box className={"bg-background-primary flex-1 p-safe"}>
      <OnBoardingScreenHeader />

      <Center className="flex-1">
        <Swiper
          ref={swiperRef}
          containerStyle={{
            width: "100%",
            flex: 1,
            // height: "400"
          }}
          onIndexChanged={(index : number) => {
            if(index ===3) setHideNextBtn(true)
            else setHideNextBtn(false)
          }}
          
          controlsProps={{
          prevPos: false,
          nextPos: false,
          dotsTouchable: true ,
          dotProps: {
            badgeStyle: {
          
            },
            containerStyle: {
             
            }
          }
          
          }}
        >
          <VStack className={"items-center gap-10"}>
            <Image
              source={require("./../../assets/images/onboarding/pediatric_diagnosis_illustration.png")}
              size={"2xl"}
              className={"aspect-[320/250] h-80 w-80"}
              resizeMode={"contain"}
            />
            <Heading size={"4xl"} className={"color-typography-primary"}>
              Diagnostic Précis
            </Heading>
            <Text
              className={"color-typography-primary_light text-center"}
              size={"2xl"}
            >
              Outil professionnel pour le diagnostic rapide et précis de tous
              les types de malnutrition infantile.
            </Text>
          </VStack>
          {/** Second OnBoarding */}
          <VStack className={"items-center gap-10"}>
            <Image
              source={require("./../../assets/images/onboarding/pediatric_nutrition_care_f75_illustration.png")}
              size={"2xl"}
              className={"aspect-[320/250] h-80 w-80"}
              resizeMode={"contain"}
            />
            <Heading size={"4xl"} className={"color-typography-primary"}>
              Prise en charge
            </Heading>
            <Text
              className={"color-typography-primary_light text-center"}
              size={"2xl"}
            >
              Protocoles standardisés et personnalisés pour une prise en charge
              optimale de vos patients
            </Text>
          </VStack>
          {/** OnBoarding 3 */}
          <VStack className={"items-center gap-10"}>
            <Image
              source={require("./../../assets/images/onboarding/child_growth_monitoring_illustration.png")}
              size={"2xl"}
              className={"aspect-[320/250] h-80 w-80"}
              resizeMode={"contain"}
            />
            <Heading size={"4xl"} className={"color-typography-primary"}>
              Suivi Patient
            </Heading>
            <Text
              className={"color-typography-primary_light text-center"}
              size={"2xl"}
            >
              Interface intuitive pour le suivi personnalisé et l'évolution de
              chaque patient
            </Text>
          </VStack>
          {/** OnBoarding 4 */}
          <VStack className={"items-center gap-10"}>
            <Image
              source={require("./../../assets/images/onboarding/secure_signin_illustration.png")}
              size={"2xl"}
              className={"aspect-[320/250] h-80 w-80"}
              resizeMode={"contain"}
            />
            <Heading size={"4xl"} className={"color-typography-primary"}>
              Commencer
            </Heading>
            <Text
              className={"color-typography-primary_light text-center"}
              size={"2xl"}
            >
              Connectez-vous pour accéder aux outils de diagnostic et de prise
              en charge
            </Text>
            <Button className={"h-14 px-10 rounded-xl gap-6"}>
              <Image
                source={require("./../../assets/images/onboarding/google.png")}
                size={"2xs"}
                resizeMode={"contain"}
              />

              <ButtonText className={"font-body text-xl"}>
                Se Connecter avec Google
              </ButtonText>
            </Button>
          </VStack>
        </Swiper>
      </Center>
      <OnBoardingScreenFooter
        onNextBtnPress={swiperRef.current?.goToNext}
        onSkipBtnPress={() => swiperRef.current?.goTo(3)}
        hideNextBtn={hideNextBtn}
      />
    </Box>
  );
}

const OnBoardingScreenHeader = () => {
  return (
    <Box className={"w-full h-20"}>
      <HStack className={"flex-1 justify-start items-center pt-4"}>
        <AppLogo />
        <Heading className={"color-typography-primary text-4xl mr-3"}>
          {AppConstants.app_name}
        </Heading>
      </HStack>
    </Box>
  );
};

interface OnBoardingScreenFooterProps {
  hideNextBtn?: boolean;
  hideSkipBtn?: boolean;
  onNextBtnPress?: () => void;
  onSkipBtnPress?: () => void;
}
const OnBoardingScreenFooter: React.FC<OnBoardingScreenFooterProps> = props => {
  const {
    onSkipBtnPress = () => {},
    onNextBtnPress = () => {},
    hideNextBtn = false,
    hideSkipBtn = false,
  } = props;
  return (
    <Box className={"w-full h-32 pb-safe"}>
      <HStack className={"justify-between px-6"}>
        {!hideSkipBtn && (
          <Button
            size={"xl"}
            variant={"outline"}
            className={"rounded-3xl px-9 w-40 bg-background-secondary"}
            onPress={onSkipBtnPress}
          >
            <ButtonText
              className={
                "font-body color-typography-primary_light border-typography-primary_light"
              }
            >
              Passer
            </ButtonText>
          </Button>
        )}
        {!hideNextBtn && (
          <Button
            className={"rounded-3xl px-9  elevation-md w-40"}
            size={"xl"}
            variant={"solid"}
            onPress={onNextBtnPress}
          >
            <ButtonText className={"font-body "}>Suivant</ButtonText>
          </Button>
        )}
      </HStack>
    </Box>
  );
};
