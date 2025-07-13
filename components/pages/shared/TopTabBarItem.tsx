import { FakeBlur } from "@/components/custom";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { useUI } from "@/src/context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { TabBarItemProps } from "react-native-tab-view";

export function TabBarItem(props: TabBarItemProps<any>) {
  const [isPressed, setIsPressed] = React.useState<boolean>(false);
  const [isActive, setIsActive] = React.useState<boolean>(false);
  const { colorMode } = useUI();

  React.useEffect(() => {
    setIsActive(
      props.navigationState.routes[props.navigationState.index] === props.route
    );
  }, [props.navigationState, props.route]);
  return (
    <Pressable
      onLayout={props.onLayout}
      onPress={props.onPress}
      onLongPress={props.onLongPress}
      android_ripple={props.android_ripple}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      className="bg-background-secondary"
    >
      <HStack
        style={{
          width: props.defaultTabWidth,
        }}
        className={`h-v-8 items-center justify-center ${isActive ? "bg-primary-c_light/5" : "bg-background-secondary"}`}
      >
        <Text
          className={`font-h4 text-xs font-medium ${isActive ? "text-primary-c_light" : "text-typography-primary_light"}`}
        >
          {props.route.title}
        </Text>
        {/* <FakeBlur className="absolute bottom-0 h-v-1 w-full" /> */}
        {/* <BlurView
          className="absolute bottom-0 h-v-1 w-[100%]"
          experimentalBlurMethod="dimezisBlurView"
          tint={colorMode}
        /> */}
      </HStack>
    </Pressable>
  );
}
