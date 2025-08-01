import React, { ComponentProps, useMemo, useRef, useState } from "react";
import { AddDataToMedicalRecordChooseDataTypeScreen } from "./AddDataToMedicalRecordChooseDataTypeScreen";
import { useUI } from "@/src/context";
import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationOptions,
} from "@react-navigation/stack";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import colors from "tailwindcss/colors";
import { BottomSheetDragIndicator } from "@/components/ui/bottomsheet";
import { VStack } from "@/components/ui/vstack";
import { AddDataToMedicalRecordDataTypeForm } from "./AddDataToMedicalRecordDataTypeForm";
import { AddDataToMedicalRecordModalContext } from "../context";

const Stack = createStackNavigator();

export interface AddDataToMedicalRecordModalProps {
  isVisible?: boolean;
  onClose?: () => void;
}

export const AddDataToMedicalRecordModal: React.FC<
  AddDataToMedicalRecordModalProps
> = ({ isVisible = false, onClose = () => {} }) => {
  const { colorMode } = useUI();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  React.useEffect(() => {
    if (isVisible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.close();
    }
  }, [isVisible]);
  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        onDismiss={() => {
          onClose();
        }}
        snapPoints={["60%"]}
        ref={bottomSheetModalRef}
        handleIndicatorStyle={{
          backgroundColor:
            colorMode === "light" ? colors.gray["300"] : colors.gray["500"],
        }}
        handleComponent={props => <BottomSheetDragIndicator {...props} />}
        backdropComponent={props => (
          <BottomSheetBackdrop
            {...props}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        )}
        backgroundComponent={props => {
          return (
            <VStack {...props} className="rounded-2xl bg-background-primary" />
          );
        }}
        enablePanDownToClose={true}
      >
        <AddDataToMedicalRecordModalContext.Provider
          value={{
            close: onClose,
          }}
        >
          <Navigator />
        </AddDataToMedicalRecordModalContext.Provider>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export const Navigator = () => {
  const screenOptiosn = useMemo<StackNavigationOptions>(
    () => ({
      headerMode: "float",
      headerShown: false,
      safeAreaInsets: { top: 0 },
      headerShadowVisible: false,
      cardStyle: {
        backgroundColor: "white",
        overflow: "visible",
      },
    }),
    []
  );
  const otpions = useMemo<ComponentProps<typeof Stack.Screen>["options"]>(
    () => ({ headerBackTitle: "Back" }),
    []
  );
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Stack.Navigator screenOptions={screenOptiosn}>
          <Stack.Screen
            name="data_type_choosing"
            options={{}}
            component={AddDataToMedicalRecordChooseDataTypeScreen}
          />
          <Stack.Screen
            name="data_type_display"
            options={{}}
            component={AddDataToMedicalRecordDataTypeForm}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
};
