import { HStack } from "@/components/ui/hstack";
import { SearchBar, SearchBarProps } from "../shared";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Search } from "lucide-react-native";
import { Box } from "@/components/ui/box";

export interface LastPatientSearchInputProps extends SearchBarProps {}
export const LastPatientSearchInput: React.FC<LastPatientSearchInputProps> = ({
  fieldProps,
}) => {
  return (
    <HStack
      className={
        "mb-4 h-v-16 gap-1 border-t-[1px] border-primary-border/5 bg-background-secondary px-4 pt-4"
      }
    >
      <Box className="w-[100%]">
        <SearchBar
          fieldProps={{
            placeholder: "Rechercher un patient...",
            ...fieldProps,
          }}
        />
      </Box>

      {/* <Button onPress={() => onSubmit()} className={"rounded-lg bg-primary-c"}>
        <ButtonIcon as={Search} className="text-typography-primary" />
      </Button> */}
    </HStack>
  );
};
