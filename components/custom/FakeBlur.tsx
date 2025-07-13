import { useUI } from "@/src/context";
import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";
import React, { PropsWithChildren } from "react";

export interface FakeBlurProps
  extends PropsWithChildren,
    Partial<LinearGradientProps> {
  className?: string;
}

export const FakeBlur: React.FC<FakeBlurProps> = React.memo(
  ({ className, colors, ...props }) => {
    const { colorMode } = useUI();
    return (
      <LinearGradient
        className={className}
        colors={
          colorMode === "light"
            ? [
                "rgba(255,255,255,0.5)",
                "rgba(255,255,255,0.2)",
                "rgba(255,255,255,0.05)",
              ]
            : ["rgba(0,0,0,0.5)", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.05)"]
        }
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          backgroundColor:
            colorMode === "light" ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)",
        }}
        {...props}
      />
    );
  }
);
