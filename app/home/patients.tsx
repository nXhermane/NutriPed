import {
  PatientListSession,
  PatientSeachBar,
  PatientStatSession,
  QuickFilterSession,
} from "@/components/pages/patient";
import { PageBody, TabHeader } from "@/components/pages/shared";
import { Box } from "@/components/ui/box";
import React, { useState } from "react";

export default function Patients() {
  return (
    <Box className={"flex-1 bg-background-primary"}>
      <TabHeader name={"Mes Patients"} desc={"Gestion et suivi nutritionnel"} />
      <PageBody>
        <PatientSeachBar />
        <PatientStatSession />
        <QuickFilterSession />
        <PatientListSession useMoked />
      </PageBody>
    
    </Box>
  );
}
