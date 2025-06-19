import { ToolList, ToolsScreenHeader } from "@/components/pages/tools";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";

const ToolsScreen = () => {
  return (
    <Box className={"flex-1 bg-background-primary"}>
      <ToolsScreenHeader />
      <ToolList />
    </Box>
  );
};
export default ToolsScreen;
