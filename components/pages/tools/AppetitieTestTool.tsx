import { Box } from "@/components/ui/box";
import { Grid, GridItem } from "@/components/ui/grid";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { IPressableProps, Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { APPETITE_TEST_PRODUCT_TYPE } from "@/core/constants";
import React, { ReactNode } from "react";
import { ScrollView } from "react-native";

export interface AppetiteTestToolProps {}

export const AppetiteTestTool: React.FC<AppetiteTestToolProps> = () => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
      <VStack className="gap-4 px-4">
        <AppetiteTestToolHeader />
        <AppetiteTestProductTypeSession
          value={APPETITE_TEST_PRODUCT_TYPE.IN_POT}
          onChange={(type: APPETITE_TEST_PRODUCT_TYPE) => {}}
        />
      </VStack>
    </ScrollView>
  );
};

const AppetiteTestToolHeader = () => {
  return (
    <HStack className="justify-center px-4 py-2">
      <Text className={"font-light text-sm text-typography-primary_light"}>
        Évaluation de la prise alimentaire
      </Text>
    </HStack>
  );
};
interface AppetiteTestSessionProps {
  title?: string;
  children?: ReactNode;
}
const AppetiteTestSession: React.FC<AppetiteTestSessionProps> = ({
  children,
  title,
}) => {
  return (
    <VStack
      className={"h-fit w-[100%] rounded-2xl bg-background-secondary px-4 py-3"}
    >
      <HStack>{title && <Heading>{title}</Heading>}</HStack>
      <Box className="w-[100%]">{children}</Box>
    </VStack>
  );
};

interface AppetiteTestProductTypeProps {
  onChange: (productType: APPETITE_TEST_PRODUCT_TYPE) => void;
  value: APPETITE_TEST_PRODUCT_TYPE;
}
const AppetiteTestProductTypeSession: React.FC<
  AppetiteTestProductTypeProps
> = ({}) => {
  return (
    <AppetiteTestSession title="Type de produit ">
      <Grid
        _extra={{
          className: "grid-cols-8",
        }}
        className="gap-4 py-2"
      >
        <GridItem _extra={{ className: "col-span-4" }}>
          <AppetiteTestProductTypeCard selected={false} icon="🍯" title="Pot" />
        </GridItem>

        <GridItem _extra={{ className: "col-span-4" }}>
          {/* <AppetiteTestProductTypeCard
            selected={true}
            icon="📦"
            title="Sachet"
          /> */}
          <VStack
      className={`item-center flex-1 justify-center gap-3 rounded-xl bg-background-primary py-3 ${false && "bg-primary-c"}`}
    >
      <Text className="text-center font-h3 text-2xl">{"📦"}</Text>
      <Text className="text-center font-h3">{"Sachet"}</Text>
    </VStack>
        </GridItem>
      </Grid>
    </AppetiteTestSession>
  );
};
interface AppetiteTestProductTypeCardProps extends IPressableProps {
  selected: boolean;
  icon: string;
  title: string;
}
const AppetiteTestProductTypeCard: React.FC<
  AppetiteTestProductTypeCardProps
> = ({ selected, title, icon, ...props }) => {
  return (
    <VStack
      className={`item-center flex-1 justify-center gap-3 rounded-xl bg-background-primary py-3 ${false && "bg-primary-c"}`}
    >
      <Text className="text-center font-h3 text-2xl">{icon}</Text>
      <Text className="text-center font-h3">{title}</Text>
    </VStack>
  );
};
