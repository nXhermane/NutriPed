import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { TOOLS_DATA } from "@/src/constants/ui";
import { FlatList } from "react-native";
import { SessionEmpty } from "../home/shared/SessionEmpty";
import { ToolCard } from "./ToolCard";
import { icons } from "lucide-react-native";
import { Box } from "@/components/ui/box";
import { router } from "expo-router";

export const ToolList = () => {
  return (
    <VStack className="mt-4 flex-1 gap-4 px-4">
      <Heading className="font-h2 text-xl text-typography-primary font-semibold">
        Tous les Outils
      </Heading>
      <FlatList
        className="pt-4"
        initialNumToRender={10}
        data={TOOLS_DATA}
        keyExtractor={(item, index) => item.code}
        renderItem={({ item }) => (
          <ToolCard
            name={item.name}
            desc={item.desc}
            iconName={item.iconName as keyof typeof icons}
            onPress={() => {
              router.navigate({
                pathname: "/(screens)/tools/[tool]",
                params: {
                  tool: item.code,
                },
              });
            }}
          />
        )}
        ListEmptyComponent={() => (
          <SessionEmpty
            message={"Aucun patient pour le moment."}
            iconName={"SearchSlash"}
          />
        )}
        ItemSeparatorComponent={() => <Box className={"h-v-3"} />}
        showsVerticalScrollIndicator={false}
      />
    </VStack>
  );
};
