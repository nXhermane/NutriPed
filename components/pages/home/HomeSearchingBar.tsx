import React from "react";
import { SearchBar } from "../shared";

export function HomeSearchingBar() {
  return (
    <SearchBar
      fieldProps={{
        placeholder: "Rechercher un patient ou un outil...",
        onPress: () =>
          console.warn("Navigate to searching session is not implemented"),
      }}
    />
  );
}
