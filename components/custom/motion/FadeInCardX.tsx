import { MotiView } from "moti";
import { PropsWithChildren } from "react";

interface FadeInCardProps extends PropsWithChildren {
  delayNumber?: number;
  opacityDisabled?: boolean;
}

export function FadeInCardX({
  children,
  delayNumber = 1,
  opacityDisabled = false,
}: FadeInCardProps) {
  return (
    <MotiView
      from={{ ...(!opacityDisabled && { opacity: 0 }), translateX: 20 }}
      animate={{ ...(!opacityDisabled && { opacity: 1 }), translateX: 0 }}
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
