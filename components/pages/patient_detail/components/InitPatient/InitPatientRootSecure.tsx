import React, { PropsWithChildren } from "react";
import { usePatientDetail } from "../context";
import { InitPatient } from "./InitPatient";

export const InitPatientRootSecure: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const {
    interaction: { isFirstVisitToPatientDetail },
  } = usePatientDetail();
  if (isFirstVisitToPatientDetail) return <InitPatient />;
  return <>{children}</>;
};
