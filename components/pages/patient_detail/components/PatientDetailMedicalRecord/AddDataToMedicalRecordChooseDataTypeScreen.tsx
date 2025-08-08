import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import React from "react";
import { HStack } from "@/components/ui/hstack";
import { icons } from "lucide-react-native";
import { CardPressEffect, FadeInCardX } from "@/components/custom/motion";
import { Center } from "@/components/ui/center";
import { Icon } from "@/components/ui/icon";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";

const DATA = [
  {
    label: "Données Anthropométriques",
    ex: "Poids,taille,longueur,...",
    icon: "Ruler",
    tag: "anthropometric",
    iconColor: "text-blue-500",
    iconBgColor: "bg-blue-500/10",
  },
  {
    label: "Signes Cliniques",
    icon: "Stethoscope",
    tag: "clinical",
    iconColor: " text-purple-500",
    iconBgColor: " bg-purple-500/10",
  },
  {
    label: "Valeurs Biologiques",
    ex: "Glycémie, cholesterol,...",
    icon: "FlaskConical",
    tag: "biological",
    iconColor: "text-indigo-500",
    iconBgColor: "bg-indigo-500/10",
  },
  {
    label: "Complications",
    icon: "TriangleAlert",
    tag: "complication",
    iconColor: "text-orange-500",
    iconBgColor: "bg-orange-500/10",
  },
] as const;
export interface AddDataToMedicalRecordChooseDataTypeScreenProps {}

export const AddDataToMedicalRecordChooseDataTypeScreen: React.FC<
  AddDataToMedicalRecordChooseDataTypeScreenProps
> = ({}) => {
  const { navigate } = useNavigation();
  return (
    <BottomSheetScrollView
      showsVerticalScrollIndicator={false}
      className={"bg-background-primary"}
      contentContainerClassName={"bg-background-primary"}
    >
      <VStack className="px-2 py-v-4">
        <VStack className="px-2 py-v-1">
          <Heading className="font-h4 text-lg font-medium text-typography-primary">
            Ajouter des données
          </Heading>
          <Text className="font-body text-xs text-typography-primary_light">
            Sélectionnez le type de mesure à ajouter
          </Text>
        </VStack>
        <VStack className="gap-3 pb-v-8 pt-v-4">
          {DATA.map((item, index) => (
            <FadeInCardX delayNumber={index + 1} key={item.tag}>
              <DataTypeItemComponent
                label={item.label}
                icon={item.icon as keyof typeof icons}
                ex={(item as any)?.ex}
                iconBgColor={item.iconBgColor}
                iconColor={item.iconColor}
                onPress={() => {
                  navigate({
                    name: "data_type_display",
                    params: { tag: item.tag },
                  } as never);
                }}
              />
            </FadeInCardX>
          ))}
        </VStack>
      </VStack>
    </BottomSheetScrollView>
  );
};

interface DataTypeItemComponentProps {
  icon: keyof typeof icons;
  label: string;
  ex?: string;
  iconColor: string;
  iconBgColor: string;
  onPress?: () => void;
}

function DataTypeItemComponent({
  icon,
  label,

  ex,
  iconBgColor,
  iconColor,
  onPress = () => {},
}: DataTypeItemComponentProps) {
  return (
    <CardPressEffect onPress={onPress}>
      <HStack className="gap-3 rounded-xl border-[0.5px] border-primary-border/5 bg-background-secondary px-2 py-v-3">
        <Center className={`${iconBgColor} rounded-lg p-2`}>
          <Icon as={icons[icon]} className={`h-5 w-5 ${iconColor}`} />
        </Center>
        <VStack className="justify-center">
          <Text
            className={"font-h4 text-sm font-medium text-typography-primary"}
          >
            {label}
          </Text>
          {ex && (
            <Text className="font-light text-xs text-typography-primary_light">
              {ex}
            </Text>
          )}
        </VStack>
      </HStack>
    </CardPressEffect>
  );
}
