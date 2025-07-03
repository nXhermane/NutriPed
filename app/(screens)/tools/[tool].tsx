import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Stack, useLocalSearchParams } from "expo-router";
import { TOOLS_DATA } from "@/src/constants/ui";
import { Center } from "@/components/ui/center";
import { SessionEmpty } from "@/components/pages/home/shared/SessionEmpty";
import React from "react";
import {
  AppetiteTestTool,
  ChartTools,
  TableTools,
  ToolDetailScreenHeader,
} from "@/components/pages/tools";

const Tool = () => {
  const { tool: toolCode } = useLocalSearchParams<{ tool: string }>();
  const tool = TOOLS_DATA.find(t => t.code === toolCode);

  const renderTool = (
    code: (typeof TOOLS_DATA)[number]["code"] | undefined
  ) => {
    switch (code) {
      case "appetite_test_tools":
        return <AppetiteTestTool />;
      case "chart_tools":
        return <ChartTools />;
      case "tables_tools":
        return <TableTools />;
      default:
        return (
          <Center className="flex-1">
            <SessionEmpty
              iconName={"AArrowDown"}
              message={"The tool you are looking for does not exist."}
            />
          </Center>
        );
    }
  };

  return (
    <Box className="flex-1 bg-background-secondary">
      <Stack.Screen
        options={{
          title: tool?.name || "Oops! Tool Not Found",
          headerShown: false,
          animation: "slide_from_left",
          animationDuration: 500,
          animationMatchesGesture: true,
        }}
      />
      <ToolDetailScreenHeader name={tool?.name || "Oops! Tool Not Found"} />

      {renderTool(tool?.code)}
    </Box>
  );
};
export default Tool;
