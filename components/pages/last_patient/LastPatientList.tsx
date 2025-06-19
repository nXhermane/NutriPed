import { useLastPatientList } from "@/src/hooks";
import { FlatList } from "react-native";
import { PatientCard } from "../commun";
import { router } from "expo-router";
import { SessionEmpty } from "../home/shared/SessionEmpty";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import React from "react";
import Fuse from "fuse.js";
import { Box } from "@/components/ui/box";
export interface LastPatientListProps {
  searchText?: string;
}
export const LastPatientList: React.FC<LastPatientListProps> = ({
  searchText,
}) => {
  const patientList = useLastPatientList();

  const fuse = new Fuse(patientList, {
    keys: ["name"],
    threshold: 0.3, // ajustable : plus bas = plus strict
    ignoreLocation: true, // ne tient pas compte de la position du texte
    includeScore: true,
  });

  const filteredList = searchText
    ? fuse.search(searchText).map(result => result.item)
    : patientList;
  return (
    <VStack className="flex-1 gap-4 px-4">
      <Heading className="font-h2 text-xl text-typography-primary">
        Derniers patients
      </Heading>
      <FlatList
        initialNumToRender={10}
        data={filteredList}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <PatientCard
            name={item.name}
            birthday={item.birthday}
            createdAt={item.createdAt}
            status={item.status}
            scaled
            onPress={() => {
              if (!item.id) return;
              router.navigate({
                pathname: "/(screens)/patient_detail/[id]",
                params: { id: item.id as string },
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
        ItemSeparatorComponent={() => <Box className={"h-v-3"}/>}
        showsVerticalScrollIndicator={false}
      />
    </VStack>
  );
};
