import { MotiView } from "moti";
import { PropsWithChildren } from "react";
export interface FadeInCardProps extends PropsWithChildren {
  delayNumber?: number;
}
export function FadeInCardY({
  children = 0,
  delayNumber = 1,
}: FadeInCardProps) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        type: "timing",
        duration: 600,
        delay: delayNumber * 100,
      }}
    >
      {children}
    </MotiView>
  );
}
