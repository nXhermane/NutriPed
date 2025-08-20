import React, { PropsWithChildren } from "react";
<<<<<<< HEAD
import { InitPatient } from "./InitPatient";
import { usePatientDetail } from "@/src/context/pages";
=======
import { usePatientDetail } from "../context";
import { InitPatient } from "./InitPatient";
>>>>>>> main

export const InitPatientRootSecure: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const {
    interaction: { isFirstVisitToPatientDetail },
  } = usePatientDetail();
  if (isFirstVisitToPatientDetail) return <InitPatient />;
  return <>{children}</>;
};
