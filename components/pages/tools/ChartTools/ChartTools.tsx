import { VStack } from "@/components/ui/vstack";
import React, { useState } from "react";
import { ChartToolsTopSession } from "./ChartToolsTopSession";
import { ChartListSession } from "./ChartListSession";

export function ChartTools() {
  const [searchOptions, setSearchOptions] = useState<{
    searchText: string;
    filterTag: string;
  }>({
    searchText: "",
    filterTag: "all",
  });
  return (
    <React.Fragment>
      <ChartToolsTopSession onChange={value => setSearchOptions(value)} />
      <VStack className="flex-1 gap-v-4 bg-background-primary ">
        <ChartListSession searchOptions={searchOptions} />
      </VStack>
     
    </React.Fragment>
  );
}
