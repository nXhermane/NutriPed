import { Box } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Search } from "lucide-react-native";
import React, {  } from "react";

export function HomeSearchingBar() {
  return (
    <Box>
      <Input
        className={`rounded-xl border-typography-primary_light/60 bg-background-secondary data-[focus=true]:border-primary-c`}
      >
        <InputSlot className={"pl-3"}>
          <InputIcon
            as={() => (
              <Icon
                as={Search}
                className={"h-5 w-5 text-typography-primary_light/60"}
              />
            )}
          />
        </InputSlot>
        <InputField
          onPress={() =>
            console.warn("Navigate to searching session is not implemented")
          }
          placeholder={"Rechercher un patient ou un outil..."}
          className={"text-base"}
          placeholderClassName={"text-typography-primary_light/60 "}
        />
      </Input>
    </Box>
  );
}
