import { MotiView } from "moti";
import { PropsWithChildren, useEffect, useState } from "react";

export interface FadeInCardProps extends PropsWithChildren {
  delayNumber?: number;
  trigger?: number;
}

export function FadeInCardY({
  children,
  delayNumber = 1,
  trigger = 0,
}: FadeInCardProps) {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [trigger]);

  return (
    <MotiView
      key={animationKey}
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
