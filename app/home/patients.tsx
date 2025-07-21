import { FadeInCardY } from "@/components/custom/motion";
import {
  PatientListSession,
  PatientSeachBar,
  PatientStatSession,
  QuickFilterSession,
} from "@/components/pages/patient";
import { PageBody, TabHeader } from "@/components/pages/shared";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { PATIENT_QUICK_FILTER_TAG } from "@/src/constants/ui";
import React, { useState } from "react";

export default function Patients() {
  const [searchText, setSearchText] = useState("");
  const [filterTag, setFilterTag] = useState<PATIENT_QUICK_FILTER_TAG>(
    PATIENT_QUICK_FILTER_TAG.ALL
  );
  return (
    <VStack className={"flex-1 bg-background-primary"}>
      <TabHeader name={"Mes Patients"} />
      <VStack className="gap-v-4 pt-4">
        <VStack className="px-4">
          <FadeInCardY delayNumber={1}>
            <PatientSeachBar
              fieldProps={{
                value: searchText,
                onChangeText: setSearchText,
              }}
            />
          </FadeInCardY>
        </VStack>

        <VStack className="w-full pl-4">
          <FadeInCardY delayNumber={2}>
            <PatientStatSession />
          </FadeInCardY>
        </VStack>
        <VStack className="pl-4">
          <FadeInCardY delayNumber={3}>
            <QuickFilterSession onChange={setFilterTag} />
          </FadeInCardY>
        </VStack>
        <VStack className="max-h-[67%] flex-grow px-4">
          <FadeInCardY delayNumber={4}>
            <PatientListSession searchText={searchText} filterTag={filterTag} />
          </FadeInCardY>
        </VStack>
      </VStack>
    </VStack>
  );
}
