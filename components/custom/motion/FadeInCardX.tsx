import { MotiView } from "moti";
import { PropsWithChildren } from "react";

interface FadeInCardProps extends PropsWithChildren {
  delayNumber?: number;
}

export function FadeInCardX({ children, delayNumber = 1 }: FadeInCardProps) {
  return (
    <MotiView
      from={{ opacity: 0, translateX: 20 }}
      animate={{ opacity: 1, translateX: 0 }}
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
