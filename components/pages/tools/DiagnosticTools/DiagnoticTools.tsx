import { Text } from "@/components/ui/text";
import { NavigationIndependentTree } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  useDrawerStatus,
} from "@react-navigation/drawer";
import React from "react";
import { VStack } from "@/components/ui/vstack";
import { Pressable } from "@/components/ui/pressable";
import { Icon } from "@/components/ui/icon";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { HStack } from "@/components/ui/hstack";
import { Box } from "@/components/ui/box";
import { BlurView } from "expo-blur";
import { useUI } from "@/src/context";
import { AnthropometricCalculatorPanel } from "./AnthropometricCalculatorPanel";
import { AnthropometricCalculatorHistory } from "./AnthropometricCalculatorHistory";
const Drawer = createDrawerNavigator();
export const DiagnosticTools = ({}) => {
  return (
    <VStack className="flex-1">
      <NavigationIndependentTree>
        <Drawer.Navigator
          screenOptions={{
            headerShown: false,
            drawerStyle: {
              backgroundColor: "transparent",
            },
          }}
          drawerContent={props => <DiagnosticToolDrawerContent {...props} />}
        >
          <Drawer.Screen
            name="Calcul anthropométrique"
            component={AnthropometricCalculatorPanel}
          />
          <Drawer.Screen
            name="Évaluation clinique"
            component={AnthropometricCalculatorHistory} //() => <Text>Welcome to clinical evaluation screen</Text>
          />
          <Drawer.Screen
            name="Bilan biologique"
            component={() => (
              <Text>
                Welcome to biological and laboratory result interpretation
                screen
              </Text>
            )}
          />
          <Drawer.Screen
            name="Diagnostic global"
            component={() => <Text>Welcome to global diagnostic screen</Text>}
          />
        </Drawer.Navigator>
      </NavigationIndependentTree>
    </VStack>
  );
};

export interface DiagnosticToolDrawerContentProps
  extends DrawerContentComponentProps {}

export const DiagnosticToolDrawerContent: React.FC<
  DiagnosticToolDrawerContentProps
> = ({ navigation, state, descriptors, ...props }) => {
  const drawerStatus = useDrawerStatus();
  const { colorMode } = useUI();
  return (
    <VStack className="h-[100%] w-full">
      <Pressable
        className="absolute -right-4 top-[50%] z-0 h-v-10 -translate-y-8 items-center overflow-hidden rounded-r-xl bg-primary-c_light"
        onPress={() => navigation.toggleDrawer()}
      >
        <Box className="h-full w-full flex-row items-center">
          <Icon
            as={drawerStatus === "closed" ? ChevronRight : ChevronLeft}
            className="h-5 w-5 text-typography-primary"
          />
        </Box>
      </Pressable>

      <VStack className="absolute h-full w-full justify-center overflow-hidden rounded-r-2xl">
        <BlurView
          experimentalBlurMethod="dimezisBlurView"
          intensity={90}
          tint={colorMode}
          className="h-full items-center justify-center gap-3 px-4"
        >
          {state.routes.map((route, index) => {
            const { name, key } = route;
            const isFocused = state.index === index;
            const options = descriptors[key].options;
            const label = options.title ?? name;
            return (
              <DiagnosticDrawerItem
                key={key}
                label={label}
                isActive={isFocused}
                onPress={() => {
                  navigation.navigate(name);
                }}
              />
            );
          })}
        </BlurView>
      </VStack>
    </VStack>
  );
};

export interface DiagnosticDrawerItemProps {
  label: string;
  isActive: boolean;
  onPress?: () => void;
}

export const DiagnosticDrawerItem: React.FC<DiagnosticDrawerItemProps> = ({
  label,
  isActive,
  onPress = () => {},
}) => {
  return (
    <Pressable onPress={onPress}>
      <HStack
        className={`h-v-10 items-center justify-center rounded-xl border-[1px] px-4 ${isActive ? "border-primary-c_light/10 bg-primary-c_light/5" : "border-primary-border/5 bg-background-secondary"}`}
      >
        <Text
          className={`w-full text-left font-h4 text-sm font-medium ${isActive ? "text-primary-c_light" : "text-typography-primary_light"}`}
        >
          {label}
        </Text>
      </HStack>
    </Pressable>
  );
};
