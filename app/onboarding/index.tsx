
import { AppLogo } from "@/components/custom";
import { PublicRoute } from "@/components/pages/shared";
import { Box } from "@/components/ui/box";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { isMobile, rnS, rnVs } from "@/scaling";
import { AppConstants } from "@/src/constants";
import { useGoogleAuth, useToast } from "@/src/context";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Image as RNImage, useColorScheme } from "react-native";
import Swiper from "react-native-web-swiper";

export default function Layout() {
  const swiperRef = useRef<Swiper>(null);
  const [hideNextBtn, setHideNextBtn] = useState<boolean>(false);

  return (
    <PublicRoute>
      <Box className={"p-safe flex-1 justify-between bg-background-primary"}>
        <OnBoardingScreenHeader />

        <Center className="flex-1">
          <Box className={"w-full flex-1 pb-v-3 pt-v-10"}>
            <Swiper
              ref={swiperRef}
              containerStyle={{
                width: "100%",
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
              onIndexChanged={(index: number) => {
                if (index === 3) setHideNextBtn(true);
                else setHideNextBtn(false);
              }}
              controlsProps={{
                prevPos: false,
                nextPos: false,
                dotsPos: "bottom",
                dotsTouchable: true,
                dotProps: {
                  containerStyle: {},
                },
                DotComponent: ({ isActive, onPress }) => {
                  return (
                    <Pressable
                      onPress={onPress}
                      {...{
                        className: isActive
                          ? "h-2 w-2 rounded-full bg-primary-c_light "
                          : "h-2 w-2 rounded-full bg-primary-border/10",
                      }}
                    ></Pressable>
                  );
                },
                dotsWrapperStyle: {
                  width: isMobile ? rnS(75) : 75,
                  justifyContent: "space-between",
                },
              }}
            >
              {/** First OnBoarding */}
              <OnBoardingFirstScreen />
              {/** Second OnBoarding */}
              <OnBoardingSecondScreen />
              {/** OnBoarding 3 */}
              <OnBoardingThirdScreen />
              {/** OnBoarding 4 */}
              <OnBoardingLoginScreen />
            </Swiper>
          </Box>
        </Center>
        <OnBoardingScreenFooter
          onNextBtnPress={() => swiperRef.current?.goToNext()}
          onSkipBtnPress={() => swiperRef.current?.goTo(3)}
          hideNextBtn={hideNextBtn}
          hideSkipBtn={hideNextBtn}
        />
      </Box>
    </PublicRoute>
  );
}

const OnBoardingScreenHeader = () => {
  return (
    <Box className={`h-v-14 w-full`}>
      <HStack className={"flex-1 items-center justify-start gap-3 pl-4 pt-v-4"}>
        <AppLogo className={"h-v-8 w-4"} />
        <Heading className={"mr-3 text-2xl color-typography-primary"}>
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
    <Box className={"native:h-v-16 pb-safe bottom-0 w-full web:h-20"}>
      <HStack className={"justify-between px-6"}>
        {!hideSkipBtn && (
          <Button
            variant={"outline"}
            className={
              "rounded-xl border-[0.5px] border-primary-border/5 bg-primary-c_light/20"
            }
            onPress={onSkipBtnPress}
          >
            <ButtonText
              className={
                "border-typography-primary_light font-h4 text-base font-medium text-primary-c_light"
              }
            >
              Passer
            </ButtonText>
          </Button>
        )}
        {!hideNextBtn && (
          <Button
            className={"rounded-xl bg-primary-c_light"}
            // variant={"solid"}
            onPress={onNextBtnPress}
          >
            <ButtonText
              className={
                "font-h4 text-base font-medium text-white data-[active=true]:text-primary-c_light"
              }
            >
              Suivant
            </ButtonText>
          </Button>
        )}
      </HStack>
    </Box>
  );
};

const OnBoardingLoginScreen = () => {
  const { login } = useGoogleAuth();
  const [onLogin, setOnLogin] = useState<boolean>(false);
  const router = useRouter();
  const toast = useToast();

  const handleLogin = () => {
    setOnLogin(true);
    login()
      .then(success => {
        if (success) {
          toast.show(
            "Success",
            "Connexion réussie",
            "Vous êtes connecté avec succès."
          );
          router.replace("./../home");
        }
      })
      .catch((e: Error) => {
        toast.show(
          "Error",
          "Echec de connexion",
          "Echec de la connexion avec Google, veuillez verifier votre connexion internet et reessayer."
        );
      })
      .finally(() => {
        setOnLogin(false);
      });
  };
  return (
    <VStack className={"native:pt-v-12 items-center gap-v-3"}>
      <RNImage
        source={require("./../../assets/images/onboarding/secure_signin_illustration.png")}
        style={{
          width: isMobile ? rnS(300) : 500,
          height: isMobile ? rnVs(150) : 400,
        }}
        resizeMode={"contain"}
        alt={"secure_signin_illustration"}
      />
      <VStack className={"w-full items-center gap-v-4"}>
        <Heading
          className={"font-h3 text-2xl font-semibold text-typography-primary"}
        >
          Commencer
        </Heading>
        <Text
          className={
            "native:w-80 text-center font-light text-subtitle1 color-typography-primary_light web:w-11/12"
          }
        >
          Connectez-vous pour accéder aux outils de diagnostic et de prise en
          charge
        </Text>
        <Button
          // className={
          //   "mb-v-2 mt-v-5 h-v-10 gap-3 rounded-full bg-primary-c_light px-8 py-v-2 data-[disabled=true]:bg-primary-c_light/50"
          // }
          className={`mx-4 h-v-10 rounded-xl bg-primary-c_light`}
          onPress={() => handleLogin()}
          isDisabled={onLogin}
        >
          {onLogin ? (
            <ButtonSpinner
              size={"small"}
              className="data-[active=true]:text-primary-c_light"
              color={"#fff"}
            />
          ) : (
            <Image
              source={require("./../../assets/images/onboarding/icons8-google-24.png")}
              className={"w-5"}
              resizeMode={"contain"}
              alt={"Goolge Icon"}
            />
          )}
          <ButtonText
            className={"font-h4 text-subtitle2 font-medium text-white"}
          >
            Se Connecter avec Google
          </ButtonText>
        </Button>

        <VStack className={"w-full items-center gap-3"}>
          <Divider orientation={"horizontal"} className={"h-[1px] w-56"} />
          <Text className={"font-light text-xs text-typography-primary_light"}>
            Application Académique
          </Text>
        </VStack>
      </VStack>
    </VStack>
  );
};

const OnBoardingFirstScreen = () => {
  return (
    <VStack className={"native:pt-v-12 items-center gap-v-7"}>
      <RNImage
        source={require("./../../assets/images/onboarding/pediatric_diagnosis_illustration.png")}
        style={{
          width: isMobile ? rnS(300) : 500,
          height: isMobile ? rnVs(180) : 400,
        }}
        resizeMode={"contain"}
        alt={"pediatric_diagnosis_illustration"}
      />
      <VStack className={"w-full items-center gap-v-4"}>
        <Heading
          className={"font-h3 text-2xl font-semibold text-typography-primary"}
        >
          Diagnostic Précis
        </Heading>
        <Text
          className={
            "native:w-80 text-center font-light text-subtitle1 color-typography-primary_light web:w-11/12"
          }
        >
          Outil professionnel pour le diagnostic rapide et précis de tous les
          types de malnutrition infantile.
        </Text>
      </VStack>
    </VStack>
  );
};

const OnBoardingSecondScreen = () => {
  return (
    <VStack className={"native:pt-v-12 items-center gap-v-7"}>
      <RNImage
        source={require("./../../assets/images/onboarding/pediatric_nutrition_care_f75_illustration.png")}
        resizeMode={"contain"}
        style={{
          width: isMobile ? rnS(143) : 200,
          height: isMobile ? rnVs(180) : 400,
        }}
        alt={"pediatric_nutrition_care_f75_illustration"}
      />
      <VStack className={"w-full items-center gap-v-4"}>
        <Heading
          className={"font-h3 text-2xl font-semibold text-typography-primary"}
        >
          Prise en charge
        </Heading>
        <Text
          className={
            "native:w-80 text-center font-light text-subtitle1 color-typography-primary_light web:w-11/12"
          }
        >
          Protocoles standardisés et personnalisés pour une prise en charge
          optimale de vos patients
        </Text>
      </VStack>
    </VStack>
  );
};
const OnBoardingThirdScreen = () => {
  const imageSource =
    useColorScheme() === "dark"
      ? require("./../../assets/images/onboarding/child_growth_monitoring_illustration.dark.png")
      : require("./../../assets/images/onboarding/child_growth_monitoring_illustration.light.png");
  return (
    <VStack className={"native:pt-v-12 items-center gap-v-4"}>
      <RNImage
        source={imageSource}
        style={{
          width: isMobile ? rnS(300) : 500,
          height: isMobile ? rnVs(180) : 400,
        }}
        resizeMode={"contain"}
        alt={"child_growth_monitoring_illustration"}
      />
      <VStack className={"w-full items-center gap-v-4"}>
        <Heading
          className={"font-h3 text-2xl font-semibold text-typography-primary"}
        >
          Suivi Patient
        </Heading>
        <Text
          className={
            "native:w-80 text-center font-light text-subtitle1 color-typography-primary_light web:w-11/12"
          }
        >
          Interface intuitive pour le suivi personnalisé et l'évolution de
          chaque patient
        </Text>
      </VStack>
    </VStack>
  );
};
