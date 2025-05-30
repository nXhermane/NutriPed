import { IPressableProps, Pressable } from "@/components/ui/pressable";
import { MotiView } from "moti";
import React, { useState } from "react";

export interface CardPressEffectProps extends IPressableProps {
  scaled?: boolean;
  translate?: "x" | "y";
}

export const CardPressEffect: React.FC<CardPressEffectProps> = ({
  scaled = false,
  translate = "y",
  children,
  onPressIn,
  onPressOut,
  ...props
}) => {
  const [pressed, setPressed] = useState<boolean>(false);

  return (
    <MotiView
      from={{
        ...(scaled && {
          scale: 1,
        }),
        ...(translate === "x" && { translateX: 0 }),
        ...(translate === "y" && { translateY: 0 }),
      }}
      animate={{
        ...(scaled && { scale: pressed ? 1.1 : 1 }),
        ...(translate === "x" && { translateX: pressed ? 5 : 0 }),
        ...(translate === "y" && { translateY: pressed ? -4 : 0 }),
      }}
      transition={{
        type: "timing",
        delay: 300,
      }}
    >
      <Pressable
        onPressIn={e => {
          setPressed(true);
          onPressIn && onPressIn(e);
        }}
        onPressOut={e => {
          setPressed(false);
          onPressOut && onPressOut(e);
        }}
        {...props}
      >
        {e => {
          return typeof children === "function" ? children(e) : children;
        }}
      </Pressable>
    </MotiView>
  );
};
