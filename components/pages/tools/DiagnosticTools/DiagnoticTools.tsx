import { Text } from "@/components/ui/text";
import {
  NavigationIndependentTree,
  useNavigation,
} from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerHeaderProps,
  useDrawerStatus,
} from "@react-navigation/drawer";
import React from "react";
import { VStack } from "@/components/ui/vstack";
import { Pressable } from "@/components/ui/pressable";
import { Icon } from "@/components/ui/icon";
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react-native";
import { HStack } from "@/components/ui/hstack";
import { Box } from "@/components/ui/box";
import { useUI } from "@/src/context";
import { AnthropometricCalculatorScreen } from "./AnthropometricCalculatorScreen";
import { ClinicalEvaluationScreen } from "./ClinicalEvaluationScreen";
import { BiologicalInterpretationScreen } from "./BiologicalInterpretationScreen";
import { GlobalDiagnosticScreen } from "./GlobalDiagnosticScreen";
import { FakeBlur } from "@/components/custom";
import { StackScreenHeader } from "../../shared";

const Drawer = createDrawerNavigator();

export const DiagnosticTools = ({}) => {
  const navigation = useNavigation();
  return (
    <VStack className="flex-1">
      <NavigationIndependentTree>
        <Drawer.Navigator
          screenOptions={{
            headerShown: true,
            header: props => <DiagnosticToolHeader {...props} />,
            drawerStyle: {
              backgroundColor: "transparent",
              width: "100%",
            },
            drawerStatusBarAnimation: "none",
            drawerPosition: "right",
          }}
          drawerContent={props => <DiagnosticToolDrawerContent {...props} />}
        >
          <Drawer.Screen
            name="Calcul anthropométrique"
            component={AnthropometricCalculatorScreen}
          />
          <Drawer.Screen
            name="Évaluation clinique"
            component={ClinicalEvaluationScreen}
          />
          <Drawer.Screen
            name="Bilan biologique"
            component={BiologicalInterpretationScreen}
          />
          <Drawer.Screen
            name="Diagnostic Nutritionnel"
            component={GlobalDiagnosticScreen}
          />
        </Drawer.Navigator>
      </NavigationIndependentTree>
    </VStack>
  );
};

export interface DiagnosticToolDrawerHeaderProps extends DrawerHeaderProps {}

export const DiagnosticToolHeader: React.FC<
  DiagnosticToolDrawerHeaderProps
> = ({ route, navigation }) => {
  const drawerStatus = useDrawerStatus();
  return (
    <StackScreenHeader
      name={route?.name}
      right={
        <VStack className="h-full items-center justify-center">
          <Pressable className="" onPress={() => navigation.toggleDrawer()}>
            <Icon as={Menu} className="h-5 w-5 text-typography-primary" />
          </Pressable>
        </VStack>
      }
    />
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
    <VStack className="h-[70%] w-full">
      {/* <Pressable
        className="absolute -right-4 top-[50%] z-0 h-v-10 -translate-y-8 items-center overflow-hidden rounded-r-xl bg-primary-c_light"
        onPress={() => navigation.toggleDrawer()}
      >
        <Box className="h-full w-full flex-row items-center">
          <Icon
            as={drawerStatus === "closed" ? ChevronRight : ChevronLeft}
            className="h-5 w-5 text-typography-primary"
          />
        </Box>
      </Pressable> */}

      <VStack className="absolute right-0 h-full w-[80%] justify-center overflow-hidden rounded-r-2xl rounded-bl-full rounded-tl-2xl">
        <FakeBlur
          // experimentalBlurMethod="dimezisBlurView"
          // intensity={90}
          // tint={colorMode}
          className="h-full items-center gap-3 px-4 pt-[35%]"
        >
          <Pressable
            className="rounded-full bg-primary-c_light p-1"
            onPress={() => navigation.closeDrawer()}
          >
            <Icon as={X} className="h-5 w-5 text-white" />
          </Pressable>
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
        </FakeBlur>
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
        className={`h-v-10 items-center justify-center rounded-xl border-[1px] px-4 ${isActive ? "border-primary-c_light/10 bg-primary-c_light dark:bg-primary-c_light/5" : "border-primary-border/5 bg-background-secondary"}`}
      >
        <Text
          className={`w-full text-left font-h4 text-sm font-medium ${isActive ? "text-white dark:text-primary-c_light" : "text-typography-primary_light"}`}
        >
          {label}
        </Text>
      </HStack>
    </Pressable>
  );
};
