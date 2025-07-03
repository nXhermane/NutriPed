import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useGrowthTables } from "@/src/hooks";
import { useEffect } from "react";
import { ScrollView } from "react-native";
import colors from "tailwindcss/colors";
import { TableCard } from "./TableCard";
import { TABLE_UI_DATA } from "@/src/constants/ui";
import { GrowthRefChartAndTableCodes } from "@/core/constants";
import { FadeInCardY } from "@/components/custom/motion";
import { router } from "expo-router";
import { useToast } from "@/src/context";

export const TableListSession = () => {
  const toast = useToast();
  const { data, onLoading, error } = useGrowthTables();

  useEffect(() => {
    if (error)
      toast.show(
        "Error",
        "Erreur de chargement",
        "Erreur lors du chargement des courbes de croissance. Veillez reessayer"
      );
  }, [error]);
  if (onLoading)
    return (
      <Spinner size={"large"} className="mt-8" color={colors.blue["600"]} />
    );

  return (
    <VStack className="px-4 pt-4">
      <HStack className="">
        <Heading className="font-h3 text-xl font-semibold">
          Liste de tables de croissance
        </Heading>
      </HStack>
      <ScrollView contentContainerClassName="gap-4 pt-4">
        {data.map((table, index) => (
          <FadeInCardY key={table.code} delayNumber={index * 3}>
            <TableCard
              name={table.name}
              standard={table.standard}
              updatedAt={table.updatedAt}
              uiData={TABLE_UI_DATA[table.code as keyof typeof TABLE_UI_DATA]}
              onPress={() => {
                router.navigate({
                  pathname: "/(screens)/table_detail/[code]",
                  params: {
                    code: table.code,
                    indicatorCode:
                      TABLE_UI_DATA[table.code as keyof typeof TABLE_UI_DATA]
                        .indicator.tag,
                  },
                });
              }}
            />
          </FadeInCardY>
        ))}
      </ScrollView>
    </VStack>
  );
};
