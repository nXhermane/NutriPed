import { Divider } from "@/components/ui/divider";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { AnthroSystemCodes } from "@/core/constants";
import { ChartMeasurement } from "@/src/store";
import { Trash } from "lucide-react-native";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

export interface MeasurementItemProps {
  data: ChartMeasurement["data"];
  id: string;
  neededMeasureCodes: AnthroSystemCodes[];
  onDeleteMeasureAction?: () => void;
}
export const MeasurementItem: React.FunctionComponent<MeasurementItemProps> = ({
  id,
  data,
  neededMeasureCodes,
  onDeleteMeasureAction,
}) => {
  function MeasurementItemRightAction(
    prog: SharedValue<number>,
    drag: SharedValue<number>
  ) {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        justifyContent: "center",
        width: 45,
        transform: [{ translateX: drag.value + 50 }],
      };
    });
    return (
      <Reanimated.View style={styleAnimation}>
        <HStack className="-mb-1 h-[80%] items-center">
          <Pressable
            className="rounded-full bg-red-500"
            onPress={onDeleteMeasureAction && onDeleteMeasureAction}
          >
            <Icon as={Trash} className="m-2 text-typography-primary" />
          </Pressable>
        </HStack>
      </Reanimated.View>
    );
  }

  return (
    <Swipeable
      friction={2}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
      renderRightActions={MeasurementItemRightAction}
    >
      <HStack className="mt-2 h-10 items-center gap-1 rounded-xl bg-background-secondary px-2">
        {neededMeasureCodes
          .filter(
            code =>
              ![
                AnthroSystemCodes.AGE_IN_DAY,
                AnthroSystemCodes.AGE_IN_MONTH,
              ].includes(code)
          )
          .map(code => {
            const value = data[code];
            if (!value) return null;
            return (
              <Text
                key={code}
                className="font-h4 text-sm font-normal text-typography-primary"
              >
                {value.value} {value.unit}
              </Text>
            );
          })}
        <Divider className="h-1 w-1 rounded-full bg-primary-border/50" />
        <Text className="font-body text-sm font-normal text-typography-primary">
          {data[AnthroSystemCodes.AGE_IN_MONTH] &&
          data[AnthroSystemCodes.AGE_IN_MONTH] >= 1
            ? `${data[AnthroSystemCodes.AGE_IN_MONTH]} mois`
            : `${data[AnthroSystemCodes.AGE_IN_DAY]} jours`}
        </Text>
      </HStack>
    </Swipeable>
  );
};
