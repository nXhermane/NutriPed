import { Center } from "@/components/ui/center";
import React, { useState } from "react";
import { InitPatientTrigger } from "./InitPatientTrigger";
import { InitPatientBottomSheet } from "./InitPatientBottomSheet";

export interface InitPatientProps {}

export const InitPatient: React.FunctionComponent<InitPatientProps> = ({}) => {
  const [showInitBottomSheet, setShowInitBottomSheet] =
    useState<boolean>(false);
  const [triggerResolver, setTriggerResolver] = useState<{
    resolve: () => void;
  }>();

  return (
    <Center className="flex-1 bg-background-primary">
      <InitPatientTrigger
        onTrigger={async () => {
          return new Promise<void>(resolve => {
            setShowInitBottomSheet(true);
            setTriggerResolver({ resolve });
          });
        }}
      />
      <InitPatientBottomSheet
        isVisible={showInitBottomSheet}
        onClose={() => {
          triggerResolver?.resolve();
          setShowInitBottomSheet(false);
        }}
      />
    </Center>
  );
};
