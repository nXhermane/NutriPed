import { FadeInCardY } from "@/components/custom/motion";
import {
  PatientListSession,
  PatientSeachBar,
  PatientStatSession,
  QuickFilterSession,
} from "@/components/pages/patient";
import { PageBody, TabHeader } from "@/components/pages/shared";
import { Box } from "@/components/ui/box";
import { PATIENT_QUICK_FILTER_TAG } from "@/src/constants/ui";
import React, { useState } from "react";

export default function Patients() {
  const [searchText, setSearchText] = useState("");
  const [filterTag, setFilterTag] = useState<PATIENT_QUICK_FILTER_TAG>(
    PATIENT_QUICK_FILTER_TAG.ALL
  );
  return (
    <Box className={"flex-1 bg-background-primary"}>
      <TabHeader name={"Mes Patients"} desc={"Gestion et suivi nutritionnel"} />
      <PageBody>
        <FadeInCardY delayNumber={1}>
          <PatientSeachBar
            fieldProps={{
              value: searchText,
              onChangeText: setSearchText,
            }}
          />
        </FadeInCardY>

        <FadeInCardY delayNumber={2}>
          <PatientStatSession />
        </FadeInCardY>
        <FadeInCardY delayNumber={4}>
          <QuickFilterSession onChange={setFilterTag} />
        </FadeInCardY>
        <FadeInCardY delayNumber={5}>
          <PatientListSession searchText={searchText} filterTag={filterTag} />
        </FadeInCardY>
      </PageBody>
    </Box>
  );
}
