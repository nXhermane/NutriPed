import {
  LastPatientList,
  LastPatientScreenHeader,
  LastPatientSearchInput,
} from "@/components/pages/last_patient";
import { Box } from "@/components/ui/box";
import { Stack } from "expo-router";
import React from "react";
import { useState } from "react";

const LastPatientScreen = () => {
  const [searchText, setSearchText] = useState("");
  return (
    <React.Fragment>
      <Stack.Screen
        options={{
          headerShown: false,
          animation: "slide_from_right",
          animationDuration: 300,
          animationMatchesGesture: true,
        }}
      />
      <Box className={"flex-1 bg-background-primary"}>
        <LastPatientScreenHeader />
        <LastPatientSearchInput
          fieldProps={{
            value: searchText,
            onChangeText: setSearchText,
          }}
        />
        <LastPatientList searchText={searchText} />
      </Box>
    </React.Fragment>
  );
};

export default LastPatientScreen;
