import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { IndicatorUIType } from "@/src/hooks";
import { icons } from "lucide-react-native";
import { Text } from "@/components/ui/text";

export interface ChartCardBadgeProps {
  icon: keyof typeof icons;
  label: string;
  color: IndicatorUIType["color"];
}
export const ChartCardBadge: React.FC<ChartCardBadgeProps> = ({
  icon,
  label,
  color,
}) => {
  const LucideIcon = icons[icon];
  return (
    <HStack className={`gap-1 px-2 ${color} items-center rounded-xl`}>
      <Icon as={LucideIcon} className={`h-2 w-2 ${color}`} />
      <Text className={`${color} font-body text-2xs`}>{label}</Text>
    </HStack>
  );
};
