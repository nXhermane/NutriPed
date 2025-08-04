import React, { PropsWithChildren } from "react";
import { InitPatient } from "./InitPatient";
import { usePatientDetail } from "@/src/context/pages";

export const InitPatientRootSecure: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const {
    interaction: { isFirstVisitToPatientDetail },
  } = usePatientDetail();
  if (isFirstVisitToPatientDetail) return <InitPatient />;
  return <>{children}</>;
};
