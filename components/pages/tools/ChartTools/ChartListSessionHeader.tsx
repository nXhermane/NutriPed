import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";

import { icons } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { IndicatorUIType } from "@/src/constants/ui";

export interface ChartListSessionHeaderProps {
  indicator: IndicatorUIType;
}
export const ChartListSessionHeader: React.FC<ChartListSessionHeaderProps> = ({
  indicator,
}) => {
  const LucideIcon = icons[indicator.icon];
  return (
    <HStack className="h-v-12 items-center justify-between">
      <HStack className="items-center gap-2">
        <Icon
          as={LucideIcon}
          className={`h-5 w-5 ${indicator.color} bg-transparent`}
        />
        <Heading
          className={"font-h3 text-lg font-semibold text-typography-primary"}
        >
          {indicator.label}
        </Heading>
      </HStack>
      <Text className="font-h4 text-sm font-medium text-typography-primary_light">
        {Object.keys(indicator.charts).length}
      </Text>
    </HStack>
  );
};
