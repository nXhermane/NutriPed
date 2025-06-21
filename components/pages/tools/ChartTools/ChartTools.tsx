import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useGrowthCharts } from "@/src/hooks";
import React, { ReactNode } from "react";
import { ScrollView } from "react-native";
import { ChartToolsTopSession } from "./ChartToolsTopSession";
import { BottomSheet, BottomSheetPortal } from "@/components/ui/bottomsheet";

export function ChartTools() {
  return (
    <React.Fragment>
      <ChartToolsTopSession onChange={(value) => console.log(value)}/>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 bg-background-primary">
        <VStack className="gap-v-4 pb-8">
          <ChartListSession />
        </VStack>
      </ScrollView>
    </React.Fragment>
  );
}

export interface ChartToolsSessionProps {
  children?: ReactNode;
  title?: string;
}

export const ChartToolsSession: React.FC<ChartToolsSessionProps> = ({
  children,
  title,
}) => {
  return (
    <VStack className={"gap-v-4"}>
      {title && (
        <Heading
          className={
            "text-center font-h2 text-lg font-semibold text-typography-primary"
          }
        >
          {title}
        </Heading>
      )}
      {children && <Box>{children}</Box>}
    </VStack>
  );
};

export const ChartListSession = () => {
  const growthChartList = useGrowthCharts();

  return (
  

     
<ChartToolsSession title="Courbes de Croissance de l'OMS">
      {growthChartList.map((item, index) => (
        <Text key={index}>{item.sex}</Text>
      ))}
    </ChartToolsSession>
  
    
  );
};
