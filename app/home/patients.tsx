import {
  PatientListSession,
  PatientSeachBar,
  PatientStatSession,
  QuickFilterSession,
} from "@/components/pages/patient";
import { PageBody, TabHeader } from "@/components/pages/shared";
import { Box } from "@/components/ui/box";
import { Fab, FabIcon } from "@/components/ui/fab";
import { Plus } from "lucide-react-native";
import React from "react";

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
      <Fab
        placement="bottom right"
        className="bg-primary-c"
      >
        <FabIcon as={Plus} className="text-typography-primary h-6 w-6" />
      </Fab>
    </Box>
  );
}
