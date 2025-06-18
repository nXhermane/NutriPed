import {
  LastPatientList,
  LastPatientScreenHeader,
  LastPatientSearchInput,
} from "@/components/pages/last_patient";
import { Box } from "@/components/ui/box";
import { useState } from "react";

const LastPatientScreen = () => {
  const [searchText, setSearchText] = useState("");
  return (
    <Box className={"flex-1 bg-background-primary"}>
      <LastPatientScreenHeader />
      <LastPatientSearchInput
        fieldProps={{
          value: searchText,
          onChangeText: setSearchText,
        }}
      />
      <LastPatientList searchText={searchText} />
    </Box>
  );
};

export default LastPatientScreen;
