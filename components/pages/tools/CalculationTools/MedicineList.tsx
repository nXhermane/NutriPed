import {
  CardPressEffect,
  FadeInCardX,
  FadeInCardY,
} from "@/components/custom/motion";
import { Center } from "@/components/ui/center";
import { HStack } from "@/components/ui/hstack";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { MedicineCategory, MedicineDto } from "@/core/nutrition_care";
import { useToast } from "@/src/context";
import { useMedicines } from "@/src/hooks";
import React, { useEffect } from "react";
import colors from "tailwindcss/colors";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import { HumanDateFormatter } from "@/utils";
import { FlatList } from "react-native";

export interface MedicineListProps {
  onMedicineChoosed?: (medicine: MedicineDto) => void;
}

export const MedicineList: React.FC<MedicineListProps> = ({
  onMedicineChoosed,
}) => {
  const toast = useToast();
  const { data, error, onLoading } = useMedicines();

  useEffect(() => {
    if (error)
      toast.show(
        "Error",
        "Erreur technique",
        "Une erreur technique s'est produite veillez reesayer plutard."
      );
  }, [error]);
  if (onLoading)
    return (
      <Center className="flex-1 bg-background-primary">
        <Spinner size={"large"} color={colors.blue["600"]} />
      </Center>
    );

  return (
    <React.Fragment>
      <VStack className="bg-background-primary p-4">
        <FlatList
          contentContainerClassName="pb-8"
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews
          data={data}
          keyExtractor={item => item.code}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <FadeInCardY key={item.code} delayNumber={index * 0.75}>
              <FadeInCardX delayNumber={index * 1.5}>
                <MedicineItem
                  name={item.name}
                  code={item.code}
                  updatedAt={item.updatedAt}
                  category={item.category}
                  onPress={() => {
                    onMedicineChoosed && onMedicineChoosed(item);
                  }}
                />
              </FadeInCardX>
            </FadeInCardY>
          )}
        />
      </VStack>
    </React.Fragment>
  );
};

export interface MedicineItemProps {
  name: string;
  code: string;
  updatedAt: string;
  category: MedicineCategory;
  onPress: () => void;
}
export const MedicineItem: React.FC<MedicineItemProps> = ({
  name,
  code,
  category,
  updatedAt,
  onPress,
}) => {
  const updateAtUIText = HumanDateFormatter.toRelativeDate(updatedAt);
  return (
    <CardPressEffect onPress={onPress}>
      <VStack className="mb-4 w-full rounded-xl border-[1px] border-primary-border/5 bg-background-secondary px-3 py-4">
        <HStack className="mb-2 items-center justify-between">
          <Text
            className="max-w-[75%] font-h4 text-lg font-medium text-typography-primary"
            numberOfLines={1}
          >
            {name}
          </Text>
          <Badge className="rounded-full bg-background-primary">
            <BadgeText
              className="max-w-14 font-body text-typography-primary"
              numberOfLines={1}
            >
              {code.toUpperCase()}
            </BadgeText>
          </Badge>
        </HStack>
        <Divider className="mb-2 h-[1px]" />
        <HStack className="justify-between">
          <Text
            className={"font-body text-2xs font-normal text-primary-border/50"}
          >
            Mise à jour: {updateAtUIText}
          </Text>
          <Text className="font-body text-2xs font-normal text-primary-border/50">
            {"Catégorie: "}
            {category}
          </Text>
        </HStack>
      </VStack>
    </CardPressEffect>
  );
};
